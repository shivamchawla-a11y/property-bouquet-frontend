"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import {
  LayoutDashboard,
  MapPin,
  Building2,
  Home,
  PlusCircle,
  Users,
  Settings,
  Menu,
} from "lucide-react";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);

  // ✅ FINAL MENU (Add Property INCLUDED)
  const menu = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: LayoutDashboard,
    },
    {
      name: "Location",
      path: "/admin/location",
      icon: MapPin,
    },
    {
      name: "Developer",
      path: "/admin/developers",
      icon: Building2,
    },
    {
      name: "Property Inventory",
      path: "/admin/properties",
      icon: Home,
    },

    // 🔥 KEEP THIS (as you requested)
    {
      name: "Add Property",
      path: "/admin/add-property",
      icon: PlusCircle,
    },

    {
      name: "Lead CRM",
      path: "/admin/leads",
      icon: Users,
    },
    {
      name: "Site Settings",
      path: "/admin/settings",
      icon: Settings,
    },
  ];

  // 🔐 AUTH CHECK
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(
          "https://property-bouquet-backend.onrender.com/api/auth/me",
          {
            credentials: "include",
          }
        );

        if (!res.ok) {
          router.push("/login");
        } else {
          setLoading(false);
        }
      } catch (err) {
        router.push("/login");
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray-500">Checking authentication...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-lightBg">

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`${
          collapsed ? "w-20" : "w-64"
        } bg-secondary text-white flex flex-col p-4 transition-all duration-300`}
      >
        {/* LOGO */}
        <div className="flex items-center justify-between mb-8">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <Image src="/logo.png" width={35} height={35} alt="logo" />
              <span className="font-bold text-gold">
                Property Bouquet
              </span>
            </div>
          )}

          <button onClick={() => setCollapsed(!collapsed)}>
            <Menu />
          </button>
        </div>

        {/* MENU */}
        <nav className="space-y-2">
          {menu.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.path;

            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 p-3 rounded-lg transition ${
                  active
                    ? "bg-primary shadow-soft"
                    : "hover:bg-primary/50"
                }`}
              >
                <Icon size={20} />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* LOGOUT */}
        <div className="mt-auto">
          <button
            onClick={async () => {
              await fetch(
                "https://property-bouquet-backend.onrender.com/api/auth/logout",
                {
                  method: "POST",
                  credentials: "include",
                }
              );

              window.location.href = "/login";
            }}
            className="w-full bg-gold text-black py-2 rounded-lg hover:bg-goldLight font-semibold"
          >
            {!collapsed ? "Logout" : "↩"}
          </button>
        </div>
      </aside>

      {/* ================= MAIN ================= */}
      <div className="flex-1 flex flex-col">

        {/* HEADER */}
        <header className="bg-white border-b px-6 py-3 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-primary">
            Admin Panel
          </h2>

          <input
            placeholder="Search..."
            className="border px-3 py-1.5 rounded-lg outline-none focus:ring-2 focus:ring-primary text-sm"
          />
        </header>

        {/* CONTENT */}
        <main className="p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}