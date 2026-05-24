"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Upload from '../../components/Upload';

interface AboutImage {
  id: string;
  image: string;
  alt?: string;
  title?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export default function AboutManagement() {
  const [images, setImages] = useState<AboutImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    alt: '',
    title: '',
    order: 0
  });

  const fetchImages = async () => {
    try {
      const response = await fetch('/api/about');
      const result = await response.json();
      
      if (result.success) {
        setImages(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching about images:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleUpload = async (imageUrls: string[]) => {
    try {
      setUploading(true);
      
      // رفع كل صورة على حدة
      for (let i = 0; i < imageUrls.length; i++) {
        const imageUrl = imageUrls[i];
        const response = await fetch('/api/about', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            image: imageUrl,
            alt: 'About image',
            title: '',
            order: images.length + i
          }),
        });

        const result = await response.json();
        
        if (!result.success) {
          console.error('Error uploading image:', result.error);
        }
      }
      
      await fetchImages(); // إعادة تحميل القائمة
      alert('Images uploaded successfully!');
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Error uploading images');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) {
      return;
    }

    try {
      const response = await fetch(`/api/about/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      
      if (result.success) {
        await fetchImages();
        alert('Image deleted successfully!');
      } else {
        alert('Error deleting image: ' + result.error);
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Error deleting image');
    }
  };

  const startEdit = (image: AboutImage) => {
    setEditingId(image.id);
    setEditForm({
      alt: image.alt || '',
      title: image.title || '',
      order: image.order
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ alt: '', title: '', order: 0 });
  };

  const handleUpdate = async (id: string) => {
    try {
      const response = await fetch(`/api/about/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      });

      const result = await response.json();
      
      if (result.success) {
        await fetchImages();
        setEditingId(null);
        alert('Image updated successfully!');
      } else {
        alert('Error updating image: ' + result.error);
      }
    } catch (error) {
      console.error('Error updating image:', error);
      alert('Error updating image');
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
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">About Images Management</h1>
        <p className="text-gray-600">Manage images for the About section</p>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Upload New Image</h2>
        <Upload 
          onFilesUpload={handleUpload}
        />
        {uploading && (
          <div className="mt-4 text-center text-blue-600">
            Uploading image...
          </div>
        )}
      </div>

      {/* Images Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image) => (
          <div key={image.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative h-48">
              <Image
                src={image.image}
                alt={image.alt || 'About image'}
                fill
                className="object-cover"
              />
            </div>
            
            <div className="p-4">
              {editingId === image.id ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Alt text"
                    value={editForm.alt}
                    onChange={(e) => setEditForm({...editForm, alt: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Title"
                    value={editForm.title}
                    onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Order"
                    value={editForm.order}
                    onChange={(e) => setEditForm({...editForm, order: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleUpdate(image.id)}
                      className="flex-1 bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="flex-1 bg-gray-600 text-white px-3 py-2 rounded-md hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {image.title || 'Untitled'}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {image.alt || 'No alt text'}
                  </p>
                  <p className="text-xs text-gray-500 mb-3">
                    Order: {image.order}
                  </p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => startEdit(image)}
                      className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(image.id)}
                      className="flex-1 bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 transition-colors text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {images.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No images uploaded yet</p>
          <p className="text-gray-400 text-sm">Upload your first About image above</p>
        </div>
      )}
    </div>
  );
}
