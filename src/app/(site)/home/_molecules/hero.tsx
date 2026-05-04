import Link from "next/link";
import Image from "next/image";
import Boy from "@/assets/images/itapp-company.jpeg";
import Girl from "@/assets/images/itapp-company2.jpeg";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/utils/tailwind";
import { ArrowRight, BadgeCheck, MapPin, Clock, Users } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Mesh background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 80% 60% at 70% 50%, rgba(68,93,203,0.06) 0%, transparent 70%),
            radial-gradient(ellipse 40% 40% at 10% 80%, rgba(140,217,192,0.12) 0%, transparent 60%)
          `,
        }}
      />
      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.3] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #c7d2f0 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          maskImage: "radial-gradient(ellipse 80% 70% at 50% 50%, black 30%, transparent 100%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 pt-28 pb-20 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        {/* ── Left copy ── */}
        <div className="flex-1 flex flex-col gap-7 text-center lg:text-left max-w-[580px] mx-auto lg:mx-0">
          {/* Eyebrow */}
          <div className="flex justify-center lg:justify-start">
            <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-primary bg-primary/8 border border-primary/20 px-4 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Nigeria&apos;s #1 SIWES Platform
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-[3.6rem] font-bold text-gray-950 leading-[1.1] tracking-tight">
            Bridging Students{" "}
            <span className="relative inline-block">
              <span className="relative z-10">& Companies</span>
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 300 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
              >
                <path
                  d="M2 8 Q75 2 150 6 Q225 10 298 4"
                  stroke="#445DCB"
                  strokeWidth="3"
                  strokeLinecap="round"
                  opacity="0.4"
                />
              </svg>
            </span>{" "}
            for IT Placements
          </h1>

          <p className="text-gray-500 text-base sm:text-lg leading-relaxed max-w-[480px] mx-auto lg:mx-0">
            A centralized hub for Nigerian students to search, find, and apply
            for industrial training placement across verified companies — all in
            one place.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
            <Link
              href="/get-started"
              className={cn(
                buttonVariants({ size: "lg" }),
                "gap-2 font-semibold shadow-lg shadow-primary/20 rounded-xl"
              )}
            >
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/opportunities"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "rounded-xl border-gray-200 text-gray-700 font-semibold hover:border-primary/30 hover:text-primary"
              )}
            >
              Browse Opportunities
            </Link>
          </div>

          {/* Trust signals */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-x-6 gap-y-2 pt-1">
            {[
              "Free to get started",
              "Verified companies only",
              "Instant application tracking",
            ].map((item) => (
              <span
                key={item}
                className="flex items-center gap-1.5 text-xs text-gray-500 font-medium"
              >
                <BadgeCheck className="w-3.5 h-3.5 text-primary shrink-0" />
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* ── Right visual — floating product cards ── */}
        <div className="flex-1 flex items-center justify-center w-full max-w-[520px] relative select-none">
          {/* Glow */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/8 via-transparent to-[#8CD9C0]/10 pointer-events-none" />

          <div className="relative w-full py-8 px-4 flex flex-col gap-4 items-center">
            {/* Floating user avatars row */}
            <div className="flex items-center gap-3 self-start ml-4">
              <div className="flex -space-x-2">
                <div className="w-9 h-9 rounded-full border-2 border-white overflow-hidden bg-[#8CD9C0]">
                  <Image src={Boy} alt="" width={36} height={36} className="object-cover w-full h-full" />
                </div>
                <div className="w-9 h-9 rounded-full border-2 border-white overflow-hidden bg-[#F4E681]">
                  <Image src={Girl} alt="" width={36} height={36} className="object-cover w-full h-full" />
                </div>
                <div className="w-9 h-9 rounded-full border-2 border-white bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                  +2k
                </div>
              </div>
              <span className="text-xs text-gray-500 font-medium">Students already onboarded</span>
            </div>

            {/* Opportunity card preview */}
            <div className="w-full bg-white rounded-2xl border border-gray-100 shadow-[0_8px_40px_rgba(0,0,0,0.08)] overflow-hidden">
              <div className="h-1 w-full bg-gradient-to-r from-primary via-primary/60 to-primary/20" />
              <div className="p-4 flex flex-col gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-primary font-black text-xs">AC</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-gray-900">Frontend Engineer Intern</p>
                    <p className="text-[12px] text-gray-500">Acme Technologies · Lagos</p>
                  </div>
                  <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                    Open
                  </span>
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {["Hybrid", "3 Months", "Paid"].map((tag) => (
                    <span key={tag} className="text-[11px] bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-lg text-gray-600 font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1 border-t border-dashed border-gray-100">
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" />8 / 20 spots</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />Lagos, Nigeria</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />2d ago</span>
                </div>
              </div>
            </div>

            {/* Floating stat badges */}
            <div className="flex gap-3 self-end mr-4">
              <div className="bg-white border border-gray-100 shadow-sm rounded-xl px-3 py-2 flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 leading-none">Verified</p>
                  <p className="text-sm font-bold text-gray-900 leading-tight">50+ Co.</p>
                </div>
              </div>
              <div className="bg-white border border-gray-100 shadow-sm rounded-xl px-3 py-2 flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="w-3.5 h-3.5 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 leading-none">Students</p>
                  <p className="text-sm font-bold text-gray-900 leading-tight">2,000+</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
