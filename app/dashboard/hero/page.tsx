"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Upload from '../../components/Upload';

interface HeroRecord {
  id: string;
  Title1: string;
  Title2: string;
  decrption: string;
  image1: string;
  image2: string;
}

export default function HeroManagement() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [heroId, setHeroId] = useState<string | null>(null);
  const [Title1, setTitle1] = useState('');
  const [Title2, setTitle2] = useState('');
  const [decrption, setDecrption] = useState('');
  const [image1, setImage1] = useState('');
  const [image2, setImage2] = useState('');

  const fetchHero = async () => {
    try {
      const res = await fetch('/api/hero');
      const json = await res.json();
      if (json.success) {
        const first: HeroRecord | undefined = (json.data || [])[0];
        if (first?.id) {
          setHeroId(first.id);
          setTitle1(first.Title1 || '');
          setTitle2(first.Title2 || '');
          setDecrption(first.decrption || '');
          setImage1(first.image1 || '');
          setImage2(first.image2 || '');
        } else {
          setHeroId(null);
        }
      }
    } catch (e) {
      console.error('Error fetching hero:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHero(); }, []);

  const handleUploadImage1 = async (imageUrls: string[]) => {
    const first = imageUrls?.[0];
    if (first) setImage1(first);
  };

  const handleUploadImage2 = async (imageUrls: string[]) => {
    const first = imageUrls?.[0];
    if (first) setImage2(first);
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const payload = { Title1, Title2, decrption, image1, image2 };

      const res = await fetch(heroId ? `/api/hero/${heroId}` : '/api/hero', {
        method: heroId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!json.success) throw new Error(json.error || 'Failed to save');

      // If this was a create, update local heroId.
      if (!heroId && json?.data?.id) setHeroId(json.data.id);

      alert('Hero saved successfully!');
    } catch (e) {
      console.error('Error saving hero:', e);
      alert('Error saving hero');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!heroId) return;
    if (!confirm('Are you sure you want to delete the hero content?')) return;
    try {
      const res = await fetch(`/api/hero/${heroId}`, { method: 'DELETE' });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Failed to delete');

      setHeroId(null);
      setTitle1('');
      setTitle2('');
      setDecrption('');
      setImage1('');
      setImage2('');

      alert('Hero deleted successfully!');
    } catch (e) {
      console.error('Error deleting hero:', e);
      alert('Error deleting hero');
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-64 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-300 rounded-lg h-64"></div>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Hero Management</h1>
          <p className="text-gray-600">Manage content for the home hero section</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8 space-y-5">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-3">Content Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title 1</label>
            <input
              value={Title1}
              onChange={(e) => setTitle1(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Enter Title1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title 2</label>
            <input
              value={Title2}
              onChange={(e) => setTitle2(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Enter Title2"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={decrption}
            onChange={(e) => setDecrption(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2.5 min-h-[100px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="Enter hero description"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-3 mb-5">Images</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-4">
            <h3 className="font-semibold text-gray-700 border-b border-gray-200 pb-2">Image 1</h3>
            <Upload onFilesUpload={handleUploadImage1} />
            {image1 && (
              <div className="relative w-full h-48 rounded-md overflow-hidden border">
                <Image src={image1} alt="Hero image 1" fill className="object-cover" />
              </div>
            )}
          </div>
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-4">
            <h3 className="font-semibold text-gray-700 border-b border-gray-200 pb-2">Image 2</h3>
            <Upload onFilesUpload={handleUploadImage2} />
            {image2 && (
              <div className="relative w-full h-48 rounded-md overflow-hidden border">
                <Image src={image2} alt="Hero image 2" fill className="object-cover" />
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
          {saving ? 'Saving...' : heroId ? 'Save Data' : 'Create Hero'}
        </button>

        {heroId && (
          <button
            onClick={handleDelete}
            className="bg-red-50 text-red-600 border border-red-200 px-6 py-2.5 rounded-md hover:bg-red-100 transition"
          >
            Delete Entire Section
          </button>
        )}
      </div>

      {!heroId && (
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">No Hero record yet — fill the form and click “Create Hero”.</p>
        </div>
      )}
    </div>
  );
}


