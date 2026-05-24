"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  User,
  Shield,
  Plus,
  Users,
  UserCheck,
  UserX,
} from "lucide-react";

export default function TeamManagement() {

  const router = useRouter();

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

  // ================= TOAST =================

  const showToast = (msg, type = "success") => {

    setToast({ msg, type });

    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  // ================= AUTH =================

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

  // ================= ROLE PROTECTION =================

  useEffect(() => {

    const checkAccess = async () => {

      try {

        const token = localStorage.getItem("token");

        if (!token) {
          router.push("/login");
          return;
        }

        const res = await fetch(
          "https://property-bouquet-backend.onrender.com/api/auth/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (!res.ok) {
          router.push("/login");
          return;
        }

        // 🔥 BLOCK NON SUPERADMIN

        if (data.user.role !== "SuperAdmin") {
          router.push("/admin");
          return;
        }

        fetchUsers();

      } catch (err) {

        console.error(err);
        router.push("/login");

      }
    };

    checkAccess();

  }, []);

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

      console.log(err);

      showToast("Server error ❌", "error");

    } finally {

      setLoading(false);

    }
  };

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

    } catch (err) {

      console.log(err);

      showToast("Server error ❌", "error");

    }
  };

  // ================= TOGGLE USER =================

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
            u._id === id
              ? {
                  ...u,
                  isActive: !u.isActive,
                }
              : u
          )
        );

      } else {

        showToast(data.message || "Failed ❌", "error");

      }

    } catch (err) {

      console.log(err);

      showToast("Server error ❌", "error");

    } finally {

      setActionId(null);

    }
  };

  // ================= FILTER USERS =================

  const filteredUsers = users.filter((u) => {

    const searchMatch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());

    const roleMatch =
      roleFilter === "All" ||
      u.role === roleFilter;

    const statusMatch =
      statusFilter === "All" ||
      (statusFilter === "Active" && u.isActive) ||
      (statusFilter === "Revoked" && !u.isActive);

    return (
      searchMatch &&
      roleMatch &&
      statusMatch
    );
  });

  // ================= STATS =================

  const total = users.length;

  const active = users.filter((u) => u.isActive).length;

  const revoked = users.filter((u) => !u.isActive).length;

  const admins = users.filter(
    (u) => u.role === "SuperAdmin"
  ).length;

  return (

    <div className="min-h-screen bg-[#f4f7fb] p-6 text-gray-800">

      {/* ================= TOAST ================= */}

      {toast && (

        <div
          className={`fixed top-5 right-5 px-5 py-3 rounded-2xl shadow-2xl text-white z-50 font-medium ${
            toast.type === "error"
              ? "bg-red-500"
              : "bg-green-600"
          }`}
        >
          {toast.msg}
        </div>

      )}

      {/* ================= HEADER ================= */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">

        <div>

          <h1 className="text-4xl font-bold text-[#0f3b2e]">
            Team Management
          </h1>

          <p className="text-gray-500 mt-2">
            Manage admin & agent accounts
          </p>

        </div>

        <button
          onClick={() => setShowModal(true)}
          className="h-12 px-6 rounded-2xl bg-gradient-to-r from-[#c9a64b] to-[#e0be69] text-black font-semibold shadow-lg flex items-center gap-2 hover:scale-[1.02] transition"
        >
          <Plus size={18} />

          Add User
        </button>

      </div>

      {/* ================= STATS ================= */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

        <Stat
          title="Total Users"
          value={total}
          icon={<Users className="text-[#0f3b2e]" />}
        />

        <Stat
          title="Active Users"
          value={active}
          icon={<UserCheck className="text-green-600" />}
        />

        <Stat
          title="Revoked Users"
          value={revoked}
          icon={<UserX className="text-red-500" />}
        />

        <Stat
          title="Admins"
          value={admins}
          icon={<Shield className="text-purple-600" />}
        />

      </div>

      {/* ================= FILTERS ================= */}

      <div className="bg-white rounded-3xl shadow-md p-5 mb-8">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* SEARCH */}

          <input
            placeholder="Search users..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="border border-gray-300 text-gray-800 px-5 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-[#0f3b2e]"
          />

          {/* ROLE FILTER */}

          <select
            value={roleFilter}
            onChange={(e) =>
              setRoleFilter(e.target.value)
            }
            className="border border-gray-300 text-gray-800 px-5 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-[#0f3b2e] bg-white"
          >
            <option value="All">
              All Roles
            </option>

            <option value="SuperAdmin">
              Super Admin
            </option>

            <option value="Agent">
              Agent
            </option>

          </select>

          {/* STATUS FILTER */}

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
            className="border border-gray-300 text-gray-800 px-5 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-[#0f3b2e] bg-white"
          >
            <option value="All">
              All Status
            </option>

            <option value="Active">
              Active
            </option>

            <option value="Revoked">
              Revoked
            </option>

          </select>

        </div>

      </div>

      {/* ================= TABLE ================= */}

      <div className="bg-white rounded-3xl shadow-md overflow-hidden border border-gray-100">

        {loading ? (

          <div className="py-20 text-center text-gray-500 text-lg">
            Loading users...
          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full min-w-[900px]">

              <thead className="bg-[#f8fafc] border-b border-gray-200">

                <tr className="text-left text-gray-700">

                  <th className="px-6 py-5 text-sm font-bold">
                    Name
                  </th>

                  <th className="px-6 py-5 text-sm font-bold">
                    Email
                  </th>

                  <th className="px-6 py-5 text-sm font-bold">
                    Role
                  </th>

                  <th className="px-6 py-5 text-sm font-bold">
                    Status
                  </th>

                  <th className="px-6 py-5 text-right text-sm font-bold">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredUsers.length > 0 ? (

                  filteredUsers.map((u) => (

                    <tr
                      key={u._id}
                      className="border-b border-gray-100 hover:bg-[#fafdfb] transition"
                    >

                      {/* NAME */}

                      <td className="px-6 py-5">

                        <div className="font-semibold text-gray-900">
                          {u.name}
                        </div>

                      </td>

                      {/* EMAIL */}

                      <td className="px-6 py-5 text-gray-700 font-medium">

                        {u.email}

                      </td>

                      {/* ROLE */}

                      <td className="px-6 py-5">

                        {u.role === "SuperAdmin" ? (

                          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-700 border border-purple-200 text-xs font-bold">

                            <Shield size={14} />

                            SuperAdmin

                          </span>

                        ) : (

                          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold">

                            <User size={14} />

                            Agent

                          </span>

                        )}

                      </td>

                      {/* STATUS */}

                      <td className="px-6 py-5">

                        <span
                          className={`px-4 py-2 rounded-full text-xs font-bold border ${
                            u.isActive
                              ? "bg-green-100 text-green-700 border-green-200"
                              : "bg-red-100 text-red-600 border-red-200"
                          }`}
                        >
                          {u.isActive
                            ? "Active"
                            : "Revoked"}
                        </span>

                      </td>

                      {/* ACTION */}

                      <td className="px-6 py-5">

                        <div className="flex justify-end">

                          <button
                            disabled={
                              actionId === u._id
                            }
                            onClick={() =>
                              toggleStatus(u._id)
                            }
                            className={`px-5 py-2 rounded-xl text-sm font-semibold text-white transition ${
                              u.isActive
                                ? "bg-red-500 hover:bg-red-600"
                                : "bg-green-600 hover:bg-green-700"
                            }`}
                          >
                            {actionId === u._id
                              ? "Please wait..."
                              : u.isActive
                              ? "Revoke"
                              : "Restore"}
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))

                ) : (

                  <tr>

                    <td
                      colSpan="5"
                      className="py-20 text-center text-gray-500 text-lg"
                    >
                      No users found
                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

      {/* ================= MODAL ================= */}

      {showModal && (

        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-5">

          <div className="w-full max-w-lg bg-white rounded-3xl p-7 shadow-2xl">

            {/* HEADER */}

            <div className="flex items-center gap-4 mb-8">

              <div className="h-14 w-14 rounded-2xl bg-[#0f3b2e] text-white flex items-center justify-center shadow-md">

                <Plus size={24} />

              </div>

              <div>

                <h2 className="text-3xl font-bold text-[#0f3b2e]">
                  Add User
                </h2>

                <p className="text-gray-500 text-sm mt-1">
                  Create a new admin or agent account
                </p>

              </div>

            </div>

            {/* FORM */}

            <div className="space-y-5">

              {/* NAME */}

              <div>

                <label className="text-sm font-semibold text-gray-700">
                  Full Name
                </label>

                <input
                  placeholder="John Doe"
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                  className="mt-2 w-full border border-gray-300 text-gray-800 rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-[#0f3b2e]"
                />

              </div>

              {/* EMAIL */}

              <div>

                <label className="text-sm font-semibold text-gray-700">
                  Email Address
                </label>

                <input
                  placeholder="john@example.com"
                  value={form.email}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      email: e.target.value,
                    })
                  }
                  className="mt-2 w-full border border-gray-300 text-gray-800 rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-[#0f3b2e]"
                />

              </div>

              {/* PASSWORD */}

              <div>

                <label className="text-sm font-semibold text-gray-700">
                  Password
                </label>

                <input
                  type="password"
                  placeholder="Enter password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      password: e.target.value,
                    })
                  }
                  className="mt-2 w-full border border-gray-300 text-gray-800 rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-[#0f3b2e]"
                />

              </div>

              {/* ROLE */}

              <div>

                <label className="text-sm font-semibold text-gray-700">
                  Role
                </label>

                <select
                  value={form.role}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      role: e.target.value,
                    })
                  }
                  className="mt-2 w-full border border-gray-300 text-gray-800 rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-[#0f3b2e] bg-white"
                >

                  <option value="Agent">
                    Agent
                  </option>

                  <option value="SuperAdmin">
                    Super Admin
                  </option>

                </select>

              </div>

              {/* BUTTONS */}

              <div className="flex justify-end gap-4 pt-4">

                <button
                  onClick={() =>
                    setShowModal(false)
                  }
                  className="h-12 px-6 rounded-2xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition"
                >
                  Cancel
                </button>

                <button
                  onClick={handleCreate}
                  className="h-12 px-6 rounded-2xl bg-[#0f3b2e] hover:bg-[#145240] text-white font-semibold transition shadow-md"
                >
                  Create User
                </button>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

// ================= STAT CARD =================

function Stat({ title, value, icon }) {

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