import { query } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

const useFetchCompanies = () => {
  return useQuery({
    queryKey: ["admin-companies"],
    queryFn: async () => {
      const response = await query("/c");
      return response;
    },
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
      const response = await query("/admins/profile");
      return response;
    },
  });
};

export { useFetchCompanies, useFetchAllStudents, useFetchAdminProfile };
