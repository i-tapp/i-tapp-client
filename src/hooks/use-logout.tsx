import { useCompanyStore, useStudentStore } from "@/lib/store";
import { clearAuthCookies } from "@/utils/cookies";

export function useLogout() {
  return async function logout() {
    try {
      // 1️⃣ Clear server/client cookies
      await clearAuthCookies();

      // 2️⃣ Clear Zustand stores
      useStudentStore.getState().setStudent(null);
      useCompanyStore.getState().setCompany(null);
    } catch (error) {
      console.log("logout failed", error);
    } finally {
      window.location.href = "/";
    }
  };
}
