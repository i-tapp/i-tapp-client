"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Notification } from "iconsax-reactjs";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Logo } from "@/components/logo";
import { MobileNav } from "./mobile-nav";
import { cn } from "@/utils/tailwind";
import { useCompanyStore } from "@/lib/store/company";
import { useStudentStore } from "@/lib/store";

export function Header({ link }: { link: { text: string; href: string }[] }) {
  const pathname = usePathname();
  const company = useCompanyStore((c) => c.company);
  const student = useStudentStore((c) => c.student);
  const parentRoute = pathname.split("/")[2];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white">
      <div className="flex items-center justify-between px-6 h-[55px] border-b border-grey-5">
        <Link href="/portal ">
          <Logo />
        </Link>
        <nav className="gap-16 hidden md:flex h-full ">
          {link.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              className={cn(
                "flex items-center h-[55px] text-sm text-primary transition-colors",
                // "border-b-2 border-transparent -mb-px",
                link.href.includes(parentRoute) &&
                  "border-b -mb-px border-primary text-black",
              )}
            >
              {link.text}
            </Link>
          ))}
        </nav>
        <div className="hidden md:flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Notification
                  size={35}
                  className=" border border-[#C9C9DA] rounded-full p-2"
                />
              </TooltipTrigger>
              <TooltipContent className="px-0">
                <p className="px-6 py-5 border-b border-black flex items-center gap-2">
                  <Notification
                    size={24}
                    className=" border border-[#C9C9DA] rounded-full p-2"
                  />
                  You&apos;ve just been accepted by Chenotech Nigeria Limited
                </p>
                <p className="px-6 py-5 border-b border-black flex items-center gap-2">
                  <Notification
                    size={24}
                    className=" border border-[#C9C9DA] rounded-full p-2"
                  />
                  You&apos;ve just been accepted by Chenotech Nigeria Limited
                </p>
                <Link href="/notifications">
                  <p className="px-10 py-2">See all notifications</p>
                </Link>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Link href="/portal/profile">
            <div className="rounded-full h-10 w-10">
              <Image
                src={
                  company?.avatarUrl ||
                  student?.profileImage ||
                  "/applicant.png"
                }
                alt=""
                className="object-cover w-full h-full rounded-full"
                width={35}
                height={35}
              />
            </div>
          </Link>
        </div>
        <MobileNav links={link} />
      </div>
    </header>
  );
}
