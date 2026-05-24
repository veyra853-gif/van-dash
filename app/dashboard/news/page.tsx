"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Upload from '../../components/Upload';

interface NewsRecord {
  id: string;
  card1Title: string;
  card1Date: string;
  card1Descrption: string;
  card1Image: string;
  card2Title: string;
  card2Date: string;
  card2Descrption: string;
  card2Image: string;
  card3Title: string;
  card3Date: string;
  card3Descrption: string;
  card3Image: string;
}

export default function NewsManagement() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [newsId, setNewsId] = useState<string | null>(null);

  const [card1Title, setCard1Title] = useState('');
  const [card1Date, setCard1Date] = useState('');
  const [card1Descrption, setCard1Descrption] = useState('');
  const [card1Image, setCard1Image] = useState('');

  const [card2Title, setCard2Title] = useState('');
  const [card2Date, setCard2Date] = useState('');
  const [card2Descrption, setCard2Descrption] = useState('');
  const [card2Image, setCard2Image] = useState('');

  const [card3Title, setCard3Title] = useState('');
  const [card3Date, setCard3Date] = useState('');
  const [card3Descrption, setCard3Descrption] = useState('');
  const [card3Image, setCard3Image] = useState('');

  const fetchNews = async () => {
    try {
      const res = await fetch('/api/news');
      const json = await res.json();
      if (json.success) {
        const first: NewsRecord | undefined = (json.data || [])[0];
        if (first?.id) {
          setNewsId(first.id);

          setCard1Title(first.card1Title || '');
          setCard1Date(first.card1Date || '');
          setCard1Descrption(first.card1Descrption || '');
          setCard1Image(first.card1Image || '');

          setCard2Title(first.card2Title || '');
          setCard2Date(first.card2Date || '');
          setCard2Descrption(first.card2Descrption || '');
          setCard2Image(first.card2Image || '');

          setCard3Title(first.card3Title || '');
          setCard3Date(first.card3Date || '');
          setCard3Descrption(first.card3Descrption || '');
          setCard3Image(first.card3Image || '');
        } else {
          setNewsId(null);
        }
      }
    } catch (e) {
      console.error('Error fetching news:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      const payload = {
        card1Title,
        card1Date,
        card1Descrption,
        card1Image,
        card2Title,
        card2Date,
        card2Descrption,
        card2Image,
        card3Title,
        card3Date,
        card3Descrption,
        card3Image,
      };

      const res = await fetch(newsId ? `/api/news/${newsId}` : '/api/news', {
        method: newsId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Failed to save news');

      if (!newsId && json?.data?.id) setNewsId(json.data.id);

      alert('News saved successfully!');
    } catch (e) {
      console.error('Error saving news:', e);
      alert('Error saving news');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!newsId) return;
    if (!confirm('Are you sure you want to delete the news content?')) return;
    try {
      const res = await fetch(`/api/news/${newsId}`, { method: 'DELETE' });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Failed to delete news');

      setNewsId(null);

      setCard1Title('');
      setCard1Date('');
      setCard1Descrption('');
      setCard1Image('');

      setCard2Title('');
      setCard2Date('');
      setCard2Descrption('');
      setCard2Image('');

      setCard3Title('');
      setCard3Date('');
      setCard3Descrption('');
      setCard3Image('');

      alert('News deleted successfully!');
    } catch (e) {
      console.error('Error deleting news:', e);
      alert('Error deleting news');
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

  const cards = [
    {
      label: 'Card 1',
      title: card1Title,
      setTitle: setCard1Title,
      date: card1Date,
      setDate: setCard1Date,
      descrption: card1Descrption,
      setDescrption: setCard1Descrption,
      image: card1Image,
      onUpload: setFirstIfPresent(setCard1Image),
    },
    {
      label: 'Card 2',
      title: card2Title,
      setTitle: setCard2Title,
      date: card2Date,
      setDate: setCard2Date,
      descrption: card2Descrption,
      setDescrption: setCard2Descrption,
      image: card2Image,
      onUpload: setFirstIfPresent(setCard2Image),
    },
    {
      label: 'Card 3',
      title: card3Title,
      setTitle: setCard3Title,
      date: card3Date,
      setDate: setCard3Date,
      descrption: card3Descrption,
      setDescrption: setCard3Descrption,
      image: card3Image,
      onUpload: setFirstIfPresent(setCard3Image),
    },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">News Management</h1>
          <p className="text-gray-600">Manage the homepage news content (3 cards)</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card) => (
            <div key={card.label} className="p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-4">
              <h3 className="font-semibold text-gray-700 border-b border-gray-200 pb-2">{card.label}</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  value={card.title}
                  onChange={(e) => card.setTitle(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder={`${card.label} title`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  value={card.date}
                  onChange={(e) => card.setDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder={`${card.label} date`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={card.descrption}
                  onChange={(e) => card.setDescrption(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 text-sm min-h-[90px] focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder={`${card.label} descrption`}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Saved as <code>cardXDescrption</code> in the database.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                <Upload onFilesUpload={card.onUpload} />
                {card.image && (
                  <div className="relative w-full h-40 rounded-md overflow-hidden border mt-2">
                    <Image src={card.image} alt={`${card.label} image`} fill className="object-cover" />
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
          {saving ? 'Saving...' : newsId ? 'Update News' : 'Create News'}
        </button>

        {newsId && (
          <button
            onClick={handleDelete}
            className="bg-red-50 text-red-600 border border-red-200 px-6 py-2.5 rounded-md hover:bg-red-100 transition"
          >
            Delete News
          </button>
        )}
      </div>

      {!newsId && (
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">No News record yet — fill the form and click “Create News”.</p>
        </div>
      )}
    </div>
  );
}

