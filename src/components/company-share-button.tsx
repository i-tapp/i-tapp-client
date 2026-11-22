"use client";

import { ShareOpportunityButton } from "@/components/share-opportunity-button";

type CompanyOpportunity = {
  id: string;
  title?: string | null;
  status?: string | null;
  programType?: string | null;
  organisationName?: string | null;
  company?: { name?: string | null } | null;
};

/**
 * Share button for a company's own opportunity (WhatsApp, Telegram, email,
 * copy link, or the phone's share sheet). Only open opportunities get one:
 * drafts and closed ones have no public page to send people to.
 */
export function CompanyShareButton({
  opportunity,
  companyName,
  variant = "icon",
  className,
}: {
  opportunity: CompanyOpportunity | null | undefined;
  /** Used when the opportunity itself doesn't carry the company's name. */
  companyName?: string | null;
  variant?: "icon" | "button";
  className?: string;
}) {
  if (!opportunity?.id || opportunity.status !== "open") return null;

  return (
    <ShareOpportunityButton
      variant={variant}
      className={className}
      opportunity={{
        id: opportunity.id,
        title: opportunity.title,
        companyName:
          opportunity.company?.name ?? opportunity.organisationName ?? companyName ?? null,
        // Older company listings have no program type: they were all SIWES.
        program: opportunity.programType === "ppa" ? "ppa" : "siwes",
      }}
    />
  );
}
