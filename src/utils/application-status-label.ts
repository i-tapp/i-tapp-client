/**
 * Plain-language label and colour for an application's status, including the
 * email / form statuses (applications that leave PlaceIT).
 */
const LABELS: Record<string, { label: string; color: string }> = {
  applied: { label: "Applied", color: "bg-blue-50 text-blue-700" },
  sent: { label: "Sent to company", color: "bg-sky-50 text-sky-700" },
  delivered: { label: "Delivered", color: "bg-green-50 text-green-700" },
  bounced: {
    label: "Not delivered",
    color: "bg-red-50 text-red-700",
  },
  form_opened: { label: "Form opened", color: "bg-amber-50 text-amber-700" },
  form_submitted: { label: "Submitted", color: "bg-green-50 text-green-700" },
  shortlisted: { label: "Shortlisted", color: "bg-yellow-50 text-yellow-700" },
  accepted: { label: "Accepted", color: "bg-green-50 text-green-700" },
  rejected: { label: "Rejected", color: "bg-red-50 text-red-700" },
  withdrawn: { label: "Withdrawn", color: "bg-gray-100 text-gray-500" },
};

export function applicationStatusLabel(status?: string | null) {
  if (!status) return { label: "", color: "bg-gray-100 text-gray-500" };
  return (
    LABELS[status] ?? {
      label: status.replace(/_/g, " "),
      color: "bg-gray-100 text-gray-500",
    }
  );
}

export const isExternalMethod = (method?: string | null) =>
  method === "email" || method === "form";
