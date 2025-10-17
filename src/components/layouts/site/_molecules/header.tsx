import React from "react";
import Link from "next/link";
import { app } from "@/config/app";
import { Logo } from "@/components/logo";
import { Wrapper } from "@/components/wrapper";
import { MobileNav } from "./mobile-nav";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Header() {
  return (
    <header className="w-full fixed top-0 bg-white border-b z-10 border-grey-5 ">
      <Wrapper className="flex items-center h-16 justify-between py-6!">
        <Logo />
        {/* Navigation Links */}
        <nav className="items-center gap-14 hidden md:flex">
          {app.nav_links.map((link) => (
            <Link
              key={link.text}
              href={link.href}
              title={link.title}
              className="text-base text-black"
            >
              {link.text}
            </Link>
          ))}
        </nav>
        {/* Action Buttons */}
        <div className="hidden md:flex gap-2">
          <Link
            href={app.links.signin}
            className={cn(
              buttonVariants({ variant: "outline", size: "default" }),
              "border border-primary/20 text-primary rounded-lg text-sm"
            )}
          >
            Sign In
          </Link>
          <Link
            href={app.links.signup}
            className={cn(
              buttonVariants({ size: "default" }),
              "text-white border-none bg-primary rounded-lg text-sm"
            )}
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Nav */}
        <MobileNav />
      </Wrapper>
    </header>
  );
}
