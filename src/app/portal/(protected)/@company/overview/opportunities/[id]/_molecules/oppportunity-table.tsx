import { Button, buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import Image from "next/image";
import { Overview } from "../../_molecules/overview";
import { LucideMailX, User } from "lucide-react"; // Example icon
import { number } from "zod";
import Link from "next/link";
import {
  ArchiveAdd,
  ArrowRight,
  ArrowRight2,
  Bookmark,
  Bookmark2,
  SmsEdit,
} from "iconsax-reactjs";
import { Application } from "@/types";
import { ur } from "zod/v4/locales";

export default function OpportunityTable({ data }: { data: Application[] }) {
  const applicants = [
    {
      id: 1,
      name: "Jane Doe",
      status: "new_applicant",
      appliedDate: "2025-09-25",
      resume: "resume-jane.pdf",
      school: "Kadpoly",
      avatar: "/applicant.png",
    },
    {
      id: 2,
      name: "John Smith",
      status: "shortlisted",
      appliedDate: "2025-09-26",
      resume: "resume-john.pdf",
      school: "Kasu",
      avatar: "/applicant.png",
    },
    {
      id: 3,
      name: "Mary Johnson",
      status: "interviewing",
      appliedDate: "2025-09-27",
      resume: "resume-mary.pdf",
      school: "Unilag",
      avatar: "/applicant.png",
    },
    {
      id: 4,
      name: "David Lee",
      status: "rejected",
      appliedDate: "2025-09-27",
      resume: "resume-david.pdf",
      school: "ABU Zaria",
      avatar: "/applicant.png",
    },
    {
      id: 5,
      name: "Sarah Brown",
      status: "approved",
      appliedDate: "2025-09-28",
      resume: "resume-sarah.pdf",
      school: "OAU",
      avatar: "/applicant.png",
    },
    {
      id: 6,
      name: "Michael Green",
      status: "accepted",
      appliedDate: "2025-09-28",
      resume: "resume-michael.pdf",
      school: "UI Ibadan",
      avatar: "/applicant.png",
    },
  ];

  const overview = [
    {
      title: "Total Applicants",
      number: applicants.length,
      icon: <User size={20} />,
    },
    {
      title: "Shortlisted",
      number: 5,
      icon: <User size={20} />,
    },
    {
      title: "Interviewing",
      number: 3,
      icon: <User size={20} />,
    },
    {
      title: "Offers extended",
      number: 2,
      icon: <User size={20} />,
    },
  ];

  return (
    <div className="space-y-6 rounded-md">
      {/* Overview Cards */}
      <div className="flex flex-row gap-2">
        {overview.map((overview, index) => (
          <Overview
            key={index}
            title={overview.title}
            number={overview.number}
            icon={<User size={20} />}
            link="#"
          />
        ))}
      </div>

      {/* Applicants Table */}
      <Table className="w-full border">
        <TableHeader>
          <TableRow>
            {/* Filter Buttons (Tabs Style) */}
            <div className="flex ">
              {["All aplicants", "shortlisted", "invterview"].map(
                (link, index) => (
                  <Link
                    key={index}
                    href={"#"}
                    className={`
          px-4 py-6 text-sm font-medium border-r last:border-r-0
          ${index === 0 ? "border-l-0" : ""}
          ${buttonVariants({ variant: "ghost" })} 
          rounded-none
        `}
                  >
                    {link}
                  </Link>
                )
              )}
            </div>
          </TableRow>
        </TableHeader>

        <TableHeader>
          <TableRow>
            <TableHead>Applicant</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Applied Date</TableHead>
            {/* <TableHead>Resume</TableHead> */}
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((applicant) => {
            const student = applicant?.student;

            return (
              <TableRow key={applicant.id} className="even:bg-gray-50">
                <TableCell className="py-4">
                  <ApplicantProfile student={student} />
                </TableCell>
                <TableCell className="py-4">{applicant.status}</TableCell>
                <TableCell className="py-4">{applicant.appliedAt}</TableCell>
                {/* <TableCell className="py-4">
                <a
                  href={`/uploads/${applicant.resume}`}
                  className="text-blue-600 hover:underline"
                >
                  View
                </a>
              </TableCell> */}
                <TableCell className="py-4">
                  <div className="flex items-center justify-center gap-2">
                    <ArchiveAdd size={18} />

                    <Link href={`mailto:${student?.user?.email}`}>
                      <SmsEdit size={18} />
                    </Link>

                    <Button variant="secondary" size="sm">
                      View Profile <ArrowRight2 className="ml-1" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

export function ApplicantProfile({ student }: { student }) {
  return (
    <div className="flex items-center gap-3">
      <Image
        src={student?.user?.avatarUrl || "/applicant.png"}
        alt={student.firstName + " " + student.lastName}
        width={30}
        height={30}
        className="h-10 w-10 border rounded-full object-cover"
      />
      <div>
        <p className="font-semibold text-sm">
          {student.firstName + " " + student.lastName}
        </p>
        <p className="text-xs text-gray-500">{student.school}</p>
      </div>
    </div>
  );
}
