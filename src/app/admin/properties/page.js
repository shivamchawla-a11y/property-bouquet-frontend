"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

export default function PropertiesPage() {
  const [search, setSearch] = useState("");

  const properties = [
    {
      id: 1,
      title: "Luxury Villa in Delhi",
      price: "₹2.5 Cr",
      location: "Delhi",
      status: "Active",
    },
    {
      id: 2,
      title: "Modern Apartment",
      price: "₹80 Lakh",
      location: "Gurgaon",
      status: "Sold",
    },
  ];

  const filtered = properties.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary">
          Properties
        </h1>

        <button className="bg-gold hover:bg-goldLight text-black px-5 py-2 rounded-lg font-semibold shadow-soft">
          + Add Property
        </button>
      </div>

      {/* SEARCH + FILTER */}
      <div className="flex gap-4 mb-5">
        <input
          placeholder="Search properties..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-4 py-2 rounded-lg w-1/3 focus:ring-2 focus:ring-primary outline-none"
        />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-card overflow-hidden">

        <table className="w-full">
          <thead className="bg-gray-50 text-gray-600 text-sm">
            <tr>
              <th className="p-4 text-left">Property</th>
              <th className="p-4 text-left">Price</th>
              <th className="p-4 text-left">Location</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((property) => (
              <tr
                key={property.id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="p-4 font-medium">{property.title}</td>

                <td className="p-4 text-primary font-semibold">
                  {property.price}
                </td>

                <td className="p-4">{property.location}</td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      property.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {property.status}
                  </span>
                </td>

                <td className="p-4 text-right flex justify-end gap-2">
                  <button className="p-2 bg-primary text-white rounded-lg hover:bg-secondary">
                    <Pencil size={16} />
                  </button>

                  <button className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            No properties found
          </div>
        )}
      </div>
    </div>
  );
}