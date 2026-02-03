"use client";

import { ReactNode } from "react";
import { Header } from "../header";
import { studentNavLinks } from "@/constants";

const StudentLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Header link={studentNavLinks} />
      <main className="min-h-screen">{children}</main>
    </>
  );
};

export default StudentLayout;
