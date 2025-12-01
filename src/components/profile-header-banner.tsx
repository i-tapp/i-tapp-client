import { User, Edit3, LogOut } from "lucide-react";
import AvatarCard from "./avatar-card";

export default function ProfileHeaderBanner({
  setEditing,
  onLogout,
  data,
  icon,
}) {
  return (
    <div className="relative">
      <div className="w-full h-56 bg-linear-to-r from-primary to-primary" />

      {/* Action Buttons */}
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

      {/* Profile Picture */}
      <div className="absolute -bottom-12 left-8">
        {data.profilePicture ? (
          <img
            src={data.profilePicture}
            alt="Profile"
            className="w-32 h-32 rounded-2xl object-cover border-4 border-white shadow-xl bg-white"
          />
        ) : (
          <AvatarCard icon={icon} />
        )}
      </div>
    </div>
  );
}
