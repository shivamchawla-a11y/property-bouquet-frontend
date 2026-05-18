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
    "https://property-bouquet-backend.onrender.com/api";

  const [locations, setLocations] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [activeInput, setActiveInput] =
    useState(null);
  const [inputValue, setInputValue] =
    useState("");
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
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    setInputValue("");
    setActiveInput(null);

    fetchLocations();
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
              marginLeft: level * 18,
            }}
          >
            <div className="flex items-center gap-2 p-2.5 rounded-xl border border-gray-200 bg-gradient-to-r from-white to-gray-50 shadow-sm hover:shadow-md transition">

              {/* CONNECTOR */}
              {level > 0 && (
                <div className="absolute left-[-10px] top-0 h-full w-[1px] bg-gray-200" />
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
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700 p-1.5 rounded-lg shadow-sm">
                <MapPin size={12} />
              </div>

              {/* SR NUMBER */}
              <div className="text-xs font-bold text-gray-400 w-[24px]">
                {startIndex +
                  nodes.indexOf(node) +
                  1}
              </div>

              {/* NAME */}
              <div className="flex-1 min-w-0">
                {editingId ===
                node._id ? (
                  <input
                    value={editValue}
                    onChange={(e) =>
                      setEditValue(
                        e.target.value
                      )
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <div>
                    <p className="font-semibold text-sm text-gray-800 truncate">
                      {node.name}
                    </p>

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
<div className="flex items-center gap-1.5 flex-wrap">

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
              className="flex items-center gap-2 mt-2 p-2 bg-blue-50 rounded-lg border border-blue-200"
              style={{
                marginLeft:
                  (level + 1) * 18,
              }}
            >
              <input
                autoFocus
                value={inputValue}
                onChange={(e) =>
                  setInputValue(
                    e.target.value
                  )
                }
                placeholder="Add sub-location..."
                className="flex-1 border border-gray-300 bg-white rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                onClick={() =>
                  addLocation(
                    node._id
                  )
                }
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 text-sm rounded-lg font-semibold transition"
              >
                Add
              </button>

              <button
                onClick={() =>
                  setActiveInput(
                    null
                  )
                }
                className="text-sm text-gray-500 hover:text-black"
              >
                Cancel
              </button>
            </div>
          )}

          {/* CHILDREN */}
          {isExpanded &&
            node.children
              ?.length > 0 && (
              <div className="ml-2 border-l border-dashed border-gray-300 pl-2 mt-1 transition-all duration-300">
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
    <div className="p-4 bg-[#f7f8f7] min-h-screen space-y-5">

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
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 flex flex-col sm:flex-row gap-2">

        <input
          value={
            activeInput ===
            "root"
              ? inputValue
              : ""
          }
          onChange={(e) =>
            setInputValue(
              e.target.value
            )
          }
          placeholder="Add root location (e.g. Gurgaon)"
          className="flex-1 border border-gray-300 text-sm text-gray-800 px-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-[#0f3b2e]"
          onFocus={() =>
            setActiveInput(
              "root"
            )
          }
        />

        <button
          onClick={addRoot}
          className="bg-[#0f3b2e] hover:bg-[#145240] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition"
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