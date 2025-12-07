// src/components/_molecules/recent-opportunities.tsx
const opportunities = [
  { title: "Frontend Intern", company: "TechCorp", date: "2h ago" },
  { title: "Backend Developer", company: "InnoSoft", date: "5h ago" },
  { title: "UI/UX Designer", company: "DesignHub", date: "Yesterday" },
];

export default function RecentOpportunities() {
  return (
    <div className="flex flex-col border rounded-xl p-4 bg-white shadow-sm">
      <h4 className="font-semibold text-xl mb-3">Recent Opportunities</h4>

      <div className="flex flex-col divide-y divide-gray-200">
        {opportunities.map((op, index) => (
          <div
            key={index}
            className="flex justify-between items-center py-2 px-2 hover:bg-gray-50 rounded transition-colors duration-200"
          >
            <div>
              <p className="font-medium text-gray-700">{op.title}</p>
              <p className="text-sm text-gray-400">{op.company}</p>
            </div>
            <span className="text-sm text-gray-400">{op.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
