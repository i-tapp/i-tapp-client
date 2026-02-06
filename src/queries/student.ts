import { query } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export const useFetchMyApplicationStatus = (opportunityId?: string) => {
  return useQuery({
    queryKey: ["my-application-status", opportunityId],
    queryFn: async () => {
      const response = await query(`/a/${opportunityId}/my-application-status`);
      return response;
    },
    enabled: Boolean(opportunityId),
    staleTime: 0,
  });
};

export const useFetchSavedOpportunities = () => {
  return useQuery({
    queryKey: ["saved-opportunities"],
    queryFn: async () => {
      const response = await query("/o/saved/me");
      return response;
    },
  });
};
