import Input from "@/components/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useFetchMyProfile } from "@/hooks/query";
import { schoolInfoSchema, SchoolInfoSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export default function SchoolInfoStep({
  onBack,
  onNext,
}: {
  onNext: (data?: any) => void;
  onBack: () => void;
}) {
  const { data } = useFetchMyProfile();
  const form = useForm<SchoolInfoSchema>({
    resolver: zodResolver(schoolInfoSchema),
    mode: "onSubmit",
    values: {
      school: data?.student?.school ?? "",
      courseOfStudy: data?.student?.courseOfStudy ?? "",
      level: "",
      gpa: "",
      degreeType: "OND",
      graduationYear: "",
    },
  });

  console.log("School Info Step - default values:", data);
  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onNext)}
          className="flex flex-col gap-4"
          id="school-info-step-form"
        >
          <FormField
            control={form.control}
            name="school"
            render={({ field }) => (
              <FormItem>
                <FormLabel>School Name</FormLabel>
                <FormControl>
                  <Input
                    // disabled
                    readOnly
                    placeholder="e.g University of Benin"
                    {...field}
                    className="bg-muted/40 cursor-not-allowed"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="courseOfStudy"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course of Study</FormLabel>
                <FormControl>
                  <Input placeholder="e.g Computer Science" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <GroupItem>
            <FormField
              control={form.control}
              name="level"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Current Level</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g 200" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gpa"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="line-clamp-2">
                    Current GPA (Optional)
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="e.g 3.5" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </GroupItem>

          <GroupItem>
            <FormField
              control={form.control}
              name="degreeType"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Degree Type</FormLabel>
                  <FormControl>
                    <select
                      className="w-full rounded-md border border-border bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                      {...field}
                      value={field.value ?? ""}
                    >
                      <option value="" disabled>
                        Select degree type
                      </option>
                      <option value="OND">OND</option>
                      <option value="BSC">BSC</option>
                      <option value="MSC">MSC</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="graduationYear"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Graduation Year</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g 2024" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </GroupItem>
        </form>
      </Form>
    </>
  );
}

const GroupItem = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex w-full flex-row gap-4">{children}</div>;
};
