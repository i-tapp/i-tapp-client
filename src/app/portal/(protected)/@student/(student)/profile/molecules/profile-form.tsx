"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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

import { logout } from "@/actions/auth";
import Input from "@/components/input";
import { StudentProfileSchema, updateStudentProfile } from "@/actions/student";
import { useQueryClient } from "@tanstack/react-query";
import AvatarUpdate from "@/components/avatar-update";

type ProfileFormData = z.infer<typeof StudentProfileSchema>;

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

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(StudentProfileSchema),
    defaultValues: {
      phone: "",
      bio: "",
      // goals: "",
      softSkills: [],
      techSkills: [],
      preferredIndustry: "",
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
    }
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
    setter: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
    if (e.target.files?.[0]) setter(e.target.files[0]);
  };

  const onSubmit = (data: ProfileFormData) => {
    const payload = { ...data, profileImage, documents };
    updateProfileAction(payload);
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  return (
    // <div className="max-w-5xl mx-auto mt-8 p-8 bg-white rounded-lg shadow-md">
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Profile Image Upload */}
        <AvatarUpdate />

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
                  <Input placeholder="Enter phone number" {...field} />
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
                <FormControl>
                  <Input
                    placeholder="E.g communication, teamwork"
                    value={
                      Array.isArray(field.value) ? field.value.join(", ") : ""
                    }
                    onChange={(e) =>
                      field.onChange(
                        e.target.value.split(",").map((s) => s.trim())
                      )
                    }
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
                  <Input
                    placeholder="E.g JavaScript, React, Node.js"
                    value={
                      Array.isArray(field.value) ? field.value.join(", ") : ""
                    }
                    onChange={(e) =>
                      field.onChange(
                        e.target.value.split(",").map((s) => s.trim())
                      )
                    }
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
                  <Input
                    placeholder="E.g healthcare, IT, education"
                    {...field}
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
        </div>

        {/* Bio + Documents */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio & Work Experience</FormLabel>
                <FormControl>
                  <Textarea
                    rows={5}
                    placeholder="Tell us something about yourself"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="border-2 border-dashed rounded-md p-4">
            <h3 className="text-sm font-medium mb-2">Upload IT Letter</h3>
            <label className="flex flex-col items-center justify-center w-full h-40 border border-gray-300 border-dashed rounded-md cursor-pointer">
              {documents ? (
                <p>{documents.name}</p>
              ) : (
                <>
                  <Upload size={24} />
                  <p className="text-gray-500 text-sm">Upload</p>
                </>
              )}
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={(e) => handleFileChange(e, setDocuments)}
                className="hidden"
              />
            </label>

            {/* {student?.documentUrls?.length > 0 && (
              <div className="mt-2 space-y-1">
                <h4 className="text-sm font-medium">Your Documents:</h4>
                {student.documentUrls.map((url: string, idx: number) => (
                  <a
                    key={idx}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline text-sm block"
                  >
                    View Document
                  </a>
                ))}
              </div>
            )} */}
          </div>
        </div>

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
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </form>
    </Form>
    // </div>
  );
}
