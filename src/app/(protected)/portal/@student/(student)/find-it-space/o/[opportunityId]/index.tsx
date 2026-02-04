"use client";

import { apply, save, withdraw } from "@/actions";
import { Button } from "@/components/ui/button";
import Hr from "@/components/ui/hr";
import { useFetchOpportunityPublicDetails } from "@/hooks/query";
import { query } from "@/lib/api";
import { useStudentStore } from "@/lib/store";
import { Opportunity } from "@/types";
import { cn } from "@/utils/tailwind";
import { useQueryClient } from "@tanstack/react-query";
import { Bank, Calendar, Heart, Share } from "iconsax-reactjs";
import {
  Banknote,
  ClockIcon,
  CreditCard,
  DollarSign,
  Globe,
} from "lucide-react";
// import { Link } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { todo } from "node:test";
import { toast } from "react-toastify";
import OpportunityDetailsContent from "../../_molecules/opportunity-details-content";

// todo: improve application status handling
// If you want to simplify frontend logic even further, your backend can include a field like:
// const hasApplied = applications.some(
//   (app) => app.student.id === currentStudentId
// );
// const hasWithdrawn = applications.some(
//   (app) => app.student.id === currentStudentId && app.status === "withdrawn"
// );

export default function ODetailsPage() {
  return (
    <div className="mt-12">
      <OpportunityDetailsContent />;
    </div>
  );
}
