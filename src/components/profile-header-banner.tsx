import { Edit3, LogOut } from "lucide-react";
import AvatarCard from "./avatar-card";
import Image from "next/image";
import UploadThing from "./upload-thing";
import { useAction } from "next-safe-action/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { query } from "@/lib/api";
import {
  updateCompanyBanner,
  updateCompanyLogo,
  updateStudentProfilePicture,
} from "@/actions";

type type = "student" | "company";

interface profileData {
  type: type;
  // logoImage?: string;
  bannerImage?: string;
  profileImage?: string;
}

interface ProfileHeaderBannerProps {
  profile: profileData;
  setEditing?: (editing: boolean) => void;
  onLogout?: () => void;
  icon?: React.ReactNode;
}

export default function ProfileHeaderBanner({
  setEditing,
  onLogout,
  icon,
  profile,
}: ProfileHeaderBannerProps) {
  const { profileImage, bannerImage } = profile;

  const queryClient = useQueryClient();

  // upload profile picture action (company/student)
  const { execute } = useAction(updateStudentProfilePicture, {
    onSuccess: (res) => {
      console.log("Profile image updated successfully:", res);
      queryClient.invalidateQueries({ queryKey: ["student-profile"] });
    },
    onError: (error) => {
      console.error("Error updating profile image:", error);
    },
  });

  const { execute: logo } = useAction(updateCompanyLogo, {
    onSuccess: (res) => {
      console.log("Profile image updated successfully:", res);
      queryClient.invalidateQueries({ queryKey: ["student-profile"] });
    },
    onError: (error) => {
      console.error("Error updating profile image:", error);
    },
  });

  // upload banner image action (company only )
  const { execute: banner } = useAction(updateCompanyBanner, {
    onSuccess: (res) => {
      console.log("Profile image updated successfully:", res);
    },
    onError: (error) => {
      console.error("Error updating profile image:", error);
    },
  });

  console.log("profile", profile);

  return (
    <div className="relative">
      {/* Banner */}
      <UploadThing
        onSelect={(img) => {
          console.log(img);
          banner({ banner: img! });
        }}
        disabled={profile.type !== "company"}
      >
        {bannerImage ? (
          <Image
            src={bannerImage}
            alt="Banner"
            width={40}
            height={40}
            className="w-full h-40 object-cover"
          />
        ) : (
          <div className="w-full h-40 bg-linear-to-r from-primary to-primary" />
        )}
      </UploadThing>

      {/* Action Buttons */}

      {setEditing && onLogout && (
        <div className="absolute top-4 right-4 flex gap-3">
          <button
            onClick={() => setEditing(true)}
            className="flex gap-2 items-center px-2 py-1 bg-white hover:bg-gray-100 text-gray-900 rounded-lg transition-colors shadow-lg font-medium text-sm"
          >
            <Edit3 size={16} />
            Edit Profile
          </button>
          <button
            onClick={onLogout}
            className="flex gap-2 items-center px-2 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors shadow-lg font-medium text-sm"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      )}

      {/* Profile Picture */}
      <UploadThing
        onSelect={(img) => {
          console.log(img);
          execute({ profileImage: img! });
          profile.type === "company" && logo({ logo: img! });
        }}
      >
        <div className="absolute -bottom-10 left-8">
          {profileImage ? (
            <Image
              src={profileImage}
              alt="Profile"
              width={40}
              height={40}
              className="w-22 h-22 rounded-2xl object-cover border-4 border-white shadow-xl bg-white"
            />
          ) : (
            <AvatarCard icon={icon} />
          )}
        </div>
      </UploadThing>
    </div>
  );
}
