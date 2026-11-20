"use client";

import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { resetEmailTemplate, saveEmailTemplate } from "@/actions";
import { useFetchEmailTemplate } from "@/queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Field = "subject" | "body";

export default function TemplateEditor() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useFetchEmailTemplate();
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState<"save" | "reset" | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const lastField = useRef<Field>("body");
  const subjectRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (data) {
      setSubject(data.subject);
      setBody(data.body);
    }
  }, [data]);

  const dirty = !!data && (subject !== data.subject || body !== data.body);

  const insert = (key: string) => {
    const token = `{{${key}}}`;
    if (lastField.current === "subject") {
      const el = subjectRef.current;
      const start = el?.selectionStart ?? subject.length;
      const end = el?.selectionEnd ?? subject.length;
      setSubject(subject.slice(0, start) + token + subject.slice(end));
    } else {
      const el = bodyRef.current;
      const start = el?.selectionStart ?? body.length;
      const end = el?.selectionEnd ?? body.length;
      setBody(body.slice(0, start) + token + body.slice(end));
    }
  };

  const save = async () => {
    setBusy("save");
    setErrors([]);
    const res = await saveEmailTemplate({ subject, body });
    setBusy(null);
    if (res?.data?.ok) {
      toast.success("Email saved. New applications will use it.");
      queryClient.invalidateQueries({ queryKey: ["email-template"] });
    } else {
      setErrors(res?.data?.errors?.length ? res.data.errors : [res?.data?.message ?? "Could not save"]);
    }
  };

  const reset = async () => {
    if (!window.confirm("Go back to the original wording? Your edits will be lost.")) return;
    setBusy("reset");
    setErrors([]);
    const res = await resetEmailTemplate();
    setBusy(null);
    if (res?.data?.ok) {
      toast.success("Back to the original wording");
      queryClient.invalidateQueries({ queryKey: ["email-template"] });
    } else {
      toast.error(res?.data?.message ?? "Could not reset");
    }
  };

  // A rough preview with sample values (the test-email button shows the exact email).
  const sample = Object.fromEntries((data?.placeholders ?? []).map((p) => [p.key, p.sample]));
  const fill = (t: string) => t.replace(/\{\{\s*([a-z_]+)\s*\}\}/gi, (m, k) => sample[k] ?? m);

  if (isLoading || !data) return <p className="p-6 text-sm text-gray-500">Loading…</p>;

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-semibold">Application email</h1>
        <p className="text-sm text-gray-500">
          The subject and opening of the email companies receive when someone applies to a listing posted by email.
          The applicant details, the verified line and the footer stay the same.
        </p>
      </div>

      <div className="space-y-2 rounded-xl border border-gray-100 bg-white p-4">
        <p className="text-sm font-medium">Fill-ins</p>
        <p className="text-xs text-gray-500">
          Click one to add it where your cursor is. Each is replaced with the real value for every application.
        </p>
        <div className="flex flex-wrap gap-2">
          {data.placeholders.map((p) => (
            <button
              key={p.key}
              type="button"
              onClick={() => insert(p.key)}
              title={p.label}
              className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 hover:bg-indigo-100"
            >
              {`{{${p.key}}}`}
            </button>
          ))}
        </div>
        <ul className="list-disc pl-5 text-xs text-gray-500">
          {data.placeholders.map((p) => (
            <li key={p.key}><code>{`{{${p.key}}}`}</code>: {p.label}</li>
          ))}
        </ul>
      </div>

      <div className="space-y-4 rounded-xl border border-gray-100 bg-white p-4">
        <div className="space-y-1">
          <label className="text-sm font-medium" htmlFor="et-subject">Subject</label>
          <Input
            id="et-subject"
            ref={subjectRef}
            value={subject}
            onFocus={() => { lastField.current = "subject"; }}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium" htmlFor="et-body">Email text</label>
          <textarea
            id="et-body"
            ref={bodyRef}
            rows={12}
            value={body}
            onFocus={() => { lastField.current = "body"; }}
            onChange={(e) => setBody(e.target.value)}
            className="w-full rounded-md border border-gray-200 bg-transparent p-3 text-sm"
          />
          <p className="text-xs text-gray-500">
            Leave a blank line between paragraphs. If an applicant has nothing to fill a sentence with (no phone number,
            nothing attached), that sentence is left out instead of showing a blank.
          </p>
        </div>

        {errors.length > 0 && (
          <ul className="list-disc rounded-md bg-red-50 p-3 pl-7 text-sm text-red-700">
            {errors.map((e) => <li key={e}>{e}</li>)}
          </ul>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={save} disabled={busy !== null || !dirty}>
            {busy === "save" ? "Saving…" : "Save"}
          </Button>
          <Button variant="outline" onClick={reset} disabled={busy !== null || data.isDefault}>
            {busy === "reset" ? "Resetting…" : "Back to original wording"}
          </Button>
          {dirty && <span className="text-xs text-amber-600">Unsaved changes</span>}
          {!dirty && data.updatedAt && (
            <span className="text-xs text-gray-500">
              Last saved {new Date(data.updatedAt).toLocaleString()}
              {data.updatedBy ? ` by ${data.updatedBy}` : ""}
            </span>
          )}
        </div>
      </div>

      <div className="space-y-2 rounded-xl border border-gray-100 bg-white p-4">
        <p className="text-sm font-medium">Preview (sample applicant)</p>
        <p className="text-sm"><span className="text-gray-500">Subject: </span>{fill(subject)}</p>
        <div className="space-y-3 rounded-md bg-gray-50 p-3 text-sm">
          {fill(body).split(/\n\s*\n/).map((para, i) => (
            <p key={i} className="whitespace-pre-line">{para}</p>
          ))}
        </div>
        <p className="text-xs text-gray-500">
          This is a rough preview. To see the exact email, open an email listing and use
          &quot;Send me a test email&quot;. It uses what you saved here.
        </p>
      </div>
    </div>
  );
}
