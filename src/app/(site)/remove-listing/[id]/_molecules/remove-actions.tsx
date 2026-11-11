"use client";

import { useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { removeListing } from "@/actions";
import type { ListingLinkSummary } from "@/lib/listing-links";

export function RemoveListingActions({
  id,
  token,
  summary,
}: {
  id: string;
  token: string;
  summary: ListingLinkSummary;
}) {
  const [done, setDone] = useState(summary.alreadyRemoved);
  const { execute, isExecuting, result } = useAction(removeListing, {
    onSuccess: () => setDone(true),
  });

  if (done) {
    return (
      <>
        <CheckCircle2 className="mx-auto h-10 w-10 text-green-600" />
        <h1 className="mt-3 text-lg font-bold">Listing removed</h1>
        <p className="mt-2 text-sm text-gray-500">
          &ldquo;{summary.title}&rdquo; is no longer shown on PlaceIT, and we
          won&apos;t email this address again.
        </p>
      </>
    );
  }

  return (
    <>
      <h1 className="text-lg font-bold">Remove this listing?</h1>
      <p className="mt-2 text-sm text-gray-500">
        &ldquo;{summary.title}&rdquo;
        {summary.companyName ? ` at ${summary.companyName}` : ""} will stop
        appearing on PlaceIT straight away, and you won&apos;t get any more
        application emails from us.
      </p>
      {result?.serverError && (
        <p className="mt-3 text-sm text-red-600">{result.serverError}</p>
      )}
      <Button
        className="mt-5 w-full"
        disabled={isExecuting}
        onClick={() => execute({ id, token })}
      >
        {isExecuting ? "Removing…" : "Yes, remove this listing"}
      </Button>
    </>
  );
}
