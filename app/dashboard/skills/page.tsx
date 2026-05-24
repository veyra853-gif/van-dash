"use client";

import { useEffect, useState } from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';

interface SkillsRecord {
  id: string;
  title: string;
  description: string;
  skills: string[];
}

export default function SkillsManagement() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [skillsId, setSkillsId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [skills, setSkills] = useState<string[]>([]);

  const fetchSkills = async () => {
    try {
      const res = await fetch('/api/skills');
      const json = await res.json();
      if (json.success) {
        // Typically grabbing the very first layout settings
        const first: SkillsRecord | undefined = (json.data || [])[0];
        if (first?.id) {
          setSkillsId(first.id);
          setTitle(first.title || '');
          setDescription(first.description || '');
          setSkills(first.skills || []);
        } else {
          setSkillsId(null);
        }
      }
    } catch (e) {
      console.error('Error fetching skills:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSkills(); }, []);

  const handleAddSkill = () => {
    setSkills([...skills, '']);
  };

  const handleRemoveSkill = (index: number) => {
    const newSkills = [...skills];
    newSkills.splice(index, 1);
    setSkills(newSkills);
  };

  const handleSkillChange = (index: number, value: string) => {
    const newSkills = [...skills];
    newSkills[index] = value;
    setSkills(newSkills);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Clear out any completely blank empty skills out of cleanliness
      const cleanedSkills = skills.map(s => s.trim()).filter(Boolean);
      
      const payload = { title, description, skills: cleanedSkills };

      const res = await fetch(skillsId ? `/api/skills/${skillsId}` : '/api/skills', {
        method: skillsId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!json.success) throw new Error(json.error || 'Failed to save');

      // Refresh to get the exact data saved from DB
      if (!skillsId && json?.data?.id) {
        setSkillsId(json.data.id);
        fetchSkills(); 
      } else {
        setSkills(cleanedSkills);
      }

      alert('Skills section saved successfully!');
    } catch (e) {
      console.error('Error saving skills:', e);
      alert('Error saving skills');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!skillsId) return;
    if (!confirm('Are you sure you want to delete the whole skills section?')) return;
    try {
      const res = await fetch(`/api/skills/${skillsId}`, { method: 'DELETE' });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Failed to delete');

      setSkillsId(null);
      setTitle('');
      setDescription('');
      setSkills([]);

      alert('Skills deleted successfully!');
    } catch (e) {
      console.error('Error deleting skills:', e);
      alert('Error deleting skills');
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Skills Management</h1>
          <p className="text-gray-600">Manage the title, description, and list of specific skills.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleAddSkill}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
          >
            <FaPlus className="w-4 h-4" />
            Add New Skill
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
              placeholder="e.g. Our Core Capabilities"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2.5 min-h-[100px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Enter a brief background or subtitle for the skills section"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-3 mb-5">List of Skills ({skills.length})</h2>
        
        {skills.length === 0 ? (
          <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg p-10 text-center">
            <p className="text-gray-500 mb-4">No individual skills added yet.</p>
            <button
              onClick={handleAddSkill}
              className="inline-flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition"
            >
              <FaPlus className="w-4 h-4" />
              Add First Skill
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {skills.map((skill, index) => (
              <div key={index} className="flex items-center gap-3">
                <span className="font-semibold text-sm text-gray-400 w-6 text-right">
                  {index + 1}.
                </span>
                <input
                  value={skill}
                  onChange={(e) => handleSkillChange(index, e.target.value)}
                  className="flex-1 border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none transition"
                  placeholder="e.g. Strategic Planning"
                />
                <button
                  onClick={() => handleRemoveSkill(index)}
                  className="flex-shrink-0 text-gray-400 hover:text-red-500 transition-colors p-2"
                  title="Remove Skill"
                >
                  <FaTrash className="w-4 h-4" />
                </button>
              </div>
            ))}
            
            <button
              onClick={handleAddSkill}
              className="mt-3 inline-flex items-center gap-2 text-sm text-green-600 hover:text-green-700 font-medium pl-9"
            >
              <FaPlus className="w-3 h-3" />
              Add another skill
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
          {saving ? 'Saving...' : skillsId ? 'Save Skills Data' : 'Create Skills Section'}
        </button>

        {skillsId && (
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
