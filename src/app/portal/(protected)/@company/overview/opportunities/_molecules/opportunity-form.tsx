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
import {
  OpportunityMode,
  OpportunityStatus,
  OpportunityType,
} from "@/types/enums";
import { Check } from "iconsax-reactjs";
import { Checkbox } from "@/components/ui/checkbox";
import { opportunityFormSchema } from "@/lib/validations/auth";

type FormValues = z.infer<typeof opportunityFormSchema>;
type OpportunityFormProps = {
  initialData?: FormValues;
  onSubmit: (data: FormValues) => void;
  onClose?: () => void;
};

export default function OpportunityForm({
  initialData,
  onSubmit,
  onClose,
}: OpportunityFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(opportunityFormSchema),
    defaultValues: initialData || {
      title: "",
      department: "",
      location: "",
      mode: "remote",
      type: OpportunityType.FULL_TIME,
      status: "draft",
      duration: 0,
      description: "",
      maxApplicants: undefined,
      applicationDeadline: undefined,
      autoClose: false,
      skills: [],
      requiresResume: false,
      requiresCoverLetter: false,
    },
  });
  const [customSkill, setCustomSkill] = useState("");

  const handleSubmit = (data: FormValues) => {
    onSubmit(data);
    console.log("Submitting Form", form);
  };

  const OpportunityTypeLabels = {
    [OpportunityType.FULL_TIME]: "Full-time",
    [OpportunityType.PART_TIME]: "Part-time",
    [OpportunityType.INTERNSHIP]: "Internship",
    [OpportunityType.CONTRACT]: "Contract",
  } as const;

  return (
    <div className="p-6 w-full max-w-6xl mx-auto">
      {/* Header */}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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
                          {Object.entries(OpportunityTypeLabels).map(
                            ([value, label]) => (
                              <SelectItem key={value} value={value}>
                                {label}
                              </SelectItem>
                            )
                          )}
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
                      <Input
                        type="number"
                        placeholder="e.g. 3"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 0)
                        }
                      />
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
                      <Checkbox
                        checked={field.value || false}
                        onCheckedChange={field.onChange}
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
                      <Checkbox
                        checked={field.value || false}
                        onCheckedChange={field.onChange}
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
                      <Checkbox
                        checked={field.value || false}
                        onCheckedChange={field.onChange}
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
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>

            <Button type="submit" className="gap-2 text-white">
              <Save size={18} />
              Save Changes
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
