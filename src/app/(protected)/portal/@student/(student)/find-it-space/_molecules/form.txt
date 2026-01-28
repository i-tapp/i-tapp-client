"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { TickCircle } from "iconsax-reactjs";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
// import { apply } from "@/api/actions/auth";
import { apply } from "@/actions/student";
// import { ButtonWithLoader } from "@/components/button-with-loader";

const formSchema = z.object({
  firstname: z.string().min(3),
  lastname: z.string().min(3),
  universityName: z.string({ required_error: "Required" }),
  email: z.string().email(),
  phoneNumber: z.string({ required_error: "Required" }),
});

export default function ApplicationForm({ id }) {
  const [success] = useState(false);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstname: "ffff",
      lastname: "ffff",
      universityName: "fff",
      email: "jutin2@gamil.com",
      phoneNumber: "dd444444444444d",
    },
  });

  const onSubmit = async (data) => {
    try {
      const response = await apply(id, data);
      console.log(response);
    } catch (error) {
      console.error("Error submitting application:", error);
      // Handle error
    }
  };

  const { execute, isExecuting, result, hasErrored } = useAction(apply, {
    onSuccess(data) {
      console.log("Application submitted successfully");
    },
    onError(error) {
      console.error("Error submitting application:", error);
    },
  });

  if (success) {
    return (
      <div className="flex flex-col w-96 bg-white p-5 xs:p-10 shadow-lg  m-auto gap-2">
        <div className="flex gap-4">
          <TickCircle color="#27AE60" variant="Bold" className=" size-9 " />
          <h6 className="text-sm font-bold self-center">
            Successfully applied
          </h6>
        </div>
      </div>
    );
  }

  const importProfileData = () => {};

  return (
    <div className="">
      <div className="flex justify-between">
        <div>
          <h6 className="text-h6 mb-2">Apply now</h6>
          <Checkbox onCheckedChange={importProfileData} />
          <span>import info from profile</span>
        </div>
      </div>
      {hasErrored && (
        <span className="text-danger font-semi-bold ">
          {result.serverError?.message}
        </span>
      )}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 mt-4"
        >
          <FormField
            control={form.control}
            name="firstname"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>First name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name="lastname"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>last name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="universityName"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Name of University</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <div className="flex-wrap flex gap-3 mt-4 sm:flex-nowrap ">
            <Button type="submit" className="mx-auto w-full" size="sm">
              Confirm
            </Button>
            <Button
              type="submit"
              size="sm"
              variant="outline"
              className="mx-auto border-black w-full"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
