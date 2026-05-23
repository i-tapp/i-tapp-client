"use client";

import Input from "@/components/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { corpsInfoSchema, CorpsInfoSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue",
  "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT",
  "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi",
  "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo",
  "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara",
];

export default function CorpsNyscInfoStep({
  onNext,
  onBack,
}: {
  onNext: (data: CorpsInfoSchema) => void;
  onBack: () => void;
}) {
  const form = useForm<CorpsInfoSchema>({
    resolver: zodResolver(corpsInfoSchema),
    mode: "onSubmit",
    defaultValues: {
      stateOfDeployment: "", stateCode: "", nyscRegNumber: "",
      batchYear: "", stream: undefined, courseOfStudy: "",
      degreeType: undefined, school: "", graduationYear: "", gpa: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onNext)} className="flex flex-col gap-4" id="corps-nysc-info-form">
        <p className="text-sm text-muted-foreground -mt-2 mb-1">Your NYSC deployment and academic background helps us match you with the right PPA.</p>

        {/* NYSC Details */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">NYSC Details</h3>
          <div className="flex gap-4">
            <FormField control={form.control} name="stateOfDeployment" render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>State of Deployment</FormLabel>
                <FormControl>
                  <select className="w-full rounded-md border border-border bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" {...field} value={field.value ?? ""}>
                    <option value="" disabled>Select state</option>
                    {NIGERIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="stateCode" render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>State Code <span className="text-muted-foreground">(optional)</span></FormLabel>
                <FormControl><Input placeholder="e.g. LG/24A/1234" {...field} value={field.value ?? ""} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>

          <FormField control={form.control} name="nyscRegNumber" render={({ field }) => (
            <FormItem>
              <FormLabel>NYSC Registration Number</FormLabel>
              <FormControl><Input placeholder="e.g. LG/24A/1234567" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <div className="flex gap-4">
            <FormField control={form.control} name="batchYear" render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Batch Year</FormLabel>
                <FormControl><Input placeholder="e.g. 2024" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="stream" render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Stream</FormLabel>
                <FormControl>
                  <select className="w-full rounded-md border border-border bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" {...field} value={field.value ?? ""}>
                    <option value="" disabled>Select stream</option>
                    <option value="A">Stream A</option>
                    <option value="B">Stream B</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </div>

        {/* Academic Background */}
        <div className="space-y-3 pt-2 border-t">
          <h3 className="text-sm font-semibold text-foreground pt-2">Academic Background</h3>
          <FormField control={form.control} name="school" render={({ field }) => (
            <FormItem>
              <FormLabel>Institution</FormLabel>
              <FormControl><Input placeholder="e.g. University of Lagos" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="courseOfStudy" render={({ field }) => (
            <FormItem>
              <FormLabel>Course of Study</FormLabel>
              <FormControl><Input placeholder="e.g. Computer Science" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <div className="flex gap-4">
            <FormField control={form.control} name="degreeType" render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Degree Type</FormLabel>
                <FormControl>
                  <select className="w-full rounded-md border border-border bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" {...field} value={field.value ?? ""}>
                    <option value="" disabled>Select type</option>
                    <option value="OND">OND</option>
                    <option value="HND">HND</option>
                    <option value="BSC">BSC</option>
                    <option value="MSC">MSC</option>
                    <option value="PGDIP">PGDIP</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="graduationYear" render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Graduation Year</FormLabel>
                <FormControl><Input placeholder="e.g. 2023" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="gpa" render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>CGPA <span className="text-muted-foreground">(optional)</span></FormLabel>
                <FormControl><Input placeholder="e.g. 3.8" {...field} value={field.value ?? ""} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </div>
      </form>
    </Form>
  );
}
