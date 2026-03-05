import { Wrapper } from "@/components/wrapper";
import { Metadata } from "next";
import Image from "next/image";
import React from "react";

export const metadata: Metadata = {
  title: "Partner with",
  description:
    "Partner with I-TAPP (ITAPP) to connect your company with Nigerian students seeking SIWES and industrial training opportunities.",
};

export default function Partnership() {
  return (
    <Wrapper>
      <h2 className="text-lg font-bold">Our partners</h2>
      <div className="mt-5">
        <Image
          src={"/FUPRE-Logo.png"}
          width={200}
          height={100}
          alt="fupre_logo"
        />
      </div>
    </Wrapper>
  );
}
