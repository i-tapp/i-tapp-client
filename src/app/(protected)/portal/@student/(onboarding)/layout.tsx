export default function StudentOnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-gray-50">
      {/* Header */}
      {/* <header className="fixed top-0 left-0 w-full h-14 bg-blue-500 shadow-md z-50 flex items-center px-4">
        <p className="text-white font-medium">Student Onboarding</p>
      </header> */}

      {/* Content */}
      <main className="">{children}</main>
    </div>
  );
}
