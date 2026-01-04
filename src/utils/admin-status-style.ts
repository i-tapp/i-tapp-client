// import { ApplicationStatus } from "./application-status.enum";

import {
  ApplicationStatus,
  CompanyStatus,
  OpportunityStatus,
  StudentStatus,
} from "@/types/enums";

export const applicationStatusStyle: Record<ApplicationStatus, string> = {
  // early / neutral
  [ApplicationStatus.APPLIED]: "bg-blue-100 text-blue-700",
  [ApplicationStatus.IN_REVIEW]: "bg-indigo-100 text-indigo-700",
  [ApplicationStatus.SHORTLISTED]: "bg-cyan-100 text-cyan-700",
  [ApplicationStatus.INTERVIEW]: "bg-purple-100 text-purple-700",
  [ApplicationStatus.INTERVIEW_SCHEDULED]: "bg-purple-100 text-purple-700",
  [ApplicationStatus.OFFERED]: "bg-emerald-100 text-emerald-700",
  [ApplicationStatus.ACCEPTED]: "bg-green-100 text-green-700",
  [ApplicationStatus.REJECTED]: "bg-red-100 text-red-700",
  [ApplicationStatus.DECLINED]: "bg-red-100 text-red-700",
  [ApplicationStatus.WITHDRAWN]: "bg-gray-100 text-gray-600",
  [ApplicationStatus.EXPIRED]: "bg-gray-100 text-gray-500",
};

export const companyStatusStyle: Record<CompanyStatus, string> = {
  [CompanyStatus.PENDING]: "bg-yellow-100 text-yellow-700",
  [CompanyStatus.UNDER_REVIEW]: "bg-indigo-100 text-indigo-700",
  [CompanyStatus.APPROVED]: "bg-green-100 text-green-700",
  [CompanyStatus.REJECTED]: "bg-red-100 text-red-700",
  [CompanyStatus.SUSPENDED]: "bg-gray-100 text-gray-600",
};

export const opportunityStatusStyle: Record<OpportunityStatus, string> = {
  [OpportunityStatus.DRAFT]: "bg-gray-100 text-gray-600",
  [OpportunityStatus.REVIEW]: "bg-indigo-100 text-indigo-700",
  [OpportunityStatus.OPEN]: "bg-green-100 text-green-700",
  [OpportunityStatus.PAUSED]: "bg-yellow-100 text-yellow-700",
  [OpportunityStatus.CLOSED]: "bg-red-100 text-red-700",
  [OpportunityStatus.FILLED]: "bg-emerald-100 text-emerald-700",
  [OpportunityStatus.EXPIRED]: "bg-gray-100 text-gray-500",

  // risk
  [OpportunityStatus.FLAGGED]: "bg-orange-100 text-orange-700",
};

export const studentStatusStyle: Record<StudentStatus, string> = {
  [StudentStatus.ACTIVE]: "bg-green-100 text-green-700",
  [StudentStatus.INACTIVE]: "bg-gray-100 text-gray-600",
  [StudentStatus.SUSPENDED]: "bg-red-100 text-red-700",
};

export const offerStatusStyle = {
  SENT: "bg-blue-100 text-blue-700",
  ACCEPTED: "bg-green-100 text-green-700",
  DECLINED: "bg-red-100 text-red-700",
  EXPIRED: "bg-gray-100 text-gray-600",
};
