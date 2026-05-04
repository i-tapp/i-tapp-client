import {
  Sparkles,
  LayoutDashboard,
  Send,
  ShieldCheck,
} from "lucide-react";

const features = [
  {
    icon: <Sparkles className="w-5 h-5" />,
    title: "Tailored Placement Matching",
    description:
      "Get personalized placement recommendations based on your field of study, location, and preferences — no more cold searching.",
    accent: "bg-violet-50 text-violet-600 border-violet-100",
  },
  {
    icon: <LayoutDashboard className="w-5 h-5" />,
    title: "Application Dashboard",
    description:
      "Track every application in real time — from submitted to offer received. Full visibility, zero guesswork.",
    accent: "bg-blue-50 text-blue-600 border-blue-100",
  },
  {
    icon: <Send className="w-5 h-5" />,
    title: "One Profile, Many Companies",
    description:
      "Create your profile once and apply to multiple companies instantly. Your documents travel with you.",
    accent: "bg-emerald-50 text-emerald-600 border-emerald-100",
  },
  {
    icon: <ShieldCheck className="w-5 h-5" />,
    title: "Verified Companies Only",
    description:
      "Every company on I-TAPP is reviewed before listing. Safe, reliable, and professional placements — guaranteed.",
    accent: "bg-amber-50 text-amber-600 border-amber-100",
  },
];

export function Services() {
  return (
    <section className="bg-[#f7f8fc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-20 sm:py-28">
        {/* Header */}
        <div className="max-w-2xl mb-14">
          <span className="text-[11px] font-bold uppercase tracking-widest text-primary">
            What We Offer
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-950 leading-tight tracking-tight">
            Everything you need for a{" "}
            <span className="text-primary">successful placement</span>
          </h2>
          <p className="mt-4 text-gray-500 text-base sm:text-lg leading-relaxed">
            From discovery to offer letter — I-TAPP simplifies every step of
            the SIWES journey for students and companies alike.
          </p>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {features.map((feature, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-100 p-7 flex flex-col gap-5
                shadow-[0_2px_12px_rgba(0,0,0,0.04)]
                hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)]
                hover:-translate-y-0.5
                transition-all duration-300"
            >
              <div
                className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${feature.accent}`}
              >
                {feature.icon}
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-base sm:text-lg font-bold text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-[15px] text-gray-500 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
