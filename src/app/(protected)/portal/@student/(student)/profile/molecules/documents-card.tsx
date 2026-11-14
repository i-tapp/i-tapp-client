"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { ExternalLink, FileText } from "lucide-react";
import { FileUploadThing } from "@/components/file-upload-thing";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { studentDocumentUpdateSchema, type StudentDocumentUpdateSchema } from "@/schemas";
import { updateStudentDocuments } from "@/actions";

type DocName = keyof StudentDocumentUpdateSchema;

const DOCUMENTS: { name: DocName; label: string; uploadTitle: string; hint?: string }[] = [
  {
    name: "itLetter",
    label: "IT (SIWES) Letter",
    uploadTitle: "Upload IT Letter",
    hint: "Your main document. Sent with every application.",
  },
  {
    name: "cv",
    label: "CV / Resume (optional)",
    uploadTitle: "Upload CV",
    hint: "Optional. Sent with applications if you add one.",
  },
  {
    name: "transcript",
    label: "Transcript / Result Slip (optional)",
    uploadTitle: "Upload Transcript",
    hint: "Used automatically when a company asks for a transcript.",
  },
  {
    name: "idDocument",
    label: "ID (optional)",
    uploadTitle: "Upload ID",
    hint: "Student ID card, NIN slip or similar. Used when a company asks for ID.",
  },
  {
    name: "otherDocument",
    label: "Other Document (optional)",
    uploadTitle: "Upload Document",
    hint: "E.g. a recommendation letter or certificate.",
  },
];

const EMPTY: StudentDocumentUpdateSchema = {
  itLetter: undefined,
  cv: undefined,
  transcript: undefined,
  idDocument: undefined,
  otherDocument: undefined,
};

/**
 * Lets a SIWES student add or replace profile documents. Saves on its own, so
 * changing a document never touches the rest of the profile.
 */
export default function StudentDocumentsCard({ student }: { student: any }) {
  const queryClient = useQueryClient();

  const form = useForm<StudentDocumentUpdateSchema>({
    resolver: zodResolver(studentDocumentUpdateSchema),
    defaultValues: EMPTY,
  });

  const { execute, isExecuting } = useAction(updateStudentDocuments, {
    onSuccess: () => {
      toast.success("Documents updated");
      form.reset(EMPTY);
      queryClient.invalidateQueries({ queryKey: ["student-profile"] });
    },
    onError: ({ error }) =>
      toast.error(error?.serverError ?? "Couldn't update your documents. Please try again."),
  });

  const values = form.watch();
  const hasChanges = DOCUMENTS.some((d) => values[d.name] instanceof File);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
          <FileText className="w-4 h-4" />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">Documents</p>
          <p className="text-xs text-gray-500">
            Add or replace your documents. Choose a file, then save.
          </p>
        </div>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((v) => {
            // Send only the files that were actually chosen.
            const files: StudentDocumentUpdateSchema = {};
            for (const d of DOCUMENTS) {
              if (v[d.name] instanceof File) files[d.name] = v[d.name];
            }
            execute(files);
          })}
          className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {DOCUMENTS.map((doc) => {
            const url: string | null =
              typeof student?.[doc.name] === "string" && student[doc.name] ? student[doc.name] : null;
            return (
              <FormField
                key={doc.name}
                control={form.control}
                name={doc.name}
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between gap-3 mb-1.5">
                      <label className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                        {doc.label}
                      </label>
                      {url ? (
                        <a
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline shrink-0"
                        >
                          View current <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-xs text-gray-400 shrink-0">Not added</span>
                      )}
                    </div>
                    <FormControl>
                      <FileUploadThing
                        title={doc.uploadTitle}
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                      />
                    </FormControl>
                    {doc.hint && <p className="text-[11px] text-gray-400 mt-1">{doc.hint}</p>}
                    <FormMessage />
                  </FormItem>
                )}
              />
            );
          })}

          <Button
            type="submit"
            disabled={isExecuting || !hasChanges}
            className="w-full h-11 md:col-span-2"
          >
            {isExecuting ? "Saving..." : "Save Documents"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
