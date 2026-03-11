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
        toast.success("Account deleted successfully");
        console.log("Account deleted successfully");
        router.back();
      },
      onError: (err) => {
        toast.error("Error deleting account");
        console.error("Error deleting account:", err);
      },
    },
  );

  const { execute: executePurge, isExecuting: isPurging } = useAction(purge, {
    onSuccess: () => {
      toast.success("Account purged successfully");
      console.log("Account purged successfully");
      router.back();
    },
    onError: (err) => {
      toast.error("Error purging account");
      console.error("Error purging account:", err);
    },
  });

  return { executeDelete, executePurge, isDeleting, isPurging };
};
