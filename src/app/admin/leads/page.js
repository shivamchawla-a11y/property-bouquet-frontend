"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Users, Download } from "lucide-react";

export default function LeadsPage() {
  const router = useRouter();

  const [leads, setLeads] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [propertyFilter, setPropertyFilter] = useState("All");
  const [sourceFilter, setSourceFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const API = "https://property-bouquet-backend.onrender.com/api";

  // ================= AUTH HEADERS =================
  const getHeaders = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return {};
    }

    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  // ================= SAFE JSON PARSER =================
  const safeJSON = async (res) => {
    const text = await res.text();

    try {
      return JSON.parse(text);
    } catch {
      console.error("❌ Non-JSON response:", text);
      throw new Error("Invalid JSON (probably API route not found)");
    }
  };

  // ================= INIT =================
  useEffect(() => {
    const init = async () => {
      try {
        const res = await fetch(`${API}/auth/me`, {
          headers: getHeaders(),
        });

        const data = await safeJSON(res);

        if (!res.ok || data.user.role !== "SuperAdmin") {
          router.push("/admin");
          return;
        }

        await fetchLeads();
        await fetchAgents();

        setLoading(false);
      } catch (err) {
        console.error(err);
        router.push("/login");
      }
    };

    init();
  }, []);

  // ================= FETCH LEADS =================
  const fetchLeads = async () => {
    try {
      const res = await fetch(`${API}/leads`, {
        headers: getHeaders(),
      });

      const data = await safeJSON(res);

      console.log("🔥 LEADS RESPONSE:", data);

      if (res.ok) {
        // SUPPORT MULTIPLE RESPONSE FORMATS
        const list = data.data || data.leads || data || [];
        setLeads(Array.isArray(list) ? list : []);
      }
    } catch (err) {
      console.error("Leads fetch error:", err);
    }
  };

  // ================= FETCH AGENTS =================
  const fetchAgents = async () => {
    try {
      const res = await fetch(`${API}/auth/users`, {
        headers: getHeaders(),
      });

      const data = await safeJSON(res);

      if (res.ok) {
        const onlyAgents =
          (data.data || []).filter((u) => u.role === "Agent") || [];
        setAgents(onlyAgents);
      }
    } catch (err) {
      console.error("Agents fetch error:", err);
    }
  };

  // ================= UPDATE =================
  const updateLead = async (id, payload) => {
    try {
      await fetch(`${API}/leads/${id}`, {
        method: "PATCH",
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });

      fetchLeads();
    } catch (err) {
      console.error(err);
    }
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

    const dateMatch =
      (!startDate || new Date(l.date) >= new Date(startDate)) &&
      (!endDate || new Date(l.date) <= new Date(endDate));

    return (
      searchMatch &&
      propertyMatch &&
      sourceMatch &&
      statusMatch &&
      dateMatch
    );
  });

  // ================= CSV =================
  const exportCSV = () => {
    const csv = [
      ["Name", "Phone", "Property", "Source", "Status", "Date"],
      ...filteredLeads.map((l) => [
        l.name,
        l.phone,
        l.property,
        l.source,
        l.status,
        l.date,
      ]),
    ]
      .map((r) => r.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "leads.csv";
    a.click();
  };

  const openWhatsApp = (phone) => {
    window.open(`https://wa.me/91${phone}`, "_blank");
  };

  const statusColor = (status) => {
    if (status === "New") return "bg-blue-100 text-blue-600";
    if (status === "Contacted") return "bg-yellow-100 text-yellow-700";
    if (status === "Closed") return "bg-green-100 text-green-600";
    return "bg-gray-100 text-gray-600";
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center text-gray-500">
        Loading CRM...
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2 text-primary">
          <Users /> Lead CRM
        </h1>

        <button
          onClick={exportCSV}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg shadow hover:scale-105 transition"
        >
          <Download size={16} /> Export CSV
        </button>
      </div>

      {/* FILTERS */}
      <div className="bg-white p-5 rounded-2xl shadow flex flex-wrap gap-4 items-end border">

        <input
          placeholder="Search name / phone..."
          className="input min-w-[220px]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select className="input" onChange={(e)=>setPropertyFilter(e.target.value)}>
          <option>All</option>
          {[...new Set(leads.map(l=>l.property))].map(p=>(
            <option key={p}>{p}</option>
          ))}
        </select>

        <select className="input" onChange={(e)=>setSourceFilter(e.target.value)}>
          <option>All</option>
          <option>Website</option>
          <option>Facebook</option>
          <option>Google</option>
        </select>

        <select className="input" onChange={(e)=>setStatusFilter(e.target.value)}>
          <option>All</option>
          <option>New</option>
          <option>Contacted</option>
          <option>Closed</option>
        </select>

        <input type="date" className="input" onChange={(e)=>setStartDate(e.target.value)} />
        <input type="date" className="input" onChange={(e)=>setEndDate(e.target.value)} />

      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow overflow-hidden border">

        {filteredLeads.length === 0 ? (
          <div className="p-10 text-center text-gray-400">
            🚫 No leads found
          </div>
        ) : (
          <table className="w-full text-sm">

            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="p-4 text-left">Lead</th>
                <th>Property</th>
                <th>Source</th>
                <th>Status</th>
                <th>Agent</th>
                <th>Notes</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredLeads.map((l) => (
                <tr key={l._id} className="border-t hover:bg-gray-50">

                  <td className="p-4">
                    <div className="font-semibold">{l.name}</div>
                    <div className="text-xs text-gray-500">{l.phone}</div>
                  </td>

                  <td>{l.property}</td>
                  <td>{l.source}</td>

                  <td>
                    <select
                      value={l.status}
                      onChange={(e)=>updateLead(l._id,{status:e.target.value})}
                      className={`px-2 py-1 rounded text-xs ${statusColor(l.status)}`}
                    >
                      <option>New</option>
                      <option>Contacted</option>
                      <option>Closed</option>
                    </select>
                  </td>

                  <td>
                    <select
                      value={l.assignedTo || ""}
                      onChange={(e)=>updateLead(l._id,{assignedTo:e.target.value})}
                      className="border rounded px-2 py-1 text-xs"
                    >
                      <option value="">Assign</option>
                      {agents.map((a)=>(
                        <option key={a._id} value={a._id}>{a.name}</option>
                      ))}
                    </select>
                  </td>

                  <td>
                    <input
                      defaultValue={l.notes || ""}
                      onBlur={(e)=>updateLead(l._id,{notes:e.target.value})}
                      className="border px-2 py-1 rounded text-xs w-[140px]"
                    />
                  </td>

                  <td>{l.date}</td>

                  <td>
                    <button
                      onClick={()=>openWhatsApp(l.phone)}
                      className="bg-green-500 text-white px-3 py-1 rounded text-xs"
                    >
                      WhatsApp
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        )}
      </div>

    </div>
  );
}