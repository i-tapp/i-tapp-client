"use client";

import { ReactNode } from "react";
import { Header } from "../header";
import { studentNavLinks } from "@/constants";

const StudentLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Header link={studentNavLinks} />
      <main className=" bg-[#F0F0F5]">{children}</main>
    </>
  );
};

export default StudentLayout;
