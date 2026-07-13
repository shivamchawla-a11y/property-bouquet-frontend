"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

import {
  Tag,
  Trash2,
  ChevronDown,
  ChevronRight,
  Plus,
  Folder,
  RefreshCw,
} from "lucide-react";

import toast from "react-hot-toast";

export default function CategoriesPage() {
  const API =
    "/api";

  const [categories, setCategories] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [expanded, setExpanded] =
    useState({});

  const [activeInput, setActiveInput] =
    useState(null);

  const [inputValue, setInputValue] =
    useState("");

  const [search, setSearch] =
    useState("");

  // ================= PAGINATION =================
  const [currentPage, setCurrentPage] =
    useState(1);

  const itemsPerPage = 10;

  // ================= FETCH =================
  const fetchCategories = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `${API}/categories/tree`
      );

      const data = await res.json();

      if (res.ok)
        setCategories(data.data || []);
    } catch {
      toast.error(
        "Failed to load categories ❌"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // ================= EXPAND ALL =================
  const expandAll = (
    nodes,
    map = {}
  ) => {
    nodes.forEach((n) => {
      map[n._id] = true;

      if (n.children?.length) {
        expandAll(
          n.children,
          map
        );
      }
    });

    return map;
  };

  const handleExpandAll = () => {
    const expandedMap =
      expandAll(categories);

    setExpanded(expandedMap);
  };

  const handleCollapseAll = () => {
    setExpanded({});
  };

  // ================= ADD =================
  const addCategory = async (
    parentId = null
  ) => {
    if (!inputValue.trim()) return;

    try {
      const res = await fetch(
        `${API}/categories`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            name: inputValue,
            parent: parentId,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(
          data.message
        );

        return;
      }

      toast.success("Added ✅");

      if (parentId) {
        setExpanded(
          (prev) => ({
            ...prev,
            [parentId]: true,
          })
        );
      }

      setInputValue("");
      setActiveInput(null);

      fetchCategories();
    } catch {
      toast.error(
        "Server error ❌"
      );
    }
  };

  // ================= DELETE =================
  const deleteCategory = async (
    id
  ) => {
    if (
      !confirm(
        "Delete category?"
      )
    )
      return;

    try {
      const res = await fetch(
        `${API}/categories/${id}`,
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

      toast.success(
        "Deleted 🗑️"
      );

      fetchCategories();
    } catch {
      toast.error(
        "Server error ❌"
      );
    }
  };

  // ================= SEARCH =================
  const matchesSearch = (
    name
  ) =>
    name
      ?.toLowerCase()
      .includes(
        search.toLowerCase()
      );

  const shouldExpand = (
    node
  ) => {
    if (!search.trim())
      return true;

    if (
      matchesSearch(node.name)
    )
      return true;

    return node.children?.some(
      shouldExpand
    );
  };

  // ================= FILTER =================
  const filteredCategories =
    search.trim()
      ? categories.filter(
          (node) =>
            shouldExpand(node)
        )
      : categories;

  // ================= PAGINATION =================
  const totalPages = Math.ceil(
    filteredCategories.length /
      itemsPerPage
  );

  const startIndex =
    (currentPage - 1) *
    itemsPerPage;

  const paginatedCategories =
    filteredCategories.slice(
      startIndex,
      startIndex +
        itemsPerPage
    );

  // ================= TREE =================
  const renderTree = (
    nodes,
    level = 0
  ) => {
    return nodes.map(
      (node, index) => {
        const isExpanded =
          expanded[node._id] ||
          false;

        return (
          <div
            key={node._id}
            className="mb-2"
          >
            {/* NODE */}
            <div
              className="relative group transition-all duration-300"
              style={{
                marginLeft:
                  level * 18,
              }}
            >
              <div className="flex items-center gap-2 p-2.5 rounded-xl border border-gray-200 bg-gradient-to-r from-white to-gray-50 shadow-sm hover:shadow-md transition overflow-x-auto">

                {/* CONNECTOR */}
                {level > 0 && (
                  <div className="absolute left-[-10px] top-0 h-full w-[1px] bg-gray-200" />
                )}

                {/* EXPAND */}
                {node.children
                  ?.length >
                0 ? (
                  <button
                    onClick={() =>
                      setExpanded(
                        (
                          prev
                        ) => ({
                          ...prev,
                          [node._id]:
                            !prev[
                              node
                                ._id
                            ],
                        })
                      )
                    }
                    className="p-1 rounded hover:bg-gray-200 transition shrink-0"
                  >
                    {isExpanded ? (
                      <ChevronDown
                        size={
                          14
                        }
                      />
                    ) : (
                      <ChevronRight
                        size={
                          14
                        }
                      />
                    )}
                  </button>
                ) : (
                  <span className="w-4 shrink-0" />
                )}

                {/* ICON */}
                <div className="bg-purple-100 text-purple-700 p-1.5 rounded-lg shrink-0">
                  <Folder
                    size={12}
                  />
                </div>

                {/* SR */}
                <div className="text-xs font-bold text-gray-400 w-[24px] shrink-0">
                  {startIndex +
                    index +
                    1}
                </div>

                {/* TEXT */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-gray-800 capitalize truncate">
                    {node.name}
                  </p>

                  {node.fullPath && (
                    <p className="text-[10px] text-gray-400 truncate">
                      {
                        node.fullPath
                      }
                    </p>
                  )}
                </div>

                {/* COUNT */}
                {node.children
                  ?.length >
                  0 && (
                  <div className="text-[10px] font-semibold bg-gray-100 text-gray-600 px-2 py-1 rounded-full shrink-0">
                    {
                      node
                        .children
                        .length
                    }
                  </div>
                )}

                {/* ACTIONS */}
                <div className="flex items-center gap-1.5 shrink-0">

                  {/* VIEW */}
                  <Link
                    href={`/categories/${node.slug}`}
                    target="_blank"
                    className="h-8 px-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-[11px] font-semibold flex items-center justify-center transition whitespace-nowrap"
                  >
                    View
                  </Link>

                  {/* ADD */}
                  <button
                    onClick={() => {
                      setActiveInput(
                        node._id
                      );

                      setInputValue(
                        ""
                      );
                    }}
                    className="h-8 px-3 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-[11px] font-semibold flex items-center gap-1 transition whitespace-nowrap shrink-0"
                  >
                    <Plus
                      size={11}
                    />
                    Add
                  </button>

                  {/* DELETE */}
                  <button
                    onClick={() =>
                      deleteCategory(
                        node._id
                      )
                    }
                    className="h-8 w-8 flex items-center justify-center rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition shrink-0"
                  >
                    <Trash2
                      size={
                        13
                      }
                    />
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
                    (level +
                      1) *
                    18,
                }}
              >
                <input
                  autoFocus
                  value={
                    inputValue
                  }
                  onChange={(
                    e
                  ) =>
                    setInputValue(
                      e
                        .target
                        .value
                    )
                  }
                  placeholder="Enter sub-category..."
                  className="flex-1 border border-gray-300 bg-white rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />

                <button
                  onClick={() =>
                    addCategory(
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
                ?.length >
                0 && (
                <div className="ml-2 border-l border-dashed border-gray-300 pl-2 mt-1 transition-all duration-300">
                  {renderTree(
                    node.children,
                    level +
                      1
                  )}
                </div>
              )}
          </div>
        );
      }
    );
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center text-sm font-medium text-gray-600">
        Loading categories...
      </div>
    );
  }

  return (
    <div className="p-4 bg-[#f7f8f7] min-h-screen space-y-5">

      {/* ================= HEADER ================= */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

        <div>
          <h1 className="text-3xl font-extrabold text-[#0f3b2e] flex items-center gap-2 tracking-tight">
            <Tag size={24} />
            Category Manager
          </h1>

          <p className="text-xs text-gray-600 mt-1 font-medium">
            Manage property
            categories and
            nested sub-categories
          </p>
        </div>

        <div className="flex flex-wrap gap-2">

          {/* REFRESH */}
          <button
            onClick={
              fetchCategories
            }
            className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-xl flex items-center gap-2 hover:bg-gray-100 transition text-sm font-semibold shadow-sm"
          >
            <RefreshCw
              size={14}
            />
            Refresh
          </button>

          {/* EXPAND */}
          <button
            onClick={
              handleExpandAll
            }
            className="px-4 py-2 bg-[#0f3b2e] text-white border border-[#0f3b2e] rounded-xl text-sm font-semibold hover:bg-[#145240] transition shadow-sm"
          >
            Expand All
          </button>

          {/* COLLAPSE */}
          <button
            onClick={
              handleCollapseAll
            }
            className="px-4 py-2 bg-gray-700 text-white border border-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-800 transition shadow-sm"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* ================= SEARCH ================= */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200">

        <input
          placeholder="Search categories..."
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
          placeholder="Add root category"
          className="flex-1 border border-gray-300 text-sm text-gray-800 px-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-[#0f3b2e]"
          onFocus={() =>
            setActiveInput(
              "root"
            )
          }
        />

        <button
          onClick={() =>
            addCategory(
              null
            )
          }
          className="bg-[#0f3b2e] hover:bg-[#145240] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition"
        >
          Add Category
        </button>
      </div>

      {/* ================= TREE ================= */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200">

        {paginatedCategories.length ? (
          renderTree(
            paginatedCategories
          )
        ) : (
          <p className="text-sm text-gray-500">
            No categories found
          </p>
        )}

        {/* ================= PAGINATION ================= */}
        {totalPages > 1 && (
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-6 pt-4 border-t border-gray-200">

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
                  filteredCategories.length
                )}
              </span>{" "}
              of{" "}
              <span className="font-bold">
                {
                  filteredCategories.length
                }
              </span>{" "}
              categories
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
                    (
                      prev
                    ) =>
                      prev -
                      1
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
                    page =
                      i +
                      1;
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
                    (
                      prev
                    ) =>
                      prev +
                      1
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