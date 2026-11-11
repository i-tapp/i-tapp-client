"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { AlertTriangle, CheckCircle2, Loader2, Plus, Trash2 } from "lucide-react";
import {
  checkListingDuplicates,
  checkListingUrl,
  publishAdminListing,
  saveAdminListing,
  sendAdminListingTest,
  uploadListingLogo,
} from "@/actions";
import { useFetchAdminListing } from "@/queries";
import { NIGERIAN_STATES } from "@/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Form = Record<string, any>;

const DOCS: [string, string][] = [
  ["cover_letter", "Cover letter"],
  ["school_letter", "School introduction (SIWES) letter"],
  ["call_up_letter", "NYSC call-up letter"],
  ["transcript", "Transcript"],
  ["id", "ID"],
  ["portfolio_link", "Portfolio link"],
];
const LEVELS = ["100", "200", "300", "400", "500", "ND", "HND"];
const FORM_TYPES: [string, string][] = [
  ["google_forms", "Google Forms"],
  ["typeform", "Typeform"],
  ["microsoft_forms", "Microsoft Forms"],
  ["company_portal", "Company portal"],
  ["other", "Other"],
];

const EMPTY: Form = {
  title: "", audience: "siwes", organisationName: "", logoUrl: "", website: "",
  companyDescription: "", sector: "", source: "", sourceUrl: "",
  description: "", skills: "", department: "", levelsAccepted: [] as string[],
  slots: "", mode: "onsite", duration: "", startDate: "", startWindow: "",
  statesAccepted: "", immediatelyAvailable: false, accommodation: "", acceptsPpaSwitch: false,
  state: "", city: "", address: "", stipend: "depends", compensationDetails: "", benefits: "",
  applicationDeadline: "", expiresAt: "",
  applicationMethod: "email", recipientEmail: "", ccEmails: "", emailSubjectSuffix: "",
  requiredDocuments: [] as string[], coverLetterMode: "none", coverLetterTemplate: "",
  extraQuestions: [] as { id: string; label: string; type: string; options: string; required: boolean }[],
  instructions: "", formUrl: "", formType: "google_forms", prefillTemplate: "",
  featured: false, campMode: false, restrictionsNote: "",
};

const csv = (s: string) => s.split(",").map((x) => x.trim()).filter(Boolean);
const day = (d?: string | null) => (d ? String(d).slice(0, 10) : "");

function fromListing(l: any): Form {
  const audience = l.bothPrograms ? "both" : l.programType === "ppa" ? "ppa" : "siwes";
  return {
    ...EMPTY,
    ...Object.fromEntries(
      Object.keys(EMPTY)
        .filter((k) => l[k] !== undefined && l[k] !== null)
        .map((k) => [k, l[k]]),
    ),
    audience,
    department: (l.department ?? []).join(", "),
    statesAccepted: (l.statesAccepted ?? []).join(", "),
    ccEmails: (l.ccEmails ?? []).join(", "),
    levelsAccepted: l.levelsAccepted ?? [],
    requiredDocuments: l.requiredDocuments ?? [],
    slots: l.slots ?? "",
    duration: l.duration ?? "",
    startDate: day(l.startDate),
    applicationDeadline: day(l.applicationDeadline),
    expiresAt: day(l.expiresAt),
    extraQuestions: (l.extraQuestions ?? []).map((q: any) => ({
      id: q.id, label: q.label, type: q.type, required: !!q.required,
      options: (q.options ?? []).join(", "),
    })),
  };
}

function toPayload(f: Form) {
  const dateOrNull = (v: string) => (v ? new Date(v).toISOString() : null);
  return {
    ...f,
    department: csv(f.department),
    statesAccepted: csv(f.statesAccepted),
    ccEmails: csv(f.ccEmails),
    slots: f.slots === "" ? null : Number(f.slots),
    duration: f.duration === "" ? undefined : Number(f.duration),
    startDate: dateOrNull(f.startDate),
    applicationDeadline: dateOrNull(f.applicationDeadline),
    expiresAt: dateOrNull(f.expiresAt),
    extraQuestions: f.extraQuestions
      .filter((q: any) => q.label.trim())
      .map((q: any) => ({ ...q, options: csv(q.options) })),
  };
}

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-gray-100 bg-white p-5">
      <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
      {hint && <p className="text-xs text-gray-500 mt-0.5">{hint}</p>}
      <div className="mt-4 grid gap-4 sm:grid-cols-2">{children}</div>
    </section>
  );
}

function Field({ label, hint, wide, children }: { label: string; hint?: string; wide?: boolean; children: React.ReactNode }) {
  return (
    <div className={wide ? "sm:col-span-2" : ""}>
      <label className="text-xs font-medium text-gray-700">{label}</label>
      <div className="mt-1">{children}</div>
      {hint && <p className="text-[11px] text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

const selectClass = "w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm";

export default function ListingForm({ id: initialId }: { id?: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [id, setId] = useState(initialId);
  const [f, setF] = useState<Form>(EMPTY);
  const { data: existing } = useFetchAdminListing(initialId);
  const loaded = useRef(false);

  const [busy, setBusy] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [dupes, setDupes] = useState<{ id: string; title: string; organisationName: string | null; status: string }[]>([]);
  const [confirmDupes, setConfirmDupes] = useState(false);
  const [urlCheck, setUrlCheck] = useState<string | null>(null);

  useEffect(() => {
    if (existing && !loaded.current) {
      loaded.current = true;
      setF(fromListing(existing));
    }
  }, [existing]);

  const set = (k: string, v: any) => setF((p) => ({ ...p, [k]: v }));
  const toggle = (k: string, v: string) =>
    setF((p) => ({ ...p, [k]: p[k].includes(v) ? p[k].filter((x: string) => x !== v) : [...p[k], v] }));

  const isEmail = f.applicationMethod === "email";
  const isPpa = f.audience === "ppa" || f.audience === "both";
  const stats = existing?.stats;
  const status: string | undefined = existing?.status;

  const refresh = (savedId?: string) => {
    queryClient.invalidateQueries({ queryKey: ["admin-listing", savedId ?? id] });
    queryClient.invalidateQueries({ queryKey: ["admin-listings"] });
  };

  /** Saves the draft; returns the listing id, or null if it failed. */
  const save = async (quiet = false): Promise<string | null> => {
    setErrors([]);
    const res = await saveAdminListing({ id, data: toPayload(f) });
    const out = res?.data;
    if (!out?.ok) {
      toast.error(out?.message || res?.serverError || "Could not save");
      return null;
    }
    const saved = (out.data as any).id as string;
    if (!id) {
      setId(saved);
      router.replace(`/admin/listings/${saved}`);
    }
    refresh(saved);
    if (!quiet) toast.success("Draft saved");
    return saved;
  };

  const run = async (name: string, fn: () => Promise<void>) => {
    setBusy(name);
    try {
      await fn();
    } finally {
      setBusy(null);
    }
  };

  const publish = (force = false) =>
    run("publish", async () => {
      const savedId = await save(true);
      if (!savedId) return;
      const res = await publishAdminListing({ id: savedId, force });
      const out = res?.data;
      if (out?.ok) {
        setDupes([]);
        setConfirmDupes(false);
        toast.success("Published");
        refresh(savedId);
        return;
      }
      if (out?.status === 409 && out.duplicates.length) {
        setDupes(out.duplicates);
        setConfirmDupes(true);
        return;
      }
      setErrors(out?.errors?.length ? out.errors : [out?.message ?? "Could not publish"]);
    });

  const testEmail = () =>
    run("test", async () => {
      const savedId = await save(true);
      if (!savedId) return;
      const res = await sendAdminListingTest({ id: savedId });
      if (res?.data?.ok) toast.success("Test email sent to you");
      else toast.error(res?.data?.message ?? "Could not send the test email");
    });

  const checkLink = () =>
    run("url", async () => {
      const res = await checkListingUrl({ url: f.formUrl });
      const out: any = res?.data;
      setUrlCheck(out?.ok && out.data?.ok ? "The link loads." : `Problem: ${out?.data?.reason ?? out?.message ?? "could not be checked"}`);
    });

  const lookForDuplicates = async () => {
    if (!f.title.trim() || !f.organisationName.trim()) return;
    const res = await checkListingDuplicates({
      organisationName: f.organisationName, title: f.title,
      recipientEmail: f.recipientEmail, formUrl: f.formUrl, excludeId: id,
    });
    const out: any = res?.data;
    setDupes(out?.ok ? out.data : []);
  };

  const uploadLogo = (file?: File) => {
    if (!file) return;
    run("logo", async () => {
      const res = await uploadListingLogo({ file });
      const out: any = res?.data;
      if (out?.ok) set("logoUrl", out.data.url);
      else toast.error(out?.message || "Could not upload the logo");
    });
  };

  const addQuestion = () =>
    set("extraQuestions", [
      ...f.extraQuestions,
      { id: Math.random().toString(36).slice(2, 10), label: "", type: "short_text", options: "", required: false },
    ]);
  const setQuestion = (i: number, patch: Record<string, any>) =>
    set("extraQuestions", f.extraQuestions.map((q: any, idx: number) => (idx === i ? { ...q, ...patch } : q)));

  return (
    <div className="p-6 max-w-4xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">{initialId ? "Edit listing" : "Post a listing"}</h1>
          <p className="text-sm text-gray-500">
            For openings you found elsewhere, posted on a company&apos;s behalf.
          </p>
        </div>
        {status && (
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold capitalize text-gray-700">
            {status}
          </span>
        )}
      </div>

      {stats && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5 text-center">
          {[
            ["Applications", stats.applications],
            ["Sent", stats.sent],
            ["Delivered", stats.delivered],
            ["Bounced", stats.bounced],
            ["Claims / removals", `${stats.claims} / ${stats.removals}`],
          ].map(([l, v]) => (
            <div key={l as string} className="rounded-lg border border-gray-100 bg-white p-3">
              <p className="text-lg font-semibold">{v as any}</p>
              <p className="text-[11px] text-gray-500">{l}</p>
            </div>
          ))}
        </div>
      )}

      {dupes.length > 0 && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <p className="font-semibold flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> This looks like a listing that already exists</p>
          <ul className="mt-2 list-disc pl-5">
            {dupes.map((d) => (
              <li key={d.id}>
                <a className="underline" href={`/admin/listings/${d.id}`}>{d.title}</a>
                {d.organisationName ? ` · ${d.organisationName}` : ""} ({d.status})
              </li>
            ))}
          </ul>
          {confirmDupes && (
            <Button size="sm" className="mt-3" disabled={!!busy} onClick={() => publish(true)}>
              Publish anyway
            </Button>
          )}
        </div>
      )}

      {errors.length > 0 && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <p className="font-semibold">Fix these before publishing:</p>
          <ul className="mt-2 list-disc pl-5">{errors.map((e) => <li key={e}>{e}</li>)}</ul>
        </div>
      )}

      <Section title="A. The opportunity" hint="Who it's for and who is hiring.">
        <Field label="Opportunity title *" wide>
          <Input value={f.title} onChange={(e) => set("title", e.target.value)} onBlur={lookForDuplicates} />
        </Field>
        <Field label="Opportunity type *">
          <select className={selectClass} value={f.audience} onChange={(e) => set("audience", e.target.value)}>
            <option value="siwes">SIWES (students)</option>
            <option value="ppa">NYSC PPA (corps members)</option>
            <option value="both">Both</option>
          </select>
        </Field>
        <Field label="Company name *">
          <Input value={f.organisationName} onChange={(e) => set("organisationName", e.target.value)} onBlur={lookForDuplicates} />
        </Field>
        <Field label="Company logo" hint="PNG, JPG or WebP, up to 2 MB">
          <div className="flex items-center gap-3">
            {f.logoUrl && <img src={f.logoUrl} alt="" className="h-10 w-10 rounded object-cover border" />}
            <label className="cursor-pointer rounded-md border border-gray-200 px-3 py-2 text-sm hover:border-primary/40">
              {busy === "logo" ? "Uploading…" : f.logoUrl ? "Replace" : "Upload"}
              <input type="file" className="hidden" accept="image/png,image/jpeg,image/webp" onChange={(e) => uploadLogo(e.target.files?.[0])} />
            </label>
          </div>
        </Field>
        <Field label="Company website"><Input value={f.website} onChange={(e) => set("website", e.target.value)} placeholder="https://" /></Field>
        <Field label="Industry"><Input value={f.sector} onChange={(e) => set("sector", e.target.value)} /></Field>
        <Field label="About the company" wide>
          <Textarea rows={3} value={f.companyDescription} onChange={(e) => set("companyDescription", e.target.value)} />
        </Field>
        <Field label="Where you found it" hint="Internal: job board name, LinkedIn, direct outreach…">
          <Input value={f.source} onChange={(e) => set("source", e.target.value)} />
        </Field>
        <Field label="Link to the original post" hint="Internal">
          <Input value={f.sourceUrl} onChange={(e) => set("sourceUrl", e.target.value)} placeholder="https://" />
        </Field>
      </Section>

      <Section title="B. The role">
        <Field label="Role description *" wide>
          <Textarea rows={5} value={f.description} onChange={(e) => set("description", e.target.value)} />
        </Field>
        <Field label="Requirements / skills *" wide>
          <Textarea rows={3} value={f.skills} onChange={(e) => set("skills", e.target.value)} />
        </Field>
        <Field label="Fields of study" hint="Comma-separated, e.g. Accounting, Economics">
          <Input value={f.department} onChange={(e) => set("department", e.target.value)} />
        </Field>
        <Field label="Number of slots" hint="Information only. It does not limit applications.">
          <Input type="number" min={1} value={f.slots} onChange={(e) => set("slots", e.target.value)} />
        </Field>
        {f.audience !== "ppa" && (
          <Field label="Levels accepted" wide>
            <div className="flex flex-wrap gap-3">
              {LEVELS.map((l) => (
                <label key={l} className="flex items-center gap-1.5 text-sm">
                  <input type="checkbox" checked={f.levelsAccepted.includes(l)} onChange={() => toggle("levelsAccepted", l)} />
                  {l}
                </label>
              ))}
            </div>
          </Field>
        )}
        <Field label="Work mode">
          <select className={selectClass} value={f.mode} onChange={(e) => set("mode", e.target.value)}>
            <option value="onsite">On-site</option><option value="remote">Remote</option>
            <option value="hybrid">Hybrid</option><option value="flexible">Flexible</option>
          </select>
        </Field>
        {f.audience !== "ppa" && (
          <Field label="Duration (months)">
            <Input type="number" min={1} value={f.duration} onChange={(e) => set("duration", e.target.value)} />
          </Field>
        )}
        <Field label="Start date"><Input type="date" value={f.startDate} onChange={(e) => set("startDate", e.target.value)} /></Field>
        <Field label="Or start window" hint='e.g. "January 2027"'>
          <Input value={f.startWindow} onChange={(e) => set("startWindow", e.target.value)} />
        </Field>
        {isPpa && (
          <>
            <Field label="States accepted *" hint='Comma-separated, or "all"'>
              <Input value={f.statesAccepted} onChange={(e) => set("statesAccepted", e.target.value)} />
            </Field>
            <Field label="Accommodation provided?">
              <Input value={f.accommodation} onChange={(e) => set("accommodation", e.target.value)} placeholder="Yes / No / Allowance" />
            </Field>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f.immediatelyAvailable} onChange={(e) => set("immediatelyAvailable", e.target.checked)} /> Needs someone immediately</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f.acceptsPpaSwitch} onChange={(e) => set("acceptsPpaSwitch", e.target.checked)} /> Accepts a PPA switch</label>
          </>
        )}
      </Section>

      <Section title="C. Location and pay">
        <Field label="State *">
          <select className={selectClass} value={f.state} onChange={(e) => set("state", e.target.value)}>
            <option value="">Choose…</option>
            {NIGERIAN_STATES.map((s) => <option key={s.value} value={s.label}>{s.label}</option>)}
          </select>
        </Field>
        <Field label="City / LGA"><Input value={f.city} onChange={(e) => set("city", e.target.value)} /></Field>
        <Field label="Address" wide><Input value={f.address} onChange={(e) => set("address", e.target.value)} /></Field>
        <Field label="Pay">
          <select className={selectClass} value={f.stipend} onChange={(e) => set("stipend", e.target.value)}>
            <option value="stipend provided">Stipend provided</option><option value="unpaid">Unpaid</option><option value="depends">Depends</option>
          </select>
        </Field>
        <Field label="Pay details"><Input value={f.compensationDetails} onChange={(e) => set("compensationDetails", e.target.value)} /></Field>
        <Field label="Benefits" wide><Textarea rows={2} value={f.benefits} onChange={(e) => set("benefits", e.target.value)} /></Field>
      </Section>

      <Section title="D. Dates" hint="With no dates, the listing expires 30 days after you publish it.">
        <Field label="Application deadline"><Input type="date" value={f.applicationDeadline} onChange={(e) => set("applicationDeadline", e.target.value)} /></Field>
        <Field label="Listing expires"><Input type="date" value={f.expiresAt} onChange={(e) => set("expiresAt", e.target.value)} /></Field>
      </Section>

      <Section title="E. How people apply">
        <Field label="Application method *" wide>
          <div className="flex gap-3">
            {[["email", "Email: we email the application to the company"], ["form", "Form: the company uses its own form"]].map(([v, l]) => (
              <button
                key={v} type="button" onClick={() => set("applicationMethod", v)}
                className={`flex-1 rounded-lg border p-3 text-left text-sm ${f.applicationMethod === v ? "border-primary bg-primary/5" : "border-gray-200"}`}
              >
                {l}
              </button>
            ))}
          </div>
        </Field>

        {isEmail ? (
          <>
            <Field label="Company email *" hint="Where applications are sent">
              <Input value={f.recipientEmail} onChange={(e) => set("recipientEmail", e.target.value)} onBlur={lookForDuplicates} />
            </Field>
            <Field label="CC emails" hint="Comma-separated, optional">
              <Input value={f.ccEmails} onChange={(e) => set("ccEmails", e.target.value)} />
            </Field>
            <Field label="Subject suffix" hint="Only if the company asked for a reference in the subject">
              <Input value={f.emailSubjectSuffix} onChange={(e) => set("emailSubjectSuffix", e.target.value)} />
            </Field>
            <Field label="Cover letter">
              <select className={selectClass} value={f.coverLetterMode} onChange={(e) => set("coverLetterMode", e.target.value)}>
                <option value="none">Not needed</option>
                <option value="student_writes">Student writes their own</option>
                <option value="template">Student edits a template</option>
              </select>
            </Field>
            {f.coverLetterMode === "template" && (
              <Field label="Cover letter template *" wide hint="Use {student_name}, {course}, {institution}, {role}, {company}">
                <Textarea rows={6} value={f.coverLetterTemplate} onChange={(e) => set("coverLetterTemplate", e.target.value)} />
              </Field>
            )}
          </>
        ) : (
          <>
            <Field label="Company form link *" hint="Must be a public https:// link">
              <div className="flex gap-2">
                <Input value={f.formUrl} onChange={(e) => set("formUrl", e.target.value)} placeholder="https://" />
                <Button type="button" variant="outline" size="sm" disabled={!f.formUrl || !!busy} onClick={checkLink}>
                  {busy === "url" ? <Loader2 className="w-4 h-4 animate-spin" /> : "Check"}
                </Button>
              </div>
              {urlCheck && <p className={`text-xs mt-1 ${urlCheck.startsWith("The link") ? "text-green-700" : "text-red-600"}`}>{urlCheck}</p>}
            </Field>
            <Field label="Form type">
              <select className={selectClass} value={f.formType} onChange={(e) => set("formType", e.target.value)}>
                {FORM_TYPES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </Field>
            <Field label="Pre-filled link (optional)" wide hint="A form link with {full_name}, {email}, {phone}, {institution}, {course}, {level}, {state_code} where the answers go">
              <Input value={f.prefillTemplate} onChange={(e) => set("prefillTemplate", e.target.value)} placeholder="https://docs.google.com/forms/…?entry.123={full_name}" />
            </Field>
          </>
        )}

        <Field label={isEmail ? "Documents to ask for (the CV is always attached)" : "Documents the form will ask for (shown as a checklist)"} wide>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {DOCS.filter(([v]) => isEmail || v !== "cover_letter").map(([v, l]) => (
              <label key={v} className="flex items-center gap-1.5 text-sm">
                <input type="checkbox" checked={f.requiredDocuments.includes(v)} onChange={() => toggle("requiredDocuments", v)} />
                {l}
              </label>
            ))}
          </div>
        </Field>

        {isEmail && (
          <Field label="Extra questions" wide>
            <div className="space-y-3">
              {f.extraQuestions.map((q: any, i: number) => (
                <div key={q.id} className="rounded-lg border border-gray-100 p-3 grid gap-2 sm:grid-cols-[1fr_150px_auto]">
                  <Input placeholder="Question" value={q.label} onChange={(e) => setQuestion(i, { label: e.target.value })} />
                  <select className={selectClass} value={q.type} onChange={(e) => setQuestion(i, { type: e.target.value })}>
                    <option value="short_text">Short answer</option><option value="long_text">Long answer</option>
                    <option value="dropdown">Dropdown</option><option value="yes_no">Yes / No</option>
                  </select>
                  <button type="button" aria-label="Remove question" onClick={() => set("extraQuestions", f.extraQuestions.filter((_: any, idx: number) => idx !== i))} className="text-gray-400 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  {q.type === "dropdown" && (
                    <Input className="sm:col-span-3" placeholder="Options, comma-separated" value={q.options} onChange={(e) => setQuestion(i, { options: e.target.value })} />
                  )}
                  <label className="flex items-center gap-1.5 text-xs sm:col-span-3">
                    <input type="checkbox" checked={q.required} onChange={(e) => setQuestion(i, { required: e.target.checked })} /> Required
                  </label>
                </div>
              ))}
              {f.extraQuestions.length < 10 && (
                <Button type="button" variant="outline" size="sm" onClick={addQuestion}><Plus className="w-4 h-4 mr-1" /> Add a question</Button>
              )}
            </div>
          </Field>
        )}

        <Field label="Instructions for applicants" wide hint="Shown on the apply step, e.g. “Mention your preferred team in the cover letter”">
          <Textarea rows={3} value={f.instructions} onChange={(e) => set("instructions", e.target.value)} />
        </Field>
      </Section>

      <Section title="F. Visibility and notes">
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f.featured} onChange={(e) => set("featured", e.target.checked)} /> Featured</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f.campMode} onChange={(e) => set("campMode", e.target.checked)} /> Camp Mode</label>
        <Field label="Internal notes" wide hint="Never shown to students or companies">
          <Textarea rows={2} value={f.restrictionsNote} onChange={(e) => set("restrictionsNote", e.target.value)} />
        </Field>
      </Section>

      <div className="sticky bottom-0 -mx-6 flex flex-wrap items-center gap-3 border-t bg-white/95 px-6 py-4 backdrop-blur">
        <Button variant="outline" disabled={!!busy} onClick={() => run("save", async () => { await save(); })}>
          {busy === "save" ? "Saving…" : "Save draft"}
        </Button>
        {isEmail && (
          <Button variant="outline" disabled={!!busy || !f.recipientEmail} onClick={testEmail}>
            {busy === "test" ? "Sending…" : "Send me a test email"}
          </Button>
        )}
        <Button disabled={!!busy} onClick={() => publish(false)}>
          {busy === "publish" ? "Publishing…" : status === "open" ? "Save and re-publish" : "Publish"}
        </Button>
        {status === "open" && (
          <span className="inline-flex items-center gap-1 text-xs text-green-700"><CheckCircle2 className="w-4 h-4" /> Live</span>
        )}
      </div>
    </div>
  );
}
