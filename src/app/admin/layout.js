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
  Tag,
  FileText,
  Newspaper,
  BookOpen,
  Route,
  Layers3,
} from "lucide-react";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const isPreview = pathname.startsWith("/admin/preview");
  const router = useRouter();

  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);

  // ================= MENU =================
  const menu = [
    // ================= ALL ADMINS =================
    {
      name: "Dashboard",
      path: "/admin",
      icon: LayoutDashboard,
    },

    {
      name: "Property Inventory",
      path: "/admin/properties",
      icon: Home,
    },

    {
      name: "Add Property",
      path: "/admin/add-property",
      icon: PlusCircle,
    },

    {
      name: "Market Insights",
      path: "/admin/insights",
      icon: Newspaper,
    },

    {
      name: "Knowledge Centre",
      path: "/admin/knowledge",
      icon: BookOpen,
    },

    // ================= SUPER ADMIN ONLY =================

    {
      name: "Location",
      path: "/admin/location",
      icon: MapPin,
      roles: ["SuperAdmin"],
    },

    {
      name: "Developer",
      path: "/admin/developers",
      icon: Building2,
    },

    {
      name: "Categories",
      path: "/admin/categories",
      icon: Tag,
      roles: ["SuperAdmin"],
    },

    {
      name: "Pages",
      path: "/admin/pages",
      icon: FileText,
      roles: ["SuperAdmin"],
    },

    {
      name: "Collection Engine",
      path: "/admin/collections",
      icon: Layers3,
      roles: ["SuperAdmin"],
    },

    {
      name: "Redirections",
      path: "/admin/redirections",
      icon: Route,
      roles: ["SuperAdmin"],
    },

    {
      name: "Lead CRM",
      path: "/admin/leads",
      icon: Users,
      roles: ["SuperAdmin"],
    },

    {
      name: "Site Settings",
      path: "/admin/site-settings/team",
      icon: Settings,
      roles: ["SuperAdmin"],
    },
  ];

  // ================= AUTH CHECK =================
  useEffect(() => {
    // Skip auth check on preview pages
    if (isPreview) {
      setLoading(false);
      return;
    }

    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include",
        });

        const data = await res.json();

        if (!res.ok) {
          router.push("/login");
        } else {
          setRole(data.user.role);
          setLoading(false);
        }
      } catch (err) {
        router.push("/login");
      }
    };

    checkAuth();
  }, [router, isPreview]);

 // ================= LOADING =================
if (!isPreview && (loading || !role)) {
  return (
    <div className="min-h-screen bg-[#fbfaf7] px-6 flex items-center justify-center">
      <div className="flex w-full max-w-[420px] flex-col items-center text-center">

        {/* LOGO */}
        <div className="relative flex items-center justify-center">
          <div className="absolute h-28 w-28 rounded-full bg-[#D4AF37]/10 blur-2xl animate-pulse" />

          <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-[#D4AF37]/25 bg-white shadow-[0_15px_45px_rgba(0,0,0,0.08)]">
            <img
              src="/logo.webp"
              alt="Property Bouquet"
              className="h-14 w-14 object-contain"
            />
          </div>
        </div>

        {/* BRAND */}
        <h2 className="mt-7 font-serif text-[25px] font-medium tracking-[0.5px] text-[#10251f]">
          Property Bouquet
        </h2>

        {/* LOADING TEXT */}
        <p className="mt-2 text-[11px] font-medium uppercase tracking-[2.5px] text-[#b58b45]">
          Securing your dashboard
        </p>

        {/* LOADING BAR */}
        <div className="mt-7 h-[2px] w-[180px] overflow-hidden rounded-full bg-[#e9e2d5]">
          <div className="h-full w-1/2 rounded-full bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent animate-[loading_1.5s_ease-in-out_infinite]" />
        </div>

        {/* SUBTEXT */}
        <p className="mt-4 text-[11px] leading-5 text-[#999]">
          Verifying your administrator access...
        </p>
      </div>

      <style jsx>{`
        @keyframes loading {
          0% {
            transform: translateX(-100%);
          }

          100% {
            transform: translateX(200%);
          }
        }
      `}</style>
    </div>
  );
}

  // ================= PREVIEW PAGE =================
  if (isPreview) {
    return children;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#f7f9f8]">

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`${
          collapsed ? "w-20" : "w-72"
        } bg-[#0f3b2e] text-white flex flex-col transition-all duration-300 h-screen overflow-y-auto border-r border-white/10`}
      >

        {/* ================= TOP ================= */}
        <div className="sticky top-0 z-20 bg-[#0f3b2e] px-4 py-5 border-b border-white/10">
          <div className="flex items-center justify-between">

            {!collapsed && (
              <div className="flex items-center gap-3">

                <div className="bg-white rounded-2xl p-2 shadow-lg">
                  <Image
                    src="/logo.webp"
                    width={34}
                    height={34}
                    alt="logo"
                  />
                </div>

                <div>
                  <h2 className="font-bold text-white leading-tight">
                    Property Bouquet
                  </h2>

                  <p className="text-xs text-white/60">
                    Admin Dashboard
                  </p>
                </div>

              </div>
            )}

            <button
              onClick={() => setCollapsed(!collapsed)}
              className="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-white/10 transition"
            >
              <Menu size={20} />
            </button>

          </div>
        </div>

        {/* ================= MENU ================= */}
        <nav className="flex-1 px-3 py-5 space-y-2">

          {menu
            .filter((item) => {
              // No roles = available to every authenticated admin
              if (!item.roles) return true;

              // Roles = SuperAdmin only
              return item.roles.includes(role);
            })
            .map((item) => {

              const Icon = item.icon;

              const active =
  item.path === "/admin"
    ? pathname === "/admin"
    : pathname === item.path ||
      pathname.startsWith(item.path + "/");

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`group flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 ${
                    active
                      ? "bg-gradient-to-r from-[#c9a64b] to-[#e0be69] text-black shadow-lg"
                      : "hover:bg-white/10 text-white/90"
                  }`}
                >

                  <div
                    className={`flex items-center justify-center ${
                      active
                        ? "text-black"
                        : "text-white/80"
                    }`}
                  >
                    <Icon size={20} />
                  </div>

                  {!collapsed && (
                    <span className="font-medium text-sm">
                      {item.name}
                    </span>
                  )}

                </Link>
              );
            })}

        </nav>

        {/* ================= FOOTER ================= */}
        <div className="p-4 border-t border-white/10 sticky bottom-0 bg-[#0f3b2e]">

          <button
            onClick={async () => {
              await fetch("/api/auth/logout", {
                method: "POST",
                credentials: "include",
              });

              window.location.href = "/login";
            }}
            className="w-full bg-gradient-to-r from-[#c9a64b] to-[#e0be69] hover:opacity-90 text-black py-3 rounded-2xl font-bold transition shadow-lg"
          >
            {!collapsed ? "Logout" : "↩"}
          </button>

        </div>

      </aside>

      {/* ================= MAIN ================= */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* ================= CONTENT ================= */}
        <main className="flex-1 overflow-auto p-6 bg-[#f7f9f8]">
          {children}
        </main>

      </div>

    </div>
  );
}
