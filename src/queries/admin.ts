import { query } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { use } from "react";

const useFetchCompanies = () => {
  return useQuery({
    queryKey: ["admin-companies"],
    queryFn: async () => {
      const response = await query("/c");
      return response;
    },
  });
};

const useFetchAdmins = () => {
  return useQuery({
    queryKey: ["admin-admins"],
    queryFn: async () => {
      const response = await query("/admin");
      return response;
    },
  });
};

const useFetchOffers = () => {
  return useQuery({
    queryKey: ["admin-offers"],
    queryFn: async () => {
      const response = await query("/offers");
      return response;
    },
  });
};

const useFetchCompanyApplications = (companyId: string) => {
  return useQuery({
    queryKey: ["admin-company-applications", companyId],
    queryFn: async () => {
      const response = await query(`/a/company/${companyId}`);
      return response;
    },
    enabled: !!companyId,
  });
};

const useFetchAllStudents = () => {
  return useQuery({
    queryKey: ["admin-all-students"],
    queryFn: async () => {
      const response = await query("/s");
      return response;
    },
  });
};

const useFetchAdminProfile = () => {
  return useQuery({
    queryKey: ["admin-profile"],
    queryFn: async () => {
      const response = await query("/admin/profile");
      return response;
    },
  });
};

const useFetchAllApplications = () => {
  return useQuery({
    queryKey: ["admin-all-applications"],
    queryFn: async () => {
      const response = await query("/a/all");
      return response;
    },
  });
};

const useFetchCompanyDocuments = (companyId: string) => {
  return useQuery({
    queryKey: ["admin-company-documents", companyId],
    queryFn: async () => {
      const response = await query(`/c/documents/${companyId}`);
      return response;
    },
    enabled: !!companyId,
  });
};

export {
  useFetchCompanies,
  useFetchAllStudents,
  useFetchAdminProfile,
  useFetchAllApplications,
  useFetchCompanyApplications,
  useFetchOffers,
  useFetchAdmins,
  useFetchCompanyDocuments,
};
