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
  avatarUrl: string;
  isVerified: boolean;
  role: string;

  softSkills?: string;
  technicalSkills?: string;
  preferredIndustry?: string;
  goals?: string;
  profileBio?: string;
  user: {
    id: string;
  };
}

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  location: string;
  totalApplications: number;
  type: string;
  duration?: string;
  mode: string;
  status: string;
  // requirements: string[];
  // skills: string[];
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
