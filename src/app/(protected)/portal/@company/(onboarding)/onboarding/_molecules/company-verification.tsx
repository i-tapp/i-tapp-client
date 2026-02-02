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
      // confirmAddress: false,
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
            </FormItem>
          )}
        />

        {/* Confirmation checkbox */}
        <div className="flex flex-row gap-2">
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

type Props = {
  title?: string;
  value?: File; // or your object type
  onChange?: (val: File) => void;
  onBlur?: () => void;
  description?: string;
};

export const FileUploadThing = ({
  title,
  value,
  onChange,
  onBlur,
  description,
  // width = "350px",
}: Props) => {
  return (
    <>
      <label
        className={cn(
          "border-2 border-dashed rounded-xl h-[140px] flex flex-col items-center justify-center px-4 py-3 cursor-pointer hover:border-primary/60 focus-within:ring-2 focus-within:ring-primary/30",
          // width ? "" : "w-full",
        )}
        // style={{ width }}
      >
        <input
          type="file"
          className="hidden"
          onBlur={onBlur}
          accept=".pdf,.jpg,.jpeg,.png,.webp"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;

            // Example: upload and get URL/key back
            // const uploaded = await upload(file);
            // onChange?.(uploaded.url);

            // Temporary: if you just want filename as placeholder
            onChange?.(file);
          }}
        />

        <div className="mb-2 flex items-center justify-center rounded-full border bg-white p-2.5">
          <FileUpIcon size={16} className="text-primary" />
        </div>

        <h1 className="text-sm font-semibold text-primary">
          {title || "Upload file"}
        </h1>

        <p className="mt-0.5 text-xs text-gray-500">
          {value ? `Selected: ${value.name}` : "Click to upload file"}
        </p>
      </label>
      <p className="text-xs text-muted-foreground flex-wrap ml-1">
        {description ||
          "Max file size: 10MB. Accepted formats: PDF, JPG, PNG, WEBP."}
      </p>
    </>
  );
};

// cursor-pointer hover:border-primary hover:bg-primary/10 transition
