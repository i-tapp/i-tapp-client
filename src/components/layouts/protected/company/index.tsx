"use client";

import React from "react";
import { Header } from "../header";
import { Nav } from "../company-sidebar";
import { companyNavLinks } from "@/constants";

export function CompanyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Fixed Header */}
      <Header link={companyNavLinks} />

      {/* Page content */}
      <div className="flex pt-[80px] px-2 sm:px-4 lg:px-16">
        {/* Sidebar (always open on lg+, hidden on smaller) */}
        <aside className="fixed top-[80px] hidden lg:flex w-64 h-[calc(100vh-80px)]">
          <Nav />
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto lg:ml-64 px-1 sm:px-3 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
