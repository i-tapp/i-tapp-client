"use client";

import { useState } from "react";
import ApplicationList from "./_molecules/application-list";
import ApplicationDetail from "./_molecules/application-detail";

export default function ApplicationsPage() {
  const [selected, setSelected] = useState<any>(null);

  return (
    <div className="w-full h-full flex">
      {/* LEFT PANEL */}
      <div className="w-[350px] border-r h-full overflow-y-auto">
        <ApplicationList onSelect={setSelected} selectedId={selected?.id} />
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 h-full overflow-y-auto">
        {selected ? (
          <ApplicationDetail data={selected} />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            Select an application to view details
          </div>
        )}
      </div>
    </div>
  );
}
