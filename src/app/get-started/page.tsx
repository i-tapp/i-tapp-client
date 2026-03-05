import { Metadata } from "next";
import RoleSelection from "./get-started-page";

export const metadata: Metadata = {
  title: "Create Account",
  description:
    "Create an I-TAPP (ITAPP) account and start searching for SIWES and industrial training placements across verified companies in Nigeria.",
};

export default function page() {
  return <RoleSelection />;
}
