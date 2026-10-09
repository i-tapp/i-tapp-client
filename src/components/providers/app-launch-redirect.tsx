"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAppMode } from "./app-mode-provider";

/**
 * APP-EXCLUSIVE (scope: `launchToPortal` in config/app-features.ts).
 *
 * The installed app starts on "/", which is the marketing homepage. In an app
 * that should be the user's own space: /portal sends a signed-in user to their
 * role's dashboard and everyone else to the sign-in page (see src/proxy.ts).
 * It runs under the splash overlay on a cold start, so the homepage is never
 * seen. Browsers never redirect.
 */
export function AppLaunchRedirect() {
  const { feature } = useAppMode();
  const enabled = feature("launchToPortal");
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (enabled && pathname === "/") {
      router.replace("/portal");
    }
  }, [enabled, pathname, router]);

  return null;
}
