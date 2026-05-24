"use client";

import { useEffect, useState } from "react";

interface VideoRecord {
  id: string;
  title: string;
  description: string;
  video: string;
  videoUrl: string;
}

export default function VideoManagement() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [recordId, setRecordId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [video, setVideo] = useState("");

  const fetchVideo = async () => {
    try {
      const res = await fetch("/api/video");
      const json = await res.json();
      if (json.success) {
        const first: VideoRecord | undefined = (json.data || [])[0];
        if (first?.id) {
          setRecordId(first.id);
          setTitle(first.title || "");
          setDescription(first.description || "");
          setVideo(first.video || "");
        } else {
          setRecordId(null);
        }
      }
    } catch (e) {
      console.error("Error fetching Video:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideo();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      const payload = { title, description, video };

      const res = await fetch(recordId ? `/api/video/${recordId}` : "/api/video", {
        method: recordId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Failed to save Video");

      if (!recordId && json?.data?.id) setRecordId(json.data.id);

      alert("Video saved successfully!");
    } catch (e) {
      console.error("Error saving Video:", e);
      alert("Error saving Video");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!recordId) return;
    if (!confirm("Are you sure you want to delete the Video content?")) return;
    try {
      const res = await fetch(`/api/video/${recordId}`, { method: "DELETE" });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Failed to delete Video");

      setRecordId(null);
      setTitle("");
      setDescription("");
      setVideo("");

      alert("Video deleted successfully!");
    } catch (e) {
      console.error("Error deleting Video:", e);
      alert("Error deleting Video");
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Video Management</h1>
          <p className="text-gray-600">Manage the Video section (title, description and video URL)</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8 space-y-5">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-3">Video Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Video title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2.5 min-h-[80px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Video description"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-4">
            <h3 className="font-semibold text-gray-700 border-b border-gray-200 pb-2">Video URL (YouTube, etc.)</h3>
            <input
              value={video}
              onChange={(e) => setVideo(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="https://www.youtube.com/watch?v=..."
            />
            {video && (video.startsWith("http") || video.startsWith("https")) && (
              <div className="mt-4">
                <p className="text-sm text-gray-500 mb-2">URL Preview (Link):</p>
                <a
                  href={video}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline break-all"
                >
                  {video}
                </a>
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
          {saving ? "Saving..." : recordId ? "Update Video" : "Create Video"}
        </button>

        {recordId && (
          <button
            onClick={handleDelete}
            className="bg-red-50 text-red-600 border border-red-200 px-6 py-2.5 rounded-md hover:bg-red-100 transition"
          >
            Delete Video
          </button>
        )}
      </div>

      {!recordId && (
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">
            No Video record yet — fill the form and click “Create Video”.
          </p>
        </div>
      )}
    </div>
  );
}

