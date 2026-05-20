"use client";

import { FileUploadThing } from "@/components/file-upload-thing";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { corpsDocumentStepSchema, CorpsDocumentSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export default function CorpsDocumentStep({
  onNext,
  onBack,
}: {
  onNext: (data: CorpsDocumentSchema) => void;
  onBack: () => void;
}) {
  const form = useForm<CorpsDocumentSchema>({
    resolver: zodResolver(corpsDocumentStepSchema),
    mode: "onChange",
    defaultValues: { callUpLetter: undefined, cv: undefined },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onNext)} className="flex flex-col gap-6" id="corps-documents-form">
        <FormField control={form.control} name="callUpLetter" render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel className="font-semibold">Call-Up Letter <span className="text-red-500">*</span></FormLabel>
            <FormControl>
              <FileUploadThing title="Upload Call-Up Letter" value={field.value} onChange={field.onChange} onBlur={field.onBlur} />
            </FormControl>
            {fieldState.error?.message && (
              <p className="text-sm font-medium text-destructive">{fieldState.error.message}</p>
            )}
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="cv" render={({ field }) => (
          <FormItem>
            <FormLabel className="font-semibold">CV / Resume <span className="text-muted-foreground">(optional)</span></FormLabel>
            <FormControl>
              <FileUploadThing title="Upload CV" value={field.value} onChange={field.onChange} onBlur={field.onBlur} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
      </form>
    </Form>
  );
}
