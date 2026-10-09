"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useFeature } from "./app-mode-provider";

// APP-EXCLUSIVE (scope: `pageTransitions` in config/app-features.ts).
//
// Fade+scale crossfade on every route change - the thing that makes a
// navigation read as "screen push" rather than "page load". In a browser
// tab it's the wrong instinct: people expect a web page to just be there,
// and the animation adds ~250ms of perceived latency to every click. So
// the website navigates instantly.
//
// Both branches render the same element tree (relative div > motion.div) so
// switching modes never remounts the page underneath. In browser mode the
// motion.div is handed static props and a zero-duration transition, which
// makes framer-motion a no-op passthrough.
export function PageTransition({
  children,
  contentOnly = false,
}: {
  children: ReactNode;
  /** Set by a layout that wraps just its page content (see CompanyLayout). */
  contentOnly?: boolean;
}) {
  const pathname = usePathname();
  const animate = useFeature("pageTransitions");

  // The root instance wraps the WHOLE app, so re-keying it on every route
  // change remounts everything inside, including the portal layouts: the
  // header, side menu and tab bar all reset and flash on every tab tap (the
  // drawer visibly slides open and shut). Every /portal/* route therefore
  // shares one key at the root, and the portal layouts animate only their
  // own page content with <PageTransition contentOnly>. Marketing pages keep
  // the original per-route transition.
  const routeKey =
    !contentOnly && pathname.startsWith("/portal") ? "portal" : pathname;

  return (
    <div style={{ position: "relative" }}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={animate ? routeKey : "static"}
          initial={animate ? { opacity: 0, scale: 0.98 } : false}
          animate={animate ? { opacity: 1, scale: 1 } : undefined}
          exit={animate ? { opacity: 0, scale: 1.02 } : undefined}
          transition={
            animate
              ? { duration: 0.25, ease: [0.22, 1, 0.36, 1] }
              : { duration: 0 }
          }
          style={{ width: "100%" }}
          // The server always renders the browser-mode (unanimated) markup;
          // in the app the first client render adds framer-motion's initial
          // opacity/transform. That style diff is expected, not a bug.
          suppressHydrationWarning
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
