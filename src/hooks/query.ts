import { query } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export const useFetchOpportunities = () => {
  return useQuery({
    queryKey: ["opportunities"],
    queryFn: async () => {
      const response = await query("/o");
      return response.data;
    },
  });
};

export const useFetchProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const response = await query("/me/profile");
      return response;
    },
  });
};

export const useFetchApplication = () => {
  return useQuery({
    queryKey: ["application"],
    queryFn: async () => {
      const response = await query("/applications/my-application");
      return response;
    },
  });
};

export const useFetchSavedApplication = () => {
  return useQuery({
    queryKey: ["saved-applocation"],
    queryFn: async () => {
      const response = await query("/student/saved/applications");
      return response;
    },
  });
};

export const useFetchAcceptedApplications = () => {
  return useQuery({
    queryKey: ["acceted-application"],
    queryFn: async () => {
      const response = await query("/student/job/current");
      return response;
    },
  });
};

export const useFetchAllCompanyApplications = () => {
  return useQuery({
    queryKey: ["company-application"],
    queryFn: async () => {
      const response = await query("/applications/applicants");
      return response;
    },
  });
};

export const useFetchCompanyJobs = () => {
  return useQuery({
    queryKey: ["company-jobs"],
    queryFn: async () => {
      const response = await query("/company/jobs/all");
      return response;
    },
  });
};

export const useFetchCompanyOpportunities = () => {
  return useQuery({
    queryKey: ["company-opportunities"],
    queryFn: async () => {
      const response = await query("/opportunities/me");
      return response;
    },
  });
};

export const useFetchOpportunityDetails = (id?: string) => {
  return useQuery({
    queryKey: ["opportunity-details", id],
    queryFn: async () => {
      const response = await query(`/opportunities/${id}/details`);
      return response;
    },
    enabled: !!id,
  });
};
