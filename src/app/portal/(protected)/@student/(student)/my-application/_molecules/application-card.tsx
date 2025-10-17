import { Application } from "@/types";
import React from "react";

export default function ApplicationCard({
  application,
}: {
  application: Application;
}) {
  return (
    <div className=" sm:hidden border border-black rounded-xl p-5">
      <h6 className="text-h6 mb-1">
        {application?.opportunity?.company?.name}
      </h6>
      <p className="text-primary">{application?.opportunity?.location}</p>
      <div className="my-4 *:bg-[#F0F0F5] *:rounded-[50px] *:px-3.5 *:py-2 *:text-xs  *:xxs:text-sm">
        <span className="mr-2">
          {application?.opportunity?.company?.industry}
        </span>
        <span>{application?.opportunity?.status}</span>
      </div>
      <div className="*:text-primary *:text-xs  *:xxs:text-sm">
        <span className="mr-3">
          {application?.opportunity?.totalApplications ?? 0}
        </span>
        <span>{application?.appliedAt}</span>
      </div>
    </div>
  );
}
