
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
  Legend,
} from "recharts";

// ============================================================
// LIVE PROPERTY FILTER
// ============================================================

const isLiveProperty = (property) => {
  return (
    property?.status === "published" &&
    property?.isActive === true &&
    property?.isDeleted === false
  );
};

export default function AdminDashboard() {
  const router = useRouter();

  // ============================================================
  // USER
  // ============================================================

  const [user, setUser] = useState(null);
  const [agentPerformancePeriod, setAgentPerformancePeriod] = useState("total");
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState("");

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
  const [allKnowledgeData, setAllKnowledgeData] = useState([]);
  const [allNewsData, setAllNewsData] = useState([]);

  // ============================================================
  // STATS
  // ============================================================

  const [stats, setStats] = useState([]);

  // ============================================================
  // FETCH DASHBOARD DATA
  // ============================================================

  useEffect(() => {
    const fetchDashboardData = async () => {
      setDashboardLoading(true);
      setDashboardError("");
      try {
        // ======================================================
        // TOKEN
        // ======================================================

        const token = localStorage.getItem("token");

        if (!token) {
          setDashboardLoading(false);
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

        if (userRes.status === 401 || userRes.status === 403) {
          localStorage.removeItem("token");
          setDashboardLoading(false);
          router.push("/login");
          return;
        }

        if (!userRes.ok || !userData?.user) {
          throw new Error("Unable to load the current user profile.");
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
        // PUBLISHED KNOWLEDGE + NEWS
        // ======================================================

        const fetchPublishedContent = async (url, label) => {
          try {
            const response = await fetch(url, {
              headers,
              credentials: "include",
              cache: "no-store",
            });

            if (!response.ok) {
              throw new Error(`${label} request failed (${response.status})`);
            }

            const result = await response.json();

            return Array.isArray(result?.data)
              ? result.data
              : [];
          } catch (contentError) {
            console.error(`Dashboard ${label} fetch error:`, contentError);
            return [];
          }
        };

        const [allKnowledge, allNews] = await Promise.all([
          fetchPublishedContent(
            "/api/knowledge?status=published",
            "Knowledge Centre"
          ),
          fetchPublishedContent(
            "/api/news?status=published",
            "News"
          ),
        ]);

        setAllKnowledgeData(allKnowledge);
        setAllNewsData(allNews);

        // ======================================================
        // PUBLISHED PROPERTIES
        // ======================================================

        // ======================================================
// LIVE PROPERTIES ONLY
// Published + Active + Not Deleted
// ======================================================

const publishedProperties =
  allProperties.filter(isLiveProperty);

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

        // Location analytics reflect the live inventory shown to visitors.
        publishedProperties.forEach((property) => {
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
            .filter((property) => property?.isDeleted !== true)
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

        // ------------------------------------------------------
        // RECENT PUBLISHED KNOWLEDGE CENTRE ARTICLES
        // ------------------------------------------------------

        allKnowledge
          .filter((item) => item?.status === "published" && item?.isDeleted === false)
          .forEach((item) => {
            activityFeed.push({
              type: "knowledge",
              title: `Knowledge article "${item?.title || "Untitled article"}" published`,
              subtitle:
                typeof item?.category === "string"
                  ? item.category
                  : item?.category?.name || "Knowledge Centre",
              createdAt: item.createdAt,
              actor:
                item?.createdBy ||
                item?.createdByUser ||
                item?.createdByName ||
                null,
            });
          });

        // ------------------------------------------------------
        // RECENT PUBLISHED NEWS ARTICLES
        // ------------------------------------------------------

        allNews
          .filter((item) => item?.status === "published" && item?.isDeleted === false)
          .forEach((item) => {
            activityFeed.push({
              type: "news",
              title: `News article "${item?.title || "Untitled article"}" published`,
              subtitle:
                typeof item?.category === "string"
                  ? item.category
                  : item?.category?.name || "News",
              createdAt: item.createdAt,
              actor:
                item?.createdBy ||
                item?.createdByUser ||
                item?.createdByName ||
                null,
            });
          });

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
        // ROLE-SPECIFIC DASHBOARD SUMMARY
        // ======================================================

        const currentUserId = String(getUserId(currentUser) || "");

        const myLiveProperties = allProperties.filter(
          (property) =>
            isLiveProperty(property) &&
            String(getPropertyCreatorId(property) || "") === currentUserId
        );

        const myPublishedKnowledge = allKnowledge.filter(
          (item) =>
            item?.status === "published" &&
            item?.isDeleted === false &&
            String(getContentCreatorId(item) || "") === currentUserId
        );

        const myPublishedNews = allNews.filter(
          (item) =>
            item?.status === "published" &&
            item?.isDeleted === false &&
            String(getContentCreatorId(item) || "") === currentUserId
        );

        const publishedKnowledgeCount = allKnowledge.filter(
          (item) => item?.status === "published" && item?.isDeleted === false
        ).length;

        const publishedNewsCount = allNews.filter(
          (item) => item?.status === "published" && item?.isDeleted === false
        ).length;

        const baseStats = isSuperAdmin
          ? [
              {
                title: "Property Records",
                value: allProperties.length,
                icon: Building2,
                description: "All property records in the database",
                type: "property",
              },
              {
                title: "Live Properties",
                value: publishedProperties.length,
                icon: Eye,
                description: "Published, active and not deleted",
                type: "published",
              },
              {
                title: "Published Knowledge",
                value: publishedKnowledgeCount,
                icon: Layers3,
                description: "Knowledge Centre articles",
                type: "knowledge",
              },
              {
                title: "Published News",
                value: publishedNewsCount,
                icon: Activity,
                description: "Live news articles",
                type: "news",
              },
              {
                title: "Total Users",
                value: allUsers.length,
                icon: Users,
                description: "Registered dashboard users",
                type: "users",
              },
              {
                title: "Total Leads",
                value: allLeads.length,
                icon: MessageSquare,
                description: "All enquiries received",
                type: "leads",
              },
            ]
          : [
              {
                title: "Available Properties",
                value: publishedProperties.length,
                icon: Building2,
                description: "Live property inventory",
                type: "property",
              },
              {
                title: "My Properties",
                value: myLiveProperties.length,
                icon: ShieldCheck,
                description: "Live listings added by you",
                type: "published",
              },
              {
                title: "My Knowledge Articles",
                value: myPublishedKnowledge.length,
                icon: Layers3,
                description: "Your published articles",
                type: "knowledge",
              },
              {
                title: "My News Articles",
                value: myPublishedNews.length,
                icon: Activity,
                description: "Your published news",
                type: "news",
              },
            ];

        setStats(baseStats);
      } catch (err) {
        console.error("Dashboard error:", err);
        setDashboardError(
          "We couldn't load some dashboard data. Your session has been kept active. Please retry or check the server connection."
        );
      } finally {
        setDashboardLoading(false);
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

  // ============================================================
  // CONTENT CREATOR + LIVE CONTENT HELPERS
  // ============================================================

  const getContentCreatorId = (item) => {
    if (!item?.createdBy) {
      return null;
    }

    if (typeof item.createdBy === "object") {
      return (
        item.createdBy?._id ||
        item.createdBy?.id ||
        null
      );
    }

    return item.createdBy;
  };

  const isLiveContent = (item) => {
    return (
      item?.status === "published" &&
      item?.isDeleted === false
    );
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

  // ============================================================
  // CONTENT PERFORMANCE HELPERS
  // ============================================================

  const countContentBetween = (items, startDate) => {
    return items.filter((item) => {
      if (!item?.createdAt) {
        return false;
      }

      return new Date(item.createdAt) >= startDate;
    }).length;
  };

  const getContentStats = (items) => {
    return {
      today: countContentBetween(items, getStartOfToday()),
      twoDays: countContentBetween(items, getStartOfDaysAgo(1)),
      threeDays: countContentBetween(items, getStartOfDaysAgo(2)),
      sevenDays: countContentBetween(items, getStartOfDaysAgo(6)),
      month: countContentBetween(items, getStartOfMonth()),
      total: items.length,
    };
  };

  const getContentCreatedByUser = (items, userId) => {
    if (!userId) return [];

    return items.filter((item) => {
      const creatorId = getContentCreatorId(item);

      return (
        isLiveContent(item) &&
        creatorId &&
        String(creatorId) === String(userId)
      );
    });
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
      isLiveProperty(property) &&
      String(
        getPropertyCreatorId(property)
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
  // CURRENT USER KNOWLEDGE + NEWS ACTIVITY
  // USED BY AGENTS + SUPER ADMIN
  // ============================================================

  const currentUserKnowledgeStats = useMemo(() => {
    if (!user) {
      return getContentStats([]);
    }

    const myKnowledge = getContentCreatedByUser(
      allKnowledgeData,
      getUserId(user)
    );

    return getContentStats(myKnowledge);
  }, [user, allKnowledgeData]);

  const currentUserNewsStats = useMemo(() => {
    if (!user) {
      return getContentStats([]);
    }

    const myNews = getContentCreatedByUser(
      allNewsData,
      getUserId(user)
    );

    return getContentStats(myNews);
  }, [user, allNewsData]);

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
      isLiveProperty(property) &&
      String(
        getPropertyCreatorId(property)
      ) === String(agentId)
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
  // KNOWLEDGE + NEWS AGENT PERFORMANCE
  // ============================================================

  const buildAgentContentPerformance = (items) => {
    if (!isSuperAdmin) {
      return [];
    }

    const agents = allUsersData.filter(
      (account) => account?.role === "Agent"
    );

    return agents
      .map((agent) => {
        const agentId = getUserId(agent);
        const agentItems = getContentCreatedByUser(items, agentId);

        return {
          id: agentId,
          name:
            agent?.name ||
            agent?.fullName ||
            agent?.username ||
            agent?.email ||
            "Unknown Agent",
          email: agent?.email || "",
          ...getContentStats(agentItems),
        };
      })
      .sort(
        (a, b) =>
          b.month - a.month ||
          b.total - a.total ||
          a.name.localeCompare(b.name)
      );
  };

  const knowledgeAgentPerformance = useMemo(
    () => buildAgentContentPerformance(allKnowledgeData),
    [isSuperAdmin, allUsersData, allKnowledgeData]
  );

  const newsAgentPerformance = useMemo(
    () => buildAgentContentPerformance(allNewsData),
    [isSuperAdmin, allUsersData, allNewsData]
  );

  const getContentTeamSummary = (performance) => {
    return {
      today: performance.reduce((sum, agent) => sum + agent.today, 0),
      twoDays: performance.reduce((sum, agent) => sum + agent.twoDays, 0),
      threeDays: performance.reduce((sum, agent) => sum + agent.threeDays, 0),
      sevenDays: performance.reduce((sum, agent) => sum + agent.sevenDays, 0),
      month: performance.reduce((sum, agent) => sum + agent.month, 0),
      total: performance.reduce((sum, agent) => sum + agent.total, 0),
    };
  };

  const knowledgeAgentSummary = useMemo(
    () => getContentTeamSummary(knowledgeAgentPerformance),
    [knowledgeAgentPerformance]
  );

  const newsAgentSummary = useMemo(
    () => getContentTeamSummary(newsAgentPerformance),
    [newsAgentPerformance]
  );


  // ============================================================
  // COMBINED AGENT PERFORMANCE
  // Properties + Knowledge Centre + News
  // ============================================================

  const combinedAgentPerformance = useMemo(() => {
    const knowledgeByAgent = new Map(
      knowledgeAgentPerformance.map((agent) => [String(agent.id), agent])
    );
    const newsByAgent = new Map(
      newsAgentPerformance.map((agent) => [String(agent.id), agent])
    );

    return agentPerformance.map((propertyAgent) => {
      const knowledgeAgent = knowledgeByAgent.get(String(propertyAgent.id));
      const newsAgent = newsByAgent.get(String(propertyAgent.id));

      const periods = {};
      ["today", "twoDays", "threeDays", "sevenDays", "month", "total"].forEach((period) => {
        const properties = Number(propertyAgent[period] || 0);
        const knowledge = Number(knowledgeAgent?.[period] || 0);
        const news = Number(newsAgent?.[period] || 0);

        periods[period] = {
          properties,
          knowledge,
          news,
          total: properties + knowledge + news,
        };
      });

      return {
        ...propertyAgent,
        periods,
      };
    }).sort((a, b) => {
      const aCount = a.periods[agentPerformancePeriod]?.total || 0;
      const bCount = b.periods[agentPerformancePeriod]?.total || 0;
      return bCount - aCount || a.name.localeCompare(b.name);
    });
  }, [
    agentPerformance,
    knowledgeAgentPerformance,
    newsAgentPerformance,
    agentPerformancePeriod,
  ]);

  const combinedAgentPeriodSummary = useMemo(() => {
    return combinedAgentPerformance.reduce(
      (summary, agent) => {
        const period = agent.periods[agentPerformancePeriod] || {};
        summary.properties += period.properties || 0;
        summary.knowledge += period.knowledge || 0;
        summary.news += period.news || 0;
        summary.total += period.total || 0;
        return summary;
      },
      { properties: 0, knowledge: 0, news: 0, total: 0 }
    );
  }, [combinedAgentPerformance, agentPerformancePeriod]);

  const agentPerformancePeriodLabel = {
    today: "Today",
    twoDays: "Last 2 Days",
    threeDays: "Last 3 Days",
    sevenDays: "Last 7 Days",
    month: "This Month",
    total: "All Time",
  }[agentPerformancePeriod];

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

    {
      iconBg: "bg-violet-100",
      iconColor: "text-violet-700",
      accent: "from-violet-100",
    },

    {
      iconBg: "bg-sky-100",
      iconColor: "text-sky-700",
      accent: "from-sky-100",
    },
  ];

// ============================================================
// PROPERTY ACTIVITY CARD COMPONENT
// DAILY PERSONAL GOAL = 7 PROPERTIES
// ============================================================

const PropertyActivitySection = ({
  superAdmin = false,
}) => {
  // ============================================================
  // PERSONAL DAILY GOAL
  // ============================================================

  const DAILY_GOAL = 7;

  const dailyCompleted =
    currentUserPropertyStats.today || 0;

  const dailyProgress = Math.min(
    Math.round(
      (dailyCompleted / DAILY_GOAL) * 100
    ),
    100
  );

  const dailyRemaining = Math.max(
    DAILY_GOAL - dailyCompleted,
    0
  );

  const goalReached =
    dailyCompleted >= DAILY_GOAL;

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
                My Property Activity
              </h2>

            </div>

            <p className="text-xs text-gray-500 mt-1.5 ml-11">
              {superAdmin
                ? "Track the properties you've personally added as Super Admin."
                : "Track the properties you've added and stay on top of your daily goal."}
            </p>

          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">

            <CalendarDays size={14} />

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
              {currentUserPropertyStats.today}
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
              {currentUserPropertyStats.twoDays}
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
              {currentUserPropertyStats.threeDays}
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
              {currentUserPropertyStats.sevenDays}
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
              {currentUserPropertyStats.month}
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
              {currentUserPropertyStats.total}
            </p>

            <p className="text-[11px] text-emerald-600/70 mt-1">
              Total added
            </p>

          </div>

        </div>


        {/* ====================================================
            DAILY GOAL
        ==================================================== */}

        <div
          className={`mt-4 rounded-2xl border p-5 transition-all duration-300 ${
            goalReached
              ? "border-emerald-200 bg-emerald-50"
              : "border-[#c9a64b]/30 bg-gradient-to-br from-[#fffdf7] via-white to-[#fffaf0]"
          }`}
        >

          {/* ------------------------------------------------
              GOAL HEADER
          ------------------------------------------------ */}

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">

            <div className="flex items-start gap-3">

              <div
                className={`h-11 w-11 shrink-0 rounded-xl flex items-center justify-center ${
                  goalReached
                    ? "bg-emerald-600 text-white"
                    : "bg-[#c9a64b]/15 text-[#a47c25]"
                }`}
              >
                <TrendingUp size={19} />
              </div>

              <div>

                <div className="flex items-center gap-2 flex-wrap">

                  <p className="text-sm font-extrabold text-gray-800">
                    Daily Property Goal
                  </p>

                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-extrabold ${
                      goalReached
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-[#c9a64b]/15 text-[#9a7425]"
                    }`}
                  >
                    {goalReached
                      ? "Goal Achieved"
                      : "Target 7"}
                  </span>

                </div>

                <p className="text-[11px] text-gray-500 mt-1">
                  {goalReached
                    ? "Excellent work — you've reached today's property target."
                    : "Your target is to add 7 properties today."}
                </p>

              </div>

            </div>


            {/* ------------------------------------------------
                PROGRESS NUMBER
            ------------------------------------------------ */}

            <div className="flex items-center gap-2 sm:text-right">

              <div>

                <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400">
                  Today's Progress
                </p>

                <p
                  className={`text-2xl font-extrabold leading-none mt-1 ${
                    goalReached
                      ? "text-emerald-700"
                      : "text-[#0f3b2e]"
                  }`}
                >
                  {dailyCompleted}

                  <span className="text-sm font-bold text-gray-400">
                    {" "}
                    / {DAILY_GOAL}
                  </span>
                </p>

              </div>

            </div>

          </div>


          {/* ------------------------------------------------
              PROGRESS BAR
          ------------------------------------------------ */}

          <div className="mt-5">

            <div className="flex items-center justify-between mb-2">

              <span className="text-[10px] font-bold text-gray-500">
                Today's target
              </span>

              <span
                className={`text-[10px] font-extrabold ${
                  goalReached
                    ? "text-emerald-700"
                    : "text-[#a47c25]"
                }`}
              >
                {dailyProgress}%
              </span>

            </div>


            <div className="h-2.5 w-full rounded-full bg-gray-200 overflow-hidden">

              <div
                className={`h-full rounded-full transition-all duration-700 ease-out ${
                  goalReached
                    ? "bg-emerald-600"
                    : "bg-gradient-to-r from-[#b89135] via-[#c9a64b] to-[#e0be69]"
                }`}
                style={{
                  width: `${dailyProgress}%`,
                }}
              />

            </div>


            {/* ------------------------------------------------
                GOAL MESSAGE
            ------------------------------------------------ */}

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-3">

              <p className="text-[11px] text-gray-500">

                {goalReached ? (
                  <>
                    🎉 Today's goal completed
                  </>
                ) : (
                  <>
                    <span className="font-bold text-gray-700">
                      {dailyRemaining}
                    </span>{" "}
                    {dailyRemaining === 1
                      ? "property"
                      : "properties"}{" "}
                    remaining to reach today's goal
                  </>
                )}

              </p>


              <p className="text-[10px] font-semibold text-gray-400">
                Goal resets every day
              </p>

            </div>

          </div>

        </div>


        {/* ====================================================
            PERSONAL SUMMARY
        ==================================================== */}

        <div className="mt-4 rounded-2xl border border-[#0f3b2e]/10 bg-[#0f3b2e]/[0.025] p-4">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

            <div className="flex items-center gap-3">

              <div className="h-10 w-10 rounded-xl bg-[#0f3b2e] text-white flex items-center justify-center">

                {superAdmin ? (
                  <ShieldCheck size={18} />
                ) : (
                  <UserRound size={18} />
                )}

              </div>

              <div>

                <p className="text-sm font-bold text-gray-800">
                  {currentUserName}
                </p>

                <p className="text-[11px] text-gray-400">
                  {superAdmin
                    ? "Super Admin property contribution"
                    : "Your property contribution"}
                </p>

              </div>

            </div>


            {/* ------------------------------------------------
                THIS MONTH SUMMARY
            ------------------------------------------------ */}

            <div className="flex items-center gap-2">

              <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400">
                This month
              </span>

              <span
                className="px-3 py-1.5 rounded-xl bg-[#0f3b2e] text-white text-xs font-extrabold"
              >
                {currentUserPropertyStats.month}{" "}
                {currentUserPropertyStats.month === 1
                  ? "property"
                  : "properties"}

              </span>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

// ============================================================
// PERSONAL CONTENT ACTIVITY SECTION
// ============================================================

const ContentActivitySection = ({
  title,
  description,
  stats,
  icon: Icon = Layers3,
}) => {
  const metrics = [
    {
      label: "Today",
      value: stats?.today || 0,
      helper: "Created today",
      className: "bg-[#0f3b2e] text-white",
      labelClassName: "text-white/60",
      helperClassName: "text-white/60",
    },
    {
      label: "2 Days",
      value: stats?.twoDays || 0,
      helper: "Last 2 days",
      className: "bg-gray-50 border border-gray-200 text-[#0f3b2e]",
      labelClassName: "text-gray-500",
      helperClassName: "text-gray-400",
    },
    {
      label: "3 Days",
      value: stats?.threeDays || 0,
      helper: "Last 3 days",
      className: "bg-gray-50 border border-gray-200 text-[#0f3b2e]",
      labelClassName: "text-gray-500",
      helperClassName: "text-gray-400",
    },
    {
      label: "7 Days",
      value: stats?.sevenDays || 0,
      helper: "Last 7 days",
      className: "bg-gray-50 border border-gray-200 text-[#0f3b2e]",
      labelClassName: "text-gray-500",
      helperClassName: "text-gray-400",
    },
    {
      label: "This Month",
      value: stats?.month || 0,
      helper: "Current month",
      className: "bg-amber-50 border border-amber-200 text-amber-700",
      labelClassName: "text-amber-700",
      helperClassName: "text-amber-600/70",
    },
    {
      label: "All Time",
      value: stats?.total || 0,
      helper: "Published total",
      className: "bg-emerald-50 border border-emerald-200 text-emerald-700",
      labelClassName: "text-emerald-700",
      helperClassName: "text-emerald-600/70",
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-7">
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-[#0f3b2e]/10 text-[#0f3b2e] flex items-center justify-center">
                <Icon size={18} />
              </div>
              <h2 className="text-lg font-bold text-[#0f3b2e]">
                {title}
              </h2>
            </div>
            <p className="text-xs text-gray-500 mt-1.5 ml-11">
              {description}
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
            <CalendarDays size={14} />
            Published content activity
          </div>
        </div>
      </div>

      <div className="p-5">
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className={`rounded-2xl p-4 ${metric.className}`}
            >
              <p className={`text-[11px] uppercase tracking-wider font-semibold ${metric.labelClassName}`}>
                {metric.label}
              </p>
              <p className="text-3xl font-extrabold mt-2">
                {metric.value}
              </p>
              <p className={`text-[11px] mt-1 ${metric.helperClassName}`}>
                {metric.helper}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================================
// SUPER ADMIN: AGENT CONTENT PERFORMANCE TABLE
// ============================================================

const AgentContentPerformanceSection = ({
  title,
  description,
  performance = [],
  summary = {},
  icon: Icon = Layers3,
}) => {
  const summaryCards = [
    { label: "Today", value: summary.today || 0, tone: "bg-[#0f3b2e]/5 border-[#0f3b2e]/10 text-[#0f3b2e]" },
    { label: "2 Days", value: summary.twoDays || 0, tone: "bg-gray-50 border-gray-200 text-gray-700" },
    { label: "3 Days", value: summary.threeDays || 0, tone: "bg-gray-50 border-gray-200 text-gray-700" },
    { label: "7 Days", value: summary.sevenDays || 0, tone: "bg-gray-50 border-gray-200 text-gray-700" },
    { label: "This Month", value: summary.month || 0, tone: "bg-amber-50 border-amber-200 text-amber-700" },
    { label: "All Time", value: summary.total || 0, tone: "bg-emerald-50 border-emerald-200 text-emerald-700" },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-7">
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-[#0f3b2e]/10 text-[#0f3b2e] flex items-center justify-center">
            <Icon size={18} />
          </div>
          <h2 className="text-lg font-bold text-[#0f3b2e]">{title}</h2>
        </div>
        <p className="text-xs text-gray-500 mt-1.5 ml-11">
          {description}
        </p>
      </div>

      <div className="p-5 pb-0">
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-2">
          {summaryCards.map((card) => (
            <div
              key={card.label}
              className={`rounded-xl border px-3 py-2 ${card.tone}`}
            >
              <p className="text-[9px] uppercase font-bold tracking-wider opacity-70">
                {card.label}
              </p>
              <p className="text-lg font-extrabold mt-0.5">
                {card.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {performance.length > 0 ? (
        <div className="overflow-x-auto mt-5">
          <table className="w-full min-w-[900px]">
            <thead className="bg-[#f7f9f8]">
              <tr>
                <th className="px-5 py-3 text-left text-[10px] uppercase tracking-wider font-extrabold text-gray-500">
                  Agent
                </th>
                {[
                  "Today",
                  "2 Days",
                  "3 Days",
                  "7 Days",
                  "This Month",
                  "All Time",
                ].map((heading) => (
                  <th
                    key={heading}
                    className="px-4 py-3 text-center text-[10px] uppercase tracking-wider font-extrabold text-gray-500"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {performance.map((agent, index) => (
                <tr
                  key={agent.id || index}
                  className="border-t border-gray-100 hover:bg-[#f9fbfa] transition"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-[#0f3b2e] text-white flex items-center justify-center text-xs font-bold">
                        {agent.name?.charAt(0)?.toUpperCase() || "A"}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800">
                          {agent.name}
                        </p>
                        <p className="text-[10px] text-gray-400">
                          {agent.email || "Agent"}
                        </p>
                      </div>
                    </div>
                  </td>
                  {[agent.today, agent.twoDays, agent.threeDays, agent.sevenDays, agent.month, agent.total].map((value, valueIndex) => (
                    <td key={valueIndex} className="px-4 py-4 text-center">
                      <span
                        className={`text-sm font-extrabold ${
                          valueIndex === 4
                            ? "inline-flex min-w-[42px] justify-center px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-700"
                            : valueIndex === 5
                            ? "text-[#0f3b2e]"
                            : "text-gray-700"
                        }`}
                      >
                        {value || 0}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="px-6 py-10 text-center mt-5">
          <div className="h-12 w-12 mx-auto rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400">
            <Users size={22} />
          </div>
          <p className="text-sm font-semibold text-gray-600 mt-3">
            No agent users found
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Agent content activity will appear here.
          </p>
        </div>
      )}
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
                  .{" "}
                  {isSuperAdmin
                    ? "Here is your team's business and content performance at a glance."
                    : "Here is your property and content workspace at a glance."}
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

              {/* ==================================================
    ACCOUNT ACTIONS
================================================== */}

<div className="flex items-center gap-2 ml-1">

  {/* CHANGE PASSWORD */}

  <Link
    href="/forgot-password"
    className="px-3 py-2 rounded-xl text-xs font-bold text-[#0f3b2e] border border-[#0f3b2e]/15 bg-[#0f3b2e]/5 hover:bg-[#0f3b2e]/10 transition whitespace-nowrap"
  >
    Change Password
  </Link>


  {/* LOGOUT */}

  <button
    onClick={() => {
      localStorage.removeItem("token");

      router.push("/login");
    }}
    className="px-3 py-2 rounded-xl text-xs font-bold text-red-500 hover:bg-red-50 transition whitespace-nowrap"
  >
    Logout
  </button>

</div>

            </div>

          </div>

        </div>

      </div>

      {dashboardLoading && (
        <div className="mb-5 flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600 shadow-sm">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#0f3b2e]/20 border-t-[#0f3b2e]" />
          Loading your dashboard data...
        </div>
      )}

      {dashboardError && (
        <div
          role="alert"
          className="mb-5 flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="text-sm text-amber-900">{dashboardError}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="shrink-0 rounded-lg border border-amber-300 bg-white px-3 py-2 text-xs font-bold text-amber-900 hover:bg-amber-100"
          >
            Retry dashboard
          </button>
        </div>
      )}

      {/* ======================================================
          ROLE-SPECIFIC OVERVIEW
      ====================================================== */}

      <div
        className={`grid grid-cols-1 sm:grid-cols-2 ${
          isSuperAdmin
            ? "xl:grid-cols-3 2xl:grid-cols-6"
            : "xl:grid-cols-4"
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

      {!isSuperAdmin && (
        <>
          <ContentActivitySection
            title="My Knowledge Centre Activity"
            description="Track your published Knowledge Centre articles across the same reporting periods as property activity."
            stats={currentUserKnowledgeStats}
            icon={Layers3}
          />

          <ContentActivitySection
            title="My News Activity"
            description="Track your published News articles across the same reporting periods as property activity."
            stats={currentUserNewsStats}
            icon={Eye}
          />
        </>
      )}

      {/* ======================================================
          SUPER ADMIN:
          COMBINED AGENT PERFORMANCE
          PROPERTIES + KNOWLEDGE CENTRE + NEWS
      ====================================================== */}

      {isSuperAdmin && (
        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-7">
          {(() => {
            const DAILY_GOAL = 7;
            const totalAgents = combinedAgentPerformance.length;
            const agentsCompletedToday = agentPerformance.filter(
              (agent) => (agent.today || 0) >= DAILY_GOAL
            ).length;
            const totalAgentPropertiesToday = agentSummary.today || 0;
            const totalDailyTarget = totalAgents * DAILY_GOAL;
            const overallGoalProgress = totalDailyTarget > 0
              ? Math.min(Math.round((totalAgentPropertiesToday / totalDailyTarget) * 100), 100)
              : 0;

            const chartData = combinedAgentPerformance.map((agent) => {
              const period = agent.periods[agentPerformancePeriod] || {};
              return {
                name: agent.name,
                properties: period.properties || 0,
                knowledge: period.knowledge || 0,
                news: period.news || 0,
                total: period.total || 0,
              };
            });

            const periodOptions = [
              { value: "today", label: "Today" },
              { value: "twoDays", label: "Last 2 Days" },
              { value: "threeDays", label: "Last 3 Days" },
              { value: "sevenDays", label: "Last 7 Days" },
              { value: "month", label: "This Month" },
              { value: "total", label: "All Time" },
            ];

            const metricCards = [
              {
                label: "Total Activity",
                value: combinedAgentPeriodSummary.total,
                hint: agentPerformancePeriodLabel,
                card: "bg-[#0f3b2e] text-white border-[#0f3b2e]",
                muted: "text-white/65",
              },
              {
                label: "Properties",
                value: combinedAgentPeriodSummary.properties,
                hint: "Live property listings",
                card: "bg-emerald-50 text-[#0f3b2e] border-emerald-200",
                muted: "text-emerald-700/70",
              },
              {
                label: "Knowledge Centre",
                value: combinedAgentPeriodSummary.knowledge,
                hint: "Published articles",
                card: "bg-amber-50 text-amber-800 border-amber-200",
                muted: "text-amber-700/70",
              },
              {
                label: "News",
                value: combinedAgentPeriodSummary.news,
                hint: "Published news articles",
                card: "bg-blue-50 text-blue-800 border-blue-200",
                muted: "text-blue-700/70",
              },
            ];

            return (
              <>
                {/* HEADER + PERIOD FILTER */}
                <div className="px-6 py-5 border-b border-gray-100">
                  <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="h-9 w-9 rounded-xl bg-[#0f3b2e]/10 text-[#0f3b2e] flex items-center justify-center">
                          <Users size={18} />
                        </div>
                        <h2 className="text-lg font-bold text-[#0f3b2e]">
                          Agent Performance Overview
                        </h2>
                      </div>
                      <p className="text-xs text-gray-500 mt-1.5 ml-11">
                        Compare each agent's property listings, Knowledge Centre articles and News contributions in one place.
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                      <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400">
                        Reporting period
                      </span>
                      <select
                        value={agentPerformancePeriod}
                        onChange={(event) => setAgentPerformancePeriod(event.target.value)}
                        className="min-w-[170px] rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-xs font-bold text-[#0f3b2e] outline-none focus:border-[#c9a64b] focus:ring-2 focus:ring-[#c9a64b]/15"
                      >
                        {periodOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* COMBINED PERIOD SUMMARY */}
                <div className="p-5 pb-0">
                  <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
                    {metricCards.map((card) => (
                      <div key={card.label} className={`rounded-2xl border p-4 ${card.card}`}>
                        <p className="text-[10px] uppercase tracking-wider font-bold opacity-75">
                          {card.label}
                        </p>
                        <p className="text-3xl font-extrabold mt-2 tabular-nums">
                          {card.value.toLocaleString()}
                        </p>
                        <p className={`text-[10px] mt-1 ${card.muted}`}>
                          {card.hint}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* PROPERTY-ONLY DAILY GOAL */}
                <div className="px-5 pt-4">
                  <div className={`rounded-2xl border p-5 ${
                    overallGoalProgress >= 100
                      ? "bg-emerald-50 border-emerald-200"
                      : "bg-gradient-to-br from-[#fffdf7] via-white to-[#fffaf0] border-[#c9a64b]/30"
                  }`}>
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className={`h-11 w-11 shrink-0 rounded-xl flex items-center justify-center ${
                          overallGoalProgress >= 100
                            ? "bg-emerald-600 text-white"
                            : "bg-[#c9a64b]/15 text-[#a47c25]"
                        }`}>
                          <Building2 size={19} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-extrabold text-gray-800">
                              Property Daily Goal
                            </p>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#c9a64b]/15 text-[#9a7425] text-[9px] uppercase tracking-wider font-extrabold">
                              7 Properties / Agent
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-500 mt-1">
                            This target counts live properties only. Knowledge Centre and News articles are excluded.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div>
                          <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400">
                            Properties created today
                          </p>
                          <p className="text-2xl font-extrabold leading-none mt-1 text-[#0f3b2e]">
                            {totalAgentPropertiesToday}
                            <span className="text-sm font-bold text-gray-400"> / {totalDailyTarget}</span>
                          </p>
                          <p className="text-[10px] text-gray-400 mt-1">
                            {agentsCompletedToday} of {totalAgents} agents achieved the goal
                          </p>
                        </div>
                        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center text-xs font-extrabold ${
                          overallGoalProgress >= 100
                            ? "bg-emerald-600 text-white"
                            : "bg-[#0f3b2e] text-white"
                        }`}>
                          {overallGoalProgress}%
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold text-gray-500">
                          Team property goal progress
                        </span>
                        <span className="text-[10px] font-extrabold text-[#a47c25]">
                          {overallGoalProgress}%
                        </span>
                      </div>
                      <div className="h-2.5 w-full rounded-full bg-gray-200 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${overallGoalProgress >= 100 ? "bg-emerald-600" : "bg-gradient-to-r from-[#b89135] via-[#c9a64b] to-[#e0be69]"}`}
                          style={{ width: `${overallGoalProgress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* STACKED AGENT CHART */}
                <div className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                    <div>
                      <h3 className="text-sm font-extrabold text-[#0f3b2e]">
                        Agent Output by Category
                      </h3>
                      <p className="text-[10px] text-gray-400 mt-1">
                        Stacked bars show each agent's combined output for {agentPerformancePeriodLabel.toLowerCase()}.
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-[10px] font-semibold text-gray-600">
                      <span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-[#0f3b2e]" />Properties</span>
                      <span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-[#c9a24d]" />Knowledge</span>
                      <span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-[#3b82f6]" />News</span>
                    </div>
                  </div>

                  {combinedAgentPerformance.length > 0 ? (
                    <div className="w-full overflow-y-auto overflow-x-hidden max-h-[520px] rounded-xl border border-gray-100 bg-white p-2">
                      <ResponsiveContainer
                        width="100%"
                        height={Math.max(280, chartData.length * 58 + 70)}
                      >
                        <BarChart
                          data={chartData}
                          layout="vertical"
                          margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
                          barCategoryGap="28%"
                        >
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                          <XAxis
                            type="number"
                            allowDecimals={false}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: "#94a3b8" }}
                          />
                          <YAxis
                            type="category"
                            dataKey="name"
                            width={125}
                            interval={0}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: "#475569" }}
                          />
                          <Tooltip
                            cursor={{ fill: "#f8fafc" }}
                            formatter={(value, name) => [value, name]}
                            labelStyle={{ color: "#0f3b2e", fontWeight: 700 }}
                          />
                          <Legend verticalAlign="bottom" height={30} iconType="circle" />
                          <Bar dataKey="properties" name="Properties" stackId="agentOutput" fill="#0f3b2e" radius={[0, 0, 0, 0]} />
                          <Bar dataKey="knowledge" name="Knowledge Centre" stackId="agentOutput" fill="#c9a24d" radius={[0, 0, 0, 0]} />
                          <Bar dataKey="news" name="News" stackId="agentOutput" fill="#3b82f6" radius={[0, 5, 5, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="py-12 text-center rounded-xl border border-dashed border-gray-200 bg-gray-50">
                      <Users size={26} className="mx-auto text-gray-300" />
                      <p className="text-sm font-semibold text-gray-600 mt-2">No agent users found</p>
                      <p className="text-xs text-gray-400 mt-1">Agent performance will appear here once agents are available.</p>
                    </div>
                  )}
                </div>

                {/* EXACT COUNTS TABLE */}
                {combinedAgentPerformance.length > 0 && (
                  <div className="border-t border-gray-100">
                    <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div>
                        <h3 className="text-sm font-extrabold text-[#0f3b2e]">
                          Agent-wise Activity Breakdown
                        </h3>
                        <p className="text-[10px] text-gray-400 mt-1">
                          Exact counts for {agentPerformancePeriodLabel.toLowerCase()}; each category is counted separately.
                        </p>
                      </div>
                      <span className="text-[10px] font-bold text-gray-500 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                        {combinedAgentPerformance.length} Agents
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[760px]">
                        <thead className="bg-[#f7f9f8]">
                          <tr>
                            <th className="px-5 py-3 text-left text-[10px] uppercase tracking-wider font-extrabold text-gray-500">Agent</th>
                            <th className="px-4 py-3 text-center text-[10px] uppercase tracking-wider font-extrabold text-[#0f3b2e]">Properties</th>
                            <th className="px-4 py-3 text-center text-[10px] uppercase tracking-wider font-extrabold text-[#a47c25]">Knowledge Centre</th>
                            <th className="px-4 py-3 text-center text-[10px] uppercase tracking-wider font-extrabold text-blue-700">News</th>
                            <th className="px-5 py-3 text-center text-[10px] uppercase tracking-wider font-extrabold text-gray-700">Total Activity</th>
                          </tr>
                        </thead>
                        <tbody>
                          {combinedAgentPerformance.map((agent) => {
                            const period = agent.periods[agentPerformancePeriod] || {};
                            const propertyToday = agent.today || 0;
                            const goalProgress = Math.min(Math.round((propertyToday / DAILY_GOAL) * 100), 100);
                            const goalReached = propertyToday >= DAILY_GOAL;

                            return (
                              <tr key={agent.id} className="border-t border-gray-100 hover:bg-[#f9fbfa] transition">
                                <td className="px-5 py-3.5">
                                  <div className="flex items-center gap-3">
                                    <div className={`h-9 w-9 shrink-0 rounded-xl flex items-center justify-center text-xs font-bold ${goalReached ? "bg-emerald-600 text-white" : "bg-[#0f3b2e] text-white"}`}>
                                      {agent.name?.charAt(0)?.toUpperCase() || "A"}
                                    </div>
                                    <div className="min-w-0">
                                      <p className="text-xs font-bold text-gray-800">{agent.name}</p>
                                      <p className="text-[10px] text-gray-400 truncate max-w-[220px]">{agent.email || "Agent"}</p>
                                      <p className={`text-[9px] mt-0.5 font-semibold ${goalReached ? "text-emerald-700" : "text-gray-400"}`}>
                                        Property goal: {propertyToday}/{DAILY_GOAL} ({goalProgress}%)
                                      </p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-3.5 text-center">
                                  <span className="inline-flex min-w-[42px] justify-center rounded-lg bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-xs font-extrabold text-[#0f3b2e]">{period.properties || 0}</span>
                                </td>
                                <td className="px-4 py-3.5 text-center">
                                  <span className="inline-flex min-w-[42px] justify-center rounded-lg bg-amber-50 border border-amber-200 px-2.5 py-1 text-xs font-extrabold text-amber-700">{period.knowledge || 0}</span>
                                </td>
                                <td className="px-4 py-3.5 text-center">
                                  <span className="inline-flex min-w-[42px] justify-center rounded-lg bg-blue-50 border border-blue-200 px-2.5 py-1 text-xs font-extrabold text-blue-700">{period.news || 0}</span>
                                </td>
                                <td className="px-5 py-3.5 text-center">
                                  <span className="inline-flex min-w-[48px] justify-center rounded-lg bg-[#0f3b2e] px-3 py-1.5 text-xs font-extrabold text-white">{period.total || 0}</span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                        <tfoot className="bg-gray-50 border-t border-gray-200">
                          <tr>
                            <td className="px-5 py-3 text-xs font-extrabold text-gray-700">Team Total</td>
                            <td className="px-4 py-3 text-center text-xs font-extrabold text-[#0f3b2e]">{combinedAgentPeriodSummary.properties}</td>
                            <td className="px-4 py-3 text-center text-xs font-extrabold text-amber-700">{combinedAgentPeriodSummary.knowledge}</td>
                            <td className="px-4 py-3 text-center text-xs font-extrabold text-blue-700">{combinedAgentPeriodSummary.news}</td>
                            <td className="px-5 py-3 text-center text-xs font-extrabold text-[#0f3b2e]">{combinedAgentPeriodSummary.total}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                )}
              </>
            );
          })()}
        </section>
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

      {isSuperAdmin && (
        <>
          <ContentActivitySection
            title="My Knowledge Centre Activity"
            description="Track your own published Knowledge Centre articles across the same reporting periods as property activity."
            stats={currentUserKnowledgeStats}
            icon={Layers3}
          />

          <ContentActivitySection
            title="My News Activity"
            description="Track your own published News articles across the same reporting periods as property activity."
            stats={currentUserNewsStats}
            icon={Eye}
          />

        </>
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
                Live Properties by Location
              </h2>

              <p className="text-xs text-gray-400 mt-1">
                Published and active inventory distribution
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
                KNOWLEDGE CENTRE QUICK ACTION
            ================================================== */}

            <button
              type="button"
              onClick={() => router.push("/admin/knowledge/create")}
              className="group w-full flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-900 transition hover:bg-amber-100"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100">
                  <Layers3 size={16} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold">Create Knowledge Article</p>
                  <p className="text-[10px] text-amber-800/70">Publish a buying or investment guide</p>
                </div>
              </div>
              <ArrowUpRight size={16} className="opacity-60 transition group-hover:opacity-100" />
            </button>

            {/* ==================================================
                NEWS QUICK ACTION
            ================================================== */}

            <button
              type="button"
              onClick={() => router.push("/admin/insights/create")}
              className="group w-full flex items-center justify-between rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-blue-900 transition hover:bg-blue-100"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                  <Eye size={16} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold">Create News Article</p>
                  <p className="text-[10px] text-blue-800/70">Add a market update or insight</p>
                </div>
              </div>
              <ArrowUpRight size={16} className="opacity-60 transition group-hover:opacity-100" />
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
                // KNOWLEDGE CENTRE ARTICLE
                // ============================================

                if (activity.type === "knowledge") {
                  Icon = Layers3;
                  bg = "bg-amber-50";
                  color = "text-amber-700";
                }

                // ============================================
                // NEWS ARTICLE
                // ============================================

                if (activity.type === "news") {
                  Icon = Eye;
                  bg = "bg-blue-50";
                  color = "text-blue-700";
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
