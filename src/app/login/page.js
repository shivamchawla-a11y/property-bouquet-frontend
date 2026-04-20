"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  credentials: "include", // 🔥 VERY IMPORTANT
  body: JSON.stringify({ email, password }),
});

      const data = await res.json();

      console.log("LOGIN RESPONSE:", data);

      if (res.ok) {
        alert("Login success ✅");

        // 🔥 Redirect to admin
        window.location.replace("/admin");
      } else {
        alert(data.message || "Login failed ❌");
      }

    } catch (error) {
      console.error(error);
      alert("Server error ❌");
    }
  };

  return (
    <div style={{ padding: "50px" }}>
      <h2>Login</h2>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      /><br /><br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      /><br /><br />

      <button type="button" onClick={handleLogin}>
        Login
      </button>
    </div>
  );
}