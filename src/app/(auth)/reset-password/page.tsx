import { Suspense } from "react";
import ResetPasswordPage from ".";

export default function page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordPage />
    </Suspense>
  );
}
