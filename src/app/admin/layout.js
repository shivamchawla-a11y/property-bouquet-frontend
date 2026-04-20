"use client";

import Link from "next/link";
import "./globals.css";

export default function AdminLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-100">

      {/* SIDEBAR */}
      <aside className="w-64 bg-black text-white flex flex-col p-5">
        <h1 className="text-xl font-bold mb-10">Property Bouquet</h1>

        <nav className="space-y-4">
          <Link href="/admin" className="block hover:text-gray-300">
            Dashboard
          </Link>

          <Link href="/admin/properties" className="block hover:text-gray-300">
            Properties
          </Link>

          <Link href="/admin/locations" className="block hover:text-gray-300">
            Locations
          </Link>

          <Link href="/admin/builders" className="block hover:text-gray-300">
            Builders
          </Link>
        </nav>

        <button
          onClick={() => {
            document.cookie = "token=; path=/; max-age=0";
            window.location.href = "/login";
          }}
          className="mt-auto bg-red-500 p-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col">

        {/* HEADER */}
        <header className="bg-white shadow px-6 py-4 flex justify-between">
          <h2 className="font-semibold">Admin Panel</h2>
          <span className="text-sm text-gray-500">Welcome Admin</span>
        </header>

        {/* CONTENT */}
        <main className="p-6 overflow-y-auto">
          {children}
        </main>

      </div>
    </div>
  );
}