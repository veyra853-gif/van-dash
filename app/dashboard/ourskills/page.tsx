"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Upload from "../../components/Upload";

interface OurSkillsRecord {
  id: string;
  title: string;
  description: string;
  image: string;
}

export default function OurSkillsManagement() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [recordId, setRecordId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");

  const fetchOurSkills = async () => {
    try {
      const res = await fetch("/api/ourskills");
      const json = await res.json();
      if (json.success) {
        const first: OurSkillsRecord | undefined = (json.data || [])[0];
        if (first?.id) {
          setRecordId(first.id);
          setTitle(first.title || "");
          setDescription(first.description || "");
          setImage(first.image || "");
        } else {
          setRecordId(null);
        }
      }
    } catch (e) {
      console.error("Error fetching OurSkills:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOurSkills();
  }, []);

  const handleImageUpload = (urls: string[]) => {
    const first = urls?.[0];
    if (first) setImage(first);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const payload = { title, description, image };

      const res = await fetch(
        recordId ? `/api/ourskills/${recordId}` : "/api/ourskills",
        {
          method: recordId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Failed to save OurSkills");

      if (!recordId && json?.data?.id) setRecordId(json.data.id);

      alert("OurSkills saved successfully!");
    } catch (e) {
      console.error("Error saving OurSkills:", e);
      alert("Error saving OurSkills");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!recordId) return;
    if (!confirm("Are you sure you want to delete the OurSkills content?")) return;
    try {
      const res = await fetch(`/api/ourskills/${recordId}`, { method: "DELETE" });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Failed to delete OurSkills");

      setRecordId(null);
      setTitle("");
      setDescription("");
      setImage("");

      alert("OurSkills deleted successfully!");
    } catch (e) {
      console.error("Error deleting OurSkills:", e);
      alert("Error deleting OurSkills");
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Our Skills Management</h1>
          <p className="text-gray-600">Manage the Our Skills section (title, description and image)</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8 space-y-5">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-3">Skills Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Our Skills title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2.5 min-h-[80px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Our Skills description"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-4">
            <h3 className="font-semibold text-gray-700 border-b border-gray-200 pb-2">Image</h3>
            <Upload onFilesUpload={handleImageUpload} />
            {image && (
              <div className="relative w-full h-48 rounded-md overflow-hidden border mt-2">
                <Image src={image} alt="OurSkills image" fill className="object-cover" />
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
          {saving ? "Saving..." : recordId ? "Update Our Skills" : "Create Our Skills"}
        </button>

        {recordId && (
          <button
            onClick={handleDelete}
            className="bg-red-50 text-red-600 border border-red-200 px-6 py-2.5 rounded-md hover:bg-red-100 transition"
          >
            Delete Our Skills
          </button>
        )}
      </div>

      {!recordId && (
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">
            No OurSkills record yet — fill the form and click “Create Our Skills”.
          </p>
        </div>
      )}
    </div>
  );
}

