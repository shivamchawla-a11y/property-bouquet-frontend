"use client";

import { useState, useEffect } from "react";
import RedirectModal from "./RedirectModal";
import DeleteRedirectModal from "./DeleteRedirectModal";
import {
  Plus,
  Search,
  ArrowRight,
  Edit,
  Trash2,
  CheckCircle2,
  Link2,
  RefreshCw,
} from "lucide-react";

const API =
  "https://property-bouquet-backend.onrender.com/api/redirections";

export default function RedirectionsPage() {
  const [search, setSearch] = useState("");
  const [redirects, setRedirects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
const [selectedRedirect, setSelectedRedirect] = useState(null);
const [deleteOpen, setDeleteOpen] = useState(false);
const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchRedirects = async () => {
    try {
      setLoading(true);

      const res = await fetch(API, {
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch redirects");
      }

      const data = await res.json();

      setRedirects(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setRedirects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRedirects();
  }, []);

  const filtered = redirects.filter((r) => {
    const from = (r.from || "").toLowerCase();
    const to = (r.to || "").toLowerCase();

    return (
      from.includes(search.toLowerCase()) ||
      to.includes(search.toLowerCase())
    );
  });

  const totalRedirects = redirects.length;

 const activeRedirects = redirects.filter(
  (r) => r.active
).length;

  const totalHits = redirects.reduce(
    (sum, r) => sum + (r.hits || 0),
    0
  );

  const handleDelete = async () => {
  if (!selectedRedirect) return;

  try {
    setDeleteLoading(true);

    const res = await fetch(
      `${API}/${selectedRedirect._id}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    if (!res.ok) {
      throw new Error("Delete failed");
    }

    setDeleteOpen(false);
    setSelectedRedirect(null);

    fetchRedirects();
  } catch (err) {
    console.error(err);
  } finally {
    setDeleteLoading(false);
  }
};

  const handleToggle = async (id) => {
    try {
      const res = await fetch(`${API}/${id}/toggle`, {
        method: "PATCH",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Toggle failed");
      }

      fetchRedirects();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
  {/* ================= HEADER ================= */}

  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">
    <div>
      <h1 className="text-3xl font-bold text-[#14352b]">
        URL Redirections
      </h1>

      <p className="text-[#6b7280] mt-2">
        Manage 301 & 302 redirects for better SEO and user experience.
      </p>
    </div>

    <button
  onClick={() => {
    setSelectedRedirect(null);
    setShowModal(true);
  }}
  className="bg-gradient-to-r from-[#0f3b2e] to-[#15503d] hover:opacity-90 text-white px-6 py-3 rounded-2xl flex items-center gap-3 shadow-lg"
>
  <Plus size={18} />
  Add Redirection
</button>
  </div>

  {/* ================= STATS ================= */}

  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

    {/* TOTAL */}

    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm text-gray-500">
            Total Redirects
          </p>

          <h2 className="text-3xl font-bold text-[#14352b] mt-2">
            {totalRedirects}
          </h2>

        </div>

        <div className="w-14 h-14 rounded-2xl bg-[#0f3b2e]/10 flex items-center justify-center">
          <Link2
            size={28}
            className="text-[#0f3b2e]"
          />
        </div>

      </div>
    </div>

    {/* ACTIVE */}

    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm text-gray-500">
            Active Redirects
          </p>

          <h2 className="text-3xl font-bold text-green-600 mt-2">
            {activeRedirects}
          </h2>

        </div>

        <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center">
          <CheckCircle2
            size={28}
            className="text-green-600"
          />
        </div>

      </div>
    </div>

    {/* HITS */}

    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm text-gray-500">
            Total Hits
          </p>

          <h2 className="text-3xl font-bold text-[#14352b] mt-2">
            {totalHits}
          </h2>

        </div>

        <div className="w-14 h-14 rounded-2xl bg-[#c9a64b]/20 flex items-center justify-center">
          <RefreshCw
            size={28}
            className="text-[#b68b32]"
          />
        </div>

      </div>
    </div>

  </div>

  {/* ================= TABLE ================= */}

  <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">

    {/* SEARCH */}

    <div className="p-6 border-b border-gray-200 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

      <div className="relative w-full lg:w-[360px]">

        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          placeholder="Search redirects..."
          className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 text-[#14352b] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#c9a64b]"
        />

      </div>

    </div>

    <div className="overflow-x-auto">

      <table className="min-w-full">

        <thead className="bg-[#fafafa]">

          <tr className="text-left text-sm text-[#6b7280]">

            <th className="px-6 py-4">
              From URL
            </th>

            <th className="px-6 py-4">
              Redirect To
            </th>

            <th className="px-6 py-4">
              Type
            </th>

            <th className="px-6 py-4">
              Status
            </th>

            <th className="px-6 py-4">
              Hits
            </th>

            <th className="px-6 py-4 text-right">
              Actions
            </th>

          </tr>

        </thead>

        <tbody>

          {loading ? (

            <tr>

              <td
                colSpan={6}
                className="py-20 text-center text-gray-500"
              >
                Loading redirects...
              </td>

            </tr>

          ) : filtered.length === 0 ? (

            <tr>

              <td
                colSpan={6}
                className="py-20 text-center text-gray-500"
              >
                No redirects found.
              </td>

            </tr>

          ) : (
            filtered.map((item) => (

  <tr
    key={item._id}
    className="border-t border-gray-100 hover:bg-[#fafafa] transition-colors"
  >

    {/* FROM URL */}

    <td className="px-6 py-5">

      <p className="font-semibold text-[#14352b] break-all">
        {item.from}
      </p>

    </td>

    {/* TO URL */}

    <td className="px-6 py-5">

      <div className="flex items-center gap-3">

        <ArrowRight
          size={16}
          className="text-[#c9a64b] flex-shrink-0"
        />

        <p className="text-[#14352b] break-all">
          {item.to}
        </p>

      </div>

    </td>

    {/* TYPE */}

    <td className="px-6 py-5">

      <span className="inline-flex items-center rounded-full bg-blue-100 text-blue-700 px-3 py-1 text-sm font-semibold">
        {item.type}
      </span>

    </td>

    {/* STATUS */}

    <td className="px-6 py-5">

      <button
        onClick={() => handleToggle(item._id)}
        className={`px-3 py-1 rounded-full text-sm font-semibold transition
          ${
            item.active
              ? "bg-green-100 text-green-700 hover:bg-green-200"
              : "bg-red-100 text-red-700 hover:bg-red-200"
          }`}
      >
        {item.active ? "Active" : "Inactive"}
      </button>

    </td>

    {/* HITS */}

    <td className="px-6 py-5">

      <span className="font-semibold text-[#14352b]">
        {item.hits || 0}
      </span>

    </td>

    {/* ACTIONS */}

    <td className="px-6 py-5">

      <div className="flex justify-end gap-3">

        {/* EDIT */}

        <button
  onClick={() => {
    setSelectedRedirect(item);
    setShowModal(true);
  }}
  className="w-10 h-10 rounded-xl border border-gray-300 hover:bg-[#f5f5f5] flex items-center justify-center transition"
>
          <Edit
            size={18}
            className="text-[#14352b]"
          />
        </button>

        {/* DELETE */}

        <button
          onClick={() => {
  setSelectedRedirect(item);
  setDeleteOpen(true);
}}
          className="w-10 h-10 rounded-xl border border-red-200 hover:bg-red-50 flex items-center justify-center transition"
        >
          <Trash2
            size={18}
            className="text-red-600"
          />
        </button>

      </div>

    </td>

  </tr>

))
          )}

        </tbody>

      </table>

    </div>

  </div>

    <RedirectModal
      open={showModal}
      redirect={selectedRedirect}
      onClose={() => {
        setShowModal(false);
        setSelectedRedirect(null);
      }}
      onSuccess={fetchRedirects}
    />

    <DeleteRedirectModal
  open={deleteOpen}
  redirect={selectedRedirect}
  deleting={deleteLoading}
  onCancel={() => {
    setDeleteOpen(false);
    setSelectedRedirect(null);
  }}
  onDelete={handleDelete}
/>
  </>

);
}