import Activity from "./_molecules/activity";
import RecentOpportunities from "./_molecules/recent-opportunities";
import SummaryCard from "./_molecules/summary-card";
import TopCompanies from "./_molecules/top-companies";

const summaryItems = [
  {
    title: "Total Students",
    number: 2000,
    component: "+20 this week",
    data: [1800, 1850, 1900, 1950, 2000],
  },
  {
    title: "Total Companies",
    number: 350,
    component: "+5 this week",
    data: [300, 310, 320, 340, 350],
  },
  {
    title: "Pending Company approvals",
    number: 1200,
    component: "50 new this week",
    data: [1100, 1120, 1150, 1180, 1200],
  },
  {
    title: "Total Opportunities",
    number: 1200,
    component: "50 new this week",
    data: [1100, 1120, 1150, 1180, 1200],
  },
  // {
  //   title: "Total Applications",
  //   number: 4500,
  //   component: "200 new this week",
  //   data: [4000, 4100, 4200, 4350, 4500],
  // },
  // {
  //   title: "Messages",
  //   number: 150,
  //   component: "10 unread",
  //   data: [120, 130, 140, 145, 150],
  // },
];

export default function Admin() {
  return (
    <div className="flex flex-col gap-8 p-6">
      <h1 className="text-3xl font-bold">Dashboard Overview</h1>

      {/* Summary Cards */}
      <div className="flex flex-wrap gap-3">
        {summaryItems.map((item) => (
          <SummaryCard
            key={item.title}
            title={item.title}
            number={item.number}
            component={item.component}
            data={item.data}
          />
        ))}
      </div>

      {/* Recent Activity + Other Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Activity />
        <RecentOpportunities />
        <TopCompanies />
      </div>
    </div>
  );
}
