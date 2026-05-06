"use client";

import { useState, useEffect } from "react";
import {
  Users,
  Phone,
  MessageCircle,
  Flame,
  Snowflake,
  ThermometerSun,
  CheckCircle,
} from "lucide-react";

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("All");

  const [agentFilter, setAgentFilter] = useState("All");
  const [propertyFilter, setPropertyFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [assignModal, setAssignModal] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState("");

  const [editingNoteId, setEditingNoteId] = useState(null);
  const [noteValue, setNoteValue] = useState("");

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
    const res = await fetch(`${API}/leads`, { headers: getHeaders() });
    const data = await res.json();
    setLeads(data.data || []);
    setLoading(false);
  };

  const fetchAgents = async () => {
    const res = await fetch(`${API}/auth/users`, { headers: getHeaders() });
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

  const getLatestNote = (notes) => {
    if (Array.isArray(notes) && notes.length > 0) {
      return notes[notes.length - 1].text;
    }
    return "";
  };

  // ================= COUNTS =================
  const total = leads.length;
  const hot = leads.filter((l) => l.priority === "Hot").length;
  const warm = leads.filter((l) => l.priority === "Warm").length;
  const cold = leads.filter((l) => l.priority === "Cold").length;
  const closed = leads.filter((l) => l.status === "Closed").length;

  // ================= FILTER =================
  const filteredLeads = leads.filter((l) => {
    const searchMatch =
      l.name?.toLowerCase().includes(search.toLowerCase()) ||
      l.phone?.includes(search);

    const propertyMatch =
      propertyFilter === "All" || l.property === propertyFilter;

    const statusMatch =
      statusFilter === "All" || l.status === statusFilter;

    const agentMatch =
      agentFilter === "All" ||
      (agentFilter === "Unassigned" && !l.assignedTo) ||
      (l.assignedTo && l.assignedTo._id === agentFilter);

    const dateMatch =
      (!startDate || new Date(l.createdAt) >= new Date(startDate)) &&
      (!endDate || new Date(l.createdAt) <= new Date(endDate));

    const tabMatch =
      tab === "All" ||
      (tab === "Assigned" && l.assignedTo) ||
      (tab === "Unassigned" && !l.assignedTo);

    return (
      searchMatch &&
      propertyMatch &&
      statusMatch &&
      agentMatch &&
      dateMatch &&
      tabMatch
    );
  });

  const statusStyle = (s) => {
    if (s === "New") return "bg-blue-100 text-blue-700";
    if (s === "Interested") return "bg-green-100 text-green-700";
    if (s === "Not Interested") return "bg-red-100 text-red-600";
    if (s === "Visit") return "bg-yellow-100 text-yellow-700";
    if (s === "Closed") return "bg-purple-100 text-purple-700";
    return "bg-gray-100 text-gray-600";
  };

  const priorityStyle = (p) => {
    if (p === "Hot") return "bg-red-100 text-red-600";
    if (p === "Warm") return "bg-yellow-100 text-yellow-700";
    if (p === "Cold") return "bg-blue-100 text-blue-600";
    return "bg-gray-100";
  };

  if (loading) return <div className="p-10">Loading...</div>;

  return (
    <div className="p-6 space-y-6 bg-[#f4f6f9] min-h-screen">

      {/* HEADER */}
      <h1 className="text-3xl font-bold flex gap-2">
        <Users /> Lead Dashboard
      </h1>

      {/* TABS */}
      <div className="flex gap-3">
        {["All", "Assigned", "Unassigned"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-full ${
              tab === t ? "bg-green-800 text-white" : "bg-white shadow"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-5 gap-4">

        <Card title="Total" value={total} icon={<Users />} />

        <Card
          title="Hot"
          value={hot}
          icon={<Flame className="text-red-500" />}
        />

        <Card
          title="Warm"
          value={warm}
          icon={<ThermometerSun className="text-yellow-500" />}
        />

        <Card
          title="Cold"
          value={cold}
          icon={<Snowflake className="text-blue-500" />}
        />

        <Card
          title="Closed"
          value={closed}
          icon={<CheckCircle className="text-green-600" />}
        />
      </div>

      {/* FILTERS */}
      {/* FILTER BAR */}
      <div className="bg-white p-5 rounded-2xl shadow flex flex-wrap gap-4">

        <input
          placeholder="Search name / phone"
          className="border px-4 py-2 rounded-xl"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border px-3 py-2 rounded-xl"
          onChange={(e) => setPropertyFilter(e.target.value)}
        >
          <option value="All">All Properties</option>
          {[...new Set(leads.map((l) => l.property))].map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>

        <select
          className="border px-3 py-2 rounded-xl"
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Status</option>
          <option>New</option>
          <option>Interested</option>
          <option>Not Interested</option>
          <option>Visit</option>
          <option>Closed</option>
        </select>

        <select
          className="border px-3 py-2 rounded-xl"
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

        <input
          type="date"
          className="border px-3 py-2 rounded-xl"
          onChange={(e) => setStartDate(e.target.value)}
        />

        <input
          type="date"
          className="border px-3 py-2 rounded-xl"
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>


      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

        <table className="w-full text-sm">

          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="p-5 text-left">Lead</th>
              <th>Property</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Agent</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredLeads.map((l) => (
              <tr key={l._id} className="border-t hover:bg-gray-50">

                <td className="p-5">
                  <div className="font-semibold">{l.name}</div>
                  <div className="text-xs text-gray-500">{l.phone}</div>
                </td>

                <td>{l.property}</td>

                <td>
                  <select
                    value={l.status}
                    onChange={(e) =>
                      updateLead(l._id, { status: e.target.value })
                    }
                    className={`px-2 py-1 rounded ${statusStyle(l.status)}`}
                  >
                    <option>New</option>
                    <option>Interested</option>
                    <option>Not Interested</option>
                    <option>Visit</option>
                    <option>Closed</option>
                  </select>
                </td>

                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${priorityStyle(
                      l.priority
                    )}`}
                  >
                    {l.priority || "Warm"}
                  </span>
                </td>

                <td>
                  {l.assignedTo ? (
                    <div>
                      {l.assignedTo.name}
                      <div className="flex gap-2 text-xs">
                        <button
                          onClick={() => {
                            setAssignModal(l);
                            setSelectedAgent(l.assignedTo._id);
                          }}
                          className="text-blue-600"
                        >
                          Change
                        </button>

                        <button
                          onClick={() =>
                            updateLead(l._id, { assignedTo: null })
                          }
                          className="text-red-500"
                        >
                          Unassign
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setAssignModal(l)}
                      className="text-blue-600"
                    >
                      Assign
                    </button>
                  )}
                </td>

                <td className="w-[220px]">
                  {editingNoteId === l._id ? (
                    <div>
                      <textarea
                        value={noteValue}
                        onChange={(e) => setNoteValue(e.target.value)}
                        className="w-full border p-2 rounded"
                      />

                      <button
                        onClick={() => {
                            updateLead(l._id, { notes: noteValue || "" });
                            setEditingNoteId(null);
                          }}
                        className="text-green-600 text-xs"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => {
                        setEditingNoteId(l._id);
                        setNoteValue(getLatestNote(l.notes));
                      }}
                      className="bg-gray-50 p-2 rounded cursor-pointer text-xs hover:bg-gray-100"
                    >
                      {getLatestNote(l.notes) || "+ Add note"}
                    </div>
                  )}
                </td>

                <td className="flex gap-2">
                  <button
                    onClick={() => window.open(`tel:${l.phone}`)}
                    className="bg-green-600 text-white p-2 rounded-lg"
                  >
                    <Phone size={14} />
                  </button>

                  <button
                    onClick={() =>
                      window.open(`https://wa.me/91${l.phone}`)
                    }
                    className="bg-green-500 text-white p-2 rounded-lg"
                  >
                    <MessageCircle size={14} />
                  </button>
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {/* ASSIGN MODAL */}
      {assignModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">

          <div className="bg-white p-6 rounded-xl w-[300px]">

            <h2 className="font-bold mb-4">Assign Agent</h2>

            {agents.map((a) => (
              <div
                key={a._id}
                onClick={() => setSelectedAgent(a._id)}
                className={`p-2 border mb-2 cursor-pointer ${
                  selectedAgent === a._id ? "bg-green-200" : ""
                }`}
              >
                {a.name}
              </div>
            ))}

            <button
              onClick={() => {
                updateLead(assignModal._id, {
                  assignedTo: selectedAgent || null,
                });
                setAssignModal(null);
              }}
              className="bg-green-700 text-white px-4 py-2 mt-3 w-full"
            >
              Save
            </button>

          </div>
        </div>
      )}

    </div>
  );
}

// 🔥 CARD COMPONENT
function Card({ title, value, icon }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow flex justify-between items-center">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h2 className="text-xl font-bold">{value}</h2>
      </div>
      {icon}
    </div>
  );
}