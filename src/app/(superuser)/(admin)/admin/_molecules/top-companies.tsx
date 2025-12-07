// src/components/_molecules/top-companies.tsx
const topCompanies = [
  { name: "TechCorp", postings: 120 },
  { name: "InnoSoft", postings: 90 },
  { name: "DesignHub", postings: 60 },
];

export default function TopCompanies() {
  return (
    <div className="flex flex-col border rounded-xl p-4 bg-white shadow-sm">
      <h4 className="font-semibold text-xl mb-3">Top Companies</h4>

      <div className="flex flex-col divide-y divide-gray-200">
        {topCompanies.map((company, index) => (
          <div
            key={index}
            className="flex justify-between items-center py-2 px-2 hover:bg-gray-50 rounded transition-colors duration-200"
          >
            <span className="text-gray-700 font-medium">
              {index + 1}. {company.name}
            </span>
            <span className="text-gray-400 text-sm">
              {company.postings} postings
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
