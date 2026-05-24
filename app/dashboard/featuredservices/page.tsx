"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Upload from "../../components/Upload";

interface FeaturedServicesRecord {
  id: string;
  title: string;
  image: string;
}

export default function FeaturedServicesManagement() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [recordId, setRecordId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");

  const fetchFeaturedServices = async () => {
    try {
      const res = await fetch("/api/feauredservices");
      const json = await res.json();
      if (json.success) {
        const first: FeaturedServicesRecord | undefined = (json.data || [])[0];
        if (first?.id) {
          setRecordId(first.id);
          setTitle(first.title || "");
          setImage(first.image || "");
        } else {
          setRecordId(null);
        }
      }
    } catch (e) {
      console.error("Error fetching FeaturedServices:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedServices();
  }, []);

  const handleImageUpload = (urls: string[]) => {
    const first = urls?.[0];
    if (first) setImage(first);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const payload = { title, image };

      const res = await fetch(
        recordId ? `/api/feauredservices/${recordId}` : "/api/feauredservices",
        {
          method: recordId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Failed to save FeaturedServices");

      if (!recordId && json?.data?.id) setRecordId(json.data.id);

      alert("FeaturedServices saved successfully!");
    } catch (e) {
      console.error("Error saving FeaturedServices:", e);
      alert("Error saving FeaturedServices");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!recordId) return;
    if (!confirm("Are you sure you want to delete the FeaturedServices content?")) return;
    try {
      const res = await fetch(`/api/feauredservices/${recordId}`, { method: "DELETE" });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Failed to delete FeaturedServices");

      setRecordId(null);
      setTitle("");
      setImage("");

      alert("FeaturedServices deleted successfully!");
    } catch (e) {
      console.error("Error deleting FeaturedServices:", e);
      alert("Error deleting FeaturedServices");
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-64 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="bg-gray-300 rounded-lg h-40" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Featured Services Management</h1>
          <p className="text-gray-600">Manage the Featured Services section (title and image)</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8 space-y-5">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-3">Service Details</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="Featured services title"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-4">
            <h3 className="font-semibold text-gray-700 border-b border-gray-200 pb-2">Image</h3>
            <Upload onFilesUpload={handleImageUpload} />
            {image && (
              <div className="relative w-full h-48 rounded-md overflow-hidden border mt-2">
                <Image src={image} alt="Featured services image" fill className="object-cover" />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3 pt-4 border-t border-gray-200">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 text-white px-8 py-2.5 rounded-md hover:bg-blue-700 disabled:opacity-60 font-medium transition"
        >
          {saving ? "Saving..." : recordId ? "Update Featured Services" : "Create Featured Services"}
        </button>

        {recordId && (
          <button
            onClick={handleDelete}
            className="bg-red-50 text-red-600 border border-red-200 px-6 py-2.5 rounded-md hover:bg-red-100 transition"
          >
            Delete Featured Services
          </button>
        )}
      </div>

      {!recordId && (
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">
            No FeaturedServices record yet — fill the form and click “Create Featured Services”.
          </p>
        </div>
      )}
    </div>
  );
}

