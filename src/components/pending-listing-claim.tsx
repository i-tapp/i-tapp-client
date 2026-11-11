"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { claimListings } from "@/actions";

/**
 * A company that opened a "claim your listing" email and signed in (or was
 * already signed in) lands on its dashboard. If a claim is waiting, finish it
 * here so the listing and its applicants appear on the account.
 */
export function PendingListingClaim() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const token = sessionStorage.getItem("listingClaimToken");
    if (!token) return;
    sessionStorage.removeItem("listingClaimToken");

    claimListings({ token }).then((res) => {
      if (res?.serverError) {
        toast.error(res.serverError);
        return;
      }
      toast.success("Your listing has been added to your account.");
      queryClient.invalidateQueries();
    });
  }, [queryClient]);

  return null;
}
