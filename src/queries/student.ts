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
