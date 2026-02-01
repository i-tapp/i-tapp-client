"use client";

import { cn } from "@/utils/tailwind";
import { useMemo, useState } from "react";
import Facts from "./_molecules/facts";
import CompanyProfile from "./_molecules/company-profile";
import Hr from "@/components/ui/hr";
import { Button } from "@/components/ui/button";
import CompanyKyc from "./_molecules/company-verification";
import z from "zod";
import { useAction } from "next-safe-action/hooks";
import { onBoardCompany } from "@/actions/company";
import { onBoardCompanySchema } from "@/lib/validations/company";
import { useRouter } from "next/navigation";

type StepComponentProps = {
  onNext: (data?: any) => void;
  onBack: () => void;
};

type Step = {
  title: string;
  description: string;
  component?: React.ComponentType<StepComponentProps> | null;
};

type OnboardingData = z.infer<typeof onBoardCompanySchema>;
type OnboardingDraft = Partial<OnboardingData>;

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

  const { execute, hasErrored, result } = useAction(onBoardCompany, {
    onSuccess: (res) => {
      console.log("Onboarding successful:", res);
    },
    onError: (error) => {
      console.error("Onboarding error:", error);
    },
  });

  const [currentStep, setCurrentStep] = useState(0);
  const formIdByStep = ["company-profile-form", "kyc-form", null] as const;
  const activeFormId = formIdByStep[currentStep];
  const CurrentStepComponent = steps[currentStep]?.component;
  const isFirst = currentStep === 0;
  const isLast = currentStep === steps.length - 1;

  const [onboardingData, setOnboardingData] = useState<OnboardingDraft>({});

  function next() {
    setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
  }

  function back() {
    setCurrentStep((s) => Math.max(s - 1, 0));
  }

  function handleSubmit() {
    console.log("Submitting onboarding data:", onboardingData);

    const parsed = onBoardCompanySchema.safeParse(onboardingData);

    if (!parsed.success) {
      console.log("Validation failed:", parsed.error.flatten());
      return;
    }

    execute(parsed.data);
  }

  return (
    <div className="min-h-screen w-full flex justify-center px-4 py-6">
      <div className="w-full max-w-6xl flex flex-col md:flex-row gap-30">
        {/* Sidebar */}
        <aside className="w-full md:w-70 shrink-0">
          <div className="text-2xl font-semibold">
            Welcome, Company User! 👋
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Let’s set up your account to start finding the best student talent
            for your company.
          </p>

          {steps.map((step, index) => (
            <ProgressStage
              key={index}
              index={index}
              step={step}
              currentStep={currentStep}
            />
          ))}

          <Facts />
        </aside>

        {/* Main content */}
        <main className="flex-1 bg-white rounded-xl border p-2 overflow-hidden gap-6 flex flex-col">
          {/* onboarding form / steps go here */}
          <div className="p-6 border-b">
            <h1 className="font-semibold text-xl">
              {steps[currentStep]?.title}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {steps[currentStep]?.description}
            </p>

            <Button
              onClick={async () => {
                await fetch("/api", { method: "POST" });
                router.push("/portal/dashboard");
              }}
            >
              Skip
            </Button>
          </div>

          {/* Error display */}
          {hasErrored && (
            <div className="p-4 mx-6 mb-0 rounded-lg bg-red-100 text-red-800 text-sm">
              {result.serverError ||
                "An error occurred while submitting your onboarding information."}
            </div>
          )}

          {/* Form component goes here */}

          <div className="px-6">
            {CurrentStepComponent ? (
              <CurrentStepComponent
                onNext={(data) => {
                  setOnboardingData((prev) => ({
                    ...prev,
                    ...data,
                  }));
                  next();
                }}
                onBack={back}
              />
            ) : (
              <div className="rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground">
                This step is not implemented yet.
              </div>
            )}
          </div>

          <Hr />

          <div className="p-6 pt-4 flex items-center justify-between gap-3">
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
            >
              {isLast ? "Submit" : "Continue"}
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
}

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
