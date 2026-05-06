"use client";

import { useState, useEffect } from "react";
import {
  Tag,
  Trash2,
  ChevronDown,
  ChevronRight,
  Plus,
  Folder,
} from "lucide-react";
import toast from "react-hot-toast";

export default function CategoriesPage() {
  const API = "https://property-bouquet-backend.onrender.com/api";

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [expanded, setExpanded] = useState({});
  const [activeInput, setActiveInput] = useState(null);
  const [inputValue, setInputValue] = useState("");

  // ================= FETCH =================
  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API}/categories/tree`);
      const data = await res.json();

      if (res.ok) setCategories(data.data || []);
    } catch {
      toast.error("Failed to load categories ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ================= EXPAND ALL =================
  const expandAll = (nodes, map = {}) => {
    nodes.forEach((n) => {
      map[n._id] = true;
      if (n.children?.length) expandAll(n.children, map);
    });
    return map;
  };

  const handleExpandAll = () => {
    setExpanded(expandAll(categories));
  };

  const handleCollapseAll = () => {
    setExpanded({});
  };

  // ================= ADD =================
  const addCategory = async (parentId = null) => {
    if (!inputValue.trim()) return;

    try {
      const res = await fetch(`${API}/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: inputValue,
          parent: parentId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message);
        return;
      }

      toast.success("Added ✅");

      // 🔥 auto expand parent
      if (parentId) {
        setExpanded((prev) => ({
          ...prev,
          [parentId]: true,
        }));
      }

      setInputValue("");
      setActiveInput(null);
      fetchCategories();
    } catch {
      toast.error("Server error ❌");
    }
  };

  // ================= DELETE =================
  const deleteCategory = async (id) => {
    if (!confirm("Delete category?")) return;

    try {
      const res = await fetch(`${API}/categories/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        toast.error("Delete failed ❌");
        return;
      }

      toast.success("Deleted 🗑️");
      fetchCategories();
    } catch {
      toast.error("Server error ❌");
    }
  };

  // ================= TREE =================
  const renderTree = (nodes, level = 0) => {
    return nodes.map((node, index) => {
      const isExpanded = expanded[node._id];

      return (
        <div key={node._id} className="relative">

          {/* TREE CONNECTOR */}
          {level > 0 && (
            <div
              className="absolute left-[-12px] top-0 bottom-0 w-px bg-gray-300"
            />
          )}

          {/* NODE */}
          <div
            className="flex items-center gap-3 p-3 rounded-xl border bg-white hover:shadow-md transition group"
            style={{ marginLeft: level * 24 }}
          >
            {/* EXPAND */}
            {node.children?.length > 0 ? (
              <button
                onClick={() =>
                  setExpanded((prev) => ({
                    ...prev,
                    [node._id]: !prev[node._id],
                  }))
                }
                className="p-1 rounded hover:bg-gray-200"
              >
                {isExpanded ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                )}
              </button>
            ) : (
              <span className="w-5" />
            )}

            {/* ICON */}
            <div className="bg-purple-100 text-purple-600 p-2 rounded-lg">
              <Folder size={14} />
            </div>

            {/* TEXT */}
            <div className="flex-1">
              <p className="font-semibold text-gray-800 capitalize">
                {node.name}
              </p>

              {node.fullPath && (
                <p className="text-xs text-gray-400">
                  {node.fullPath}
                </p>
              )}
            </div>

            {/* COUNT */}
            {node.children?.length > 0 && (
              <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                {node.children.length}
              </span>
            )}

            {/* ACTIONS */}
            <div className="flex items-center gap-2">

              {/* ADD SUBCATEGORY */}
              <button
                onClick={() => {
                  setActiveInput(node._id);
                  setInputValue("");
                }}
                className="flex items-center gap-1 text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100"
              >
                <Plus size={12} /> Add
              </button>

              {/* DELETE */}
              <button
                onClick={() => deleteCategory(node._id)}
                className="p-1 rounded hover:bg-red-100 text-red-500"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>

          {/* ADD INPUT */}
          {activeInput === node._id && (
            <div
              className="flex gap-2 mt-2"
              style={{ marginLeft: (level + 1) * 24 }}
            >
              <input
                autoFocus
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter sub-category..."
                className="input flex-1"
              />

              <button
                onClick={() => addCategory(node._id)}
                className="bg-blue-600 text-white px-3 rounded"
              >
                Add
              </button>

              <button onClick={() => setActiveInput(null)}>
                Cancel
              </button>
            </div>
          )}

          {/* CHILDREN */}
          {isExpanded && node.children?.length > 0 && (
            <div className="mt-1">
              {renderTree(node.children, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center text-gray-500">
        Loading categories...
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2 text-primary">
          <Tag /> Category Manager
        </h1>

        <div className="flex gap-2">
          <button
            onClick={handleExpandAll}
            className="text-sm px-3 py-1 bg-gray-100 rounded"
          >
            Expand All
          </button>

          <button
            onClick={handleCollapseAll}
            className="text-sm px-3 py-1 bg-gray-100 rounded"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* ADD ROOT */}
      <div className="bg-white p-5 rounded-xl shadow flex gap-2">
        <input
          value={activeInput === "root" ? inputValue : ""}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add root category"
          className="input flex-1"
          onFocus={() => setActiveInput("root")}
        />

        <button
          onClick={() => addCategory(null)}
          className="bg-primary text-white px-4 rounded-lg"
        >
          Add
        </button>
      </div>

      {/* TREE */}
      <div className="bg-white p-5 rounded-xl shadow">
        {categories.length ? (
          renderTree(categories)
        ) : (
          <p className="text-gray-500">No categories</p>
        )}
      </div> 
    </div>
  );
}