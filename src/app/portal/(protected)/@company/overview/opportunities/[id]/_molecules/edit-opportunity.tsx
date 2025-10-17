"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useState } from "react";

export default function OpportunityForm() {
  const formSchema = z.object({
    title: z.string().min(1),
    department: z.string().min(1),
    location: z.string().min(1),
    mode: z.enum(["remote", "onsite", "hybrid"]),
    type: z.enum(["internship", "fulltime", "parttime", "contract"]),
    status: z.enum(["active", "draft", "closed", "paused"]),
    duration: z.number().min(1),
    description: z.string().min(1),
    maxApplicants: z.number().optional(),
    applicationDeadline: z.string().optional(),
    autoClose: z.boolean().optional(),
    requiresResume: z.boolean().optional(),
    requiresCoverLetter: z.boolean().optional(),
    skills: z.array(z.string()).optional(), // NEW: required skills
  });

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "Frontend Developer Intern",
      department: "Engineering",
      location: "San Francisco, CA",
      mode: "onsite",
      type: "internship",
      status: "active",
      duration: 3,
      description:
        "Seeking a talented Frontend intern to join our growing team. You'll help build UI components and work closely with senior engineers.",
      maxApplicants: 50,
      applicationDeadline: "2024-12-31",
      autoClose: false,
      requiresResume: true,
      requiresCoverLetter: false,
      skills: [], // initialize as empty
    },
  });
  const [customSkill, setCustomSkill] = useState("");

  const onSubmit = (data: FormValues) => {
    console.log("Form submitted:", data);
    // handle update logic here
  };

  return (
    <div className="p-6 w-full max-w-6xl mx-auto">
      {/* Header */}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Opportunity Details Section */}
          <div className="border-2 border-primary/20 rounded-lg bg-card p-6">
            <h2 className="text-xl font-bold text-foreground mb-6">
              Opportunity Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-4">
                    <FormLabel className="w-32">Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Job title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Department */}
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-4">
                    <FormLabel className="w-32">Department</FormLabel>
                    <FormControl>
                      <Input placeholder="Engineering" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Location */}
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-4">
                    <FormLabel className="w-32">Location</FormLabel>
                    <FormControl>
                      <Input placeholder="San Francisco, CA" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Mode */}
              <FormField
                control={form.control}
                name="mode"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-4">
                    <FormLabel className="w-32">Work Mode</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select mode" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="remote">Remote</SelectItem>
                          <SelectItem value="onsite">On-site</SelectItem>
                          <SelectItem value="hybrid">Hybrid</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Type */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-4">
                    <FormLabel className="w-32">Opportunity Type</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="internship">Internship</SelectItem>
                          <SelectItem value="fulltime">Full-time</SelectItem>
                          <SelectItem value="parttime">Part-time</SelectItem>
                          <SelectItem value="contract">Contract</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Status */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-4">
                    <FormLabel className="w-32">Status</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                          <SelectItem value="paused">Paused</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Duration */}
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-4">
                    <FormLabel className="w-32">Duration (months)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g. 3" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter job description..."
                        rows={6}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Application Settings Section */}
          <div className="border-2 border-primary/20 rounded-lg bg-card p-6">
            <h2 className="text-xl font-bold text-foreground mb-6">
              Application Settings
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Max Applicants */}
              <FormField
                control={form.control}
                name="maxApplicants"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maximum Applicants</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g. 50" {...field} />
                    </FormControl>
                    <p className="text-xs text-muted-foreground mt-1">
                      Leave empty for unlimited applicants
                    </p>
                  </FormItem>
                )}
              />

              {/* Application Deadline */}
              <FormField
                control={form.control}
                name="applicationDeadline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Application Deadline</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <p className="text-xs text-muted-foreground mt-1">
                      Applications will not be accepted after this date
                    </p>
                  </FormItem>
                )}
              />

              {/* Auto-close Option */}
              <FormField
                control={form.control}
                name="autoClose"
                render={({ field }) => (
                  <FormItem className="md:col-span-2 flex items-start gap-3">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value || false}
                        onChange={(e) => field.onChange(e.target.checked)}
                        className="mt-1"
                      />
                    </FormControl>
                    <div>
                      <FormLabel className="text-sm font-medium cursor-pointer">
                        Auto-close when maximum applicants reached
                      </FormLabel>
                      <p className="text-xs text-muted-foreground mt-1">
                        The opportunity will automatically close when the
                        maximum number of applicants is reached
                      </p>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="skills"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Required Skills</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. JavaScript, React, TypeScript"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-muted-foreground mt-1">
                      Enter the skills required for this opportunity.
                    </p>
                  </FormItem>
                )}
              />

              {/* Required Documents */}
              <FormField
                control={form.control}
                name="requiresResume"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-3 md:col-span-2">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value || false}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    </FormControl>
                    <FormLabel className="text-sm cursor-pointer">
                      Resume/CV required
                    </FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="requiresCoverLetter"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-3 md:col-span-2">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value || false}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    </FormControl>
                    <FormLabel className="text-sm cursor-pointer">
                      Cover letter required
                    </FormLabel>
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Link href="/portal/opportunities/details">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" className="gap-2">
              <Save size={18} />
              Save Changes
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
