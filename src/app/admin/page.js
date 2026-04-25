"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  Building2,
  Users,
  IndianRupee,
  MessageSquare,
  TrendingUp,
} from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

export default function AdminDashboard() {
  const router = useRouter();

  // 🔐 AUTH CHECK
  // useEffect(() => {
  //   const token = localStorage.getItem("token");

  //   if (!token) {
  //     router.push("/login");
  //   }
  // }, []);

  // 🔥 STATES (for future real API)
  const [stats, setStats] = useState([
    {
      title: "Total Properties",
      value: "128",
      icon: Building2,
      change: "+12%",
    },
    {
      title: "Total Users",
      value: "842",
      icon: Users,
      change: "+8%",
    },
    {
      title: "Revenue",
      value: "₹2.4 Cr",
      icon: IndianRupee,
      change: "+18%",
    },
    {
      title: "Enquiries",
      value: "64",
      icon: MessageSquare,
      change: "+5%",
    },
  ]);

  // 🔥 CHART DATA
  const revenueData = [
    { name: "Jan", value: 40000 },
    { name: "Feb", value: 60000 },
    { name: "Mar", value: 80000 },
    { name: "Apr", value: 120000 },
    { name: "May", value: 150000 },
  ];

  const propertyData = [
    { name: "Delhi", value: 20 },
    { name: "Gurgaon", value: 35 },
    { name: "Noida", value: 25 },
    { name: "Mumbai", value: 15 },
  ];

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">
            Dashboard
          </h1>
          <p className="text-gray-500">
            Welcome back, Admin 👋
          </p>
        </div>

        {/* LOGOUT */}
        <button
          onClick={() => {
            localStorage.removeItem("token");
            router.push("/login");
          }}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
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
                {item.change} this month
              </div>
            </div>
          );
        })}
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="bg-white p-6 rounded-xl shadow-card">
          <h2 className="text-lg font-semibold text-primary mb-4">
            Revenue Growth
          </h2>

          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={revenueData}>
              <XAxis dataKey="name" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#0E4F3A"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-card">
          <h2 className="text-lg font-semibold text-primary mb-4">
            Properties by Location
          </h2>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={propertyData}>
              <XAxis dataKey="name" />
              <Tooltip />
              <Bar dataKey="value" fill="#C9A24D" radius={[6, 6, 0, 0]} />
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
            {[
              "Luxury Villa Delhi",
              "Modern Flat Gurgaon",
              "3BHK Noida",
            ].map((item, i) => (
              <div
                key={i}
                className="flex justify-between items-center border-b pb-2"
              >
                <span className="font-medium">{item}</span>
                <span className="text-sm text-gray-500">
                  ₹1.2 Cr
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

            <button className="w-full bg-gold text-black py-2 rounded-lg hover:bg-goldLight transition">
              View Enquiries
            </button>

            <button className="w-full border py-2 rounded-lg hover:bg-gray-100 transition">
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