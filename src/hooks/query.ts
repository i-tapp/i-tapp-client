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

      const selectedDuration = filter?.duration?.find(
        (d: { checked: boolean; time: string }) => d.checked,
      )?.time;

      if (selectedDuration) {
        queryObject.duration = Number(selectedDuration);
      }

      const selectedIndustry =
        filter?.industry
          ?.filter((i: { checked: boolean; industry: string }) => i.checked)
          .map((i: { checked: boolean; industry: string }) => i.industry) ?? [];

      if (selectedIndustry.length) {
        queryObject.industry = selectedIndustry.join(",");
      }

      const selectedStatus =
        filter?.status
          ?.filter((s: { checked: boolean; status: string }) => s.checked)
          .map((s: { checked: boolean; status: string }) => s.status) ?? [];

      if (selectedStatus.length) {
        queryObject.status = selectedStatus.join(",");
      }

      if (filter?.location?.trim()) {
        queryObject.location = filter.location.trim();
      }

      const qs = new URLSearchParams(queryObject).toString();
      console.log("queryString", qs);
      const response = await query(`/o${qs ? `?${qs}` : ""}`);
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
      const response = await query("/c/profile");
      return response;
    },
  });
};

export const useFetchCompanyDetails = (id?: string) => {
  return useQuery({
    queryKey: ["company-details", id],
    queryFn: async () => {
      const response = await query(`/c/profile/${id}/`);
      return response;
    },
    enabled: !!id,
  });
};

export const useFetchApplication = () => {
  return useQuery({
    queryKey: ["application"],
    queryFn: async () => {
      const response = await query("/a/my-application");
      return response;
    },
  });
};

export const useFetchSavedApplication = () => {
  return useQuery({
    queryKey: ["saved-application"],
    queryFn: async () => {
      const response = await query("/s/saved/applications");
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
      const response = await query("/a/applicants");
      return response;
    },
  });
};

export const useFetchCompanyJobs = () => {
  return useQuery({
    queryKey: ["company-jobs"],
    queryFn: async () => {
      const response = await query("/c/jobs/all");
      return response;
    },
  });
};

export const useFetchCompanyOpportunities = () => {
  return useQuery({
    queryKey: ["company-opportunities"],
    queryFn: async () => {
      const response = await query("/o/me");
      return response;
    },
  });
};

export const useFetchOpportunityDetails = (id?: string) => {
  return useQuery({
    queryKey: ["opportunity-details", id],
    queryFn: async () => {
      const response = await query(`/o/${id}/details`);
      return response;
    },
    enabled: !!id,
  });
};

export const useFetchOpportunityPublicDetails = (id?: string) => {
  return useQuery({
    queryKey: ["opportunity-public-details", id],
    queryFn: async () => {
      const response = await query(`/o/${id}`);
      return response;
    },
    enabled: Boolean(id),
    staleTime: 0,
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
      const response = await query(`/a/${id}`);
      return response;
    },
    enabled: !!id,
  });
};

export const useFetchMyProfile = () => {
  return useQuery({
    queryKey: ["my-profile"],
    queryFn: async () => {
      const response = await query("/auth/me");
      return response;
    },
  });
};
