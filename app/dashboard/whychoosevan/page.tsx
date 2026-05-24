"use client";

import { useEffect, useState } from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';

interface WhyChooseVanRecord {
  id: string;
  title: string;
  description: string;
  points: string[];
}

export default function WhyChooseVanManagement() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [recordId, setRecordId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [points, setPoints] = useState<string[]>([]);

  const fetchRecord = async () => {
    try {
      const res = await fetch('/api/whychoosevan');
      const json = await res.json();
      if (json.success) {
        const first: WhyChooseVanRecord | undefined = (json.data || [])[0];
        if (first?.id) {
          setRecordId(first.id);
          setTitle(first.title || '');
          setDescription(first.description || '');
          setPoints(first.points || []);
        } else {
          setRecordId(null);
        }
      }
    } catch (e) {
      console.error('Error fetching WhyChooseVan records:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRecord(); }, []);

  const handleAddPoint = () => {
    setPoints([...points, '']);
  };

  const handleRemovePoint = (index: number) => {
    const newPoints = [...points];
    newPoints.splice(index, 1);
    setPoints(newPoints);
  };

  const handlePointChange = (index: number, value: string) => {
    const newPoints = [...points];
    newPoints[index] = value;
    setPoints(newPoints);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      const cleanedPoints = points.map(p => p.trim()).filter(Boolean);
      const payload = { title, description, points: cleanedPoints };

      const res = await fetch(recordId ? `/api/whychoosevan/${recordId}` : '/api/whychoosevan', {
        method: recordId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!json.success) throw new Error(json.error || 'Failed to save');

      if (!recordId && json?.data?.id) {
        setRecordId(json.data.id);
        fetchRecord(); 
      } else {
        setPoints(cleanedPoints);
      }

      alert('Why Choose Vanguard section saved successfully!');
    } catch (e) {
      console.error('Error saving WhyChooseVan record:', e);
      alert('Error saving section');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!recordId) return;
    if (!confirm('Are you sure you want to delete the whole section?')) return;
    try {
      const res = await fetch(`/api/whychoosevan/${recordId}`, { method: 'DELETE' });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Failed to delete');

      setRecordId(null);
      setTitle('');
      setDescription('');
      setPoints([]);

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
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Why Choose Vanguard</h1>
          <p className="text-gray-600">Manage the title, description, and list of specific value points.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleAddPoint}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
          >
            <FaPlus className="w-4 h-4" />
            Add New Point
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8 space-y-5">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-3">Section Details</h2>
        
        <div className="grid grid-cols-1 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="e.g. Why Choose Vanguard"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2.5 min-h-[100px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Enter a brief background or subtitle for the Why Choose section"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-3 mb-5">List of Points ({points.length})</h2>
        
        {points.length === 0 ? (
          <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg p-10 text-center">
            <p className="text-gray-500 mb-4">No points added yet.</p>
            <button
              onClick={handleAddPoint}
              className="inline-flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition"
            >
              <FaPlus className="w-4 h-4" />
              Add First Point
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {points.map((point, index) => (
              <div key={index} className="flex items-center gap-3">
                <span className="font-semibold text-sm text-gray-400 w-6 text-right">
                  {index + 1}.
                </span>
                <input
                  value={point}
                  onChange={(e) => handlePointChange(index, e.target.value)}
                  className="flex-1 border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none transition"
                  placeholder="e.g. Competitive Pricing"
                />
                <button
                  onClick={() => handleRemovePoint(index)}
                  className="flex-shrink-0 text-gray-400 hover:text-red-500 transition-colors p-2"
                  title="Remove Point"
                >
                  <FaTrash className="w-4 h-4" />
                </button>
              </div>
            ))}
            
            <button
              onClick={handleAddPoint}
              className="mt-3 inline-flex items-center gap-2 text-sm text-green-600 hover:text-green-700 font-medium pl-9"
            >
              <FaPlus className="w-3 h-3" />
              Add another point
            </button>
          </div>
        )}
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
