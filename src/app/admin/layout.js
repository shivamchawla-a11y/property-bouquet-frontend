"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Home,
  PlusCircle,
  Users,
  MessageSquare,
  Menu,
} from "lucide-react";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const menu = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { name: "Properties", path: "/admin/properties", icon: Home },
    { name: "Add Property", path: "/admin/add-property", icon: PlusCircle },
    { name: "Users", path: "/admin/users", icon: Users },
    { name: "Enquiries", path: "/admin/enquiries", icon: MessageSquare },
  ];

  return (
    <div className="flex h-screen bg-lightBg">

      {/* SIDEBAR */}
      <aside
        className={`${
          collapsed ? "w-20" : "w-64"
        } bg-secondary text-white flex flex-col p-4 transition-all duration-300`}
      >
        {/* TOP */}
        <div className="flex items-center justify-between mb-8">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <Image src="/logo.png" width={35} height={35} alt="logo" />
              <span className="font-bold text-gold">Property Bouquet</span>
            </div>
          )}

          <button onClick={() => setCollapsed(!collapsed)}>
            <Menu />
          </button>
        </div>

        {/* NAV */}
        <nav className="space-y-2">
          {menu.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 p-3 rounded-lg transition ${
                  pathname === item.path
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

        {/* BOTTOM */}
        <div className="mt-auto">
          <button className="w-full bg-gold text-black py-2 rounded-lg hover:bg-goldLight font-semibold">
            {!collapsed ? "Logout" : "↩"}
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col">

        {/* TOPBAR */}
        <header className="bg-white border-b px-6 py-3 flex justify-between items-center">

          {/* LEFT */}
          <h2 className="text-lg font-semibold text-primary">
            Admin Panel
          </h2>

          {/* RIGHT */}
          <div className="flex items-center gap-4">

            {/* SEARCH */}
            <input
              placeholder="Search..."
              className="border px-3 py-1.5 rounded-lg outline-none focus:ring-2 focus:ring-primary text-sm"
            />

            {/* PROFILE */}
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-primary text-white flex items-center justify-center rounded-full">
                A
              </div>
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <main className="p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}