"use client";

import { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { formatDistanceToNow } from "date-fns";
import {
  Users,
  Phone,
  MessageCircle,
  CheckCircle,
  Mail,
  BarChart3,
  X,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Search,
  SlidersHorizontal,
  CalendarDays,
  UserRound,
  ClipboardList,
  Download,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from "lucide-react";

const STATUSES = ["New", "Interested", "Not Interested", "Visit", "Closed"];
const PAGE_SIZES = [10, 25, 50, 100];
const safeText = (value) => String(value ?? "").trim();

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [notice, setNotice] = useState(null);
  const [updatingLeadIds, setUpdatingLeadIds] = useState([]);

  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [propertyFilter, setPropertyFilter] = useState("All");
  const [leadTypeFilter, setLeadTypeFilter] = useState("All");
  const [sourceFilter, setSourceFilter] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

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
    // Initial data load only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchLeads = async ({ silent = false } = {}) => {
    if (!silent) setRefreshing(true);

    try {
      const res = await fetch(`${API}/leads`, {
        headers: getHeaders(),
        cache: "no-store",
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.message || "Unable to load leads.");
      }

      setLeads(Array.isArray(data?.data) ? data.data : []);
      setFetchError("");
    } catch (err) {
      console.error("FETCH LEADS ERROR:", err);
      setFetchError(err?.message || "Unable to load leads. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };


  const updateLead = async (id, payload) => {
    const leadId = String(id);
    setUpdatingLeadIds((current) =>
      current.includes(leadId) ? current : [...current, leadId]
    );

    try {
      const res = await fetch(`${API}/leads/${id}`, {
        method: "PATCH",
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.message || "Failed to update lead.");
      }

      // Refresh from the API so populated fields (agent and note history)
      // remain in the exact shape expected by the existing UI.
      await fetchLeads({ silent: true });
      setNotice({
        type: "success",
        message: data?.message || "Lead updated successfully.",
      });
      return true;
    } catch (err) {
      console.error("UPDATE LEAD ERROR:", err);
      setNotice({
        type: "error",
        message: err?.message || "Could not update this lead. Please try again.",
      });
      return false;
    } finally {
      setUpdatingLeadIds((current) => current.filter((item) => item !== leadId));
    }
  };

  const handleLeadratAction = async (lead, action) => {
    const leadId = String(lead._id);
    const isPush = action === "push-to-leadrat";
    const confirmation = isPush
      ? `Send ${lead.name || "this lead"} to Leadrat? This will submit the enquiry to your CRM.`
      : `Reject ${lead.name || "this lead"}? It will remain on the website and will not be sent to Leadrat.`;

    if (!window.confirm(confirmation)) return;

    setUpdatingLeadIds((current) =>
      current.includes(leadId) ? current : [...current, leadId]
    );

    try {
      const res = await fetch(`${API}/leads/${leadId}/${action}`, {
        method: "POST",
        headers: getHeaders(),
        cache: "no-store",
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok || data?.success === false) {
        throw new Error(data?.message || "Unable to update Leadrat status.");
      }

      await fetchLeads({ silent: true });
      setNotice({
        type: "success",
        message: data?.message || (isPush ? "Lead sent to Leadrat." : "Lead rejected."),
      });
    } catch (err) {
      console.error("LEADRAT ACTION ERROR:", err);
      await fetchLeads({ silent: true });
      setNotice({
        type: "error",
        message: err?.message || "Could not complete the Leadrat action.",
      });
    } finally {
      setUpdatingLeadIds((current) => current.filter((item) => item !== leadId));
    }
  };

  const getLeadratStatus = (lead) => lead.leadratSyncStatus || "Pending Review";

  const getLatestNote = (notes) => {
    if (Array.isArray(notes) && notes.length > 0) {
      return notes[notes.length - 1]?.text || "";
    }
    return "";
  };

  const getWhatsAppNumber = (phone) => {
    let digits = safeText(phone).replace(/\D/g, "");
    if (digits.startsWith("0")) digits = digits.replace(/^0+/, "");
    if (digits.length === 10) digits = `91${digits}`;
    return digits;
  };

  const formatReceived = (dateValue) => {
    if (!dateValue) return { relative: "—", exact: "Date unavailable" };
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return { relative: "—", exact: "Date unavailable" };
    return {
      relative: formatDistanceToNow(date, { addSuffix: true }),
      exact: date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  const total = leads.length;
  const newCount = leads.filter((lead) => (lead.status || "New") === "New").length;
  const interestedCount = leads.filter((lead) => lead.status === "Interested").length;
  const visitCount = leads.filter((lead) => lead.status === "Visit").length;
  const closedCount = leads.filter((lead) => lead.status === "Closed").length;

  const properties = useMemo(
    () => [...new Set(leads.map((lead) => safeText(lead.property)).filter(Boolean))].sort(),
    [leads]
  );
  const sources = useMemo(
    () => [...new Set(leads.map((lead) => safeText(lead.source) || "Website"))].sort(),
    [leads]
  );
  const leadTypes = useMemo(
    () => [...new Set(leads.map((lead) => safeText(lead.leadType) || "General"))].sort(),
    [leads]
  );

  const filteredLeads = useMemo(() => {
    const normalizedSearch = search.toLowerCase().trim();

    return leads
      .filter((lead) => {
        const searchMatch =
          !normalizedSearch ||
          [lead.name, lead.phone, lead.email, lead.property, lead.source, lead.leadType, lead.leadratSyncStatus]
            .some((value) => safeText(value).toLowerCase().includes(normalizedSearch));

        const propertyMatch = propertyFilter === "All" || lead.property === propertyFilter;
        const statusMatch = statusFilter === "All" || (lead.status || "New") === statusFilter;
        const typeMatch = leadTypeFilter === "All" || (lead.leadType || "General") === leadTypeFilter;
        const sourceMatch = sourceFilter === "All" || (lead.source || "Website") === sourceFilter;
        const createdDate = lead.createdAt ? new Date(lead.createdAt) : null;
        const validCreatedDate = createdDate && !Number.isNaN(createdDate.getTime());
        const startMatch = !startDate || (validCreatedDate && createdDate >= new Date(`${startDate}T00:00:00`));
        const endMatch = !endDate || (validCreatedDate && createdDate <= new Date(`${endDate}T23:59:59.999`));
        const crmStatus = getLeadratStatus(lead);
        const crmTabMatch =
          tab === "All" ||
          (tab === "Pending Review" && crmStatus === "Pending Review") ||
          (tab === "Sent" && crmStatus === "Sent") ||
          (tab === "Rejected" && crmStatus === "Rejected") ||
          (tab === "Failed" && ["Failed", "Needs Verification"].includes(crmStatus));

        return searchMatch && propertyMatch && statusMatch && typeMatch && sourceMatch && startMatch && endMatch && crmTabMatch;
      })
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  }, [leads, search, propertyFilter, statusFilter, leadTypeFilter, sourceFilter, startDate, endDate, tab]);

  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLeads = filteredLeads.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, propertyFilter, statusFilter, leadTypeFilter, sourceFilter, startDate, endDate, tab]);

  const activeAdvancedFilterCount = [
    propertyFilter !== "All",
    leadTypeFilter !== "All",
    sourceFilter !== "All",
    Boolean(startDate),
    Boolean(endDate),
  ].filter(Boolean).length;

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setPropertyFilter("All");
    setLeadTypeFilter("All");
    setSourceFilter("All");
    setStartDate("");
    setEndDate("");
    setTab("All");
  };

  const statusStyle = (status) => {
    if (status === "New") return "border-blue-200 bg-blue-50 text-blue-700";
    if (status === "Interested") return "border-emerald-200 bg-emerald-50 text-emerald-700";
    if (status === "Not Interested") return "border-rose-200 bg-rose-50 text-rose-700";
    if (status === "Visit") return "border-amber-200 bg-amber-50 text-amber-700";
    if (status === "Closed") return "border-violet-200 bg-violet-50 text-violet-700";
    return "border-slate-200 bg-slate-50 text-slate-700";
  };

  const leadTypeStyle = (type) => {
    if (type === "ROI Calculator") return "border-violet-200 bg-violet-50 text-violet-700";
    if (type === "Private Consultation") return "border-amber-200 bg-amber-50 text-amber-700";
    if (type === "Property Enquiry") return "border-emerald-200 bg-emerald-50 text-emerald-700";
    return "border-slate-200 bg-slate-50 text-slate-600";
  };

  const formatCurrency = (value) => {
    if (value === undefined || value === null || value === "") return "—";
    const number = Number(value);
    if (!Number.isFinite(number)) return "—";
    return `₹${number.toLocaleString("en-IN")}`;
  };

  const exportToExcel = () => {
    const exportData = filteredLeads.map((lead) => {
      const roi = lead.roiDetails || {};
      return {
        Name: lead.name || "",
        Phone: lead.phone || "",
        Email: lead.email || "",
        Property: lead.property || "General Enquiry",
        LeadType: lead.leadType || "General",
        Source: lead.source || "Website",
        Status: lead.status || "New",
        LeadratStatus: getLeadratStatus(lead),
        LeadratSyncedAt: lead.leadratSyncedAt ? new Date(lead.leadratSyncedAt).toLocaleString("en-IN") : "",
        LeadratError: lead.leadratLastError || "",
        PropertyType: roi.propertyType || "",
        Location: roi.location || "",
        PropertyValue: roi.propertyValue || "",
        CarpetArea: roi.carpetArea || "",
        PurchaseDate: roi.purchaseDate || "",
        HoldingPeriod: roi.holdingPeriod || "",
        DownPayment: roi.downPayment || "",
        DownPaymentPercent: roi.downPaymentPercent || "",
        LoanAmount: roi.loanAmount || "",
        LoanPercent: roi.loanPercent || "",
        InterestRate: roi.interestRate || "",
        LoanTenure: roi.loanTenure || "",
        MonthlyRent: roi.monthlyRent || "",
        RentEscalation: roi.rentEscalation || "",
        Maintenance: roi.maintenance || "",
        PropertyTax: roi.propertyTax || "",
        Insurance: roi.insurance || "",
        OtherExpenses: roi.otherExpenses || "",
        TotalInvestment: roi.totalInvestment || "",
        TotalProfit: roi.totalProfit || "",
        TotalAppreciation: roi.totalAppreciation || "",
        GrossReturns: roi.grossReturns || "",
        ROI: roi.roi || "",
        Notes: getLatestNote(lead.notes),
        CreatedAt: lead.createdAt ? new Date(lead.createdAt).toLocaleString("en-IN") : "",
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");
    XLSX.writeFile(workbook, `Leads_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#f5f7f6] text-sm font-semibold text-[#234238]">
        <div className="flex items-center gap-3 rounded-2xl border border-[#e3eae6] bg-white px-5 py-4 shadow-sm">
          <RefreshCw size={18} className="animate-spin text-[#0b5d3b]" />
          Loading leads...
        </div>
      </div>
    );
  }

  const inputClass = "h-10 w-full rounded-xl border border-[#dce5e0] bg-white px-3 text-sm text-[#263a32] outline-none transition placeholder:text-[#9aa8a1] focus:border-[#0b6b48] focus:ring-4 focus:ring-[#0b6b48]/10";

  return (
    <div className="min-h-screen bg-[#f5f7f6] px-4 py-4 text-[#172b24] md:px-6 md:py-5 xl:px-7">
      <div className="mx-auto max-w-[1800px] space-y-4">
        {/* COMPACT PAGE HEADER */}
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e7f0eb] text-[#0b5d3b]">
                <Users size={19} />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-[#123c2e] md:text-[27px]">Leads</h1>
              <span className="rounded-full border border-[#dce7e0] bg-white px-2.5 py-1 text-[11px] font-semibold text-[#597067]">
                {total} total
              </span>
            </div>
            <p className="mt-1 pl-0.5 text-xs text-[#78877f] md:text-sm">Enquiries, sales activity and agent ownership in one place.</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fetchLeads()}
              disabled={refreshing}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#dce5e0] bg-white px-3.5 text-sm font-semibold text-[#315447] shadow-sm transition hover:border-[#b9cec2] hover:bg-[#fbfdfc] disabled:cursor-wait disabled:opacity-60"
            >
              <RefreshCw size={15} className={refreshing ? "animate-spin" : ""} />
              <span>{refreshing ? "Refreshing" : "Refresh"}</span>
            </button>
            <button
              type="button"
              onClick={exportToExcel}
              disabled={filteredLeads.length === 0}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#0b5d3b] px-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#084a30] disabled:cursor-not-allowed disabled:opacity-45"
            >
              <Download size={15} />
              Export Excel
            </button>
          </div>
        </header>

        {/* FEEDBACK */}
        {notice && (
          <div
            role={notice.type === "error" ? "alert" : "status"}
            className={`flex items-start justify-between gap-3 rounded-xl border px-3.5 py-2.5 text-sm ${
              notice.type === "error"
                ? "border-rose-200 bg-rose-50 text-rose-700"
                : "border-emerald-200 bg-emerald-50 text-emerald-800"
            }`}
          >
            <div className="flex items-center gap-2">
              {notice.type === "error" ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
              <span>{notice.message}</span>
            </div>
            <button type="button" onClick={() => setNotice(null)} aria-label="Dismiss message" className="rounded-md p-0.5 hover:bg-black/5">
              <X size={15} />
            </button>
          </div>
        )}

        {fetchError && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700">
            <span>{fetchError}</span>
            <button type="button" onClick={() => fetchLeads()} className="font-semibold underline underline-offset-2">Try again</button>
          </div>
        )}

        {/* COMPACT KPI STRIP: SINGLE ROW */}
        <section className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5" aria-label="Lead overview">
          <MetricCard label="Total leads" value={total} icon={<Users size={17} />} accent="green" />
          <MetricCard label="New" value={newCount} icon={<ClipboardList size={17} />} accent="blue" />
          <MetricCard label="Interested" value={interestedCount} icon={<UserRound size={17} />} accent="emerald" />
          <MetricCard label="Site visits" value={visitCount} icon={<CalendarDays size={17} />} accent="amber" />
          <MetricCard label="Closed" value={closedCount} icon={<CheckCircle size={17} />} accent="violet" />
        </section>

        {/* LEAD LIST + QUICK FILTERS */}
        <section className="overflow-hidden rounded-2xl border border-[#e1e9e4] bg-white shadow-[0_5px_22px_rgba(19,55,39,0.045)]">
          <div className="border-b border-[#edf1ee] px-4 py-3.5 md:px-5">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex items-center gap-3">
                <div>
                  <h2 className="text-base font-bold text-[#1b342a]">Lead enquiries</h2>
                  <p className="mt-0.5 text-xs text-[#89958f]">
                    Showing <span className="font-semibold text-[#435b50]">{filteredLeads.length}</span> matching {filteredLeads.length === 1 ? "lead" : "leads"}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <div className="relative min-w-0 flex-1 sm:w-[290px] sm:flex-none">
                  <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#91a097]" />
                  <input
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search name, phone, property..."
                    aria-label="Search leads"
                    className={`${inputClass} pl-9 pr-9`}
                  />
                  {search && (
                    <button type="button" onClick={() => setSearch("")} aria-label="Clear search" className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-[#809087] hover:bg-[#f0f4f1]">
                      <X size={14} />
                    </button>
                  )}
                </div>

                <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className={`${inputClass} sm:w-[155px]`} aria-label="Filter by status">
                  <option value="All">All statuses</option>
                  {STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
                </select>

                <button
                  type="button"
                  onClick={() => setShowAdvancedFilters((value) => !value)}
                  aria-expanded={showAdvancedFilters}
                  className={`inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl border px-3.5 text-sm font-semibold transition ${
                    showAdvancedFilters || activeAdvancedFilterCount > 0
                      ? "border-[#a9c7b6] bg-[#f0f7f2] text-[#155d3e]"
                      : "border-[#dce5e0] bg-white text-[#52665c] hover:bg-[#f8faf8]"
                  }`}
                >
                  <SlidersHorizontal size={15} />
                  Filters
                  {activeAdvancedFilterCount > 0 && <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#0b5d3b] px-1 text-[10px] font-bold text-white">{activeAdvancedFilterCount}</span>}
                </button>

              </div>
            </div>

            {/* ADVANCED FILTERS: COLLAPSED BY DEFAULT */}
            {showAdvancedFilters && (
              <div className="mt-3 grid grid-cols-1 gap-2.5 rounded-xl border border-[#e8eeea] bg-[#fafcfb] p-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                <select value={propertyFilter} onChange={(event) => setPropertyFilter(event.target.value)} className={inputClass} aria-label="Filter by property">
                  <option value="All">All properties</option>
                  {properties.map((property) => <option key={property} value={property}>{property}</option>)}
                </select>

                <select value={leadTypeFilter} onChange={(event) => setLeadTypeFilter(event.target.value)} className={inputClass} aria-label="Filter by lead type">
                  <option value="All">All enquiry types</option>
                  {leadTypes.map((type) => <option key={type} value={type}>{type}</option>)}
                </select>

                <select value={sourceFilter} onChange={(event) => setSourceFilter(event.target.value)} className={inputClass} aria-label="Filter by source">
                  <option value="All">All sources</option>
                  {sources.map((source) => <option key={source} value={source}>{source}</option>)}
                </select>

                <input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} className={inputClass} aria-label="From date" />
                <input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} className={inputClass} aria-label="To date" />

                <div className="flex items-center justify-between gap-2 sm:col-span-2 lg:col-span-3 xl:col-span-5">
                  <p className="text-[11px] text-[#849188]">Narrow the list by property, enquiry type, source or received date.</p>
                  <button type="button" onClick={clearFilters} className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-[#557064] transition hover:bg-[#edf3ef]">
                    <RotateCcw size={13} /> Clear filters
                  </button>
                </div>
              </div>
            )}

            {/* LEADRAT REVIEW FILTERS */}
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              {["All", "Pending Review", "Sent", "Rejected", "Failed"].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setTab(value)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    tab === value
                      ? "bg-[#eaf3ed] text-[#0b5d3b]"
                      : "text-[#718078] hover:bg-[#f4f7f5] hover:text-[#315447]"
                  }`}
                >
                  {value}
                </button>
              ))}
              <span className="ml-auto text-[11px] text-[#9aa69f]">Newest enquiries first</span>
            </div>
          </div>

          {/* TABLE TOOLBAR */}
          <div className="flex flex-col gap-2 border-b border-[#edf1ee] bg-[#fcfdfc] px-4 py-2.5 sm:flex-row sm:items-center sm:justify-between md:px-5">
            <p className="text-xs text-[#85928a]">
              {filteredLeads.length === 0
                ? "No enquiries match the current filters"
                : `Showing ${startIndex + 1}–${Math.min(startIndex + itemsPerPage, filteredLeads.length)} of ${filteredLeads.length}`}
            </p>
            <label className="flex items-center gap-2 text-xs text-[#7b8981]">
              Rows per page
              <select
                value={itemsPerPage}
                onChange={(event) => {
                  setItemsPerPage(Number(event.target.value));
                  setCurrentPage(1);
                }}
                className="h-8 rounded-lg border border-[#dce5e0] bg-white px-2 text-xs font-semibold text-[#42594e] outline-none focus:border-[#0b6b48]"
              >
                {PAGE_SIZES.map((size) => <option key={size} value={size}>{size}</option>)}
              </select>
            </label>
          </div>

          {/* LEADS TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1240px] table-auto text-left">
              <thead className="sticky top-0 z-10 border-b border-[#e8eeea] bg-[#f7faf8]">
                <tr className="text-[11px] font-bold uppercase tracking-[0.07em] text-[#718078]">
                  <th className="w-[18%] px-4 py-3">Lead</th>
                  <th className="w-[16%] px-4 py-3">Property</th>
                  <th className="w-[11%] px-4 py-3">Enquiry type</th>
                  <th className="w-[11%] px-4 py-3">Status</th>
                  <th className="w-[12%] px-4 py-3">Received</th>
                  <th className="w-[16%] px-4 py-3">Leadrat / Approval</th>
                  <th className="w-[8%] px-4 py-3">Contact</th>
                  <th className="w-[12%] px-4 py-3">Last note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#edf1ee]">
                {paginatedLeads.length > 0 ? (
                  paginatedLeads.map((lead) => {
                    const busy = updatingLeadIds.includes(String(lead._id));
                    const received = formatReceived(lead.createdAt);
                    const latestNote = getLatestNote(lead.notes);
                    const whatsappNumber = getWhatsAppNumber(lead.phone);

                    return (
                      <tr key={lead._id} className="align-top transition hover:bg-[#fbfdfb]">
                        <td className="px-4 py-3.5">
                          <div className="max-w-[230px]">
                            <p className="truncate text-base font-bold tracking-tight text-[#173b2c]" title={lead.name || "Unnamed lead"}>{lead.name || "Unnamed lead"}</p>
                            <a href={`tel:${lead.phone || ""}`} className="mt-1.5 inline-flex items-center gap-1.5 text-sm font-semibold tracking-[0.01em] text-[#405b4d] transition hover:text-[#0b6b48]">
                              <Phone size={14} strokeWidth={2.2} /> {lead.phone || "No phone provided"}
                            </a>
                            {lead.email ? (
                              <a href={`mailto:${lead.email}`} className="mt-1 block truncate text-xs text-[#7d8d83] hover:text-[#0b6b48]" title={lead.email}>{lead.email}</a>
                            ) : (
                              <p className="mt-1 text-xs text-[#929f96]">No email provided</p>
                            )}
                          </div>
                        </td>

                        <td className="px-4 py-3.5">
                          <div className="max-w-[205px]">
                            <p className="line-clamp-2 text-sm font-medium leading-5 text-[#3c5046]" title={lead.property || "General Enquiry"}>{lead.property || "General Enquiry"}</p>
                            {lead.leadType === "ROI Calculator" && <span className="mt-1 inline-flex text-[10px] font-semibold text-violet-600">Investment analysis</span>}
                          </div>
                        </td>

                        <td className="px-4 py-3.5">
                          <span className={`inline-flex max-w-[130px] whitespace-normal rounded-lg border px-2 py-1 text-[10px] font-semibold leading-4 ${leadTypeStyle(lead.leadType)}`}>
                            {lead.leadType || "General"}
                          </span>
                          <p className="mt-1 text-[10px] text-[#96a199]">{lead.source || "Website"}</p>
                        </td>

                        <td className="px-4 py-3.5">
                          <select
                            aria-label={`Change status for ${lead.name || "lead"}`}
                            value={lead.status || "New"}
                            disabled={busy}
                            onChange={(event) => updateLead(lead._id, { status: event.target.value })}
                            className={`h-8 max-w-[130px] rounded-lg border px-2 text-xs font-semibold outline-none transition disabled:cursor-wait disabled:opacity-60 ${statusStyle(lead.status || "New")}`}
                          >
                            {STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
                          </select>
                          {busy && <p className="mt-1 text-[10px] text-[#84958b]">Saving…</p>}
                        </td>

                        <td className="px-4 py-3.5">
                          <p className="whitespace-nowrap text-xs font-semibold text-[#3d5147]">{received.relative}</p>
                          <p className="mt-1 whitespace-nowrap text-[10px] text-[#98a39c]">{received.exact}</p>
                        </td>

                        <td className="px-4 py-3.5">
                          {(() => {
                            const crmStatus = getLeadratStatus(lead);
                            const crmTone = {
                              "Pending Review": "border-amber-200 bg-amber-50 text-amber-700",
                              Sending: "border-blue-200 bg-blue-50 text-blue-700",
                              Sent: "border-emerald-200 bg-emerald-50 text-emerald-700",
                              Rejected: "border-rose-200 bg-rose-50 text-rose-700",
                              Failed: "border-rose-200 bg-rose-50 text-rose-700",
                              "Needs Verification": "border-orange-200 bg-orange-50 text-orange-700",
                            };

                            return (
                              <div className="min-w-[175px] max-w-[220px] space-y-2">
                                <span className={`inline-flex rounded-lg border px-2 py-1 text-[10px] font-bold ${crmTone[crmStatus] || crmTone["Pending Review"]}`}>
                                  {crmStatus}
                                </span>

                                {crmStatus === "Pending Review" && (
                                  <div className="flex flex-wrap items-center gap-2">
                                    <button
                                      type="button"
                                      disabled={busy}
                                      onClick={() => handleLeadratAction(lead, "push-to-leadrat")}
                                      className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-[#0b5d3b] px-2.5 text-[11px] font-semibold text-white transition hover:bg-[#084a30] disabled:cursor-wait disabled:opacity-50"
                                    >
                                      <CheckCircle2 size={13} /> Push to Leadrat
                                    </button>
                                    <button
                                      type="button"
                                      disabled={busy}
                                      onClick={() => handleLeadratAction(lead, "reject-from-leadrat")}
                                      className="text-[10px] font-semibold text-rose-600 hover:underline disabled:opacity-50"
                                    >
                                      Reject
                                    </button>
                                  </div>
                                )}

                                {crmStatus === "Failed" && (
                                  <button
                                    type="button"
                                    disabled={busy}
                                    onClick={() => handleLeadratAction(lead, "push-to-leadrat")}
                                    className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-rose-200 bg-white px-2.5 text-[11px] font-semibold text-rose-700 hover:bg-rose-50 disabled:opacity-50"
                                  >
                                    <RefreshCw size={12} /> Retry push
                                  </button>
                                )}

                                {crmStatus === "Sending" && (
                                  <p className="text-[10px] text-blue-600">Sending to Leadrat…</p>
                                )}

                                {crmStatus === "Sent" && lead.leadratSyncedAt && (
                                  <p className="text-[10px] text-[#829087]">Sent {formatReceived(lead.leadratSyncedAt).relative}</p>
                                )}

                                {(crmStatus === "Failed" || crmStatus === "Needs Verification") && lead.leadratLastError && (
                                  <p className="line-clamp-3 text-[10px] leading-4 text-rose-600" title={lead.leadratLastError}>{lead.leadratLastError}</p>
                                )}

                                {crmStatus === "Needs Verification" && (
                                  <p className="text-[10px] font-semibold text-orange-700">Check Leadrat before retrying.</p>
                                )}
                              </div>
                            );
                          })()}
                        </td>

                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1.5">
                            <a href={`tel:${lead.phone || ""}`} aria-label={`Call ${lead.name || "lead"}`} title="Call" className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#eaf4ed] text-[#137342] transition hover:bg-[#dceee2]">
                              <Phone size={14} />
                            </a>
                            {whatsappNumber && (
                              <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer" aria-label={`WhatsApp ${lead.name || "lead"}`} title="WhatsApp" className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#e8f8ed] text-[#169b50] transition hover:bg-[#d6f2df]">
                                <MessageCircle size={14} />
                              </a>
                            )}
                            {lead.email && (
                              <a href={`mailto:${lead.email}`} aria-label={`Email ${lead.name || "lead"}`} title="Email" className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#edf3fb] text-[#3c70ad] transition hover:bg-[#e0ebf8]">
                                <Mail size={14} />
                              </a>
                            )}
                            {lead.leadType === "ROI Calculator" && (
                              <button type="button" onClick={() => setRoiModal(lead)} aria-label="View ROI details" title="ROI details" className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#f1edfb] text-[#7251b4] transition hover:bg-[#e8e0f8]">
                                <BarChart3 size={14} />
                              </button>
                            )}
                          </div>
                        </td>

                        <td className="px-4 py-3.5">
                          {editingNoteId === lead._id ? (
                            <div className="min-w-[170px] space-y-1.5">
                              <textarea
                                value={noteValue}
                                onChange={(event) => setNoteValue(event.target.value)}
                                rows={2}
                                autoFocus
                                className="w-full resize-y rounded-lg border border-[#d5e1da] px-2.5 py-2 text-xs text-[#263a32] outline-none focus:border-[#0b6b48] focus:ring-2 focus:ring-[#0b6b48]/10"
                                placeholder="Add call outcome or next discussion point…"
                              />
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  disabled={busy}
                                  onClick={async () => {
                                    const saved = await updateLead(lead._id, { notes: noteValue || "" });
                                    if (saved) {
                                      setEditingNoteId(null);
                                      setNoteValue("");
                                    }
                                  }}
                                  className="rounded-md bg-[#0b5d3b] px-2.5 py-1.5 text-[10px] font-semibold text-white disabled:opacity-50"
                                >{busy ? "Saving…" : "Save"}</button>
                                <button type="button" onClick={() => { setEditingNoteId(null); setNoteValue(""); }} className="rounded-md border border-[#dce5e0] px-2.5 py-1.5 text-[10px] font-semibold text-[#66786e]">Cancel</button>
                              </div>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setEditingNoteId(lead._id);
                                setNoteValue(latestNote);
                              }}
                              title={latestNote || "Add a note"}
                              className="block min-w-[160px] max-w-[220px] text-left"
                            >
                              {latestNote ? (
                                <span className="line-clamp-2 text-xs leading-5 text-[#65766d]">{latestNote}</span>
                              ) : (
                                <span className="inline-flex items-center gap-1 rounded-lg border border-dashed border-[#cfddd4] px-2.5 py-1.5 text-[11px] font-semibold text-[#718278] hover:border-[#8fb19c] hover:text-[#0b6b48]">+ Add note</span>
                              )}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={8} className="px-5 py-14 text-center">
                      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f0f5f1] text-[#82968a]">
                        <Search size={19} />
                      </div>
                      <p className="mt-3 text-sm font-semibold text-[#3e5549]">No leads found</p>
                      <p className="mt-1 text-xs text-[#8b9890]">Try changing your search or filters.</p>
                      <button type="button" onClick={clearFilters} className="mt-3 text-xs font-semibold text-[#0b6b48] hover:underline">Clear all filters</button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="flex flex-col gap-3 border-t border-[#edf1ee] px-4 py-3 sm:flex-row sm:items-center sm:justify-between md:px-5">
            <p className="text-xs text-[#87938c]">
              {filteredLeads.length === 0
                ? "Showing 0 leads"
                : `Showing ${startIndex + 1}–${Math.min(startIndex + itemsPerPage, filteredLeads.length)} of ${filteredLeads.length} leads`}
            </p>
            {totalPages > 1 && (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                  className="inline-flex h-8 items-center gap-1 rounded-lg border border-[#dce5e0] px-2.5 text-xs font-semibold text-[#52675c] hover:bg-[#f7faf8] disabled:cursor-not-allowed disabled:opacity-40"
                ><ChevronLeft size={14} /> Previous</button>
                <span className="px-2 text-xs font-semibold text-[#50665a]">Page {currentPage} of {totalPages}</span>
                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                  className="inline-flex h-8 items-center gap-1 rounded-lg border border-[#dce5e0] px-2.5 text-xs font-semibold text-[#52675c] hover:bg-[#f7faf8] disabled:cursor-not-allowed disabled:opacity-40"
                >Next <ChevronRight size={14} /></button>
              </div>
            )}
          </div>
        </section>
      </div>


      {/* ROI DETAILS MODAL */}
      {roiModal && <ROIModal lead={roiModal} onClose={() => setRoiModal(null)} formatCurrency={formatCurrency} />}
    </div>
  );
}

function MetricCard({ label, value, icon, accent = "green" }) {
  const accents = {
    green: "bg-[#edf5ef] text-[#0b6942]",
    blue: "bg-[#edf4fc] text-[#4276b4]",
    emerald: "bg-[#eaf6f0] text-[#168052]",
    amber: "bg-[#fbf4e7] text-[#a97822]",
    violet: "bg-[#f2effa] text-[#7657b4]",
  };

  return (
    <div className="flex min-h-[70px] items-center justify-between rounded-xl border border-[#e3ebe6] bg-white px-3.5 py-2.5 shadow-[0_2px_8px_rgba(24,55,39,0.035)] sm:px-4">
      <div className="min-w-0">
        <p className="truncate text-[11px] font-medium text-[#849188]">{label}</p>
        <p className="mt-0.5 text-xl font-bold leading-6 tracking-tight text-[#1c382c]">{value}</p>
      </div>
      <div className={`ml-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${accents[accent] || accents.green}`}>{icon}</div>
    </div>
  );
}

function ROIModal({ lead, onClose, formatCurrency }) {
  const roi = lead?.roiDetails || {};

  const Row = ({ label, value }) => (
    <div className="flex items-center justify-between gap-5 border-b border-gray-100 py-3 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-right text-sm font-semibold text-gray-900">{value || "—"}</span>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="text-violet-600" size={21} />
              <h2 className="text-lg font-bold text-gray-900">ROI investment details</h2>
            </div>
            <p className="mt-1 text-xs text-gray-500">{lead.name} · {lead.email || lead.phone}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close ROI details" className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"><X size={18} /></button>
        </div>

        <div className="max-h-[calc(90vh-76px)] space-y-6 overflow-y-auto p-5">
          <section>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-900">Property details</h3>
            <div className="rounded-xl border border-gray-200 px-4">
              <Row label="Property type" value={roi.propertyType} />
              <Row label="Location" value={roi.location} />
              <Row label="Property value" value={formatCurrency(roi.propertyValue)} />
              <Row label="Carpet area" value={roi.carpetArea ? `${roi.carpetArea} sq.ft.` : "—"} />
              <Row label="Purchase date" value={roi.purchaseDate} />
              <Row label="Holding period" value={roi.holdingPeriod ? `${roi.holdingPeriod} Years` : "—"} />
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-900">Financing</h3>
            <div className="rounded-xl border border-gray-200 px-4">
              <Row label="Down payment" value={roi.downPayment ? `${formatCurrency(roi.downPayment)}${roi.downPaymentPercent ? ` (${roi.downPaymentPercent}%)` : ""}` : "—"} />
              <Row label="Loan amount" value={roi.loanAmount ? `${formatCurrency(roi.loanAmount)}${roi.loanPercent ? ` (${roi.loanPercent}%)` : ""}` : "—"} />
              <Row label="Interest rate" value={roi.interestRate ? `${roi.interestRate}%` : "—"} />
              <Row label="Loan tenure" value={roi.loanTenure ? `${roi.loanTenure} Years` : "—"} />
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-900">Rental and expenses</h3>
            <div className="rounded-xl border border-gray-200 px-4">
              <Row label="Monthly rent" value={formatCurrency(roi.monthlyRent)} />
              <Row label="Rent escalation" value={roi.rentEscalation ? `${roi.rentEscalation}%` : "—"} />
              <Row label="Maintenance" value={formatCurrency(roi.maintenance)} />
              <Row label="Property tax" value={formatCurrency(roi.propertyTax)} />
              <Row label="Insurance" value={formatCurrency(roi.insurance)} />
              <Row label="Other expenses" value={formatCurrency(roi.otherExpenses)} />
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-900">Calculated returns</h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <ResultCard label="Total investment" value={formatCurrency(roi.totalInvestment)} />
              <ResultCard label="Total appreciation" value={formatCurrency(roi.totalAppreciation)} />
              <ResultCard label="Gross returns" value={formatCurrency(roi.grossReturns)} />
              <ResultCard label="Total profit" value={formatCurrency(roi.totalProfit)} highlight />
              <ResultCard label="ROI" value={roi.roi !== undefined ? `${roi.roi}%` : "—"} highlight />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function ResultCard({ label, value, highlight = false }) {
  return (
    <div className={`rounded-xl border p-3.5 ${highlight ? "border-[#e5d3a5] bg-[#f8f4ea]" : "border-gray-200 bg-gray-50"}`}>
      <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">{label}</p>
      <p className={`mt-1 text-lg font-bold ${highlight ? "text-[#8d6a24]" : "text-gray-900"}`}>{value}</p>
    </div>
  );
}
