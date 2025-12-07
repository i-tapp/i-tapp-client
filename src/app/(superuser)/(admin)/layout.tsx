"use client";

import { ReactNode, useState, useEffect } from "react";
import {
  Home,
  Users,
  User,
  ChartBar,
  MessageSquare,
  Menu,
  ChevronLeft,
  ChevronRight,
  Settings,
  Briefcase,
  FileText,
  LogOut,
  UserCheck,
  ClipboardList,
  BriefcaseBusiness,
  Building,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Ghost } from "iconsax-reactjs";
import Link from "next/link";
import { cn } from "@/utils/tailwind";
import { usePathname, useRouter } from "next/navigation";
import path from "path";

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
  { name: "Settings", href: "/admin/settings", icon: <Settings size={20} /> },
  { name: "Log out", href: "#", icon: <LogOut size={20} /> },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [admin, setAdmin] = useState(false);
  // Initialize with false to avoid hydration mismatch, update in useEffect
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const router = useRouter();

  const isActive = (href: string) => {
    if (href === "/admin") {
      // Home: exact match only
      return pathname === href;
    }
    // Other links: match prefix
    return pathname.startsWith(href);
  };

  // useEffect(() => {
  //   if (!admin) {
  //     router.replace("/auth");
  //   }
  // }, [admin, router]);

  const pathname = usePathname();

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const mobile = width < 768;

      setIsMobile(mobile);
      // Only auto-collapse if we are strictly switching to mobile
      if (mobile) setCollapsed(true);
    };

    // Set initial value
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`
          bg-white border-r border-gray-200
          flex flex-col
          transition-all duration-300 ease-in-out
          ${collapsed ? "w-16" : "w-64"}
          ${isMobile && collapsed ? "-ml-16" : ""} 
          /* Mobile fix: hide completely if mobile and collapsed */
        `}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100">
          <span
            className={`
              font-bold text-xl text-indigo-600 overflow-hidden whitespace-nowrap transition-all duration-300
              ${collapsed ? "w-0 opacity-0" : "w-auto opacity-100"}
            `}
          >
            Admin
          </span>
          {/* Desktop Toggle Button */}
          {!isMobile && (
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-500"
            >
              {collapsed ? (
                <ChevronRight size={16} />
              ) : (
                <ChevronLeft size={16} />
              )}
            </button>
          )}
        </div>

        {/* Menu Items */}
        <nav className="flex-1 py-4 flex flex-col gap-1 px-2">
          {menuItems.map((item) => (
            <Button
              key={item.name}
              variant={"ghost"}
              //   className={`
              //     flex items-center px-3 py-3 rounded-md transition-colors group relative
              //     ${collapsed ? "justify-center" : ""}
              //     hover:bg-indigo-50 text-gray-600 hover:text-indigo-600
              //   `}

              className={`
  w-full h-12 relative group flex items-center
  ${collapsed ? "px-0 justify-center" : "px-3 justify-start"}
  ${
    isActive(item.href)
      ? "bg-primary text-white"
      : "text-gray-700 hover:bg-indigo-50"
  }
`}
            >
              <Link
                href={item.href || "#"}
                className={cn(
                  "w-full h-full flex items-center",
                  collapsed && "justify-center"
                )}
              >
                {/* Icon - Always visible */}
                <span className="shrink-0">{item.icon}</span>

                {/* Text - Animating via CSS, not unmounting */}
                <span
                  className={`
                  overflow-hidden whitespace-nowrap transition-all duration-300 origin-left
                  ${
                    collapsed
                      ? "w-0 opacity-0 ml-0 -translate-x-2.5"
                      : "w-auto opacity-100 ml-3 translate-x-0"
                  }
                `}
                >
                  {item.name}
                </span>

                {/* Tooltip for collapsed state (UX Improvement) */}
                {collapsed && (
                  <div className="absolute left-full rounded-md px-2 py-1 ml-6 bg-indigo-900 text-white text-xs invisible opacity-0 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 z-50 whitespace-nowrap">
                    {item.name}
                  </div>
                )}
              </Link>
            </Button>
          ))}
        </nav>
      </aside>

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
