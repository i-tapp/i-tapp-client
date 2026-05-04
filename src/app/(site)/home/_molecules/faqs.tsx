import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is I-TAPP?",
    answer:
      "I-TAPP is a web-based platform where Nigerian students can find, apply for, and secure industrial training placements in verified companies — all from their device, without visiting companies in person.",
  },
  {
    question: "How does I-TAPP work?",
    answer:
      "Students register, build a profile, then browse and apply to placement opportunities across verified companies. Companies can review applications, accept or decline, and manage their interns — all through the platform.",
  },
  {
    question: "Is I-TAPP free to use?",
    answer:
      "I-TAPP uses a freemium model. You can apply to a limited number of companies for free. Once that limit is reached, a small fee unlocks unlimited applications across our full company database.",
  },
  {
    question: "How do I know a company is legitimate?",
    answer:
      "Every company on I-TAPP goes through a verification process before they can post opportunities. Verified companies display a badge on their profile and listings.",
  },
  {
    question: "How can I contact I-TAPP support?",
    answer:
      "You can reach our support team at support@i-tapp.com or via WhatsApp at +2348081047072. We're available to help with account issues, placement questions, and more.",
  },
];

export function Faqs() {
  return (
    <section className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-20 sm:py-28">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          {/* Left label */}
          <div className="lg:w-72 shrink-0">
            <span className="text-[11px] font-bold uppercase tracking-widest text-primary">
              FAQ
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-950 leading-tight tracking-tight">
              Common questions, answered
            </h2>
            <p className="mt-4 text-gray-500 text-sm sm:text-base leading-relaxed">
              Can&apos;t find what you&apos;re looking for? Reach out at{" "}
              <a
                href="mailto:support@i-tapp.com"
                className="text-primary hover:underline font-medium"
              >
                support@i-tapp.com
              </a>
            </p>
          </div>

          {/* Accordion */}
          <div className="flex-1">
            <Accordion type="single" collapsible className="flex flex-col gap-2">
              {faqs.map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="border border-gray-100 rounded-xl px-5 bg-gray-50/50 hover:bg-gray-50 transition-colors data-[state=open]:bg-white data-[state=open]:shadow-sm"
                >
                  <AccordionTrigger className="text-sm sm:text-base font-semibold text-gray-900 py-5 hover:no-underline text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm sm:text-[15px] text-gray-500 leading-relaxed pb-5">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
