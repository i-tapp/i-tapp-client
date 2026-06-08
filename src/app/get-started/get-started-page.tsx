"use client";

import Link from "next/link";
import { GraduationCap, Building2, Shield, ArrowRight } from "lucide-react";
import { Logo } from "@/components/logo";

const roles = [
  {
    key: "student",
    title: "I'm a Student",
    subtitle: "Find your SIWES / IT placement",
    description: "Browse verified companies accepting students for industrial training. Apply, track, and get placed — all in one place.",
    features: ["Browse curated SIWES listings", "Apply instantly", "Track your applications", "Get your IT letter accepted"],
    href: "/welcome",
    cta: "Sign up as Student",
    icon: GraduationCap,
    accent: "blue",
    ring: "ring-blue-500",
    iconBg: "from-blue-500 to-blue-600",
    dot: "bg-blue-500",
    btn: "bg-blue-600 hover:bg-blue-700",
  },
  {
    key: "corps",
    title: "I'm a Corps Member",
    subtitle: "Find your PPA placement",
    description: "Get matched to a Place of Primary Attachment in your deployment state. No cold emails, no walk-ins.",
    features: ["Matched to your state", "Verified PPA listings", "Apply with your call-up letter", "Track PPA status"],
    href: "/corps/signup",
    cta: "Sign up as Corps Member",
    icon: Shield,
    accent: "emerald",
    ring: "ring-emerald-500",
    iconBg: "from-emerald-500 to-emerald-600",
    dot: "bg-emerald-500",
    btn: "bg-emerald-600 hover:bg-emerald-700",
  },
  {
    key: "company",
    title: "I'm a Company",
    subtitle: "List placement opportunities",
    description: "Post SIWES or PPA positions and connect with verified, qualified candidates from across Nigeria.",
    features: ["Post SIWES & PPA slots", "Access verified talent", "Manage applications easily", "CAC-verified listing badge"],
    href: "/company/signup",
    cta: "Sign up as Company",
    icon: Building2,
    accent: "purple",
    ring: "ring-purple-500",
    iconBg: "from-purple-500 to-purple-600",
    dot: "bg-purple-500",
    btn: "bg-purple-600 hover:bg-purple-700",
  },
];

export default function GetStartedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-400/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="px-4 sm:px-8 py-5 flex items-center justify-between">
          <Link href="/">
            <Logo />
          </Link>
          <Link href="/signin" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
            Already have an account? <span className="text-primary font-semibold">Sign in</span>
          </Link>
        </header>

        {/* Main */}
        <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-10 sm:py-16">
          <div className="w-full max-w-6xl space-y-10">
            {/* Hero text */}
            <div className="text-center space-y-3">
              <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                ✨ Get Started — It&apos;s Free
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight">
                Choose your path
              </h1>
              <p className="text-lg sm:text-xl text-gray-500 max-w-xl mx-auto">
                Pick your role to create your account and get started in minutes.
              </p>
            </div>

            {/* Role cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
              {roles.map((role) => {
                const Icon = role.icon;
                return (
                  <Link
                    key={role.key}
                    href={role.href}
                    className={`group relative flex flex-col gap-5 p-6 sm:p-8 rounded-2xl bg-white/90 backdrop-blur shadow-lg border border-white hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 hover:${role.ring} hover:ring-2`}
                  >
                    {/* Icon */}
                    <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${role.iconBg} shadow-md w-fit`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>

                    {/* Text */}
                    <div className="space-y-1.5">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">{role.subtitle}</p>
                      <h2 className="text-2xl font-bold text-gray-900">{role.title}</h2>
                      <p className="text-sm text-gray-500 leading-relaxed">{role.description}</p>
                    </div>

                    {/* Features */}
                    <ul className="space-y-2">
                      {role.features.map((f) => (
                        <li key={f} className="flex items-center gap-2.5 text-sm text-gray-600">
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${role.dot}`} />
                          {f}
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <div className={`mt-auto flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold text-white ${role.btn} transition-colors`}>
                      {role.cta}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                );
              })}
            </div>

            <p className="text-center text-sm text-gray-400">
              By signing up, you agree to our{" "}
              <Link href="/terms-of-service" className="underline hover:text-gray-600">Terms</Link>
              {" "}and{" "}
              <Link href="/privacy" className="underline hover:text-gray-600">Privacy Policy</Link>.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
