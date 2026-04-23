"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/utils/tailwind";
import { useMemo, useState } from "react";
import SchoolInfoStep from "./_molecules/school-info";
import PreferencesStep from "./_molecules/preferences";
import DocumentStep from "./_molecules/document";
import { Step } from "@/types/wizard";
import { DocumentSchema, studentOnboardingSchema } from "@/schemas";
import { useAction } from "next-safe-action/hooks";
import { onBoardStudent } from "@/actions";
import { useRouter } from "next/navigation";

export default function StudentOnboardingPage() {
  const router = useRouter();
  const steps: Step[] = useMemo(
    () => [
      {
        title: "Profile",
        description: "Basic student information",
        component: SchoolInfoStep,
      },
      {
        title: "Education",
        description: "Academic background",
        component: PreferencesStep,
      },
      {
        title: "Preferences",
        description: "Internship preferences",
        component: DocumentStep,
      },
    ],
    [],
  );

  const { execute, isExecuting, hasErrored, result } = useAction(
    onBoardStudent,
    {
      onSuccess: () => {
        router.refresh();
        router.push("/portal");
      },
      onError: () => {},
    },
  );

  const [onboardingData, setOnboardingData] = useState({});
  const [currentStep, setCurrentStep] = useState(0);

  const formIdByStep = [
    "school-info-step-form",
    "preferences-step-form",
    "document-step-form",
  ] as const;

  const activeFormId = formIdByStep[currentStep];
  const isLast = currentStep === steps.length - 1;
  const CurrentStepComponent = steps[currentStep]?.component;

  const handleSubmit = (finalStepData?: DocumentSchema) => {
    const completeData = { ...onboardingData, ...finalStepData };
    const parse = studentOnboardingSchema.safeParse(completeData);
    if (!parse.success) return;
    execute(parse.data);
  };

  return (
    <div className="min-h-screen w-full bg-background">
      <div className="mx-auto w-full max-w-3xl px-4 py-6 md:py-10">
        {/* Stepper */}
        <header className="mb-6">
          {/* Mobile: compact progress bar + step label */}
          <div className="flex md:hidden flex-col gap-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-foreground">
                {steps[currentStep]?.title}
              </span>
              <span className="text-muted-foreground">
                Step {currentStep + 1} of {steps.length}
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{
                  width: `${((currentStep + 1) / steps.length) * 100}%`,
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {steps[currentStep]?.description}
            </p>
          </div>

          {/* Desktop: full step indicators */}
          <div className="hidden md:flex items-start justify-between gap-2">
            {steps.map((step, index) => (
              <ProgressStage
                key={step.title}
                index={index}
                step={step}
                currentStep={currentStep}
                isLast={index === steps.length - 1}
              />
            ))}
          </div>
        </header>

        {/* Shell */}
        <div className="w-full bg-card rounded-xl border overflow-hidden">
          {/* Content */}
          <main className="p-4 sm:p-6">
            <div className="space-y-1 mb-6">
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
                Welcome to I-Tapp! 🎉
              </h1>
              <p className="text-sm text-muted-foreground">
                Let's set up your profile so we can match you with internship
                opportunities that fit you.
              </p>
            </div>

            {hasErrored && (
              <div className="mb-4 rounded-lg bg-red-100 text-red-800 text-sm px-4 py-3">
                {result.serverError ||
                  "An error occurred while submitting your onboarding information."}
              </div>
            )}

            <div className="rounded-xl border p-4 sm:p-5 bg-white">
              {CurrentStepComponent ? (
                <CurrentStepComponent
                  onNext={(data) => {
                    setOnboardingData((prev) => ({ ...prev, ...data }));
                    if (currentStep === steps.length - 1) {
                      handleSubmit(data);
                    } else {
                      setCurrentStep((prev) => prev + 1);
                    }
                  }}
                  onBack={() =>
                    setCurrentStep((prev) => Math.max(prev - 1, 0))
                  }
                />
              ) : (
                <div className="rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground">
                  This step is not implemented yet.
                </div>
              )}
            </div>
          </main>

          {/* Footer nav */}
          <div className="flex items-center justify-end gap-3 border-t px-4 sm:px-6 py-4">
            <Button
              form={activeFormId}
              type="submit"
              disabled={isExecuting}
              className="rounded-xl px-6"
            >
              {isExecuting
                ? "Processing..."
                : isLast
                  ? "Submit"
                  : "Next Step →"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

const ProgressStage = ({
  index,
  step,
  currentStep,
  isLast,
}: {
  index: number;
  step: Step;
  currentStep: number;
  isLast: boolean;
}) => {
  const isActive = currentStep === index;
  const isDone = currentStep > index;

  return (
    <div className="flex flex-1 items-start gap-3 min-w-0">
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "h-10 w-10 rounded-full flex items-center justify-center border text-sm font-medium shrink-0",
            isDone && "bg-primary text-primary-foreground border-primary",
            isActive && "border-primary bg-primary/10 text-primary",
            !isActive && !isDone && "bg-muted text-muted-foreground",
          )}
        >
          {isDone ? "✓" : index + 1}
        </div>

        {!isLast && (
          <div
            className={cn(
              "h-0.5 w-full max-w-[120px] rounded-full",
              isDone ? "bg-primary" : "bg-border",
            )}
          />
        )}
      </div>

      <div className="min-w-0 pt-1">
        <div
          className={cn(
            "text-sm font-medium leading-snug",
            isActive ? "text-primary font-semibold" : "text-foreground",
          )}
        >
          {step.title}
        </div>
        <div className="text-xs text-muted-foreground line-clamp-1">
          {step.description}
        </div>
      </div>
    </div>
  );
};
