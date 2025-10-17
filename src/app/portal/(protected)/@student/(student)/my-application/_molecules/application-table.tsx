import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/utils/tailwind";
import ApplicationCard from "./application-card";
import moment from "moment";
import { Application } from "@/types";

interface Props {
  query: string;
  applications: Application[];
}

export default function ApplicationTable({ query, applications }: Props) {
  // const myApplication = applications.filter((app) =>
  //   app.companyName?.toLocaleLowerCase().startsWith(query.toLocaleLowerCase())
  // );

  return (
    <div>
      <div className="hidden sm:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Applied on</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Industry</TableHead>
              <TableHead>No of Applicants</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((application, key) => (
              <TableRow key={key}>
                <TableCell>{application?.opportunity?.company?.name}</TableCell>
                <TableCell>
                  {moment(application.appliedAt).format("MMM Do YY")}
                </TableCell>
                <TableCell>{application?.opportunity?.location}</TableCell>
                <TableCell>
                  {application.opportunity?.company?.industry}
                </TableCell>
                <TableCell>
                  {application?.opportunity?.totalApplications || 0}
                </TableCell>
                <TableCell>
                  <span
                    className={cn(
                      " text-base border text-center bg-opacity-35 py-1.5 px-6 rounded-md",
                      true
                        ? " border-[#008767] text-[#008767]  bg-[#00B087] "
                        : "border-[#DF0404] text-[#DF0404]  bg-[#DF0404]"
                    )}
                  >
                    {application?.opportunity?.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-col gap-4">
        {applications.map((application, key) => (
          <ApplicationCard key={key} application={application} />
        ))}
      </div>
    </div>
  );
}
