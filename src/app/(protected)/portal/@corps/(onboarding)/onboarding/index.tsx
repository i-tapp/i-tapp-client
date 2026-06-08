"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { cn } from "@/utils/tailwind";
import { Step } from "@/types/wizard";
import { corpsOnboardingSchema, CorpsDocumentSchema } from "@/schemas";
import { onBoardCorps } from "@/actions";
import { Button } from "@/components/ui/button";
import CorpsPersonalInfoStep from "./_molecules/personal-info";
import CorpsNyscInfoStep from "./_molecules/nysc-info";
import CorpsSkillsStep from "./_molecules/skills";
import CorpsDocumentStep from "./_molecules/documents";

const FORM_IDS = [
  "corps-personal-info-form",
  "corps-nysc-info-form",
  "corps-skills-form",
  "corps-documents-form",
] as const;

export default function CorpsOnboardingPage() {
  const router = useRouter();
  const [onboardingData, setOnboardingData] = useState<Record<string, any>>({});
  const [currentStep, setCurrentStep] = useState(0);

  const steps: Step[] = useMemo(() => [
    { title: "Personal Info", description: "Your name, phone & gender", component: CorpsPersonalInfoStep },
    { title: "NYSC Details", description: "Deployment & academic background", component: CorpsNyscInfoStep },
    { title: "Skills", description: "What you bring to employers", component: CorpsSkillsStep },
    { title: "Documents", description: "Call-up letter & CV", component: CorpsDocumentStep },
  ], []);

  const { execute, isExecuting, hasErrored, result } = useAction(onBoardCorps, {
    onSuccess: () => { router.refresh(); router.push("/portal/find-ppa"); },
    onError: () => {},
  });

  const activeFormId = FORM_IDS[currentStep];
  const isLast = currentStep === steps.length - 1;
  const CurrentStepComponent = steps[currentStep]?.component;

  const handleNext = (stepData: any) => {
    const merged = { ...onboardingData, ...stepData };
    if (isLast) {
      const parse = corpsOnboardingSchema.safeParse(merged);
      if (!parse.success) return;
      execute(parse.data);
    } else {
      setOnboardingData(merged);
      setCurrentStep((p) => p + 1);
    }
  };

  return (
    <div className="min-h-screen w-full bg-background">
      <div className="mx-auto w-full max-w-3xl px-4 py-6 md:py-10">
        {/* Stepper */}
        <header className="mb-6">
          <div className="flex md:hidden flex-col gap-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-foreground">{steps[currentStep]?.title}</span>
              <span className="text-muted-foreground">Step {currentStep + 1} of {steps.length}</span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-primary transition-all duration-300" style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }} />
            </div>
            <p className="text-xs text-muted-foreground">{steps[currentStep]?.description}</p>
          </div>

          <div className="hidden md:flex items-start justify-between gap-2">
            {steps.map((step, index) => (
              <ProgressStage key={step.title} index={index} step={step} currentStep={currentStep} isLast={index === steps.length - 1} />
            ))}
          </div>
        </header>

        {/* Shell */}
        <div className="w-full bg-card rounded-xl border overflow-hidden">
          <main className="p-4 sm:p-6">
            <div className="space-y-1 mb-6">
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Welcome, Corps Member! 🎉</h1>
              <p className="text-sm text-muted-foreground">
                Let's set up your profile so we can match you with the best PPA opportunities in your deployment state.
              </p>
            </div>

            {hasErrored && (
              <div className="mb-4 rounded-lg bg-red-100 text-red-800 text-sm px-4 py-3">
                {result.serverError || "An error occurred while submitting your onboarding information."}
              </div>
            )}

            <div className="rounded-xl border p-4 sm:p-5 bg-white">
              {CurrentStepComponent && (
                <CurrentStepComponent
                  onNext={handleNext}
                  onBack={() => setCurrentStep((p) => Math.max(p - 1, 0))}
                />
              )}
            </div>
          </main>

          <div className="flex items-center justify-between gap-3 border-t px-4 sm:px-6 py-4">
            {currentStep > 0 ? (
              <Button variant="outline" onClick={() => setCurrentStep((p) => p - 1)} className="rounded-xl px-6">
                ← Back
              </Button>
            ) : <div />}
            <Button form={activeFormId} type="submit" disabled={isExecuting} className="rounded-xl px-6">
              {isExecuting ? "Processing..." : isLast ? "Submit" : "Next Step →"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

const ProgressStage = ({ index, step, currentStep, isLast }: { index: number; step: Step; currentStep: number; isLast: boolean }) => {
  const isActive = currentStep === index;
  const isDone = currentStep > index;
  return (
    <div className="flex flex-1 items-start gap-3 min-w-0">
      <div className="flex items-center gap-3">
        <div className={cn(
          "h-10 w-10 rounded-full flex items-center justify-center border text-sm font-medium shrink-0",
          isDone && "bg-primary text-primary-foreground border-primary",
          isActive && "border-primary bg-primary/10 text-primary",
          !isActive && !isDone && "bg-muted text-muted-foreground",
        )}>
          {isDone ? "✓" : index + 1}
        </div>
        {!isLast && <div className={cn("h-0.5 w-full max-w-[120px] rounded-full", isDone ? "bg-primary" : "bg-border")} />}
      </div>
      <div className="min-w-0 pt-1">
        <div className={cn("text-sm font-medium leading-snug", isActive ? "text-primary font-semibold" : "text-foreground")}>{step.title}</div>
        <div className="text-xs text-muted-foreground line-clamp-1">{step.description}</div>
      </div>
    </div>
  );
};
