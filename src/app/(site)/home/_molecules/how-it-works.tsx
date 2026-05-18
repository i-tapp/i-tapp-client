"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/utils/tailwind";
import { ArrowRight, GraduationCap, Shield, Building2 } from "lucide-react";
import { usePersona, type Persona } from "@/app/(site)/_context/persona";
import { useState } from "react";

const tabs: { value: Exclude<Persona, null>; label: string; icon: React.ReactNode }[] = [
  { value: "student", label: "Student", icon: <GraduationCap className="w-4 h-4" /> },
  { value: "corps", label: "Corps Member", icon: <Shield className="w-4 h-4" /> },
  { value: "company", label: "Company", icon: <Building2 className="w-4 h-4" /> },
];

const steps = {
  student: [
    {
      number: "01",
      title: "Create Your Account",
      description: "Sign up in minutes. Complete your student onboarding and verify your identity to unlock full platform access.",
      color: "from-primary/10 to-primary/5",
      dot: "bg-primary",
    },
    {
      number: "02",
      title: "Build Your Profile",
      description: "Add your field of study, skills, and preferences. Your profile is your digital CV — companies see it when you apply.",
      color: "from-violet-100/60 to-violet-50/30",
      dot: "bg-violet-500",
    },
    {
      number: "03",
      title: "Apply & Get Placed",
      description: "Browse verified SIWES opportunities, apply to top picks, and track every application in real time until you get your offer.",
      color: "from-emerald-100/60 to-emerald-50/30",
      dot: "bg-emerald-500",
    },
  ],
  corps: [
    {
      number: "01",
      title: "Sign Up & Add State Code",
      description: "Register with your NYSC call-up number and state code. We use it to match you to PPA opportunities in your posted state.",
      color: "from-primary/10 to-primary/5",
      dot: "bg-primary",
    },
    {
      number: "02",
      title: "Browse Matched PPAs",
      description: "See state-filtered PPA listings from verified companies. Enable camp mode to see only immediately-available slots.",
      color: "from-emerald-100/60 to-emerald-50/30",
      dot: "bg-emerald-500",
    },
    {
      number: "03",
      title: "Apply or BulkApply™",
      description: "Apply individually to chosen companies, or use BulkApply™ — upload your resume and we cold-email matching companies on your behalf.",
      color: "from-amber-100/60 to-amber-50/30",
      dot: "bg-amber-500",
    },
  ],
  company: [
    {
      number: "01",
      title: "Register Your Company",
      description: "Sign up and verify your company with your CAC number. Admin can also list on your behalf — just reach out.",
      color: "from-primary/10 to-primary/5",
      dot: "bg-primary",
    },
    {
      number: "02",
      title: "List Your Opportunities",
      description: "Post SIWES internship slots or NYSC PPA openings. Set requirements, stipend, and duration. Your listing goes live instantly.",
      color: "from-violet-100/60 to-violet-50/30",
      dot: "bg-violet-500",
    },
    {
      number: "03",
      title: "Review & Accept Talent",
      description: "Receive applications, shortlist candidates, and accept talent directly from your dashboard — with real-time WhatsApp bot updates.",
      color: "from-emerald-100/60 to-emerald-50/30",
      dot: "bg-emerald-500",
    },
  ],
};

const ctaLinks = {
  student: { href: "/signup", label: "Get Started as Student" },
  corps: { href: "/signup?role=corps", label: "Find My PPA" },
  company: { href: "/signup?role=company", label: "List Opportunities" },
};

export function HowItWorks() {
  const { persona, setPersona } = usePersona();
  const [activeTab, setActiveTab] = useState<Exclude<Persona, null>>(
    (persona as Exclude<Persona, null>) ?? "student"
  );

  function selectTab(tab: Exclude<Persona, null>) {
    setActiveTab(tab);
    setPersona(tab);
  }

  const currentTab = (persona as Exclude<Persona, null>) ?? activeTab;
  const currentSteps = steps[currentTab];
  const cta = ctaLinks[currentTab];

  return (
    <section id="how-it-works" className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-20 sm:py-28">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10">
          <div className="max-w-xl">
            <span className="text-[11px] font-bold uppercase tracking-widest text-primary">
              How It Works
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-950 leading-tight tracking-tight">
              Three steps to your placement
            </h2>
          </div>
          <Link
            href={cta.href}
            className={cn(
              buttonVariants({ size: "default" }),
              "shrink-0 gap-2 rounded-xl font-semibold shadow-sm shadow-primary/20 self-start sm:self-auto"
            )}
          >
            {cta.label}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-1">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => selectTab(tab.value)}
              className={cn(
                "inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold shrink-0 transition-all duration-200",
                currentTab === tab.value
                  ? "bg-primary text-white border-primary shadow-sm"
                  : "bg-white text-gray-500 border-gray-200 hover:border-primary/30 hover:text-primary"
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          <div className="hidden md:block absolute top-[52px] left-[calc(33.33%+1rem)] right-[calc(33.33%+1rem)] h-px border-t-2 border-dashed border-gray-200 z-0" />
          {currentSteps.map((step, i) => (
            <div
              key={i}
              className="relative z-10 bg-white rounded-2xl border border-gray-100 p-7 flex flex-col gap-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className="relative w-14 h-14">
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${step.color}`} />
                <div className="relative w-full h-full flex items-center justify-center">
                  <span className="text-2xl font-black text-gray-900 tracking-tighter">{step.number}</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${step.dot}`} />
                  <h3 className="text-base sm:text-lg font-bold text-gray-900">{step.title}</h3>
                </div>
                <p className="text-sm sm:text-[15px] text-gray-500 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
