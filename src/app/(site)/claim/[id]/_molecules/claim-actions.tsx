"use client";

import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { Button } from "@/components/ui/button";
import { startListingClaim } from "@/actions";
import type { ListingLinkSummary } from "@/lib/listing-links";

export function ClaimActions({
  id,
  token,
  summary,
}: {
  id: string;
  token: string;
  summary: ListingLinkSummary;
}) {
  const router = useRouter();

  const go = (path: "/company/signup" | "/company/signin") => (data: {
    data?: { claimToken: string };
  }) => {
    const claimToken = data?.data?.claimToken;
    if (!claimToken) return;
    sessionStorage.setItem("listingClaimToken", claimToken);
    router.push(`${path}?claim=${encodeURIComponent(claimToken)}`);
  };

  const signup = useAction(startListingClaim, { onSuccess: go("/company/signup") });
  const signin = useAction(startListingClaim, { onSuccess: go("/company/signin") });
  const busy = signup.isExecuting || signin.isExecuting;
  const error = signup.result?.serverError ?? signin.result?.serverError;

  if (summary.claimed) {
    return (
      <div className="text-center">
        <h1 className="text-lg font-bold">Already claimed</h1>
        <p className="mt-2 text-sm text-gray-500">
          &ldquo;{summary.title}&rdquo; has already been claimed. Sign in to
          your company account to manage it.
        </p>
        <Button className="mt-5 w-full" onClick={() => router.push("/company/signin")}>
          Sign in
        </Button>
      </div>
    );
  }

  const n = summary.applicantCount;
  return (
    <>
      <h1 className="text-lg font-bold text-center">Claim your listing on PlaceIT</h1>
      <p className="mt-3 text-sm text-gray-600">
        Your opportunity <strong>&ldquo;{summary.title}&rdquo;</strong> was listed on
        PlaceIT to connect you with placement-ready SIWES students and NYSC Corps
        Members.
      </p>
      <p className="mt-3 text-sm text-gray-600">
        {n > 0
          ? `${n} ${n === 1 ? "person has" : "people have"} applied so far. `
          : ""}
        Claim it to see all applicants in one place, shortlist the ones you like, and
        post more opportunities for free.
      </p>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      <div className="mt-5 space-y-2">
        <Button
          className="w-full"
          disabled={busy}
          onClick={() => signup.execute({ id, token })}
        >
          {signup.isExecuting ? "One moment…" : "Create a free company account"}
        </Button>
        <Button
          variant="outline"
          className="w-full"
          disabled={busy}
          onClick={() => signin.execute({ id, token })}
        >
          {signin.isExecuting ? "One moment…" : "I already have a company account"}
        </Button>
      </div>
    </>
  );
}
