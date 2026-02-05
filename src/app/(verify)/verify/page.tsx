import { Suspense } from "react";
import VerifyPage from ".";

export default function page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyPage />;
    </Suspense>
  );
}
