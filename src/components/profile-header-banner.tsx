import { User, Edit3, LogOut, Building2 } from "lucide-react";
import AvatarCard from "./avatar-card";
import Image from "next/image";

interface ProfileHeaderBannerProps {
  setEditing?: (editing: boolean) => void;
  onLogout?: () => void;
  company?: {
    logoImage?: string;
    bannerImage?: string;
  };
  student?: {
    profileImage?: string;
  };
  icon?: React.ReactNode;
}

export default function ProfileHeaderBanner({
  setEditing,
  onLogout,
  company,
  student,
  icon,
}: ProfileHeaderBannerProps) {
  const profileUrl = student
    ? student.profileImage
    : company
    ? company.logoImage
    : null;

  const bannerUrl = company ? company.bannerImage : null;

  return (
    <div className="relative">
      {/* Banner */}
      {bannerUrl ? (
        <Image
          src={`${bannerUrl}`}
          alt="Banner"
          width={50}
          height={50}
          className="w-full h-56 object-cover"
        />
      ) : (
        <div className="w-full h-56 bg-linear-to-r from-primary to-red-500" />
      )}

      {/* Action Buttons */}

      {setEditing && onLogout && (
        <div className="absolute top-4 right-4 flex gap-3">
          <button
            onClick={() => setEditing(true)}
            className="flex items-center px-4 py-2 bg-white hover:bg-gray-100 text-gray-900 rounded-lg transition-colors shadow-lg font-medium"
          >
            <Edit3 className="w-4 h-4 mr-2" />
            Edit Profile
          </button>
          <button
            onClick={onLogout}
            className="flex items-center px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors shadow-lg font-medium"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </button>
        </div>
      )}

      {/* Profile Picture */}
      <div className="absolute -bottom-12 left-8">
        {profileUrl ? (
          <Image
            src={`http://localhost:3001/${profileUrl}`}
            alt="Profile"
            width={50}
            height={50}
            className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-xl bg-white"
          />
        ) : (
          <AvatarCard icon={icon} />
        )}
      </div>
    </div>
  );
}

// import { User, Edit3, LogOut, Building2 } from "lucide-react";
// import AvatarCard from "./avatar-card";

// export default function ProfileHeaderBanner({
//   setEditing,
//   onLogout,
//   data,
//   icon,
// }) {
//   console.log("ProfileHeaderBanner data:", data.logoImage);
//   return (
//     <div className="relative">
//       <div className="w-full h-56 bg-linear-to-r from-primary to-red-500" />

//       {/* Action Buttons */}

//       <div className="absolute top-4 right-4 flex gap-3">
//         <button
//           onClick={() => setEditing(true)}
//           className="flex items-center px-4 py-2 bg-white hover:bg-gray-100 text-gray-900 rounded-lg transition-colors shadow-lg font-medium"
//         >
//           <Edit3 className="w-4 h-4 mr-2" />
//           Edit Profile
//         </button>
//         <button
//           onClick={onLogout}
//           className="flex items-center px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors shadow-lg font-medium"
//         >
//           <LogOut className="w-4 h-4 mr-2" />
//           Logout
//         </button>
//       </div>

//       {/* Profile Picture */}
//       <div className="absolute -bottom-12 left-8">
//         {data.logoImage ? (
//           <img
//             src={`http://localhost:3000/${data.logoImage}`}
//             alt="Profile"
//             className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-xl bg-white"
//           />
//         ) : (
//           <AvatarCard icon={icon} />
//         )}
//       </div>
//     </div>
//   );
// }
