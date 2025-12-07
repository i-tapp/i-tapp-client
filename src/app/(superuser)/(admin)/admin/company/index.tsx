"use client";
import { ReactNode, useState } from "react";
import CompanyTable from "./_molecules/company-table";

export default function CompaniesPage() {
  const [companies, setCompanies] = useState([
    { id: 1, name: "Acme Corp", employees: 120, status: "Active" },
    { id: 2, name: "Globex Inc", employees: 75, status: "Active" },
    { id: 3, name: "Soylent Co", employees: 40, status: "Inactive" },
    { id: 4, name: "Initech", employees: 200, status: "Active" },
  ]);

  // Component for a single company card
  const CompanyCard = ({
    name,
    employees,
    status,
  }: {
    name: string;
    employees: number;
    status: string;
  }) => (
    <div className="border rounded-xl p-4 bg-white shadow hover:shadow-md transition-shadow">
      <h3 className="font-bold text-lg">{name}</h3>
      <p className="text-gray-500 text-sm">Employees: {employees}</p>
      <p
        className={`text-sm font-semibold ${
          status === "Active" ? "text-green-600" : "text-red-600"
        }`}
      >
        {status}
      </p>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-3xl font-bold">Companies</h1>

      {/* Search / Filter */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Search companies..."
          className="border p-2 rounded flex-1"
        />
        <select className="border p-2 rounded">
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      {/* Company cards grid */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map((c) => (
          <CompanyCard
            key={c.id}
            name={c.name}
            employees={c.employees}
            status={c.status}
          />
        ))}
      </div> */}

      <CompanyTable />
    </div>
  );
}
