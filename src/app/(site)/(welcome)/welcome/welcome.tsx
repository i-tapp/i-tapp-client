"use client";

import { Users, GraduationCapIcon, GraduationCap } from "lucide-react";
import { Card } from "../company-onboarding/company-onboarding-page";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ForStudentsData, forStudentsSchema } from "@/schemas/site.schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Input from "@/components/input";
import { Button } from "@/components/ui/button";
import { createStudent } from "@/actions";
import { useAction } from "next-safe-action/hooks";
import { toast } from "react-toastify";

export default function Welcome() {
  const form = useForm<ForStudentsData>({
    resolver: zodResolver(forStudentsSchema),
    mode: "onChange",
    defaultValues: {
      courseOfStudy: "",
      email: "",
      firstName: "",
      lastName: "",
      school: "",
      matriculationNumber: "",
    },
  });

  const { execute, isExecuting, hasErrored, result } = useAction(
    createStudent,
    {
      onSuccess: (data) => {
        toast.success("Form submitted successfully");
        // console.log("Form submitted successfully", data);
        form.reset();
      },
      onError: (error) => {
        toast.error("Failed to submit form");
        // console.error("Error submitting form;", error);
      },
    },
  );

  const isDirty = form.formState.isDirty;

  return (
    <div className="flex flex-col gap-6">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-bold">Welcome to I-TAPP</h1>
        <p className="text-sm text-muted-foreground">
          Connect your organization with high-potential students. Complete the
          Onboarding form and start engaging with next generation of Talent.
        </p>
      </div>

      <Card title="For Students" icon={<GraduationCap className="h-4 w-4" />}>
        <div className="mb-4 text-sm text-muted-foreground">
          If you&apos;re a student looking for SIWES placement opportunities,
          please fill out this form to get started. Our team will review your
          submission and connect you with potential companies offering SIWES
          placements.
        </div>
        <p className="mb-4 text-sm text-muted-foreground">
          {hasErrored && result.validationErrors?._errors}
        </p>
        <Form {...form}>
          <form
            className="flex flex-col gap-4"
            onSubmit={form.handleSubmit(
              (values) => {
                execute(values);
                // console.log(values);
              },
              (errors) => {
                // console.error("Form errors:", errors);
              },
            )}
            id="create-student-form"
          >
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
                      placeholder="samueladebayo@email.com"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Samuel" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Adebayo" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="school"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>School</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Kaduna State University" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="matriculationNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Matric number</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="KASU/CSC/21/0456" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="courseOfStudy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course of study</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Computer Science" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isExecuting}
              form="create-student-form"
            >
              {isExecuting ? "Submitting..." : " Submit"}
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  );
}
