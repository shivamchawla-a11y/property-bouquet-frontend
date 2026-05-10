"use client";

import { useState, useEffect } from "react";
import { Building2, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function DevelopersPage() {
  const API = "https://property-bouquet-backend.onrender.com/api";

  const [developers, setDevelopers] = useState([]);
  const [name, setName] = useState("");
  const [logo, setLogo] = useState("");
  const [loading, setLoading] = useState(true);

  // ================= FETCH =================
  const fetchDevelopers = async () => {
    try {
      const res = await fetch(`${API}/developers`);
      const data = await res.json();

      if (res.ok) setDevelopers(data.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load developers ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevelopers();
  }, []);

  // ================= ADD =================
  const addDeveloper = async () => {
    if (!name.trim()) return;

    try {
      const res = await fetch(`${API}/developers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, logo }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed ❌");
        return;
      }

      toast.success("Developer added ✅");

      setName("");
      setLogo("");
      fetchDevelopers();
    } catch (err) {
      console.error(err);
      toast.error("Server error ❌");
    }
  };

  // ================= DELETE =================
  const deleteDeveloper = async (id) => {
    if (!confirm("Delete developer?")) return;

    try {
      const res = await fetch(`${API}/developers/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        toast.error("Delete failed ❌");
        return;
      }

      toast.success("Deleted 🗑️");
      fetchDevelopers();
    } catch (err) {
      console.error(err);
      toast.error("Server error ❌");
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center text-gray-500">
        Loading developers...
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <h1 className="text-2xl font-bold flex items-center gap-2 text-primary">
        <Building2 /> Developers
      </h1>

      {/* ADD FORM */}
      <div className="bg-white p-6 rounded-2xl shadow space-y-4">

        <h2 className="font-semibold text-lg">Add Developer</h2>

        <div className="grid md:grid-cols-3 gap-4">

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Developer Name"
            className="input"
          />

          <input
            value={logo}
            onChange={(e) => setLogo(e.target.value)}
            placeholder="Logo URL (optional)"
            className="input"
          />

          <button
            onClick={addDeveloper}
            className="bg-primary text-white rounded-xl hover:scale-105 transition"
          >
            Add Developer
          </button>

        </div>

        {/* PREVIEW */}
        {logo && (
          <div className="flex items-center gap-3 mt-2">
            <img src={logo} className="h-10" alt="logo preview" />
            <span className="text-sm text-gray-500">Logo Preview</span>
          </div>
        )}

      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">

        <table className="w-full text-sm">

          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="p-4 text-left">Logo</th>
              <th>Name</th>
              <th>Date</th>
              <th className="text-right pr-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {developers.map((dev) => (
              <tr key={dev._id} className="border-t hover:bg-gray-50">

                <td className="p-4">
                  <img
                    src={dev.logo}
                    className="h-10 w-10 object-contain"
                    alt={dev.name}
                  />
                </td>

                <td className="font-medium">{dev.name}</td>

                <td className="text-gray-500 text-xs">
                  {new Date(dev.createdAt).toLocaleDateString()}
                </td>

                <td className="text-right pr-4">

                  <div className="flex justify-end items-center gap-4">

                    {/* PREVIEW */}
                    <Link
                       href={`/developers/${dev.slug}`}
                      target="_blank"
                      className="text-blue-600 hover:scale-110 transition"
                    >
                      <Eye size={18} />
                    </Link>

                    {/* DELETE */}
                    <button
                      onClick={() => deleteDeveloper(dev._id)}
                      className="text-red-500 hover:scale-110 transition"
                    >
                      <Trash2 size={16} />
                    </button>

                  </div>

                </td>

              </tr>
            ))}
          </tbody>

        </table>

      </div>

    </div>
  );
}