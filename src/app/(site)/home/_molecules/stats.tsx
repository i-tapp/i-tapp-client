export function Stats() {
  const items = [
    { value: "2,000+", label: "Students Registered" },
    { value: "50+", label: "Verified Companies" },
    { value: "12+", label: "States Covered" },
    { value: "85%", label: "Placement Success Rate" },
  ];

  return (
    <div className="bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {items.map((item) => (
            <div key={item.label} className="text-center">
              <p className="text-3xl sm:text-4xl font-bold text-white">{item.value}</p>
              <p className="text-primary-foreground/60 text-sm mt-1 font-medium text-white/60">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
