"use client";

import { useState } from "react";

export default function AddColor() {
  const [name, setName] = useState("");
  const [hexCode, setHexCode] = useState("");

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !hexCode) {
      alert("Please fill in name and hexCode");
      return;
    }

    const payload = {
      name,
      hexCode,
    };

    try {
      const res = await fetch("/api/colors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("Color added successfully!");
        window.location.href = "/dashboard/colors";
      } else {
        alert("Failed to add Color");
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting form");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Add New Color</h1>

      {/* Name */}
      <label className="block text-lg font-bold mb-2">Name</label>
      <input
        type="text"
        placeholder="Color name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border p-2 mb-4"
        required
      />

      {/* Hex Code */}
      <label className="block text-lg font-bold mb-2">Hex Code</label>
      <div className="flex items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="#000000"
          value={hexCode}
          onChange={(e) => setHexCode(e.target.value)}
          className="w-full border p-2"
          required
          pattern="^#[0-9A-Fa-f]{6}$"
        />
        {hexCode && (
          <div
            className="w-16 h-16 border border-gray-300 rounded"
            style={{ backgroundColor: hexCode }}
          />
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Save Color
      </button>
    </form>
  );
}














