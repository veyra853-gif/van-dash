"use client";

import { useState } from "react";
import Upload from "../components/Upload";

export default function AddCategory() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !image) {
      alert("Please fill in name and upload an image");
      return;
    }

    const payload = {
      name,
      description,
      image,
    };

    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("Category added successfully!");
        window.location.href = "/dashboard/categories";
      } else {
        const error = await res.json();
        alert("Failed to add Category: " + (error.error || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting form");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Add New Category</h1>

      {/* Name Dropdown */}
      <label className="block text-lg font-bold mb-2">Name</label>
      <select
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border p-2 mb-4"
        required
      >
        <option value="">Select a category name</option>
        <option value="Rings">Rings</option>
        <option value="Earrings">Earrings</option>
        <option value="Bracelets">Bracelets</option>
        <option value="Necklaces">Necklaces</option>
        <option value="Brooch">Brooch</option>
      </select>

      {/* Description */}
      <label className="block text-lg font-bold mb-2">Description</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full border p-2 mb-4"
        rows={6}
        placeholder="Write your category description here..."
      />

      {/* Image Upload */}
      <div className="mb-4">
        <label className="block text-lg font-bold mb-2">Image</label>
        <Upload onFilesUpload={(urls) => {
          if (Array.isArray(urls) && urls.length > 0) {
            setImage(urls[0]);
          } else if (typeof urls === 'string') {
            setImage(urls);
          }
        }} />
        {image && (
          <div className="mt-2">
            <img
              src={image}
              alt="Category"
              className="w-32 h-32 object-cover border rounded"
            />
          </div>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Save Category
      </button>
    </form>
  );
}




