"use client";

import { useEffect, useState } from "react";
import { Monitor } from "lucide-react";
import Modal from "@/components/modal";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "placeit_pc_notice_company";
const PHONE_MAX_WIDTH = 768; // same breakpoint as useIsResponsive

type PcNoticeState = "unknown" | "show" | "done";

/**
 * Decides, once on mount, whether to show the notice: phone-sized screen and
 * not dismissed before on this device. "unknown" is exposed so the onboarding
 * tour can wait until this is settled and never starts underneath the popup.
 */
export function usePcRecommendation() {
  const [state, setState] = useState<PcNoticeState>("unknown");

  useEffect(() => {
    let dismissed = false;
    try {
      dismissed = localStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      // storage unavailable - just show the notice
    }
    setState(window.innerWidth < PHONE_MAX_WIDTH && !dismissed ? "show" : "done");
  }, []);

  const dismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // ignore
    }
    setState("done");
  };

  return { state, dismiss };
}

export function PcRecommendation({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Modal open={open} onClose={onClose}>
      <div className="w-full max-w-md rounded-lg bg-accent p-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="rounded-full bg-primary/10 p-3 text-primary">
            <Monitor size={28} />
          </div>

          <h1 className="text-xl font-bold text-primary">
            Best experience is on a computer
          </h1>

          <p className="text-sm text-muted-foreground">
            Your company dashboard has more features on a PC or laptop, such as
            reviewing applicants and managing your opportunities. For the best
            experience, sign in at getplaceit.com on a computer. You can still
            use your phone for quick checks.
          </p>

          <Button className="mt-2 w-full" onClick={onClose}>
            Continue on phone
          </Button>
        </div>
      </div>
    </Modal>
  );
}
