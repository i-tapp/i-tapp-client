"use client";

import { cn } from "@/utils/tailwind";
import { useMemo, useState } from "react";
import Facts from "./_molecules/facts";
import CompanyProfile from "./_molecules/company-profile";
import Hr from "@/components/ui/hr";
import { Button } from "@/components/ui/button";
import CompanyKyc from "./_molecules/company-verification";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { onBoardCompanySchema, OnboardingDraft } from "@/schemas";
import { onBoardCompany } from "@/actions";
import { Step } from "@/types/wizard";
import * as z from "zod";
import { toast } from "react-toastify";

/**
 * ✅ What this implements:
 * - Desktop: sidebar step list + facts always visible
 * - Mobile: condensed header stepper + progress bar + optional "View steps" / "Why this matters"
 * - Skip: subtle link-style button (not competing with primary CTA)
 * - Review step: real review UI with "Edit" actions
 */

export default function OnboardingPage() {
  const router = useRouter();

  const steps: Step[] = useMemo(
    () => [
      {
        title: "Company Profile",
        description: "Tell students about your company",
        component: CompanyProfile,
      },
      {
        title: "Contact & Verification",
        description:
          "Provide contact details and upload verification documents",
        component: CompanyKyc,
      },
      {
        title: "Review & Submit",
        description: "Review your details and submit for approval",
        component: null,
      },
    ],
    [],
  );

  const { execute, hasErrored, result, isExecuting } = useAction(
    onBoardCompany,
    {
      onSuccess: (res) => {
        console.log("Onboarding successful:", res);
        toast.success(
          "Onboarding submitted! Your account will be reviewed shortly.",
        );
        router.replace("/portal");
      },
      onError: (error) => {
        console.error("Onboarding error:", error);
        // toast.error(
        //   error?.error?.serverError ||
        //     "Failed to submit onboarding. Please try again.",
        // );
      },
    },
  );

  const [currentStep, setCurrentStep] = useState(0);
  const formIdByStep = ["company-profile-form", "kyc-form", null] as const;
  const activeFormId = formIdByStep[currentStep];
  const CurrentStepComponent = steps[currentStep]?.component;

  const isFirst = currentStep === 0;
  const isLast = currentStep === steps.length - 1;

  const [onboardingData, setOnboardingData] = useState<OnboardingDraft>({});

  // mobile-only toggles
  const [mobileShowSteps, setMobileShowSteps] = useState(false);
  const [mobileShowFacts, setMobileShowFacts] = useState(false);

  function next() {
    setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
    setMobileShowSteps(false);
    setMobileShowFacts(false);
  }

  function back() {
    setCurrentStep((s) => Math.max(s - 1, 0));
    setMobileShowSteps(false);
    setMobileShowFacts(false);
  }

  async function skip() {
    router.replace("/portal/dashboard");
    await fetch("/api/company/onboarding/skip", { method: "POST" });
  }

  function handleSubmit() {
    const parsed = onBoardCompanySchema.safeParse(onboardingData);
    if (!parsed.success) {
      console.log("Validation failed:", parsed.error.flatten());
      console.log("error", z.treeifyError(parsed.error));
      return;
    }
    execute(parsed.data);
  }

  return (
    <div className="h-screen w-full flex justify-center px-4 py-6">
      <div className="w-full max-w-6xl flex flex-col md:flex-row md:gap-10">
        {/* ✅ Desktop sidebar only */}
        <aside className="hidden md:block w-72 shrink-0">
          <div className="text-2xl font-semibold">
            Welcome, Company User! 👋
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Let’s set up your account to start finding the best student talent
            for your company.
          </p>

          <div className="mt-4">
            {steps.map((step, index) => (
              <ProgressStage
                key={index}
                index={index}
                step={step}
                currentStep={currentStep}
              />
            ))}
          </div>

          <div className="mt-4">
            <Facts />
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 rounded-xl border overflow-hidden flex flex-col">
          {/* ✅ Mobile header stepper */}
          <div className="md:hidden border-b">
            <MobileHeader
              steps={steps}
              currentStep={currentStep}
              mobileShowSteps={mobileShowSteps}
              setMobileShowSteps={setMobileShowSteps}
              mobileShowFacts={mobileShowFacts}
              setMobileShowFacts={setMobileShowFacts}
              onSkip={skip}
            />

            {/* Collapsible mobile steps list */}
            {mobileShowSteps && (
              <div className="px-4 pb-3">
                <div className="rounded-xl border bg-muted/30 p-3">
                  {steps.map((step, index) => (
                    <ProgressStage
                      key={index}
                      index={index}
                      step={step}
                      currentStep={currentStep}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Collapsible mobile facts */}
            {mobileShowFacts && (
              <div className="px-4 pb-4">
                <div className="rounded-xl border bg-muted/30 p-3">
                  <Facts />
                </div>
              </div>
            )}
          </div>

          {/* ✅ Desktop step header */}
          <div className="hidden md:block p-6 border-b">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="font-semibold text-xl">
                  {steps[currentStep]?.title}
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {steps[currentStep]?.description}
                </p>
              </div>

              {/* Skip as subtle link-style button */}
              <Button
                variant="ghost"
                className="h-auto px-2 py-1 text-sm"
                onClick={skip}
              >
                Skip for now
              </Button>
            </div>
          </div>

          {/* Error display */}
          {hasErrored && (
            <div className="p-4 mx-4 md:mx-6 mt-4 rounded-lg bg-red-100 text-red-800 text-sm">
              {result?.serverError ||
                "An error occurred while submitting your onboarding information."}
            </div>
          )}

          {/* Body */}
          <div className="px-4 md:px-6 py-6 overflow-x-scroll flex-1">
            {CurrentStepComponent ? (
              <CurrentStepComponent
                onNext={(data: Partial<OnboardingDraft>) => {
                  setOnboardingData((prev) => ({ ...prev, ...data }));
                  next();
                }}
                onBack={back}
              />
            ) : (
              <ReviewStep
                data={onboardingData}
                onEditProfile={() => setCurrentStep(0)}
                onEditKyc={() => setCurrentStep(1)}
              />
            )}
          </div>

          <Hr />

          {/* Footer nav */}
          <div className="p-4 md:p-6 pt-3 flex items-center justify-between gap-3">
            <Button
              variant="outline"
              onClick={back}
              disabled={isFirst}
              className="min-w-[120px]"
            >
              Back
            </Button>

            <Button
              form={!isLast ? (activeFormId ?? undefined) : undefined}
              type={!isLast ? "submit" : "button"}
              onClick={isLast ? handleSubmit : undefined}
              className="min-w-40"
              disabled={isExecuting}
            >
              {isExecuting ? "Submitting..." : isLast ? "Submit" : "Continue"}
              {isExecuting && (
                <div className="ml-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              )}
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
}

/* ----------------------------- Mobile Header ----------------------------- */

function MobileHeader(props: {
  steps: Step[];
  currentStep: number;
  mobileShowSteps: boolean;
  setMobileShowSteps: (v: boolean) => void;
  mobileShowFacts: boolean;
  setMobileShowFacts: (v: boolean) => void;
  onSkip: () => void;
}) {
  const {
    steps,
    currentStep,
    mobileShowSteps,
    setMobileShowSteps,
    mobileShowFacts,
    setMobileShowFacts,
    onSkip,
  } = props;

  const total = steps.length;
  const stepIndex = currentStep + 1;
  const progressPct = Math.round((stepIndex / total) * 100);

  return (
    <div className="px-4 pt-4 pb-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm text-muted-foreground">
            Step {stepIndex} of {total}
          </div>
          <div className="font-semibold text-base truncate">
            {steps[currentStep]?.title}
          </div>
          <div className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
            {steps[currentStep]?.description}
          </div>
        </div>

        <Button
          variant="ghost"
          className="h-auto px-2 py-1 text-sm shrink-0"
          onClick={onSkip}
        >
          Skip
        </Button>
      </div>

      {/* progress bar */}
      <div className="mt-3">
        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-primary"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <div className="mt-3 flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => {
              setMobileShowSteps(!mobileShowSteps);
              if (!mobileShowSteps) setMobileShowFacts(false);
            }}
          >
            {mobileShowSteps ? "Hide steps" : "View steps"}
          </Button>

          <Button
            variant="outline"
            className="flex-1"
            onClick={() => {
              setMobileShowFacts(!mobileShowFacts);
              if (!mobileShowFacts) setMobileShowSteps(false);
            }}
          >
            {mobileShowFacts ? "Hide info" : "Why this matters"}
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------- Progress Stage ---------------------------- */

const ProgressStage = ({
  index,
  step,
  currentStep,
}: {
  index: number;
  step: Step;
  currentStep: number;
}) => {
  const isActive = currentStep === index;
  const isDone = currentStep > index;

  return (
    <div className="flex flex-row gap-3 items-start py-3">
      <div
        className={cn(
          "h-10 w-10 rounded-full flex items-center justify-center border text-sm font-medium shrink-0",
          isDone && "bg-primary text-primary-foreground border-primary",
          isActive && "border-primary bg-primary/10 text-primary",
          !isActive && !isDone && "bg-muted text-muted-foreground",
        )}
      >
        {index + 1}
      </div>

      <div className="min-w-0">
        <div
          className={cn(
            "text-sm font-medium",
            isActive ? "text-primary font-semibold" : "text-foreground",
          )}
        >
          {step.title}
        </div>
        <div className="text-xs text-muted-foreground">{step.description}</div>
      </div>
    </div>
  );
};

/* ------------------------------ Review Step ------------------------------ */

function ReviewStep(props: {
  data: OnboardingDraft;
  onEditProfile: () => void;
  onEditKyc: () => void;
}) {
  const { data, onEditProfile, onEditKyc } = props;

  // NOTE: I don’t know your exact field names in OnboardingDraft.
  // So this is intentionally defensive and “display what exists”.
  // Replace keys below with your actual schema keys for a cleaner review.

  const profileKeys = [
    "companyName",
    "website",
    "industry",
    "size",
    "location",
    "about",
    "logoUrl",
  ] as const;

  const kycKeys = [
    "contactName",
    "contactEmail",
    "contactPhone",
    "cacDocument",
    "addressProof",
  ] as const;

  const profileItems = pickKnown(data, profileKeys);
  const kycItems = pickKnown(data, kycKeys);

  return (
    <div className="space-y-4">
      <div className="rounded-xl border p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="font-semibold">
              Public profile (students can see this)
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              Make sure this represents your company well.
            </div>
          </div>
          <Button variant="outline" onClick={onEditProfile}>
            Edit
          </Button>
        </div>

        <div className="mt-4 grid gap-2 text-sm">
          {profileItems.length ? (
            profileItems.map(([k, v]) => <Row key={k} label={k} value={v} />)
          ) : (
            <div className="text-muted-foreground">
              No profile fields detected here yet. Wire your real keys into the
              review step.
            </div>
          )}
        </div>
      </div>

      <div className="rounded-xl border p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="font-semibold">
              Private verification (only your team + admin)
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              This is used for verification and account approval.
            </div>
          </div>
          <Button variant="outline" onClick={onEditKyc}>
            Edit
          </Button>
        </div>

        <div className="mt-4 grid gap-2 text-sm">
          {kycItems.length ? (
            kycItems.map(([k, v]) => <Row key={k} label={k} value={v} />)
          ) : (
            <div className="text-muted-foreground">
              No verification fields detected here yet. Wire your real keys into
              the review step.
            </div>
          )}
        </div>
      </div>

      <div className="rounded-xl border bg-muted/30 p-4 text-sm text-muted-foreground">
        When you click{" "}
        <span className="font-medium text-foreground">Submit</span>, your
        account will be reviewed for approval.
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: unknown }) {
  return (
    <div className="flex gap-3">
      <div className="w-44 shrink-0 text-muted-foreground capitalize truncate">
        {label.replace(/([A-Z])/g, " $1")}
      </div>
      <div className="min-w-0">
        <div className="break-words text-foreground">{formatValue(value)}</div>
      </div>
    </div>
  );
}

function formatValue(v: unknown) {
  if (v == null) return "—";
  if (typeof v === "string") return v.length ? v : "—";
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  if (Array.isArray(v)) return v.length ? v.join(", ") : "—";
  if (typeof v === "object") return "[object]";
  return String(v);
}

function pickKnown<T extends Record<string, any>, K extends readonly string[]>(
  data: T,
  keys: K,
): [string, unknown][] {
  return keys
    .map((k) => [k, data?.[k as keyof T]] as [string, unknown])
    .filter(
      ([, v]) =>
        v !== undefined &&
        v !== null &&
        !(typeof v === "string" && v.trim() === ""),
    );
}
