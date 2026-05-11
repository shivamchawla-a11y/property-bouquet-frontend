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
} from "lucide-react";

export default function LocationPage() {
  const API = "https://property-bouquet-backend.onrender.com/api";

  const [locations, setLocations] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [activeInput, setActiveInput] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  const [search, setSearch] = useState("");

  // ================= FETCH =================
  const fetchLocations = async () => {
    try {
      const res = await fetch(`${API}/locations/tree`);
      const data = await res.json();
      if (res.ok) setLocations(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  // ================= ADD =================
  const addLocation = async (parentId) => {
    if (!inputValue.trim()) return;

    const token = localStorage.getItem("token");

    const res = await fetch(`${API}/locations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: inputValue,
        parent: parentId || null,
      }),
    });

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
    if (!confirm("Delete this location?")) return;

    const token = localStorage.getItem("token");

    const res = await fetch(`${API}/locations/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

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

    const token = localStorage.getItem("token");

    await fetch(`${API}/locations/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: editValue }),
    });

    setEditingId(null);
    fetchLocations();
  };

  // ================= SEARCH MATCH =================
  const matchesSearch = (name) =>
    name.toLowerCase().includes(search.toLowerCase());

  // ================= AUTO EXPAND SEARCH =================
  const shouldExpand = (node) => {
    if (matchesSearch(node.name)) return true;
    return node.children?.some(shouldExpand);
  };

  // ================= TREE =================
  const renderTree = (nodes, level = 0) => {
    return nodes.map((node) => {
      const isExpanded = expanded[node._id] || shouldExpand(node);

      return (
        <div key={node._id}>

          {/* NODE */}
          <div
  className="relative group transition-all duration-300"
  style={{ marginLeft: level * 20 }}
>
  <div className="flex items-center gap-3 p-3 rounded-xl border bg-gradient-to-r from-white to-gray-50 shadow-sm hover:shadow-md transition">

    {/* CONNECTOR LINE */}
    {level > 0 && (
      <div className="absolute left-[-10px] top-0 h-full w-[2px] bg-gray-200" />
    )}

    {/* EXPAND BUTTON */}
    {node.children?.length > 0 ? (
      <button
        onClick={() =>
          setExpanded((prev) => ({
            ...prev,
            [node._id]: !prev[node._id],
          }))
        }
        className="p-1 rounded hover:bg-gray-200 transition"
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
    <div className="bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700 p-2 rounded-lg shadow-sm">
      <MapPin size={14} />
    </div>

    {/* NAME / INPUT */}
    <div className="flex-1">
      {editingId === node._id ? (
        <input
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          className="input text-sm w-full"
        />
      ) : (
        <div>
          <p className="font-semibold text-gray-800">{node.name}</p>

          {/* OPTIONAL PATH STYLE */}
          {level > 0 && (
            <p className="text-xs text-gray-400">
              Sub-location
            </p>
          )}
        </div>
      )}
    </div>

    {/* CHILD COUNT */}
    {node.children?.length > 0 && (
      <div className="text-xs bg-gray-100 px-2 py-1 rounded-full">
        {node.children.length}
      </div>
    )}

    {/* ACTIONS (ONLY ON HOVER) */}
    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">

      {/* ADD */}
      <button
        onClick={() => {
          setActiveInput(node._id);
          setInputValue("");
        }}
        className="p-1 rounded hover:bg-blue-100 text-blue-600"
      >
        <Plus size={14} />
      </button>

      {/* EDIT */}
      {editingId === node._id ? (
        <>
          <button onClick={() => updateLocation(node._id)}>
            <Check size={14} className="text-green-600" />
          </button>
          <button onClick={() => setEditingId(null)}>
            <X size={14} />
          </button>
        </>
      ) : (
        <button
          onClick={() => {
            setEditingId(node._id);
            setEditValue(node.name);
          }}
          className="p-1 rounded hover:bg-gray-200"
        >
          <Pencil size={14} />
        </button>
      )}

      <button
  onClick={() => window.open(`/locations/${node.slug}`, "_blank")}
  className="text-xs px-2 py-1 rounded bg-green-100 text-green-700"
>
  View
</button>

      {/* DELETE */}
      <button
        onClick={() => deleteLocation(node._id)}
        className="p-1 rounded hover:bg-red-100 text-red-500"
      >
        <Trash2 size={14} />
      </button>
    </div>
  </div>
</div>

          {/* ADD INPUT */}
          {activeInput === node._id && (
  <div
    className="flex items-center gap-2 mt-2 p-2 bg-blue-50 rounded-lg border border-blue-200"
    style={{ marginLeft: (level + 1) * 20 }}
  >
    <input
      autoFocus
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      placeholder="Add sub-location..."
      className="input flex-1 bg-white"
    />

    <button
      onClick={() => addLocation(node._id)}
      className="bg-blue-600 text-white px-3 py-1 rounded-lg"
    >
      Add
    </button>

    <button
      onClick={() => setActiveInput(null)}
      className="text-gray-500"
    >
      Cancel
    </button>
  </div>
)}

          {/* CHILDREN */}
          {isExpanded && node.children?.length > 0 && (
  <div className="ml-2 border-l border-dashed border-gray-300 pl-2 mt-1 transition-all duration-300">
    {renderTree(node.children, level + 1)}
  </div>
)}
        </div>
      );
    });
  };

  // ================= ROOT =================
  const addRoot = () => addLocation(null);

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <MapPin /> Location Manager
      </h1>

      {/* SEARCH */}
      <div className="bg-white p-4 rounded-xl shadow">
        <input
          placeholder="Search locations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input w-full"
        />
      </div>

      {/* ADD ROOT */}
      <div className="bg-white p-5 rounded-xl shadow flex gap-2">
        <input
          value={activeInput === "root" ? inputValue : ""}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add root (e.g. Gurgaon)"
          className="input flex-1"
          onFocus={() => setActiveInput("root")}
        />

        <button
          onClick={addRoot}
          className="bg-primary text-white px-4 rounded-lg"
        >
          Add
        </button>
      </div>

      {/* TREE */}
      <div className="bg-white p-5 rounded-xl shadow">
        {locations.length ? (
          renderTree(locations)
        ) : (
          <p className="text-gray-500">No locations</p>
        )}
      </div>

    </div>
  );
}