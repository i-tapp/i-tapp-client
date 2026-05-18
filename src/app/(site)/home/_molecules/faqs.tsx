"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { usePersona } from "@/app/(site)/_context/persona";

const faqData = {
  default: [
    { question: "What is I-TAPP?", answer: "I-TAPP is Nigeria's placement marketplace connecting SIWES students and NYSC corps members to verified companies for IT and PPA placements — all from one platform." },
    { question: "Who can use I-TAPP?", answer: "Students looking for SIWES / IT placements, NYSC corps members seeking PPA opportunities, and companies wanting to list placement slots for either or both groups." },
    { question: "Is I-TAPP free to use?", answer: "I-TAPP uses a freemium model. Basic applications are free. BulkApply™ and cold-email outreach are available as premium add-ons." },
    { question: "Are companies on I-TAPP verified?", answer: "Yes. Every company is verified with CAC registration before they can post opportunities. Verified companies display a badge on their profile and listings." },
    { question: "How can I contact I-TAPP support?", answer: "Reach our support team at support@i-tapp.com or via WhatsApp at +2348081047072. We're available to help with account issues, placement questions, and more." },
  ],
  student: [
    { question: "What is SIWES and how does I-TAPP help?", answer: "SIWES (Student Industrial Work Experience Scheme) requires students in technical courses to undergo industrial training. I-TAPP helps you find, apply for, and track SIWES placements at verified companies — without cold emails or walk-ins." },
    { question: "How do I apply for a SIWES placement?", answer: "Create an account, build your profile with your field of study and skills, then browse available SIWES opportunities and apply directly. Track your application status in real time from your dashboard." },
    { question: "Is I-TAPP free for students?", answer: "Yes. Students can apply to placements for free. A freemium limit applies — after a certain number of applications, a small fee unlocks unlimited access to our full company database." },
    { question: "How do I know a company is legitimate?", answer: "Every company on I-TAPP goes through CAC verification before listing. Verified companies display a badge on their profile and all their listings." },
    { question: "Can I track my applications?", answer: "Yes. Your dashboard shows every application you've submitted, with real-time status updates — from submitted to accepted or declined." },
  ],
  corps: [
    { question: "What is a PPA and how does I-TAPP help?", answer: "A PPA (Place of Primary Attachment) is the organization where a corps member serves during their NYSC service year. I-TAPP helps you find verified PPA opportunities matched to your posted state — so you don't have to rely on WhatsApp groups or cold emails." },
    { question: "How does state-code matching work?", answer: "When you sign up, enter your NYSC state code (e.g. LA/24B/1234). We parse your state and show only PPA listings available in that state — so you never see irrelevant opportunities." },
    { question: "What is BulkApply™?", answer: "BulkApply™ is a premium feature where you upload your resume and set your skills. We then cold-email matching companies and PPA hosts on your behalf — giving you a much better chance of securing a PPA, even from within camp." },
    { question: "Can I switch my current PPA using I-TAPP?", answer: "Yes. If you're already at a PPA and want to switch, simply browse new listings and apply fresh. Your current PPA status won't block you from applying elsewhere." },
    { question: "What is camp mode?", answer: "Camp mode is a filter you enable when you're in your 3-week orientation camp. It shows only immediately-available PPA listings — companies actively accepting new corps members right now." },
  ],
  company: [
    { question: "Who can list opportunities on I-TAPP?", answer: "Any CAC-registered company can sign up and list opportunities. The I-TAPP admin team can also list on your behalf — just reach out if you'd prefer a managed service." },
    { question: "Can I list both SIWES and NYSC PPA slots?", answer: "Yes. When creating a listing, you can designate it as SIWES, PPA, or both. This lets you reach students and corps members from a single opportunity post." },
    { question: "What is the WhatsApp bot integration?", answer: "Once connected, our WhatsApp bot sends you real-time application stats, new applicant alerts, and slot fill notifications directly to your WhatsApp — no login required." },
    { question: "How do I verify my company?", answer: "During signup, you'll be asked to provide your CAC registration number and basic company details. Our admin team reviews and verifies within 24–48 hours. Verified companies receive a badge on all listings." },
    { question: "Is it free to list opportunities?", answer: "Yes. Listing opportunities on I-TAPP is free. Premium features like promoted listings and admin-managed listings are available for companies with higher volume needs." },
  ],
};

export function Faqs() {
  const { persona } = usePersona();
  const key = persona ?? "default";
  const faqs = faqData[key];

  return (
    <section className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-20 sm:py-28">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          <div className="lg:w-72 shrink-0">
            <span className="text-[11px] font-bold uppercase tracking-widest text-primary">FAQ</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-950 leading-tight tracking-tight">
              Common questions, answered
            </h2>
            <p className="mt-4 text-gray-500 text-sm sm:text-base leading-relaxed">
              Can&apos;t find what you&apos;re looking for? Reach out at{" "}
              <a href="mailto:support@i-tapp.com" className="text-primary hover:underline font-medium">
                support@i-tapp.com
              </a>
            </p>
          </div>
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
