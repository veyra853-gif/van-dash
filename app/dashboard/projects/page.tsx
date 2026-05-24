"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { FaPlus, FaTrash } from 'react-icons/fa';
import Upload from '../../components/Upload';

interface ProjectsData {
  id: string;
  Title: string;
  Descrption: string;
  C1Title: string;
  C1Descrption: string;
  C1Points: string[];
  C1Images: string[];
  C2Title: string;
  C2Descrption: string;
  C2Points: string[];
  C2Images: string[];
  C3Title: string;
  C3Descrption: string;
  C3Points: string[];
  C3Images: string[];
  C4Title: string;
  C4Descrption: string;
  C4Points: string[];
  C4Images: string[];
}

export default function ProjectsManagement() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [recordId, setRecordId] = useState<string | null>(null);
  
  // Header state
  const [Title, setTitle] = useState('');
  const [Descrption, setDescrption] = useState('');
  
  // Card 1
  const [C1Title, setC1Title] = useState('');
  const [C1Descrption, setC1Descrption] = useState('');
  const [C1Points, setC1Points] = useState<string[]>([]);
  const [C1Images, setC1Images] = useState<string[]>([]);
  
  // Card 2
  const [C2Title, setC2Title] = useState('');
  const [C2Descrption, setC2Descrption] = useState('');
  const [C2Points, setC2Points] = useState<string[]>([]);
  const [C2Images, setC2Images] = useState<string[]>([]);
  
  // Card 3
  const [C3Title, setC3Title] = useState('');
  const [C3Descrption, setC3Descrption] = useState('');
  const [C3Points, setC3Points] = useState<string[]>([]);
  const [C3Images, setC3Images] = useState<string[]>([]);

  // Card 4
  const [C4Title, setC4Title] = useState('');
  const [C4Descrption, setC4Descrption] = useState('');
  const [C4Points, setC4Points] = useState<string[]>([]);
  const [C4Images, setC4Images] = useState<string[]>([]);

  const fetchRecord = async () => {
    try {
      const res = await fetch('/api/projects');
      const json = await res.json();
      if (json.success) {
        const first: ProjectsData | undefined = (json.data || [])[0];
        if (first?.id) {
          setRecordId(first.id);
          setTitle(first.Title || '');
          setDescrption(first.Descrption || '');
          
          setC1Title(first.C1Title || '');
          setC1Descrption(first.C1Descrption || '');
          setC1Points(first.C1Points || []);
          setC1Images(first.C1Images || []);

          setC2Title(first.C2Title || '');
          setC2Descrption(first.C2Descrption || '');
          setC2Points(first.C2Points || []);
          setC2Images(first.C2Images || []);

          setC3Title(first.C3Title || '');
          setC3Descrption(first.C3Descrption || '');
          setC3Points(first.C3Points || []);
          setC3Images(first.C3Images || []);

          setC4Title(first.C4Title || '');
          setC4Descrption(first.C4Descrption || '');
          setC4Points(first.C4Points || []);
          setC4Images(first.C4Images || []);
        } else {
          setRecordId(null);
        }
      }
    } catch (e) {
      console.error('Error fetching Projects records:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRecord(); }, []);

  // Generic Point Handlers
  const handleAddPoint = (setPointsFunc: any, pointsArray: string[]) => {
    setPointsFunc([...pointsArray, '']);
  };

  const handleRemovePoint = (index: number, setPointsFunc: any, pointsArray: string[]) => {
    const newArr = [...pointsArray];
    newArr.splice(index, 1);
    setPointsFunc(newArr);
  };

  const handlePointChange = (index: number, value: string, setPointsFunc: any, pointsArray: string[]) => {
    const newArr = [...pointsArray];
    newArr[index] = value;
    setPointsFunc(newArr);
  };

  const handleRemoveImage = (index: number, imagesArray: string[], setImagesFunc: any) => {
    const newArr = [...imagesArray];
    newArr.splice(index, 1);
    setImagesFunc(newArr);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      const payload = {
        Title, Descrption,
        C1Title, C1Descrption,
        C1Points: C1Points.map(p => p.trim()).filter(Boolean),
        C1Images,
        C2Title, C2Descrption,
        C2Points: C2Points.map(p => p.trim()).filter(Boolean),
        C2Images,
        C3Title, C3Descrption,
        C3Points: C3Points.map(p => p.trim()).filter(Boolean),
        C3Images,
        C4Title, C4Descrption,
        C4Points: C4Points.map(p => p.trim()).filter(Boolean),
        C4Images,
      };

      const res = await fetch(recordId ? `/api/projects/${recordId}` : '/api/projects', {
        method: recordId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!json.success) throw new Error(json.error || 'Failed to save');

      if (!recordId && json?.data?.id) {
        setRecordId(json.data.id);
      }
      
      setC1Points(payload.C1Points);
      setC2Points(payload.C2Points);
      setC3Points(payload.C3Points);
      setC4Points(payload.C4Points);

      alert('Projects section saved successfully!');
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
      const res = await fetch(`/api/projects/${recordId}`, { method: 'DELETE' });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Failed to delete');

      setRecordId(null);
      setTitle(''); setDescrption('');
      
      setC1Title(''); setC1Descrption(''); setC1Points([]); setC1Images([]);
      setC2Title(''); setC2Descrption(''); setC2Points([]); setC2Images([]);
      setC3Title(''); setC3Descrption(''); setC3Points([]); setC3Images([]);
      setC4Title(''); setC4Descrption(''); setC4Points([]); setC4Images([]);

      alert('Section deleted successfully!');
    } catch (e) {
      console.error('Error deleting section:', e);
      alert('Error deleting section');
    }
  };

  const renderCardEditor = (
    label: string,
    titleValue: string, setTitleFunc: any,
    descValue: string, setDescFunc: any,
    pointsValue: string[], setPointsFunc: any,
    imagesValue: string[], setImagesFunc: any,
  ) => {
    return (
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-4">
        <h3 className="font-semibold text-gray-700 border-b border-gray-200 pb-2">{label}</h3>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Title</label>
          <input
            value={titleValue}
            onChange={(e) => setTitleFunc(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="e.g. System Integration"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
          <textarea
            value={descValue}
            onChange={(e) => setDescFunc(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 text-sm min-h-[60px] focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="..."
          />
        </div>

        {/* Images */}
        <div className="border-t pt-3">
          <label className="block text-xs font-medium text-gray-600 mb-2">Card Images</label>
          {imagesValue.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-3">
              {imagesValue.map((url, idx) => (
                <div key={idx} className="relative">
                  <Image
                    src={url}
                    alt={`Card image ${idx + 1}`}
                    width={80}
                    height={60}
                    className="w-20 h-16 object-cover rounded border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx, imagesValue, setImagesFunc)}
                    className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow transition"
                    title="Remove image"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
          <Upload
            onFilesUpload={(urls: string[]) => setImagesFunc((prev: string[]) => [...prev, ...urls])}
          />
        </div>
        
        {/* Dynamic Points for Card */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-2 mt-4 border-t pt-3">Bullet Points</label>
          <div className="flex flex-col gap-2">
            {pointsValue.map((pt, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-xs text-gray-400 font-medium">{idx + 1}.</span>
                <input
                  value={pt}
                  onChange={(e) => handlePointChange(idx, e.target.value, setPointsFunc, pointsValue)}
                  className="flex-1 border border-gray-300 rounded p-1.5 text-xs focus:ring-1 focus:ring-blue-500 outline-none"
                  placeholder="Point detail..."
                />
                <button
                  onClick={() => handleRemovePoint(idx, setPointsFunc, pointsValue)}
                  className="text-gray-400 hover:text-red-500 p-1"
                  title="Remove"
                >
                  <FaTrash className="w-3 h-3" />
                </button>
              </div>
            ))}
            <button
              onClick={() => handleAddPoint(setPointsFunc, pointsValue)}
              className="mt-1 flex justify-center items-center gap-1 bg-white border border-gray-300 text-gray-600 py-1.5 rounded-md text-xs hover:bg-gray-100 transition"
            >
              <FaPlus className="w-2.5 h-2.5" /> Add Point
            </button>
          </div>
        </div>
      </div>
    );
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
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Projects</h1>
          <p className="text-gray-600">Manage the main headings, description, and exactly 4 project cards with images and bullet points.</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8 space-y-5">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-3">Header Details</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
            <input
              value={Title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="e.g. Featured Projects"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={Descrption}
              onChange={(e) => setDescrption(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2.5 min-h-[100px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Enter the main background description..."
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-3 mb-5">Project Cards</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {renderCardEditor("Card 1", C1Title, setC1Title, C1Descrption, setC1Descrption, C1Points, setC1Points, C1Images, setC1Images)}
          {renderCardEditor("Card 2", C2Title, setC2Title, C2Descrption, setC2Descrption, C2Points, setC2Points, C2Images, setC2Images)}
          {renderCardEditor("Card 3", C3Title, setC3Title, C3Descrption, setC3Descrption, C3Points, setC3Points, C3Images, setC3Images)}
          {renderCardEditor("Card 4", C4Title, setC4Title, C4Descrption, setC4Descrption, C4Points, setC4Points, C4Images, setC4Images)}
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

