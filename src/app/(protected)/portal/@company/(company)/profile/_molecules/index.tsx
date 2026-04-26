"use client";

import { useState } from "react";
import ProfileForm from "./profile-form";
import {
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  Users,
  Briefcase,
  Hash,
  Calendar,
  FileText,
} from "lucide-react";
import Link from "next/link";
import InfoCard from "@/components/info-card";
import ProfileHeaderBanner from "@/components/profile-header-banner";
import { useFetchCompanyProfile } from "@/hooks/query";
import { Spinner } from "@/components/spinner";
import { useLogout } from "@/hooks/use-logout";

export default function CompanyProfilePage() {
  const [editing, setEditing] = useState(false);

  const { data: companyProfile, isLoading } = useFetchCompanyProfile();

  const logout = useLogout();

  if (editing) {
    return (
      // <div className="min-h-screen py-8 px-4">
      //   <div className="max-w-5xl mx-auto">
      //     <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      //       <div className="bg-linear-to-r from-primary to-primary px-8 py-6">
      //         <div className="flex justify-between items-center">
      //           <h1 className="text-2xl font-bold text-white flex items-center gap-2">
      //             <Edit3 className="w-6 h-6" />
      //             Edit Company Profile
      //           </h1>
      //           <div className="flex gap-3">
      //             <Button
      //               variant="secondary"
      //               onClick={() => setEditing(false)}
      //               className="bg-white/20 hover:bg-white/30 text-white border-white/30"
      //             >
      //               <X className="w-4 h-4 mr-2" />
      //               Cancel
      //             </Button>
      //             <Button
      //               variant="outline"
      //               onClick={handleLogout}
      //               // className="bg-red-500 hover:bg-red-600"
      //               className="text-red-600 hover:bg-red-50"
      //             >
      //               <LogOut className="w-4 h-4 mr-2" />
      //               Logout
      //             </Button>
      //           </div>
      //         </div>
      //       </div>
      //       <div className="p-8">
      //         <ProfileForm />
      //       </div>
      //     </div>
      //   </div>
      // </div>

      <ProfileForm onClose={() => setEditing(false)} />
    );
  }

  if (isLoading) return <Spinner />;

  return (
    <div className="min-h-screen  py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header Banner */}

          <ProfileHeaderBanner
            profile={{
              type: "company",
              profileImage: companyProfile?.logo,
              bannerImage: companyProfile?.banner,
            }}
            setEditing={setEditing}
            onLogout={logout}
            icon={<Building2 className="w-16 h-16 text-white" />}
          />

          {/* Company Name & Basic Info */}
          <div className="pt-20 px-8 pb-6 border-b border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {companyProfile?.name || "Company Name"}
            </h1>
            {companyProfile?.industry && (
              <div className="flex items-center gap-2 text-gray-600">
                <Briefcase className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {companyProfile.industry}
                </span>
              </div>
            )}
          </div>

          {/* Description */}
          {companyProfile?.description && (
            <div className="px-8 py-6 bg-gray-50 border-b border-gray-200">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                About
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {companyProfile?.description}
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
                value={companyProfile?.user?.email ?? companyProfile?.email}
                href={
                  companyProfile?.user?.email
                    ? `mailto:${companyProfile.user.email}`
                    : undefined
                }
              />
              <InfoCard
                icon={<Phone className="w-5 h-5" />}
                label="Contact Phone Number"
                value={companyProfile?.phone}
                href={
                  companyProfile?.phone
                    ? `tel:${companyProfile.phone}`
                    : undefined
                }
              />
              <InfoCard
                icon={<Briefcase className="w-5 h-5" />}
                label="Industry"
                value={companyProfile?.industry}
              />
              <InfoCard
                icon={<Users className="w-5 h-5" />}
                label="Company Size"
                value={companyProfile?.companySize}
              />
              <InfoCard
                icon={<Calendar className="w-5 h-5" />}
                label="Founded Year"
                value={companyProfile?.foundedYear}
              />
              <InfoCard
                icon={<Globe className="w-5 h-5" />}
                label="Website"
                value={companyProfile?.website}
                href={companyProfile?.website}
                external
              />
              <InfoCard
                icon={<Hash className="w-5 h-5" />}
                label="RC / Registration Number"
                value={companyProfile?.registrationNumber}
              />
              <InfoCard
                icon={<MapPin className="w-5 h-5" />}
                label="City"
                value={companyProfile?.city}
              />
              <InfoCard
                icon={<MapPin className="w-5 h-5" />}
                label="State"
                value={companyProfile?.state}
              />
              <InfoCard
                icon={<MapPin className="w-5 h-5" />}
                label="Full Address"
                value={companyProfile?.address}
                fullWidth
              />
            </div>
          </div>

          {/* Documents */}
          {(companyProfile?.cacDocument || companyProfile?.proofOfAddress) && (
            <div className="px-8 py-6 border-t border-gray-200">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                Documents
              </h2>
              <div className="flex flex-wrap gap-4">
                {companyProfile?.cacDocument && (
                  <Link
                    href={companyProfile.cacDocument}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-sm text-primary font-medium"
                  >
                    <FileText className="w-4 h-4" />
                    CAC Document
                  </Link>
                )}
                {companyProfile?.proofOfAddress && (
                  <Link
                    href={companyProfile.proofOfAddress}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-sm text-primary font-medium"
                  >
                    <FileText className="w-4 h-4" />
                    Proof of Address
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
