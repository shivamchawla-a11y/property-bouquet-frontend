"use client";

import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { formatDistanceToNow } from "date-fns";
import {
  Users,
  Phone,
  MessageCircle,
  Flame,
  Snowflake,
  ThermometerSun,
  CheckCircle,
  Mail,
  BarChart3,
  X,
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

  const [roiModal, setRoiModal] = useState(null);

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

  // ================= FETCH LEADS =================

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

  // ================= FETCH AGENTS =================

  const fetchAgents = async () => {
    try {
      const res = await fetch(`${API}/auth/users`, {
        headers: getHeaders(),
      });

      const data = await res.json();

      setAgents(
        (data.data || []).filter(
          (u) => u.role === "Agent"
        )
      );
    } catch (err) {
      console.log(err);
    }
  };

  // ================= UPDATE LEAD =================

  const updateLead = async (id, payload) => {
    try {
      const res = await fetch(`${API}/leads/${id}`, {
        method: "PATCH",
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to update lead");
      }

      await fetchLeads();
    } catch (err) {
      console.log(err);
    }
  };

  // ================= NOTES =================

  const getLatestNote = (notes) => {
    if (
      Array.isArray(notes) &&
      notes.length > 0
    ) {
      return (
        notes[notes.length - 1]?.text || ""
      );
    }

    return "";
  };

  // ================= COUNTS =================

  const total = leads.length;

  const hot = leads.filter(
    (l) => l.priority === "Hot"
  ).length;

  const warm = leads.filter(
    (l) => l.priority === "Warm"
  ).length;

  const cold = leads.filter(
    (l) => l.priority === "Cold"
  ).length;

  const closed = leads.filter(
    (l) => l.status === "Closed"
  ).length;

  // ================= FILTER =================

  const filteredLeads = leads.filter((l) => {
    const normalizedSearch =
      search.toLowerCase().trim();

    const searchMatch =
      !normalizedSearch ||
      l.name
        ?.toLowerCase()
        .includes(normalizedSearch) ||
      l.phone
        ?.toLowerCase()
        .includes(normalizedSearch) ||
      l.email
        ?.toLowerCase()
        .includes(normalizedSearch) ||
      l.property
        ?.toLowerCase()
        .includes(normalizedSearch);

    const propertyMatch =
      propertyFilter === "All" ||
      l.property === propertyFilter;

    const statusMatch =
      statusFilter === "All" ||
      l.status === statusFilter;

    const leadTypeMatch =
      leadTypeFilter === "All" ||
      l.leadType === leadTypeFilter;

    const agentMatch =
      agentFilter === "All" ||
      (agentFilter === "Unassigned" &&
        !l.assignedTo) ||
      (l.assignedTo &&
        l.assignedTo._id === agentFilter);

    const createdDate = new Date(
      l.createdAt
    );

    const dateMatch =
      (!startDate ||
        createdDate >=
          new Date(`${startDate}T00:00:00`)) &&
      (!endDate ||
        createdDate <=
          new Date(`${endDate}T23:59:59`));

    const tabMatch =
      tab === "All" ||
      (tab === "Assigned" && l.assignedTo) ||
      (tab === "Unassigned" &&
        !l.assignedTo);

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

  // ================= PAGINATION =================

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

  // ================= STYLES =================

  const statusStyle = (status) => {
    if (status === "New")
      return "bg-blue-100 text-blue-700 border border-blue-200";

    if (status === "Interested")
      return "bg-green-100 text-green-700 border border-green-200";

    if (status === "Not Interested")
      return "bg-red-100 text-red-600 border border-red-200";

    if (status === "Visit")
      return "bg-yellow-100 text-yellow-700 border border-yellow-200";

    if (status === "Closed")
      return "bg-purple-100 text-purple-700 border border-purple-200";

    return "bg-gray-100 text-gray-700 border border-gray-200";
  };

  const priorityStyle = (priority) => {
    if (priority === "Hot")
      return "bg-red-100 text-red-600 border border-red-200";

    if (priority === "Warm")
      return "bg-yellow-100 text-yellow-700 border border-yellow-200";

    if (priority === "Cold")
      return "bg-blue-100 text-blue-600 border border-blue-200";

    return "bg-gray-100 text-gray-700 border border-gray-200";
  };

  const leadTypeStyle = (type) => {
    if (type === "ROI Calculator") {
      return "bg-purple-100 text-purple-700 border border-purple-200";
    }

    if (type === "Private Consultation") {
      return "bg-amber-100 text-amber-700 border border-amber-200";
    }

    if (type === "Property Enquiry") {
      return "bg-green-100 text-green-700 border border-green-200";
    }

    return "bg-gray-100 text-gray-700 border border-gray-200";
  };

  // ================= CURRENCY =================

  const formatCurrency = (value) => {
    if (
      value === undefined ||
      value === null ||
      value === ""
    ) {
      return "—";
    }

    const number = Number(value);

    if (!Number.isFinite(number)) {
      return "—";
    }

    return `₹${number.toLocaleString(
      "en-IN"
    )}`;
  };

  // ================= EXCEL EXPORT =================

  const exportToExcel = () => {
    const exportData = filteredLeads.map(
      (lead) => {
        const roi = lead.roiDetails || {};

        return {
          Name: lead.name || "",
          Phone: lead.phone || "",
          Email: lead.email || "",
          Property:
            lead.property ||
            "General Enquiry",

          LeadType:
            lead.leadType || "General",

          Source:
            lead.source || "Website",

          Status:
            lead.status || "New",

          Priority:
            lead.priority || "Warm",

          Agent:
            lead.assignedTo?.name ||
            "Unassigned",

          PropertyType:
            roi.propertyType || "",

          Location:
            roi.location || "",

          PropertyValue:
            roi.propertyValue || "",

          CarpetArea:
            roi.carpetArea || "",

          PurchaseDate:
            roi.purchaseDate || "",

          HoldingPeriod:
            roi.holdingPeriod || "",

          DownPayment:
            roi.downPayment || "",

          DownPaymentPercent:
            roi.downPaymentPercent || "",

          LoanAmount:
            roi.loanAmount || "",

          LoanPercent:
            roi.loanPercent || "",

          InterestRate:
            roi.interestRate || "",

          LoanTenure:
            roi.loanTenure || "",

          MonthlyRent:
            roi.monthlyRent || "",

          RentEscalation:
            roi.rentEscalation || "",

          Maintenance:
            roi.maintenance || "",

          PropertyTax:
            roi.propertyTax || "",

          Insurance:
            roi.insurance || "",

          OtherExpenses:
            roi.otherExpenses || "",

          TotalInvestment:
            roi.totalInvestment || "",

          TotalProfit:
            roi.totalProfit || "",

          TotalAppreciation:
            roi.totalAppreciation || "",

          GrossReturns:
            roi.grossReturns || "",

          ROI:
            roi.roi || "",

          Notes:
            getLatestNote(lead.notes),

          CreatedAt: lead.createdAt
            ? new Date(
                lead.createdAt
              ).toLocaleString("en-IN")
            : "",
        };
      }
    );

    const worksheet =
      XLSX.utils.json_to_sheet(
        exportData
      );

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

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg font-semibold text-gray-700">
        Loading Leads...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f7fb] p-6 text-gray-800">

      {/* ================= HEADER ================= */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">

        <div>
          <h1 className="text-4xl font-bold text-[#0b3b2e] flex items-center gap-3">
            <Users className="w-9 h-9" />
            Lead Dashboard
          </h1>

          <p className="text-gray-500 mt-1">
            Manage and track all property leads,
            consultations and ROI enquiries
          </p>
        </div>

      </div>

      {/* ================= TABS ================= */}

      <div className="flex gap-3 flex-wrap mb-6">

        {[
          "All",
          "Assigned",
          "Unassigned",
        ].map((t) => (
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

      {/* ================= KPI CARDS ================= */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-6">

        <Card
          title="Total Leads"
          value={total}
          icon={
            <Users className="text-[#0b5d3b]" />
          }
        />

        <Card
          title="Hot Leads"
          value={hot}
          icon={
            <Flame className="text-red-500" />
          }
        />

        <Card
          title="Warm Leads"
          value={warm}
          icon={
            <ThermometerSun className="text-yellow-500" />
          }
        />

        <Card
          title="Cold Leads"
          value={cold}
          icon={
            <Snowflake className="text-blue-500" />
          }
        />

        <Card
          title="Closed"
          value={closed}
          icon={
            <CheckCircle className="text-green-600" />
          }
        />

      </div>

      {/* ================= FILTERS ================= */}

      <div className="bg-white rounded-3xl shadow-md p-5 mb-6">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4">

          {/* SEARCH */}

          <input
            placeholder="Search name / phone / email"
            className="border border-gray-300 text-gray-800 px-4 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-green-700"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          {/* PROPERTY */}

          <select
            className="border border-gray-300 text-gray-800 px-4 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-green-700 bg-white"
            value={propertyFilter}
            onChange={(e) =>
              setPropertyFilter(
                e.target.value
              )
            }
          >
            <option value="All">
              All Properties
            </option>

            {[
              ...new Set(
                leads
                  .map(
                    (l) => l.property
                  )
                  .filter(Boolean)
              ),
            ].map((property) => (
              <option
                key={property}
                value={property}
              >
                {property}
              </option>
            ))}
          </select>

          {/* STATUS */}

          <select
            className="border border-gray-300 text-gray-800 px-4 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-green-700 bg-white"
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value
              )
            }
          >
            <option value="All">
              All Status
            </option>

            <option value="New">
              New
            </option>

            <option value="Interested">
              Interested
            </option>

            <option value="Not Interested">
              Not Interested
            </option>

            <option value="Visit">
              Visit
            </option>

            <option value="Closed">
              Closed
            </option>
          </select>

          {/* LEAD TYPE */}

          <select
            className="border border-gray-300 text-gray-800 px-4 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-green-700 bg-white"
            value={leadTypeFilter}
            onChange={(e) =>
              setLeadTypeFilter(
                e.target.value
              )
            }
          >
            <option value="All">
              All Lead Types
            </option>

            <option value="General">
              General
            </option>

            <option value="Property Enquiry">
              Property Enquiry
            </option>

            <option value="Private Consultation">
              Private Consultation
            </option>

            <option value="ROI Calculator">
              ROI Calculator
            </option>
          </select>

          {/* AGENT */}

          <select
            className="border border-gray-300 text-gray-800 px-4 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-green-700 bg-white"
            value={agentFilter}
            onChange={(e) =>
              setAgentFilter(
                e.target.value
              )
            }
          >
            <option value="All">
              All Agents
            </option>

            <option value="Unassigned">
              Unassigned
            </option>

            {agents.map((agent) => (
              <option
                key={agent._id}
                value={agent._id}
              >
                {agent.name}
              </option>
            ))}
          </select>

          {/* START DATE */}

          <input
            type="date"
            className="border border-gray-300 text-gray-800 px-4 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-green-700"
            value={startDate}
            onChange={(e) =>
              setStartDate(
                e.target.value
              )
            }
          />

          {/* END DATE */}

          <input
            type="date"
            className="border border-gray-300 text-gray-800 px-4 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-green-700"
            value={endDate}
            onChange={(e) =>
              setEndDate(
                e.target.value
              )
            }
          />

        </div>

      </div>

      {/* ================= TABLE ================= */}

      <div className="bg-white rounded-3xl shadow-md">

        {/* TABLE TOOLBAR */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-5 border-b">

          <div>
            <h2 className="font-bold text-gray-900 text-lg">
              Leads
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              {filteredLeads.length} matching leads
            </p>
          </div>

          <div className="flex items-center gap-4">

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
                    Number(
                      e.target.value
                    )
                  );

                  setCurrentPage(1);
                }}
                className="border border-gray-300 px-3 py-2 rounded-xl"
              >
                <option value={10}>
                  10
                </option>

                <option value={25}>
                  25
                </option>

                <option value={50}>
                  50
                </option>

                <option value={100}>
                  100
                </option>
              </select>
            </div>

          </div>

        </div>

        {/* TABLE */}

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1450px]">

            <thead className="bg-[#f8fafc] border-b border-gray-200">

              <tr className="text-left text-gray-700">

                <th className="px-6 py-4 font-semibold">
                  Lead
                </th>

                <th className="px-6 py-4 font-semibold">
                  Property
                </th>

                <th className="px-6 py-4 font-semibold">
                  Lead Type
                </th>

                <th className="px-6 py-4 font-semibold">
                  Source
                </th>

                <th className="px-6 py-4 font-semibold">
                  Status
                </th>

                <th className="px-6 py-4 font-semibold">
                  Priority
                </th>

                <th className="px-6 py-4 font-semibold">
                  Received
                </th>

                <th className="px-6 py-4 font-semibold">
                  Agent
                </th>

                <th className="px-6 py-4 font-semibold">
                  Actions
                </th>

                <th className="px-6 py-4 font-semibold">
                  Notes
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredLeads.length > 0 ? (
                paginatedLeads.map((lead) => (
                  <tr
                    key={lead._id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition"
                  >

                    {/* ================= LEAD ================= */}

                    <td className="px-6 py-5 min-w-[250px]">

                      <div className="font-semibold text-gray-900">
                        {lead.name}
                      </div>

                      <div className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                        <Phone
                          size={13}
                          className="text-gray-400"
                        />

                        {lead.phone}
                      </div>

                      {/* EMAIL BELOW PHONE */}

                      {lead.email ? (
                        <div className="text-sm text-gray-500 mt-1 flex items-center gap-2 break-all">
                          <Mail
                            size={13}
                            className="text-gray-400 shrink-0"
                          />

                          {lead.email}
                        </div>
                      ) : (
                        <div className="text-xs text-gray-400 mt-1">
                          No email provided
                        </div>
                      )}

                    </td>

                    {/* ================= PROPERTY ================= */}

                    <td className="px-6 py-5">

                      <div className="font-medium text-gray-700 max-w-[220px]">
                        {lead.property ||
                          "General Enquiry"}
                      </div>

                      {lead.leadType ===
                        "ROI Calculator" && (
                        <div className="text-xs text-purple-600 mt-1 font-medium">
                          Investment Analysis
                        </div>
                      )}

                    </td>

                    {/* ================= LEAD TYPE ================= */}

                    <td className="px-6 py-5">

                      <span
                        className={`inline-flex px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${leadTypeStyle(
                          lead.leadType
                        )}`}
                      >
                        {lead.leadType ||
                          "General"}
                      </span>

                    </td>

                    {/* ================= SOURCE ================= */}

                    <td className="px-6 py-5">

                      <span className="inline-flex px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200 whitespace-nowrap">
                        {lead.source ||
                          "Website"}
                      </span>

                    </td>

                    {/* ================= STATUS ================= */}

                    <td className="px-6 py-5">

                      <select
                        value={
                          lead.status
                        }
                        onChange={(e) =>
                          updateLead(
                            lead._id,
                            {
                              status:
                                e.target.value,
                            }
                          )
                        }
                        className={`px-3 py-2 rounded-xl text-sm font-medium outline-none ${statusStyle(
                          lead.status
                        )}`}
                      >
                        <option value="New">
                          New
                        </option>

                        <option value="Interested">
                          Interested
                        </option>

                        <option value="Not Interested">
                          Not Interested
                        </option>

                        <option value="Visit">
                          Visit
                        </option>

                        <option value="Closed">
                          Closed
                        </option>
                      </select>

                    </td>

                    {/* ================= PRIORITY ================= */}

                    <td className="px-6 py-5">

                      <span
                        className={`inline-flex px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${priorityStyle(
                          lead.priority
                        )}`}
                      >
                        {lead.priority ||
                          "Warm"}
                      </span>

                    </td>

                    {/* ================= RECEIVED ================= */}

                    <td className="px-6 py-5">

                      <div className="flex flex-col">

                        <span className="font-semibold text-gray-800 whitespace-nowrap">
                          {formatDistanceToNow(
                            new Date(
                              lead.createdAt
                            ),
                            {
                              addSuffix: true,
                            }
                          )}
                        </span>

                        <span className="text-xs text-gray-500 mt-1 whitespace-nowrap">
                          {new Date(
                            lead.createdAt
                          ).toLocaleString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </span>

                      </div>

                    </td>

                    {/* ================= AGENT ================= */}

                    <td className="px-6 py-5">

                      {lead.assignedTo ? (
                        <div>

                          <div className="font-medium text-gray-800">
                            {
                              lead
                                .assignedTo
                                .name
                            }
                          </div>

                          <div className="flex gap-3 mt-2 text-xs">

                            <button
                              onClick={() => {
                                setAssignModal(
                                  lead
                                );

                                setSelectedAgent(
                                  lead
                                    .assignedTo
                                    ._id
                                );
                              }}
                              className="text-blue-600 font-semibold hover:underline"
                            >
                              Change
                            </button>

                            <button
                              onClick={() =>
                                updateLead(
                                  lead._id,
                                  {
                                    assignedTo:
                                      null,
                                  }
                                )
                              }
                              className="text-red-500 font-semibold hover:underline"
                            >
                              Unassign
                            </button>

                          </div>

                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setAssignModal(
                              lead
                            );
                            setSelectedAgent(
                              ""
                            );
                          }}
                          className="bg-[#0b5d3b] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-90"
                        >
                          Assign
                        </button>
                      )}

                    </td>

                    {/* ================= ACTIONS ================= */}

                    <td className="px-6 py-5">

                      <div className="flex gap-2">

                        {/* CALL */}

                        <button
                          onClick={() =>
                            window.open(
                              `tel:${lead.phone}`
                            )
                          }
                          title="Call"
                          className="bg-green-700 hover:bg-green-800 text-white p-3 rounded-xl"
                        >
                          <Phone
                            size={16}
                          />
                        </button>

                        {/* WHATSAPP */}

                        <button
                          onClick={() =>
                            window.open(
                              `https://wa.me/91${lead.phone}`,
                              "_blank"
                            )
                          }
                          title="WhatsApp"
                          className="bg-[#25D366] hover:opacity-90 text-white p-3 rounded-xl"
                        >
                          <MessageCircle
                            size={16}
                          />
                        </button>

                        {/* EMAIL */}

                        {lead.email && (
                          <button
                            onClick={() =>
                              window.open(
                                `mailto:${lead.email}`
                              )
                            }
                            title="Email"
                            className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl"
                          >
                            <Mail
                              size={16}
                            />
                          </button>
                        )}

                        {/* ROI */}

                        {lead.leadType ===
                          "ROI Calculator" && (
                          <button
                            onClick={() =>
                              setRoiModal(
                                lead
                              )
                            }
                            title="View ROI Details"
                            className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-xl"
                          >
                            <BarChart3
                              size={16}
                            />
                          </button>
                        )}

                      </div>

                    </td>

                    {/* ================= NOTES ================= */}

                    <td className="px-6 py-5 w-[250px]">

                      {editingNoteId ===
                      lead._id ? (
                        <div className="space-y-2">

                          <textarea
                            value={
                              noteValue
                            }
                            onChange={(e) =>
                              setNoteValue(
                                e.target
                                  .value
                              )
                            }
                            className="w-full border border-gray-300 text-gray-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-green-700"
                            rows={3}
                          />

                          <div className="flex gap-2">

                            <button
                              onClick={() => {
                                updateLead(
                                  lead._id,
                                  {
                                    notes:
                                      noteValue ||
                                      "",
                                  }
                                );

                                setEditingNoteId(
                                  null
                                );

                                setNoteValue(
                                  ""
                                );
                              }}
                              className="bg-green-700 text-white px-4 py-2 rounded-lg text-sm"
                            >
                              Save
                            </button>

                            <button
                              onClick={() => {
                                setEditingNoteId(
                                  null
                                );

                                setNoteValue(
                                  ""
                                );
                              }}
                              className="border border-gray-300 px-4 py-2 rounded-lg text-sm"
                            >
                              Cancel
                            </button>

                          </div>

                        </div>
                      ) : (
                        <div
                          onClick={() => {
                            setEditingNoteId(
                              lead._id
                            );

                            setNoteValue(
                              getLatestNote(
                                lead.notes
                              )
                            );
                          }}
                          className="bg-gray-100 hover:bg-gray-200 transition p-3 rounded-xl text-sm text-gray-700 cursor-pointer min-h-[50px]"
                        >
                          {getLatestNote(
                            lead.notes
                          ) ||
                            "+ Add note"}
                        </div>
                      )}

                    </td>

                  </tr>
                ))
              ) : (
                <tr>

                  <td
                    colSpan="10"
                    className="text-center py-16 text-gray-500"
                  >
                    No Leads Found
                  </td>

                </tr>
              )}

            </tbody>

          </table>

        </div>

        {/* ================= PAGINATION ================= */}

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-5 border-t">

          <div className="text-sm text-gray-600">
            {filteredLeads.length === 0
              ? "Showing 0 leads"
              : `Showing ${
                  startIndex + 1
                } - ${Math.min(
                  startIndex +
                    itemsPerPage,
                  filteredLeads.length
                )} of ${
                  filteredLeads.length
                } leads`}
          </div>

          {totalPages > 0 && (
            <div className="flex items-center gap-2 flex-wrap justify-center">

              <button
                disabled={
                  currentPage === 1
                }
                onClick={() =>
                  setCurrentPage(
                    (p) => p - 1
                  )
                }
                className="px-4 py-2 border rounded-xl disabled:opacity-40"
              >
                Previous
              </button>

              {Array.from(
                {
                  length: totalPages,
                },
                (_, i) => (
                  <button
                    key={i}
                    onClick={() =>
                      setCurrentPage(
                        i + 1
                      )
                    }
                    className={`w-10 h-10 rounded-xl ${
                      currentPage ===
                      i + 1
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
                  currentPage ===
                  totalPages
                }
                onClick={() =>
                  setCurrentPage(
                    (p) => p + 1
                  )
                }
                className="px-4 py-2 border rounded-xl disabled:opacity-40"
              >
                Next
              </button>

            </div>
          )}

        </div>

      </div>

      {/* ================= ASSIGN MODAL ================= */}

      {assignModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">

          <div className="bg-white w-[95%] max-w-md rounded-3xl p-6 shadow-2xl">

            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Assign Agent
            </h2>

            <p className="text-sm text-gray-500 mb-5">
              Assign{" "}
              <strong>
                {assignModal.name}
              </strong>{" "}
              to an agent.
            </p>

            <div className="space-y-3 max-h-[300px] overflow-y-auto">

              {agents.length > 0 ? (
                agents.map((agent) => (
                  <div
                    key={agent._id}
                    onClick={() =>
                      setSelectedAgent(
                        agent._id
                      )
                    }
                    className={`p-4 rounded-2xl border cursor-pointer transition ${
                      selectedAgent ===
                      agent._id
                        ? "bg-green-100 border-green-600"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <div className="font-semibold text-gray-800">
                      {agent.name}
                    </div>

                    {agent.email && (
                      <div className="text-xs text-gray-500 mt-1">
                        {agent.email}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-500 text-center py-6">
                  No agents available.
                </div>
              )}

            </div>

            <div className="flex gap-3 mt-6">

              <button
                onClick={() => {
                  setAssignModal(null);
                  setSelectedAgent("");
                }}
                className="flex-1 border border-gray-300 py-3 rounded-2xl font-semibold"
              >
                Cancel
              </button>

              <button
                disabled={!selectedAgent}
                onClick={() => {
                  updateLead(
                    assignModal._id,
                    {
                      assignedTo:
                        selectedAgent ||
                        null,
                    }
                  );

                  setAssignModal(null);
                  setSelectedAgent("");
                }}
                className="flex-1 bg-[#0b5d3b] text-white py-3 rounded-2xl font-semibold disabled:opacity-50"
              >
                Save
              </button>

            </div>

          </div>

        </div>
      )}

      {/* ================= ROI MODAL ================= */}

      {roiModal && (
        <ROIModal
          lead={roiModal}
          onClose={() =>
            setRoiModal(null)
          }
          formatCurrency={
            formatCurrency
          }
        />
      )}

    </div>
  );
}

// =========================================================
// CARD COMPONENT
// =========================================================

function Card({
  title,
  value,
  icon,
}) {
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

// =========================================================
// ROI MODAL
// =========================================================

function ROIModal({
  lead,
  onClose,
  formatCurrency,
}) {
  const roi = lead?.roiDetails || {};

  const Row = ({
    label,
    value,
  }) => (
    <div className="flex items-center justify-between gap-5 py-3 border-b border-gray-100 last:border-0">

      <span className="text-sm text-gray-500">
        {label}
      </span>

      <span className="text-sm font-semibold text-gray-900 text-right">
        {value || "—"}
      </span>

    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">

      <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl">

        {/* HEADER */}

        <div className="flex items-center justify-between px-6 py-5 border-b">

          <div>

            <div className="flex items-center gap-2">

              <BarChart3
                className="text-purple-600"
                size={22}
              />

              <h2 className="text-xl font-bold text-gray-900">
                ROI Investment Details
              </h2>

            </div>

            <p className="text-sm text-gray-500 mt-1">
              {lead.name} •{" "}
              {lead.email ||
                lead.phone}
            </p>

          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
          >
            <X size={18} />
          </button>

        </div>

        {/* CONTENT */}

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-90px)]">

          {/* BASIC PROPERTY DETAILS */}

          <section>

            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-3">
              Property Details
            </h3>

            <div className="border border-gray-200 rounded-2xl px-4">

              <Row
                label="Property Type"
                value={
                  roi.propertyType
                }
              />

              <Row
                label="Location"
                value={
                  roi.location
                }
              />

              <Row
                label="Property Value"
                value={formatCurrency(
                  roi.propertyValue
                )}
              />

              <Row
                label="Carpet Area"
                value={
                  roi.carpetArea
                    ? `${roi.carpetArea} sq.ft.`
                    : "—"
                }
              />

              <Row
                label="Purchase Date"
                value={
                  roi.purchaseDate
                }
              />

              <Row
                label="Holding Period"
                value={
                  roi.holdingPeriod
                    ? `${roi.holdingPeriod} Years`
                    : "—"
                }
              />

            </div>

          </section>

          {/* FINANCING */}

          <section className="mt-6">

            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-3">
              Financing
            </h3>

            <div className="border border-gray-200 rounded-2xl px-4">

              <Row
                label="Down Payment"
                value={
                  roi.downPayment
                    ? `${formatCurrency(
                        roi.downPayment
                      )}${
                        roi.downPaymentPercent
                          ? ` (${roi.downPaymentPercent}%)`
                          : ""
                      }`
                    : "—"
                }
              />

              <Row
                label="Loan Amount"
                value={
                  roi.loanAmount
                    ? `${formatCurrency(
                        roi.loanAmount
                      )}${
                        roi.loanPercent
                          ? ` (${roi.loanPercent}%)`
                          : ""
                      }`
                    : "—"
                }
              />

              <Row
                label="Interest Rate"
                value={
                  roi.interestRate
                    ? `${roi.interestRate}%`
                    : "—"
                }
              />

              <Row
                label="Loan Tenure"
                value={
                  roi.loanTenure
                    ? `${roi.loanTenure} Years`
                    : "—"
                }
              />

            </div>

          </section>

          {/* RENT & EXPENSES */}

          <section className="mt-6">

            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-3">
              Rental & Expenses
            </h3>

            <div className="border border-gray-200 rounded-2xl px-4">

              <Row
                label="Monthly Rent"
                value={formatCurrency(
                  roi.monthlyRent
                )}
              />

              <Row
                label="Rent Escalation"
                value={
                  roi.rentEscalation
                    ? `${roi.rentEscalation}%`
                    : "—"
                }
              />

              <Row
                label="Maintenance"
                value={formatCurrency(
                  roi.maintenance
                )}
              />

              <Row
                label="Property Tax"
                value={formatCurrency(
                  roi.propertyTax
                )}
              />

              <Row
                label="Insurance"
                value={formatCurrency(
                  roi.insurance
                )}
              />

              <Row
                label="Other Expenses"
                value={formatCurrency(
                  roi.otherExpenses
                )}
              />

            </div>

          </section>

          {/* RESULTS */}

          <section className="mt-6">

            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-3">
              Calculated Returns
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <ResultCard
                label="Total Investment"
                value={formatCurrency(
                  roi.totalInvestment
                )}
              />

              <ResultCard
                label="Total Appreciation"
                value={formatCurrency(
                  roi.totalAppreciation
                )}
              />

              <ResultCard
                label="Gross Returns"
                value={formatCurrency(
                  roi.grossReturns
                )}
              />

              <ResultCard
                label="Total Profit"
                value={formatCurrency(
                  roi.totalProfit
                )}
                highlight
              />

              <ResultCard
                label="ROI"
                value={
                  roi.roi !==
                  undefined
                    ? `${roi.roi}%`
                    : "—"
                }
                highlight
              />

            </div>

          </section>

        </div>

      </div>

    </div>
  );
}

// =========================================================
// ROI RESULT CARD
// =========================================================

function ResultCard({
  label,
  value,
  highlight = false,
}) {
  return (
    <div
      className={`rounded-2xl p-4 border ${
        highlight
          ? "bg-[#f8f4ea] border-[#e5d3a5]"
          : "bg-gray-50 border-gray-200"
      }`}
    >

      <p className="text-xs uppercase tracking-wide text-gray-500">
        {label}
      </p>

      <p
        className={`text-xl font-bold mt-1 ${
          highlight
            ? "text-[#8d6a24]"
            : "text-gray-900"
        }`}
      >
        {value}
      </p>

    </div>
  );
}