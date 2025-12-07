"use client";

import React from "react";
import { Header } from "../header";
import { Nav } from "../company-sidebar";
import { companyNavLinks } from "@/constants";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/tailwind";

export function CompanyLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const profile = pathname.includes("/portal/profile");
  const candidates = pathname.includes("/portal/candidates");
  return (
    <div className="min-h-screen flex flex-col">
      {/* Fixed Header */}
      <Header link={companyNavLinks} />

      {/* Page content */}
      <div className="flex pt-20 px-2 sm:px-4 lg:px-16">
        {/* Sidebar (always open on lg+, hidden on smaller) */}
        <aside className="fixed top-20 hidden lg:flex w-64 h-[calc(100vh-80px)]">
          <Nav />
        </aside>
        {/* Main content */}
        <main
          className={cn(
            "flex-1 overflow-y-auto px-1 sm:px-3 lg:px-8",
            profile || candidates ? " " : "lg:ml-64 "
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
