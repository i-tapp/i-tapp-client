"use client";

import { useState } from "react";
import SummaryCard from "../_molecules/summary-card";
import StudentTable from "../_molecules/student-table";
import { useFetchAllStudents } from "@/queries/admin";

export default function AdminStudentPage() {
  const { data, isLoading, error } = useFetchAllStudents();

  const [selectedStudent, setSelectedStudent] = useState(null);

  const summaryItems = [
    {
      title: "Total Students",
      number: data?.length || 0,
      component: "+20 this week",
    },
    { title: "Active Students", number: 1800, component: "+15 this week" },
    { title: "Pending Approval", number: 150, component: "+5 this week" },
  ];

  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-3xl font-bold">Students</h1>

      <div className="flex flex-wrap gap-6">
        {summaryItems.map((item) => (
          <SummaryCard
            key={item.title}
            title={item.title}
            number={item.number}
            component={item.component}
          />
        ))}
      </div>

      <StudentTable
        data={data}
        isLoading={isLoading}
      />
    </div>
  );
}
