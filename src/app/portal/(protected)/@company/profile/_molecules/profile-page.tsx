"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import ProfileForm from "./profile-form";
import { useCompanyStore } from "@/lib/store/company";
import { logout } from "@/actions/auth";

export default function CompanyProfilePage() {
  const [editing, setEditing] = useState(false);
  const company = useCompanyStore((s) => s.company);

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  if (!company) {
    return <p className="text-center text-gray-500 mt-24">No company data</p>;
  }

  if (editing) {
    return (
      <div className="max-w-5xl mx-auto mt-10 p-8 bg-white rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-semibold">Edit Company Profile</h1>
          <div className="flex space-x-2">
            <Button variant="secondary" onClick={() => setEditing(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
        <ProfileForm />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 p-8 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">Company Profile</h1>
        <div className="flex space-x-2">
          <Button onClick={() => setEditing(true)}>Edit Profile</Button>
          <Button variant="destructive" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>

      {/* Banner */}
      {company.bannerUrl && (
        <img
          src={company.bannerUrl}
          alt="Company Banner"
          className="w-full h-40 object-cover rounded-lg mb-6"
        />
      )}

      {/* Profile Image */}
      <div className="flex items-center mb-6">
        {company.logoUrl && (
          <img
            src={company.logoUrl}
            alt="Company Logo"
            className="w-20 h-20 rounded-full object-cover border"
          />
        )}
        <h2 className="ml-4 text-lg font-semibold">{company.name ?? "—"}</h2>
      </div>

      {/* Grid Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Field label="Phone" value={company.phone} />
          <Field label="Website" value={company.website} />
          <Field label="Address" value={company.address} />
        </div>

        <div className="space-y-4">
          <Field
            label="Student Capacity"
            value={company.studentCapacity?.toString()}
          />
          <Field label="Industry" value={company.industry} />
          <Field label="Email" value={company.email} />
        </div>
      </div>

      {/* Bio/Description */}
      <div className="mt-6">
        <Field label="Description" value={company.description} multiline />
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  multiline,
}: {
  label: string;
  value?: string;
  multiline?: boolean;
}) {
  return (
    <div>
      <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
      <p
        className={`text-base text-gray-900 border border-gray-300 rounded-md px-3 py-2 bg-white ${
          multiline ? "min-h-[100px] whitespace-pre-line" : ""
        }`}
      >
        {value || "—"}
      </p>
    </div>
  );
}
