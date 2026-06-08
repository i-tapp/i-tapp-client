"use client";

import { useFetchCorpsPPADetail, useFetchCorpsPPAApplicationStatus } from "@/queries/corps";
import { applyToPPA, withdrawPPAApplication } from "@/actions";
import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { useAction } from "next-safe-action/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { X, MapPin, Clock, Globe, Building2, BookmarkIcon } from "lucide-react";
import { saveCorpsPPA } from "@/actions";
import { formatDate } from "@/utils/format-date";
import Image from "next/image";
import { useState } from "react";

export default function PPADetailPanel({ id, onClose }: { id: string; onClose: () => void }) {
  const queryClient = useQueryClient();
  const { data: ppa, isLoading } = useFetchCorpsPPADetail(id);
  const { data: appStatus } = useFetchCorpsPPAApplicationStatus(id);
  const [coverLetter, setCoverLetter] = useState("");
  const [showApplyModal, setShowApplyModal] = useState(false);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["corps-ppa-status", id] });
    queryClient.invalidateQueries({ queryKey: ["corps-applications"] });
  };

  const { execute: apply, isExecuting: isApplying } = useAction(applyToPPA, {
    onSuccess: (res) => {
      if (res?.data?.requiresPayment) {
        toast.info(`Payment of ₦${res.data.fee?.toLocaleString()} required to complete application.`);
      } else {
        toast.success("Application submitted!");
        invalidate();
      }
      setShowApplyModal(false);
    },
    onError: () => toast.error("Application failed. Please try again."),
  });

  const { execute: withdraw, isExecuting: isWithdrawing } = useAction(withdrawPPAApplication, {
    onSuccess: () => { toast.success("Application withdrawn."); invalidate(); },
    onError: () => toast.error("Failed to withdraw application."),
  });

  const { execute: toggleSave } = useAction(saveCorpsPPA, {
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["corps-ppa-detail", id] }),
  });

  if (isLoading) return <div className="flex justify-center py-20"><Spinner /></div>;
  if (!ppa) return null;

  const hasApplied = appStatus?.hasApplied;
  const appStatusValue = appStatus?.status;

  return (
    <div className="p-5 space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          {ppa.company?.logo ? (
            <Image src={ppa.company.logo} alt={ppa.company.name} width={48} height={48} className="w-12 h-12 rounded-xl object-contain border" />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 font-bold text-xl flex items-center justify-center">
              {ppa.company?.name?.charAt(0)}
            </div>
          )}
          <div>
            <h2 className="text-xl font-bold text-gray-900">{ppa.title}</h2>
            <p className="text-sm text-gray-500">{ppa.company?.name} · {ppa.company?.industry}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={() => toggleSave({ id })} className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors">
            <BookmarkIcon className="w-5 h-5" fill={ppa.isSaved ? "currentColor" : "none"} />
          </button>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Meta */}
      <div className="flex flex-wrap gap-3 text-sm text-gray-600">
        <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-gray-400" />{ppa.location}</span>
        <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-gray-400" />{ppa.duration}</span>
        {ppa.mode && <span className="px-2 py-0.5 rounded-full bg-gray-100">{ppa.mode}</span>}
        {ppa.stipend && <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium">₦{ppa.stipend?.toLocaleString()}/mo</span>}
        {ppa.applicationDeadline && (
          <span className="px-2 py-0.5 rounded-full bg-red-50 text-red-600">Deadline: {formatDate(ppa.applicationDeadline)}</span>
        )}
      </div>

      {/* Fields */}
      {ppa.preferredFields?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {ppa.preferredFields.map((f: string) => (
            <span key={f} className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">{f}</span>
          ))}
        </div>
      )}

      {/* Description */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-2">About this PPA</h3>
        <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{ppa.description}</p>
      </div>

      {/* Company info */}
      <div className="rounded-xl bg-gray-50 p-4 space-y-2">
        <h3 className="font-semibold text-gray-900 text-sm">Company</h3>
        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
          <span className="flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5 text-gray-400" />{ppa.company?.industry}</span>
          {ppa.company?.website && (
            <a href={`https://${ppa.company.website}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-primary hover:underline">
              <Globe className="w-3.5 h-3.5" />{ppa.company.website}
            </a>
          )}
        </div>
      </div>

      {/* Action */}
      <div className="pt-2">
        {hasApplied ? (
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg">
              Applied · {appStatusValue}
            </span>
            {appStatusValue === "applied" && (
              <Button
                variant="outline"
                size="sm"
                disabled={isWithdrawing}
                onClick={() => withdraw({ id })}
              >
                {isWithdrawing ? "Withdrawing..." : "Withdraw"}
              </Button>
            )}
          </div>
        ) : (
          <>
            {showApplyModal ? (
              <div className="space-y-3">
                <textarea
                  rows={4}
                  placeholder="Cover letter (optional) — tell this company why you're a great fit..."
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
                <div className="flex gap-2">
                  <Button
                    disabled={isApplying}
                    onClick={() => apply({ id, coverLetter: coverLetter || undefined })}
                    className="flex-1"
                  >
                    {isApplying ? "Submitting..." : "Submit Application"}
                  </Button>
                  <Button variant="outline" onClick={() => setShowApplyModal(false)}>Cancel</Button>
                </div>
              </div>
            ) : (
              <Button onClick={() => setShowApplyModal(true)} className="w-full">
                Apply to this PPA
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
