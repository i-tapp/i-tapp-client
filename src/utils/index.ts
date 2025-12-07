import { Env } from "@/types";

export function isAbsoluteUrl(url: string): boolean {
  return url.startsWith("https://") || url.startsWith("http://") ? true : false;
}

export function isServerSide(): boolean {
  return typeof window === "undefined" ? true : false;
}

export function throwException(message?: string) {
  console.error("Throwing exception:", message);
  throw new Error(message ?? "An error occurred!");
}

export function env(defaultValue?: string): Env {
  return {
    appEnv: process.env.NEXT_PUBLIC_APP_ENV ?? defaultValue,
    appName: process.env.NEXT_PUBLIC_APP_NAME ?? defaultValue,
    appDomain: process.env.NEXT_PUBLIC_APP_DOMAIN ?? defaultValue,
    backendUrl: process.env.NEXT_PUBLIC_APP_BACKEND_URL ?? defaultValue,
    backendApiUrl: process.env.NEXT_PUBLIC_APP_BACKEND_API_URL ?? defaultValue,
    frontendUrl: process.env.NEXT_PUBLIC_APP_SITE_URL ?? defaultValue,
  };
}

export function prepareUrlSearchParams(params?: {
  [key: string]: string;
}): string {
  return new URLSearchParams(params).toString();
}
