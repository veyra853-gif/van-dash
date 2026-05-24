"use client";

import { useEffect, useState } from 'react';

interface OurTrackRecordData {
  id: string;
  Title1: string;
  Title2: string;
  descrption: string;
  C1title: string;
  C1descrption: string;
  C2title: string;
  C2descrption: string;
  C3title: string;
  C3descrption: string;
}

export default function OurTrackRecordManagement() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [recordId, setRecordId] = useState<string | null>(null);
  
  // Header state
  const [Title1, setTitle1] = useState('');
  const [Title2, setTitle2] = useState('');
  const [descrption, setDescrption] = useState('');
  
  // Cards state
  const [C1title, setC1title] = useState('');
  const [C1descrption, setC1descrption] = useState('');
  
  const [C2title, setC2title] = useState('');
  const [C2descrption, setC2descrption] = useState('');
  
  const [C3title, setC3title] = useState('');
  const [C3descrption, setC3descrption] = useState('');

  const fetchRecord = async () => {
    try {
      const res = await fetch('/api/ourtrackrecord');
      const json = await res.json();
      if (json.success) {
        const first: OurTrackRecordData | undefined = (json.data || [])[0];
        if (first?.id) {
          setRecordId(first.id);
          setTitle1(first.Title1 || '');
          setTitle2(first.Title2 || '');
          setDescrption(first.descrption || '');
          setC1title(first.C1title || '');
          setC1descrption(first.C1descrption || '');
          setC2title(first.C2title || '');
          setC2descrption(first.C2descrption || '');
          setC3title(first.C3title || '');
          setC3descrption(first.C3descrption || '');
        } else {
          setRecordId(null);
        }
      }
    } catch (e) {
      console.error('Error fetching OurTrackRecord records:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRecord(); }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      
      const payload = {
        Title1, Title2, descrption,
        C1title, C1descrption,
        C2title, C2descrption,
        C3title, C3descrption
      };

      const res = await fetch(recordId ? `/api/ourtrackrecord/${recordId}` : '/api/ourtrackrecord', {
        method: recordId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!json.success) throw new Error(json.error || 'Failed to save');

      if (!recordId && json?.data?.id) {
        setRecordId(json.data.id);
      }

      alert('Our Track Record section saved successfully!');
    } catch (e) {
      console.error('Error saving record:', e);
      alert('Error saving section');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!recordId) return;
    if (!confirm('Are you sure you want to delete the whole section?')) return;
    try {
      const res = await fetch(`/api/ourtrackrecord/${recordId}`, { method: 'DELETE' });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Failed to delete');

      setRecordId(null);
      setTitle1(''); setTitle2(''); setDescrption('');
      setC1title(''); setC1descrption('');
      setC2title(''); setC2descrption('');
      setC3title(''); setC3descrption('');

      alert('Section deleted successfully!');
    } catch (e) {
      console.error('Error deleting section:', e);
      alert('Error deleting section');
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-64 mb-6"></div>
          <div className="grid grid-cols-1 gap-6">
            <div className="bg-gray-300 rounded-lg h-[250px]"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Our Track Record</h1>
          <p className="text-gray-600">Manage the main headings, description, and three content cards.</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8 space-y-5">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-3">Header Details</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title 1</label>
            <input
              value={Title1}
              onChange={(e) => setTitle1(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="e.g. Our Track Record"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title 2</label>
            <input
              value={Title2}
              onChange={(e) => setTitle2(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="e.g. Proven Success"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={descrption}
              onChange={(e) => setDescrption(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2.5 min-h-[100px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Enter the main background description..."
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-3 mb-5">Content Cards</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-4">
            <h3 className="font-semibold text-gray-700 border-b border-gray-200 pb-2">Card 1</h3>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Title</label>
              <input
                value={C1title}
                onChange={(e) => setC1title(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="e.g. Global Reach"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
              <textarea
                value={C1descrption}
                onChange={(e) => setC1descrption(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 text-sm min-h-[80px] focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="..."
              />
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-4">
            <h3 className="font-semibold text-gray-700 border-b border-gray-200 pb-2">Card 2</h3>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Title</label>
              <input
                value={C2title}
                onChange={(e) => setC2title(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="e.g. Industry Expertise"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
              <textarea
                value={C2descrption}
                onChange={(e) => setC2descrption(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 text-sm min-h-[80px] focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="..."
              />
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-4">
            <h3 className="font-semibold text-gray-700 border-b border-gray-200 pb-2">Card 3</h3>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Title</label>
              <input
                value={C3title}
                onChange={(e) => setC3title(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="e.g. Happy Clients"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
              <textarea
                value={C3descrption}
                onChange={(e) => setC3descrption(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 text-sm min-h-[80px] focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="..."
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3 pt-4 border-t border-gray-200">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 text-white px-8 py-2.5 rounded-md hover:bg-blue-700 disabled:opacity-60 font-medium transition"
        >
          {saving ? 'Saving...' : recordId ? 'Save Data' : 'Create Section'}
        </button>

        {recordId && (
          <button
            onClick={handleDelete}
            className="bg-red-50 text-red-600 border border-red-200 px-6 py-2.5 rounded-md hover:bg-red-100 transition"
          >
            Delete Entire Section
          </button>
        )}
      </div>
    </div>
  );
}
