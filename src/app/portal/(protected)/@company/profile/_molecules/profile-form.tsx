"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Upload } from "lucide-react";
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
import { on } from "events";

export type ProfileFormData = z.infer<typeof companyProfileSchema>;

export default function ProfileForm({ onClose }: { onClose: () => void }) {
  const company = useCompanyStore((s) => s.company);
  const { data: companyProfile, isLoading } = useFetchCompanyProfile();

  const queryClient = useQueryClient();

  const [logoImage, setLogoImage] = useState<File | null>(null);
  const [bannerImage, setBannerImage] = useState<File | null>(null);

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

  // Memoized previews
  const logoPreview = useMemo(
    () => (logoImage ? URL.createObjectURL(logoImage) : null),
    [logoImage]
  );

  const bannerPreview = useMemo(
    () => (bannerImage ? URL.createObjectURL(bannerImage) : null),
    [bannerImage]
  );

  // File change handler
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
    const file = e.target.files?.[0];
    if (file) setter(file);
  };

  // Submit handler
  const onSubmit = (data: ProfileFormData) => {
    updateProfile({
      ...data,
      logoImage: logoImage ?? undefined,
      bannerImage: bannerImage ?? undefined,
    });
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Banner Upload */}
        <label className="flex w-full h-40 bg-gray-100 rounded-md cursor-pointer items-center justify-center relative overflow-hidden">
          {bannerPreview || companyProfile?.bannerUrl ? (
            <Image
              src={bannerPreview ?? companyProfile?.bannerUrl!}
              alt="Banner"
              fill
              className="object-cover"
            />
          ) : (
            <div className="text-center text-gray-600">
              <Upload size={40} className="mx-auto" />
              <p>Upload banner image</p>
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, setBannerImage)}
            className="hidden"
          />
        </label>

        {/* Logo Upload */}
        <label className="cursor-pointer w-24 h-24 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center overflow-hidden">
          {logoPreview || companyProfile?.logoUrl ? (
            <Image
              src={logoPreview ?? companyProfile?.logoUrl!}
              alt="Logo"
              width={100}
              height={100}
              className="object-cover"
            />
          ) : (
            <div className="flex flex-col items-center text-gray-500">
              <Upload size={18} />
              <span className="text-xs">Logo</span>
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, setLogoImage)}
            className="hidden"
          />
        </label>

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
