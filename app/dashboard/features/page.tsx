"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Upload from '../../components/Upload';

interface FeaturesRecord {
  id: string;
  Title: string;
  descrption: string;
  card1Title: string;
  card1Descrption: string;
  card1Image: string;
  card2Title: string;
  card2Descrption: string;
  card2Image: string;
  card3Title: string;
  card3Descrption: string;
  card3Image: string;
}

export default function FeaturesManagement() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [featuresId, setFeaturesId] = useState<string | null>(null);
  const [Title, setTitle] = useState('');
  const [descrption, setDescrption] = useState('');
  const [card1Title, setCard1Title] = useState('');
  const [card1Descrption, setCard1Descrption] = useState('');
  const [card1Image, setCard1Image] = useState('');
  const [card2Title, setCard2Title] = useState('');
  const [card2Descrption, setCard2Descrption] = useState('');
  const [card2Image, setCard2Image] = useState('');
  const [card3Title, setCard3Title] = useState('');
  const [card3Descrption, setCard3Descrption] = useState('');
  const [card3Image, setCard3Image] = useState('');

  const fetchFeatures = async () => {
    try {
      const res = await fetch('/api/features');
      const json = await res.json();
      if (json.success) {
        const first: FeaturesRecord | undefined = (json.data || [])[0];
        if (first?.id) {
          setFeaturesId(first.id);
          setTitle(first.Title || '');
          setDescrption(first.descrption || '');
          setCard1Title(first.card1Title || '');
          setCard1Descrption(first.card1Descrption || '');
          setCard1Image(first.card1Image || '');
          setCard2Title(first.card2Title || '');
          setCard2Descrption(first.card2Descrption || '');
          setCard2Image(first.card2Image || '');
          setCard3Title(first.card3Title || '');
          setCard3Descrption(first.card3Descrption || '');
          setCard3Image(first.card3Image || '');
        } else {
          setFeaturesId(null);
        }
      }
    } catch (e) {
      console.error('Error fetching features:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeatures();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      const payload = {
        Title,
        descrption,
        card1Title,
        card1Descrption,
        card1Image,
        card2Title,
        card2Descrption,
        card2Image,
        card3Title,
        card3Descrption,
        card3Image,
      };

      const res = await fetch(featuresId ? `/api/features/${featuresId}` : '/api/features', {
        method: featuresId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Failed to save features');

      if (!featuresId && json?.data?.id) setFeaturesId(json.data.id);

      alert('Features saved successfully!');
    } catch (e) {
      console.error('Error saving features:', e);
      alert('Error saving features');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!featuresId) return;
    if (!confirm('Are you sure you want to delete the features content?')) return;
    try {
      const res = await fetch(`/api/features/${featuresId}`, { method: 'DELETE' });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Failed to delete features');

      setFeaturesId(null);
      setTitle('');
      setDescrption('');
      setCard1Title('');
      setCard1Descrption('');
      setCard1Image('');
      setCard2Title('');
      setCard2Descrption('');
      setCard2Image('');
      setCard3Title('');
      setCard3Descrption('');
      setCard3Image('');

      alert('Features deleted successfully!');
    } catch (e) {
      console.error('Error deleting features:', e);
      alert('Error deleting features');
    }
  };

  const setFirstIfPresent = (setter: (v: string) => void) => (urls: string[]) => {
    const first = urls?.[0];
    if (first) setter(first);
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-64 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-300 rounded-lg h-40"></div>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Features Management</h1>
          <p className="text-gray-600">Manage the homepage features content (title, description, and three cards)</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8 space-y-5">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-3">Section Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              value={Title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Features section title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input
              value={descrption}
              onChange={(e) => setDescrption(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Short description"
            />
            <p className="text-xs text-gray-500 mt-1">Saved as <code>descrption</code> in the database.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'Card 1',
              titleValue: card1Title,
              setTitle: setCard1Title,
              descrValue: card1Descrption,
              setDescr: setCard1Descrption,
              imageValue: card1Image,
              setImage: setFirstIfPresent(setCard1Image),
            },
            {
              title: 'Card 2',
              titleValue: card2Title,
              setTitle: setCard2Title,
              descrValue: card2Descrption,
              setDescr: setCard2Descrption,
              imageValue: card2Image,
              setImage: setFirstIfPresent(setCard2Image),
            },
            {
              title: 'Card 3',
              titleValue: card3Title,
              setTitle: setCard3Title,
              descrValue: card3Descrption,
              setDescr: setCard3Descrption,
              imageValue: card3Image,
              setImage: setFirstIfPresent(setCard3Image),
            },
          ].map((card) => (
            <div key={card.title} className="p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-4">
              <h3 className="font-semibold text-gray-700 border-b border-gray-200 pb-2">{card.title}</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  value={card.titleValue}
                  onChange={(e) => card.setTitle(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder={`${card.title} title`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={card.descrValue}
                  onChange={(e) => card.setDescr(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 text-sm min-h-[80px] focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder={`${card.title} description`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                <Upload onFilesUpload={card.setImage} />
                {card.imageValue && (
                  <div className="relative w-full h-40 rounded-md overflow-hidden border mt-2">
                    <Image src={card.imageValue} alt={`${card.title} image`} fill className="object-cover" />
                  </div>
                )}
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
          {saving ? 'Saving...' : featuresId ? 'Update Features' : 'Create Features'}
        </button>

        {featuresId && (
          <button
            onClick={handleDelete}
            className="bg-red-50 text-red-600 border border-red-200 px-6 py-2.5 rounded-md hover:bg-red-100 transition"
          >
            Delete Features
          </button>
        )}
      </div>

      {!featuresId && (
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">No Features record yet — fill the form and click “Create Features”.</p>
        </div>
      )}
    </div>
  );
}
