import { useQueryClient } from "@tanstack/react-query";

export const useAppInvalidate = (key: string) => {
  const qc = useQueryClient();
  return {
    invalidate: () => qc.invalidateQueries({ queryKey: [`${key}`] }),
  };
};
