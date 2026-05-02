"use client";

import { useState, useEffect } from "react";
import { Tag, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

export default function CategoriesPage() {
  const API = "https://property-bouquet-backend.onrender.com/api";

  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  // ================= FETCH =================
  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API}/categories`);
      const data = await res.json();

      if (res.ok) setCategories(data.data || []);
    } catch {
      toast.error("Failed to load categories ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ================= ADD =================
  const addCategory = async () => {
    if (!name.trim()) return;

    try {
      const res = await fetch(`${API}/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message);
        return;
      }

      toast.success("Category added ✅");

      setName("");
      fetchCategories();
    } catch {
      toast.error("Server error ❌");
    }
  };

  // ================= DELETE =================
  const deleteCategory = async (id) => {
    if (!confirm("Delete category?")) return;

    try {
      const res = await fetch(`${API}/categories/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        toast.error("Delete failed ❌");
        return;
      }

      toast.success("Deleted 🗑️");
      fetchCategories();
    } catch {
      toast.error("Server error ❌");
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center text-gray-500">
        Loading categories...
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <h1 className="text-2xl font-bold flex items-center gap-2 text-primary">
        <Tag /> Categories
      </h1>

      {/* ADD FORM */}
      <div className="bg-white p-6 rounded-2xl shadow space-y-4">

        <h2 className="font-semibold text-lg">Add Category</h2>

        <div className="grid md:grid-cols-2 gap-4">

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Category Name (e.g. Residential)"
            className="input"
          />

          <button
            onClick={addCategory}
            className="bg-primary text-white rounded-xl hover:scale-105 transition"
          >
            Add Category
          </button>

        </div>

      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">

        <table className="w-full text-sm">

          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th>Slug</th>
              <th>Date</th>
              <th className="text-right pr-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {categories.map((cat) => (
              <tr key={cat._id} className="border-t hover:bg-gray-50">

                <td className="p-4 font-medium">{cat.name}</td>

                <td className="text-gray-500 text-xs">
                  {cat.slug}
                </td>

                <td className="text-gray-500 text-xs">
                  {new Date(cat.createdAt).toLocaleDateString()}
                </td>

                <td className="text-right pr-4">
                  <button
                    onClick={() => deleteCategory(cat._id)}
                    className="text-red-500 hover:scale-110 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>

              </tr>
            ))}
          </tbody>

        </table>

      </div>

    </div>
  );
}