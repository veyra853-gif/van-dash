'use client';

import { useState, useEffect } from 'react';
import Upload from '../../components/Upload';

export default function CategoriesTable() {
  const [categories, setCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const response = await fetch('/api/categories');
    if (response.ok) {
      const data = await response.json();
      setCategories(data);
    }
  };

  const handleUpdate = async (updatedCategory) => {
    const response = await fetch(`/api/categories/${updatedCategory.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        description: updatedCategory.description,
        image: updatedCategory.image,
      }),
    });

    if (response.ok) {
      setEditingCategory(null);
      fetchCategories();
    } else {
      const error = await response.json();
      alert('Error updating category: ' + (error.error || 'Unknown error'));
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-2 sm:p-4 text-sm">
      {editingCategory && (
        <EditCategoryForm
          category={editingCategory}
          onCancel={() => setEditingCategory(null)}
          onSave={handleUpdate}
        />
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
        <h1 className="text-xl sm:text-2xl font-bold">Categories</h1>
        <a
          href="/categories"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors w-full sm:w-auto text-center"
        >
          Add Category
        </a>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-200 mb-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Name</th>
              <th className="border p-2 text-left">Description</th>
              <th className="border p-2 text-left">Image</th>
              <th className="border p-2 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {categories.map((category) => (
              <tr key={category.id}>
                <td className="border p-2">{category.name}</td>
                <td className="border p-2">{category.description || '-'}</td>
                <td className="border p-2">
                  {category.image && (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-16 h-16 object-cover"
                    />
                  )}
                </td>
                <td className="border p-2">
                  <button
                    onClick={() => setEditingCategory(category)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 transition-colors"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {categories.map((category) => (
          <div key={category.id} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
            <div className="flex items-start gap-4">
              {category.image && (
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-20 h-20 object-cover rounded flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base mb-1">{category.name}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {category.description || 'No description'}
                </p>
                <button
                  onClick={() => setEditingCategory(category)}
                  className="bg-yellow-500 text-white px-3 py-1.5 rounded text-sm hover:bg-yellow-600 transition-colors w-full sm:w-auto"
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EditCategoryForm({ category, onCancel, onSave }) {
  const [description, setDescription] = useState(category.description || '');
  const [image, setImage] = useState(category.image || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...category,
      description,
      image,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="text-sm border p-4 bg-gray-100 rounded mb-6"
    >
      <h2 className="text-xl font-bold mb-4">Edit Category</h2>

      {/* Name (Disabled) */}
      <div className="mb-4">
        <label className="block font-medium">Name</label>
        <input
          type="text"
          value={category.name}
          disabled
          className="w-full border p-2 bg-gray-200"
        />
        <p className="text-xs text-gray-500 mt-1">Name cannot be edited</p>
      </div>

      {/* Description */}
      <div className="mb-4">
        <label className="block font-medium">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-2 h-28 resize-y"
        />
      </div>

      {/* Image Upload */}
      <div className="mb-4">
        <label className="block font-medium mb-2">Image</label>
        <Upload onFilesUpload={(urls) => {
          if (Array.isArray(urls) && urls.length > 0) {
            setImage(urls[0]);
          } else if (typeof urls === 'string') {
            setImage(urls);
          }
        }} />
        {image && (
          <div className="mt-2">
            <img
              src={image}
              alt="Category"
              className="w-32 h-32 object-cover border rounded"
            />
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-2 mt-4">
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}




