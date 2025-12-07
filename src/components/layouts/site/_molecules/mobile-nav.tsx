"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "iconsax-reactjs";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { buttonVariants } from "@/components/ui/button";
import { app } from "@/config/app";
import { cn } from "@/utils/tailwind";
import { usePathname } from "next/navigation";
import Hr from "@/components/ui/hr";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {/* Hamburger Button */}
      <SheetTrigger
        className="md:hidden"
        aria-label="Open mobile navigation menu"
      >
        <Menu size={26} className="text-primary" />
      </SheetTrigger>

      {/* Drawer Content */}
      <SheetContent
        className={cn(
          "w-full max-w-[300px] flex flex-col justify-between gap-8 py-12 px-6 md:hidden",
          "bg-white shadow-lg"
        )}
      >
        {/* Navigation Links */}
        <nav className="flex flex-col gap-4">
          {app.nav_links.map((link) => (
            <Link
              key={link.text}
              href={link.href}
              title={link.title}
              onClick={() => setOpen(false)}
              className={cn(
                "text-base transition-colors hover:text-primary",
                pathname === link.href
                  ? "text-primary font-medium"
                  : "text-gray-800"
              )}
            >
              {link.text}
            </Link>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 ">
          <Hr />
          <Link
            href={app.links.signin}
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "w-full justify-center"
            )}
            onClick={() => setOpen(false)}
          >
            Sign In
          </Link>
          <Link
            href={app.links.signup}
            className={cn(
              buttonVariants({ size: "sm" }),
              "w-full justify-center"
            )}
            onClick={() => setOpen(false)}
          >
            Get Started
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}
