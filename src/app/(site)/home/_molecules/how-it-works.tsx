import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/utils/tailwind";
import { ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Create Your Account",
    description:
      "Sign up in minutes. Complete your onboarding and verify your student identity to unlock full platform access.",
    color: "from-primary/10 to-primary/5",
    dot: "bg-primary",
  },
  {
    number: "02",
    title: "Build Your Profile",
    description:
      "Showcase your field of study, skills, and preferences. Your profile is your digital CV — companies see it when you apply.",
    color: "from-violet-100/60 to-violet-50/30",
    dot: "bg-violet-500",
  },
  {
    number: "03",
    title: "Apply & Get Placed",
    description:
      "Browse verified opportunities, apply to your top picks, and track every application in real time until you get your offer.",
    color: "from-emerald-100/60 to-emerald-50/30",
    dot: "bg-emerald-500",
  },
];

export function HowItWorks() {
  return (
    <section className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-20 sm:py-28">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-16">
          <div className="max-w-xl">
            <span className="text-[11px] font-bold uppercase tracking-widest text-primary">
              How It Works
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-950 leading-tight tracking-tight">
              Three steps to your IT placement
            </h2>
          </div>
          <Link
            href="/get-started"
            className={cn(
              buttonVariants({ size: "default" }),
              "shrink-0 gap-2 rounded-xl font-semibold shadow-sm shadow-primary/20 self-start sm:self-auto"
            )}
          >
            Get Started
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Connector line — desktop only */}
          <div className="hidden md:block absolute top-[52px] left-[calc(33.33%+1rem)] right-[calc(33.33%+1rem)] h-px border-t-2 border-dashed border-gray-200 z-0" />

          {steps.map((step, i) => (
            <div
              key={i}
              className="relative z-10 bg-white rounded-2xl border border-gray-100 p-7 flex flex-col gap-5
                shadow-[0_2px_12px_rgba(0,0,0,0.04)]
                hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)]
                hover:-translate-y-0.5
                transition-all duration-300"
            >
              {/* Number circle */}
              <div className="relative w-14 h-14">
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${step.color}`} />
                <div className="relative w-full h-full flex items-center justify-center">
                  <span className="text-2xl font-black text-gray-900 tracking-tighter">
                    {step.number}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${step.dot}`} />
                  <h3 className="text-base sm:text-lg font-bold text-gray-900">
                    {step.title}
                  </h3>
                </div>
                <p className="text-sm sm:text-[15px] text-gray-500 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
