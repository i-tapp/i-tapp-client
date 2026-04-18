import { apply, initializePayment, save, withdraw } from "@/actions";
import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useFetchOpportunityPublicDetails } from "@/hooks/query";
import { useFetchMyApplicationStatus } from "@/queries/student";
import { useStudentStore } from "@/lib/store";
import { ApplicationStatus } from "@/types/enums";
import { formatDate } from "@/utils/format-date";
import { useQueryClient } from "@tanstack/react-query";
import { Bank, Calendar, Heart } from "iconsax-reactjs";
import {
  BadgeCheck,
  Banknote,
  ClockIcon,
  Globe,
  TriangleAlert,
} from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import Image from "next/image";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import dp from "@/assets/images/dp.png";

export default function OpportunityDetailsContent({
  selectedId,
  setSelectedId,
  selectedOpportunity: propOpportunity,
}: {
  selectedId?: string | null;
  setSelectedId?: (id: string | null) => void;
  selectedOpportunity?: any;
}) {
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const isPage = pathname.startsWith("/portal/find-it-space/o/");
  const router = useRouter();
  const params = useParams();
  const id = params.opportunityId;

  const opportunityId = isPage ? String(id) : selectedId;

  const { data: fetchedOpportunity, isLoading } =
    useFetchOpportunityPublicDetails(opportunityId ?? undefined);

  // Fallback to propOpportunity for any fields the backend detail endpoint misses (like preferredFields)
  const selectedOpportunity =
    fetchedOpportunity || propOpportunity
      ? {
          ...propOpportunity,
          ...fetchedOpportunity,
          preferredFields:
            fetchedOpportunity?.preferredFields?.length > 0
              ? fetchedOpportunity?.preferredFields
              : propOpportunity?.preferredFields,
        }
      : null;

  const { data: myApplicationStatus } = useFetchMyApplicationStatus(
    opportunityId ?? undefined,
  );

  const student = useStudentStore((s) => s.student);
  const [locationWarningOpen, setLocationWarningOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentData, setPaymentData] = useState<{
    fee: number;
    message: string;
  } | null>(null);
  const [isInitializingPayment, setIsInitializingPayment] = useState(false);

  const exists = myApplicationStatus?.exists ?? false;
  const status = myApplicationStatus?.status ?? null;
  const applicationId = myApplicationStatus?.applicationId ?? null;
  const logo = selectedOpportunity?.company?.logo ?? null;

  const isWithdrawn = status === ApplicationStatus.WITHDRAWN;
  const canWithdraw =
    exists && status === ApplicationStatus.APPLIED && Boolean(applicationId);

  const address = selectedOpportunity?.company?.addresses?.[0] ?? null;

  const formatAddress = (address?: any) => {
    if (!address) return "No address available";
    return [address.line1, address.city, address.state, address.country]
      .filter((val) => val && val !== "N/A")
      .join(", ");
  };

  /** Returns true when the student's preferred location doesn't match the opportunity */
  const isLocationMismatch = (): boolean => {
    const preferred = student?.preferredLocation?.trim().toLowerCase();
    if (!preferred) return false;

    const haystack = [
      selectedOpportunity?.location,
      address?.city,
      address?.state,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return haystack.length > 0 && !haystack.includes(preferred);
  };

  const opportunityLocationLabel = (): string => {
    const parts = [
      selectedOpportunity?.location,
      address?.city,
      address?.state,
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : "Not specified";
  };

  const invalidateDetails = () => {
    queryClient.invalidateQueries({
      queryKey: ["my-application-status", opportunityId],
    });
    queryClient.invalidateQueries({
      queryKey: ["opportunity-public-details", opportunityId],
    });
  };

  const { execute: applyAction, isExecuting: isApplying } = useAction(apply, {
    onSuccess: (data) => {
      const result = data?.data;
      if (result?.requiresPayment) {
        setPaymentData({ fee: result.fee, message: result.message });
        setPaymentModalOpen(true);
        return;
      }
      toast.success(result?.message || "Applied successfully!");
      invalidateDetails();
    },
    onError: (err) => {
      toast.error(
        err?.error?.serverError || "Failed to apply. Please try again.",
      );
    },
  });

  const handleProceedToPayment = async () => {
    if (!opportunityId) return;
    setIsInitializingPayment(true);
    try {
      const result = await initializePayment({
        opportunityId,
      });
      const url = (result as any)?.data?.authorizationUrl;
      if (url) {
        window.location.href = url;
      } else {
        toast.error("Could not initialize payment. Please try again.");
      }
    } catch {
      toast.error("Could not initialize payment. Please try again.");
    } finally {
      setIsInitializingPayment(false);
    }
  };

  const { execute: saveAction } = useAction(save, {
    onSuccess() {
      toast.success("Saved successfully!");
    },
    onError(err) {
      toast.error(
        err?.error?.serverError || "Failed to save job. Please try again.",
      );
    },
  });

  const { execute: withdrawAction, isExecuting: isWithdrawing } = useAction(
    withdraw,
    {
      onSuccess(data) {
        toast.success(data?.data?.message || "Withdrawn successfully!");
        invalidateDetails();
      },
      onError(err) {
        toast.error(
          err?.error?.serverError || "Failed to withdraw. Please try again.",
        );
      },
    },
  );

  const executeApply = () => {
    if (!opportunityId) return;
    applyAction({ id: opportunityId });
  };

  const handleApply = () => {
    if (isLocationMismatch()) {
      setLocationWarningOpen(true);
      return;
    }
    executeApply();
  };

  const handleWithdraw = () => {
    if (!applicationId) return;
    withdrawAction({ id: applicationId });
  };

  const handleSave = () => {
    if (!opportunityId) return;
    saveAction({ id: opportunityId });
  };

  let actionButton = null;

  if (!exists || isWithdrawn) {
    actionButton = (
      <Button onClick={handleApply} className="w-full" disabled={isApplying}>
        {isWithdrawn ? "Re-apply" : isApplying ? "Applying..." : "Apply Now"}
      </Button>
    );
  } else if (canWithdraw) {
    actionButton = (
      <Button
        onClick={handleWithdraw}
        className="w-full"
        variant="destructive"
        disabled={isWithdrawing}
      >
        {isWithdrawing ? "Withdrawing..." : "Withdraw"}
      </Button>
    );
  } else {
    actionButton = (
      <Button disabled className="w-full bg-gray-200 text-gray-500 capitalize">
        {status}
      </Button>
    );
  }

  const visible = Boolean(opportunityId);
  if (!visible) return null;

  if (isLoading) return <Spinner />;

  return (
    <>
      <div className="flex flex-col gap-5 p-4">
        {/* Header */}
        <div className="flex items-center justify-between ">
          <Image
            src={logo ?? dp}
            alt="Company Logo"
            width={44}
            height={44}
            className="h-11 w-11 rounded-xl border border-gray-200 bg-white shadow-sm"
          />

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 shadow-sm transition hover:bg-gray-50 active:scale-[0.98]"
            aria-label="Save / Like"
            onClick={handleSave}
          >
            <Heart size={18} />
          </button>
        </div>

        {/* Title & Company */}
        <section className="space-y-1">
          <p className="text-xl font-semibold tracking-tight text-gray-900">
            {selectedOpportunity?.title}
          </p>

          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
            <div className="flex flex-row items-center gap-1">
              <Link
                href={`/portal/company/${selectedOpportunity?.company?.id}`}
                className="font-semibold text-primary hover:underline"
              >
                {selectedOpportunity?.company?.name}
              </Link>

              {selectedOpportunity?.company?.status === "approved" && (
                <div className="relative group inline-block">
                  <BadgeCheck className="w-3 h-3 text-blue-500 cursor-pointer" />
                  <div className="absolute bottom-full mb-1 w-48 hidden group-hover:block bg-black text-white text-xs px-2 py-1 rounded shadow">
                    This company is verified. Companies without this badge have
                    not been verified yet.
                  </div>
                </div>
              )}
            </div>

            <span className="text-gray-300">•</span>

            <p className="text-gray-500">
              {address ? formatAddress(address) : "Location not available"},
            </p>
          </div>
        </section>

        {/* Highlights */}
        <section className="grid grid-cols-2 gap-3">
          <StatCard
            label="Applicants"
            value={selectedOpportunity?.totalApplications ?? 0}
          />
          <StatCard
            label="Duration"
            value={`${selectedOpportunity?.duration || "N/A"} Months`}
          />
        </section>

        {/* Job info */}
        <section className="space-y-3">
          <SectionTitle title="Job Information" />

          <div className="grid grid-cols-2 gap-3">
            <InfoItem
              label="Duration"
              value={`${selectedOpportunity?.duration || "N/A"} Months`}
              icon={<ClockIcon size={18} />}
            />
            <InfoItem
              label="Stipend"
              value={selectedOpportunity?.stipend ?? "N/A"}
              icon={<Banknote size={18} />}
            />
            <InfoItem
              label="Mode"
              value={selectedOpportunity?.mode ?? "N/A"}
              icon={<Globe size={18} />}
            />
            <InfoItem
              label="Posted"
              value={formatDate(selectedOpportunity?.createdAt ?? "")}
              icon={<Calendar size={18} />}
            />
            <InfoItem
              label="Department"
              value={
                selectedOpportunity?.department
                  ?.map((dept: string) => dept)
                  .join(", ") ?? "Not specified"
              }
              icon={<Bank size={18} />}
            />
          </div>
        </section>

        {/* Description */}
        <section className="space-y-2">
          <SectionTitle title="Description" />
          <p className="text-sm leading-relaxed text-gray-600">
            {selectedOpportunity?.description ?? "No description provided."}
          </p>
        </section>

        <section className="space-y-2">
          <SectionTitle title="Preferred Fields of Study" />

          {selectedOpportunity?.preferredFields?.length > 0 ? (
            <div className="text-sm leading-relaxed text-gray-600">
              {selectedOpportunity?.preferredFields?.map(
                (field: any, index: number) => (
                  <p
                    key={field?.id || index}
                    className="capitalize bg-secondary/30 px-2 py-1 rounded mb-1"
                  >
                    {typeof field === "string" ? field : field?.field}
                  </p>
                ),
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-600">No fields specified.</p>
          )}
        </section>

        {/* Actions */}
        <div className="mt-1 flex flex-col gap-2">
          {actionButton}

          <Button
            variant="ghost"
            onClick={() => {
              if (isPage) {
                router.back();
                return;
              }
              setSelectedId?.(null);
            }}
            className="w-full rounded-xl border border-gray-200 bg-white text-gray-800 hover:bg-gray-50"
          >
            Back to Listings
          </Button>
        </div>
      </div>

      {/* Location mismatch warning modal */}
      <Dialog open={locationWarningOpen} onOpenChange={setLocationWarningOpen}>
        <DialogContent className="w-[calc(100%-2rem)] max-w-md mx-auto rounded-xl">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-500">
                <TriangleAlert size={18} />
              </span>
              <DialogTitle className="text-base leading-snug">
                Location Mismatch
              </DialogTitle>
            </div>
            <DialogDescription className="mt-3 text-sm leading-relaxed">
              This opportunity is outside your preferred IT location.
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-lg border border-amber-100 bg-amber-50 px-4 py-3 text-sm space-y-2">
            <div className="flex items-start justify-between gap-2">
              <span className="text-muted-foreground shrink-0">
                Your preferred location
              </span>
              <span className="font-medium text-right capitalize">
                {student?.preferredLocation ?? "—"}
              </span>
            </div>
            <div className="border-t border-amber-100" />
            <div className="flex items-start justify-between gap-2">
              <span className="text-muted-foreground shrink-0">
                Opportunity location
              </span>
              <span className="font-medium text-right capitalize">
                {opportunityLocationLabel()}
              </span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            You can still apply, but note that this placement may require
            relocation or commuting outside your preferred area.
          </p>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => setLocationWarningOpen(false)}
            >
              Go Back
            </Button>
            <Button
              className="w-full sm:w-auto"
              disabled={isApplying}
              onClick={() => {
                setLocationWarningOpen(false);
                executeApply();
              }}
            >
              {isApplying ? "Applying..." : "Apply Anyway"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment Required Modal */}
      <Dialog open={paymentModalOpen} onOpenChange={setPaymentModalOpen}>
        <DialogContent className="w-[calc(100%-2rem)] max-w-md mx-auto rounded-xl">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <Banknote size={18} />
              </span>
              <DialogTitle className="text-base font-semibold">
                Application Fee Required
              </DialogTitle>
            </div>
            <DialogDescription className="mt-3 text-sm leading-relaxed">
              {paymentData?.message ??
                "A payment is required to submit this application."}
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Application fee</span>
              <span className="font-semibold text-blue-700">
                ₦{paymentData?.fee?.toLocaleString() ?? "2,500"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground pt-1">
              Your application details will be saved and submitted automatically
              once payment is confirmed.
            </p>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setPaymentModalOpen(false)}
              disabled={isInitializingPayment}
            >
              Cancel
            </Button>
            <Button
              onClick={handleProceedToPayment}
              disabled={isInitializingPayment}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isInitializingPayment
                ? "Redirecting..."
                : `Proceed to Pay — ₦${paymentData?.fee?.toLocaleString() ?? "2,500"}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

const SectionTitle = ({ title }: { title: string }) => {
  return (
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      <span className="h-px flex-1 bg-gray-200 ml-3" />
    </div>
  );
};

const InfoItem = ({
  label = "Label",
  value = "Value",
  icon,
}: {
  label?: string;
  value?: string | number;
  icon?: React.ReactNode;
}) => {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-50 text-blue-400 shrink-0">
        {icon}
      </div>

      <div className="leading-tight">
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-xs font-semibold text-gray-900 wrap-break-word">
          {value}
        </p>
      </div>
    </div>
  );
};

const StatCard = ({
  label,
  value = 10,
}: {
  label: string;
  value: string | number;
}) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-linear-to-b from-white to-gray-50 px-4 py-3 ">
      <p className="text-[11px] font-medium uppercase tracking-wide text-gray-500">
        {label}
      </p>
      <p className="mt-1 text-2xl font-semibold tracking-tight text-gray-900">
        {value}
      </p>
    </div>
  );
};
