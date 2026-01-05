"use client";

import React from "react";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";

// import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { signinSchema } from "@/lib/validations/auth";
import { ButtonWithLoader } from "@/components/button-with-loader";

import { toast } from "react-toastify";

import { signinStudent } from "@/actions/auth";
import { useStudentStore } from "@/lib/store/student";
import Input from "@/components/input";

export function StudentSignIn() {
  const router = useRouter();
  const setStudent = useStudentStore((s) => s.setStudent);

  const form = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: { email: "", password: "" },
    mode: "onChange", // better UX: validates while typing
  });

  const { execute, isExecuting, hasErrored, result } = useAction(
    signinStudent,
    {
      onSuccess(data) {
        const user = data?.data?.user;
        const profile = data?.data?.profile;

        console.log("userrrrrrr", user);
        setStudent({ ...user, ...profile });

        toast.success("Welcome back!");
        router.push("/portal/find-it-space");
        // router.refresh();
      },
      onError(error) {
        toast.error(error?.error?.serverError ?? "Login failed. Try again.");
        console.error("Student login error:", error);
      },
    }
  );

  return (
    <div className="w-full max-w-[350px] m-auto flex flex-col">
      <div className="flex flex-col gap-2 items-center mb-6">
        <h1 className="text-xl font-bold">Log in to your account</h1>
        <p className="text-sm text-muted-foreground">Welcome back!</p>
      </div>

      {hasErrored && (
        <p className="text-red-500 text-sm font-medium mb-2 text-center">
          {result?.serverError ?? "Something went wrong. Please try again."}
        </p>
      )}

      <Form {...form}>
        <form
          className="flex flex-col gap-4"
          onSubmit={form.handleSubmit((values) => execute(values))}
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter your email" />
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
                  <Input type="password" placeholder="********" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-row justify-between text-sm">
            <div className="flex flex-row justify-center gap-1">
              <input type="checkbox" />
              Remember me
            </div>

            <Link href={"/forgot-password"} className="text-primary">
              Forgot Password?
            </Link>
          </div>

          <ButtonWithLoader
            type="submit"
            disabled={!form.formState.isValid}
            isPending={isExecuting}
            className="w-full text-white"
          >
            Sign In
          </ButtonWithLoader>
        </form>
      </Form>

      <p className="text-sm text-center mt-6">
        Don’t have an account yet?{" "}
        <Link href="/signup" className="text-primary font-medium">
          Sign up
        </Link>
      </p>
    </div>
  );
}
