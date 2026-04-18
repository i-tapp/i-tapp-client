"use client";
import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Briefcase,
  Target,
  Award,
  Code,
  Heart,
  Edit3,
  LogOut,
  X,
  MapPin,
  Calendar,
  GraduationCap,
  FileText,
} from "lucide-react";
import InfoCard from "@/components/info-card";
import SkillCard from "@/components/skill-card";
import ProfileHeaderBanner from "@/components/profile-header-banner";
import { useFetchProfile } from "@/hooks/query";
import { Spinner } from "@/components/spinner";
import ProfileForm from "./profile-form";
import { useLogout } from "@/hooks/use-logout";

// Mock student data
const mockStudent = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@university.edu",
  phone: "+234 803 555 1234",
  matricNumber: "2020/12345",
  department: "Computer Science",
  level: "400 Level",
  cgpa: "4.75",
  profileBio:
    "Passionate software developer with a keen interest in web technologies and artificial intelligence. Always eager to learn new technologies and contribute to innovative projects.",
  softSkills:
    "Communication, Teamwork, Problem Solving, Time Management, Leadership",
  technicalSkills: "JavaScript, React, Node.js, Python, SQL, Git, Docker",
  preferredIndustry: "Software Development, Fintech, AI/ML",
  goals:
    "Secure a software engineering role at a leading tech company and contribute to building scalable solutions that impact millions of users.",
  address: "University of Lagos, Akoka, Lagos",
  dob: "1999-05-15",
  profilePicture: null,
};

const StudentProfilePage = ({ student = mockStudent, onEdit = () => {} }) => {
  const [editing, setEditing] = useState(false);
  const { data: studentDetails, isLoading, error } = useFetchProfile();
  const logout = useLogout();

  if (isLoading) {
    return <Spinner />;
  }

  if (editing) {
    return (
      <div className="min-h-screen mt-10 md:mt-12 md:py-8 md:px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-linear-to-r from-primary to-primary px-8 py-6">
              <div className="flex justify-between items-center">
                <h1 className=" font-bold text-white flex items-center gap-2">
                  <Edit3 size={16} />
                  Edit Profile
                </h1>
                <div className="flex gap-3">
                  <button
                    onClick={() => setEditing(false)}
                    className="flex text-sm items-center px-4 py-1 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors border border-white/30"
                  >
                    <X size={14} className="mr-2" />
                    Cancel
                  </button>
                  <button
                    onClick={logout}
                    className="flex text-sm items-center px-4 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                  >
                    <LogOut size={14} className="mr-2" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
            <div className="p-4 md:p-8">
              {/* <p className="text-center text-gray-500">
                Profile Form Component Goes Here
              </p> */}

              <ProfileForm
                student={studentDetails}
                onClose={() => setEditing(false)}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-11 md:mt-12 bg-gray-50 md:py-8 md:px-4">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header Banner */}
          <ProfileHeaderBanner
            // company={studentDetails}
            profile={{
              type: "student",
              profileImage: studentDetails.profileImage,
            }}
            setEditing={setEditing}
            onLogout={logout}
            icon={<User className="w-16 h-16 text-white" />}
          />

          {/* Student Name & Basic Info */}
          <div className="pt-20 px-4 md:px-8 pb-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {studentDetails.firstName} {studentDetails.lastName}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-gray-600">
                  <div className="flex items-center gap-2">
                    <GraduationCap size={18} />
                    <span className="text-sm capitalize font-medium">
                      {studentDetails.courseOfStudy}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText size={16} />
                    <span className="text-sm font-medium">
                      {studentDetails.level} Level
                    </span>
                  </div>
                  {studentDetails.gpa && (
                    <div className="flex items-center gap-2">
                      <Award size={18} className="text-yellow-600" />
                      <span className="text-sm font-medium">
                        GPA: {studentDetails.gpa}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              {studentDetails.matriculationNumber && (
                <div className="bg-blue-50 border border-blue-200 px-4 py-2 rounded-lg">
                  <p className="text-xs text-blue-600 font-medium uppercase tracking-wide">
                    Matric Number
                  </p>
                  <p className="text-lg font-bold text-blue-900">
                    {studentDetails.matriculationNumber}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Bio Section */}
          {studentDetails.bio && (
            <div className="px-4 md:px-8 py-6 bg-gray-50 border-b border-gray-200">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                About Me
              </h2>
              <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                {studentDetails.bio}
              </p>
            </div>
          )}

          {/* Contact Information */}
          <div className="p-3 md:p-8 border-b border-gray-200">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-6">
              Contact Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoCard
                icon={<Mail size={18} />}
                label="Email Address"
                value={studentDetails?.user?.email}
              />
              <InfoCard
                icon={<Phone size={18} />}
                label="Phone Number"
                value={studentDetails.phone}
              />
              {student.address && (
                <InfoCard
                  icon={<MapPin size={18} />}
                  label="Address"
                  value={studentDetails.address}
                  fullWidth
                />
              )}
              {student.dob && (
                <InfoCard
                  icon={<Calendar size={18} />}
                  label="Date of Birth"
                  value={new Date(studentDetails.dob).toLocaleDateString(
                    "en-NG",
                    {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    },
                  )}
                />
              )}
            </div>
          </div>

          {/* Skills & Preferences */}
          <div className="p-3 md:p-8 bg-gray-50">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-6">
              Skills & Career Goals
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SkillCard
                icon={<Code size={18} />}
                label="Technical Skills"
                value={studentDetails.techSkills}
                color="blue"
              />
              <SkillCard
                icon={<Heart size={18} />}
                label="Soft Skills"
                value={studentDetails.softSkills}
                color="purple"
              />
              <SkillCard
                icon={<Briefcase size={18} />}
                label="Preferred Industry"
                value={studentDetails.preferredIndustry}
                color="green"
              />
              <SkillCard
                icon={<Target size={18} />}
                label="Career Goals"
                value={studentDetails.goals}
                color="orange"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfilePage;
