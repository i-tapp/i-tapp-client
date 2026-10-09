"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  applyTheme,
  readStoredPreference,
  resolvePreference,
  storePreference,
  type ResolvedTheme,
  type ThemePreference,
} from "@/lib/theme";
import { usePathname } from "next/navigation";
import { isThemeableRoute } from "@/lib/theme";
import { useFeature } from "./app-mode-provider";

type ThemeContextValue = {
  /** What the user chose: light, dark, or follow-system. */
  preference: ThemePreference;
  /** What that actually resolves to right now. */
  theme: ResolvedTheme;
  setPreference: (next: ThemePreference) => void;
  /**
   * True only where the theme can actually be applied: in the app, on a
   * themeable route. The toggle hides itself when this is false.
   */
  available: boolean;
};

const ThemeContext = createContext<ThemeContextValue>({
  preference: "light",
  theme: "light",
  setPreference: () => {},
  available: false,
});

// APP-EXCLUSIVE (scope: `darkMode` in config/app-features.ts) and additionally
// limited to the portal routes in THEMEABLE_ROUTE_PREFIXES.
//
// Both gates are needed. Runtime alone isn't enough: installing the PWA drops
// you on the marketing homepage, so "app mode" was painting a dark palette
// onto pages built entirely from hardcoded light colours. See the comment on
// THEMEABLE_ROUTE_PREFIXES for what that looked like.
export function ThemeProvider({ children }: { children: ReactNode }) {
  const enabled = useFeature("darkMode");
  const pathname = usePathname();
  const themeable = isThemeableRoute(pathname ?? "/");
  const active = enabled && themeable;

  // Initialised from what the boot script already resolved, so the first
  // render agrees with the DOM and nothing flashes.
  const [preference, setPreferenceState] = useState<ThemePreference>(() => {
    if (typeof window === "undefined") return "light";
    return readStoredPreference();
  });

  const theme: ResolvedTheme = useMemo(() => {
    if (!enabled) return "light";
    if (typeof window === "undefined") return "light";
    return resolvePreference(preference);
  }, [enabled, preference]);

  // Re-runs on navigation, so leaving the portal restores the light palette
  // and returning to it puts the theme back.
  useEffect(() => {
    applyTheme(theme, active);
  }, [theme, active]);

  // The native status bar is deliberately NOT driven from here any more. On
  // Android the strip colour and the icon colour are set together in
  // MainActivity (they follow the phone's light/dark mode). Setting the icon
  // style from the page as well made the two disagree and left black icons on
  // the dark strip.

  // Follow the OS while the preference is "system".
  useEffect(() => {
    if (!active || preference !== "system") return;
    if (typeof window.matchMedia !== "function") return;

    const query = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyTheme(query.matches ? "dark" : "light", true);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, [active, preference]);

  const setPreference = useCallback((next: ThemePreference) => {
    setPreferenceState(next);
    storePreference(next);
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      preference,
      // Callers styling their own surfaces need the PAINTED theme, not the
      // preference - outside the portal the page is light regardless.
      theme: active ? theme : "light",
      setPreference,
      available: active,
    }),
    [preference, theme, setPreference, active]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
