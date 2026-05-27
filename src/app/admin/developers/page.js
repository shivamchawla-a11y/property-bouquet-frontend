"use client";

import { useState, useEffect } from "react";
import {
  Building2,
  Trash2,
  Eye,
  RefreshCw,
  Plus,
} from "lucide-react";

import Link from "next/link";
import toast from "react-hot-toast";

export default function DevelopersPage() {
  const API =
    "https://property-bouquet-backend.onrender.com/api";

  const [developers, setDevelopers] =
    useState([]);

  const [name, setName] = useState("");
  const [logo, setLogo] = useState("");

  // NEW
  const [
    developerImage,
    setDeveloperImage,
  ] = useState("");
  const [description, setDescription] =
  useState("");

  // EDIT MODE
  const [
    editingDeveloper,
    setEditingDeveloper,
  ] = useState(null);

  const [loading, setLoading] =
    useState(true);

  const [uploading, setUploading] =
    useState(false);

  const [search, setSearch] =
    useState("");

  // ================= PAGINATION =================
  const [currentPage, setCurrentPage] =
    useState(1);

  const itemsPerPage = 8;

  // ================= FETCH =================
  const fetchDevelopers = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `${API}/developers`
      );

      const data = await res.json();

      if (res.ok)
        setDevelopers(data.data || []);
    } catch (err) {
      console.error(err);

      toast.error(
        "Failed to load developers ❌"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevelopers();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // ================= VALIDATE FILE =================
const validateFile = (file) => {
  if (!file) return false;

  if (!file.type.startsWith("image/")) {
    toast.error("Only image files allowed ❌");
    return false;
  }

  if (file.size > 5 * 1024 * 1024) {
    toast.error("Max file size is 5MB ❌");
    return false;
  }

  return true;
};

// ================= UPLOAD IMAGE (NO WATERMARK) =================
const uploadImage = async (file) => {
  try {
    const data = new FormData();

    data.append("file", file);

    const res = await fetch(
      "https://property-bouquet-backend.onrender.com/api/developer-upload",
      {
        method: "POST",
        body: data,
      }
    );

    const result = await res.json();

    if (!res.ok || !result.url) {
      throw new Error(
        result.message || "Upload failed"
      );
    }

    return result.url;

  } catch (err) {
    console.error(err);

    toast.error("Upload failed ❌");

    return null;
  }
};

// ================= LOGO UPLOAD =================
const handleLogoUpload = async (file) => {
  if (!validateFile(file)) return;

  setUploading(true);

  const url = await uploadImage(file);

  if (url) {
    setLogo(url);

    toast.success("Logo uploaded ✅");
  }

  setUploading(false);
};

// ================= DEVELOPER IMAGE UPLOAD =================
const handleDeveloperImageUpload =
  async (file) => {
    if (!validateFile(file)) return;

    setUploading(true);

    const url = await uploadImage(file);

    if (url) {
      setDeveloperImage(url);

      toast.success(
        "Developer image uploaded ✅"
      );
    }

    setUploading(false);
  };

  // ================= ADD / EDIT =================
  const addDeveloper = async () => {
    if (!name.trim()) return;

    try {
      const payload = {
        name,
        logo,
        image: developerImage,
        description,
      };

      const url = editingDeveloper
        ? `${API}/developers/${editingDeveloper._id}`
        : `${API}/developers`;

      const method = editingDeveloper
        ? "PUT"
        : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(
          data.message || "Failed ❌"
        );

        return;
      }

      toast.success(
        editingDeveloper
          ? "Developer updated ✅"
          : "Developer added ✅"
      );

      setName("");
      setLogo("");
      setDeveloperImage("");
      setDescription("");
      setEditingDeveloper(null);

      fetchDevelopers();
    } catch (err) {
      console.error(err);

      toast.error("Server error ❌");
    }
  };

  // ================= DELETE =================
  const deleteDeveloper = async (id) => {
    if (
      !confirm("Delete developer?")
    )
      return;

    try {
      const res = await fetch(
        `${API}/developers/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        toast.error(
          "Delete failed ❌"
        );

        return;
      }

      toast.success("Deleted 🗑️");

      fetchDevelopers();
    } catch (err) {
      console.error(err);

      toast.error("Server error ❌");
    }
  };

  // ================= EDIT =================
  const editDeveloper = (dev) => {
    setEditingDeveloper(dev);

    setName(dev.name || "");
    setLogo(dev.logo || "");

    setDeveloperImage(
      dev.image || ""
    );

    setDescription(
      dev.description || ""
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ================= SEARCH =================
  const filteredDevelopers =
    developers.filter((dev) =>
      dev.name
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  // ================= PAGINATION =================
  const totalPages = Math.ceil(
    filteredDevelopers.length /
      itemsPerPage
  );

  const startIndex =
    (currentPage - 1) *
    itemsPerPage;

  const paginatedDevelopers =
    filteredDevelopers.slice(
      startIndex,
      startIndex + itemsPerPage
    );

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center text-sm font-medium text-gray-600">
        Loading developers...
      </div>
    );
  }

  return (
    <div className="p-4 bg-[#f7f8f7] min-h-screen space-y-5">

      {/* ================= LOADER ================= */}
{uploading && (
  <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center">
    <div className="bg-white px-6 py-4 rounded-2xl shadow-xl text-sm font-semibold">
      Uploading image...
    </div>
  </div>
)}

      {/* ================= HEADER ================= */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

        <div>
          <h1 className="text-3xl font-extrabold text-[#0f3b2e] flex items-center gap-2 tracking-tight">
            <Building2 size={24} />
            Developers
          </h1>

          <p className="text-xs text-gray-600 mt-1 font-medium">
            Manage developer
            profiles, logos and
            public pages
          </p>
        </div>

        <button
          onClick={
            fetchDevelopers
          }
          className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-xl flex items-center gap-2 hover:bg-gray-100 transition text-sm font-semibold shadow-sm w-fit"
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>

      {/* ================= SEARCH ================= */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200">

        <input
          placeholder="Search developers..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          className="w-full border border-gray-300 text-sm text-gray-800 placeholder:text-gray-400 px-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-[#0f3b2e]"
        />
      </div>

      {/* ================= ADD / EDIT FORM ================= */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">

        <div className="flex items-center justify-between mb-4">

          <div className="flex items-center gap-2">
            <Plus
              size={18}
              className="text-[#0f3b2e]"
            />

            <h2 className="font-bold text-[#0f3b2e] text-lg">
              {editingDeveloper
                ? "Edit Developer"
                : "Add Developer"}
            </h2>
          </div>

          {editingDeveloper && (
            <button
              onClick={() => {
                setEditingDeveloper(
                  null
                );

                setName("");
                setLogo("");
                setDeveloperImage("");
                setDescription("");
                
              }}
              className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition font-semibold"
            >
              Cancel Edit
            </button>
          )}
        </div>

        <div className="grid lg:grid-cols-4 gap-3">

          {/* NAME */}
          <input
            value={name}
            onChange={(e) =>
              setName(
                e.target.value
              )
            }
            placeholder="Developer Name"
            className="border border-gray-300 text-sm text-gray-800 placeholder:text-gray-400 px-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-[#0f3b2e]"
          />

          {/* LOGO */}
<div
  onClick={() =>
    document
      .getElementById("logoUpload")
      .click()
  }
  className="border border-dashed border-gray-300 rounded-xl px-4 py-2.5 flex items-center justify-center text-sm text-gray-500 cursor-pointer hover:bg-gray-50 transition"
>
  Upload Logo
</div>

<input
  id="logoUpload"
  type="file"
  hidden
  accept="image/*"
  onChange={(e) => {
    handleLogoUpload(
      e.target.files[0]
    );

    e.target.value = "";
  }}
/>

          {/* IMAGE */}
<div
  onClick={() =>
    document
      .getElementById("developerImageUpload")
      .click()
  }
  className="border border-dashed border-gray-300 rounded-xl px-4 py-2.5 flex items-center justify-center text-sm text-gray-500 cursor-pointer hover:bg-gray-50 transition"
>
  Upload Developer Image
</div>

<input
  id="developerImageUpload"
  type="file"
  hidden
  accept="image/*"
  onChange={(e) => {
    handleDeveloperImageUpload(
      e.target.files[0]
    );

    e.target.value = "";
  }}
/>

          {/* BUTTON */}
          <button
            onClick={addDeveloper}
            className="bg-[#0f3b2e] hover:bg-[#145240] text-white rounded-xl text-sm font-semibold transition shadow-sm"
          >
            {editingDeveloper
              ? "Update Developer"
              : "Add Developer"}
          </button>
        </div>

              {/* ================= DESCRIPTION ================= */}
<div className="mt-5">

  <label className="block text-sm font-semibold text-gray-700 mb-2">
    About Developer
  </label>

  <textarea
    value={description}
    onChange={(e) =>
      setDescription(
        e.target.value
      )
    }
    placeholder="Write detailed information about the developer, legacy, projects, trust, experience, achievements, luxury positioning etc..."
    rows={8}
    className="w-full border border-gray-300 text-sm text-gray-800 placeholder:text-gray-400 px-4 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-[#0f3b2e] resize-y min-h-[220px]"
  />

  <div className="flex items-center justify-between mt-2">

    <p className="text-xs text-gray-500">
      This content will appear on developer profile page
    </p>

    <p className="text-xs text-gray-400">
      {description.length} characters
    </p>

  </div>
</div>

        {/* PREVIEW */}
        {(logo ||
          developerImage) && (
          <div className="mt-5 grid md:grid-cols-2 gap-4">

            {/* LOGO */}
            {logo && (
              <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl p-3">

                <img
                  src={logo}
                  className="h-12 w-12 object-contain rounded-lg bg-white border"
                  alt="logo preview"
                />

                <div>
                  <p className="text-sm font-semibold text-gray-700">
                    Logo Preview
                  </p>

                  <p className="text-xs text-gray-500">
                    Developer Logo
                  </p>
                </div>
              </div>
            )}

            {/* IMAGE */}
            {developerImage && (
              <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl p-3">

                <img
                  src={
                    developerImage
                  }
                  className="h-14 w-20 object-cover rounded-lg border"
                  alt="developer preview"
                />

                <div>
                  <p className="text-sm font-semibold text-gray-700">
                    Developer Image
                  </p>

                  <p className="text-xs text-gray-500">
                    Cover / Banner
                    Image
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[950px]">

            {/* HEAD */}
            <thead className="bg-[#f5f7f6] text-gray-700 text-[11px] uppercase tracking-wider sticky top-0 z-10">

              <tr>
                <th className="p-3 text-left font-bold w-[60px]">
                  Sr.
                </th>

                <th className="p-3 text-left font-bold">
                  Image
                </th>

                <th className="p-3 text-left font-bold">
                  Logo
                </th>

                <th className="p-3 text-left font-bold">
                  Developer Name
                </th>

                <th className="p-3 text-left font-bold">
                  Slug
                </th>

                <th className="p-3 text-left font-bold">
                  Created
                </th>

                <th className="p-3 text-right font-bold">
                  Actions
                </th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody>
              {paginatedDevelopers.length >
              0 ? (
                paginatedDevelopers.map(
                  (
                    dev,
                    index
                  ) => (
                    <tr
                      key={
                        dev._id
                      }
                      className="border-t border-gray-200 hover:bg-[#f7faf8] transition duration-200"
                    >

                      {/* SR */}
                      <td className="p-3 text-sm font-semibold text-gray-500">
                        {startIndex +
                          index +
                          1}
                      </td>

                      {/* IMAGE */}
                      <td className="p-3">
                        <div className="h-14 w-24 rounded-xl overflow-hidden border border-gray-200 bg-gray-100">

              {dev.image ? (
                <img
                  src={dev.image}
                  className="h-full w-full object-cover"
                  alt={dev.name}
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-[10px] text-gray-400">
                  No Image
                </div>
              )}
                        </div>
                      </td>

                      {/* LOGO */}
                      <td className="p-3">
                        <div className="h-10 w-10 rounded-xl overflow-hidden border border-gray-200 bg-white flex items-center justify-center">

                          {dev.logo ? (
  <img
    src={dev.logo}
    className="h-8 w-8 object-contain"
    alt={dev.name}
  />
) : (
  <div className="text-[10px] text-gray-400">
    No Logo
  </div>
)}

                        </div>
                      </td>

                      {/* NAME */}
                      <td className="p-3">

                        <div className="max-w-[220px] truncate">

                          <p className="text-sm font-semibold text-gray-800 truncate">
                            {
                              dev.name
                            }
                          </p>

                          <p className="text-[11px] text-gray-400">
                            Developer
                            Profile
                          </p>
                        </div>
                      </td>

                      {/* SLUG */}
                      <td className="p-3 text-xs text-gray-600 font-medium">
                        /
                        {dev.slug}
                      </td>

                      {/* DATE */}
                      <td className="p-3 text-xs text-gray-600 font-medium whitespace-nowrap">
                        {new Date(
                          dev.createdAt
                        ).toLocaleDateString()}
                      </td>

                      {/* ACTIONS */}
                      <td className="p-3">

                        <div className="flex justify-end items-center gap-2">

                          {/* VIEW */}
                          <Link
                            href={`/developers/${dev.slug}`}
                            target="_blank"
                            className="h-9 w-9 flex items-center justify-center rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition"
                          >
                            <Eye
                              size={
                                14
                              }
                            />
                          </Link>

                          {/* EDIT */}
                          <button
                            onClick={() =>
                              editDeveloper(
                                dev
                              )
                            }
                            className="h-9 w-9 flex items-center justify-center rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition"
                          >
                            ✎
                          </button>

                          {/* DELETE */}
                          <button
                            onClick={() =>
                              deleteDeveloper(
                                dev._id
                              )
                            }
                            className="h-9 w-9 flex items-center justify-center rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition"
                          >
                            <Trash2
                              size={
                                14
                              }
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="p-8 text-center text-sm text-gray-500 font-medium"
                  >
                    No developers
                    found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ================= PAGINATION ================= */}
        {totalPages > 1 && (
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-4 py-4 border-t border-gray-200 bg-white">

            <p className="text-xs text-gray-600 font-medium">
              Showing{" "}
              <span className="font-bold">
                {startIndex +
                  1}
              </span>{" "}
              to{" "}
              <span className="font-bold">
                {Math.min(
                  startIndex +
                    itemsPerPage,
                  filteredDevelopers.length
                )}
              </span>{" "}
              of{" "}
              <span className="font-bold">
                {
                  filteredDevelopers.length
                }
              </span>{" "}
              developers
            </p>

            <div className="flex items-center gap-2 flex-wrap">

              {/* PREV */}
              <button
                disabled={
                  currentPage ===
                  1
                }
                onClick={() =>
                  setCurrentPage(
                    (prev) =>
                      prev - 1
                  )
                }
                className={`px-3 py-2 rounded-lg text-xs font-semibold transition ${
                  currentPage ===
                  1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white border border-gray-300 hover:bg-gray-100 text-gray-700"
                }`}
              >
                Prev
              </button>

              {/* PAGE NUMBERS */}
              {Array.from(
                {
                  length:
                    Math.min(
                      totalPages,
                      5
                    ),
                },
                (_, i) => {
                  let page;

                  if (
                    currentPage <=
                    3
                  ) {
                    page = i + 1;
                  } else if (
                    currentPage >=
                    totalPages -
                      2
                  ) {
                    page =
                      totalPages -
                      4 +
                      i;
                  } else {
                    page =
                      currentPage -
                      2 +
                      i;
                  }

                  return page;
                }
              ).map((page) => (
                <button
                  key={page}
                  onClick={() =>
                    setCurrentPage(
                      page
                    )
                  }
                  className={`h-8 w-8 rounded-lg text-xs font-bold transition ${
                    currentPage ===
                    page
                      ? "bg-[#0f3b2e] text-white"
                      : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              ))}

              {/* NEXT */}
              <button
                disabled={
                  currentPage ===
                  totalPages
                }
                onClick={() =>
                  setCurrentPage(
                    (prev) =>
                      prev + 1
                  )
                }
                className={`px-3 py-2 rounded-lg text-xs font-semibold transition ${
                  currentPage ===
                  totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white border border-gray-300 hover:bg-gray-100 text-gray-700"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}