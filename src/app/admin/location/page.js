"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";

export default function LocationPage() {
  const [cities, setCities] = useState([
    {
      name: "Gurgaon",
      zones: [
        {
          name: "Golf Course Road",
          localities: ["DLF Phase 1", "DLF Phase 2"],
        },
      ],
    },
  ]);

  const [city, setCity] = useState("");
  const [zone, setZone] = useState("");
  const [locality, setLocality] = useState("");

  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedZone, setSelectedZone] = useState(null);

  // ADD CITY
  const addCity = () => {
    if (!city) return;
    setCities([...cities, { name: city, zones: [] }]);
    setCity("");
  };

  // ADD ZONE
  const addZone = () => {
    if (!zone || selectedCity === null) return;

    const updated = [...cities];
    updated[selectedCity].zones.push({ name: zone, localities: [] });
    setCities(updated);
    setZone("");
  };

  // ADD LOCALITY
  const addLocality = () => {
    if (!locality || selectedCity === null || selectedZone === null) return;

    const updated = [...cities];
    updated[selectedCity].zones[selectedZone].localities.push(locality);
    setCities(updated);
    setLocality("");
  };

  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-bold flex items-center gap-2">
        <MapPin /> Location Management
      </h1>

      {/* ADD CITY */}
      <div className="bg-white p-4 rounded-xl shadow space-y-3">
        <h2 className="font-semibold">Add City</h2>
        <div className="flex gap-2">
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="City Name"
            className="input flex-1"
          />
          <button onClick={addCity} className="btn-primary">Add</button>
        </div>
      </div>

      {/* ADD ZONE */}
      <div className="bg-white p-4 rounded-xl shadow space-y-3">
        <h2 className="font-semibold">Add Zone</h2>

        <select
          className="input w-full"
          onChange={(e) => setSelectedCity(e.target.value)}
        >
          <option>Select City</option>
          {cities.map((c, i) => (
            <option key={i} value={i}>{c.name}</option>
          ))}
        </select>

        <div className="flex gap-2">
          <input
            value={zone}
            onChange={(e) => setZone(e.target.value)}
            placeholder="Zone Name"
            className="input flex-1"
          />
          <button onClick={addZone} className="btn-primary">Add</button>
        </div>
      </div>

      {/* ADD LOCALITY */}
      <div className="bg-white p-4 rounded-xl shadow space-y-3">
        <h2 className="font-semibold">Add Locality</h2>

        <select
          className="input w-full"
          onChange={(e) => setSelectedCity(e.target.value)}
        >
          <option>Select City</option>
          {cities.map((c, i) => (
            <option key={i} value={i}>{c.name}</option>
          ))}
        </select>

        {selectedCity !== null && (
          <select
            className="input w-full"
            onChange={(e) => setSelectedZone(e.target.value)}
          >
            <option>Select Zone</option>
            {cities[selectedCity]?.zones.map((z, i) => (
              <option key={i} value={i}>{z.name}</option>
            ))}
          </select>
        )}

        <div className="flex gap-2">
          <input
            value={locality}
            onChange={(e) => setLocality(e.target.value)}
            placeholder="Locality"
            className="input flex-1"
          />
          <button onClick={addLocality} className="btn-primary">Add</button>
        </div>
      </div>

    </div>
  );
}