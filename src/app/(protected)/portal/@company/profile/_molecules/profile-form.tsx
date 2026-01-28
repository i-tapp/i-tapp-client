"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useAction } from "next-safe-action/hooks";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import Input from "@/components/input";
import { Textarea } from "@/components/ui/textarea";

import { companyProfileSchema } from "@/lib/validations/auth";
import { useCompanyStore } from "@/lib/store/company";
import { updateCompanyProfile } from "@/actions/company";
import z from "zod";
import { useFetchCompanyProfile } from "@/hooks/query";
import { Spinner } from "@/components/spinner";
import { useQueryClient } from "@tanstack/react-query";

export type ProfileFormData = z.infer<typeof companyProfileSchema>;

export default function ProfileForm({ onClose }: { onClose: () => void }) {
  const company = useCompanyStore((s) => s.company);
  const { data: companyProfile, isLoading } = useFetchCompanyProfile();

  const queryClient = useQueryClient();

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(companyProfileSchema),
    defaultValues: {
      website: "",
      address: "",
      description: "",
    },
  });

  // next-safe-action handler
  const { execute: updateProfile, isExecuting } = useAction(
    updateCompanyProfile,
    {
      onSuccess() {
        toast.success("Profile updated.");
        queryClient.invalidateQueries({ queryKey: ["company-profile"] });
        onClose();
      },
      onError() {
        toast.error("Failed to update profile.");
      },
    }
  );

  // populate on initial load
  useEffect(() => {
    if (companyProfile) {
      form.reset({
        website: companyProfile.website ?? "",
        address: companyProfile.address ?? "",
        description: companyProfile.description ?? "",
      });
    }
  }, [companyProfile, form]);

  // Submit handler
  const onSubmit = (data: ProfileFormData) => {
    updateProfile({
      ...data,
    });
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Website & Address */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com" {...field} />
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
                  <Input placeholder="Enter address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  rows={5}
                  placeholder="Describe your company"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Buttons */}
        <div className="flex gap-3">
          <Button
            type="submit"
            //  disabled={isExecuting}
          >
            {/* {isExecuting ? "Updating..." : "Update Profile"} */}
            Update Profile
          </Button>

          <Button
            type="button"
            variant="secondary"
            onClick={() => form.reset()}
          >
            Reset
          </Button>
        </div>
      </form>
    </Form>
  );
}
