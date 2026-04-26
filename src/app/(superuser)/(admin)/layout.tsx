"use client";

import { ReactNode } from "react";
import {
  Home,
  Users,
  Menu,
  Settings,
  Briefcase,
  LogOut,
  UserCheck,
  ClipboardList,
  Building,
  Mail,
} from "lucide-react";
import Link from "next/link";
import { useLogout } from "@/hooks/use-logout";
import useIsResponsive from "@/utils/responsive";
import SideNav from "@/components/layouts/admin/side-nav";

interface AdminLayoutProps {
  children: ReactNode;
}
const menuItems = [
  { name: "Home", href: "/admin", icon: <Home size={20} /> },
  { name: "Students", href: "/admin/student", icon: <Users size={20} /> },
  { name: "Companies", href: "/admin/company", icon: <Building size={20} /> },
  {
    name: "Opportunities",
    href: "/admin/opportunities",
    icon: <Briefcase size={20} />, // job icon
  },
  {
    name: "Applications",
    href: "/admin/applications",
    icon: <ClipboardList size={20} />, // submitted forms
  },
  {
    name: "Placements",
    href: "/admin/placements",
    icon: <UserCheck size={20} />, // assigned students
  },
  { name: "Email", href: "/admin/email", icon: <Mail size={20} /> },
  { name: "Settings", href: "/admin/settings", icon: <Settings size={20} /> },
  { name: "Log out", href: "#", icon: <LogOut size={20} /> },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { collapsed, setCollapsed, isMobile, setIsMobile } = useIsResponsive();

  const logout = useLogout();

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <SideNav
        collapsed={collapsed}
        isMobile={isMobile}
        setCollapsed={setCollapsed}
        menuItems={menuItems}
        logout={logout}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6 justify-between">
          <div className="flex items-center gap-4">
            {/* Mobile Toggle Button */}
            {isMobile && (
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="p-2 -ml-2 text-gray-600"
              >
                <Menu size={24} />
              </button>
            )}
            <h2 className="text-lg font-semibold text-gray-800">Dashboard</h2>
          </div>

          <Link href={"/admin/profile"}>
            <div className="rounded-full border w-[50px] h-[50px]">
              {/* Avatar Placeholder */}
            </div>
          </Link>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-auto ">{children}</main>
      </div>
    </div>
  );
}
