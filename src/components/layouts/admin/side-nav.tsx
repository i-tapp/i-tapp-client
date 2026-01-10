import { Button } from "@/components/ui/button";
import { cn } from "@/utils/tailwind";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SideNav({
  collapsed,
  isMobile,
  setCollapsed,
  menuItems,

  logout,
}) {
  const pathname = usePathname();
  const isActive = (href: string) => {
    if (href === "/admin") {
      // Home: exact match only
      return pathname === href;
    }
    // Other links: match prefix
    return pathname.startsWith(href);
  };
  return (
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
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
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
              onClick={
                item.name === "Log out"
                  ? async (e) => {
                      e.preventDefault();
                      await logout();
                    }
                  : undefined
              }
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
  );
}
