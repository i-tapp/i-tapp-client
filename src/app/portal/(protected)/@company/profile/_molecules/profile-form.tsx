"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Upload } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { companyProfileSchema } from "@/lib/validations/auth";
import { useGlobal } from "@/context/GlobalContext";
import { toast } from "react-toastify";
import Image from "next/image";
import { useCompanyStore } from "@/lib/store/company";

type ProfileFormData = z.infer<typeof companyProfileSchema>;

export default function ProfileForm() {
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<File | null>(null);

  // ✅ selector style to avoid unnecessary re-renders
  const company = useCompanyStore((s) => s.company);

  const { updateCompanyProfile } = useGlobal();

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(companyProfileSchema),
    defaultValues: {
      phone: "",
      website: "",
      address: "",
      studentCapacity: undefined,
      description: "",
    },
  });

  const { execute: updateProfileAction, status } = useAction(
    updateCompanyProfile,
    {
      onSuccess() {
        toast.success("Company profile updated successfully.");
      },
      onError(error) {
        console.error("Failed to update profile", error);
        toast.error("Failed to update company profile. Please try again.");
      },
    }
  );

  const onSubmit = (data: ProfileFormData) => {
    updateProfileAction({ ...data, profileImage, backgroundImage });
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
    if (e.target.files?.[0]) setter(e.target.files[0]);
  };

  // ✅ populate text fields only
  useEffect(() => {
    if (company) {
      form.reset({
        phone: company.phone ?? "",
        website: company.website ?? "",
        address: company.address ?? "",
        studentCapacity: company.studentCapacity,
        description: company.description ?? "",
      });
    }
  }, [company, form]);

  // ✅ memoize previews
  const profilePreview = useMemo(
    () => (profileImage ? URL.createObjectURL(profileImage) : null),
    [profileImage]
  );
  const backgroundPreview = useMemo(
    () => (backgroundImage ? URL.createObjectURL(backgroundImage) : null),
    [backgroundImage]
  );

  return (
    // <div className="max-w-5xl mx-auto p-8 bg-white rounded-lg shadow-md">
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Banner Upload */}
        <label className="block w-full h-40 bg-gray-200 my-5 rounded-md flex items-center justify-center cursor-pointer">
          {backgroundPreview || company?.bannerUrl ? (
            <Image
              src={backgroundPreview ?? company!.bannerUrl}
              alt="Banner"
              fill
              className="object-cover rounded-md"
            />
          ) : (
            <div className="text-center">
              <Upload className="mx-auto mb-2" size={48} />
              <p className="text-gray-600">Click to upload banner image</p>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            aria-label="Upload banner image"
            onChange={(e) => handleFileChange(e, setBackgroundImage)}
            className="hidden"
          />
        </label>

        {/* Profile Picture Upload */}
        <label className="cursor-pointer w-[80px] h-[70px] border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
          {profilePreview || company?.logoUrl ? (
            <Image
              src={profilePreview ?? company!.logoUrl}
              alt="Profile"
              width={80}
              height={70}
              className="object-cover rounded-full"
            />
          ) : (
            <div className="flex flex-col items-center">
              <Upload size={16} />
              <span className="text-xs">Photo</span>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            aria-label="Upload profile image"
            onChange={(e) => handleFileChange(e, setProfileImage)}
            className="hidden"
          />
        </label>

        {/* Fields */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {["phone", "website", "address", "student_capacity"].map((field) => (
            <FormField
              key={field}
              control={form.control}
              name={field as keyof ProfileFormData}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="capitalize">{field.name}</FormLabel>
                  <FormControl>
                    <Input
                      type={
                        field.name === "studentCapacity" ? "number" : "text"
                      }
                      placeholder={`Enter ${field.name}`}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  rows={5}
                  placeholder="Enter a description of your company or services"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Actions */}
        <div className="flex gap-2">
          <Button type="submit" size="sm" disabled={status === "executing"}>
            {status === "executing" ? "Updating..." : "Update Profile"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => form.reset()}
          >
            Reset
          </Button>
        </div>
      </form>
    </Form>
    // </div>
  );
}
