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
      // {
      //   title: "Submit",
      //   description: "Review and submit your information",
      //   component: null,
      // },
    ],
    [],
  );

  const { execute, hasErrored, result } = useAction(onBoardStudent, {
    onSuccess: (res) => {
      console.log("Onboarding successful:", res);
      router.refresh();
      router.push("/portal");
    },
    onError: (error) => {
      console.error("Onboarding error:", error);
    },
  });

  const [onboardingData, setOnboardingData] = useState({});

  const [currentStep, setCurrentStep] = useState(0);
  const formIdByStep = [
    "school-info-step-form",
    "preferences-step-form",
    "document-step-form",
  ] as const;
  const activeFormId = formIdByStep[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === steps.length - 1;
  const CurrentStepComponent = steps[currentStep]?.component;

  const onBack = () => {};

  // function next() {
  //   const wasLastStep = currentStep === steps.length - 1;

  //   if (wasLastStep) {
  //     handleSubmit();
  //   } else {
  //     setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  //   }
  // }

  const handleSubmit = (finalStepData?: DocumentSchema) => {
    const completeData = { ...onboardingData, ...finalStepData };
    console.log("Submitting final data...", onboardingData);

    const parse = studentOnboardingSchema.safeParse(completeData);
    if (!parse.success) {
      console.error("Validation errors:", parse.error.format());
      return;
    }

    execute(parse.data);
  };

  return (
    <div className="min-h-screen w-full bg-background">
      <div className="mx-auto w-full max-w-6xl md:px-4 md:py-8">
        {/* Shell */}
        <div className="w-full bg-card overflow-hidden">
          {/* Stepper */}
          <header className="border-b bg-card/60 px-6 py-5">
            <div className="flex items-start justify-between gap-4">
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

          {/* Content */}
          <main className="grid grid-cols-1 gap-8 p-4 md:p-6 md:grid-cols-2 items-start">
            {/* Left: form area */}
            <section className="min-w-0">
              <div className="space-y-2">
                <h1 className="text-2xl font-semibold tracking-tight">
                  Welcome to I-Tapp! 🎉
                </h1>
                <p className="text-sm text-muted-foreground">
                  Let’s set up your profile so we can match you with internship
                  opportunities that fit you.
                </p>
              </div>

              {hasErrored && (
                <div className="mt-4 p-4 mb-0 rounded-lg bg-red-100 text-red-800 text-sm">
                  {result.serverError ||
                    "An error occurred while submitting your onboarding information."}
                </div>
              )}

              <div className="mt-6 rounded-xl border p-5 bg-white">
                {CurrentStepComponent ? (
                  <CurrentStepComponent
                    onNext={(data) => {
                      setOnboardingData((prev) => ({ ...prev, ...data }));
                      if (currentStep === steps.length - 1) {
                        // Pass the data directly to handleSubmit
                        handleSubmit(data);
                      } else {
                        setCurrentStep((prev) => prev + 1);
                      }
                    }}
                    onBack={onBack}
                  />
                ) : (
                  <div className="rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground">
                    This step is not implemented yet.
                  </div>
                )}
              </div>
              <div className="mt-6 flex items-center justify-between gap-3">
                <Button
                  onClick={async () => {
                    await fetch("/api/student/onboarding/skip", {
                      method: "POST",
                    });
                    router.push("/portal");
                  }}
                  variant={"ghost"}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Skip for now
                </Button>

                <Button
                  form={activeFormId}
                  // type={!isLast ? "submit" : "button"}
                  type="submit"
                  // onClick={isLast ? handleSubmit : undefined}
                  className="rounded-xl px-6"
                >
                  {isLast ? "Submit" : "Next Step →"}
                </Button>
              </div>
            </section>

            {/* Right: preview/info card */}
            <aside className="hidden md:block min-w-0">
              <div className="relative h-full rounded-2xl border bg-muted/30 p-5 overflow-hidden">
                right side
              </div>
            </aside>
          </main>
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
      {/* Node + line */}
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
              "hidden md:block h-0.5 w-full max-w-[180px] rounded-full",
              isDone ? "bg-primary" : "bg-border",
            )}
          />
        )}
      </div>

      {/* Labels */}
      <div className="min-w-0 pt-1">
        <div
          className={cn(
            "text-sm font-medium leading-snug",
            "whitespace-normal wrap-break-words line-clamp-2",
            isActive ? "text-primary font-semibold" : "text-foreground",
          )}
        >
          {step.title}
        </div>
        <div className="hidden md:block text-xs text-muted-foreground line-clamp-1">
          {step.description}
        </div>
      </div>
    </div>
  );
};
