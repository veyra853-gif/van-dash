"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Upload from '../../components/Upload';
import { FaPlus, FaTrash } from 'react-icons/fa';

interface TestmonialCard {
  id?: string;
  comment: string;
  name: string;
  profilePic: string;
  role: string;
}

interface TestmonialRecord {
  id: string;
  title: string;
  description: string;
  cards: TestmonialCard[];
}

export default function TestmonialsManagement() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [testmonialId, setTestmonialId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [cards, setCards] = useState<TestmonialCard[]>([]);

  const fetchTestmonials = async () => {
    try {
      const res = await fetch('/api/testmonials');
      const json = await res.json();
      if (json.success) {
        const first: TestmonialRecord | undefined = (json.data || [])[0];
        if (first?.id) {
          setTestmonialId(first.id);
          setTitle(first.title || '');
          setDescription(first.description || '');
          setCards(first.cards || []);
        } else {
          setTestmonialId(null);
        }
      }
    } catch (e) {
      console.error('Error fetching testmonials:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTestmonials(); }, []);

  const handleAddCard = () => {
    setCards([
      ...cards,
      { comment: '', name: '', profilePic: '', role: '' }
    ]);
  };

  const handleRemoveCard = (index: number) => {
    const newCards = [...cards];
    newCards.splice(index, 1);
    setCards(newCards);
  };

  const handleCardChange = (index: number, field: keyof TestmonialCard, value: string) => {
    const newCards = [...cards];
    newCards[index] = { ...newCards[index], [field]: value };
    setCards(newCards);
  };

  const handleUploadProfilePic = (index: number, imageUrls: string[]) => {
    const first = imageUrls?.[0];
    if (first) {
      handleCardChange(index, 'profilePic', first);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Clean up cards (remove id if it exists, so Prisma can recreate them cleanly)
      const cleanedCards = cards.map(({ id, ...rest }) => rest);
      
      const payload = { title, description, cards: cleanedCards };

      const res = await fetch(testmonialId ? `/api/testmonials/${testmonialId}` : '/api/testmonials', {
        method: testmonialId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!json.success) throw new Error(json.error || 'Failed to save');

      // If this was a create, update local testmonialId
      if (!testmonialId && json?.data?.id) {
        setTestmonialId(json.data.id);
        // Refresh to get exactly what's grouped in DB
        fetchTestmonials(); 
      }

      alert('Testimonials saved successfully!');
    } catch (e) {
      console.error('Error saving testimonials:', e);
      alert('Error saving testimonials');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!testmonialId) return;
    if (!confirm('Are you sure you want to delete the testimonials section?')) return;
    try {
      const res = await fetch(`/api/testmonials/${testmonialId}`, { method: 'DELETE' });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Failed to delete');

      setTestmonialId(null);
      setTitle('');
      setDescription('');
      setCards([]);

      alert('Testimonials deleted successfully!');
    } catch (e) {
      console.error('Error deleting testimonials:', e);
      alert('Error deleting testimonials');
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
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Testimonials Management</h1>
          <p className="text-gray-600">Manage client reviews and testimonials section</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleAddCard}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
          >
            <FaPlus className="w-4 h-4" />
            Add Card
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8 space-y-5">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-3">Section Header</h2>
        
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="e.g. What Our Clients Say"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2.5 min-h-[100px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Enter subtitle or description for the testimonials section"
            />
          </div>
        </div>
      </div>

      <div className="space-y-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800">Testimonial Cards ({cards.length})</h2>
        
        {cards.length === 0 ? (
          <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg p-10 text-center">
            <p className="text-gray-500 mb-4">No testimonial cards added yet.</p>
            <button
              onClick={handleAddCard}
              className="inline-flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition"
            >
              <FaPlus className="w-3 h-3" />
              Add First Card
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cards.map((card, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 relative group">
                <button
                  onClick={() => handleRemoveCard(index)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                  title="Remove Card"
                >
                  <FaTrash className="w-4 h-4" />
                </button>
                
                <h3 className="font-medium text-gray-900 mb-4">Card #{index + 1}</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      value={card.name}
                      onChange={(e) => handleCardChange(index, 'name', e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2 text-sm"
                      placeholder="e.g. John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role / Company</label>
                    <input
                      value={card.role}
                      onChange={(e) => handleCardChange(index, 'role', e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2 text-sm"
                      placeholder="e.g. CEO, Vanguard Group"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
                    <textarea
                      value={card.comment}
                      onChange={(e) => handleCardChange(index, 'comment', e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2 text-sm min-h-[80px]"
                      placeholder="Enter their testimonial..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
                    <div className="flex items-start gap-4">
                      {card.profilePic ? (
                        <div className="relative w-16 h-16 rounded-full overflow-hidden border bg-gray-100 flex-shrink-0">
                          <Image src={card.profilePic} alt={card.name} fill className="object-cover" />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center flex-shrink-0">
                          <span className="text-gray-400 text-xs">No img</span>
                        </div>
                      )}
                      <div className="flex-1">
                        <Upload onFilesUpload={(urls) => handleUploadProfilePic(index, urls)} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-3 pt-4 border-t border-gray-200">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 text-white px-8 py-2.5 rounded-md hover:bg-blue-700 disabled:opacity-60 font-medium transition"
        >
          {saving ? 'Saving...' : testmonialId ? 'Save Testimonials' : 'Create Testimonials Section'}
        </button>

        {testmonialId && (
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
