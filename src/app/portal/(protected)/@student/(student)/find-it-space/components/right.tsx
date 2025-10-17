import { Button } from "@/components/ui/button";
import Hr from "@/components/ui/hr";
import { cn } from "@/utils/tailwind";

export default function Right({
  companyId,
  setCompanyId,
  mobileView,
  selectedCompany,
}: {
  companyId: number | null;
  setCompanyId: (id: number | null) => void;
  mobileView: "left" | "right";
  selectedCompany: string | null;
}) {
  if (!companyId) return null;

  return (
    <div className="space-y-3 ">
      <div
        className={cn(
          "flex flex-col rounded-lg bg-white shadow-sm transition-all overflow-hidden",
          companyId
            ? cn(
                // MOBILE: show only when in "right" view
                "md:hidden",
                mobileView === "right" && "flex"
              )
            : "hidden",
          // TABLET & BELOW (≤md): overlay style
          companyId &&
            "md:absolute md:mx-2 md:inset-0 md:z-20 md:flex md:p-2 lg:relative lg:z-auto lg:w-[320px]",
          // DESKTOP (≥lg): side panel layout
          companyId && "lg:flex"
        )}
      >
        <div className="flex flex-col gap-5 p-4">
          {/* Header */}
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Company Logo"
              className="w-10 h-10 rounded-md border border-gray-200"
            />
            <div>
              <p className="font-semibold text-gray-800">
                {selectedCompany?.opportunity ?? "Opportunity Title"}
              </p>
              <p className="text-sm text-gray-500">
                {" "}
                {selectedCompany?.name ?? "Company name"}
              </p>
            </div>
          </div>

          {/* Applicants */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-light text-gray-800">
            {selectedCompany?.applicants ?? 0} Applicant
            {selectedCompany?.applicants > 1 ? "s" : ""}
          </div>

          {/* Job Details */}
          <div className="space-y-3 text-sm text-gray-700 border border-gray-100 bg-gray-50 rounded-lg p-3">
            <div className="space-y-1">
              <p>
                <span className="font-semibold text-gray-800">Duration:</span>{" "}
                {selectedCompany?.duration ?? 0}
                {/* months */}
              </p>
              <p>
                <span className="font-semibold text-gray-800">Industry:</span>{" "}
                {selectedCompany?.industry ?? "N/A"}
              </p>
              <p>
                <span className="font-semibold text-gray-800">
                  Date Posted:
                </span>{" "}
                {selectedCompany?.postedAgo ?? "N/A"}
              </p>
            </div>

            <Hr />

            <div className="space-y-2">
              <h2 className="font-semibold text-gray-800">Description</h2>
              <p className="text-gray-600 leading-relaxed">
                {selectedCompany?.description ?? "No description provided."}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 mt-2">
            <Button size="default" className="w-full text-white">
              Apply Now
            </Button>
            <Button
              variant="ghost"
              onClick={() => setCompanyId(null)}
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
          variant="ghost"
          className="text-primary border border-primary/30 rounded-2xl font-medium shadow-sm w-auto"
        >
          Save Job
        </Button>
      </div>
    </div>
  );
}
