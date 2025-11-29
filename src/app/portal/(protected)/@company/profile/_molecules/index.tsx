"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import ProfileForm from "./profile-form";
import { useCompanyStore } from "@/lib/store/company";
import { logout } from "@/actions/auth";
import {
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  Users,
  Briefcase,
  Edit3,
  LogOut,
  X,
} from "lucide-react";
import InfoCard from "@/components/info-card";

export default function CompanyProfilePage() {
  const [editing, setEditing] = useState(false);
  const company = useCompanyStore((s) => s.company);

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  if (!company) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No company data available</p>
        </div>
      </div>
    );
  }

  if (editing) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-linear-to-r from-primary to-primary px-8 py-6">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Edit3 className="w-6 h-6" />
                  Edit Company Profile
                </h1>
                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    onClick={() => setEditing(false)}
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    // className="bg-red-500 hover:bg-red-600"
                    className="text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </div>
            </div>
            <div className="p-8">
              <ProfileForm />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header Banner */}
          <div className="relative">
            {company.bannerUrl ? (
              <img
                src={company.bannerUrl}
                alt="Company Banner"
                className="w-full h-56 object-cover"
              />
            ) : (
              <div className="w-full h-56 bg-linear-to-r from-primary via-primary to-primary" />
            )}

            {/* Action Buttons */}
            <div className="absolute top-4 right-4 flex gap-3">
              <Button
                variant={"default"}
                onClick={() => setEditing(true)}
                className="bg-white hover:bg-gray-100 text-gray-900 shadow-lg"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
              <Button
                variant="secondary"
                onClick={handleLogout}
                className="shadow-lg text-shadow-rose-300 hover:bg-red-50 text-red-600"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>

            {/* Company Logo */}
            <div className="absolute -bottom-10 left-8">
              {company.logoUrl ? (
                <img
                  src={company.logoUrl}
                  alt="Company Logo"
                  className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-xl bg-white"
                />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-linear-to-br from-primary to-primary border-4 border-white shadow-xl flex items-center justify-center">
                  <Building2 className="w-12 h-12 text-white" />
                </div>
              )}
            </div>
          </div>

          {/* Company Name & Basic Info */}
          <div className="pt-20 px-8 pb-6 border-b border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {company.name || "Company Name"}
            </h1>
            {company.industry && (
              <div className="flex items-center gap-2 text-gray-600">
                <Briefcase className="w-4 h-4" />
                <span className="text-sm font-medium">{company.industry}</span>
              </div>
            )}
          </div>

          {/* Description */}
          {company.description && (
            <div className="px-8 py-6 bg-gray-50 border-b border-gray-200">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                About
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {company.description}
              </p>
            </div>
          )}

          {/* Contact & Details Grid */}
          <div className="p-8">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-6">
              Company Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoCard
                icon={<Mail className="w-5 h-5" />}
                label="Email Address"
                value={company.email}
                href={company.email ? `mailto:${company.email}` : undefined}
              />
              <InfoCard
                icon={<Phone className="w-5 h-5" />}
                label="Phone Number"
                value={company.phone}
                href={company.phone ? `tel:${company.phone}` : undefined}
              />
              <InfoCard
                icon={<Globe className="w-5 h-5" />}
                label="Website"
                value={company.website}
                href={company.website}
                external
              />
              <InfoCard
                icon={<Users className="w-5 h-5" />}
                label="Student Capacity"
                value={company.studentCapacity?.toString()}
              />
              <InfoCard
                icon={<MapPin className="w-5 h-5" />}
                label="Address"
                value={company.address}
                fullWidth
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
