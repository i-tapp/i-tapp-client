import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/utils/tailwind";
import { ArrowRight, Users, ShieldCheck, MessageCircle, LayoutDashboard, Sparkles } from "lucide-react";

const perks = [
  {
    icon: <Users className="w-5 h-5" />,
    title: "Dual Talent Pool",
    description: "Access SIWES students and NYSC corps members from a single listing. One post, two talent sources.",
    accent: "bg-violet-50 text-violet-600 border-violet-100",
  },
  {
    icon: <ShieldCheck className="w-5 h-5" />,
    title: "Verified Talent Only",
    description: "Every student and corps member is verified on signup. No fake profiles, no time wasters.",
    accent: "bg-emerald-50 text-emerald-600 border-emerald-100",
  },
  {
    icon: <MessageCircle className="w-5 h-5" />,
    title: "WhatsApp Bot Updates",
    description: "Receive real-time application stats and new applicant alerts directly on WhatsApp — no login needed.",
    accent: "bg-green-50 text-green-600 border-green-100",
  },
  {
    icon: <Sparkles className="w-5 h-5" />,
    title: "Admin-Assisted Listing",
    description: "Don't have time to manage it? Our admin team can list and manage your opportunities on your behalf.",
    accent: "bg-amber-50 text-amber-600 border-amber-100",
  },
];

export function ForCompanies() {
  return (
    <section className="bg-[#f7f8fc] border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-20 sm:py-28">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">
          {/* Left */}
          <div className="lg:w-96 shrink-0 flex flex-col gap-6 lg:sticky lg:top-28">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-primary">For Companies</span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-950 leading-tight tracking-tight">
                Nigeria&apos;s placement talent, at your fingertips
              </h2>
              <p className="mt-4 text-gray-500 text-base leading-relaxed">
                List SIWES internships and NYSC PPA opportunities. Reach thousands of qualified, verified talent — ready to work.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Link
                href="/signup?role=company"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "gap-2 font-bold rounded-xl shadow-sm shadow-primary/20 w-full sm:w-auto justify-center sm:justify-start"
                )}
              >
                List Your First Opportunity
                <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="text-xs text-gray-400 text-center sm:text-left">
                Free to list. No setup fee. Verification required.
              </p>
            </div>

            {/* Stats strip */}
            <div className="flex gap-4 flex-wrap">
              {[
                { value: "3,200+", label: "Active talent" },
                { value: "50+", label: "Companies listed" },
                { value: "90%", label: "Fill rate" },
              ].map((s) => (
                <div key={s.label} className="bg-white rounded-xl border border-gray-100 px-4 py-3 shadow-sm">
                  <p className="text-xl font-bold text-gray-900">{s.value}</p>
                  <p className="text-[11px] text-gray-400 font-medium">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — perks grid */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {perks.map((perk, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-gray-100 p-7 flex flex-col gap-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${perk.accent}`}>
                  {perk.icon}
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-base font-bold text-gray-900">{perk.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{perk.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
