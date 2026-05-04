"use client";

import Link from "next/link";
import Image from "next/image";
import instagram from "@/assets/icons/instagram.svg";
import twitter from "@/assets/icons/twitter.svg";
import linkedin from "@/assets/icons/linkedin.svg";
import itappLogo from "@/assets/images/logo.png";
import { app } from "@/config/app";

export function Footer() {
  return (
    <footer className="bg-[#111827] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 pb-12 border-b border-white/10">
          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-1 flex flex-col gap-5">
            <Image src={itappLogo} height={35} width={35} alt="I-TAPP Logo" className="brightness-0 invert" />
            <p className="text-sm text-white/50 leading-relaxed max-w-[240px]">
              Nigeria&apos;s leading platform connecting students with verified
              companies for SIWES industrial training placements.
            </p>
            <div className="flex gap-2">
              <Link
                href="https://instagram.com/itapp.tech"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-white/8 hover:bg-white/15 border border-white/10 flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Image src={instagram} alt="Instagram" className="w-4 h-4 brightness-0 invert" />
              </Link>
              <Link
                href="https://linkedin.com/company/i-tapp"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-white/8 hover:bg-white/15 border border-white/10 flex items-center justify-center transition-colors"
                aria-label="LinkedIn"
              >
                <Image src={linkedin} alt="LinkedIn" className="w-4 h-4 brightness-0 invert" />
              </Link>
              <Link
                href="https://twitter.com/i-tapp"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-white/8 hover:bg-white/15 border border-white/10 flex items-center justify-center transition-colors"
                aria-label="Twitter"
              >
                <Image src={twitter} alt="Twitter" className="w-4 h-4 brightness-0 invert" />
              </Link>
            </div>
          </div>

          {/* Platform links */}
          <div className="flex flex-col gap-4">
            <p className="text-[11px] font-bold uppercase tracking-widest text-white/40">
              Platform
            </p>
            <ul className="flex flex-col gap-3">
              {[
                { href: "/opportunities", label: "Browse Opportunities" },
                { href: "/get-started", label: "Sign Up Free" },
                { href: "/signin", label: "Sign In" },
                { href: "/get-started?role=company", label: "For Companies" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/55 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div className="flex flex-col gap-4">
            <p className="text-[11px] font-bold uppercase tracking-widest text-white/40">
              Company
            </p>
            <ul className="flex flex-col gap-3">
              {app.footer_links
                .find((s) => s.title === "COMPANY")
                ?.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/55 hover:text-white transition-colors"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              {app.footer_links
                .find((s) => s.title === "LEGAL")
                ?.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/55 hover:text-white transition-colors"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="flex flex-col gap-4">
            <p className="text-[11px] font-bold uppercase tracking-widest text-white/40">
              Stay Updated
            </p>
            <p className="text-sm text-white/55 leading-relaxed">
              Get the latest placement opportunities and platform updates.
            </p>
            <form className="flex flex-col gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full bg-white/8 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/60 transition-colors"
              />
              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/30">
          <p>© {new Date().getFullYear()} I-TAPP. All rights reserved.</p>
          <p>
            Built for Nigerian students.{" "}
            <a
              href="mailto:support@i-tapp.com"
              className="hover:text-white/60 transition-colors"
            >
              support@i-tapp.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
