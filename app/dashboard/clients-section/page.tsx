"use client";

import { useEffect, useState } from "react";

type ClientsSection = {
  id: string;
  badgeLabel: string;
  title: string;
  description: string;
};

export default function ClientsSectionPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [recordId, setRecordId] = useState<string | null>(null);
  const [badgeLabel, setBadgeLabel] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const fetchRecord = async () => {
    try {
      const res = await fetch('/api/clients-section');
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        const first = json.data[0];
        setRecordId(first.id);
        setBadgeLabel(first.badgeLabel || '');
        setTitle(first.title || '');
        setDescription(first.description || '');
      }
    } catch (e) {
      console.error('Error fetching clients section:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRecord(); }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      const payload = { badgeLabel, title, description };

      const res = await fetch(recordId ? `/api/clients-section/${recordId}` : '/api/clients-section', {
        method: recordId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Failed to save');
      if (!recordId && json?.data?.id) setRecordId(json.data.id);

      alert('Clients section saved successfully!');
    } catch (e) {
      console.error('Error saving:', e);
      alert('Error saving section');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!recordId) return;
    if (!confirm('Are you sure you want to delete this section?')) return;
    try {
      const res = await fetch(`/api/clients-section/${recordId}`, { method: 'DELETE' });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Failed to delete');

      setRecordId(null);
      setBadgeLabel('');
      setTitle('');
      setDescription('');
      alert('Section deleted successfully!');
    } catch (e) {
      console.error('Error deleting:', e);
      alert('Error deleting section');
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-64 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => <div key={i} className="bg-gray-300 rounded-lg h-24"></div>)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Clients Section</h1>
        <p className="text-gray-600">Edit the text and copy for the "Our Clients" section on the projects page.</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Badge Label</label>
          <input
            value={badgeLabel}
            onChange={(e) => setBadgeLabel(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="e.g. Trusted Partners"
          />
          <p className="text-xs text-gray-500 mt-1">Small badge text at the top</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="e.g. Proud to Work With"
          />
          <p className="text-xs text-gray-500 mt-1">Main heading</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
            placeholder="e.g. Leading organizations trust us with..."
          />
          <p className="text-xs text-gray-500 mt-1">Supporting description text</p>
        </div>

        {/* Preview */}
        <div className="pt-4 border-t border-gray-200">
          <p className="text-sm font-medium text-gray-700 mb-3">Preview</p>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-xs font-semibold text-cyan-700 mb-2">{badgeLabel || 'Badge'}</p>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{title || 'Title'}</h3>
            <p className="text-sm text-gray-600">{description || 'Description'}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3 pt-4 border-t border-gray-200">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 text-white px-8 py-2.5 rounded-md hover:bg-blue-700 disabled:opacity-60 font-medium transition"
        >
          {saving ? 'Saving...' : recordId ? 'Save Changes' : 'Create Section'}
        </button>

        {recordId && (
          <button
            onClick={handleDelete}
            className="bg-red-50 text-red-600 border border-red-200 px-6 py-2.5 rounded-md hover:bg-red-100 transition"
          >
            Delete Section
          </button>
        )}
      </div>
    </div>
  );
}
