"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Upload } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { toast } from "react-toastify";

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

import { useGlobal } from "@/context/GlobalContext";
import { logout } from "@/actions/auth";
import Input from "@/components/input";

const profileSchema = z.object({
  firstName: z.string().min(1, "Required").optional(),
  lastName: z.string().min(1, "Required").optional(),
  email: z.string().email("Invalid email").optional(),
  phoneNumber: z.string().optional(),
  bio: z.string().optional(),
  goals: z.string().optional(),
  softSkills: z.string().optional(),
  technicalSkills: z.string().optional(),
  preferredIndustry: z.string().optional(),
  profileImage: z.any().optional(),
  documents: z.any().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfileForm() {
  const { updateStudentProfile, student } = useGlobal();
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [documents, setDocuments] = useState<File | null>(null);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      bio: "",
      goals: "",
      softSkills: "",
      technicalSkills: "",
      preferredIndustry: "",
    },
  });

  const { execute: updateProfileAction, status } = useAction(
    updateStudentProfile,
    {
      onSuccess() {
        toast.success("Profile updated successfully!");
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
        firstName: student.firstName || "",
        lastName: student.lastName || "",
        email: student.email || "",
        phoneNumber: student.phoneNumber || "",
        bio: student.bio || "",
        goals: student.goals || "",
        softSkills: student.softSkills || "",
        technicalSkills: student.technicalSkills || "",
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
        <div className="flex items-center">
          <label className="cursor-pointer">
            <div className="w-[80px] h-[70px] border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
              {profileImage ? (
                <Image
                  src={URL.createObjectURL(profileImage)}
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
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, setProfileImage)}
              className="hidden"
            />
          </label>
        </div>

        {/* Basic Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FormField
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
          />
          <FormField
            control={form.control}
            name="phoneNumber"
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
                  <Input placeholder="E.g communication, teamwork" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="technicalSkills"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Technical Skills</FormLabel>
                <FormControl>
                  <Input
                    placeholder="E.g JavaScript, React, Node.js"
                    {...field}
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
          <FormField
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
          />
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

            {student?.documentUrls?.length > 0 && (
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
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center">
          <div className="space-x-2">
            <Button type="submit" disabled={status === "executing"} size="sm">
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
