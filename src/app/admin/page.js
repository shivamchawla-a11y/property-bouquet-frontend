"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  Building2,
  Users,
  MessageSquare,
  TrendingUp,
  Clock3,
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

  // ============================================================
  // USER
  // ============================================================

  const [user, setUser] = useState(null);

  // ============================================================
  // DASHBOARD DATA
  // ============================================================

  const [recentProperties, setRecentProperties] = useState([]);
  const [leadChartData, setLeadChartData] = useState([]);
  const [propertyChartData, setPropertyChartData] = useState([]);
  const [activities, setActivities] = useState([]);

  // ============================================================
  // STATS
  // ============================================================

  const [stats, setStats] = useState([]);

  // ============================================================
  // FETCH DASHBOARD DATA
  // ============================================================

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // ======================================================
        // TOKEN
        // ======================================================

        const token = localStorage.getItem("token");

        if (!token) {
          router.push("/login");
          return;
        }

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        // ======================================================
        // FIRST: GET CURRENT USER
        // ======================================================

        const userRes = await fetch("/api/auth/me", {
          headers,
          credentials: "include",
        });

        const userData = await userRes.json();

        if (!userRes.ok || !userData?.user) {
          localStorage.removeItem("token");
          router.push("/login");
          return;
        }

        // ======================================================
        // SET USER
        // ======================================================

        const currentUser = userData.user;

        setUser(currentUser);

        const isSuperAdmin =
          currentUser?.role === "SuperAdmin";

        // ======================================================
        // PROPERTY DATA
        // AVAILABLE TO ALL AUTHENTICATED ADMINS
        // ======================================================

        const propertiesRes = await fetch(
          "/api/properties?all=true",
          {
            headers,
            credentials: "include",
          }
        );

        if (!propertiesRes.ok) {
          throw new Error("Failed to fetch properties");
        }

        const propertiesData =
          await propertiesRes.json();

        const allProperties =
          propertiesData?.data || [];

        // ======================================================
        // PUBLISHED PROPERTIES
        // ======================================================

        const publishedProperties =
          allProperties.filter(
            (property) =>
              property.status === "published"
          );

        // ======================================================
        // SUPER ADMIN DATA
        //
        // Agents DO NOT request these APIs.
        // ======================================================

        let allUsers = [];
        let allLeads = [];

        if (isSuperAdmin) {
          const [usersRes, leadsRes] =
            await Promise.all([
              fetch("/api/auth/users", {
                headers,
                credentials: "include",
              }),

              fetch("/api/leads", {
                headers,
                credentials: "include",
              }),
            ]);

          // ----------------------------------------------------
          // USERS
          // ----------------------------------------------------

          if (usersRes.ok) {
            const usersData =
              await usersRes.json();

            allUsers =
              usersData?.data || [];
          }

          // ----------------------------------------------------
          // LEADS
          // ----------------------------------------------------

          if (leadsRes.ok) {
            const leadsData =
              await leadsRes.json();

            allLeads =
              leadsData?.data || [];
          }
        }

        // ======================================================
        // PROPERTY LOCATION GRAPH
        //
        // AVAILABLE TO ALL ADMINS
        // ======================================================

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
            .sort(
              (a, b) =>
                b.value - a.value
            )
            .slice(0, 8);

        setPropertyChartData(
          locationGraph
        );

        // ======================================================
        // RECENT PROPERTIES
        //
        // AVAILABLE TO ALL ADMINS
        // ======================================================

        const sortedProperties =
          [...allProperties]
            .sort(
              (a, b) =>
                new Date(b.createdAt) -
                new Date(a.createdAt)
            )
            .slice(0, 5);

        setRecentProperties(
          sortedProperties
        );

        // ======================================================
        // BASE ACTIVITY
        //
        // Property activity is visible to all admins.
        // ======================================================

        const activityFeed = [];

        // ------------------------------------------------------
        // RECENT PROPERTIES
        // ------------------------------------------------------

        allProperties.forEach(
          (property) => {
            activityFeed.push({
              type: "property",
              title: `Property "${
                property.coreDetails?.title ||
                property.title ||
                "Untitled Property"
              }" added`,
              subtitle:
                property.locationData
                  ?.locationName ||
                property.locationData
                  ?.customLocation ||
                "Unknown Location",
              createdAt:
                property.createdAt,
            });
          }
        );

        // ======================================================
        // SUPER ADMIN ONLY ACTIVITY
        // ======================================================

        if (isSuperAdmin) {
          // ----------------------------------------------------
          // RECENT LEADS
          // ----------------------------------------------------

          allLeads.forEach((lead) => {
            activityFeed.push({
              type: "lead",
              title: "New enquiry received",
              subtitle:
                lead.name ||
                lead.fullName ||
                lead.email ||
                "New Lead",
              createdAt:
                lead.createdAt,
            });
          });

          // ----------------------------------------------------
          // RECENT USERS
          // ----------------------------------------------------

          allUsers.forEach(
            (registeredUser) => {
              activityFeed.push({
                type: "user",
                title:
                  "New user registered",
                subtitle:
                  registeredUser.name ||
                  registeredUser.email ||
                  "New User",
                createdAt:
                  registeredUser.createdAt,
              });
            }
          );
        }

        // ======================================================
        // SORT ACTIVITY
        // ======================================================

        activityFeed.sort(
          (a, b) =>
            new Date(b.createdAt) -
            new Date(a.createdAt)
        );

        setActivities(
          activityFeed.slice(0, 8)
        );

        // ======================================================
        // SUPER ADMIN ONLY:
        // LEADS BY MONTH
        // ======================================================

        if (isSuperAdmin) {
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
            if (!lead.createdAt) return;

            const monthIndex =
              new Date(
                lead.createdAt
              ).getMonth();

            monthlyLeads[monthIndex] =
              (monthlyLeads[monthIndex] ||
                0) + 1;
          });

          const leadGraph =
            monthNames
              .map(
                (month, index) => ({
                  name: month,
                  value:
                    monthlyLeads[index] ||
                    0,
                })
              )
              .filter(
                (item) =>
                  item.value > 0
              );

          setLeadChartData(
            leadGraph
          );
        } else {
          setLeadChartData([]);
        }

        // ======================================================
        // STATS
        // ======================================================

        const baseStats = [
          {
            title: "Total Properties",
            value: allProperties.length,
            icon: Building2,
          },

          {
            title: "Published Properties",
            value:
              publishedProperties.length,
            icon: Building2,
          },
        ];

        // ======================================================
        // SUPER ADMIN ONLY STATS
        // ======================================================

        if (isSuperAdmin) {
          baseStats.push(
            {
              title: "Total Users",
              value: allUsers.length,
              icon: Users,
            },

            {
              title: "Total Leads",
              value: allLeads.length,
              icon: MessageSquare,
            }
          );
        }

        setStats(baseStats);
      } catch (err) {
        console.error(
          "Dashboard error:",
          err
        );

        localStorage.removeItem("token");
        router.push("/login");
      }
    };

    fetchDashboardData();
  }, [router]);

  // ============================================================
  // ROLE
  // ============================================================

  const isSuperAdmin =
    user?.role === "SuperAdmin";

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="space-y-6 text-gray-800">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="flex justify-between items-center">

        <div>
          <h1 className="text-3xl font-bold text-primary">
            Dashboard
          </h1>

          <p className="text-gray-500">
            Welcome back,{" "}
            {user?.name || "Admin"} 👋
          </p>
        </div>

        {/* ====================================================
            PROFILE SECTION
        ==================================================== */}

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
              {user?.name
                ?.charAt(0)
                ?.toUpperCase() || "A"}
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
                localStorage.removeItem(
                  "token"
                );

                router.push("/login");
              }}
              className="ml-3 text-xs text-red-500 hover:underline"
            >
              Logout
            </button>

          </div>
        </div>
      </div>

      {/* ======================================================
          STATS
      ====================================================== */}

      <div
        className={`grid grid-cols-1 md:grid-cols-2 ${
          isSuperAdmin
            ? "xl:grid-cols-4"
            : "xl:grid-cols-2"
        } gap-6`}
      >

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

      {/* ======================================================
          CHARTS
      ====================================================== */}

      <div
        className={`grid grid-cols-1 ${
          isSuperAdmin
            ? "lg:grid-cols-2"
            : ""
        } gap-6`}
      >

        {/* ====================================================
            SUPER ADMIN ONLY:
            ENQUIRIES GROWTH
        ==================================================== */}

        {isSuperAdmin && (
          <div className="bg-white p-6 rounded-xl shadow-card">

            <h2 className="text-lg font-semibold text-primary mb-4">
              Enquiries Growth
            </h2>

            <ResponsiveContainer
              width="100%"
              height={250}
            >
              <LineChart
                data={leadChartData}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="name"
                />

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
        )}

        {/* ====================================================
            PROPERTY LOCATION
            AVAILABLE TO ALL ADMINS
        ==================================================== */}

        <div className="bg-white p-6 rounded-xl shadow-card">

          <h2 className="text-lg font-semibold text-primary mb-4">
            Properties by Location
          </h2>

          <ResponsiveContainer
            width="100%"
            height={250}
          >
            <BarChart
              data={propertyChartData}
            >

              <XAxis
                dataKey="name"
              />

              <Tooltip />

              <Bar
                dataKey="value"
                fill="#C9A24D"
                radius={[
                  6,
                  6,
                  0,
                  0,
                ]}
              />

            </BarChart>
          </ResponsiveContainer>

        </div>

      </div>

      {/* ======================================================
          LOWER GRID
      ====================================================== */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ====================================================
            RECENT PROPERTIES
            AVAILABLE TO ALL ADMINS
        ==================================================== */}

        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-card">

          <h2 className="text-lg font-semibold text-primary mb-4">
            Recent Properties
          </h2>

          <div className="space-y-4">

            {recentProperties.length > 0 ? (
              recentProperties.map(
                (property) => (
                  <div
                    key={property._id}
                    className="flex justify-between items-center border-b pb-2"
                  >

                    <span className="font-medium text-gray-800">
                      {property
                        ?.coreDetails
                        ?.title ||
                        property?.title ||
                        "Untitled Property"}
                    </span>

                    <span className="text-sm text-gray-500 capitalize">
                      {property?.status ||
                        "draft"}
                    </span>

                  </div>
                )
              )
            ) : (
              <p className="text-sm text-gray-400">
                No properties found.
              </p>
            )}

          </div>

        </div>

        {/* ====================================================
            QUICK ACTIONS
        ==================================================== */}

        <div className="bg-white p-6 rounded-xl shadow-card">

          <h2 className="text-lg font-semibold text-primary mb-4">
            Quick Actions
          </h2>

          <div className="space-y-3">

            {/* ================================================
                ALL ADMINS
            ================================================= */}

            <button
              onClick={() =>
                router.push(
                  "/admin/add-property"
                )
              }
              className="w-full bg-primary text-white py-2 rounded-lg hover:bg-secondary transition"
            >
              + Add Property
            </button>

            {/* ================================================
                SUPER ADMIN ONLY:
                LEADS
            ================================================= */}

            {isSuperAdmin && (
              <button
                onClick={() =>
                  router.push(
                    "/admin/leads"
                  )
                }
                className="w-full bg-gold text-black py-2 rounded-lg hover:bg-goldLight transition"
              >
                View Enquiries
              </button>
            )}

            {/* ================================================
                SUPER ADMIN ONLY:
                USER MANAGEMENT
            ================================================= */}

            {isSuperAdmin && (
              <button
                onClick={() =>
                  router.push(
                    "/admin/site-settings/team"
                  )
                }
                className="w-full border text-gray-800 py-2 rounded-lg hover:bg-gray-100 transition"
              >
                Manage Users
              </button>
            )}

          </div>
        </div>
      </div>

      {/* ======================================================
          RECENT ACTIVITY
      ====================================================== */}

      <div className="bg-white p-6 rounded-xl shadow-card">

        <h2 className="text-lg font-semibold text-primary mb-4">
          Recent Activity
        </h2>

        <div className="space-y-4">

          {activities.length > 0 ? (
            activities.map(
              (activity, index) => {

                let Icon = Clock3;
                let bg =
                  "bg-gray-100";
                let color =
                  "text-gray-600";

                // ============================================
                // PROPERTY
                // ============================================

                if (
                  activity.type ===
                  "property"
                ) {
                  Icon = Building2;
                  bg = "bg-blue-100";
                  color =
                    "text-blue-600";
                }

                // ============================================
                // LEAD
                // SUPER ADMIN ONLY
                // ============================================

                if (
                  activity.type ===
                  "lead"
                ) {
                  Icon =
                    MessageSquare;
                  bg = "bg-green-100";
                  color =
                    "text-green-600";
                }

                // ============================================
                // USER
                // SUPER ADMIN ONLY
                // ============================================

                if (
                  activity.type ===
                  "user"
                ) {
                  Icon = Users;
                  bg =
                    "bg-yellow-100";
                  color =
                    "text-yellow-700";
                }

                return (
                  <div
                    key={index}
                    className="flex items-start gap-3 border-b last:border-b-0 pb-3"
                  >

                    <div
                      className={`w-10 h-10 rounded-full ${bg} flex items-center justify-center`}
                    >
                      <Icon
                        className={`${color}`}
                        size={18}
                      />
                    </div>

                    <div className="flex-1">

                      <p className="font-medium text-gray-800">
                        {activity.title}
                      </p>

                      <p className="text-sm text-gray-500">
                        {activity.subtitle}
                      </p>

                      <p className="text-xs text-gray-400 mt-1">
                        {activity.createdAt
                          ? new Date(
                              activity.createdAt
                            ).toLocaleString()
                          : "Recently"}
                      </p>

                    </div>

                  </div>
                );
              }
            )
          ) : (
            <p className="text-sm text-gray-400">
              No recent activity.
            </p>
          )}

        </div>

      </div>

    </div>
  );
}
