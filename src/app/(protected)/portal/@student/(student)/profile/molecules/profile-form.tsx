"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { toast } from "react-toastify";
import { Student } from "@/types";

import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";

import Input from "@/components/input";
import { useQueryClient } from "@tanstack/react-query";
import AvatarUpdate from "@/components/avatar-update";
import { StudentProfileSchema, updateStudentProfile } from "@/actions";
import { StudentProfileFormData } from "@/schemas";
import { useLogout } from "@/hooks/use-logout";
import PickMe from "./pick-me";
import { TagInput } from "@/components/tag-input";

export default function ProfileForm({
  student,
  onClose,
}: {
  student: Student;
  onClose: () => void;
}) {
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [documents, setDocuments] = useState<File | null>(null);

  const queryClient = useQueryClient();
  const logout = useLogout();

  const form = useForm<StudentProfileFormData>({
    resolver: zodResolver(StudentProfileSchema),
    defaultValues: {
      phone: "",
      bio: "",
      // goals: "",
      softSkills: [],
      techSkills: [],
      preferredIndustry: "",
      address: "",
      dob: "",
    },
  });

  const { execute: updateProfileAction, isExecuting } = useAction(
    updateStudentProfile,
    {
      onSuccess() {
        toast.success("Profile updated successfully!");
        queryClient.invalidateQueries({ queryKey: ["student-profile"] });
        onClose();
      },
      onError(err) {
        console.error("Failed to update profile", err);
        toast.error("Profile update failed");
      },
    },
  );

  useEffect(() => {
    if (student) {
      form.reset({
        phone: student.phone || "",
        bio: student.bio || "",
        techSkills: student.techSkills || [],
        softSkills: student.softSkills || [],
        preferredIndustry: student.preferredIndustry || "",
      });
    }
  }, [student, form]);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<File | null>>,
  ) => {
    if (e.target.files?.[0]) setter(e.target.files[0]);
  };

  const onSubmit = (data: StudentProfileFormData) => {
    const payload = { ...data, profileImage, documents };
    updateProfileAction(payload);
  };

  return (
    // <div className="max-w-5xl mx-auto mt-8 p-8 bg-white rounded-lg shadow-md">
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Profile Image Upload */}
        {/* <AvatarUpdate /> */}

        {/* Basic Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your first name" {...field} />
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
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your last name" {...field} />
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
                  <Input disabled type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter phone number"
                    {...field}
                    wrapperClassName="rounded-lg"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="preferredIndustry"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preferred Industry</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    <option value="">Select an industry</option>
                    <option value="Technology">Technology</option>
                    <option value="Finance">Finance</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Education">Education</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Retail">Retail</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Skills + Goals */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="softSkills"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Soft Skills</FormLabel>
                <FormControl className="">
                  <TagInput
                    value={Array.isArray(field.value) ? field.value : []}
                    onChange={field.onChange}
                    placeholder="Add a soft skill (e.g communication, teamwork)"
                    color="purple"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="techSkills"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Technical Skills</FormLabel>
                <FormControl>
                  <TagInput
                    value={Array.isArray(field.value) ? field.value : []}
                    onChange={field.onChange}
                    placeholder="Add a technical skill (e.g JavaScript, React)"
                    color="blue"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* <FormField
            control={form.control}
            name="goals"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Goals</FormLabel>
                <FormControl>
                  <Input
                    placeholder="E.g contribute to open-source projects"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}

          <FormField
            control={form.control}
            name="dob"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of Birth</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    placeholder="Enter date of birth"
                    {...field}
                    wrapperClassName="rounded-lg"
                  />
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
                  <Input
                    placeholder="Enter address (e.g 123 Main St, City, Country)"
                    {...field}
                    wrapperClassName="rounded-lg"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Bio + Documents */}

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio & Work Experience</FormLabel>
              <FormControl>
                <Textarea
                  rows={5}
                  placeholder="Tell us about your background, projects, and work experience..."
                  {...field}
                  className="full shadow-none rounded-2xl text-muted-foreground text-sm placeholder:text-gray-400 placeholder:text-sm"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Actions */}
        <div className="flex justify-between items-center">
          <div className="space-x-2">
            <Button type="submit" disabled={isExecuting} size="sm">
              {isExecuting ? "Updating..." : "Update Profile"}
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
          <Button
            type="button" // 👈 make sure it's not "submit"
            size="sm"
            variant="destructive"
            onClick={logout}
          >
            Logout
          </Button>
        </div>
      </form>
    </Form>
    // </div>
  );
}
