import { formatDate } from "@/utils/format-date";

/** "Posted Nov 12, 2026": the date only, never the time. */
export function PostedDate({
  date,
  className = "",
}: {
  date?: string | Date | null;
  className?: string;
}) {
  if (!date) return null;
  const value = typeof date === "string" ? date : date.toISOString();
  return (
    <p className={`text-[11px] text-gray-400 ${className}`}>
      Posted {formatDate(value)}
    </p>
  );
}
