import React from "react";
import AuthLayoutUi from "@/components/layouts/auth";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Password Reset",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthLayoutUi>{children}</AuthLayoutUi>;
}
