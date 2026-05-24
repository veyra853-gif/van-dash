"use client";

import { useEffect, useState } from 'react';

interface PortfolioItem {
  title: string;
  fileUrl: string;
}

interface PortfolioData {
  id: string;
  title: string;
  items: PortfolioItem[];
}

export default function PortfolioManagement() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [recordId, setRecordId] = useState<string | null>(null);
  const [sectionTitle, setSectionTitle] = useState('');
  const [items, setItems] = useState<PortfolioItem[]>([{ title: '', fileUrl: '' }]);

  const fetchRecord = async () => {
    try {
      const res = await fetch('/api/portfolio');
      const json = await res.json();
      if (json.success) {
        const first: PortfolioData | undefined = (json.data || [])[0];
        if (first?.id) {
          setRecordId(first.id);
          setSectionTitle(first.title || '');
          setItems(Array.isArray(first.items) && first.items.length > 0
            ? first.items
            : [{ title: '', fileUrl: '' }]
          );
        } else {
          setRecordId(null);
        }
      }
    } catch (e) {
      console.error('Error fetching Portfolio records:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRecord(); }, []);

  const addItem = () => setItems([...items, { title: '', fileUrl: '' }]);

  const removeItem = (index: number) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof PortfolioItem, value: string) => {
    const next = [...items];
    next[index] = { ...next[index], [field]: value };
    setItems(next);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const payload = { title: sectionTitle, items };

      const res = await fetch(recordId ? `/api/portfolio/${recordId}` : '/api/portfolio', {
        method: recordId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Failed to save');
      if (!recordId && json?.data?.id) setRecordId(json.data.id);

      alert('Portfolio saved successfully!');
    } catch (e) {
      console.error('Error saving portfolio:', e);
      alert('Error saving portfolio');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!recordId) return;
    if (!confirm('Are you sure you want to delete the portfolio?')) return;
    try {
      const res = await fetch(`/api/portfolio/${recordId}`, { method: 'DELETE' });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Failed to delete');

      setRecordId(null);
      setSectionTitle('');
      setItems([{ title: '', fileUrl: '' }]);
      alert('Portfolio deleted successfully!');
    } catch (e) {
      console.error('Error deleting portfolio:', e);
      alert('Error deleting portfolio');
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
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Portfolio Management</h1>
          <p className="text-gray-600">Manage portfolio items — each item has a title and a downloadable file link.</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8 space-y-5">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-3">Section Details</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
          <input
            value={sectionTitle}
            onChange={(e) => setSectionTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="e.g. Our Portfolio"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between border-b pb-3 mb-5">
          <h2 className="text-xl font-semibold text-gray-800">Portfolio Items</h2>
          <button
            onClick={addItem}
            className="bg-blue-50 text-blue-600 border border-blue-200 px-4 py-1.5 rounded-md hover:bg-blue-100 transition text-sm font-medium"
          >
            + Add Item
          </button>
        </div>

        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-700">Item {index + 1}</h3>
                {items.length > 1 && (
                  <button
                    onClick={() => removeItem(index)}
                    className="text-red-500 hover:text-red-700 text-sm transition"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  value={item.title}
                  onChange={(e) => updateItem(index, 'title', e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="e.g. Annual Report 2024"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">File URL</label>
                <div className="flex gap-3">
                  <input
                    value={item.fileUrl}
                    onChange={(e) => updateItem(index, 'fileUrl', e.target.value)}
                    className="flex-1 border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="https://example.com/file.pdf"
                  />
                  {item.fileUrl && (
                    <a
                      href={item.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-md border border-gray-300 transition text-sm whitespace-nowrap"
                    >
                      View
                    </a>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3 pt-4 border-t border-gray-200">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 text-white px-8 py-2.5 rounded-md hover:bg-blue-700 disabled:opacity-60 font-medium transition"
        >
          {saving ? 'Saving...' : recordId ? 'Save Portfolio' : 'Create Portfolio'}
        </button>

        {recordId && (
          <button
            onClick={handleDelete}
            className="bg-red-50 text-red-600 border border-red-200 px-6 py-2.5 rounded-md hover:bg-red-100 transition"
          >
            Delete Portfolio
          </button>
        )}
      </div>
    </div>
  );
}



