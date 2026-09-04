"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
  Building2,
  Users,
  MessageSquare,
  TrendingUp,
  Clock3,
  Plus,
  ArrowUpRight,
  CalendarDays,
  UserRound,
  ShieldCheck,
  Activity,
  Layers3,
  ChevronRight,
  Sparkles,
  Eye,
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
  // SUPER ADMIN DATA
  // ============================================================

  const [allUsersData, setAllUsersData] = useState([]);
  const [allPropertiesData, setAllPropertiesData] = useState([]);

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
          cache: "no-store",
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
            cache: "no-store",
          }
        );

        if (!propertiesRes.ok) {
          throw new Error(
            "Failed to fetch properties"
          );
        }

        const propertiesData =
          await propertiesRes.json();

        const allProperties =
          propertiesData?.data || [];

        setAllPropertiesData(allProperties);

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
                cache: "no-store",
              }),

              fetch("/api/leads", {
                headers,
                credentials: "include",
                cache: "no-store",
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

            setAllUsersData(allUsers);
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

              // ================================================
              // CREATOR
              // ================================================

              actor:
                property?.createdBy ||
                property?.createdByUser ||
                property?.createdByName ||
                null,
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

              title:
                "New enquiry received",

              subtitle:
                lead.name ||
                lead.fullName ||
                lead.email ||
                "New Lead",

              createdAt:
                lead.createdAt,

              actor:
                lead?.createdBy ||
                lead?.createdByUser ||
                lead?.createdByName ||
                lead?.assignedBy ||
                null,
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

                actor:
                  registeredUser?.createdBy ||
                  registeredUser?.createdByUser ||
                  registeredUser?.createdByName ||
                  null,
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
            description:
              "All property records",
            type: "property",
          },

          {
            title: "Published Properties",
            value:
              publishedProperties.length,
            icon: Eye,
            description:
              "Currently published",
            type: "published",
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
              description:
                "Registered dashboard users",
              type: "users",
            },

            {
              title: "Total Leads",
              value: allLeads.length,
              icon: MessageSquare,
              description:
                "All enquiries received",
              type: "leads",
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
  // DATE HELPERS
  // ============================================================

  const getPropertyCreatorId = (property) => {
    if (!property?.createdBy) {
      return null;
    }

    if (
      typeof property.createdBy ===
      "object"
    ) {
      return (
        property.createdBy?._id ||
        property.createdBy?.id ||
        null
      );
    }

    return property.createdBy;
  };

  const getUserId = (account) => {
    if (!account) return null;

    return (
      account?._id ||
      account?.id ||
      null
    );
  };

  // ============================================================
  // ACTOR NAME HELPER
  //
  // Supports:
  // createdBy: Object
  // createdBy: ID
  // createdByName: String
  // ============================================================

  const getActorName = (actor) => {
    if (!actor) {
      return null;
    }

    if (
      typeof actor === "string"
    ) {
      // If only an ID exists, try to find the
      // matching user from SuperAdmin user data.
      const matchingUser =
        allUsersData.find(
          (account) =>
            String(
              getUserId(account)
            ) === String(actor)
        );

      return (
        matchingUser?.name ||
        matchingUser?.fullName ||
        matchingUser?.username ||
        matchingUser?.email ||
        null
      );
    }

    if (
      typeof actor === "object"
    ) {
      return (
        actor?.name ||
        actor?.fullName ||
        actor?.username ||
        actor?.email ||
        null
      );
    }

    return null;
  };

  // ============================================================
  // CURRENT USER NAME
  // ============================================================

  const currentUserName =
    user?.name ||
    user?.fullName ||
    user?.username ||
    user?.email ||
    "Admin";

  // ============================================================
  // CURRENT USER PROPERTY ACTIVITY
  //
  // USED BY BOTH:
  // AGENT + SUPER ADMIN
  // ============================================================

  const getStartOfToday = () => {
    const now = new Date();

    return new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
  };

  const getStartOfDaysAgo = (days) => {
    const start = getStartOfToday();

    start.setDate(
      start.getDate() - days
    );

    return start;
  };

  const getStartOfMonth = () => {
    const now = new Date();

    return new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    );
  };

  const countPropertiesBetween = (
    properties,
    startDate
  ) => {
    return properties.filter((property) => {
      if (!property?.createdAt) {
        return false;
      }

      return (
        new Date(property.createdAt) >=
        startDate
      );
    }).length;
  };

  const currentUserPropertyStats =
    useMemo(() => {
      if (!user) {
        return {
          today: 0,
          twoDays: 0,
          threeDays: 0,
          sevenDays: 0,
          month: 0,
          total: 0,
        };
      }

      const currentUserId =
        String(
          getUserId(user)
        );

      const myProperties =
        allPropertiesData.filter(
          (property) =>
            String(
              getPropertyCreatorId(
                property
              )
            ) === currentUserId
        );

      return {
        today: countPropertiesBetween(
          myProperties,
          getStartOfToday()
        ),

        twoDays: countPropertiesBetween(
          myProperties,
          getStartOfDaysAgo(1)
        ),

        threeDays: countPropertiesBetween(
          myProperties,
          getStartOfDaysAgo(2)
        ),

        sevenDays: countPropertiesBetween(
          myProperties,
          getStartOfDaysAgo(6)
        ),

        month: countPropertiesBetween(
          myProperties,
          getStartOfMonth()
        ),

        total: myProperties.length,
      };
    }, [
      user,
      allPropertiesData,
    ]);

  // ============================================================
  // SUPER ADMIN:
  // AGENT PERFORMANCE
  // ============================================================

  const agentPerformance =
    useMemo(() => {
      if (!isSuperAdmin) {
        return [];
      }

      const agents =
        allUsersData.filter(
          (account) =>
            account?.role === "Agent"
        );

      return agents
        .map((agent) => {
          const agentId =
            getUserId(agent);

          const agentProperties =
            allPropertiesData.filter(
              (property) =>
                String(
                  getPropertyCreatorId(
                    property
                  )
                ) ===
                String(agentId)
            );

          return {
            id: agentId,

            name:
              agent?.name ||
              agent?.fullName ||
              agent?.username ||
              agent?.email ||
              "Unknown Agent",

            email:
              agent?.email ||
              "",

            today:
              countPropertiesBetween(
                agentProperties,
                getStartOfToday()
              ),

            twoDays:
              countPropertiesBetween(
                agentProperties,
                getStartOfDaysAgo(1)
              ),

            threeDays:
              countPropertiesBetween(
                agentProperties,
                getStartOfDaysAgo(2)
              ),

            sevenDays:
              countPropertiesBetween(
                agentProperties,
                getStartOfDaysAgo(6)
              ),

            month:
              countPropertiesBetween(
                agentProperties,
                getStartOfMonth()
              ),

            total:
              agentProperties.length,
          };
        })
        .sort(
          (a, b) =>
            b.month - a.month ||
            b.total - a.total ||
            a.name.localeCompare(
              b.name
            )
        );
    }, [
      isSuperAdmin,
      allUsersData,
      allPropertiesData,
    ]);

  // ============================================================
  // TOTAL AGENT PROPERTY COUNTS
  // ============================================================

  const agentSummary =
    useMemo(() => {
      return {
        today:
          agentPerformance.reduce(
            (sum, agent) =>
              sum + agent.today,
            0
          ),

        twoDays:
          agentPerformance.reduce(
            (sum, agent) =>
              sum + agent.twoDays,
            0
          ),

        threeDays:
          agentPerformance.reduce(
            (sum, agent) =>
              sum + agent.threeDays,
            0
          ),

        sevenDays:
          agentPerformance.reduce(
            (sum, agent) =>
              sum + agent.sevenDays,
            0
          ),

        month:
          agentPerformance.reduce(
            (sum, agent) =>
              sum + agent.month,
            0
          ),
      };
    }, [agentPerformance]);

  // ============================================================
  // STAT CARD STYLES
  // ============================================================

  const statStyles = [
    {
      iconBg:
        "bg-[#0f3b2e]/10",
      iconColor:
        "text-[#0f3b2e]",
      accent:
        "from-[#0f3b2e]/10",
    },

    {
      iconBg:
        "bg-emerald-100",
      iconColor:
        "text-emerald-700",
      accent:
        "from-emerald-100",
    },

    {
      iconBg:
        "bg-blue-100",
      iconColor:
        "text-blue-700",
      accent:
        "from-blue-100",
    },

    {
      iconBg:
        "bg-amber-100",
      iconColor:
        "text-amber-700",
      accent:
        "from-amber-100",
    },
  ];

  // ============================================================
  // PROPERTY ACTIVITY CARD COMPONENT
  // ============================================================

  const PropertyActivitySection = ({
    superAdmin = false,
  }) => {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-7">

        {/* ====================================================
            HEADER
        ==================================================== */}

        <div className="px-6 py-5 border-b border-gray-100">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

            <div>

              <div className="flex items-center gap-2">

                <div className="h-9 w-9 rounded-xl bg-[#0f3b2e]/10 text-[#0f3b2e] flex items-center justify-center">
                  <Activity size={18} />
                </div>

                <h2 className="text-lg font-bold text-[#0f3b2e]">
                  {superAdmin
                    ? "My Property Activity"
                    : "My Property Activity"}
                </h2>

              </div>

              <p className="text-xs text-gray-500 mt-1.5 ml-11">
                {superAdmin
                  ? "Track the properties you've personally added as Super Admin."
                  : "Track the properties you've added over different time periods."}
              </p>

            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">

              <CalendarDays
                size={14}
              />

              Property creation activity

            </div>

          </div>

        </div>

        {/* ====================================================
            PRODUCTIVITY CARDS
        ==================================================== */}

        <div className="p-5">

          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">

            {/* ==================================================
                TODAY
            ================================================== */}

            <div className="rounded-2xl bg-[#0f3b2e] text-white p-4 shadow-sm">

              <p className="text-[11px] uppercase tracking-wider font-semibold text-white/60">
                Today
              </p>

              <p className="text-3xl font-extrabold mt-2">
                {
                  currentUserPropertyStats.today
                }
              </p>

              <p className="text-[11px] text-white/60 mt-1">
                Added today
              </p>

            </div>

            {/* ==================================================
                2 DAYS
            ================================================== */}

            <div className="rounded-2xl bg-gray-50 border border-gray-200 p-4">

              <p className="text-[11px] uppercase tracking-wider font-semibold text-gray-500">
                2 Days
              </p>

              <p className="text-3xl font-extrabold text-[#0f3b2e] mt-2">
                {
                  currentUserPropertyStats.twoDays
                }
              </p>

              <p className="text-[11px] text-gray-400 mt-1">
                Last 2 days
              </p>

            </div>

            {/* ==================================================
                3 DAYS
            ================================================== */}

            <div className="rounded-2xl bg-gray-50 border border-gray-200 p-4">

              <p className="text-[11px] uppercase tracking-wider font-semibold text-gray-500">
                3 Days
              </p>

              <p className="text-3xl font-extrabold text-[#0f3b2e] mt-2">
                {
                  currentUserPropertyStats.threeDays
                }
              </p>

              <p className="text-[11px] text-gray-400 mt-1">
                Last 3 days
              </p>

            </div>

            {/* ==================================================
                7 DAYS
            ================================================== */}

            <div className="rounded-2xl bg-gray-50 border border-gray-200 p-4">

              <p className="text-[11px] uppercase tracking-wider font-semibold text-gray-500">
                7 Days
              </p>

              <p className="text-3xl font-extrabold text-[#0f3b2e] mt-2">
                {
                  currentUserPropertyStats.sevenDays
                }
              </p>

              <p className="text-[11px] text-gray-400 mt-1">
                Last 7 days
              </p>

            </div>

            {/* ==================================================
                MONTH
            ================================================== */}

            <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4">

              <p className="text-[11px] uppercase tracking-wider font-semibold text-amber-700">
                This Month
              </p>

              <p className="text-3xl font-extrabold text-amber-700 mt-2">
                {
                  currentUserPropertyStats.month
                }
              </p>

              <p className="text-[11px] text-amber-600/70 mt-1">
                Current month
              </p>

            </div>

            {/* ==================================================
                ALL TIME
            ================================================== */}

            <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4">

              <p className="text-[11px] uppercase tracking-wider font-semibold text-emerald-700">
                All Time
              </p>

              <p className="text-3xl font-extrabold text-emerald-700 mt-2">
                {
                  currentUserPropertyStats.total
                }
              </p>

              <p className="text-[11px] text-emerald-600/70 mt-1">
                Total added
              </p>

            </div>

          </div>

          {/* ====================================================
              PERSONAL SUMMARY
          ==================================================== */}

          <div className="mt-4 rounded-2xl border border-[#0f3b2e]/10 bg-[#0f3b2e]/[0.025] p-4">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

              <div className="flex items-center gap-3">

                <div className="h-10 w-10 rounded-xl bg-[#0f3b2e] text-white flex items-center justify-center">
                  {isSuperAdmin ? (
                    <ShieldCheck
                      size={18}
                    />
                  ) : (
                    <UserRound
                      size={18}
                    />
                  )}
                </div>

                <div>

                  <p className="text-sm font-bold text-gray-800">
                    {currentUserName}
                  </p>

                  <p className="text-[11px] text-gray-400">
                    {isSuperAdmin
                      ? "Super Admin property contribution"
                      : "Your property contribution"}
                  </p>

                </div>

              </div>

              <div className="flex items-center gap-2">

                <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400">
                  This month
                </span>

                <span className="px-3 py-1.5 rounded-xl bg-[#0f3b2e] text-white text-xs font-extrabold">
                  {
                    currentUserPropertyStats.month
                  }{" "}
                  properties
                </span>

              </div>

            </div>

          </div>

        </div>

      </div>
    );
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="min-h-screen text-gray-800">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="mb-7">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

          {/* LEFT */}

          <div>

            <div className="flex items-center gap-3">

              <div className="h-11 w-11 rounded-2xl bg-[#0f3b2e] text-white flex items-center justify-center shadow-lg">
                <Layers3 size={21} />
              </div>

              <div>

                <h1 className="text-3xl font-extrabold text-[#0f3b2e] tracking-tight">
                  Dashboard
                </h1>

                <p className="text-sm text-gray-500 mt-0.5">
                  Welcome back,{" "}
                  <span className="font-semibold text-gray-700">
                    {currentUserName}
                  </span>
                  . Here's what's happening today.
                </p>

              </div>

            </div>

          </div>

          {/* ==================================================
              RIGHT PROFILE
          ================================================== */}

          <div className="flex items-center">

            <div className="relative flex items-center gap-3 bg-white border border-gray-200 rounded-2xl px-3 py-2.5 shadow-sm">

              {/* AVATAR */}

              <div className="relative">

                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0f3b2e] to-[#145240] text-white flex items-center justify-center font-bold shadow-md">
                  {currentUserName
                    ?.charAt(0)
                    ?.toUpperCase() ||
                    "A"}
                </div>

                <span className="absolute -right-0.5 -bottom-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />

              </div>

              {/* USER */}

              <div className="leading-tight pr-2">

                <p className="font-bold text-gray-800 text-sm">
                  {currentUserName}
                </p>

                <div className="flex items-center gap-2 mt-1">

                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isSuperAdmin
                        ? "bg-[#0f3b2e]/10 text-[#0f3b2e]"
                        : "bg-blue-50 text-blue-700"
                    }`}
                  >
                    {isSuperAdmin ? (
                      <ShieldCheck
                        size={10}
                      />
                    ) : (
                      <UserRound
                        size={10}
                      />
                    )}

                    {user?.role ||
                      "Admin"}
                  </span>

                  <span className="text-[10px] text-emerald-600 font-semibold">
                    Online
                  </span>

                </div>

              </div>

              {/* LOGOUT */}

              <button
                onClick={() => {
                  localStorage.removeItem(
                    "token"
                  );

                  router.push(
                    "/login"
                  );
                }}
                className="ml-1 px-3 py-2 rounded-xl text-xs font-bold text-red-500 hover:bg-red-50 transition"
              >
                Logout
              </button>

            </div>

          </div>

        </div>

      </div>

      {/* ======================================================
          STATS
      ====================================================== */}

      <div
        className={`grid grid-cols-1 sm:grid-cols-2 ${
          isSuperAdmin
            ? "xl:grid-cols-4"
            : "xl:grid-cols-2"
        } gap-5 mb-7`}
      >

        {stats.map((item, index) => {

          const Icon = item.icon;

          const style =
            statStyles[index] ||
            statStyles[0];

          return (
            <div
              key={index}
              className="group relative overflow-hidden bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
            >

              <div
                className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${style.accent} to-transparent`}
              />

              <div className="flex items-start justify-between">

                <div>

                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    {item.title}
                  </p>

                  <h2 className="text-3xl font-extrabold text-[#0f3b2e] mt-2">
                    {item.value.toLocaleString()}
                  </h2>

                  <p className="text-xs text-gray-400 mt-1">
                    {item.description}
                  </p>

                </div>

                <div
                  className={`h-12 w-12 rounded-2xl ${style.iconBg} ${style.iconColor} flex items-center justify-center group-hover:scale-105 transition`}
                >
                  <Icon size={22} />
                </div>

              </div>

              <div className="flex items-center gap-1.5 mt-5 text-xs font-semibold text-emerald-600">

                <span className="h-2 w-2 rounded-full bg-emerald-500" />

                Live Database

              </div>

            </div>
          );
        })}

      </div>

      {/* ======================================================
          AGENT PRODUCTIVITY
          AGENT ONLY
      ====================================================== */}

      {!isSuperAdmin && (
        <PropertyActivitySection />
      )}

      {/* ======================================================
          SUPER ADMIN:
          AGENT PERFORMANCE
      ====================================================== */}

      {isSuperAdmin && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-7">

          {/* HEADER */}

          <div className="px-6 py-5 border-b border-gray-100">

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

              <div>

                <div className="flex items-center gap-2">

                  <div className="h-9 w-9 rounded-xl bg-[#0f3b2e]/10 text-[#0f3b2e] flex items-center justify-center">
                    <Users size={18} />
                  </div>

                  <h2 className="text-lg font-bold text-[#0f3b2e]">
                    Agent Performance
                  </h2>

                </div>

                <p className="text-xs text-gray-500 mt-1.5 ml-11">
                  Monitor property creation activity across your agents.
                </p>

              </div>

              {/* SUMMARY */}

              <div className="flex flex-wrap gap-2">

                <div className="px-3 py-2 rounded-xl bg-[#0f3b2e]/5 border border-[#0f3b2e]/10">

                  <p className="text-[9px] uppercase font-bold tracking-wider text-gray-500">
                    Today
                  </p>

                  <p className="text-lg font-extrabold text-[#0f3b2e]">
                    {agentSummary.today}
                  </p>

                </div>

                <div className="px-3 py-2 rounded-xl bg-gray-50 border border-gray-200">

                  <p className="text-[9px] uppercase font-bold tracking-wider text-gray-500">
                    7 Days
                  </p>

                  <p className="text-lg font-extrabold text-[#0f3b2e]">
                    {agentSummary.sevenDays}
                  </p>

                </div>

                <div className="px-3 py-2 rounded-xl bg-amber-50 border border-amber-200">

                  <p className="text-[9px] uppercase font-bold tracking-wider text-amber-700">
                    Month
                  </p>

                  <p className="text-lg font-extrabold text-amber-700">
                    {agentSummary.month}
                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* ==================================================
              AGENT TABLE
          ================================================== */}

          {agentPerformance.length > 0 ? (
            <div className="overflow-x-auto">

              <table className="w-full min-w-[850px]">

                <thead className="bg-[#f7f9f8]">

                  <tr>

                    <th className="px-5 py-3 text-left text-[10px] uppercase tracking-wider font-extrabold text-gray-500">
                      Agent
                    </th>

                    <th className="px-4 py-3 text-center text-[10px] uppercase tracking-wider font-extrabold text-gray-500">
                      Today
                    </th>

                    <th className="px-4 py-3 text-center text-[10px] uppercase tracking-wider font-extrabold text-gray-500">
                      2 Days
                    </th>

                    <th className="px-4 py-3 text-center text-[10px] uppercase tracking-wider font-extrabold text-gray-500">
                      3 Days
                    </th>

                    <th className="px-4 py-3 text-center text-[10px] uppercase tracking-wider font-extrabold text-gray-500">
                      7 Days
                    </th>

                    <th className="px-4 py-3 text-center text-[10px] uppercase tracking-wider font-extrabold text-gray-500">
                      This Month
                    </th>

                    <th className="px-5 py-3 text-center text-[10px] uppercase tracking-wider font-extrabold text-gray-500">
                      Total
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {agentPerformance.map(
                    (agent, index) => (
                      <tr
                        key={
                          agent.id ||
                          index
                        }
                        className="border-t border-gray-100 hover:bg-[#f9fbfa] transition"
                      >

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-3">

                            <div className="h-9 w-9 rounded-xl bg-[#0f3b2e] text-white flex items-center justify-center text-xs font-bold">
                              {agent.name
                                ?.charAt(
                                  0
                                )
                                ?.toUpperCase() ||
                                "A"}
                            </div>

                            <div>

                              <p className="text-sm font-bold text-gray-800">
                                {agent.name}
                              </p>

                              <p className="text-[10px] text-gray-400">
                                {agent.email ||
                                  "Agent"}
                              </p>

                            </div>

                          </div>

                        </td>

                        <td className="px-4 py-4 text-center">

                          <span
                            className={`inline-flex min-w-[34px] justify-center px-2.5 py-1 rounded-lg text-xs font-extrabold ${
                              agent.today >
                              0
                                ? "bg-[#0f3b2e] text-white"
                                : "bg-gray-100 text-gray-400"
                            }`}
                          >
                            {
                              agent.today
                            }
                          </span>

                        </td>

                        <td className="px-4 py-4 text-center">

                          <span className="text-sm font-bold text-gray-700">
                            {
                              agent.twoDays
                            }
                          </span>

                        </td>

                        <td className="px-4 py-4 text-center">

                          <span className="text-sm font-bold text-gray-700">
                            {
                              agent.threeDays
                            }
                          </span>

                        </td>

                        <td className="px-4 py-4 text-center">

                          <span className="text-sm font-bold text-gray-700">
                            {
                              agent.sevenDays
                            }
                          </span>

                        </td>

                        <td className="px-4 py-4 text-center">

                          <span className="inline-flex min-w-[42px] justify-center px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-xs font-extrabold">
                            {
                              agent.month
                            }
                          </span>

                        </td>

                        <td className="px-5 py-4 text-center">

                          <span className="text-sm font-extrabold text-[#0f3b2e]">
                            {
                              agent.total
                            }
                          </span>

                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>
          ) : (
            <div className="px-6 py-10 text-center">

              <div className="h-12 w-12 mx-auto rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400">
                <Users size={22} />
              </div>

              <p className="text-sm font-semibold text-gray-600 mt-3">
                No agent users found
              </p>

              <p className="text-xs text-gray-400 mt-1">
                Agent property activity will appear here.
              </p>

            </div>
          )}

        </div>
      )}

      {/* ======================================================
          SUPER ADMIN:
          MY OWN PROPERTY ACTIVITY
          DIRECTLY BELOW AGENT PERFORMANCE
      ====================================================== */}

      {isSuperAdmin && (
        <PropertyActivitySection
          superAdmin
        />
      )}

      {/* ======================================================
          CHARTS
      ====================================================== */}

      <div
        className={`grid grid-cols-1 ${
          isSuperAdmin
            ? "lg:grid-cols-2"
            : ""
        } gap-6 mb-7`}
      >

        {/* ====================================================
            SUPER ADMIN ONLY:
            ENQUIRIES GROWTH
        ==================================================== */}

        {isSuperAdmin && (
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">

            <div className="flex items-center justify-between mb-5">

              <div>

                <h2 className="text-lg font-bold text-[#0f3b2e]">
                  Enquiries Growth
                </h2>

                <p className="text-xs text-gray-400 mt-1">
                  Monthly enquiry performance
                </p>

              </div>

              <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <TrendingUp size={17} />
              </div>

            </div>

            <ResponsiveContainer
              width="100%"
              height={250}
            >
              <LineChart
                data={leadChartData}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 11,
                  }}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 11,
                  }}
                />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#0E4F3A"
                  strokeWidth={3}
                  dot={{
                    r: 4,
                  }}
                  activeDot={{
                    r: 7,
                  }}
                />

              </LineChart>
            </ResponsiveContainer>

          </div>
        )}

        {/* ====================================================
            PROPERTY LOCATION
            AVAILABLE TO ALL ADMINS
        ==================================================== */}

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">

          <div className="flex items-center justify-between mb-5">

            <div>

              <h2 className="text-lg font-bold text-[#0f3b2e]">
                Properties by Location
              </h2>

              <p className="text-xs text-gray-400 mt-1">
                Distribution of property inventory
              </p>

            </div>

            <div className="h-9 w-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Building2 size={17} />
            </div>

          </div>

          <ResponsiveContainer
            width="100%"
            height={250}
          >
            <BarChart
              data={propertyChartData}
            >

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
              />

              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 10,
                }}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 11,
                }}
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-7">

        {/* ====================================================
            RECENT PROPERTIES
            AVAILABLE TO ALL ADMINS
        ==================================================== */}

        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">

          <div className="flex items-center justify-between mb-5">

            <div>

              <h2 className="text-lg font-bold text-[#0f3b2e]">
                Recent Properties
              </h2>

              <p className="text-xs text-gray-400 mt-1">
                Latest additions to your inventory
              </p>

            </div>

            <button
              onClick={() =>
                router.push(
                  "/admin/properties"
                )
              }
              className="flex items-center gap-1 text-xs font-bold text-[#0f3b2e] hover:underline"
            >
              View All
              <ArrowUpRight
                size={13}
              />
            </button>

          </div>

          <div className="space-y-2">

            {recentProperties.length > 0 ? (
              recentProperties.map(
                (property) => {

                  const propertyCreatorName =
                    isSuperAdmin
                      ? getActorName(
                          property?.createdBy ||
                            property?.createdByUser ||
                            property?.createdByName
                        )
                      : null;

                  return (
                    <div
                      key={property._id}
                      className="group flex items-center justify-between gap-4 p-3.5 rounded-xl hover:bg-[#f7faf8] border border-transparent hover:border-gray-100 transition"
                    >

                      <div className="flex items-center gap-3 min-w-0">

                        <div className="h-10 w-10 shrink-0 rounded-xl bg-[#0f3b2e]/10 text-[#0f3b2e] flex items-center justify-center">
                          <Building2
                            size={17}
                          />
                        </div>

                        <div className="min-w-0">

                          <p className="font-semibold text-sm text-gray-800 truncate max-w-[420px]">
                            {property
                              ?.coreDetails
                              ?.title ||
                              property?.title ||
                              "Untitled Property"}
                          </p>

                          <p className="text-xs text-gray-400 mt-1 truncate max-w-[420px]">
                            {property
                              ?.locationData
                              ?.locationName ||
                              property
                                ?.locationData
                                ?.customLocation ||
                              "Unknown Location"}
                          </p>

                          {/* ==================================
                              SUPER ADMIN ONLY:
                              CREATOR
                          ================================== */}

                          {isSuperAdmin && (
                            <div className="flex items-center gap-1.5 mt-1.5">

                              <UserRound
                                size={11}
                                className="text-[#0f3b2e] shrink-0"
                              />

                              <span className="text-[10px] font-semibold text-[#0f3b2e] truncate max-w-[350px]">
                                {propertyCreatorName
                                  ? `Added by ${propertyCreatorName}`
                                  : "Added by Unknown User"}
                              </span>

                            </div>
                          )}

                        </div>

                      </div>

                      <div className="flex items-center gap-3 shrink-0">

                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            property?.status ===
                            "published"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                        >
                          {property
                            ?.status ===
                          "published"
                            ? "LIVE"
                            : "DRAFT"}
                        </span>

                        <ChevronRight
                          size={15}
                          className="text-gray-300 group-hover:text-[#0f3b2e] transition"
                        />

                      </div>

                    </div>
                  );
                }
              )
            ) : (
              <div className="py-10 text-center">

                <Building2
                  className="mx-auto text-gray-300"
                  size={30}
                />

                <p className="text-sm text-gray-400 mt-2">
                  No properties found.
                </p>

              </div>
            )}

          </div>

        </div>

        {/* ====================================================
            QUICK ACTIONS
        ==================================================== */}

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">

          <div className="flex items-center gap-3 mb-5">

            <div className="h-10 w-10 rounded-xl bg-[#0f3b2e]/10 text-[#0f3b2e] flex items-center justify-center">
              <Sparkles size={18} />
            </div>

            <div>

              <h2 className="text-lg font-bold text-[#0f3b2e]">
                Quick Actions
              </h2>

              <p className="text-xs text-gray-400 mt-0.5">
                Frequently used tools
              </p>

            </div>

          </div>

          <div className="space-y-3">

            {/* ==================================================
                ALL ADMINS
            ================================================== */}

            <button
              onClick={() =>
                router.push(
                  "/admin/add-property"
                )
              }
              className="group w-full flex items-center justify-between bg-[#0f3b2e] text-white px-4 py-3 rounded-xl hover:bg-[#145240] transition shadow-sm"
            >

              <div className="flex items-center gap-3">

                <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <Plus size={17} />
                </div>

                <div className="text-left">

                  <p className="text-sm font-bold">
                    Add Property
                  </p>

                  <p className="text-[10px] text-white/60">
                    Create a new listing
                  </p>

                </div>

              </div>

              <ArrowUpRight
                size={16}
                className="opacity-60 group-hover:opacity-100 transition"
              />

            </button>

            {/* ==================================================
                AGENT PRODUCTIVITY MINI SUMMARY
            ================================================== */}

            {!isSuperAdmin && (
              <div className="rounded-xl bg-gray-50 border border-gray-200 p-4">

                <div className="flex items-center justify-between mb-3">

                  <div>

                    <p className="text-xs font-bold text-gray-700">
                      Your Activity
                    </p>

                    <p className="text-[10px] text-gray-400 mt-0.5">
                      This month
                    </p>

                  </div>

                  <Activity
                    size={16}
                    className="text-[#0f3b2e]"
                  />

                </div>

                <div className="flex items-end gap-2">

                  <span className="text-3xl font-extrabold text-[#0f3b2e]">
                    {
                      currentUserPropertyStats.month
                    }
                  </span>

                  <span className="text-xs text-gray-400 mb-1">
                    properties added
                  </span>

                </div>

                <div className="mt-3 h-1.5 rounded-full bg-gray-200 overflow-hidden">

                  <div
                    className="h-full rounded-full bg-[#0f3b2e]"
                    style={{
                      width:
                        currentUserPropertyStats.month >
                        0
                          ? "100%"
                          : "0%",
                    }}
                  />

                </div>

              </div>
            )}

            {/* ==================================================
                SUPER ADMIN ONLY:
                LEADS
            ================================================== */}

            {isSuperAdmin && (
              <button
                onClick={() =>
                  router.push(
                    "/admin/leads"
                  )
                }
                className="group w-full flex items-center justify-between bg-gradient-to-r from-[#c9a64b] to-[#e0be69] text-black px-4 py-3 rounded-xl hover:opacity-90 transition shadow-sm"
              >

                <div className="flex items-center gap-3">

                  <div className="h-8 w-8 rounded-lg bg-black/10 flex items-center justify-center">
                    <MessageSquare
                      size={16}
                    />
                  </div>

                  <div className="text-left">

                    <p className="text-sm font-bold">
                      View Enquiries
                    </p>

                    <p className="text-[10px] text-black/60">
                      Manage incoming leads
                    </p>

                  </div>

                </div>

                <ArrowUpRight
                  size={16}
                  className="opacity-60 group-hover:opacity-100 transition"
                />

              </button>
            )}

            {/* ==================================================
                SUPER ADMIN ONLY:
                USER MANAGEMENT
            ================================================== */}

            {isSuperAdmin && (
              <button
                onClick={() =>
                  router.push(
                    "/admin/site-settings/team"
                  )
                }
                className="group w-full flex items-center justify-between border border-gray-200 bg-white text-gray-800 px-4 py-3 rounded-xl hover:bg-gray-50 transition"
              >

                <div className="flex items-center gap-3">

                  <div className="h-8 w-8 rounded-lg bg-gray-100 flex items-center justify-center">
                    <Users
                      size={16}
                    />
                  </div>

                  <div className="text-left">

                    <p className="text-sm font-bold">
                      Manage Users
                    </p>

                    <p className="text-[10px] text-gray-400">
                      Manage your team
                    </p>

                  </div>

                </div>

                <ArrowUpRight
                  size={16}
                  className="text-gray-400 group-hover:text-gray-700 transition"
                />

              </button>
            )}

          </div>

        </div>

      </div>

      {/* ======================================================
          RECENT ACTIVITY
      ====================================================== */}

      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">

        <div className="flex items-center justify-between mb-5">

          <div>

            <div className="flex items-center gap-2">

              <div className="h-9 w-9 rounded-xl bg-gray-100 text-gray-600 flex items-center justify-center">
                <Clock3 size={17} />
              </div>

              <h2 className="text-lg font-bold text-[#0f3b2e]">
                Recent Activity
              </h2>

            </div>

            <p className="text-xs text-gray-400 mt-1.5 ml-11">
              Latest activity across your dashboard
            </p>

          </div>

          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-200 text-[10px] font-bold text-gray-500">

            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

            Live

          </span>

        </div>

        <div className="space-y-1">

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
                  bg = "bg-blue-50";
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

                  bg =
                    "bg-emerald-50";

                  color =
                    "text-emerald-600";
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
                  bg = "bg-amber-50";
                  color =
                    "text-amber-700";
                }

                // ============================================
                // ACTOR
                //
                // ONLY SHOWN TO SUPER ADMIN
                // ============================================

                const actorName =
                  isSuperAdmin
                    ? getActorName(
                        activity.actor
                      )
                    : null;

                return (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition"
                  >

                    <div
                      className={`w-10 h-10 shrink-0 rounded-xl ${bg} flex items-center justify-center`}
                    >

                      <Icon
                        className={color}
                        size={18}
                      />

                    </div>

                    <div className="flex-1 min-w-0">

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">

                        <p className="font-semibold text-sm text-gray-800 truncate">
                          {activity.title}
                        </p>

                        <p className="text-[10px] text-gray-400 shrink-0">
                          {activity.createdAt
                            ? new Date(
                                activity.createdAt
                              ).toLocaleString(
                                "en-IN",
                                {
                                  day: "numeric",
                                  month: "short",
                                  hour: "2-digit",
                                  minute:
                                    "2-digit",
                                }
                              )
                            : "Recently"}
                        </p>

                      </div>

                      <p className="text-xs text-gray-500 mt-1 truncate">
                        {activity.subtitle}
                      </p>

                      {/* ======================================
                          SUPER ADMIN:
                          WHO DID WHAT
                      ====================================== */}

                      {isSuperAdmin && (
                        <div className="flex items-center gap-1.5 mt-1.5">

                          <div className="h-5 w-5 rounded-md bg-[#0f3b2e]/10 text-[#0f3b2e] flex items-center justify-center shrink-0">
                            <UserRound
                              size={10}
                            />
                          </div>

                          <p className="text-[10px] font-semibold text-[#0f3b2e] truncate">

                            {actorName
                              ? `Performed by ${actorName}`
                              : activity.type ===
                                "property"
                              ? "Performed by Unknown User"
                              : "Actor information unavailable"}

                          </p>

                        </div>
                      )}

                    </div>

                  </div>
                );
              }
            )
          ) : (
            <div className="py-10 text-center">

              <Clock3
                className="mx-auto text-gray-300"
                size={30}
              />

              <p className="text-sm text-gray-400 mt-2">
                No recent activity.
              </p>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}