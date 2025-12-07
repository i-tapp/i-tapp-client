"use client";

import React, { useState } from "react";
import { Building2, User, Check } from "lucide-react";
import Link from "next/link";

const Logo = () => (
  <div className="flex items-center gap-3">
    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
      <span className="text-white font-bold text-xl">IH</span>
    </div>
    <span className="text-3xl font-bold bg-linear-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
      InternHub
    </span>
  </div>
);

const RoleSelection = () => {
  const [selectedRole, setSelectedRole] = useState("");
  const [isHovered, setIsHovered] = useState("");

  const handleContinue = () => {
    if (selectedRole === "student") {
      console.log("Navigate to /student/signup");
    } else if (selectedRole === "company") {
      console.log("Navigate to /company/signup");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-slate-100 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="px-8 py-8">
          <Link href="/" className="inline-block">
            <Logo />
          </Link>
        </div>

        {/* Main Section */}
        <div className="flex flex-col items-center justify-center px-6 py-16">
          <div className="max-w-5xl w-full space-y-12">
            {/* Hero Text */}
            <div className="text-center space-y-4">
              <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
                ✨ Get Started
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight">
                Choose Your Path
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Whether you&apos;re seeking opportunities or offering them,
                we&apos;ve got you covered
              </p>
            </div>

            {/* Role Cards */}
            <div className="grid md:grid-cols-2 gap-8 mt-16">
              {/* Student Card */}
              <div
                onClick={() => setSelectedRole("student")}
                onMouseEnter={() => setIsHovered("student")}
                onMouseLeave={() => setIsHovered("")}
                className={`relative p-10 rounded-3xl cursor-pointer transition-all duration-500 ${
                  selectedRole === "student"
                    ? "bg-white shadow-2xl ring-4 ring-blue-500 ring-offset-4 scale-105"
                    : "bg-white/80 backdrop-blur shadow-xl hover:shadow-2xl hover:scale-102"
                }`}
              >
                {/* Selection Badge */}
                {selectedRole === "student" && (
                  <div className="absolute -top-3 -right-3 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg animate-in zoom-in duration-300">
                    <Check className="w-7 h-7 text-white stroke-3" />
                  </div>
                )}

                <div className="space-y-6">
                  {/* Icon */}
                  <div
                    className={`inline-flex p-5 rounded-2xl transition-all duration-300 ${
                      selectedRole === "student" || isHovered === "student"
                        ? "bg-linear-to-br from-blue-500 to-blue-600 shadow-lg"
                        : "bg-linear-to-br from-gray-100 to-gray-200"
                    }`}
                  >
                    <User
                      className={`w-10 h-10 ${
                        selectedRole === "student" || isHovered === "student"
                          ? "text-white"
                          : "text-gray-600"
                      }`}
                    />
                  </div>

                  {/* Content */}
                  <div className="space-y-3">
                    <h2 className="text-3xl font-bold text-gray-900">
                      I&apos;m a Student
                    </h2>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      Discover amazing internship opportunities and launch your
                      tech career
                    </p>
                  </div>

                  {/* Features */}
                  <div className="pt-4 space-y-3">
                    {[
                      "Browse curated IT internships",
                      "Apply instantly to companies",
                      "Track your applications",
                      "Get hired faster",
                    ].map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${
                            selectedRole === "student"
                              ? "bg-blue-500"
                              : "bg-gray-400"
                          }`}
                        />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Company Card */}
              <div
                onClick={() => setSelectedRole("company")}
                onMouseEnter={() => setIsHovered("company")}
                onMouseLeave={() => setIsHovered("")}
                className={`relative p-10 rounded-3xl cursor-pointer transition-all duration-500 ${
                  selectedRole === "company"
                    ? "bg-white shadow-2xl ring-4 ring-purple-500 ring-offset-4 scale-105"
                    : "bg-white/80 backdrop-blur shadow-xl hover:shadow-2xl hover:scale-102"
                }`}
              >
                {/* Selection Badge */}
                {selectedRole === "company" && (
                  <div className="absolute -top-3 -right-3 w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center shadow-lg animate-in zoom-in duration-300">
                    <Check className="w-7 h-7 text-white stroke-3" />
                  </div>
                )}

                <div className="space-y-6">
                  {/* Icon */}
                  <div
                    className={`inline-flex p-5 rounded-2xl transition-all duration-300 ${
                      selectedRole === "company" || isHovered === "company"
                        ? "bg-linear-to-br from-purple-500 to-purple-600 shadow-lg"
                        : "bg-linear-to-br from-gray-100 to-gray-200"
                    }`}
                  >
                    <Building2
                      className={`w-10 h-10 ${
                        selectedRole === "company" || isHovered === "company"
                          ? "text-white"
                          : "text-gray-600"
                      }`}
                    />
                  </div>

                  {/* Content */}
                  <div className="space-y-3">
                    <h2 className="text-3xl font-bold text-gray-900">
                      I&apos;m a Company
                    </h2>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      Find talented interns and build your dream team
                      effortlessly
                    </p>
                  </div>

                  {/* Features */}
                  <div className="pt-4 space-y-3">
                    {[
                      "Post unlimited positions",
                      "Access qualified candidates",
                      "Manage applications easily",
                      "Hire top talent quickly",
                    ].map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${
                            selectedRole === "company"
                              ? "bg-purple-500"
                              : "bg-gray-400"
                          }`}
                        />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="flex flex-col items-center gap-6 pt-8">
              <button
                onClick={handleContinue}
                disabled={!selectedRole}
                className={`px-12 py-5 rounded-2xl text-lg font-bold transition-all duration-300 ${
                  selectedRole
                    ? selectedRole === "student"
                      ? "bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-xl hover:shadow-2xl hover:-translate-y-1"
                      : "bg-linear-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white shadow-xl hover:shadow-2xl hover:-translate-y-1"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                {selectedRole
                  ? `Create ${
                      selectedRole === "student" ? "Student" : "Company"
                    } Account →`
                  : "Select a role to continue"}
              </button>

              <p className="text-gray-600 text-lg">
                Already have an account?{" "}
                <a
                  href="/signin"
                  className="text-blue-600 hover:text-blue-700 font-semibold underline-offset-4 hover:underline transition-all"
                >
                  Sign In
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;

// "use client";

// import React, { useState } from "react";
// import { Briefcase, GraduationCap, ArrowRight, Sparkles } from "lucide-react";

// const Logo = () => (
//   <div className="flex items-center gap-2">
//     <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-400 rounded-lg flex items-center justify-center">
//       <Sparkles className="w-6 h-6 text-white" />
//     </div>
//     <span className="text-2xl font-bold text-gray-800">InternHub</span>
//   </div>
// );

// const RoleCard = ({
//   role,
//   icon: Icon,
//   title,
//   description,
//   features,
//   isSelected,
//   onSelect,
// }) => (
//   <div
//     onClick={() => onSelect(role)}
//     className={`relative group cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${
//       isSelected ? "scale-[1.02]" : ""
//     }`}
//   >
//     <div
//       className={`relative p-8 rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
//         isSelected
//           ? "border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 shadow-xl"
//           : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-lg"
//       }`}
//     >
//       {/* Selection indicator */}
//       {isSelected && (
//         <div className="absolute top-4 right-4">
//           <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center animate-in zoom-in duration-200">
//             <svg
//               className="w-5 h-5 text-white"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={3}
//                 d="M5 13l4 4L19 7"
//               />
//             </svg>
//           </div>
//         </div>
//       )}

//       {/* Icon */}
//       <div
//         className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 transition-all duration-300 ${
//           isSelected
//             ? "bg-blue-500 shadow-lg"
//             : "bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-blue-100 group-hover:to-blue-200"
//         }`}
//       >
//         <Icon
//           className={`w-8 h-8 ${
//             isSelected
//               ? "text-white"
//               : "text-gray-600 group-hover:text-blue-600"
//           }`}
//         />
//       </div>

//       {/* Content */}
//       <h3 className="text-2xl font-bold text-gray-800 mb-3">{title}</h3>
//       <p className="text-gray-600 mb-6 leading-relaxed">{description}</p>

//       {/* Features */}
//       <ul className="space-y-3">
//         {features.map((feature, idx) => (
//           <li key={idx} className="flex items-start gap-3">
//             <div
//               className={`mt-1 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
//                 isSelected ? "bg-blue-500" : "bg-gray-300"
//               }`}
//             >
//               <svg
//                 className="w-3 h-3 text-white"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={3}
//                   d="M5 13l4 4L19 7"
//                 />
//               </svg>
//             </div>
//             <span className="text-sm text-gray-700">{feature}</span>
//           </li>
//         ))}
//       </ul>

//       {/* Decorative gradient overlay */}
//       <div
//         className={`absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 transition-opacity duration-300 pointer-events-none ${
//           isSelected ? "opacity-100" : "group-hover:opacity-50"
//         }`}
//       />
//     </div>
//   </div>
// );

// const RoleSelection = () => {
//   const [selectedRole, setSelectedRole] = useState("");

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (selectedRole === "student") {
//       console.log("Redirecting to /student/signup");
//       // router.push("/student/signup");
//     } else if (selectedRole === "company") {
//       console.log("Redirecting to /company/signup");
//       // router.push("/company/signup");
//     }
//   };

//   const roles = [
//     {
//       role: "student",
//       icon: GraduationCap,
//       title: "I'm a Student",
//       description:
//         "Looking for internship opportunities to kickstart your career",
//       features: [
//         "Browse thousands of IT internships",
//         "Connect with top companies",
//         "Build your professional profile",
//         "Apply with one click",
//       ],
//     },
//     {
//       role: "company",
//       icon: Briefcase,
//       title: "I'm a Company",
//       description: "Seeking talented interns to join your team",
//       features: [
//         "Post unlimited internship positions",
//         "Access qualified candidates",
//         "Streamlined hiring process",
//         "Manage applications efficiently",
//       ],
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 flex flex-col">
//       {/* Header */}
//       <div className="w-full px-6 py-6">
//         <div className="max-w-6xl mx-auto">
//           <a href="/" className="inline-block">
//             <Logo />
//           </a>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 flex items-center justify-center px-6 py-12">
//         <div className="w-full max-w-6xl">
//           {/* Title Section */}
//           <div className="text-center mb-12">
//             <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
//               Join as a Student or Company
//             </h1>
//             <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//               Choose your role to get started and unlock opportunities
//             </p>
//           </div>

//           {/* Role Selection Form */}
//           <form onSubmit={handleSubmit} className="space-y-8">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {roles.map((roleData) => (
//                 <RoleCard
//                   key={roleData.role}
//                   {...roleData}
//                   isSelected={selectedRole === roleData.role}
//                   onSelect={setSelectedRole}
//                 />
//               ))}
//             </div>

//             {/* Submit Button */}
//             <div className="flex flex-col items-center gap-6">
//               <button
//                 type="submit"
//                 disabled={!selectedRole}
//                 className={`group relative px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center gap-3 ${
//                   selectedRole
//                     ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
//                     : "bg-gray-300 text-gray-500 cursor-not-allowed"
//                 }`}
//               >
//                 <span>
//                   {selectedRole
//                     ? `Continue as ${
//                         selectedRole === "student" ? "Student" : "Company"
//                       }`
//                     : "Select a role to continue"}
//                 </span>
//                 {selectedRole && (
//                   <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
//                 )}
//               </button>

//               {/* Sign In Link */}
//               <p className="text-gray-600">
//                 Already have an account?{" "}
//                 <a
//                   href="/signin"
//                   className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors"
//                 >
//                   Log In
//                 </a>
//               </p>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RoleSelection;
