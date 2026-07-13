"use client";

import { useState, useEffect } from "react";
import {
  MapPin,
  Plus,
  ChevronDown,
  ChevronRight,
  Trash2,
  Pencil,
  Check,
  X,
  RefreshCw,
} from "lucide-react";

export default function LocationPage() {
  const API =
    "/api";

  const [locations, setLocations] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [activeInput, setActiveInput] =
    useState(null);
  const [inputValue, setInputValue] =
    useState("");
  const [imageUrl, setImageUrl] = useState("");
const [editImage, setEditImage] = useState("");

const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] =
    useState(null);
  const [editValue, setEditValue] =
    useState("");

  const [search, setSearch] = useState("");

  // ================= PAGINATION =================
  const [currentPage, setCurrentPage] =
    useState(1);

  const itemsPerPage = 12;

  // ================= FETCH =================
  const fetchLocations = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `${API}/locations/tree`
      );

      const data = await res.json();

      if (res.ok)
        setLocations(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // ================= VALIDATE FILE =================
const validateFile = (file) => {
  if (!file) return false;

  if (!file.type.startsWith("image/")) {
    alert("Only image files allowed");
    return false;
  }

  if (file.size > 5 * 1024 * 1024) {
    alert("Max file size is 5MB");
    return false;
  }

  return true;
};

// ================= UPLOAD IMAGE =================
const uploadImage = async (file) => {
  try {
    const data = new FormData();

    data.append("file", file);

    const res = await fetch(
      "/api/upload-developer",
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

    alert("Upload failed");

    return null;
  }
};

// ================= NEW LOCATION IMAGE =================
const handleLocationImageUpload = async (
  file
) => {
  if (!validateFile(file)) return;

  setUploading(true);

  const url = await uploadImage(file);

  if (url) {
    setImageUrl(url);
  }

  setUploading(false);
};

// ================= EDIT LOCATION IMAGE =================
const handleEditImageUpload = async (
  file
) => {
  if (!validateFile(file)) return;

  setUploading(true);

  const url = await uploadImage(file);

  if (url) {
    setEditImage(url);
  }

  setUploading(false);
};

  // ================= ADD =================
  const addLocation = async (parentId) => {
    if (!inputValue.trim()) return;

    const token =
      localStorage.getItem("token");

    const res = await fetch(
      `${API}/locations`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
        name: inputValue,
        parent: parentId || null,
        image: imageUrl,
      }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    await fetchLocations();

setInputValue("");
setImageUrl("");
setActiveInput(null);
  };

  // ================= DELETE =================
  const deleteLocation = async (id) => {
    if (
      !confirm("Delete this location?")
    )
      return;

    const token =
      localStorage.getItem("token");

    const res = await fetch(
      `${API}/locations/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    fetchLocations();
  };

  // ================= UPDATE =================
  const updateLocation = async (id) => {
    if (!editValue.trim()) return;

    const token =
      localStorage.getItem("token");

    await fetch(
      `${API}/locations/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type":
            "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
  name: editValue,
  image: editImage,
}),
      }
    );

    setEditingId(null);

    fetchLocations();
  };

  // ================= SEARCH =================
  const matchesSearch = (name) =>
    name
      .toLowerCase()
      .includes(search.toLowerCase());

  // ================= AUTO EXPAND =================
  const shouldExpand = (node) => {
    if (matchesSearch(node.name))
      return true;

    return node.children?.some(
      shouldExpand
    );
  };

  // ================= FILTER ROOT LOCATIONS =================
  const filteredLocations =
    locations.filter((node) =>
      shouldExpand(node)
    );

  // ================= PAGINATION =================
  const totalPages = Math.ceil(
    filteredLocations.length /
      itemsPerPage
  );

  const startIndex =
    (currentPage - 1) * itemsPerPage;

  const paginatedLocations =
    filteredLocations.slice(
      startIndex,
      startIndex + itemsPerPage
    );

  // ================= TREE =================
  const renderTree = (
    nodes,
    level = 0
  ) => {
    return nodes.map((node) => {
      const isExpanded =
        expanded[node._id] ||
        shouldExpand(node);

      return (
        <div
          key={node._id}
          className="mb-2"
        >
          {/* NODE */}
          <div
            className="relative group transition-all duration-300"
            style={{
              marginLeft: level * 36,
            }}
          >
            <div
  className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 ${
    editingId === node._id
      ? "border-[#0f3b2e] bg-[#f6faf8]"
      : "border-gray-200 bg-gradient-to-r from-white to-gray-50"
  }`}
>

              {/* CONNECTOR */}
              {level > 0 && (
                <div className="absolute left-[-18px] top-0 bottom-0 border-l border-dashed border-gray-300" />
              )}

              {/* EXPAND */}
              {node.children?.length >
              0 ? (
                <button
                  onClick={() =>
                    setExpanded(
                      (prev) => ({
                        ...prev,
                        [node._id]:
                          !prev[
                            node._id
                          ],
                      })
                    )
                  }
                  className="p-1 rounded hover:bg-gray-200 transition"
                >
                  {isExpanded ? (
                    <ChevronDown
                      size={14}
                    />
                  ) : (
                    <ChevronRight
                      size={14}
                    />
                  )}
                </button>
              ) : (
                <span className="w-4" />
              )}

              {/* ICON */}
              <div
  className="
    h-12
    w-12
    rounded-xl
    overflow-hidden
    border
    border-gray-200
    shadow-sm
    shrink-0
    bg-gradient-to-br
    from-gray-50
    to-gray-100
  "
>
  {node.image ? (
  <img
    src={node.image}
    alt={node.name}
    className="
      h-full
      w-full
      object-cover
    "
  />
) : (
  <div className="h-full w-full flex items-center justify-center">
    <MapPin
      size={16}
      className="text-[#0f3b2e]"
    />
  </div>
)}
</div>

              {/* SR NUMBER */}
              <div className="text-xs font-bold text-gray-400 w-[24px]">
                {startIndex +
                  nodes.indexOf(node) +
                  1}
              </div>

              {/* NAME */}
              <div className="flex-1 min-w-0 pr-4">
                {editingId ===
                node._id ? (
                  <div className="space-y-2 w-full max-w-xl">

  <input
    value={editValue}
    onChange={(e) =>
      setEditValue(e.target.value)
    }
    placeholder="Location Name"
    className="
w-full
bg-white
text-gray-900
placeholder:text-gray-400
caret-[#0f3b2e]
border
border-gray-300
rounded-xl
px-4
py-2.5
outline-none
focus:ring-2
focus:ring-[#0f3b2e]/20
"
  />

  <div className="flex items-center gap-3">
  <button
    type="button"
    onClick={() =>
      document
        .getElementById(
          "editLocationImageUpload"
        )
        ?.click()
    }
    className="px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-sm"
  >
    {uploading
      ? "Uploading..."
      : "Change Image"}
  </button>

  {editImage && (
    <img
      src={editImage}
      alt=""
      className="h-14 w-14 rounded-lg object-cover border"
    />
  )}
</div>

</div>
                ) : (
                  <div>
                    <div className="flex items-center gap-2">
  <p className="font-semibold text-sm text-gray-800 truncate">
    {node.name}
  </p>

  {node.image && (
    <span className="text-[10px] px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
      Image
    </span>
  )}
</div>

                    {level > 0 && (
                      <p className="text-[10px] text-gray-400">
                        Sub-location
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* COUNT */}
              {node.children?.length >
                0 && (
                <div className="text-[10px] font-semibold bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                  {
                    node.children
                      .length
                  }
                </div>
              )}

              {/* ACTIONS */}
<div className="flex items-center gap-2 shrink-0">

  {/* ADD */}
  <button
    onClick={() => {
      setActiveInput(node._id);
      setInputValue("");
    }}
    className="h-8 w-8 flex items-center justify-center rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition"
  >
    <Plus size={13} />
  </button>

  {/* EDIT */}
  {editingId === node._id ? (
    <>
      <button
        onClick={() =>
          updateLocation(node._id)
        }
        className="h-8 w-8 flex items-center justify-center rounded-lg bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 transition"
      >
        <Check size={13} />
      </button>

      <button
        onClick={() =>
          setEditingId(null)
        }
        className="h-8 w-8 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200 transition"
      >
        <X size={13} />
      </button>
    </>
  ) : (
    <button
      onClick={() => {
      setEditingId(node._id);
      setEditValue(node.name);
      setEditImage(node.image || "");
    }}
      className="h-8 w-8 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200 transition"
    >
      <Pencil size={13} />
    </button>
  )}

  {/* VIEW */}
  <button
    onClick={() =>
      window.open(
        `/locations/${node.slug}`,
        "_blank"
      )
    }
    className="h-8 px-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-[11px] font-semibold transition"
  >
    View
  </button>

  {/* DELETE */}
  <button
    onClick={() =>
      deleteLocation(node._id)
    }
    className="h-8 w-8 flex items-center justify-center rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition"
  >
    <Trash2 size={13} />
  </button>
</div>
            </div>
          </div>

          {/* ADD INPUT */}
          {activeInput ===
            node._id && (
            <div
  className="
mt-3
rounded-xl
border
border-blue-200
bg-blue-50
p-4
space-y-4
shadow-sm
"
  style={{
    marginLeft:
      (level + 1) * 18,
  }}
>
  <input
    autoFocus
    value={inputValue}
    onChange={(e) =>
      setInputValue(e.target.value)
    }
    placeholder="Sub-location name"
    className="
w-full
bg-white
text-gray-900
placeholder:text-gray-400
caret-[#0f3b2e]
border
border-gray-300
rounded-xl
px-4
py-2.5
outline-none
focus:ring-2
focus:ring-[#0f3b2e]/20
"
  />

  <div className="flex items-center gap-3">
  <button
    type="button"
    onClick={() =>
      document
        .getElementById(
          "locationImageUpload"
        )
        ?.click()
    }
    className="px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-sm"
  >
    {uploading
      ? "Uploading..."
      : "Upload Image"}
  </button>

  {imageUrl && (
    <img
      src={imageUrl}
      alt=""
      className="h-10 w-10 rounded-lg object-cover border"
    />
  )}
</div>

  <div className="flex gap-2">
    <button
      onClick={() =>
        addLocation(node._id)
      }
      className="bg-blue-600 text-white px-3 py-2 rounded-lg"
    >
      Add
    </button>

    <button
      onClick={() =>
        setActiveInput(null)
      }
      className="text-sm text-gray-600"
    >
      Cancel
    </button>
  </div>
</div>
          )}

          {/* CHILDREN */}
          {isExpanded &&
            node.children
              ?.length > 0 && (
              <div className="ml-6 border-l border-dashed border-gray-300 pl-6 mt-2 transition-all duration-300">
                {renderTree(
                  node.children,
                  level + 1
                )}
              </div>
            )}
        </div>
      );
    });
  };

  // ================= ROOT =================
  const addRoot = () =>
    addLocation(null);


  // ================= LOADING =================
  if (loading) {
    return (
      
      <div className="h-[60vh] flex items-center justify-center text-sm font-medium text-gray-600">
        Loading locations...
      </div>
    );
  }

  return (

<div
  className="p-4 bg-[#f7f8f7] min-h-screen space-y-5"
  style={{
    color: "#111827",
  }}
>
        {/* ================= NEW LOCATION IMAGE ================= */}
<input
  id="locationImageUpload"
  type="file"
  hidden
  accept="image/*"
  onChange={(e) => {
    handleLocationImageUpload(
      e.target.files?.[0]
    );

    e.target.value = "";
  }}
/>

{/* ================= EDIT LOCATION IMAGE ================= */}
<input
  id="editLocationImageUpload"
  type="file"
  hidden
  accept="image/*"
  onChange={(e) => {
    handleEditImageUpload(
      e.target.files?.[0]
    );

    e.target.value = "";
  }}
/>

      {/* ================= HEADER ================= */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

        <div>
          <h1 className="text-3xl font-extrabold text-[#0f3b2e] flex items-center gap-2 tracking-tight">
            <MapPin size={24} />
            Location Manager
          </h1>

          <p className="text-xs text-gray-600 mt-1 font-medium">
            Manage cities,
            sectors, areas and
            nested property
            locations
          </p>
        </div>

        <button
          onClick={
            fetchLocations
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
          placeholder="Search locations..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          className="w-full border border-gray-300 text-sm text-gray-800 placeholder:text-gray-400 px-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-[#0f3b2e]"
        />
      </div>

      {/* ================= ADD ROOT ================= */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">

        <input
  value={inputValue}
  onChange={(e) => setInputValue(e.target.value)}
  placeholder="Add root location"
  className="
    flex-1
    min-w-[280px]
    bg-white
    text-gray-900
    placeholder:text-gray-400
    caret-[#0f3b2e]
    border
    border-gray-300
    rounded-xl
    px-4
    py-2.5
    outline-none
    focus:border-[#0f3b2e]
    focus:ring-2
    focus:ring-[#0f3b2e]/20
  "
/>

<div className="flex flex-wrap items-center gap-4 mt-4">
  <button
    type="button"
    onClick={() =>
      document
        .getElementById(
          "locationImageUpload"
        )
        ?.click()
    }
    className="px-4 py-2.5 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-sm font-medium"
  >
    {uploading
      ? "Uploading..."
      : "Upload Image"}
  </button>

  {imageUrl && (
    <img
      src={imageUrl}
      alt=""
      className="h-12 w-12 rounded-lg object-cover border"
    />
  )}
</div>

<button
  onClick={addRoot}
  className="bg-[#0f3b2e] text-white px-5 py-2.5 rounded-xl"
>
  Add Location
</button>
      </div>

      {/* ================= TREE ================= */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200">

        {paginatedLocations.length ? (
          renderTree(
            paginatedLocations
          )
        ) : (
          <p className="text-sm text-gray-500">
            No locations found
          </p>
        )}

        {/* ================= PAGINATION ================= */}
        {totalPages > 1 && (
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-6 pt-4 border-t border-gray-200">

            <p className="text-xs text-gray-600 font-medium">
              Showing{" "}
              <span className="font-bold">
                {startIndex + 1}
              </span>{" "}
              to{" "}
              <span className="font-bold">
                {Math.min(
                  startIndex +
                    itemsPerPage,
                  filteredLocations.length
                )}
              </span>{" "}
              of{" "}
              <span className="font-bold">
                {
                  filteredLocations.length
                }
              </span>{" "}
              locations
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