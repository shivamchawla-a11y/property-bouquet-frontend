"use client";

import { useState } from "react";
import { Users, Download } from "lucide-react";

export default function LeadsPage() {
  const [leads] = useState([
    {
      name: "Rahul Sharma",
      phone: "9999999999",
      property: "DLF Phase 2",
      date: "2025-05-01",
    },
  ]);

  const exportCSV = () => {
    const csv = [
      ["Name", "Phone", "Property", "Date"],
      ...leads.map((l) => [l.name, l.phone, l.property, l.date]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "leads.csv";
    a.click();
  };

  return (
    <div className="space-y-6">

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Users /> Lead CRM
        </h1>

        <button
          onClick={exportCSV}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg"
        >
          <Download size={16} /> Export CSV
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th>Phone</th>
              <th>Property</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {leads.map((l, i) => (
              <tr key={i} className="border-t">
                <td className="p-3">{l.name}</td>
                <td>{l.phone}</td>
                <td>{l.property}</td>
                <td>{l.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}