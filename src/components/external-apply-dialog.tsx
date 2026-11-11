"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Check, Copy, ExternalLink, FileText, Loader2, Paperclip } from "lucide-react";
import {
  agreeToShare,
  answerFormListing,
  openFormListing,
  uploadApplicationDocument,
} from "@/actions";
import { useFetchCoverLetterDraft, useFetchShareConsent } from "@/queries";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export type ExternalPayload = {
  coverLetter?: string;
  documents: { type: string; url: string; name?: string }[];
  answers: { questionId: string; answer: string }[];
};

const DOC_LABELS: Record<string, string> = {
  cv: "CV",
  cover_letter: "Cover letter",
  school_letter: "School introduction (SIWES) letter",
  call_up_letter: "NYSC call-up letter",
  transcript: "Transcript",
  id: "ID",
  portfolio_link: "Portfolio link",
};
// Uploaded here. (CV and the cover letter are handled separately.)
const UPLOAD_TYPES = ["school_letter", "call_up_letter", "transcript", "id"];
// Profile documents we use automatically when nothing is uploaded.
const FROM_PROFILE = ["school_letter", "call_up_letter"];

const companyNameOf = (o: any) => o?.company?.name ?? o?.organisationName ?? "the company";

/**
 * Apply to a listing that PlaceIT hands to the company by email, or that uses
 * the company's own form. Direct listings never open this.
 */
export function ExternalApplyDialog({
  open,
  onOpenChange,
  opportunity,
  onSubmitEmail,
  isSubmitting = false,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  opportunity: any;
  /** Called with the cover letter, documents and answers; the parent applies. */
  onSubmitEmail: (payload: ExternalPayload) => void;
  isSubmitting?: boolean;
}) {
  const isForm = opportunity?.applicationMethod === "form";
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        {isForm ? (
          <FormFlow opportunity={opportunity} open={open} onClose={() => onOpenChange(false)} />
        ) : (
          <EmailFlow
            opportunity={opportunity}
            open={open}
            onSubmit={onSubmitEmail}
            isSubmitting={isSubmitting}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

// ---------------------------------------------------------------------------
// Email category
// ---------------------------------------------------------------------------

function EmailFlow({
  opportunity,
  open,
  onSubmit,
  isSubmitting,
}: {
  opportunity: any;
  open: boolean;
  onSubmit: (payload: ExternalPayload) => void;
  isSubmitting: boolean;
}) {
  const required: string[] = opportunity?.requiredDocuments ?? [];
  const questions: any[] = opportunity?.extraQuestions ?? [];
  const mode: string = opportunity?.coverLetterMode ?? "none";
  const needsCoverLetter = mode !== "none" || required.includes("cover_letter");

  const { data: consent } = useFetchShareConsent(open);
  const needsConsent = consent ? !consent.consented : false;
  const [agreed, setAgreed] = useState(false);

  const { data: draft } = useFetchCoverLetterDraft(
    opportunity?.id,
    open && mode === "template",
  );
  const [coverLetter, setCoverLetter] = useState("");
  const draftApplied = useRef(false);
  useEffect(() => {
    if (draft?.text && !draftApplied.current) {
      draftApplied.current = true;
      setCoverLetter(draft.text);
    }
  }, [draft]);

  const [docs, setDocs] = useState<Record<string, { url: string; name?: string }>>({});
  const [uploading, setUploading] = useState<string | null>(null);
  const [portfolio, setPortfolio] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const uploadTypes = UPLOAD_TYPES.filter((t) => required.includes(t));

  const upload = async (type: string, file: File | undefined) => {
    if (!file) return;
    setUploading(type);
    const res = await uploadApplicationDocument({ file });
    setUploading(null);
    if (res?.data?.url) {
      setDocs((d) => ({ ...d, [type]: { url: res.data!.url, name: res.data!.name } }));
    } else {
      toast.error(res?.serverError || "Could not upload that file. Please try again.");
    }
  };

  const problems = useMemo(() => {
    const out: string[] = [];
    if (needsCoverLetter && coverLetter.trim().length < 30)
      out.push("Write a short cover letter (at least a few sentences)");
    for (const t of uploadTypes) {
      if (!FROM_PROFILE.includes(t) && !docs[t]) out.push(`Upload your ${DOC_LABELS[t].toLowerCase()}`);
    }
    if (required.includes("portfolio_link") && !/^https?:\/\/\S+/i.test(portfolio.trim()))
      out.push("Add a link to your portfolio (starting with https://)");
    for (const q of questions) {
      if (q.required && !(answers[q.id] ?? "").trim()) out.push(`Answer: ${q.label}`);
    }
    if (needsConsent && !agreed) out.push("Agree to share your details with this company");
    return out;
  }, [needsCoverLetter, coverLetter, uploadTypes, docs, required, portfolio, questions, answers, needsConsent, agreed]);

  const submit = async () => {
    if (problems.length) {
      toast.error(problems[0]);
      return;
    }
    setSubmitting(true);
    try {
      if (needsConsent) {
        const res = await agreeToShare({});
        if (res?.serverError) {
          toast.error(res.serverError);
          return;
        }
      }
      const documents = [
        ...uploadTypes
          .filter((t) => docs[t])
          .map((t) => ({ type: t, url: docs[t].url, name: docs[t].name })),
        ...(required.includes("portfolio_link") && portfolio.trim()
          ? [{ type: "portfolio_link", url: portfolio.trim(), name: "Portfolio" }]
          : []),
      ];
      onSubmit({
        coverLetter: needsCoverLetter ? coverLetter.trim() : undefined,
        documents,
        answers: questions
          .filter((q) => (answers[q.id] ?? "").trim())
          .map((q) => ({ questionId: q.id, answer: answers[q.id].trim() })),
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Apply to {opportunity?.title}</DialogTitle>
        <DialogDescription>
          Your application goes to {companyNameOf(opportunity)} by email, with your CV attached.
          They reply straight to you.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-5">
        {opportunity?.instructions && (
          <div className="rounded-lg bg-amber-50 border border-amber-100 p-3 text-sm text-amber-900 whitespace-pre-wrap">
            {opportunity.instructions}
          </div>
        )}

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Paperclip className="w-4 h-4 text-gray-400" />
          Your CV from your profile is attached automatically.
        </div>

        {needsCoverLetter && (
          <div>
            <label className="text-sm font-medium text-gray-800">Cover letter</label>
            <Textarea
              rows={9}
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Introduce yourself and say why you want this opportunity"
              className="mt-1"
            />
            <p className="text-[11px] text-gray-400 mt-1">
              Sent as a PDF with your application. You can edit it before sending.
            </p>
          </div>
        )}

        {uploadTypes.map((t) => (
          <div key={t}>
            <label className="text-sm font-medium text-gray-800">{DOC_LABELS[t]}</label>
            <div className="mt-1 flex items-center gap-3">
              <label className="inline-flex items-center gap-2 cursor-pointer rounded-lg border border-gray-200 px-3 py-2 text-sm hover:border-primary/40">
                {uploading === t ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <FileText className="w-4 h-4 text-gray-400" />
                )}
                {docs[t] ? "Replace file" : "Choose file"}
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={(e) => upload(t, e.target.files?.[0])}
                />
              </label>
              {docs[t] && (
                <span className="text-xs text-green-700 inline-flex items-center gap-1">
                  <Check className="w-3 h-3" /> {docs[t].name ?? "Uploaded"}
                </span>
              )}
            </div>
            {FROM_PROFILE.includes(t) && !docs[t] && (
              <p className="text-[11px] text-gray-400 mt-1">
                Optional: we use the one on your profile if you don&apos;t upload one.
              </p>
            )}
          </div>
        ))}

        {required.includes("portfolio_link") && (
          <div>
            <label className="text-sm font-medium text-gray-800">Portfolio link</label>
            <Input
              value={portfolio}
              onChange={(e) => setPortfolio(e.target.value)}
              placeholder="https://"
              className="mt-1"
            />
          </div>
        )}

        {questions.map((q) => (
          <div key={q.id}>
            <label className="text-sm font-medium text-gray-800">
              {q.label}
              {q.required ? " *" : ""}
            </label>
            {q.type === "long_text" ? (
              <Textarea
                rows={4}
                value={answers[q.id] ?? ""}
                onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value }))}
                className="mt-1"
              />
            ) : q.type === "dropdown" ? (
              <select
                value={answers[q.id] ?? ""}
                onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value }))}
                className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
              >
                <option value="">Choose…</option>
                {(q.options ?? []).map((o: string) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            ) : q.type === "yes_no" ? (
              <div className="mt-1 flex gap-2">
                {["Yes", "No"].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setAnswers((a) => ({ ...a, [q.id]: v }))}
                    className={`rounded-lg border px-4 py-1.5 text-sm ${
                      answers[q.id] === v
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-gray-200 text-gray-600"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            ) : (
              <Input
                value={answers[q.id] ?? ""}
                onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value }))}
                className="mt-1"
              />
            )}
          </div>
        ))}

        {needsConsent && (
          <label className="flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50/60 p-3 text-xs text-gray-600 cursor-pointer">
            <Checkbox
              checked={agreed}
              onCheckedChange={(c) => setAgreed(c === true)}
              className="mt-0.5"
            />
            <span>
              I agree that PlaceIT may send my name, email, phone number, school or NYSC details,
              CV and the answers I give here to {companyNameOf(opportunity)}, including by email.
            </span>
          </label>
        )}

        <Button
          className="w-full h-11"
          disabled={isSubmitting || submitting || !!uploading}
          onClick={submit}
        >
          {isSubmitting || submitting ? "Sending…" : "Send application"}
        </Button>
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Form category
// ---------------------------------------------------------------------------

async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* try the fallback */
  }
  try {
    const el = document.createElement("textarea");
    el.value = text;
    el.style.position = "fixed";
    el.style.opacity = "0";
    document.body.appendChild(el);
    el.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(el);
    return ok;
  } catch {
    return false;
  }
}

function FormFlow({
  opportunity,
  open,
  onClose,
}: {
  opportunity: any;
  open: boolean;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const [info, setInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [waiting, setWaiting] = useState(false); // company form opened in another tab
  const [done, setDone] = useState(false);
  const started = useRef(false);

  useEffect(() => {
    if (!open || started.current) return;
    started.current = true;
    (async () => {
      const res = await openFormListing({ id: opportunity.id });
      if (res?.data) setInfo(res.data);
      else setError(res?.serverError || "Could not open this application. Please try again.");
    })();
  }, [open, opportunity?.id]);

  // When the person comes back from the company's form, ask if they submitted.
  const [askNow, setAskNow] = useState(false);
  useEffect(() => {
    if (!waiting) return;
    const onVisible = () => {
      if (document.visibilityState === "visible") setAskNow(true);
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [waiting]);

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["my-application-status", opportunity.id] });
    queryClient.invalidateQueries({ queryKey: ["corps-applications"] });
  };

  const answer = async (a: "yes" | "not_yet" | "no") => {
    const res = await answerFormListing({ id: opportunity.id, answer: a });
    if (res?.serverError) {
      toast.error(res.serverError);
      return;
    }
    refresh();
    if (a === "yes") setDone(true);
    else if (a === "no") onClose();
    else setAskNow(false);
  };

  const rows: [string, string | null][] = info
    ? [
        ["Full name", info.details.fullName],
        ["Email", info.details.email],
        ["Phone", info.details.phone],
        ["Institution", info.details.institution],
        ["Course", info.details.course],
        ["Level", info.details.level],
        ["State code", info.details.stateCode],
        ["Location", info.details.location],
      ].filter(([, v]) => !!v) as [string, string][]
    : [];

  const copy = async (label: string, value: string) => {
    const ok = await copyText(value);
    if (ok) toast.success(`${label} copied`);
    else toast.error("Couldn't copy. Please select and copy it.");
  };

  const openForm = () => {
    const url = info?.prefilledUrl || info?.formUrl;
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
    setWaiting(true);
    setAskNow(false);
  };

  if (error) {
    return (
      <>
        <DialogHeader>
          <DialogTitle>We couldn&apos;t start this application</DialogTitle>
          <DialogDescription>{error}</DialogDescription>
        </DialogHeader>
      </>
    );
  }
  if (!info) {
    return (
      <div className="py-10 flex justify-center">
        <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
      </div>
    );
  }
  if (done) {
    return (
      <>
        <DialogHeader>
          <DialogTitle>Application recorded</DialogTitle>
          <DialogDescription>
            We&apos;ve noted that you submitted your application for {info.title}. Good luck!
          </DialogDescription>
        </DialogHeader>
        <Button onClick={onClose} className="w-full">
          Done
        </Button>
      </>
    );
  }

  const docLabels = (info.requiredDocuments as string[])
    .filter((d) => d !== "portfolio_link")
    .map((d) => DOC_LABELS[d] ?? d);

  return (
    <>
      <DialogHeader>
        <DialogTitle>Apply on {info.company ?? "the company"}&apos;s form</DialogTitle>
        <DialogDescription>
          This company collects applications on its own form. Copy your details, open the form,
          and tell us when you&apos;ve submitted.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-5">
        {info.instructions && (
          <div className="rounded-lg bg-amber-50 border border-amber-100 p-3 text-sm text-amber-900 whitespace-pre-wrap">
            {info.instructions}
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-gray-800">1. Your details</p>
            <button
              type="button"
              className="text-xs text-primary hover:underline"
              onClick={() => copy("Details", rows.map(([k, v]) => `${k}: ${v}`).join("\n"))}
            >
              Copy all
            </button>
          </div>
          <div className="rounded-lg border border-gray-100 divide-y divide-gray-100">
            {rows.map(([label, value]) => (
              <div key={label} className="flex items-center justify-between gap-3 px-3 py-2">
                <div className="min-w-0">
                  <p className="text-[11px] text-gray-400">{label}</p>
                  <p className="text-sm text-gray-800 truncate">{value}</p>
                </div>
                <button
                  type="button"
                  aria-label={`Copy ${label}`}
                  onClick={() => copy(label, value as string)}
                  className="p-1.5 rounded-md text-gray-400 hover:text-primary hover:bg-primary/10"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <div className="mt-2 flex flex-wrap gap-3 text-xs">
            {info.details.cvUrl && (
              <a href={info.details.cvUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                Open my CV
              </a>
            )}
            {info.details.schoolLetterUrl && (
              <a href={info.details.schoolLetterUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                Open my school letter
              </a>
            )}
            {info.details.callUpLetterUrl && (
              <a href={info.details.callUpLetterUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                Open my call-up letter
              </a>
            )}
          </div>
        </div>

        {docLabels.length > 0 && (
          <div>
            <p className="text-sm font-semibold text-gray-800 mb-1">Have these ready</p>
            <ul className="text-sm text-gray-600 list-disc pl-5">
              {docLabels.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <p className="text-sm font-semibold text-gray-800 mb-2">2. Fill in the company&apos;s form</p>
          <Button className="w-full h-11" onClick={openForm}>
            Open the company&apos;s form <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {(waiting || askNow) && (
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
            <p className="text-sm font-semibold text-gray-800">3. Did you submit the form?</p>
            <p className="text-xs text-gray-500 mb-3">
              We can&apos;t see the company&apos;s form, so we rely on you to tell us. It lets us
              track your application.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" onClick={() => answer("yes")}>
                Yes, I submitted
              </Button>
              <Button size="sm" variant="outline" onClick={() => answer("not_yet")}>
                Not yet
              </Button>
              <Button size="sm" variant="ghost" onClick={() => answer("no")}>
                No, I&apos;m not applying
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
