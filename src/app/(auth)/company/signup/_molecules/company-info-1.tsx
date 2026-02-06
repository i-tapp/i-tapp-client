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
import { z } from "zod";
import Input from "@/components/input";
import { ButtonWithLoader } from "@/components/button-with-loader";
import { useAction } from "next-safe-action/hooks";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { companySignup } from "@/actions";
import { companySignupSchema } from "@/schemas";

type CompanySignupSchema = z.infer<typeof companySignupSchema>;

export function CompanyInfo1() {
  const router = useRouter();

  const form = useForm<CompanySignupSchema>({
    mode: "onChange",
    resolver: zodResolver(companySignupSchema),
    defaultValues: {
      name: "",
      email: "",
      registrationNumber: "",
      password: "",
    },
  });

  const { execute, isExecuting, result, hasErrored } = useAction(
    companySignup,
    {
      onSuccess(data) {
        if (data) {
          toast.success("Company signup successful!");
          router.push("/company/signin");
        }
      },
      onError(error) {
        console.error(error);
      },
    },
  );

  const onSubmit = (data: CompanySignupSchema) => {
    execute(data);
  };

  return (
    <div className="w-full">
      {hasErrored && (
        <p className="text-red-500 text-sm font-medium mb-2 ">
          {result?.serverError ?? "Something went wrong. Please try again."}
        </p>
      )}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-3"
        >
          <FormField
            control={form.control}
            name="name"
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
                  <Input
                    {...field}
                    type="email"
                    placeholder="name@company.com"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="registrationNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Registration Number</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Registration Number e.g 123456789"
                  />
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

          <ButtonWithLoader
            type="submit"
            className="w-full my-3"
            disabled={!form.formState.isValid}
          >
            Continue
          </ButtonWithLoader>
        </form>
      </Form>
    </div>
  );
}
