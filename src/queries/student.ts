import { query } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export const useFetchNotifications = () => {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const response = await query("/notifications");
      return response as Notification[];
    },
  });
};

export type Notification = {
  id: string;
  userId: string;
  type: string;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
};

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
