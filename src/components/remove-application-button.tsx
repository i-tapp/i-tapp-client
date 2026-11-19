"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useAction } from "next-safe-action/hooks";
import { toast } from "react-toastify";
import { removeBouncedApplication } from "@/actions";

/**
 * "Remove" link for an application whose email bounced (it never reached the
 * company). Shown only for those; removing it lets the person apply again.
 */
export function RemoveApplicationButton({
  application,
  className = "",
}: {
  application: any;
  className?: string;
}) {
  const queryClient = useQueryClient();
  const { execute, isExecuting } = useAction(removeBouncedApplication, {
    onSuccess() {
      toast.success("Application removed");
      queryClient.invalidateQueries({ queryKey: ["application"] });
    },
    onError(error) {
      toast.error(error?.error?.serverError ?? "Could not remove the application");
    },
  });

  if (application?.status !== "bounced") return null;

  return (
    <button
      type="button"
      disabled={isExecuting}
      onClick={() => {
        if (
          window.confirm(
            "Remove this application? Its email did not reach the company, so you can apply to it again afterwards.",
          )
        ) {
          execute({ id: application.id });
        }
      }}
      className={`text-xs font-medium text-red-600 hover:underline disabled:opacity-50 ${className}`}
    >
      {isExecuting ? "Removing…" : "Remove"}
    </button>
  );
}
