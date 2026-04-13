import Input from "@/components/input";
import {
  Form,
  FormField,
  FormLabel,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useFetchMyProfile, useFetchProfile } from "@/hooks/query";
import { useStudentStore } from "@/lib/store";
import { preferencesSchema, PreferencesSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Laptop, Building, ArrowRightLeft } from "lucide-react";
import { useForm } from "react-hook-form";

const workLocations = [
  { value: "remote", title: "Remote", icon: Laptop },
  { value: "onsite", title: "On-site", icon: Building },
  { value: "hybrid", title: "Hybrid", icon: ArrowRightLeft },
] as const;

export default function PreferencesStep({
  onBack,
  onNext,
}: {
  onNext: (data?: any) => void;
  onBack: () => void;
}) {
  const form = useForm<PreferencesSchema>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      preferredIndustry: [],
      availableStartDate: "",
      internshipDuration: undefined,
      preferredWorkMode: undefined,
    },
    mode: "onSubmit",
  });

  return (
    <>
      <Form {...form}>
        <form
          className="flex flex-col gap-2"
          onSubmit={form.handleSubmit((data) => onNext(data))}
          id="preferences-step-form"
        >
          <FormField
            control={form.control}
            name="preferredWorkMode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preferred Work Location</FormLabel>
                <FormControl>
                  <div className="grid grid-cols-3 gap-3">
                    {workLocations.map((location) => {
                      const selected = field.value === location.value;
                      return (
                        <WorkLocationItem
                          key={location.value}
                          title={location.title}
                          icon={location.icon}
                          selected={selected}
                          onSelect={() => field.onChange(location.value)}
                        />
                      );
                    })}
                  </div>
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
                <FormLabel>Industry Interests</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., Software Development, Marketing, Design"
                    value={(field.value ?? []).join(", ")}
                    onChange={(e) => {
                      const raw = e.target.value;
                      const values = raw.split(",").map((v) => v.trim());
                      // .filter(Boolean);
                      field.onChange(values);
                    }}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="internshipDuration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration</FormLabel>
                <FormControl>
                  <select
                    className="w-full rounded-md border border-border bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    {...field}
                    value={field.value ?? ""}
                  >
                    <option value="" disabled>
                      Select duration
                    </option>
                    <option value="1-3 months">1-3 months</option>
                    <option value="3-6 months">3-6 months</option>
                    <option value="6+ months">6+ months</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="availableStartDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Available Start Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </>
  );
}

function WorkLocationItem({
  title,
  icon: Icon,
  selected,
  onSelect,
}: {
  title: string;
  icon: any;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`flex flex-col items-center justify-center gap-2 rounded-lg border bg-primary/10 w-full py-3 text-sm
        ${selected ? "border-primary" : "border-border"}`}
    >
      <Icon className="h-5 w-5" />
      {title}
    </button>
  );
}
