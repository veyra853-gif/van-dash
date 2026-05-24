'use client';

import { useState, useEffect } from 'react';

export default function ColorsTable() {
  const [colors, setColors] = useState([]);
  const [editingColor, setEditingColor] = useState(null);

  useEffect(() => {
    fetchColors();
  }, []);

  const fetchColors = async () => {
    const response = await fetch('/api/colors');
    if (response.ok) {
      const data = await response.json();
      setColors(data);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this color?')) {
      const response = await fetch(`/api/colors?id=${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchColors();
      }
    }
  };

  const handleUpdate = async (updatedColor) => {
    const response = await fetch(`/api/colors?id=${updatedColor.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedColor),
    });

    if (response.ok) {
      setEditingColor(null);
      fetchColors();
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-2 sm:p-4 text-sm">
      {editingColor && (
        <EditColorForm
          color={editingColor}
          onCancel={() => setEditingColor(null)}
          onSave={handleUpdate}
        />
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
        <h1 className="text-xl sm:text-2xl font-bold">Colors</h1>
        <a
          href="/colors"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors w-full sm:w-auto text-center"
        >
          Add Color
        </a>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-200 mb-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Name</th>
              <th className="border p-2 text-left">Hex Code</th>
              <th className="border p-2 text-left">Preview</th>
              <th className="border p-2 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {colors.map((color) => (
              <tr key={color.id}>
                <td className="border p-2">{color.name}</td>
                <td className="border p-2">{color.hexCode}</td>
                <td className="border p-2">
                  <div
                    className="w-16 h-16 border border-gray-300 rounded mx-auto"
                    style={{ backgroundColor: color.hexCode }}
                  />
                </td>
                <td className="border p-2">
                  <button
                    onClick={() => setEditingColor(color)}
                    className="bg-yellow-500 text-white px-2 py-1 mr-2 rounded hover:bg-yellow-600 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(color.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {colors.map((color) => (
          <div key={color.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="flex items-start gap-4 mb-3">
              <div
                className="w-20 h-20 border border-gray-300 rounded flex-shrink-0"
                style={{ backgroundColor: color.hexCode }}
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base mb-1">{color.name}</h3>
                <p className="text-gray-600 text-sm font-mono">{color.hexCode}</p>
              </div>
            </div>
            <div className="flex gap-2 pt-3 border-t border-gray-200">
              <button
                onClick={() => setEditingColor(color)}
                className="flex-1 bg-yellow-500 text-white px-3 py-2 rounded text-sm hover:bg-yellow-600 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(color.id)}
                className="flex-1 bg-red-500 text-white px-3 py-2 rounded text-sm hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EditColorForm({ color, onCancel, onSave }) {
  const [name, setName] = useState(color.name);
  const [hexCode, setHexCode] = useState(color.hexCode);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...color,
      name,
      hexCode,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="text-sm border p-4 bg-gray-100 rounded mb-6"
    >
      <h2 className="text-xl font-bold mb-4">Edit Color</h2>

      {/* Name */}
      <div className="mb-4">
        <label className="block font-medium">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2"
          required
        />
      </div>

      {/* Hex Code */}
      <div className="mb-4">
        <label className="block font-medium">Hex Code</label>
        <div className="flex items-center gap-4">
          <input
            type="text"
            value={hexCode}
            onChange={(e) => setHexCode(e.target.value)}
            className="w-full border p-2"
            required
            pattern="^#[0-9A-Fa-f]{6}$"
          />
          <div
            className="w-16 h-16 border border-gray-300 rounded"
            style={{ backgroundColor: hexCode }}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-2 mt-4">
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}














