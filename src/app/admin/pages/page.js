"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  FileText,
  Eye,
  Pencil,
  Globe,
} from "lucide-react";

export default function PagesAdmin() {
  const [pages, setPages] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    pageType: "Custom",
  });

  // ================= FETCH =================
  const fetchPages = async () => {
    try {
      const res = await fetch(
        "https://property-bouquet-backend.onrender.com/api/pages",
        {
          credentials: "include",
        }
      );

      const data = await res.json();

      if (res.ok) {
        setPages(data.data || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  // ================= CREATE =================
  const handleCreate = async () => {
    try {
      const res = await fetch(
        "https://property-bouquet-backend.onrender.com/api/pages",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setShowModal(false);

        setForm({
          title: "",
          slug: "",
          pageType: "Custom",
        });

        fetchPages();
      } else {
        alert(data.message);
      }

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">

      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#0f3b2e]">
            Website Pages
          </h1>

          <p className="text-gray-500 mt-1">
            Manage static pages & landing pages
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="h-12 px-5 rounded-2xl bg-gradient-to-r from-[#c9a64b] to-[#e0be69] text-black font-semibold shadow-lg flex items-center gap-2"
        >
          <Plus size={18} />
          Create Page
        </button>
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
        <table className="w-full">
          <thead className="bg-[#f8faf9] text-gray-500 text-xs uppercase">
            <tr>
              <th className="p-4 text-left">Title</th>
              <th className="p-4 text-left">Slug</th>
              <th className="p-4 text-left">Type</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Created</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {pages.map((page) => (
              <tr
                key={page._id}
                className="border-t border-gray-100 hover:bg-[#fafdfb]"
              >
                <td className="p-4 font-semibold">
                  {page.title}
                </td>

                <td className="p-4 text-gray-500">
                  {page.pageType === "Home"
  ? "/"
  : `/${page.slug}`}
                </td>

                <td className="p-4">
  <span
    className={`px-3 py-1 rounded-full text-xs font-bold ${
      page.pageType === "Home"
        ? "bg-blue-100 text-blue-700"
        : "bg-gray-100 text-gray-700"
    }`}
  >
    {page.pageType}
  </span>
</td>

                <td className="p-4">
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
                    LIVE
                  </span>
                </td>

                <td className="p-4 text-sm text-gray-500">
                  {new Date(
                    page.createdAt
                  ).toLocaleDateString()}
                </td>

                <td className="p-4">
                  <div className="flex justify-end gap-2">

  {/* PREVIEW */}
  <button
    onClick={() =>
      window.open(
        page.pageType === "Home"
          ? "/"
          : `/${page.slug}`,
        "_blank"
      )
    }
    className="h-10 w-10 rounded-xl bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center transition"
    title="Preview Page"
  >
    <Eye size={16} />
  </button>

  {/* LIVE WEBSITE */}
  <button
    onClick={() =>
      window.open(
        page.pageType === "Home"
          ? "/"
          : `/${page.slug}`,
        "_blank"
      )
    }
    className="h-10 w-10 rounded-xl bg-black hover:bg-gray-800 text-white flex items-center justify-center transition"
    title="Open Live Website"
  >
    <Globe size={16} />
  </button>

  {/* EDIT */}
  <button
    className="h-10 w-10 rounded-xl bg-[#0f3b2e] hover:bg-[#145240] text-white flex items-center justify-center transition"
    title="Edit Page"
  >
    <Pencil size={16} />
  </button>

</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {pages.length === 0 && (
          <div className="p-10 text-center text-gray-500">
            No pages created yet
          </div>
        )}
      </div>

      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-5">
          <div className="w-full max-w-lg bg-white rounded-3xl p-7 shadow-2xl">

            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-2xl bg-[#0f3b2e] text-white flex items-center justify-center">
                <FileText />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-[#0f3b2e]">
                  Create New Page
                </h2>

                <p className="text-gray-500 text-sm">
                  Add a new static website page
                </p>
              </div>
            </div>

            <div className="space-y-5">

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Page Title
                </label>

                <input
                  value={form.title}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      title: e.target.value,
                    })
                  }
                  className="mt-2 w-full border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#0f3b2e]"
                  placeholder="About Us"
                />
              </div>

              {form.pageType !== "Home" && (
  <div>
    <label className="text-sm font-medium text-gray-700">
      Slug
    </label>

    <input
      value={form.slug}
      onChange={(e) =>
        setForm({
          ...form,
          slug: e.target.value,
        })
      }
      className="mt-2 w-full border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#0f3b2e]"
      placeholder="about-us"
    />
  </div>
)}

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Page Type
                </label>

                <select
                  value={form.pageType}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      pageType: e.target.value,
                    })
                  }
                  className="mt-2 w-full border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#0f3b2e]"
                >
                  <option>Home</option>
                    <option>Custom</option>
                    <option>About</option>
                  <option>Contact</option>
                  <option>Privacy</option>
                  <option>Terms</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3">

                <button
                  onClick={() => setShowModal(false)}
                  className="h-11 px-5 rounded-2xl border border-gray-200"
                >
                  Cancel
                </button>

                <button
                  onClick={handleCreate}
                  className="h-11 px-5 rounded-2xl bg-[#0f3b2e] text-white font-semibold"
                >
                  Create Page
                </button>

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}