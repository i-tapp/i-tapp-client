"use client";

import React, { useEffect, useRef } from "react";
import { OnboardingTour } from "@/components/onboarding-tour";
import { usePathname } from "next/navigation";
import { Briefcase, Element, Profile2User } from "iconsax-reactjs";
import Link from "next/link";
import useIsResponsive from "@/utils/responsive";

import { Menu, X } from "lucide-react";
import SideNav from "../company-sidenav";
import Image from "next/image";
import { useFetchCompanyProfile } from "@/hooks/query";
import { AppOnly } from "@/components/providers/app-mode-provider";
import { AppTabBar } from "../app-tab-bar";
import { ThemeToggleButton } from "@/components/theme-toggle";
import { PageTransition } from "@/components/providers/page-transition";

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
  {
    label: "Candidates",
    href: "/portal/candidates",
    icon: <Profile2User size={22} />,
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
  const opportunities = pathname.includes("/portal/opportunities");
  const title = candidates
    ? "Candidates"
    : profile
      ? "Profile"
      : opportunities
        ? "Opportunities"
        : "Dashboard";
  const mainRef = useRef<HTMLElement>(null);
  const { data: companyProfile, isLoading } = useFetchCompanyProfile();

  const isActive = (href: string) => {
    return pathname.startsWith(href);
  };

  useEffect(() => {
    function onOpen() {
      setCollapsed(false);
    }
    function onClose() {
      setCollapsed(true);
    }
    window.addEventListener("placeit:sidenav:open", onOpen);
    window.addEventListener("placeit:sidenav:close", onClose);
    return () => {
      window.removeEventListener("placeit:sidenav:open", onOpen);
      window.removeEventListener("placeit:sidenav:close", onClose);
    };
  }, [setCollapsed]);

  // This layout now stays mounted between pages (see PageTransition), so what
  // a remount used to do for free is done here: close the mobile drawer after
  // navigating, and start each page at the top of the scrollable content area.
  useEffect(() => {
    if (isMobile) setCollapsed(true);
    mainRef.current?.scrollTo({ top: 0 });
  }, [pathname, isMobile, setCollapsed]);

  return (
    <div className="flex h-screen bg-muted dark:bg-background overflow-hidden">
      {/* Sidebar (always open on lg+, hidden on smaller) */}
      <SideNav
        collapsed={collapsed}
        isMobile={isMobile}
        setCollapsed={setCollapsed}
        links={links}
        isActive={isActive}
      />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="h-16 bg-background border-b border-border flex items-center px-6 justify-between">
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
            <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggleButton />
            <Link href={"/portal/profile"} data-tour="avatar-menu">
            <div className="rounded-full h-10 w-10">
              <Image
                src={companyProfile?.logo || "/applicant.png"}
                alt=""
                className="object-cover w-full h-full rounded-full"
                width={35}
                height={35}
              />
              </div>
            </Link>
          </div>
        </header>
        {/* Main Content Area */}
        <main
          ref={mainRef}
          className="flex-1 overflow-auto px-2 py-2 sm:px-4 sm:py-4 lg:px-6 lg:py-6 xl:px-8 xl:py-8"
        >
          <PageTransition contentOnly>{children}</PageTransition>
        </main>
      </div>
      <OnboardingTour role="company" />
      <AppOnly>
        <AppTabBar role="company" />
      </AppOnly>
    </div>
  );
}
