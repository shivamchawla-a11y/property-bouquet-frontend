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

  // ================= FETCH PAGES =================

  const fetchPages = async () => {
    try {

      const res = await fetch(
        "/api/pages",
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

  // ================= CREATE PAGE =================

  const handleCreate = async () => {

    try {

      const res = await fetch(
        "/api/pages",
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

    <div className="min-h-screen bg-[#f4f7fb] p-6 text-gray-800">

      {/* ================= HEADER ================= */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">

        <div>

          <h1 className="text-4xl font-bold text-[#0f3b2e]">
            Website Pages
          </h1>

          <p className="text-gray-500 mt-2 text-base">
            Manage static pages & landing pages
          </p>

        </div>

        <button
          onClick={() => setShowModal(true)}
          className="h-12 px-6 rounded-2xl bg-gradient-to-r from-[#c9a64b] to-[#e0be69] text-black font-semibold shadow-lg flex items-center gap-2 hover:scale-[1.02] transition"
        >
          <Plus size={18} />

          Create Page
        </button>

      </div>

      {/* ================= TABLE ================= */}

      <div className="bg-white rounded-3xl shadow-md overflow-hidden border border-gray-100">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1000px]">

            <thead className="bg-[#f8fafc] border-b border-gray-200">

              <tr className="text-left text-gray-700">

                <th className="px-6 py-5 text-sm font-bold">
                  Title
                </th>

                <th className="px-6 py-5 text-sm font-bold">
                  Slug
                </th>

                <th className="px-6 py-5 text-sm font-bold">
                  Type
                </th>

                <th className="px-6 py-5 text-sm font-bold">
                  Status
                </th>

                <th className="px-6 py-5 text-sm font-bold">
                  Created
                </th>

                <th className="px-6 py-5 text-right text-sm font-bold">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {pages.length > 0 ? (

                pages.map((page) => (

                  <tr
                    key={page._id}
                    className="border-b border-gray-100 hover:bg-[#fafdfb] transition"
                  >

                    {/* TITLE */}

                    <td className="px-6 py-5">

                      <div className="font-semibold text-gray-900 text-base">
                        {page.title}
                      </div>

                    </td>

                    {/* SLUG */}

                    <td className="px-6 py-5">

                      <div className="text-gray-600 font-medium">
                        {page.pageType === "Home"
                          ? "/"
                          : `/${page.slug}`}
                      </div>

                    </td>

                    {/* TYPE */}

                    <td className="px-6 py-5">

                      <span
                        className={`px-4 py-2 rounded-full text-xs font-bold ${
                          page.pageType === "Home"
                            ? "bg-blue-100 text-blue-700 border border-blue-200"
                            : "bg-gray-100 text-gray-700 border border-gray-200"
                        }`}
                      >
                        {page.pageType}
                      </span>

                    </td>

                    {/* STATUS */}

                    <td className="px-6 py-5">

                      <span className="px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold">
                        LIVE
                      </span>

                    </td>

                    {/* CREATED */}

                    <td className="px-6 py-5 text-sm text-gray-600 font-medium">

                      {new Date(page.createdAt).toLocaleDateString()}

                    </td>

                    {/* ACTIONS */}

                    <td className="px-6 py-5">

                      <div className="flex justify-end gap-3">

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
                          className="h-11 w-11 rounded-2xl bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center transition shadow-sm"
                          title="Preview Page"
                        >
                          <Eye size={17} />
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
                          className="h-11 w-11 rounded-2xl bg-black hover:bg-gray-800 text-white flex items-center justify-center transition shadow-sm"
                          title="Open Live Website"
                        >
                          <Globe size={17} />
                        </button>

                        {/* EDIT */}

                        <button
                          className="h-11 w-11 rounded-2xl bg-[#0f3b2e] hover:bg-[#145240] text-white flex items-center justify-center transition shadow-sm"
                          title="Edit Page"
                        >
                          <Pencil size={17} />
                        </button>

                      </div>

                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan="6"
                    className="py-20 text-center text-gray-500 text-lg"
                  >
                    No pages created yet
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* ================= CREATE MODAL ================= */}

      {showModal && (

        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-5">

          <div className="w-full max-w-xl bg-white rounded-3xl p-7 shadow-2xl">

            {/* HEADER */}

            <div className="flex items-center gap-4 mb-8">

              <div className="h-14 w-14 rounded-2xl bg-[#0f3b2e] text-white flex items-center justify-center shadow-md">

                <FileText size={24} />

              </div>

              <div>

                <h2 className="text-3xl font-bold text-[#0f3b2e]">
                  Create New Page
                </h2>

                <p className="text-gray-500 text-sm mt-1">
                  Add a new static website page
                </p>

              </div>

            </div>

            {/* FORM */}

            <div className="space-y-6">

              {/* TITLE */}

              <div>

                <label className="text-sm font-semibold text-gray-700">
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
                  className="mt-2 w-full border border-gray-300 text-gray-800 rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-[#0f3b2e]"
                  placeholder="About Us"
                />

              </div>

              {/* SLUG */}

              {form.pageType !== "Home" && (

                <div>

                  <label className="text-sm font-semibold text-gray-700">
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
                    className="mt-2 w-full border border-gray-300 text-gray-800 rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-[#0f3b2e]"
                    placeholder="about-us"
                  />

                </div>

              )}

              {/* PAGE TYPE */}

              <div>

                <label className="text-sm font-semibold text-gray-700">
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
                  className="mt-2 w-full border border-gray-300 text-gray-800 rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-[#0f3b2e] bg-white"
                >

                  <option value="Home">Home</option>

                  <option value="Custom">Custom</option>

                  <option value="About">About</option>

                  <option value="Contact">Contact</option>

                  <option value="Privacy">Privacy</option>

                  <option value="Terms">Terms</option>

                </select>

              </div>

              {/* BUTTONS */}

              <div className="flex justify-end gap-4 pt-4">

                <button
                  onClick={() => setShowModal(false)}
                  className="h-12 px-6 rounded-2xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition"
                >
                  Cancel
                </button>

                <button
                  onClick={handleCreate}
                  className="h-12 px-6 rounded-2xl bg-[#0f3b2e] hover:bg-[#145240] text-white font-semibold transition shadow-md"
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