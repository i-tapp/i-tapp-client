"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Briefcase, Element } from "iconsax-reactjs";
import Link from "next/link";
import useIsResponsive from "@/utils/responsive";

import { Menu, X } from "lucide-react";
import SideNav from "../company-sidenav";

const links = [
  {
    label: "Dashboard",
    href: "/portal/dashboard",
    icon: <Element size={22} />,
  },
  {
    label: "Opportunities",
    href: "/portal/opportunities",
    icon: <Briefcase size={22} />,
  },
  // {
  //   label: "Applicants",
  //   href: "/portal/candidates/accepted",
  //   icon: <Element size={23} />,
  // },

  // {
  //   label: "Logout",
  //   href: "/logout",
  //   icon: <Element />,
  // },
];

export function CompanyLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { collapsed, isMobile, setCollapsed } = useIsResponsive();
  const profile = pathname.includes("/portal/profile");
  const candidates = pathname.includes("/portal/candidates");

  const isActive = (href: string) => {
    return pathname.startsWith(href);
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar (always open on lg+, hidden on smaller) */}
      <SideNav
        collapsed={collapsed}
        isMobile={isMobile}
        setCollapsed={setCollapsed}
        links={links}
        isActive={isActive}
      />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6 justify-between">
          <div className="flex items-center gap-4">
            {/* Mobile Toggle Button */}
            {isMobile && (
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="p-2 -ml-2 text-gray-600"
              >
                {collapsed ? <Menu size={24} /> : <X size={24} />}
              </button>
            )}
            <h2 className="text-lg font-semibold text-gray-800">Dashboard</h2>
          </div>
          <Link href={"/portal/profile"}>
            <div className="rounded-full border w-[50px] h-[50px]">
              {/* Avatar Placeholder */}
            </div>
          </Link>
        </header>
        {/* Main Content Area */}
        <main className="flex-1 overflow-auto px-2 py-2 sm:px-4 sm:py-4 lg:px-6 lg:py-6 xl:px-8 xl:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
