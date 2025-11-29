import { apply, save, withdraw } from "@/actions/student";
import { Button } from "@/components/ui/button";
import Hr from "@/components/ui/hr";
import { query } from "@/lib/api";
import { useStudentStore } from "@/lib/store";
import { Opportunity } from "@/types";
import { cn } from "@/utils/tailwind";
import { useQueryClient } from "@tanstack/react-query";
import { useAction } from "next-safe-action/hooks";
import Image from "next/image";
import { todo } from "node:test";
import { toast } from "react-toastify";

// todo: improve application status handling
// If you want to simplify frontend logic even further, your backend can include a field like:
// const hasApplied = applications.some(
//   (app) => app.student.id === currentStudentId
// );
// const hasWithdrawn = applications.some(
//   (app) => app.student.id === currentStudentId && app.status === "withdrawn"
// );

export default function OpportunityDetails({
  selectedId,
  setSelectedId,
  mobileView,
  selectedOpportunity,
}: {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  mobileView: "centered" | "left" | "right";
  selectedOpportunity: Opportunity | null;
}) {
  const currentStudentId = useStudentStore((state) => state.student?.id);
  console.log("currentStudentId", currentStudentId);

  const app = selectedOpportunity?.applications?.find(
    (a) => a.student.id === currentStudentId
  );

  console.log("app", app);
  const applicationId = app?.id;
  const appStatus = app?.status;

  const queryClient = useQueryClient();

  const {
    execute: applyAction,
    isExecuting,
    hasErrored,
    result,
  } = useAction(apply, {
    onSuccess(data) {
      toast.success(data?.data?.message || "Applied successfully!");
      console.log("applyResult", data);
      queryClient.invalidateQueries({ queryKey: ["opportunities"] });
    },
    onError(error) {
      console.error(error);
      toast.error(
        error?.error?.serverError || "Failed to apply. Please try again."
      );
    },
  });

  const { execute: saveAction, result: saveResult } = useAction(save, {
    onSuccess(data) {
      // toast.success(data.message);
      console.log("saveResult", data);
    },
    onError(error) {
      console.error(error);
      toast.error(
        error?.error?.serverError || "Failed to save job. Please try again."
      );
    },
  });

  const { execute: withdrawAction, isExecuting: isWithdrawing } = useAction(
    withdraw,
    {
      onSuccess(data) {
        toast.success(data?.data?.message || "Withdrawn successfully!");
        console.log("withdrawResult", data);
        queryClient.invalidateQueries({ queryKey: ["opportunities"] });
      },
      onError(error) {
        console.error(error);
        toast.error(
          error?.error?.serverError || "Failed to withdraw. Please try again."
        );
      },
    }
  );

  const handleApply = () => applyAction({ id: selectedId! });
  const handleWithdraw = () => {
    withdrawAction({ id: applicationId! });
  }; // Implement withdraw logic if needed
  const handleSave = () => saveAction({ id: selectedId! });

  console.log("status", appStatus);

  let actionButton = null;

  if (!app) {
    actionButton = (
      <Button
        onClick={handleApply}
        size="default"
        className="w-full text-white"
        disabled={isExecuting}
      >
        {isExecuting ? "Applying..." : "Apply Now"}
      </Button>
    );
  } else if (appStatus === "withdrawn") {
    actionButton = (
      <Button
        size="default"
        className="w-full bg-gray-200 text-gray-500 cursor-not-allowed"
        disabled
      >
        Withdrawn
      </Button>
      // or if you want to allow reapply:
      // <Button onClick={handleApply} className="w-full">Reapply</Button>
    );
  } else {
    actionButton = (
      <Button
        onClick={handleWithdraw}
        size="default"
        className="w-full text-white"
        variant="destructive"
        disabled={isWithdrawing}
      >
        {isWithdrawing ? "Withdrawing..." : "Withdraw"}
      </Button>
    );
  }

  if (!selectedId) return null;

  return (
    <div className="space-y-3 ">
      <div
        className={cn(
          "flex flex-col rounded-lg bg-white shadow-sm transition-all overflow-hidden",
          selectedId
            ? cn(
                // MOBILE: show only when in "right" view
                "md:hidden",
                mobileView === "right" && "flex"
              )
            : "hidden",
          // TABLET & BELOW (≤md): overlay style
          selectedId &&
            "md:absolute md:mx-2 md:inset-0 md:z-20 md:flex md:p-2 lg:relative lg:z-auto lg:w-[320px]",
          // DESKTOP (≥lg): side panel layout
          selectedId && "lg:flex"
        )}
      >
        <div className="flex flex-col gap-5 p-4">
          {/* Header */}
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Company Logo"
              width={40}
              height={40}
              className="w-10 h-10 rounded-md border border-gray-200"
            />
            <div>
              <p className="font-semibold text-gray-800">
                {selectedOpportunity?.title ?? "Opportunity Title"} -{" "}
                <span className="text-sm text-gray-500">
                  {" "}
                  {selectedId ?? "ID"}{" "}
                </span>
              </p>
              <p className="text-sm text-gray-500">
                {" "}
                {selectedOpportunity?.company?.name ?? "Company name"}
              </p>
            </div>
          </div>

          {/* Applicants */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-light text-gray-800">
            {selectedOpportunity?.totalApplications ?? 0} Applicant
            {selectedOpportunity && selectedOpportunity.totalApplications !== 1
              ? "s"
              : ""}
          </div>

          {/* Job Details */}
          <div className="space-y-3 text-sm text-gray-700 border border-gray-100 bg-gray-50 rounded-lg p-3">
            <div className="space-y-1">
              <p>
                <span className="font-semibold text-gray-800">Duration:</span>{" "}
                {selectedOpportunity?.duration ?? 0}
                {/* months */}
              </p>
              <p>
                <span className="font-semibold text-gray-800">Industry:</span>{" "}
                {selectedOpportunity?.company?.industry ?? "N/A"}
              </p>
              <p>
                <span className="font-semibold text-gray-800">
                  Date Posted:
                </span>{" "}
                {selectedOpportunity?.createdAt ?? "N/A"}
              </p>
            </div>

            <Hr />

            <div className="space-y-2">
              <h2 className="font-semibold text-gray-800">Description</h2>
              <p className="text-gray-600 leading-relaxed">
                {selectedOpportunity?.description ?? "No description provided."}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 mt-2">
            {actionButton}
            {/* {selectedOpportunity?.hasApplied ? (
              <Button
                onClick={handleWithdraw}
                size="default"
                className="w-full text-white"
                variant={"destructive"}
                disabled={isWithdrawing}
              >
                {isWithdrawing ? "Withdrawing..." : "Withdraw"}
              </Button>
            ) : (
              <Button
                onClick={handleApply}
                size="default"
                className="w-full text-white"
                disabled={isExecuting}
              >
                {isExecuting ? "Applying..." : "Apply Now"}
              </Button>
            )} */}
            {/* <Button
              onClick={handleApply}
              size="default"
              className="w-full text-white"
              disabled={isExecuting}
            >
              {isExecuting ? "Applying..." : "Apply Now"}
            </Button> */}
            <Button
              variant="ghost"
              onClick={() => setSelectedId(null)}
              className="w-full"
            >
              Deselect
            </Button>
          </div>
        </div>
      </div>

      {/* Save Job */}
      {/* Save Job */}
      <div className="flex justify-center">
        <Button
          onClick={handleSave}
          variant="ghost"
          className="text-primary border border-primary/30 rounded-2xl font-medium shadow-sm w-auto"
        >
          Save Job
        </Button>
      </div>
    </div>
  );
}

// import React, { useState } from "react";
// import {
//   Building2,
//   MapPin,
//   Calendar,
//   Clock,
//   Users,
//   Briefcase,
//   X,
//   Bookmark,
//   BookmarkCheck,
//   CheckCircle2,
//   AlertCircle,
//   ExternalLink,
//   TrendingUp,
// } from "lucide-react";

// // Mock data for demonstration
// const mockOpportunity = {
//   id: "OP-2025-001",
//   title: "Software Engineering Intern",
//   company: {
//     name: "TechBridge Innovations",
//     industry: "Software Engineering & Digital Solutions",
//     logo: null,
//   },
//   location: "Lekki Phase 1, Lagos, Nigeria",
//   duration: "4 months",
//   totalApplications: 127,
//   description:
//     "Join our dynamic team as a Software Engineering Intern. You'll work on real-world projects, collaborate with experienced engineers, and gain hands-on experience with modern technologies including React, Node.js, and cloud infrastructure. This is an excellent opportunity to kickstart your career in tech.",
//   requirements: [
//     "Pursuing a degree in Computer Science or related field",
//     "Basic knowledge of JavaScript and React",
//     "Strong problem-solving skills",
//     "Good communication abilities",
//   ],
//   benefits: [
//     "Monthly stipend",
//     "Mentorship program",
//     "Certificate of completion",
//     "Potential for full-time employment",
//   ],
//   startDate: "2025-05-12",
//   applicationDeadline: "2025-04-15",
//   createdAt: "2025-03-01",
//   status: "open",
//   responsibilities: [
//     "Develop and maintain web applications",
//     "Participate in code reviews",
//     "Collaborate with cross-functional teams",
//     "Learn and apply best practices",
//   ],
// };

// const OpportunityDetails = ({
//   selectedId = "OP-2025-001",
//   setSelectedId = () => {},
//   mobileView = "right",
//   selectedOpportunity = mockOpportunity,
//   currentStudentId = "student-123",
//   app = null, // { id: "app-1", status: "pending" } or null
//   onApply = () => console.log("Apply clicked"),
//   onWithdraw = () => console.log("Withdraw clicked"),
//   onSave = () => console.log("Save clicked"),
//   isExecuting = false,
//   isWithdrawing = false,
//   isSaved = false,
// }) => {
//   const [localSaved, setLocalSaved] = useState(isSaved);

//   if (!selectedId) return null;

//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     const date = new Date(dateString);
//     return date.toLocaleDateString("en-US", {
//       month: "short",
//       day: "numeric",
//       year: "numeric",
//     });
//   };

//   const getStatusConfig = (status) => {
//     const configs = {
//       pending: {
//         bg: "bg-blue-50",
//         text: "text-blue-700",
//         border: "border-blue-200",
//         icon: <Clock size={16} />,
//         label: "Application Pending",
//       },
//       accepted: {
//         bg: "bg-green-50",
//         text: "text-green-700",
//         border: "border-green-200",
//         icon: <CheckCircle2 size={16} />,
//         label: "Application Accepted",
//       },
//       rejected: {
//         bg: "bg-red-50",
//         text: "text-red-700",
//         border: "border-red-200",
//         icon: <AlertCircle size={16} />,
//         label: "Application Rejected",
//       },
//       withdrawn: {
//         bg: "bg-gray-50",
//         text: "text-gray-700",
//         border: "border-gray-200",
//         icon: <AlertCircle size={16} />,
//         label: "Application Withdrawn",
//       },
//     };
//     return configs[status] || null;
//   };

//   const appStatus = app?.status;
//   const statusConfig = appStatus ? getStatusConfig(appStatus) : null;

//   const handleSaveToggle = () => {
//     setLocalSaved(!localSaved);
//     onSave();
//   };

//   let actionButton = null;

//   if (!app) {
//     actionButton = (
//       <button
//         onClick={onApply}
//         disabled={isExecuting}
//         className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
//       >
//         {isExecuting ? (
//           <>
//             <Clock size={18} className="mr-2 animate-spin" />
//             Applying...
//           </>
//         ) : (
//           <>
//             <Briefcase size={18} className="mr-2" />
//             Apply Now
//           </>
//         )}
//       </button>
//     );
//   } else if (appStatus === "withdrawn") {
//     actionButton = (
//       <button
//         disabled
//         className="w-full flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-400 font-semibold rounded-lg cursor-not-allowed"
//       >
//         <AlertCircle size={18} className="mr-2" />
//         Application Withdrawn
//       </button>
//     );
//   } else if (appStatus === "accepted" || appStatus === "rejected") {
//     actionButton = (
//       <div
//         className={`w-full flex items-center justify-center px-6 py-3 rounded-lg border-2 ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border} font-semibold`}
//       >
//         {statusConfig.icon}
//         <span className="ml-2">{statusConfig.label}</span>
//       </div>
//     );
//   } else {
//     actionButton = (
//       <button
//         onClick={onWithdraw}
//         disabled={isWithdrawing}
//         className="w-full flex items-center justify-center px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
//       >
//         {isWithdrawing ? (
//           <>
//             <Clock size={18} className="mr-2 animate-spin" />
//             Withdrawing...
//           </>
//         ) : (
//           <>
//             <X size={18} className="mr-2" />
//             Withdraw Application
//           </>
//         )}
//       </button>
//     );
//   }

//   return (
//     <div className="h-full flex flex-col bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
//       {/* Header with gradient */}
//       <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5 relative">
//         <button
//           onClick={() => setSelectedId(null)}
//           className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
//         >
//           <X size={20} />
//         </button>

//         <div className="flex items-start gap-4 pr-12">
//           {/* Company Logo */}
//           <div className="flex items-center justify-center w-16 h-16 bg-white rounded-xl shadow-md flex-shrink-0">
//             {selectedOpportunity?.company?.logo ? (
//               <img
//                 src={selectedOpportunity.company.logo}
//                 alt={selectedOpportunity.company.name}
//                 className="w-full h-full object-cover rounded-xl"
//               />
//             ) : (
//               <Building2 size={28} className="text-blue-600" />
//             )}
//           </div>

//           <div className="flex-1 min-w-0">
//             <h2 className="text-xl font-bold text-white mb-1 truncate">
//               {selectedOpportunity?.title}
//             </h2>
//             <p className="text-blue-100 text-sm font-medium">
//               {selectedOpportunity?.company?.name}
//             </p>
//             <div className="flex items-center text-blue-100 text-sm mt-2">
//               <MapPin size={14} className="mr-1 flex-shrink-0" />
//               <span className="truncate">{selectedOpportunity?.location}</span>
//             </div>
//           </div>
//         </div>

//         {/* Application Status Badge */}
//         {statusConfig && (
//           <div
//             className={`mt-4 inline-flex items-center px-3 py-1.5 rounded-lg border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border} font-medium text-sm`}
//           >
//             {statusConfig.icon}
//             <span className="ml-2">{statusConfig.label}</span>
//           </div>
//         )}
//       </div>

//       {/* Scrollable Content */}
//       <div className="flex-1 overflow-y-auto">
//         <div className="p-6 space-y-6">
//           {/* Quick Stats */}
//           <div className="grid grid-cols-2 gap-4">
//             <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
//               <div className="flex items-center justify-between mb-2">
//                 <Users size={20} className="text-blue-600" />
//               </div>
//               <p className="text-2xl font-bold text-blue-900">
//                 {selectedOpportunity?.totalApplications || 0}
//               </p>
//               <p className="text-xs text-blue-700 font-medium mt-1">
//                 Applicants
//               </p>
//             </div>

//             <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
//               <div className="flex items-center justify-between mb-2">
//                 <Clock size={20} className="text-purple-600" />
//               </div>
//               <p className="text-2xl font-bold text-purple-900">
//                 {selectedOpportunity?.duration || "N/A"}
//               </p>
//               <p className="text-xs text-purple-700 font-medium mt-1">
//                 Duration
//               </p>
//             </div>
//           </div>

//           {/* Key Information */}
//           <div className="space-y-3">
//             <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
//               Key Information
//             </h3>
//             <div className="space-y-3 bg-gray-50 rounded-lg p-4 border border-gray-200">
//               <InfoRow
//                 icon={<Building2 size={18} />}
//                 label="Industry"
//                 value={selectedOpportunity?.company?.industry || "N/A"}
//               />
//               <InfoRow
//                 icon={<Calendar size={18} />}
//                 label="Start Date"
//                 value={formatDate(selectedOpportunity?.startDate)}
//               />
//               <InfoRow
//                 icon={<TrendingUp size={18} />}
//                 label="Posted On"
//                 value={formatDate(selectedOpportunity?.createdAt)}
//               />
//               <InfoRow
//                 icon={<AlertCircle size={18} />}
//                 label="Deadline"
//                 value={formatDate(selectedOpportunity?.applicationDeadline)}
//               />
//             </div>
//           </div>

//           {/* Description */}
//           <div className="space-y-3">
//             <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
//               About This Opportunity
//             </h3>
//             <div className="prose prose-sm max-w-none">
//               <p className="text-gray-700 leading-relaxed">
//                 {selectedOpportunity?.description || "No description provided."}
//               </p>
//             </div>
//           </div>

//           {/* Requirements */}
//           {selectedOpportunity?.requirements &&
//             selectedOpportunity.requirements.length > 0 && (
//               <div className="space-y-3">
//                 <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
//                   Requirements
//                 </h3>
//                 <ul className="space-y-2">
//                   {selectedOpportunity.requirements.map((req, index) => (
//                     <li
//                       key={index}
//                       className="flex items-start text-sm text-gray-700"
//                     >
//                       <CheckCircle2
//                         size={16}
//                         className="text-green-500 mr-2 mt-0.5 flex-shrink-0"
//                       />
//                       <span>{req}</span>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}

//           {/* Benefits */}
//           {selectedOpportunity?.benefits &&
//             selectedOpportunity.benefits.length > 0 && (
//               <div className="space-y-3">
//                 <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
//                   Benefits
//                 </h3>
//                 <ul className="space-y-2">
//                   {selectedOpportunity.benefits.map((benefit, index) => (
//                     <li
//                       key={index}
//                       className="flex items-start text-sm text-gray-700"
//                     >
//                       <CheckCircle2
//                         size={16}
//                         className="text-blue-500 mr-2 mt-0.5 flex-shrink-0"
//                       />
//                       <span>{benefit}</span>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}

//           {/* Opportunity ID */}
//           <div className="pt-4 border-t border-gray-200">
//             <p className="text-xs text-gray-500">
//               Opportunity ID:{" "}
//               <span className="font-mono font-semibold text-gray-700">
//                 {selectedId}
//               </span>
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Fixed Bottom Actions */}
//       <div className="border-t border-gray-200 bg-gray-50 p-6 space-y-3">
//         {actionButton}

//         <button
//           onClick={handleSaveToggle}
//           className={`w-full flex items-center justify-center px-6 py-3 font-semibold rounded-lg border-2 transition-all ${
//             localSaved
//               ? "bg-blue-50 border-blue-500 text-blue-700 hover:bg-blue-100"
//               : "bg-white border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-600"
//           }`}
//         >
//           {localSaved ? (
//             <>
//               <BookmarkCheck size={18} className="mr-2" />
//               Saved
//             </>
//           ) : (
//             <>
//               <Bookmark size={18} className="mr-2" />
//               Save for Later
//             </>
//           )}
//         </button>
//       </div>
//     </div>
//   );
// };

// // Helper component for info rows
// const InfoRow = ({ icon, label, value }) => {
//   return (
//     <div className="flex items-center justify-between text-sm">
//       <div className="flex items-center text-gray-600">
//         <span className="text-gray-400 mr-2">{icon}</span>
//         <span className="font-medium">{label}</span>
//       </div>
//       <span className="text-gray-900 font-semibold text-right">{value}</span>
//     </div>
//   );
// };

// export default OpportunityDetails;
