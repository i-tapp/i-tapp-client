"use client";

import Input from "@/components/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { corpsPersonalInfoSchema, CorpsPersonalInfoSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue",
  "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT",
  "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi",
  "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo",
  "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara",
];

export default function CorpsPersonalInfoStep({
  onNext,
}: {
  onNext: (data: CorpsPersonalInfoSchema) => void;
  onBack: () => void;
}) {
  const form = useForm<CorpsPersonalInfoSchema>({
    resolver: zodResolver(corpsPersonalInfoSchema),
    mode: "onSubmit",
    defaultValues: { firstName: "", lastName: "", phone: "", gender: undefined },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onNext)} className="flex flex-col gap-4" id="corps-personal-info-form">
        <div className="flex gap-4">
          <FormField control={form.control} name="firstName" render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>First Name</FormLabel>
              <FormControl><Input placeholder="e.g. Amaka" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="lastName" render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Last Name</FormLabel>
              <FormControl><Input placeholder="e.g. Okonkwo" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <FormField control={form.control} name="phone" render={({ field }) => (
          <FormItem>
            <FormLabel>Phone Number</FormLabel>
            <FormControl><Input placeholder="e.g. +234 801 234 5678" {...field} /></FormControl>
            <FormMessage />
            <p className="text-xs text-muted-foreground mt-1">Use a number reachable by employers.</p>
          </FormItem>
        )} />

        <FormField control={form.control} name="gender" render={({ field }) => (
          <FormItem>
            <FormLabel>Gender</FormLabel>
            <FormControl>
              <select className="w-full rounded-md border border-border bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" {...field} value={field.value ?? ""}>
                <option value="" disabled>Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
      </form>
    </Form>
  );
}
