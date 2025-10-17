"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu } from "iconsax-reactjs";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { logout } from "@/actions/auth";
import { useCompanyStore } from "@/lib/store/company";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  links: { text: string; href: string }[];
}

export function MobileNav({ links }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const company = useCompanyStore((c) => c.company);

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="md:hidden" aria-label="Open navigation menu">
        <Menu size={24} />
      </SheetTrigger>

      <SheetContent className="w-full bg-white max-w-[300px] py-10 flex flex-col gap-8 md:hidden">
        {company ? (
          <div className="flex items-center gap-3 border-b pb-4">
            <Image
              src={company.profileImageUrl ?? "/applicant.png"}
              alt={company.name}
              width={50}
              height={50}
              className="object-cover rounded-full border"
            />
            <div>
              <p className="font-medium text-sm">{company.name}</p>
              <Link
                href="/portal/profile"
                className="text-xs text-primary hover:underline"
              >
                View profile
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 border-b pb-4">
            <Image src="/applicant.png" alt="Guest" width={50} height={50} />
            <p className="text-sm">Guest User</p>
          </div>
        )}

        <nav className="flex flex-col gap-3">
          {links.map((link) => (
            <Link
              key={link.text}
              href={link.href}
              className={cn(
                "text-base transition-colors hover:text-primary",
                pathname.startsWith(link.href)
                  ? "font-medium text-primary"
                  : "text-black"
              )}
              onClick={() => setOpen(false)}
            >
              {link.text}
            </Link>
          ))}
        </nav>

        <div className="mt-auto">
          <Button
            onClick={handleLogout}
            variant="destructive"
            className="w-full"
          >
            Logout
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
