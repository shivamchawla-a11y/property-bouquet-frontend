"use client";

import { useEffect, useState } from "react";

export default function TeamManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "Agent",
  });

  const API = "https://property-bouquet-backend.onrender.com/api";

  // ================= FETCH USERS =================
  const fetchUsers = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API}/users`, {
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        setUsers(data.data || []);
      } else {
        alert(data.message || "Failed to load users");
      }
    } catch (err) {
      console.error(err);
      alert("Server error ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ================= CREATE USER =================
  const handleCreate = async () => {
    if (!form.name || !form.email || !form.password) {
      return alert("All fields required ❌");
    }

    try {
      const res = await fetch(`${API}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        alert("User created ✅");

        setForm({
          name: "",
          email: "",
          password: "",
          role: "Agent",
        });

        fetchUsers();
      } else {
        alert(data.message || "Failed ❌");
      }
    } catch (err) {
      console.error(err);
      alert("Server error ❌");
    }
  };

  // ================= TOGGLE ACCESS =================
  const toggleStatus = async (id) => {
    try {
      setActionId(id);

      const res = await fetch(`${API}/users/${id}/toggle`, {
        method: "PATCH",
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        // ✅ Optimistic UI update
        setUsers((prev) =>
          prev.map((u) =>
            u._id === id ? { ...u, isActive: !u.isActive } : u
          )
        );
      } else {
        alert(data.message || "Action failed ❌");
      }
    } catch (err) {
      console.error(err);
      alert("Server error ❌");
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="p-6 space-y-8">

      {/* HEADER */}
      <h1 className="text-2xl font-bold">Team Management</h1>

      {/* ================= CREATE USER ================= */}
      <div className="bg-white p-6 rounded-xl shadow space-y-4">
        <h2 className="font-semibold">Add Team Member</h2>

        <input
          placeholder="Name"
          className="input"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          placeholder="Email"
          className="input"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          placeholder="Password"
          type="password"
          className="input"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <select
          className="input"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="Agent">Agent</option>
          <option value="SuperAdmin">Super Admin</option>
        </select>

        <button
          onClick={handleCreate}
          className="bg-primary text-white px-5 py-2 rounded hover:opacity-90"
        >
          Create User
        </button>
      </div>

      {/* ================= USERS TABLE ================= */}
      <div className="bg-white rounded-xl shadow overflow-hidden">

        {loading ? (
          <div className="p-6 text-center text-gray-500">
            Loading users...
          </div>
        ) : users.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No users found
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th className="text-right pr-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-t">

                  <td className="p-3">{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>

                  {/* STATUS */}
                  <td>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        u.isActive
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-500"
                      }`}
                    >
                      {u.isActive ? "Active" : "Revoked"}
                    </span>
                  </td>

                  {/* ACTION */}
                  <td className="text-right pr-4">
                    <button
                      disabled={actionId === u._id}
                      onClick={() => toggleStatus(u._id)}
                      className={`text-sm px-3 py-1 rounded ${
                        u.isActive
                          ? "bg-red-500 text-white"
                          : "bg-green-600 text-white"
                      }`}
                    >
                      {actionId === u._id
                        ? "Processing..."
                        : u.isActive
                        ? "Revoke"
                        : "Restore"}
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