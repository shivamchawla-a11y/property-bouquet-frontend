"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
  try {
    setLoading(true);

    const res = await fetch(
      "https://property-bouquet-backend.onrender.com/api/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }), // ❌ remove credentials
      }
    );

    const data = await res.json();

    if (res.ok) {
      // ✅ STORE TOKEN (MOST IMPORTANT LINE)
      localStorage.setItem("token", data.token);

      // ✅ redirect
      window.location.href = "/admin/site-settings/team";
    } else {
      alert(data.message || "Login failed");
    }

  } catch (err) {
    console.error(err);
    alert("Server error");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-secondary to-dark">

      {/* GLASS CARD */}
      <div className="w-full max-w-md p-8 rounded-3xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl">

        {/* LOGO */}
        <div className="flex flex-col items-center mb-6">
          <img
            src="/logo.png"
            alt="Logo"
            className="w-16 h-16 object-contain mb-3"
          />

          <h1 className="text-2xl font-bold text-white">
            Property Bouquet
          </h1>

          <p className="text-gray-300 text-sm mt-1">
            Admin Login Panel
          </p>
        </div>

        {/* FORM */}
        <div className="space-y-5">

          {/* EMAIL */}
          <div>
            <label className="text-sm text-gray-300 block mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-sm text-gray-300 block mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>

          {/* BUTTON */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-gold text-black py-3 rounded-xl font-semibold hover:bg-goldLight transition duration-300"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </div>

        {/* FOOTER */}
        <p className="text-center text-gray-400 text-xs mt-6">
          © 2026 Property Bouquet
        </p>
      </div>
    </div>
  );
}