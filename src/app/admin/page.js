"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  Building2,
  Users,
  MessageSquare,
  TrendingUp,
} from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

export default function AdminDashboard() {
  const router = useRouter();

  // 🔥 USER STATE
  const [user, setUser] = useState(null);
  const [recentProperties, setRecentProperties] = useState([]);

  const [leadChartData, setLeadChartData] =
  useState([]);

const [propertyChartData, setPropertyChartData] =
  useState([]);

  // 🔥 STATES (for future real API)
  const [stats, setStats] = useState([
  {
    title: "Total Properties",
    value: 0,
    icon: Building2,
  },
  {
    title: "Published Properties",
    value: 0,
    icon: Building2,
  },
  {
    title: "Total Users",
    value: 0,
    icon: Users,
  },
  {
    title: "Total Leads",
    value: 0,
    icon: MessageSquare,
  },
]);
  // 🔥 FETCH USER
  useEffect(() => {
  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [
        userRes,
        propertiesRes,
        usersRes,
        leadsRes,
      ] = await Promise.all([
        fetch(
          "https://property-bouquet-backend.onrender.com/api/auth/me",
          { headers }
        ),
        fetch(
          "https://property-bouquet-backend.onrender.com/api/properties?all=true"
        ),
        fetch(
          "https://property-bouquet-backend.onrender.com/api/auth/users",
          { headers }
        ),
        fetch(
          "https://property-bouquet-backend.onrender.com/api/leads",
          { headers }
        ),
      ]);

      const userData = await userRes.json();
      const propertiesData =
        await propertiesRes.json();
      const usersData = await usersRes.json();
      const leadsData = await leadsRes.json();

      if (!userRes.ok) {
        router.push("/login");
        return;
      }

      setUser(userData.user);

      const allProperties =
        propertiesData?.data || [];

      const publishedProperties =
        allProperties.filter(
          (property) =>
            property.status === "published"
        );

      const allUsers =
        usersData?.data || [];

      const allLeads =
        leadsData?.data || [];

// ========================================
// LEADS BY MONTH (SORTED)
// ========================================

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const monthlyLeads = {};

allLeads.forEach((lead) => {
  const monthIndex = new Date(
    lead.createdAt
  ).getMonth();

  monthlyLeads[monthIndex] =
    (monthlyLeads[monthIndex] || 0) + 1;
});

const leadGraph = monthNames
  .map((month, index) => ({
    name: month,
    value: monthlyLeads[index] || 0,
  }))
  .filter((item) => item.value > 0);

setLeadChartData(leadGraph);

// ========================================
// PROPERTIES BY LOCATION
// ========================================

const locationMap = {};

allProperties.forEach((property) => {
  const location =
    property?.locationData
      ?.locationName ||
    property?.locationData
      ?.customLocation ||
    "Unknown";

  locationMap[location] =
    (locationMap[location] || 0) + 1;
});

const locationGraph =
  Object.entries(locationMap)
    .map(([name, value]) => ({
      name,
      value,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

setPropertyChartData(locationGraph);

      setStats([
        {
          title: "Total Properties",
          value: allProperties.length,
          icon: Building2,
        },
        {
          title: "Published Properties",
          value: publishedProperties.length,
          icon: Building2,
        },
        {
          title: "Total Users",
          value: allUsers.length,
          icon: Users,
        },
        {
          title: "Total Leads",
          value: allLeads.length,
          icon: MessageSquare,
        },
      ]);

      setRecentProperties(
        [...allProperties]
          .sort(
            (a, b) =>
              new Date(b.createdAt) -
              new Date(a.createdAt)
          )
          .slice(0, 5)
      );
    } catch (err) {
      console.error(err);
      router.push("/login");
    }
  };

  fetchDashboardData();
}, [router]);


  return (
    <div className="space-y-6 text-gray-800">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">
            Dashboard
          </h1>

          <p className="text-gray-500">
            Welcome back, {user?.name || "Admin"} 👋
          </p>
        </div>

        {/* PROFILE SECTION */}
        <div className="flex items-center gap-4">

          {/* SEARCH */}
          <input
            placeholder="Search..."
            className="border bg-white text-gray-800 px-3 py-1.5 rounded-lg outline-none focus:ring-2 focus:ring-primary text-sm"
          />

          {/* USER CARD */}
          <div className="flex items-center gap-3 bg-gray-100 px-3 py-2 rounded-lg">

            {/* AVATAR */}
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || "A"}
            </div>

            {/* NAME + ROLE */}
            <div className="text-sm leading-tight">
              <p className="font-semibold text-gray-800">
                {user?.name || "Admin"}
              </p>

              <p className="text-gray-500 text-xs">
                {user?.role || "Role"}
              </p>
            </div>

            {/* LOGOUT */}
            <button
              onClick={() => {
                localStorage.removeItem("token");
                router.push("/login");
              }}
              className="ml-3 text-xs text-red-500 hover:underline"
            >
              Logout
            </button>

          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-card hover:shadow-xl transition duration-300 border border-gray-100"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-500 text-sm">
                    {item.title}
                  </p>

                  <h2 className="text-2xl font-bold text-primary mt-1">
                    {item.value}
                  </h2>
                </div>

                <div className="bg-primary/10 p-3 rounded-xl">
                  <Icon className="text-primary" />
                </div>
              </div>

              <div className="flex items-center gap-1 mt-4 text-green-600 text-sm">
                <TrendingUp size={14} />
                Live Database
              </div>
            </div>
          );
        })}
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="bg-white p-6 rounded-xl shadow-card">
  <h2 className="text-lg font-semibold text-primary mb-4">
    Enquiries Growth
  </h2>

  <ResponsiveContainer width="100%" height={250}>
    <LineChart data={leadChartData}>
      <CartesianGrid strokeDasharray="3 3" />

      <XAxis dataKey="name" />

      <YAxis />

      <Tooltip />

      <Line
        type="monotone"
        dataKey="value"
        stroke="#0E4F3A"
        strokeWidth={3}
        dot={{ r: 5 }}
        activeDot={{ r: 8 }}
      />
    </LineChart>
  </ResponsiveContainer>
</div>
        <div className="bg-white p-6 rounded-xl shadow-card">
          <h2 className="text-lg font-semibold text-primary mb-4">
            Properties by Location
          </h2>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={propertyChartData}>
              <XAxis dataKey="name" />
              <Tooltip />

              <Bar
                dataKey="value"
                fill="#C9A24D"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* LOWER GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-card">
          <h2 className="text-lg font-semibold text-primary mb-4">
            Recent Properties
          </h2>

          <div className="space-y-4">
            {recentProperties.map((property) => (
  <div
    key={property._id}
    className="flex justify-between items-center border-b pb-2"
  >
    <span className="font-medium text-gray-800">
      {property?.coreDetails?.title}
    </span>

    <span className="text-sm text-gray-500 capitalize">
      {property?.status || "draft"}
    </span>
  </div>
))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-card">
          <h2 className="text-lg font-semibold text-primary mb-4">
            Quick Actions
          </h2>

          <div className="space-y-3">
            <button
              onClick={() => router.push("/admin/add-property")}
              className="w-full bg-primary text-white py-2 rounded-lg hover:bg-secondary transition"
            >
              + Add Property
            </button>

            <button
              onClick={() => router.push("/admin/leads")}
              className="w-full bg-gold text-black py-2 rounded-lg hover:bg-goldLight transition"
            >
              View Enquiries
            </button>

            <button
              onClick={() => router.push("/admin/site-settings/team")}
              className="w-full border text-gray-800 py-2 rounded-lg hover:bg-gray-100 transition"
            >
              Manage Users
            </button>
          </div>
        </div>
      </div>

      {/* ACTIVITY */}
      <div className="bg-white p-6 rounded-xl shadow-card">
        <h2 className="text-lg font-semibold text-primary mb-4">
          Recent Activity
        </h2>

        <ul className="space-y-3 text-gray-600 text-sm">
          <li>✔ New property added in Gurgaon</li>
          <li>✔ User registered</li>
          <li>✔ Enquiry received for Delhi villa</li>
          <li>✔ Property marked as sold</li>
        </ul>
      </div>
    </div>
  );
}