"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/utils/tailwind";
import { ArrowRight, GraduationCap, Shield, Building2 } from "lucide-react";
import { usePersona } from "@/app/(site)/_context/persona";

const content = {
  default: {
    title: "Your placement is one tap away",
    desc: "Whether you're a student, corps member, or company — I-TAPP connects you to verified placements and talent across Nigeria.",
    ctas: [
      { label: "I'm a Student", href: "/signup", icon: <GraduationCap className="w-4 h-4" />, primary: true },
      { label: "I'm a Corps Member", href: "/signup?role=corps", icon: <Shield className="w-4 h-4" />, primary: false },
      { label: "I'm a Company", href: "/signup?role=company", icon: <Building2 className="w-4 h-4" />, primary: false },
    ],
  },
  student: {
    title: "Your IT placement is one tap away",
    desc: "Join thousands of Nigerian students already finding SIWES placements through I-TAPP. It's free to get started.",
    ctas: [
      { label: "Get Started Free", href: "/signup", icon: <GraduationCap className="w-4 h-4" />, primary: true },
      { label: "Browse Opportunities", href: "/opportunities", icon: <ArrowRight className="w-4 h-4" />, primary: false },
    ],
  },
  corps: {
    title: "Don't leave camp without a PPA",
    desc: "The 3-week camp window is short. Start browsing state-matched PPA opportunities now and apply before spots fill up.",
    ctas: [
      { label: "Find My PPA Now", href: "/signup?role=corps", icon: <Shield className="w-4 h-4" />, primary: true },
      { label: "Browse PPAs", href: "/opportunities?type=ppa", icon: <ArrowRight className="w-4 h-4" />, primary: false },
    ],
  },
  company: {
    title: "List your first opportunity today",
    desc: "Reach thousands of verified students and corps members. Free to list, admin-assisted, and backed by WhatsApp bot integration.",
    ctas: [
      { label: "List Opportunities", href: "/signup?role=company", icon: <Building2 className="w-4 h-4" />, primary: true },
      { label: "See How It Works", href: "#how-it-works", icon: <ArrowRight className="w-4 h-4" />, primary: false },
    ],
  },
};

export function CtaBanner() {
  const { persona } = usePersona();
  const key = persona ?? "default";
  const c = content[key];

  return (
    <section className="bg-[#f7f8fc] py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
        <div className="relative overflow-hidden rounded-3xl bg-primary px-8 sm:px-16 py-14 sm:py-20 text-center">
          <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute -bottom-16 -right-16 w-56 h-56 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white/[0.02] pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center gap-7 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight">
              {c.title}
            </h2>
            <p className="text-white/70 text-base sm:text-lg leading-relaxed">{c.desc}</p>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto flex-wrap justify-center">
              {c.ctas.map((cta, i) => (
                <Link
                  key={i}
                  href={cta.href}
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    cta.primary
                      ? "bg-white text-primary hover:bg-white/90 gap-2 font-bold rounded-xl shadow-lg"
                      : "border-white/30 text-white bg-white/10 hover:bg-white/20 gap-2 font-semibold rounded-xl border"
                  )}
                >
                  {cta.icon}
                  {cta.label}
                  {cta.primary && <ArrowRight className="w-4 h-4" />}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
