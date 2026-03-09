import { Inter } from "next/font/google";

export interface Applicant {
  id: string;
  name: string;
  university: string;
  accepted: boolean;
  student: Student;
  startDate?: string;
  endDate?: string;
}

export interface User {
  id: string;
  phone: string;
  email: string;
  avatarUrl: string;
  isVerified: boolean;
  role: string;
}

export interface Company {
  id: string;
  industry: string;
  name: string;
  registrationNumber: string;
  address: string;
  website: string;
  logoUrl: string;
  bannerUrl: string;
  isVerified: boolean;
  studentCapacity: number;

  description: string;

  phone: string;
  email: string;
  avatarUrl: string;
  logo: string;

  status: string;

  role: string;
  // user?: User;
}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  school: string;
  profileImageUrl: string;
  matriculationNumber: string;
  level: string;
  // user: User;
  phone: string;
  email: string;
  profileImage: string;
  isVerified: boolean;
  role: string;
  courseOfStudy?: string;
  softSkills?: string[];
  techSkills?: string[];
  preferredIndustry?: string;
  goals?: string;
  bio?: string;
  user: {
    id: string;
  };
}

type OpportunityStatus = "open" | "closed" | "draft";

export interface Opportunity {
  id: string;

  title: string;
  description: string;
  location: string;

  type: string;
  mode: string;
  status: OpportunityStatus;

  duration: number;
  department: string;
  industry: string;
  totalApplications: number;

  autoCloseOnDeadline: boolean;

  resumeRequired: boolean;

  schoolLetterRequired: boolean;
  maxApplicants: number;

  skills: string;
  applicationDeadline: string;
  hasApplied: boolean;
  createdAt: string;
  company: Company;
  applications: Application[];
  // applicants?: Applicant[];
}

export interface Application {
  id: string;
  status: string;
  appliedAt: string;
  coverLetter?: string;
  resumeUrl?: string;
  opportunity: Opportunity;
  student: Student;
}

export interface Offers {
  id: string;
  status: string;
  startDate: string;
  endDate: string;
  stipend: number;
  // opportunity: Opportunity;
  // student: Student;

  offerLetter: string;
  acceptedAt?: string;
  declinedAt?: string;
  expiredAt?: string;

  createdAt: string;
  updatedAt: string;
}

export interface Env {
  appEnv?: string;
  appName?: string;
  apiBaseUrl?: string;
  frontendUrl?: string;
}
