"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAction } from "next-safe-action/hooks";
import { toast } from "react-toastify";
import { initializeCompanyPayment } from "@/actions";
import { useFetchCompanyBilling, useFetchPaymentStatus } from "@/queries";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/utils/format-date";

/**
 * Free-trial / payment notice for companies. Quiet while the trial has plenty
 * of time left; a reminder in the last 7 days; a clear "pay to continue" once
 * the trial is over and nothing covers today.
 */
export function CompanyBillingBanner() {
  const queryClient = useQueryClient();
  const { data: billing } = useFetchCompanyBilling();
  const [reference, setReference] = useState<string | undefined>();

  // Coming back from Paystack: the address carries ?reference=...
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("reference") || params.get("trxref");
    if (ref) setReference(ref);
  }, []);

  const { data: payment } = useFetchPaymentStatus(reference);

  // Check again every 3 seconds for about a minute, then stop asking.
  useEffect(() => {
    if (!reference) return;
    let tries = 0;
    const timer = setInterval(() => {
      tries += 1;
      if (tries > 20) {
        clearInterval(timer);
        setReference(undefined);
        return;
      }
      queryClient.invalidateQueries({ queryKey: ["payment-status", reference] });
    }, 3000);
    return () => clearInterval(timer);
  }, [reference, queryClient]);

  useEffect(() => {
    if (!reference || !payment) return;
    if (payment.status === "success") {
      toast.success("Payment received. Thank you!");
      queryClient.invalidateQueries({ queryKey: ["company-billing"] });
      window.history.replaceState({}, "", window.location.pathname);
      setReference(undefined);
    } else if (payment.status === "failed") {
      toast.error("The payment did not go through. Please try again.");
      window.history.replaceState({}, "", window.location.pathname);
      setReference(undefined);
    }
  }, [payment, reference, queryClient]);

  const { execute, isExecuting } = useAction(initializeCompanyPayment, {
    onSuccess({ data }) {
      if (data?.authorizationUrl) window.location.href = data.authorizationUrl;
    },
    onError(error) {
      toast.error(error?.error?.serverError ?? "Could not start the payment. Please try again.");
    },
  });

  if (!billing) return null;

  if (reference && billing.state === "expired") {
    return (
      <div className="border-b border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-900">
        Confirming your payment…
      </div>
    );
  }

  const fee = `₦${billing.feeNaira.toLocaleString("en-NG")}`;
  const yearly = billing.periodDays >= 365;
  const covers = yearly ? "one year" : `${billing.periodDays} days`;

  if (billing.state === "expired") {
    return (
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
        <p>
          <span className="font-semibold">Your free trial has ended.</span> Pay {fee} to keep posting
          opportunities and viewing applicants. One payment covers {covers}.
        </p>
        <Button size="sm" onClick={() => execute()} disabled={isExecuting}>
          {isExecuting ? "Redirecting…" : `Pay ${fee}`}
        </Button>
      </div>
    );
  }

  if (billing.state === "trial" && billing.daysLeft <= 7) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        <p>
          Your free trial ends in <span className="font-semibold">{billing.daysLeft} day{billing.daysLeft === 1 ? "" : "s"}</span> (
          {formatDate(billing.accessUntil)}). After that, {fee} {yearly ? "a year" : `every ${billing.periodDays} days`} keeps your
          listings and applicants available.
        </p>
        <Button size="sm" variant="outline" onClick={() => execute()} disabled={isExecuting}>
          {isExecuting ? "Redirecting…" : `Pay ${fee} now`}
        </Button>
      </div>
    );
  }

  return null;
}
