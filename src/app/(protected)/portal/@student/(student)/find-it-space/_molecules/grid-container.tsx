import { cn } from "@/utils/tailwind";
import { ReactNode } from "react";

export default function GridContainer({
  selectedId,
  children,
}: {
  selectedId: string | null;
  children: ReactNode;
}) {
  const isDetailsOpen = !!selectedId;

  return (
    <div
      className={cn(
        "grid gap-2 p-2 items-start w-full",
        "grid-cols-1",
        isDetailsOpen ? "md:grid-cols-[1fr_320px]" : "md:grid-cols-1",

        isDetailsOpen
          ? "lg:grid-cols-[280px_1fr_360px]"
          : "lg:grid-cols-[280px_1fr]",
      )}
    >
      {children}
    </div>
  );
}
