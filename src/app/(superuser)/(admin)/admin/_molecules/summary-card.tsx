"use client";

import { ReactNode } from "react";
import { Sparklines, SparklinesLine } from "react-sparklines";

export default function SummaryCard({
  title = "Title text",
  number = 0,
  component,
  data, // trend data for sparkline
}: {
  title: string;
  number: number;
  component?: ReactNode;
  data?: number[];
}) {
  return (
    <div className="flex-1 flex-col justify-between border rounded-xl p-6 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 min-w-[250px]  min-h-[180px]">
      {/* Top: Title */}
      <h6 className="text-gray-500 text-sm font-semibold">{title}</h6>

      {/* Number */}
      <h2 className="text-4xl font-extrabold mt-2">
        {number.toLocaleString()}
      </h2>

      {/* Trend sparkline */}
      {data && data.length > 0 && (
        <div className="mt-3">
          <Sparklines data={data} width={100} height={20}>
            <SparklinesLine
              color="#6366F1"
              style={{ strokeWidth: 3, fill: "transparent" }}
            />
          </Sparklines>
        </div>
      )}

      {/* Extra info */}
      {component && (
        <div className="mt-2 text-sm text-gray-400">{component}</div>
      )}
    </div>
  );
}
