export const next = [
  {
    text: "set up your free company profile ",
    description:
      "Create a comprehensive profile to showcase your company and attract top talent.",
  },
  {
    text: "Start receiving intern applications ",
    description:
      "Once your profile is live, you'll start getting applications from qualified students.",
  },
  {
    text: "Get access to verified student profiles ",
    description:
      "Browse through our database of verified student profiles to find the perfect fit for your team.",
  },
];

export default function WelcomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex p-3 md:px-28 gap-6  flex-col lg:flex-row bg-[#faf8ff99]">
      <main className="flex-1 mb-6">{children}</main>

      <aside className="w-full lg:w-96 bg-gray-100 p-6 border-l border-gray-200">
        <div className="sticky top-6">
          <h1 className="text-lg font-bold mb-2">What happens next</h1>
          <p className="text-sm text-gray-600 mb-4">
            Once you submit this form, our team will reach out to help you:
          </p>

          <div className="space-y-4">
            {next.map((item, index) => (
              <div key={index}>
                <div className="flex items-start gap-2">
                  <span className="font-bold">{index + 1}.</span>
                  <span className="font-semibold">{item.text}</span>
                </div>
                <p className="text-gray-500 text-sm mt-1">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
