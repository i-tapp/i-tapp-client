import { FileUploadThing } from "@/components/file-upload-thing";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { DocumentSchema, documentStepSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export default function DocumentStep({
  onBack,
  onNext,
}: {
  onNext: (values: DocumentSchema) => void;
  onBack: () => void;
}) {
  const form = useForm<DocumentSchema>({
    resolver: zodResolver(documentStepSchema),
    mode: "onChange",
    defaultValues: {
      itLetter: undefined,
      cv: undefined,
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => onNext(values))}
        className="flex flex-col gap-4"
        id="document-step-form"
      >
        <FormField
          control={form.control}
          name="itLetter"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className="font-semibold mb-5">
                IT Letter (required)
              </FormLabel>
              <FormControl>
                <FileUploadThing
                  title="Upload IT letter"
                  value={field.value} // current value (url/key/etc)
                  onChange={field.onChange} // set value into RHF
                  onBlur={field.onBlur}
                />
              </FormControl>
              <FormMessage />
              {fieldState.error?.message && (
                <p className="text-sm font-medium text-destructive">
                  {fieldState.error.message}
                </p>
              )}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cv"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold mb-5">
                CV (optional)
              </FormLabel>
              <FormControl>
                <FileUploadThing
                  title="Upload CV"
                  value={field.value} // current value (url/key/etc)
                  onChange={field.onChange} // set value into RHF
                  onBlur={field.onBlur}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
