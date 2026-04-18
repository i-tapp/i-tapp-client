"use client";
import { useRouter } from "next/navigation";
import { students as studentData } from "./student-detail";
import { useState } from "react";
import { studentStatusStyle } from "@/utils/admin-status-style";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function StudentTable({
  // onView,
  data,
  isLoading,
}: {
  // onView: (student: (typeof studentData)[0]) => void;
  isLoading: boolean;
  data: any;
}) {
  const router = useRouter();
  const [search, setSearch] = useState("");

  if (isLoading) {
    return <div className="p-4">Loading students...</div>;
  }

  const filteredStudents = data.filter((s: any) => {
    const firstName = s.firstName || "";
    const lastName = s.lastName || "";
    const email = s.user?.email || "";
    const program = s.courseOfStudy || "";
    const name = firstName.toLowerCase() + " " + lastName.toLowerCase();
    return (
      name.toLowerCase().includes(search.toLowerCase()) ||
      email.toLowerCase().includes(search.toLowerCase()) ||
      program.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="border rounded-xl overflow-x-auto bg-white shadow">
      <div className="p-4 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search students..."
          className="border px-3 py-2 rounded w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Link
          href="student/new"
          className={buttonVariants({ variant: "default" })}
        >
          Add Student
        </Link>
      </div>

      <table className="min-w-full text-sm text-left">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-3">#</th>
            <th className="p-3">Profile</th>
            <th className="p-3">Name</th>
            <th className="p-3">Email</th>
            <th className="p-3">Program</th>
            <th className="p-3">Account</th>
            <th className="p-3">Status</th>
            {/* <th className="p-3">Applications</th> */}
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map((s: any, index: number) => (
            <tr
              key={s.id}
              className="border-b hover:bg-gray-50 transition"
              onClick={() => router.push(`student/${s.id}`)}
            >
              <td className="p-3">{index + 1}</td>
              <td className="p-3">
                <div className="rounded-full h-10 w-10">
                  <Image
                    src={s?.profileImage || "/applicant.png"}
                    width={20}
                    height={20}
                    className="rounded-full w-full h-full object-cover"
                    alt="profile"
                  />
                </div>
              </td>
              {/* <td className="p-3">{s?.name}</td>
               */}
              <td className="p-3">
                {s.firstName} {s.lastName}
              </td>

              <td className="p-3">{s?.user?.email}</td>
              <td className="p-3">{s?.courseOfStudy}</td>
              <td className="p-3">
                {s?.user?.isActive ? "Active" : "Inactive"}
              </td>
              <td className="p-3">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    studentStatusStyle[
                      s.status as keyof typeof studentStatusStyle
                    ]
                  }`}
                >
                  {s.status}
                </span>
              </td>
              {/* <td className="p-3">{s.applications}</td> */}
              <td className="p-3">
                <button
                  // onClick={() => onView(s)}
                  className="text-indigo-600 hover:underline"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
          {filteredStudents.length === 0 && (
            <tr>
              <td colSpan={8} className="text-center p-4 text-gray-500">
                No students found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
