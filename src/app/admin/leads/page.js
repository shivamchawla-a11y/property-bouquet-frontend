"use client";

import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
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
  const [leadTypeFilter, setLeadTypeFilter] = useState("All");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [assignModal, setAssignModal] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState("");

  const [editingNoteId, setEditingNoteId] = useState(null);
  const [noteValue, setNoteValue] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
const [itemsPerPage, setItemsPerPage] = useState(10);

  const API = "/api";

  const getHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  useEffect(() => {
    fetchLeads();
    fetchAgents();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await fetch(`${API}/leads`, {
        headers: getHeaders(),
      });

      const data = await res.json();

      setLeads(data.data || []);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const fetchAgents = async () => {
    try {
      const res = await fetch(`${API}/auth/users`, {
        headers: getHeaders(),
      });

      const data = await res.json();

      setAgents((data.data || []).filter((u) => u.role === "Agent"));
    } catch (err) {
      console.log(err);
    }
  };

  const updateLead = async (id, payload) => {
    try {
      await fetch(`${API}/leads/${id}`, {
        method: "PATCH",
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });

      fetchLeads();
    } catch (err) {
      console.log(err);
    }
  };

  const getLatestNote = (notes) => {
    if (Array.isArray(notes) && notes.length > 0) {
      return notes[notes.length - 1]?.text || "";
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

      const leadTypeMatch =
  leadTypeFilter === "All" ||
  l.leadType === leadTypeFilter;

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
  leadTypeMatch &&
  agentMatch &&
  dateMatch &&
  tabMatch
);
  });

  const totalPages = Math.ceil(
  filteredLeads.length / itemsPerPage
);

const startIndex =
  (currentPage - 1) * itemsPerPage;

const paginatedLeads =
  filteredLeads.slice(
    startIndex,
    startIndex + itemsPerPage
  );

useEffect(() => {
  setCurrentPage(1);
}, [
  search,
  propertyFilter,
  statusFilter,
  leadTypeFilter,
  agentFilter,
  startDate,
  endDate,
  tab,
]);

  const statusStyle = (s) => {
    if (s === "New")
      return "bg-blue-100 text-blue-700 border border-blue-200";

    if (s === "Interested")
      return "bg-green-100 text-green-700 border border-green-200";

    if (s === "Not Interested")
      return "bg-red-100 text-red-600 border border-red-200";

    if (s === "Visit")
      return "bg-yellow-100 text-yellow-700 border border-yellow-200";

    if (s === "Closed")
      return "bg-purple-100 text-purple-700 border border-purple-200";

    return "bg-gray-100 text-gray-700 border border-gray-200";
  };

  const priorityStyle = (p) => {
    if (p === "Hot")
      return "bg-red-100 text-red-600 border border-red-200";

    if (p === "Warm")
      return "bg-yellow-100 text-yellow-700 border border-yellow-200";

    if (p === "Cold")
      return "bg-blue-100 text-blue-600 border border-blue-200";

    return "bg-gray-100 text-gray-700 border border-gray-200";
  };

  const exportToExcel = () => {
  const exportData = filteredLeads.map((lead) => ({
    Name: lead.name,
    Phone: lead.phone,
    Property: lead.property,
    Source: lead.source || "Website",
    Status: lead.status,
    Priority: lead.priority,
    Agent: lead.assignedTo?.name || "Unassigned",
    Notes: getLatestNote(lead.notes),
    CreatedAt: new Date(
      lead.createdAt
    ).toLocaleString(),
  }));

  const worksheet =
    XLSX.utils.json_to_sheet(exportData);

  const workbook =
    XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Leads"
  );

  XLSX.writeFile(
    workbook,
    `Leads_${new Date()
      .toISOString()
      .slice(0, 10)}.xlsx`
  );
};

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg font-semibold text-gray-700">
        Loading Leads...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f7fb] p-6 text-gray-800">

      {/* HEADER */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">

        <div>
          <h1 className="text-4xl font-bold text-[#0b3b2e] flex items-center gap-3">
            <Users className="w-9 h-9" />
            Lead Dashboard
          </h1>

          <p className="text-gray-500 mt-1">
            Manage and track all property leads
          </p>
        </div>

      </div>

      {/* TABS */}

      <div className="flex gap-3 flex-wrap mb-6">

        {["All", "Assigned", "Unassigned"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
              tab === t
                ? "bg-[#0b5d3b] text-white shadow-lg"
                : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {t}
          </button>
        ))}

      </div>

      {/* KPI CARDS */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-6">

        <Card
          title="Total Leads"
          value={total}
          icon={<Users className="text-[#0b5d3b]" />}
        />

        <Card
          title="Hot Leads"
          value={hot}
          icon={<Flame className="text-red-500" />}
        />

        <Card
          title="Warm Leads"
          value={warm}
          icon={<ThermometerSun className="text-yellow-500" />}
        />

        <Card
          title="Cold Leads"
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

      <div className="bg-white rounded-3xl shadow-md p-5 mb-6">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">

          <input
            placeholder="Search name / phone"
            className="border border-gray-300 text-gray-800 px-4 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-green-700"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="border border-gray-300 text-gray-800 px-4 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-green-700 bg-white"
            value={propertyFilter}
            onChange={(e) => setPropertyFilter(e.target.value)}
          >
            <option value="All">All Properties</option>

            {[...new Set(leads.map((l) => l.property))].map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>

          <select
            className="border border-gray-300 text-gray-800 px-4 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-green-700 bg-white"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="New">New</option>
            <option value="Interested">Interested</option>
            <option value="Not Interested">Not Interested</option>
            <option value="Visit">Visit</option>
            <option value="Closed">Closed</option>
          </select>

          <select
  className="border border-gray-300 text-gray-800 px-4 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-green-700 bg-white"
  value={leadTypeFilter}
  onChange={(e) =>
    setLeadTypeFilter(e.target.value)
  }
>
  <option value="All">
    All Lead Types
  </option>

  <option value="Brochure">
    Brochure
  </option>

  <option value="Consultation">
    Consultation
  </option>

  <option value="Site Visit">
    Site Visit
  </option>

  <option value="Callback">
    Callback
  </option>
</select>

          <select
            className="border border-gray-300 text-gray-800 px-4 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-green-700 bg-white"
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

          <input
            type="date"
            className="border border-gray-300 text-gray-800 px-4 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-green-700"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

          <input
            type="date"
            className="border border-gray-300 text-gray-800 px-4 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-green-700"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />

        </div>

      </div>

      {/* TABLE */}

      {/* TABLE */}

<div className="bg-white rounded-3xl shadow-md">

  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-5 border-b">

    <button
      onClick={exportToExcel}
      className="bg-[#0b5d3b] text-white px-5 py-3 rounded-2xl font-semibold hover:opacity-90"
    >
      Export Excel
    </button>

    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-600">
        Items per page
      </span>

      <select
        value={itemsPerPage}
        onChange={(e) => {
          setItemsPerPage(
            Number(e.target.value)
          );
          setCurrentPage(1);
        }}
        className="border border-gray-300 px-3 py-2 rounded-xl"
      >
        <option value={10}>10</option>
        <option value={25}>25</option>
        <option value={50}>50</option>
        <option value={100}>100</option>
      </select>
    </div>

  </div>

  <div className="overflow-x-auto">

        <table className="w-full min-w-[1100px]">

          <thead className="bg-[#f8fafc] border-b border-gray-200">

            <tr className="text-left text-gray-700">

              <th className="px-6 py-4 font-semibold">Lead</th>

              <th className="px-6 py-4 font-semibold">Property</th>

              <th className="px-6 py-4 font-semibold">
                Source
              </th>

              <th className="px-6 py-4 font-semibold">Status</th>

              <th className="px-6 py-4 font-semibold">Priority</th>

              <th className="px-6 py-4 font-semibold">Agent</th>

              <th className="px-6 py-4 font-semibold">Notes</th>

              <th className="px-6 py-4 font-semibold">Actions</th>

            </tr>

          </thead>

          <tbody>

            {filteredLeads.length > 0 ? (
              paginatedLeads.map((l) => (
                <tr
                  key={l._id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition"
                >

                  {/* LEAD */}

                  <td className="px-6 py-5">

                    <div className="font-semibold text-gray-900">
                      {l.name}
                    </div>

                    <div className="text-sm text-gray-500 mt-1">
                      {l.phone}
                    </div>

                  </td>

                  {/* PROPERTY */}

                  <td className="px-6 py-5 text-gray-700 font-medium">
                    {l.property}
                  </td>

                  {/* LEAD TYPE */}

<td className="px-6 py-5">
  <span
    className={`px-3 py-1 rounded-full text-xs font-semibold ${
      l.source ===
      "Private Consultation"
        ? "bg-amber-100 text-amber-700 border border-amber-200"
        : "bg-gray-100 text-gray-700 border border-gray-200"
    }`}
  >
    {l.source || "Website"}
  </span>
</td>

                  {/* STATUS */}

                  <td className="px-6 py-5">

                    <select
                      value={l.status}
                      onChange={(e) =>
                        updateLead(l._id, {
                          status: e.target.value,
                        })
                      }
                      className={`px-3 py-2 rounded-xl text-sm font-medium outline-none ${statusStyle(
                        l.status
                      )}`}
                    >
                      <option value="New">New</option>

                      <option value="Interested">Interested</option>

                      <option value="Not Interested">
                        Not Interested
                      </option>

                      <option value="Visit">Visit</option>

                      <option value="Closed">Closed</option>

                    </select>

                  </td>

                  {/* PRIORITY */}

                  <td className="px-6 py-5">

                    <span
                      className={`px-4 py-2 rounded-full text-xs font-bold ${priorityStyle(
                        l.priority
                      )}`}
                    >
                      {l.priority || "Warm"}
                    </span>

                  </td>

                  {/* AGENT */}

                  <td className="px-6 py-5">

                    {l.assignedTo ? (
                      <div>

                        <div className="font-medium text-gray-800">
                          {l.assignedTo.name}
                        </div>

                        <div className="flex gap-3 mt-2 text-xs">

                          <button
                            onClick={() => {
                              setAssignModal(l);
                              setSelectedAgent(l.assignedTo._id);
                            }}
                            className="text-blue-600 font-semibold hover:underline"
                          >
                            Change
                          </button>

                          <button
                            onClick={() =>
                              updateLead(l._id, {
                                assignedTo: null,
                              })
                            }
                            className="text-red-500 font-semibold hover:underline"
                          >
                            Unassign
                          </button>

                        </div>

                      </div>
                    ) : (
                      <button
                        onClick={() => setAssignModal(l)}
                        className="bg-[#0b5d3b] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-90"
                      >
                        Assign
                      </button>
                    )}

                  </td>

                  {/* NOTES */}

                  <td className="px-6 py-5 w-[250px]">

                    {editingNoteId === l._id ? (
                      <div className="space-y-2">

                        <textarea
                          value={noteValue}
                          onChange={(e) => setNoteValue(e.target.value)}
                          className="w-full border border-gray-300 text-gray-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-green-700"
                          rows={3}
                        />

                        <button
                          onClick={() => {
                            updateLead(l._id, {
                              notes: noteValue || "",
                            });

                            setEditingNoteId(null);
                          }}
                          className="bg-green-700 text-white px-4 py-2 rounded-lg text-sm"
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
                        className="bg-gray-100 hover:bg-gray-200 transition p-3 rounded-xl text-sm text-gray-700 cursor-pointer min-h-[50px]"
                      >
                        {getLatestNote(l.notes) || "+ Add note"}
                      </div>
                    )}

                  </td>

                  {/* ACTIONS */}

                  <td className="px-6 py-5">

                    <div className="flex gap-3">

                      <button
                        onClick={() => window.open(`tel:${l.phone}`)}
                        className="bg-green-700 hover:bg-green-800 text-white p-3 rounded-xl"
                      >
                        <Phone size={16} />
                      </button>

                      <button
                        onClick={() =>
                          window.open(`https://wa.me/91${l.phone}`)
                        }
                        className="bg-[#25D366] hover:opacity-90 text-white p-3 rounded-xl"
                      >
                        <MessageCircle size={16} />
                      </button>

                    </div>

                  </td>

                </tr>
              ))
            ) : (
              <tr>

                <td
                  colSpan="7"
                  className="text-center py-16 text-gray-500"
                >
                  No Leads Found
                </td>

              </tr>
            )}

          </tbody>

        </table>
<div className="flex flex-col md:flex-row items-center justify-between gap-4 p-5 border-t">

  <div className="text-sm text-gray-600">
    Showing {startIndex + 1} -
    {Math.min(
      startIndex + itemsPerPage,
      filteredLeads.length
    )} of {filteredLeads.length} leads
  </div>

  <div className="flex items-center gap-2">

    <button
      disabled={currentPage === 1}
      onClick={() =>
        setCurrentPage((p) => p - 1)
      }
      className="px-4 py-2 border rounded-xl disabled:opacity-40"
    >
      Previous
    </button>

    {Array.from(
      { length: totalPages },
      (_, i) => (
        <button
          key={i}
          onClick={() =>
            setCurrentPage(i + 1)
          }
          className={`w-10 h-10 rounded-xl ${
            currentPage === i + 1
              ? "bg-[#0b5d3b] text-white"
              : "border"
          }`}
        >
          {i + 1}
        </button>
      )
    )}

    <button
      disabled={
        currentPage === totalPages
      }
      onClick={() =>
        setCurrentPage((p) => p + 1)
      }
      className="px-4 py-2 border rounded-xl disabled:opacity-40"
    >
      Next
    </button>

  </div>

</div>
        </div>

      </div>

      {/* ASSIGN MODAL */}

      {assignModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">

          <div className="bg-white w-[95%] max-w-md rounded-3xl p-6 shadow-2xl">

            <h2 className="text-2xl font-bold text-gray-800 mb-5">
              Assign Agent
            </h2>

            <div className="space-y-3 max-h-[300px] overflow-y-auto">

              {agents.map((a) => (
                <div
                  key={a._id}
                  onClick={() => setSelectedAgent(a._id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition ${
                    selectedAgent === a._id
                      ? "bg-green-100 border-green-600"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <div className="font-semibold text-gray-800">
                    {a.name}
                  </div>
                </div>
              ))}

            </div>

            <div className="flex gap-3 mt-6">

              <button
                onClick={() => setAssignModal(null)}
                className="flex-1 border border-gray-300 py-3 rounded-2xl font-semibold"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  updateLead(assignModal._id, {
                    assignedTo: selectedAgent || null,
                  });

                  setAssignModal(null);
                }}
                className="flex-1 bg-[#0b5d3b] text-white py-3 rounded-2xl font-semibold"
              >
                Save
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

// ================= CARD COMPONENT =================

function Card({ title, value, icon }) {
  return (
    <div className="bg-white rounded-3xl shadow-md p-5 flex items-center justify-between hover:shadow-lg transition">

      <div>

        <p className="text-sm text-gray-500 font-medium">
          {title}
        </p>

        <h2 className="text-3xl font-bold text-gray-900 mt-1">
          {value}
        </h2>

      </div>

      <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center">
        {icon}
      </div>

    </div>
  );
}