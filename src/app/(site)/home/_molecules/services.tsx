"use client";

import { usePersona } from "@/app/(site)/_context/persona";
import { Sparkles, LayoutDashboard, Send, ShieldCheck, MapPin, Zap, Users, MessageCircle } from "lucide-react";

const features = {
  default: [
    { icon: <Sparkles className="w-5 h-5" />, title: "Tailored Placement Matching", description: "Get personalized recommendations based on your field of study, location, and preferences — no more cold searching.", accent: "bg-violet-50 text-violet-600 border-violet-100" },
    { icon: <LayoutDashboard className="w-5 h-5" />, title: "Application Dashboard", description: "Track every application in real time — from submitted to offer received. Full visibility, zero guesswork.", accent: "bg-blue-50 text-blue-600 border-blue-100" },
    { icon: <Send className="w-5 h-5" />, title: "One Profile, Many Companies", description: "Create your profile once and apply to multiple companies instantly. Your documents travel with you.", accent: "bg-emerald-50 text-emerald-600 border-emerald-100" },
    { icon: <ShieldCheck className="w-5 h-5" />, title: "Verified Companies Only", description: "Every company on I-TAPP is reviewed before listing. Safe, reliable, and professional placements — guaranteed.", accent: "bg-amber-50 text-amber-600 border-amber-100" },
  ],
  student: [
    { icon: <Sparkles className="w-5 h-5" />, title: "SIWES Placement Matching", description: "Get recommendations tailored to your field of study and preferred location across verified companies.", accent: "bg-violet-50 text-violet-600 border-violet-100" },
    { icon: <LayoutDashboard className="w-5 h-5" />, title: "Application Dashboard", description: "Track every application in real time — from submitted to offer received. Full visibility, zero guesswork.", accent: "bg-blue-50 text-blue-600 border-blue-100" },
    { icon: <Send className="w-5 h-5" />, title: "One Profile, Many Companies", description: "Create your profile once and apply to multiple companies. Your resume and documents travel with you.", accent: "bg-emerald-50 text-emerald-600 border-emerald-100" },
    { icon: <ShieldCheck className="w-5 h-5" />, title: "Verified Companies Only", description: "Every company is reviewed before listing. Safe, reliable, and professional SIWES placements.", accent: "bg-amber-50 text-amber-600 border-amber-100" },
  ],
  corps: [
    { icon: <MapPin className="w-5 h-5" />, title: "State-Code Matching", description: "Enter your NYSC state code and we instantly filter PPA opportunities to your posted state. No irrelevant listings.", accent: "bg-emerald-50 text-emerald-600 border-emerald-100" },
    { icon: <Zap className="w-5 h-5" />, title: "Camp Mode", description: "Enable camp mode to see only immediately-available PPAs accepting new corps members — perfect for the 3-week window.", accent: "bg-amber-50 text-amber-600 border-amber-100" },
    { icon: <Send className="w-5 h-5" />, title: "BulkApply™ (Premium)", description: "Upload your resume, set your skills, and we cold-email matching companies on your behalf. Maximize your chances.", accent: "bg-violet-50 text-violet-600 border-violet-100" },
    { icon: <LayoutDashboard className="w-5 h-5" />, title: "PPA Switch Support", description: "Already at a bad PPA? Browse new listings and apply fresh — your current PPA status won't block you.", accent: "bg-blue-50 text-blue-600 border-blue-100" },
  ],
  company: [
    { icon: <Users className="w-5 h-5" />, title: "Dual Talent Pool", description: "Access SIWES students and NYSC corps members from one dashboard. List for both or either — your choice.", accent: "bg-violet-50 text-violet-600 border-violet-100" },
    { icon: <MessageCircle className="w-5 h-5" />, title: "WhatsApp Bot Integration", description: "Get real-time application stats, new applicant alerts, and status updates directly on WhatsApp. Zero dashboard fatigue.", accent: "bg-emerald-50 text-emerald-600 border-emerald-100" },
    { icon: <ShieldCheck className="w-5 h-5" />, title: "CAC-Verified Listings", description: "Your listing is trusted because your company is verified. Attract quality applicants who know you're legitimate.", accent: "bg-amber-50 text-amber-600 border-amber-100" },
    { icon: <Sparkles className="w-5 h-5" />, title: "Admin-Assisted Listing", description: "Don't want to manage it yourself? Our admin team can list and manage opportunities on your behalf.", accent: "bg-blue-50 text-blue-600 border-blue-100" },
  ],
};

const headings = {
  default: { eyebrow: "What We Offer", title: "Everything you need for a successful placement", desc: "From discovery to offer letter — I-TAPP simplifies every step for students, corps members, and companies alike." },
  student: { eyebrow: "For Students", title: "Your SIWES journey, simplified", desc: "From finding placements to tracking applications — everything a student needs, built in one platform." },
  corps: { eyebrow: "For Corps Members", title: "PPA placement, on your terms", desc: "State-matched, fast, and built for the 3-week camp window. Find your PPA before the crowd does." },
  company: { eyebrow: "For Companies", title: "Hire smarter with I-TAPP", desc: "List opportunities, reach verified talent, and manage everything — with WhatsApp bot support built in." },
};

export function Services() {
  const { persona } = usePersona();
  const key = persona ?? "default";
  const h = headings[key];
  const featureList = features[key];

  return (
    <section className="bg-[#f7f8fc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-20 sm:py-28">
        <div className="max-w-2xl mb-14">
          <span className="text-[11px] font-bold uppercase tracking-widest text-primary">{h.eyebrow}</span>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-950 leading-tight tracking-tight">
            {h.title.split("I-TAPP").length > 1 ? (
              <>{h.title.split("I-TAPP")[0]}<span className="text-primary">I-TAPP</span>{h.title.split("I-TAPP")[1]}</>
            ) : h.title}
          </h2>
          <p className="mt-4 text-gray-500 text-base sm:text-lg leading-relaxed">{h.desc}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {featureList.map((feature, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-100 p-7 flex flex-col gap-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${feature.accent}`}>
                {feature.icon}
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-base sm:text-lg font-bold text-gray-900">{feature.title}</h3>
                <p className="text-sm sm:text-[15px] text-gray-500 leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
