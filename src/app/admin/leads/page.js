"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Download,
  Phone,
  MessageCircle,
} from "lucide-react";

export default function LeadsPage() {
  const router = useRouter();

  const [leads, setLeads] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("All");

  const [agentFilter, setAgentFilter] = useState("All");
  const [propertyFilter, setPropertyFilter] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sourceFilter, setSourceFilter] = useState("All");
const [statusFilter, setStatusFilter] = useState("All");

  const [assignModal, setAssignModal] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState("");
   const [editingNoteId, setEditingNoteId] = useState(null);
const [noteValue, setNoteValue] = useState("");

const statusStyle = (status) => {
  if (status === "New") return "bg-blue-100 text-blue-700 border-blue-200";
  if (status === "Interested") return "bg-green-100 text-green-700 border-green-200";
  if (status === "Not Interested") return "bg-red-100 text-red-600 border-red-200";
  if (status === "Visit") return "bg-yellow-100 text-yellow-700 border-yellow-200";
  if (status === "Closed") return "bg-purple-100 text-purple-700 border-purple-200";
  return "bg-gray-100 text-gray-600 border-gray-200";
};

  const API = "https://property-bouquet-backend.onrender.com/api";

  const getHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  useEffect(() => {
    fetchLeads();
    fetchAgents();
  }, []);

  const fetchLeads = async () => {
    const res = await fetch(`${API}/leads`, {
      headers: getHeaders(),
    });
    const data = await res.json();
    setLeads(data.data || []);
    setLoading(false);
  };

  const fetchAgents = async () => {
    const res = await fetch(`${API}/auth/users`, {
      headers: getHeaders(),
    });
    const data = await res.json();
    setAgents((data.data || []).filter((u) => u.role === "Agent"));
  };

  const updateLead = async (id, payload) => {
    await fetch(`${API}/leads/${id}`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    fetchLeads();
  };

  // ================= FILTER =================
  const filteredLeads = leads.filter((l) => {
  const searchMatch =
    l.name?.toLowerCase().includes(search.toLowerCase()) ||
    l.phone?.includes(search);

  const propertyMatch =
    propertyFilter === "All" || l.property === propertyFilter;

  const sourceMatch =
    sourceFilter === "All" || l.source === sourceFilter;

  const statusMatch =
    statusFilter === "All" || l.status === statusFilter;

  const agentMatch =
    (agentFilter === "All" ||
      (agentFilter === "Unassigned" && !l.assignedTo) ||
      (l.assignedTo && l.assignedTo._id === agentFilter)) &&

    (tab === "All" ||
      (tab === "Assigned" && l.assignedTo) ||
      (tab === "Unassigned" && !l.assignedTo));

  const dateMatch =
    (!startDate || new Date(l.createdAt) >= new Date(startDate)) &&
    (!endDate || new Date(l.createdAt) <= new Date(endDate));

  return (
    searchMatch &&
    propertyMatch &&
    sourceMatch &&
    statusMatch &&
    agentMatch &&
    dateMatch
  );
});
  const formatDate = (date) =>
    new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });

  const priorityStyle = (p) => {
    if (p === "Hot") return "bg-red-100 text-red-600";
    if (p === "Warm") return "bg-yellow-100 text-yellow-700";
    if (p === "Cold") return "bg-blue-100 text-blue-600";
    return "bg-gray-100";
  };

  if (loading) return <div className="p-10">Loading...</div>;

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold flex gap-2">
          <Users /> Lead Management
        </h1>

        <button className="bg-[#c9a64b] text-white px-5 py-2 rounded-xl shadow">
          <Download size={16} /> Export
        </button>
      </div>

      {/* TABS */}
      <div className="flex gap-3">
        {["All", "Assigned", "Unassigned"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-full ${
              tab === t
                ? "bg-green-800 text-white"
                : "bg-gray-100"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* FILTER BAR */}
      <div className="bg-white p-5 rounded-2xl shadow flex flex-wrap gap-4">

        <input
          placeholder="Search name / phone..."
          className="border px-4 py-2 rounded-xl w-[220px]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div>
          <p className="text-xs text-gray-500">Assigned To</p>
          <select
  className="border px-3 py-2 rounded-xl min-w-[180px]"
  value={agentFilter}
  onChange={(e) => setAgentFilter(e.target.value)}
>
  <option value="All">All Agents</option>
  <option value="Unassigned">Unassigned</option>

  {agents.map((a) => (
    <option key={a._id} value={a._id}>
      {a.name}
    </option>
  ))}
</select>
        </div>

        <div>
          <p className="text-xs text-gray-500">Property</p>
          <select
            className="border px-3 py-2 rounded-xl"
            onChange={(e) => setPropertyFilter(e.target.value)}
          >
            <option value="All">All</option>
            {[...new Set(leads.map((l) => l.property))].map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </div>

        <div>
          <p className="text-xs text-gray-500">From</p>
          <input
            type="date"
            className="border px-3 py-2 rounded-xl"
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div>
          <p className="text-xs text-gray-500">To</p>
          <input
            type="date"
            className="border px-3 py-2 rounded-xl"
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

      </div>

      {/* TABLE */}

<div className="bg-white rounded-2xl shadow-lg overflow-hidden border">

  <table className="w-full text-sm">

    <thead className="bg-gray-50 text-gray-600 sticky top-0 z-10">
      <tr>
        <th className="p-5 text-left">Lead</th>
        <th>Property</th>
        <th>Status</th>
        <th>Priority</th>
        <th>Agent</th>
        <th>Notes</th>
        <th>Date</th>
        <th>Actions</th>
      </tr>
    </thead>

    <tbody>
      {filteredLeads.map((l) => (
        <tr
          key={l._id}
          className="border-t hover:bg-gray-50 transition-all duration-200"
        >

          {/* LEAD */}
          <td className="p-5">
            <div className="font-semibold text-gray-800">
              {l.name}
            </div>
            <div className="text-xs text-gray-500">
              {l.phone}
            </div>
          </td>

          <td className="text-gray-700">{l.property}</td>

          {/* STATUS */}
          <td>
  <div
    className={`flex items-center gap-2 px-2 py-1 rounded-full border w-fit ${statusStyle(
      l.status
    )}`}
  >
    {/* STATUS DOT */}
    <span className="w-2 h-2 rounded-full bg-current"></span>

    {/* DROPDOWN */}
    <select
      value={l.status || "New"}
      onChange={(e) =>
        updateLead(l._id, { status: e.target.value })
      }
      className="bg-transparent outline-none text-xs font-semibold cursor-pointer"
    >
      <option>New</option>
      <option>Interested</option>
      <option>Not Interested</option>
      <option>Visit</option>
      <option>Closed</option>
    </select>
  </div>
</td>

          {/* PRIORITY */}
          <td>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
                priorityStyle(l.priority)
              }`}
            >
              {l.priority || "Warm"}
            </span>
          </td>

          {/* AGENT */}
          <td>
  {l.assignedTo ? (
    <div className="flex flex-col">
      <span className="text-sm font-semibold text-gray-800">
        {l.assignedTo.name}
      </span>
      <button
        onClick={() => {
          setAssignModal(l);
          setSelectedAgent(l.assignedTo._id);
        }}
        className="text-xs text-blue-600 hover:underline"
      >
        Change
      </button>
    </div>
  ) : (
    <button
      onClick={() => {
        setAssignModal(l);
        setSelectedAgent("");
      }}
      className="text-blue-600 font-medium hover:underline"
    >
      Assign
    </button>
  )}
</td>

          {/* NOTES (NEW SYSTEM) */}
          <td className="w-[220px]">

            {editingNoteId === l._id ? (
              <div className="space-y-2">

                <textarea
                  value={noteValue}
                  onChange={(e) => setNoteValue(e.target.value)}
                  className="w-full border rounded-lg p-2 text-xs resize-none focus:outline-green-600"
                  rows={3}
                />

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      updateLead(l._id, { notes: noteValue });
                      setEditingNoteId(null);
                    }}
                    className="bg-green-700 text-white px-3 py-1 rounded text-xs"
                  >
                    Save
                  </button>

                  <button
                    onClick={() => setEditingNoteId(null)}
                    className="bg-gray-200 px-3 py-1 rounded text-xs"
                  >
                    Cancel
                  </button>
                </div>

              </div>
            ) : (
              <div
                onClick={() => {
                  setEditingNoteId(l._id);
                  setNoteValue(l.notes || "");
                }}
                className="cursor-pointer bg-gray-50 border rounded-lg p-2 text-xs hover:bg-gray-100 transition"
              >
                {l.notes ? (
                  l.notes.length > 60
                    ? l.notes.slice(0, 60) + "..."
                    : l.notes
                ) : (
                  <span className="text-gray-400">
                    + Add note
                  </span>
                )}
              </div>
            )}

          </td>

          {/* DATE */}
          <td className="text-xs text-gray-600">
            {formatDate(l.createdAt)}
          </td>

          {/* ACTIONS */}
          <td className="flex gap-2 items-center">

            <button
              onClick={() => window.open(`tel:${l.phone}`)}
              className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg shadow"
            >
              📞
            </button>

            <button
              onClick={() =>
                window.open(`https://wa.me/91${l.phone}`)
              }
              className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg shadow"
            >
              💬
            </button>

          </td>

        </tr>
      ))}
    </tbody>

  </table>
</div>

      {/* ASSIGN MODAL */}
      {assignModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-[9999]">

          <div className="bg-white p-6 rounded-2xl w-[350px] shadow-xl">

            <h2 className="text-lg font-bold mb-4">
              Assign Lead
            </h2>

            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {agents.map((a) => (
                <div
                  key={a._id}
                  onClick={() => setSelectedAgent(a._id)}
                  className={`p-3 border rounded cursor-pointer ${
                    selectedAgent === a._id
                      ? "bg-green-100 border-green-600"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {a.name}
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => {
                  if (!selectedAgent) return;
                  updateLead(assignModal._id, {
                    assignedTo: selectedAgent,
                  });
                  setAssignModal(null);
                  setSelectedAgent("");
                }}
                className="flex-1 bg-green-800 text-white py-2 rounded-lg"
              >
                OK
              </button>

              <button
                onClick={() => setAssignModal(null)}
                className="flex-1 bg-gray-200 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}