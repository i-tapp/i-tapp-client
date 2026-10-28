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
import { corpsDocumentUpdateSchema, type CorpsDocumentUpdateSchema } from "@/schemas";
import { updateCorpsDocuments } from "@/actions";

type DocName = keyof CorpsDocumentUpdateSchema;

const DOCUMENTS: {
  name: DocName;
  label: string;
  /** Profile fields the stored file link may arrive under. */
  urlKeys: string[];
  uploadTitle: string;
  hint?: string;
}[] = [
  {
    name: "callUpLetter",
    label: "Call-Up Letter",
    urlKeys: ["callUpLetter", "callUpLetterUrl"],
    uploadTitle: "Upload new Call-Up Letter",
    hint: "Used to verify your NYSC status.",
  },
  {
    name: "cv",
    label: "CV / Resume",
    urlKeys: ["cv", "cvUrl"],
    uploadTitle: "Upload CV",
  },
  {
    name: "relocationLetter",
    label: "Relocation Letter",
    urlKeys: ["relocationLetter", "relocationLetterUrl"],
    uploadTitle: "Upload Relocation Letter",
    hint: "Only needed if NYSC issued you a relocation letter.",
  },
];

function currentUrl(corps: any, keys: string[]): string | null {
  for (const key of keys) {
    const value = corps?.[key];
    if (typeof value === "string" && value) return value;
  }
  return null;
}

/**
 * Lets a corps member replace the documents they uploaded during onboarding.
 * Lives outside the main profile <form> (forms can't nest) and saves on its
 * own, so changing a CV never touches the rest of the profile.
 */
export default function CorpsDocumentsCard({ corps }: { corps: any }) {
  const queryClient = useQueryClient();

  const form = useForm<CorpsDocumentUpdateSchema>({
    resolver: zodResolver(corpsDocumentUpdateSchema),
    defaultValues: {
      callUpLetter: undefined,
      cv: undefined,
      relocationLetter: undefined,
    },
  });

  const { execute, isExecuting } = useAction(updateCorpsDocuments, {
    onSuccess: () => {
      toast.success("Documents updated");
      form.reset({
        callUpLetter: undefined,
        cv: undefined,
        relocationLetter: undefined,
      });
      queryClient.invalidateQueries({ queryKey: ["corps-profile"] });
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
            Replace the files you uploaded during setup. Choose a new file, then save.
          </p>
        </div>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((v) => {
            // Send only the files that were actually chosen.
            const files: CorpsDocumentUpdateSchema = {};
            for (const d of DOCUMENTS) {
              if (v[d.name] instanceof File) files[d.name] = v[d.name];
            }
            execute(files);
          })}
          className="p-6 space-y-6"
        >
          {DOCUMENTS.map((doc) => {
            const url = currentUrl(corps, doc.urlKeys);
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
                          className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                        >
                          View current file <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-xs text-gray-400">Nothing uploaded yet</span>
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

          <Button type="submit" disabled={isExecuting || !hasChanges} className="w-full h-11">
            {isExecuting ? "Saving..." : "Save Documents"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
