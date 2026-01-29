import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { verifyCompanySchema } from "@/lib/validations/auth";
import { z } from "zod";
import Input from "@/components/input";
import { ButtonWithLoader } from "@/components/button-with-loader";

type VerifyCompanySchema = z.infer<typeof verifyCompanySchema>;

interface CompanyInfo1Props {
  setFormStep: React.Dispatch<React.SetStateAction<number>>;
  onFormDataUpdate: (data: VerifyCompanySchema) => void;
}

export function CompanyInfo1({
  setFormStep,
  onFormDataUpdate,
}: CompanyInfo1Props) {
  const form = useForm<VerifyCompanySchema>({
    mode: "onChange",
    resolver: zodResolver(verifyCompanySchema),
    defaultValues: {
      company_name: "",
      email: "",
      address: "",
      password: "",
    },
  });

  const onSubmit = (data: VerifyCompanySchema) => {
    onFormDataUpdate(data);
    setFormStep(1);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-3"
      >
        <FormField
          control={form.control}
          name="company_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Company name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" placeholder="name@company.com" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input {...field} placeholder="1234 Main St, City, Country" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="password"
                  placeholder="Enter your password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="m-auto my-2">
          <ButtonWithLoader type="submit" disabled={!form.formState.isValid}>
            Continue
          </ButtonWithLoader>
        </div>
      </form>
    </Form>
  );
}
