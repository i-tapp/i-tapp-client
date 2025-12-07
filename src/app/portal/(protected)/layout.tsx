import React from "react";
import { headers } from "next/headers";
import { CompanyLayout } from "@/components/layouts/protected/company";
import StudentLayout from "@/components/layouts/protected/student";

type UserRole = "company" | "student";

interface PortalLayoutProps {
  company: React.ReactNode;
  student: React.ReactNode;
  role: UserRole;
}

export default async function PortalLayout({
  company,
  student,
}: PortalLayoutProps) {
  const headersList = await headers();
  const role = headersList.get("x-user-role")?.toLowerCase() as UserRole | null;

  console.log("PortalLayout role:", role);

  if (role === "student") {
    return <StudentLayout>{student}</StudentLayout>;
  }

  if (role === "company") {
    return <CompanyLayout>{company}</CompanyLayout>;
  }

  // fallback if role missing or invalid
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Unauthorized</h1>
        <p className="text-muted-foreground">
          Please sign in to access this area.
        </p>
      </div>
    </div>
  );
}
