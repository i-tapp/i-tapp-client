import Input from "@/components/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import UploadThing from "@/components/upload-thing";
import { profileFormSchema } from "@/lib/validations/company";
import { zodResolver } from "@hookform/resolvers/zod";
import { CameraIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

export default function CompanyProfile({
  onNext,
  onBack,
}: {
  onNext: (data?: any) => void;
  onBack: () => void;
}) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    mode: "onBlur",
  });

  return (
    <>
      <Form {...form}>
        <form
          id="company-profile-form"
          onSubmit={form.handleSubmit((values) => onNext(values))}
          className="flex flex-col gap-4"
        >
          {/* Industry + Company Size */}
          <div className="flex w-full flex-row gap-4">
            <FormField
              control={form.control}
              name="industry"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Industry</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Technology, Finance" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="companySize"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Company Size</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="w-full border rounded-md px-3 py-2"
                    >
                      <option value="">Select size</option>
                      <option value="1-10">1–10</option>
                      <option value="11-50">11–50</option>
                      <option value="51-200">51–200</option>
                      <option value="201-500">201–500</option>
                      <option value="501-1000">501–1000</option>
                      <option value="1000+">1000+</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Founded year + Website */}
          <div className="flex w-full flex-row gap-4">
            <FormField
              control={form.control}
              name="foundedYear"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Founded Year</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 2018" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input placeholder="https://www.example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Contact */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Phone</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., +234 801 234 5678" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Address */}
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Address</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Street, area, landmark"
                    {...field}
                    className="resize-none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* City + State */}
          <div className="flex w-full flex-row gap-4">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Lagos" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Lagos State" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Bio */}
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Bio</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell students what your company does..."
                    {...field}
                    className="h-28 resize-none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>

      <UploadThing
        onSelect={(file) => {
          console.log(file);
          setSelectedFile(file);
        }}
      >
        <LogoChange selectedFile={selectedFile} />
      </UploadThing>
    </>
  );
}

const LogoChange = ({ selectedFile }: { selectedFile: File | null }) => {
  return (
    <div className="flex flex-col gap-1 mt-6">
      <h1 className="font-semibold capitalize">Company Logo</h1>
      <div className="flex flex-row gap-2 justify-start items-center">
        <div className="border-2 border-dashed rounded-xl w-24 h-20 flex items-center justify-center cursor-pointer">
          {selectedFile ? (
            <Image
              src={URL.createObjectURL(selectedFile)}
              alt=""
              width={80}
              height={80}
              className="w-20 h-20 object-cover rounded-xl"
            />
          ) : (
            <CameraIcon className="text-gray-400 m-auto mt-6" />
          )}
        </div>
        <div>
          <h1 className="text-primary font-semibold text-sm">Upload Photo</h1>
          <p className="text-xs text-gray-500">
            PNG, JPG, GIF up to 5MB(400*400 recommended)
          </p>
        </div>
      </div>
    </div>
  );
};
