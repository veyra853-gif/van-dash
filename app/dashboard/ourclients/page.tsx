"use client";

import { useEffect, useState } from "react";
import Upload from "../../components/Upload";

type OurClient = {
  id: string;
  images: string[];
};

type ClientsSection = {
  id: string;
  badgeLabel: string;
  title: string;
  description: string;
};

type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error?: string };

export default function OurClientsPage() {
  const [clients, setClients] = useState<OurClient[]>([]);
  const [loading, setLoading] = useState(true);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createImages, setCreateImages] = useState<string[]>([]);

  const [editingClient, setEditingClient] = useState<OurClient | null>(null);
  const [editImages, setEditImages] = useState<string[]>([]);

  // Clients Section states
  const [sectionLoading, setSectionLoading] = useState(true);
  const [sectionSaving, setSectionSaving] = useState(false);
  const [sectionId, setSectionId] = useState<string | null>(null);
  const [badgeLabel, setBadgeLabel] = useState('');
  const [sectionTitle, setSectionTitle] = useState('');
  const [description, setDescription] = useState('');

  const fetchClients = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/ourclients");
      const json = (await res.json()) as ApiResponse<OurClient[]>;

      if (!res.ok || !json.success) {
        alert(`Failed to fetch clients: ${("error" in json && json.error) || "Unknown error"}`);
        return;
      }

      setClients(Array.isArray(json.data) ? json.data : []);
    } catch (e) {
      const err = e as Error;
      alert(`Error fetching clients: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
    fetchSectionData();
  }, []);

  const fetchSectionData = async () => {
    try {
      setSectionLoading(true);
      const res = await fetch("/api/clients-section");
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        const first = json.data[0];
        setSectionId(first.id);
        setBadgeLabel(first.badgeLabel || '');
        setSectionTitle(first.title || '');
        setDescription(first.description || '');
      }
    } catch (e) {
      console.error('Error fetching section:', e);
    } finally {
      setSectionLoading(false);
    }
  };

  const handleCreateImagesUpload = (urls: string[] | string) => {
    const next = Array.isArray(urls) ? urls : [urls];
    setCreateImages((prev) => [...prev, ...next].filter(Boolean));
  };

  const handleEditImagesUpload = (urls: string[] | string) => {
    const next = Array.isArray(urls) ? urls : [urls];
    setEditImages((prev) => [...prev, ...next].filter(Boolean));
  };

  const handleCreate = async () => {
    if (createImages.length === 0) {
      alert("Please upload at least one image");
      return;
    }

    try {
      const res = await fetch("/api/ourclients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ images: createImages }),
      });
      const json = (await res.json()) as ApiResponse<OurClient>;

      if (!res.ok || !json.success) {
        alert(`Failed to create client: ${("error" in json && json.error) || "Unknown error"}`);
        return;
      }

      setShowCreateForm(false);
      setCreateImages([]);
      await fetchClients();
      alert("Client created successfully");
    } catch (e) {
      const err = e as Error;
      alert(`Error creating client: ${err.message}`);
    }
  };

  const startEdit = (client: OurClient) => {
    setEditingClient(client);
    setEditImages(Array.isArray(client.images) ? client.images : []);
  };

  const handleUpdate = async () => {
    if (!editingClient) return;
    if (editImages.length === 0) {
      alert("Please keep at least one image");
      return;
    }

    try {
      const res = await fetch(`/api/ourclients/${editingClient.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ images: editImages }),
      });
      const json = (await res.json()) as ApiResponse<OurClient>;

      if (!res.ok || !json.success) {
        alert(`Failed to update client: ${("error" in json && json.error) || "Unknown error"}`);
        return;
      }

      setEditingClient(null);
      setEditImages([]);
      await fetchClients();
      alert("Client updated successfully");
    } catch (e) {
      const err = e as Error;
      alert(`Error updating client: ${err.message}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this client?")) return;
    try {
      const res = await fetch(`/api/ourclients/${id}`, { method: "DELETE" });
      const json = (await res.json()) as ApiResponse<unknown> & { message?: string };

      if (!res.ok || ("success" in json && json.success === false)) {
        alert(`Failed to delete client: ${("error" in json && json.error) || "Unknown error"}`);
        return;
      }

      await fetchClients();
      alert(json.message || "Client deleted successfully");
    } catch (e) {
      const err = e as Error;
      alert(`Error deleting client: ${err.message}`);
    }
  };

  // Clients Section handlers
  const handleSaveSection = async () => {
    try {
      setSectionSaving(true);
      const payload = { badgeLabel, title: sectionTitle, description };

      const res = await fetch(sectionId ? `/api/clients-section/${sectionId}` : '/api/clients-section', {
        method: sectionId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Failed to save');
      if (!sectionId && json?.data?.id) setSectionId(json.data.id);

      alert('Section text saved successfully!');
    } catch (e) {
      console.error('Error saving section:', e);
      alert('Error saving section');
    } finally {
      setSectionSaving(false);
    }
  };

  const handleDeleteSection = async () => {
    if (!sectionId) return;
    if (!confirm('Are you sure you want to delete this section?')) return;
    try {
      const res = await fetch(`/api/clients-section/${sectionId}`, { method: 'DELETE' });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Failed to delete');

      setSectionId(null);
      setBadgeLabel('');
      setSectionTitle('');
      setDescription('');
      alert('Section deleted successfully!');
    } catch (e) {
      console.error('Error deleting section:', e);
      alert('Error deleting section');
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-4">
        <p>Loading clients...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {showCreateForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8 space-y-5">
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-3">Add Client</h2>

          <div className="mb-4">
            <label className="block font-medium mb-1">Images *</label>
            <Upload onFilesUpload={handleCreateImagesUpload} />
            {createImages.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {createImages.map((img, idx) => (
                  <div key={idx} className="relative">
                    <img
                      src={img}
                      alt={`Client image ${idx + 1}`}
                      className="w-24 h-24 object-cover border rounded"
                    />
                    <button
                      type="button"
                      onClick={() => setCreateImages(createImages.filter((_, i) => i !== idx))}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 text-xs"
                      aria-label="Remove image"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCreate}
              className="bg-blue-600 text-white px-8 py-2.5 rounded-md hover:bg-blue-700 font-medium transition"
            >
              Create
            </button>
            <button
              type="button"
              onClick={() => {
                setShowCreateForm(false);
                setCreateImages([]);
              }}
              className="bg-red-50 text-red-600 border border-red-200 px-6 py-2.5 rounded-md hover:bg-red-100 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {editingClient && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8 space-y-5">
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-3">Edit Client</h2>

          <div className="mb-4">
            <label className="block font-medium mb-1">Images *</label>
            <Upload onFilesUpload={handleEditImagesUpload} />
            {editImages.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {editImages.map((img, idx) => (
                  <div key={idx} className="relative">
                    <img
                      src={img}
                      alt={`Client image ${idx + 1}`}
                      className="w-24 h-24 object-cover border rounded"
                    />
                    <button
                      type="button"
                      onClick={() => setEditImages(editImages.filter((_, i) => i !== idx))}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 text-xs"
                      aria-label="Remove image"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleUpdate}
              className="bg-blue-600 text-white px-8 py-2.5 rounded-md hover:bg-blue-700 font-medium transition"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => {
                setEditingClient(null);
                setEditImages([]);
              }}
              className="bg-red-50 text-red-600 border border-red-200 px-6 py-2.5 rounded-md hover:bg-red-100 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Our Clients</h1>
          <p className="text-gray-600">Manage client logos and images</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 text-white px-8 py-2.5 rounded-md hover:bg-blue-700 font-medium transition"
        >
          Add Client
        </button>
      </div>

      {/* Desktop Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="hidden md:block overflow-x-auto">
          <table className="table-auto w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-3 text-left text-sm font-semibold text-gray-700">Preview</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700">Images</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-6 text-center text-gray-500">
                    No clients found
                  </td>
                </tr>
              ) : (
                clients.map((client) => (
                  <tr key={client.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-3">
                      {client.images?.[0] ? (
                        <img
                          src={client.images[0]}
                          alt="Client"
                          className="w-16 h-16 object-cover"
                        />
                      ) : (
                        <span className="text-gray-400">No image</span>
                      )}
                    </td>
                    <td className="p-3">
                      <span className="text-gray-700">{client.images?.length || 0}</span>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => startEdit(client)}
                        className="bg-blue-50 text-blue-600 border border-blue-200 px-4 py-1.5 mr-2 rounded-md hover:bg-blue-100 transition text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(client.id)}
                        className="bg-red-50 text-red-600 border border-red-200 px-4 py-1.5 rounded-md hover:bg-red-100 transition text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4 p-4">
          {clients.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              No clients found
            </div>
          ) : (
            clients.map((client) => (
              <div key={client.id} className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="flex items-start gap-4">
                  {client.images?.[0] ? (
                    <img
                      src={client.images[0]}
                      alt="Client"
                      className="w-20 h-20 object-cover rounded flex-shrink-0"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded bg-gray-100 flex items-center justify-center text-gray-400">
                      No image
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-700 mb-3">
                      <span className="font-semibold">Images:</span> {client.images?.length || 0}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(client)}
                        className="flex-1 bg-blue-50 text-blue-600 border border-blue-200 px-3 py-2 rounded-md text-sm hover:bg-blue-100 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(client.id)}
                        className="flex-1 bg-red-50 text-red-600 border border-red-200 px-3 py-2 rounded-md text-sm hover:bg-red-100 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Clients Section Text Editor */}
      <div className="mt-16 pt-8 border-t border-gray-200">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Section Text</h2>
          <p className="text-gray-600">Edit the text and copy for the "Our Clients" section header on the projects page.</p>
        </div>

        {sectionLoading ? (
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => <div key={i} className="bg-gray-300 rounded-lg h-24"></div>)}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
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
                value={sectionTitle}
                onChange={(e) => setSectionTitle(e.target.value)}
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

            <div className="flex flex-col md:flex-row gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={handleSaveSection}
                disabled={sectionSaving}
                className="bg-blue-600 text-white px-8 py-2.5 rounded-md hover:bg-blue-700 disabled:opacity-60 font-medium transition"
              >
                {sectionSaving ? 'Saving...' : sectionId ? 'Save Changes' : 'Create Section'}
              </button>

              {sectionId && (
                <button
                  onClick={handleDeleteSection}
                  className="bg-red-50 text-red-600 border border-red-200 px-6 py-2.5 rounded-md hover:bg-red-100 transition"
                >
                  Delete Section
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
