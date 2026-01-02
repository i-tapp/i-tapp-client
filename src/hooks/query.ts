import { query } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

// type OpportunitiesFilter = {
//   duration?: { checked: boolean; time: string }[];
//   industry?: { checked: boolean; industry: string }[];
//   status?: { checked: boolean; status: string }[];
//   location?: string;
// };

export const useFetchOpportunities = (filter?: any) => {
  return useQuery({
    queryKey: ["opportunities", filter ?? {}],
    queryFn: async () => {
      const queryObject: Record<string, any> = {};

      const durationMapping: Record<string, number[]> = {
        "0-3": [0, 1, 2, 3],
        "3-6": [3, 4, 5, 6],
        "6-12": [6, 7, 8, 9, 10, 11, 12],
      };

      const selectedDuration =
        filter?.duration
          ?.filter((d) => d.checked)
          .flatMap((d) => durationMapping[d.time] || []) ?? [];

      if (selectedDuration.length) {
        queryObject.duration = selectedDuration.join(",");
      }

      const selectedIndustry =
        filter?.industry?.filter((i) => i.checked).map((i) => i.industry) ?? [];

      if (selectedIndustry.length) {
        queryObject.industry = selectedIndustry.join(",");
      }

      const selectedStatus =
        filter?.status?.filter((s) => s.checked).map((s) => s.status) ?? [];

      if (selectedStatus.length) {
        queryObject.status = selectedStatus.join(",");
      }

      if (filter?.location?.trim()) {
        queryObject.location = filter.location.trim();
      }

      const qs = new URLSearchParams(queryObject).toString();
      const response = await query(`/opportunities${qs ? `?${qs}` : ""}`);
      return response.data;
    },
  });
};

export const useFetchProfile = () => {
  return useQuery({
    queryKey: ["student-profile"],
    queryFn: async () => {
      const response = await query("/s/profile");
      return response;
    },
  });
};

export const useFetchCompanyProfile = () => {
  return useQuery({
    queryKey: ["company-profile"],
    queryFn: async () => {
      const response = await query("/company/profile");
      return response;
    },
  });
};

export const useFetchCompanyDetails = (id?: string) => {
  return useQuery({
    queryKey: ["company-details", id],
    queryFn: async () => {
      const response = await query(`/company/profile/${id}/`);
      return response;
    },
    enabled: !!id,
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

export const useFetchOffers = () => {
  return useQuery({
    queryKey: ["offers"],
    queryFn: async () => {
      const response = await query("/offers/my-offers");
      return response;
    },
  });
};

export const useFetchOfferDetails = (id?: string) => {
  return useQuery({
    queryKey: ["offer-details", id],
    queryFn: async () => {
      const response = await query(`/offers/${id}/`);
      return response;
    },
    enabled: !!id,
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

export const useFetchStudentDetails = (id?: string) => {
  return useQuery({
    queryKey: ["student-details", id],
    queryFn: async () => {
      const response = await query(`/s/${id}/`);
      return response;
    },
    enabled: !!id,
  });
};

export const useFetchApplicationDetails = (id?: string) => {
  return useQuery({
    queryKey: ["application-details", id],
    queryFn: async () => {
      const response = await query(`/applications/${id}`);
      return response;
    },
    enabled: !!id,
  });
};
