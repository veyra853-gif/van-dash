"use client";

import { useEffect, useState } from "react";
import Upload from "../../components/Upload";

type Brand = {
  id: string;
  images: string[];
};

type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error?: string };

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createImages, setCreateImages] = useState<string[]>([]);

  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [editImages, setEditImages] = useState<string[]>([]);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/brands");
      const json = (await res.json()) as ApiResponse<Brand[]>;

      if (!res.ok || !json.success) {
        alert(`Failed to fetch brands: ${("error" in json && json.error) || "Unknown error"}`);
        return;
      }

      setBrands(Array.isArray(json.data) ? json.data : []);
    } catch (e) {
      const err = e as Error;
      alert(`Error fetching brands: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleCreateImagesUpload = (urls: string[] | string) => {
    const next = Array.isArray(urls) ? urls : [urls];
    setCreateImages((prev) => [...prev, ...next].filter(Boolean));
  };

  const handleEditImagesUpload = (urls: string[] | string) => {
    const next = Array.isArray(urls) ? urls : [urls];
    setEditImages((prev) => [...prev, ...next].filter(Boolean));
  };

  const handleCreate = async () => {
    if (createImages.length === 0) {
      alert("Please upload at least one image");
      return;
    }

    try {
      const res = await fetch("/api/brands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ images: createImages }),
      });
      const json = (await res.json()) as ApiResponse<Brand>;

      if (!res.ok || !json.success) {
        alert(`Failed to create brand: ${("error" in json && json.error) || "Unknown error"}`);
        return;
      }

      setShowCreateForm(false);
      setCreateImages([]);
      await fetchBrands();
      alert("Brand created successfully");
    } catch (e) {
      const err = e as Error;
      alert(`Error creating brand: ${err.message}`);
    }
  };

  const startEdit = (brand: Brand) => {
    setEditingBrand(brand);
    setEditImages(Array.isArray(brand.images) ? brand.images : []);
  };

  const handleUpdate = async () => {
    if (!editingBrand) return;
    if (editImages.length === 0) {
      alert("Please keep at least one image");
      return;
    }

    try {
      const res = await fetch(`/api/brands/${editingBrand.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ images: editImages }),
      });
      const json = (await res.json()) as ApiResponse<Brand>;

      if (!res.ok || !json.success) {
        alert(`Failed to update brand: ${("error" in json && json.error) || "Unknown error"}`);
        return;
      }

      setEditingBrand(null);
      setEditImages([]);
      await fetchBrands();
      alert("Brand updated successfully");
    } catch (e) {
      const err = e as Error;
      alert(`Error updating brand: ${err.message}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this brand?")) return;
    try {
      const res = await fetch(`/api/brands/${id}`, { method: "DELETE" });
      const json = (await res.json()) as ApiResponse<unknown> & { message?: string };

      if (!res.ok || ("success" in json && json.success === false)) {
        alert(`Failed to delete brand: ${("error" in json && json.error) || "Unknown error"}`);
        return;
      }

      await fetchBrands();
      alert(json.message || "Brand deleted successfully");
    } catch (e) {
      const err = e as Error;
      alert(`Error deleting brand: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-4">
        <p>Loading brands...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {showCreateForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8 space-y-5">
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-3">Create Brand</h2>

          <div className="mb-4">
            <label className="block font-medium mb-1">Images *</label>
            <Upload onFilesUpload={handleCreateImagesUpload} />
            {createImages.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {createImages.map((img, idx) => (
                  <div key={idx} className="relative">
                    <img
                      src={img}
                      alt={`Brand image ${idx + 1}`}
                      className="w-24 h-24 object-cover border rounded"
                    />
                    <button
                      type="button"
                      onClick={() => setCreateImages(createImages.filter((_, i) => i !== idx))}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 text-xs"
                      aria-label="Remove image"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCreate}
              className="bg-blue-600 text-white px-8 py-2.5 rounded-md hover:bg-blue-700 font-medium transition"
            >
              Create
            </button>
            <button
              type="button"
              onClick={() => {
                setShowCreateForm(false);
                setCreateImages([]);
              }}
              className="bg-red-50 text-red-600 border border-red-200 px-6 py-2.5 rounded-md hover:bg-red-100 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {editingBrand && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8 space-y-5">
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-3">Edit Brand</h2>

          <div className="mb-4">
            <label className="block font-medium mb-1">Images *</label>
            <Upload onFilesUpload={handleEditImagesUpload} />
            {editImages.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {editImages.map((img, idx) => (
                  <div key={idx} className="relative">
                    <img
                      src={img}
                      alt={`Brand image ${idx + 1}`}
                      className="w-24 h-24 object-cover border rounded"
                    />
                    <button
                      type="button"
                      onClick={() => setEditImages(editImages.filter((_, i) => i !== idx))}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 text-xs"
                      aria-label="Remove image"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleUpdate}
              className="bg-blue-600 text-white px-8 py-2.5 rounded-md hover:bg-blue-700 font-medium transition"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => {
                setEditingBrand(null);
                setEditImages([]);
              }}
              className="bg-red-50 text-red-600 border border-red-200 px-6 py-2.5 rounded-md hover:bg-red-100 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Brands</h1>
          <p className="text-gray-600">Manage brand logos and images</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 text-white px-8 py-2.5 rounded-md hover:bg-blue-700 font-medium transition"
        >
          Add Brand
        </button>
      </div>

      {/* Desktop Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="hidden md:block overflow-x-auto">
          <table className="table-auto w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-3 text-left text-sm font-semibold text-gray-700">Preview</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700">Images</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {brands.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-6 text-center text-gray-500">
                  No brands found
                </td>
              </tr>
            ) : (
              brands.map((brand) => (
                <tr key={brand.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-3">
                    {brand.images?.[0] ? (
                      <img
                        src={brand.images[0]}
                        alt="Brand"
                        className="w-16 h-16 object-cover"
                      />
                    ) : (
                      <span className="text-gray-400">No image</span>
                    )}
                  </td>
                  <td className="p-3">
                    <span className="text-gray-700">{brand.images?.length || 0}</span>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => startEdit(brand)}
                      className="bg-blue-50 text-blue-600 border border-blue-200 px-4 py-1.5 mr-2 rounded-md hover:bg-blue-100 transition text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(brand.id)}
                      className="bg-red-50 text-red-600 border border-red-200 px-4 py-1.5 rounded-md hover:bg-red-100 transition text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {brands.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            No brands found
          </div>
        ) : (
          brands.map((brand) => (
            <div key={brand.id} className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex items-start gap-4">
                {brand.images?.[0] ? (
                  <img
                    src={brand.images[0]}
                    alt="Brand"
                    className="w-20 h-20 object-cover rounded flex-shrink-0"
                  />
                ) : (
                  <div className="w-20 h-20 rounded bg-gray-100 flex items-center justify-center text-gray-400">
                    No image
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-gray-700 mb-3">
                    <span className="font-semibold">Images:</span> {brand.images?.length || 0}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(brand)}
                      className="flex-1 bg-blue-50 text-blue-600 border border-blue-200 px-3 py-2 rounded-md text-sm hover:bg-blue-100 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(brand.id)}
                      className="flex-1 bg-red-50 text-red-600 border border-red-200 px-3 py-2 rounded-md text-sm hover:bg-red-100 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      </div>
    </div>
  );
}
