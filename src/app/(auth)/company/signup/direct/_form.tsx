"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { companyDirectSignup } from "@/actions";
import { companyDirectSignupSchema } from "@/schemas";
import Link from "next/link";

type CompanyDirectSignupSchema = z.infer<typeof companyDirectSignupSchema>;

export function CompanyDirectSignupForm() {
  const router = useRouter();

  const form = useForm<CompanyDirectSignupSchema>({
    mode: "onChange",
    resolver: zodResolver(companyDirectSignupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      cacNumber: "",
    },
  });

  const { execute, isExecuting, result, hasErrored } = useAction(
    companyDirectSignup,
    {
      onSuccess() {
        toast.success("Company account created successfully!");
        router.push("/company/signin");
      },
      onError(error) {
        toast.error(error?.error?.serverError ?? "Sign up failed. Please try again.");
      },
    },
  );

  const onSubmit = (data: CompanyDirectSignupSchema) => {
    execute(data);
  };

  return (
    <div className="w-full max-w-[350px] m-auto flex flex-col">
      <div className="flex flex-col gap-4 items-center mb-4">
        <h1 className="text-2xl font-bold">Create a company account</h1>
      </div>

      {hasErrored && (
        <p className="text-red-500 text-sm font-medium mb-2">
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
                <FormLabel>Company Name <span className="text-red-500">*</span></FormLabel>
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
                <FormLabel>Email <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input {...field} type="email" placeholder="name@company.com" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cacNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CAC Number <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g. RC 1210548 or BN 373466" />
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
                <FormLabel>Password <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input {...field} type="password" placeholder="Enter your password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <ButtonWithLoader
            type="submit"
            className="w-full my-3"
            isPending={isExecuting}
            disabled={!form.formState.isValid || isExecuting}
          >
            Create account
          </ButtonWithLoader>
        </form>
      </Form>

      <div className="flex items-center flex-col gap-2">
        <p className="text-sm">
          Already have an account?{" "}
          <Link href="/company/signin" className="text-primary">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
