"use client";

import { useEffect, useState } from "react";
import { User, Shield } from "lucide-react";

export default function TeamManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [showModal, setShowModal] = useState(false);

  const [toast, setToast] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "Agent",
  });

  const API = "https://property-bouquet-backend.onrender.com/api/auth";

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      showToast("Please login again ❌", "error");
      return null;
    }

    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  // ================= FETCH USERS =================
  const fetchUsers = async () => {
    try {
      setLoading(true);

      const headers = getAuthHeaders();
      if (!headers) return;

      const res = await fetch(`${API}/users`, {
        method: "GET",
        headers,
      });

      const data = await res.json();

      if (res.ok) {
        setUsers(data.data || []);
      } else {
        showToast(data.message || "Failed ❌", "error");
      }
    } catch (err) {
      showToast("Server error ❌", "error");
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
      return showToast("All fields required ❌", "error");
    }

    try {
      const headers = getAuthHeaders();
      if (!headers) return;

      const res = await fetch(`${API}/users`, {
        method: "POST",
        headers,
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        showToast("User created ✅");
        setShowModal(false);
        setForm({
          name: "",
          email: "",
          password: "",
          role: "Agent",
        });
        fetchUsers();
      } else {
        showToast(data.message || "Failed ❌", "error");
      }
    } catch {
      showToast("Server error ❌", "error");
    }
  };

  // ================= TOGGLE =================
  const toggleStatus = async (id) => {
    try {
      setActionId(id);

      const headers = getAuthHeaders();
      if (!headers) return;

      const res = await fetch(`${API}/users/${id}/toggle`, {
        method: "PATCH",
        headers,
      });

      const data = await res.json();

      if (res.ok) {
        showToast(data.message || "Updated ✅");

        setUsers((prev) =>
          prev.map((u) =>
            u._id === id ? { ...u, isActive: !u.isActive } : u
          )
        );
      } else {
        showToast(data.message || "Failed ❌", "error");
      }
    } catch {
      showToast("Server error ❌", "error");
    } finally {
      setActionId(null);
    }
  };

  // ================= FILTER =================
  const filteredUsers = users.filter((u) => {
    const searchMatch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());

    const roleMatch = roleFilter === "All" || u.role === roleFilter;

    const statusMatch =
      statusFilter === "All" ||
      (statusFilter === "Active" && u.isActive) ||
      (statusFilter === "Revoked" && !u.isActive);

    return searchMatch && roleMatch && statusMatch;
  });

  // ================= STATS =================
  const total = users.length;
  const active = users.filter((u) => u.isActive).length;
  const revoked = users.filter((u) => !u.isActive).length;
  const admins = users.filter((u) => u.role === "SuperAdmin").length;

  return (
    <div className="p-6 space-y-6">

      {/* TOAST */}
      {toast && (
        <div
          className={`fixed top-5 right-5 px-4 py-2 rounded-lg shadow-lg text-white z-50 ${
            toast.type === "error" ? "bg-red-500" : "bg-green-600"
          }`}
        >
          {toast.msg}
        </div>
      )}

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Team Management</h1>

        <button
          onClick={() => setShowModal(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg"
        >
          + Add User
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat title="Total" value={total} />
        <Stat title="Active" value={active} />
        <Stat title="Revoked" value={revoked} />
        <Stat title="Admins" value={admins} />
      </div>

      {/* FILTERS */}
      <div className="bg-white p-4 rounded-xl shadow flex flex-wrap gap-4">
        <input
          placeholder="Search users..."
          className="input flex-1"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="input"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="All">All Roles</option>
          <option value="SuperAdmin">Super Admin</option>
          <option value="Agent">Agent</option>
        </select>

        <select
          className="input"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Revoked">Revoked</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-hidden">

        {loading ? (
          <div className="p-6 text-center">Loading...</div>
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
              {filteredUsers.map((u) => (
                <tr key={u._id} className="border-t hover:bg-gray-50">

                  <td className="p-3 font-medium">{u.name}</td>
                  <td>{u.email}</td>

                  {/* ROLE BADGE */}
                  <td>
                    {u.role === "SuperAdmin" ? (
                      <span className="flex items-center gap-1 text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded">
                        <Shield size={12} /> SuperAdmin
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                        <User size={12} /> Agent
                      </span>
                    )}
                  </td>

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

                  <td className="text-right pr-4">
                    <button
                      disabled={actionId === u._id}
                      onClick={() => toggleStatus(u._id)}
                      className={`px-3 py-1 rounded text-white ${
                        u.isActive ? "bg-red-500" : "bg-green-600"
                      }`}
                    >
                      {actionId === u._id
                        ? "..."
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

      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white p-6 rounded-xl w-full max-w-md space-y-4">

            <h2 className="text-lg font-semibold">Add User</h2>

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
              type="password"
              placeholder="Password"
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

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleCreate}
                className="bg-primary text-white px-4 py-2 rounded"
              >
                Create
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

// STAT CARD
function Stat({ title, value }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow text-center">
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className="text-xl font-bold text-primary">{value}</h2>
    </div>
  );
}