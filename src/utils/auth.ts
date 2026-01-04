import { useStudentStore } from "@/lib/store/student";
import { clearAuthCookies } from "./cookies"; // your existing function
import { useCompanyStore } from "@/lib/store/company";

export const logout = async () => {
  // 1️⃣ Clear server/client cookies
  await clearAuthCookies();

  // 2️⃣ Clear Zustand stores
  useStudentStore.getState().setStudent(null);
  useCompanyStore.getState().setCompany(null);
};

export const handleLogout = async () => {
  await logout();
  window.location.href = "/";
};
