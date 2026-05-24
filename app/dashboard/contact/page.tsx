"use client";

import { useEffect, useState } from "react";

interface ContactRecord {
  id: string;
  badge: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

export default function ContactManagement() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [recordId, setRecordId] = useState<string | null>(null);
  const [badge, setBadge] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [buttonText, setButtonText] = useState("");
  const [buttonLink, setButtonLink] = useState("");

  const fetchContact = async () => {
    try {
      const res = await fetch("/api/contact");
      const json = await res.json();
      if (json.success) {
        const first: ContactRecord | undefined = (json.data || [])[0];
        if (first?.id) {
          setRecordId(first.id);
          setBadge(first.badge || "");
          setTitle(first.title || "");
          setDescription(first.description || "");
          setButtonText(first.buttonText || "");
          setButtonLink(first.buttonLink || "");
        } else {
          setRecordId(null);
        }
      }
    } catch (e) {
      console.error("Error fetching Contact:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContact();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      const payload = { badge, title, description, buttonText, buttonLink };

      const res = await fetch(recordId ? `/api/contact/${recordId}` : "/api/contact", {
        method: recordId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Failed to save Contact");

      if (!recordId && json?.data?.id) setRecordId(json.data.id);

      alert("Contact banner saved successfully!");
    } catch (e) {
      console.error("Error saving Contact:", e);
      alert("Error saving Contact banner");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!recordId) return;
    if (!confirm("Are you sure you want to delete the Contact banner content?")) return;
    try {
      const res = await fetch(`/api/contact/${recordId}`, { method: "DELETE" });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Failed to delete Contact");

      setRecordId(null);
      setBadge("");
      setTitle("");
      setDescription("");
      setButtonText("");
      setButtonLink("");

      alert("Contact banner deleted successfully!");
    } catch (e) {
      console.error("Error deleting Contact:", e);
      alert("Error deleting Contact banner");
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-64 mb-6" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-300 rounded-lg h-24" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Banner Management</h1>
        <p className="text-gray-600">Manage the banner text and button shown on van-main-clean contact section.</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8 space-y-5">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-3">Banner Content</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Badge</label>
          <input
            value={badge}
            onChange={(e) => setBadge(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="CONTACT US"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="Want to know more about us?"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="Lollamco laboris nisi ut aliquip ex ea commodo consequat."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
            <input
              value={buttonText}
              onChange={(e) => setButtonText(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Contact Us"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Button Link</label>
            <input
              value={buttonLink}
              onChange={(e) => setButtonLink(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="#contact-form"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3 pt-4 border-t border-gray-200">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 text-white px-8 py-2.5 rounded-md hover:bg-blue-700 disabled:opacity-60 font-medium transition"
        >
          {saving ? "Saving..." : recordId ? "Update Contact Banner" : "Create Contact Banner"}
        </button>

        {recordId && (
          <button
            onClick={handleDelete}
            className="bg-red-50 text-red-600 border border-red-200 px-6 py-2.5 rounded-md hover:bg-red-100 transition"
          >
            Delete Banner Content
          </button>
        )}
      </div>
    </div>
  );
}
