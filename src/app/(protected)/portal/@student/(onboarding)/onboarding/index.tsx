import { Button } from "@/components/ui/button";
import { cn } from "@/utils/tailwind";

type Step = {
  title: string;
  description: string;
};

const steps: Step[] = [
  { title: "Profile", description: "Basic student information" },
  { title: "Education", description: "Academic background" },
  { title: "Preferences", description: "Internship preferences" },
];

export default function StudentOnboardingPage() {
  const currentStep = 0;

  return (
    <div className="min-h-screen w-full bg-background">
      <div className="mx-auto w-full max-w-6xl px-4 py-8">
        {/* Shell */}
        <div className="w-full rounded-2xl border bg-card shadow-sm overflow-hidden">
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
          <main className="grid grid-cols-1 gap-8 p-6 md:grid-cols-2">
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

              <div className="mt-6 rounded-2xl border bg-card p-5">
                <div className="flex items-center gap-2">
                  <div className="h-9 w-9 rounded-xl bg-primary/10" />
                  <div>
                    <p className="text-sm font-semibold">
                      Tell us about yourself
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Add your basic information to get started.
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-3">
                  <div className="h-11 rounded-xl border bg-background px-3 flex items-center text-sm text-muted-foreground">
                    e.g. University of Lagos
                  </div>
                  <div className="h-11 rounded-xl border bg-background px-3 flex items-center text-sm text-muted-foreground">
                    e.g. Computer Science
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="h-11 rounded-xl border bg-background px-3 flex items-center text-sm text-muted-foreground">
                      Select level
                    </div>
                    <div className="h-11 rounded-xl border bg-background px-3 flex items-center text-sm text-muted-foreground">
                      GPA (optional)
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between gap-3">
                  <button className="text-sm text-muted-foreground hover:text-foreground transition">
                    Skip for now
                  </button>

                  <Button className="rounded-xl px-6">Next Step →</Button>
                </div>
              </div>
            </section>

            {/* Right: preview/info card */}
            <aside className="min-w-0">
              <div className="relative h-full rounded-2xl border bg-muted/30 p-5 overflow-hidden">
                <div className="absolute inset-0 opacity-40 [background:radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.25),transparent_40%),radial-gradient(circle_at_80%_60%,hsl(var(--primary)/0.12),transparent_45%)]" />

                <div className="relative">
                  <div className="rounded-2xl border bg-background/60 p-4 backdrop-blur-sm">
                    <div className="aspect-[4/3] w-full rounded-xl bg-muted overflow-hidden" />
                  </div>

                  <div className="mt-5 rounded-2xl border bg-background p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold">
                          Connect with top companies
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Completing your profile helps us rank better
                          internship matches at the top of your feed.
                        </p>
                      </div>

                      <div className="shrink-0 rounded-xl border bg-primary/10 px-3 py-2 text-xs text-primary">
                        Smart Match
                      </div>
                    </div>
                  </div>

                  {/* Floating badge */}
                  <div className="pointer-events-none absolute bottom-8 left-8 rounded-2xl border bg-background px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-primary/10" />
                      <div>
                        <p className="text-sm font-semibold">Profile Setup</p>
                        <p className="text-xs text-muted-foreground">
                          Almost ready to apply
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
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
              "hidden md:block h-[2px] w-full max-w-[180px] rounded-full",
              isDone ? "bg-primary" : "bg-border",
            )}
          />
        )}
      </div>

      {/* Labels */}
      <div className="min-w-0 pt-1">
        <div
          className={cn(
            "text-sm font-medium truncate",
            isActive ? "text-primary font-semibold" : "text-foreground",
          )}
        >
          {step.title}
        </div>
        <div className="text-xs text-muted-foreground truncate">
          {step.description}
        </div>
      </div>
    </div>
  );
};
