import React from "react";
import { Metadata } from "next";

import { StudentSignIn } from "./_molecules";

export const metadata: Metadata = {
  title: "Login",
  description: "",
};

export default function SigninPage() {
  return <StudentSignIn />;
}
