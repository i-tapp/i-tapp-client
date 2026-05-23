"use client";

import Input from "@/components/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { corpsSkillsSchema, CorpsSkillsSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";


function TagInput({ value, onChange, placeholder }: { value: string[]; onChange: (v: string[]) => void; placeholder: string }) {
  return (
    <Input
      placeholder={placeholder}
      value={(value ?? []).join(", ")}
      onChange={(e) => {
        const raw = e.target.value;
        onChange(raw.split(",").map((v) => v.trim()));
      }}
    />
  );
}

export default function CorpsSkillsStep({
  onNext,
  onBack,
}: {
  onNext: (data: CorpsSkillsSchema) => void;
  onBack: () => void;
}) {
  const form = useForm<CorpsSkillsSchema>({
    resolver: zodResolver(corpsSkillsSchema),
    mode: "onSubmit",
    defaultValues: {
      techSkills: [], softSkills: [], bio: "",
      preferredIndustry: [], availableStartDate: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onNext)} className="flex flex-col gap-4" id="corps-skills-form">
        <FormField control={form.control} name="bio" render={({ field }) => (
          <FormItem>
            <FormLabel>Short Bio <span className="text-muted-foreground">(optional)</span></FormLabel>
            <FormControl>
              <textarea
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                placeholder="Tell employers a little about yourself — your background, interests, and what you bring to the table."
                rows={3}
                {...field}
                value={field.value ?? ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="techSkills" render={({ field }) => (
          <FormItem>
            <FormLabel>Technical Skills <span className="text-muted-foreground">(optional)</span></FormLabel>
            <FormControl>
              <TagInput value={field.value ?? []} onChange={field.onChange} placeholder="e.g. React, Python, AutoCAD, Excel" />
            </FormControl>
            <p className="text-xs text-muted-foreground mt-1">Separate with commas.</p>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="softSkills" render={({ field }) => (
          <FormItem>
            <FormLabel>Soft Skills <span className="text-muted-foreground">(optional)</span></FormLabel>
            <FormControl>
              <TagInput value={field.value ?? []} onChange={field.onChange} placeholder="e.g. Communication, Teamwork, Leadership" />
            </FormControl>
            <p className="text-xs text-muted-foreground mt-1">Separate with commas.</p>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="preferredIndustry" render={({ field }) => (
          <FormItem>
            <FormLabel>Industry Interests</FormLabel>
            <FormControl>
              <TagInput value={field.value ?? []} onChange={field.onChange} placeholder="e.g. Technology, Finance, Healthcare" />
            </FormControl>
            <p className="text-xs text-muted-foreground mt-1">Industries you'd like your PPA to be in.</p>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="availableStartDate" render={({ field }) => (
          <FormItem>
            <FormLabel>Available Start Date</FormLabel>
            <FormControl><Input type="date" {...field} value={field.value ?? ""} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
      </form>
    </Form>
  );
}
