import { cn } from "@/utils/tailwind";
import { ReactNode } from "react";

export default function GridContainer({
  selectedId,
  children,
}: {
  selectedId: string | null;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "grid gap-2 p-2 items-start",
        "grid-cols-1",
        // "md:grid-cols-[1fr_360px]",
        selectedId ? "md:grid-cols-[1fr_360px]" : "md:grid-cols-1",

        selectedId
          ? "lg:grid-cols-[280px_1fr_360px]"
          : "lg:grid-cols-[280px_1fr]",
      )}
    >
      {children}
    </div>
  );
}
