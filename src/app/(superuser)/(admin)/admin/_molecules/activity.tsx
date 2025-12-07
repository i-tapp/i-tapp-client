// src/components/_molecules/activity.tsx
const activities = [
  { text: "New student registered", time: "Just now" },
  { text: "Company profile updated", time: "2 hours ago" },
  { text: "New opportunity posted", time: "Yesterday" },
];

export default function Activity() {
  return (
    <div className="flex flex-col border rounded-xl p-4 bg-white shadow-sm">
      <h4 className="font-semibold text-xl mb-3">Recent Activity</h4>

      <div className="flex flex-col divide-y divide-gray-200">
        {activities.map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-center py-2 px-2 hover:bg-gray-50 rounded transition-colors duration-200"
          >
            <span className="text-gray-700">
              {index + 1}. {item.text}
            </span>
            <span className="text-gray-400 text-sm">{item.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
