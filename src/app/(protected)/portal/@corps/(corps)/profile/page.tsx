"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { toast } from "react-toastify";
import { z } from "zod";
import { useFetchCorpsProfile } from "@/queries";
import { updateCorpsProfile } from "@/actions";
import { Wrapper } from "@/components/wrapper";
import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import Input from "@/components/input";
import { NIGERIAN_STATES } from "@/constants";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const profileSchema = z.object({
  firstName: z.string().min(1, "Required"),
  lastName: z.string().min(1, "Required"),
  phone: z.string().optional(),
  stateOfDeployment: z.string().optional(),
  nyscRegNumber: z.string().optional(),
  batchYear: z.string().optional(),
  stream: z.enum(["A", "B"]).optional(),
  school: z.string().optional(),
  graduationYear: z.string().optional(),
  gender: z.string().optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function CorpsProfilePage() {
  const { data, isLoading } = useFetchCorpsProfile();
  const corps = data?.corps ?? data;

  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    values: {
      firstName: corps?.firstName ?? "",
      lastName: corps?.lastName ?? "",
      phone: corps?.phone ?? "",
      stateOfDeployment: corps?.stateOfDeployment ?? "",
      nyscRegNumber: corps?.nyscRegNumber ?? "",
      batchYear: corps?.batchYear ?? "",
      stream: corps?.stream ?? undefined,
      school: corps?.school ?? "",
      graduationYear: corps?.graduationYear ?? "",
      gender: corps?.gender ?? "",
    },
  });

  const { execute, isExecuting } = useAction(updateCorpsProfile, {
    onSuccess: () => toast.success("Profile updated"),
    onError: (e) => toast.error(e?.error?.serverError ?? "Failed to update profile"),
  });

  if (isLoading) return (
    <div className="flex justify-center items-center min-h-screen">
      <Spinner />
    </div>
  );

  return (
    <Wrapper className="pt-14 pb-10 max-w-2xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">My Profile</h1>
          <p className="text-sm text-muted-foreground mt-1">Update your personal and NYSC information</p>
        </div>

        <div className="bg-white rounded-xl border p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit((v) => execute(v))} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="firstName" render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="lastName" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <FormField control={form.control} name="phone" render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl><Input {...field} placeholder="+234..." /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="gender" render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <FormControl>
                    <select {...field} className="w-full border rounded-md px-3 py-2 text-sm">
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <div className="border-t pt-4">
                <p className="text-sm font-semibold text-gray-700 mb-4">NYSC Information</p>
                <div className="space-y-4">
                  <FormField control={form.control} name="nyscRegNumber" render={({ field }) => (
                    <FormItem>
                      <FormLabel>NYSC Reg. Number</FormLabel>
                      <FormControl><Input {...field} placeholder="e.g. LC/23A/1234" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="batchYear" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Batch Year</FormLabel>
                        <FormControl><Input {...field} placeholder="e.g. 2024" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="stream" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stream</FormLabel>
                        <FormControl>
                          <select {...field} className="w-full border rounded-md px-3 py-2 text-sm">
                            <option value="">Select stream</option>
                            <option value="A">Stream A</option>
                            <option value="B">Stream B</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <FormField control={form.control} name="stateOfDeployment" render={({ field }) => (
                    <FormItem>
                      <FormLabel>State of Deployment</FormLabel>
                      <FormControl>
                        <select {...field} className="w-full border rounded-md px-3 py-2 text-sm">
                          <option value="">Select state</option>
                          {NIGERIAN_STATES.map((s) => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm font-semibold text-gray-700 mb-4">Academic Information</p>
                <div className="space-y-4">
                  <FormField control={form.control} name="school" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Institution</FormLabel>
                      <FormControl><Input {...field} placeholder="University/Polytechnic name" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="graduationYear" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Graduation Year</FormLabel>
                      <FormControl><Input {...field} placeholder="e.g. 2023" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              </div>

              <Button type="submit" disabled={isExecuting} className="w-full">
                {isExecuting ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </Wrapper>
  );
}
