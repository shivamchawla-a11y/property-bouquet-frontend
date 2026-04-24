export default function AdminDashboard() {
  const stats = [
    { title: "Total Properties", value: "120" },
    { title: "Active Listings", value: "95" },
    { title: "Users", value: "350" },
    { title: "Enquiries", value: "45" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary mb-6">
        Dashboard Overview
      </h1>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
          >
            <h2 className="text-gray-500">{item.title}</h2>
            <p className="text-3xl font-bold text-primary mt-2">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* RECENT ACTIVITY */}
      <div className="mt-10 bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold text-primary mb-4">
          Recent Activity
        </h2>

        <ul className="space-y-3 text-gray-600">
          <li>New property added</li>
          <li>User registered</li>
          <li>New enquiry received</li>
        </ul>
      </div>
    </div>
  );
}