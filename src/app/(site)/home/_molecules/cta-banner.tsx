import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/utils/tailwind";
import { ArrowRight, GraduationCap, Building2 } from "lucide-react";

export function CtaBanner() {
  return (
    <section className="bg-[#f7f8fc] py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
        <div className="relative overflow-hidden rounded-3xl bg-primary px-8 sm:px-16 py-14 sm:py-20 text-center">
          {/* Decorative circles */}
          <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute -bottom-16 -right-16 w-56 h-56 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white/[0.02] pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center gap-7 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight">
              Your IT placement is one tap away
            </h2>
            <p className="text-white/70 text-base sm:text-lg leading-relaxed">
              Join thousands of Nigerian students already finding placements
              through I-TAPP. It&apos;s free to get started.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Link
                href="/get-started"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "bg-white text-primary hover:bg-white/90 gap-2 font-bold rounded-xl shadow-lg"
                )}
              >
                <GraduationCap className="w-4 h-4" />
                I&apos;m a Student
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/get-started?role=company"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "border-white/30 text-white bg-white/10 gap-2 font-semibold rounded-xl"
                )}
              >
                <Building2 className="w-4 h-4" />
                I&apos;m a Company
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
