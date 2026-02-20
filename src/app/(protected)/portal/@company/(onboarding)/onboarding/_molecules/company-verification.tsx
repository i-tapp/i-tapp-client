import { FileUploadThing } from "@/components/file-upload-thing";
import Input from "@/components/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { kycFormSchema, KycFormValues } from "@/schemas";
import { cn } from "@/utils/tailwind";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileUpIcon } from "lucide-react";
import { useForm } from "react-hook-form";

export default function CompanyKyc({
  onNext,
  onBack,
}: {
  onNext: (values: KycFormValues) => void;
  onBack?: () => void;
}) {
  const form = useForm<KycFormValues>({
    resolver: zodResolver(kycFormSchema),
    defaultValues: {
      cacDocument: undefined,
      proofOfAddress: undefined,
    },
    mode: "onBlur",
  });

  return (
    <Form {...form}>
      <form
        id="kyc-form"
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit((values) => onNext(values))}
      >
        {/* Registration Number */}
        <FormField
          control={form.control}
          name="registrationNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CAC Registration Number (RC/BN/IT)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., RC 1234567" {...field} />
              </FormControl>
              <FormMessage />
              {form.formState.errors.registrationNumber && (
                <p className="text-sm text-red-500 mt-1">
                  {form.formState.errors.registrationNumber.message}
                </p>
              )}
            </FormItem>
          )}
        />

        {/* Confirmation checkbox */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <FormField
            control={form.control}
            name="cacDocument"
            render={({ field }) => (
              <FormItem>
                <FormLabel className=" font-semibold mb-5">
                  CAC Document (required)
                </FormLabel>
                <FormControl>
                  <FileUploadThing
                    title="Upload CAC document"
                    value={field.value} // current value (url/key/etc)
                    onChange={field.onChange} // set value into RHF
                    onBlur={field.onBlur}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Proof of Address */}
          <FormField
            control={form.control}
            name="proofOfAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Proof of Address (required)</FormLabel>
                <FormControl>
                  <FileUploadThing
                    title="Upload proof of address"
                    value={field.value} // current value (url/key/etc)
                    onChange={field.onChange} // set value into RHF
                    onBlur={field.onBlur}
                    description="Max 10MB. PDF/JPG/PNG/WEBP."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
}
