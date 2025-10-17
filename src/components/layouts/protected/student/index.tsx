"use client";

import React, { ReactNode } from "react";
import { Header } from "../header";
import { studentNavLinks } from "@/constants";

const StudentLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Header link={studentNavLinks} />
      {children}
    </>
  );
};

export default StudentLayout;
