import { purge, softDelete, updateCompanyStatus } from "@/actions";
import { useAction } from "next-safe-action/hooks";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export const useDelete = () => {
  const router = useRouter();
  const { execute: executeDelete, isExecuting: isDeleting } = useAction(
    softDelete,
    {
      onSuccess: () => {
        toast.success("User deleted successfully");
        console.log("User deleted successfully");
        router.back();
      },
      onError: (err) => {
        toast.error("Error deleting user");
        console.error("Error deleting user:", err);
      },
    },
  );

  const { execute: executePurge, isExecuting: isPurging } = useAction(purge, {
    onSuccess: () => {
      toast.success("User purged successfully");
      console.log("User purged successfully");
      router.back();
    },
    onError: (err) => {
      toast.error("Error purging user");
      console.error("Error purging user:", err);
    },
  });

  return { executeDelete, executePurge, isDeleting, isPurging };
};
