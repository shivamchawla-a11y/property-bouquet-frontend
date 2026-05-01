"use client";

import { useState } from "react";
import { Building2 } from "lucide-react";

export default function DevelopersPage() {
  const [developers, setDevelopers] = useState([]);
  const [name, setName] = useState("");
  const [logo, setLogo] = useState("");

  const addDeveloper = () => {
    if (!name) return;

    setDevelopers([
      ...developers,
      { name, logo: logo || "/placeholder.png" },
    ]);

    setName("");
    setLogo("");
  };

  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-bold flex items-center gap-2">
        <Building2 /> Developers
      </h1>

      {/* ADD */}
      <div className="bg-white p-4 rounded-xl shadow space-y-3">
        <h2 className="font-semibold">Add Developer</h2>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Developer Name"
          className="input"
        />

        <input
          value={logo}
          onChange={(e) => setLogo(e.target.value)}
          placeholder="Logo URL"
          className="input"
        />

        <button onClick={addDeveloper} className="btn-primary">
          Add Developer
        </button>
      </div>

      {/* LIST */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {developers.map((dev, i) => (
          <div key={i} className="bg-white p-4 rounded-xl shadow text-center">
            <img
              src={dev.logo}
              className="h-12 mx-auto mb-2"
              alt=""
            />
            <p className="font-medium">{dev.name}</p>
          </div>
        ))}
      </div>

    </div>
  );
}