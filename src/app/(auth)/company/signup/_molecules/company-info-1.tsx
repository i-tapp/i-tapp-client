"use client";

import { useEffect, useRef, useState } from "react";
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
import { useSearchParams } from "next/navigation";
import { companySignup } from "@/actions";
import { companySignupSchema } from "@/schemas";
import { SignupSuccessModal } from "@/components/signup-success-modal";
import { FormErrorSummary } from "@/components/form-error-summary";
import {
  TURNSTILE_ENABLED,
  TurnstileWidget,
  type TurnstileHandle,
} from "@/components/turnstile-widget";

// Field name -> the label the person actually sees, for the error summary.
const LABELS = {
  name: "Company Name",
  email: "Email",
  cacNumber: "CAC Number",
  password: "Password",
};

type CompanySignupSchema = z.infer<typeof companySignupSchema>;

export function CompanyInfo1() {
  const searchParams = useSearchParams();
  const [showSuccess, setShowSuccess] = useState(false);
  // Cloudflare Turnstile bot check
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileHandle>(null);
  const waitingForCheck = TURNSTILE_ENABLED && !turnstileToken;

  useEffect(() => {
    const claim = searchParams.get("claim");
    if (claim) sessionStorage.setItem("listingClaimToken", claim);
  }, [searchParams]);

  const form = useForm<CompanySignupSchema>({
    mode: "onChange",
    resolver: zodResolver(companySignupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      cacNumber: "",
    },
  });

  const { execute, isExecuting, result, hasErrored } = useAction(
    companySignup,
    {
      onSuccess() {
        sessionStorage.removeItem("listingClaimToken");
        // No toast and no redirect here - SignupSuccessModal owns both now.
        // Redirecting here would unmount the modal before it could be read.
        setShowSuccess(true);
      },
      onError(error) {
        toast.error(error?.error?.serverError ?? "Sign up failed. Please try again.");
        // Turnstile tokens are single-use: get a fresh one for the next try.
        turnstileRef.current?.reset();
      },
    },
  );

  const onSubmit = (data: CompanySignupSchema) => {
    if (waitingForCheck) {
      toast.error("Please complete the security check first.");
      return;
    }
    const claimToken = sessionStorage.getItem("listingClaimToken") ?? undefined;
    execute({ ...data, claimToken, turnstileToken: turnstileToken ?? undefined });
  };

  return (
    <div className="w-full">
      {showSuccess && (
        <SignupSuccessModal
          message="Your company account has been created. Kindly log in to continue."
          redirectTo="/company/signin"
        />
      )}

      <FormErrorSummary
        errors={form.formState.errors}
        submitted={form.formState.isSubmitted}
        labels={LABELS}
      />

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
                <FormLabel>Company Name <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Company name" className="placeholder:text-muted-foreground/50" />
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
                  <Input
                    {...field}
                    type="email"
                    placeholder="e.g. name@company.com"
                    className="placeholder:text-muted-foreground/50"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* <FormField
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
          /> */}

          <FormField
            control={form.control}
            name="cacNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CAC Number <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g. RC 1210548 or BN 373466" />
                </FormControl>
                <p className="text-xs text-muted-foreground mt-1">RC or BN number as registered with CAC.</p>
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

          <TurnstileWidget ref={turnstileRef} onToken={setTurnstileToken} className="my-2" />

          <ButtonWithLoader
            type="submit"
            className="w-full my-3"
            isPending={isExecuting}
            disabled={isExecuting || waitingForCheck}
          >
            Sign up
          </ButtonWithLoader>
        </form>
      </Form>
    </div>
  );
}
