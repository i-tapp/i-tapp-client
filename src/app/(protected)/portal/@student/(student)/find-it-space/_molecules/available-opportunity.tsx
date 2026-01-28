import React from "react";
import Image from "next/image";
import dp from "@/assets/images/dp.png";
import moment from "moment";
import { cn } from "@/utils/tailwind";
import { Opportunity } from "@/types";

export default function AvailableOpportunity({
  details,
  setSelectedId,
  selectedId,
  setSelectedOpportunity,
}: {
  details: Opportunity;
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  setSelectedOpportunity: (name: Opportunity | null) => void;
}) {
  const { id, title, location, duration, createdAt } = details;

  return (
    <div
      className={cn(
        "bg-white  rounded-xl p-5 basis-60 grow cursor-pointer border-2 border-transparent transition-all",
        selectedId === id && "border-primary/30 shadow-md border-2"
      )}
      onClick={() => {
        setSelectedId(id);
        setSelectedOpportunity(details);
      }}
    >
      <div className="flex gap-3">
        <Image
          src={dp}
          alt="companylogo"
          width={50}
          height={50}
          className="bg-gray-100 rounded-md self-start"
        />
        <div>
          <h6 className="text-h6 capitalize">{title ?? "title"}</h6>
          <p className="text-primary capitalize">{location ?? "N/A"}</p>
        </div>
      </div>

      <p className="bg-[#F0F0F5] rounded-[40px] px-3.5 py-1 my-4 inline-block text-sm">
        {duration ? duration : 0} Months IT
      </p>

      <p className="text-primary text-sm">
        {/* {postedAgo} */}

        {moment(createdAt).startOf("day").fromNow()}
      </p>
    </div>
  );
}
