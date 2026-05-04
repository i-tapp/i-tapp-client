import type { Metadata } from "next";
import OpportunitiesBrowse from "./_molecules/browse";

export const metadata: Metadata = {
  title: "Opportunities | I-TAPP",
  description:
    "Browse available industrial training placement opportunities for students across Nigeria.",
};

export default function OpportunitiesPage() {
  return <OpportunitiesBrowse />;
}
