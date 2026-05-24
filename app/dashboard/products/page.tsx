'use client';

import { useState, useEffect } from 'react';
import Upload from '../../components/Upload';

const VALID_CATEGORIES = ['Rings', 'Earrings', 'Bracelets', 'Necklaces', 'Brooch'];

// Helper function to generate slug from title
function generateSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function ProductsTable() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        const errorData = await response.json();
        console.error('Error fetching products:', errorData);
        alert(`Failed to fetch products: ${errorData.error || errorData.details || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      alert(`Error fetching products: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`/api/products/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          fetchProducts();
          alert('Product deleted successfully');
        } else {
          const errorData = await response.json();
          alert(`Failed to delete product: ${errorData.error || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        alert(`Error deleting product: ${error.message}`);
      }
    }
  };

  const handleCreate = async (productData) => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        setShowCreateForm(false);
        fetchProducts();
        alert('Product created successfully');
      } else {
        const errorData = await response.json();
        alert(`Failed to create product: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error creating product:', error);
      alert(`Error creating product: ${error.message}`);
    }
  };

  const handleUpdate = async (id, productData) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        setEditingProduct(null);
        fetchProducts();
        alert('Product updated successfully');
      } else {
        const errorData = await response.json();
        alert(`Failed to update product: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert(`Error updating product: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-4">
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 text-sm">
      {showCreateForm && (
        <CreateProductForm
          onCancel={() => setShowCreateForm(false)}
          onSave={handleCreate}
        />
      )}

      {editingProduct && (
        <EditProductForm
          product={editingProduct}
          onCancel={() => setEditingProduct(null)}
          onSave={(data) => handleUpdate(editingProduct.id, data)}
        />
      )}

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Products</h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Product
        </button>
      </div>

      <table className="table-auto w-full border-collapse border border-gray-200 mb-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Image</th>
            <th className="border p-2">Title</th>
            <th className="border p-2">Category</th>
            <th className="border p-2">Price</th>
            <th className="border p-2">Stock</th>
            <th className="border p-2">Featured</th>
            <th className="border p-2">On Sale</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan={8} className="border p-4 text-center text-gray-500">
                No products found
              </td>
            </tr>
          ) : (
            products.map((product) => (
              <tr key={product.id}>
                <td className="border p-2">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-16 h-16 object-cover"
                    />
                  ) : (
                    <span className="text-gray-400">No image</span>
                  )}
                </td>
                <td className="border p-2">{product.title}</td>
                <td className="border p-2">{product.category || '-'}</td>
                <td className="border p-2">
                  {product.enableSale && product.salePrice ? (
                    <div>
                      <span className="line-through text-gray-400">${product.price}</span>
                      <span className="ml-2 text-red-600 font-bold">${product.salePrice}</span>
                    </div>
                  ) : (
                    `$${product.price}`
                  )}
                </td>
                <td className="border p-2">{product.stock}</td>
                <td className="border p-2">
                  {product.isFeatured ? (
                    <span className="text-green-600 font-bold">Yes</span>
                  ) : (
                    <span className="text-gray-400">No</span>
                  )}
                </td>
                <td className="border p-2">
                  {product.enableSale ? (
                    <span className="text-red-600 font-bold">Yes</span>
                  ) : (
                    <span className="text-gray-400">No</span>
                  )}
                </td>
                <td className="border p-2">
                  <button
                    onClick={() => setEditingProduct(product)}
                    className="bg-yellow-500 text-white px-2 py-1 mr-2 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
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
  );
}

function CreateProductForm({ onCancel, onSave }) {
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [lengths, setLengths] = useState(['']);
  const [stock, setStock] = useState('');
  const [images, setImages] = useState([]);
  const [isFeatured, setIsFeatured] = useState(false);
  const [enableSale, setEnableSale] = useState(false);
  const [salePrice, setSalePrice] = useState('');
  const [saleEndDate, setSaleEndDate] = useState('');
  const [autoGenerateSlug, setAutoGenerateSlug] = useState(true);

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (autoGenerateSlug) {
      setSlug(generateSlug(newTitle));
    }
  };

  const handleSlugChange = (e) => {
    setSlug(e.target.value);
    setAutoGenerateSlug(false);
  };

  const handleImagesChange = (urls) => {
    if (Array.isArray(urls)) {
      setImages(urls);
    } else if (typeof urls === 'string') {
      setImages([urls]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!category || !title || !price || !stock || images.length === 0) {
      alert('Please fill in all required fields: category, title, price, stock, and at least one image');
      return;
    }

    const productData = {
      category,
      title,
      slug: slug || generateSlug(title),
      description: description || '',
      price: parseFloat(price),
      length: lengths.filter(l => l.trim() !== ''),
      stock: parseInt(stock, 10),
      images,
      isFeatured,
      enableSale,
      ...(enableSale && {
        salePrice: salePrice ? parseFloat(salePrice) : null,
        saleEndDate: saleEndDate || null,
      }),
    };

    onSave(productData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="text-sm border p-4 bg-gray-100 rounded mb-6"
    >
      <h2 className="text-xl font-bold mb-4">Create Product</h2>

      {/* Category */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Category *</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border p-2"
          required
        >
          <option value="">Select a category</option>
          {VALID_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Title */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Title *</label>
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          className="w-full border p-2"
          required
        />
      </div>

      {/* Slug */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Slug *</label>
        <input
          type="text"
          value={slug}
          onChange={handleSlugChange}
          className="w-full border p-2"
          required
        />
        <p className="text-xs text-gray-500 mt-1">Auto-generated from title. You can edit it manually.</p>
      </div>

      {/* Description */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-2 h-28 resize-y"
          rows={4}
        />
      </div>

      {/* Price */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Price *</label>
        <input
          type="number"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full border p-2"
          required
        />
      </div>

      {/* Length */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Lengths (optional)</label>
        {lengths.map((length, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              value={length}
              onChange={(e) => {
                const newLengths = [...lengths];
                newLengths[index] = e.target.value;
                setLengths(newLengths);
              }}
              placeholder="e.g., 16 inches"
              className="flex-1 border p-2"
            />
            {lengths.length > 1 && (
              <button
                type="button"
                onClick={() => {
                  setLengths(lengths.filter((_, i) => i !== index));
                }}
                className="bg-red-500 text-white px-3 py-2 rounded"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => setLengths([...lengths, ''])}
          className="bg-blue-500 text-white px-3 py-2 rounded text-sm"
        >
          + Add Length
        </button>
      </div>

      {/* Stock */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Stock *</label>
        <input
          type="number"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          className="w-full border p-2"
          required
        />
      </div>

      {/* Images */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Images *</label>
        <Upload onFilesUpload={handleImagesChange} />
        {images.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Product image ${idx + 1}`}
                className="w-24 h-24 object-cover border rounded"
              />
            ))}
          </div>
        )}
      </div>

      {/* Is Featured */}
      <div className="mb-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
            className="w-5 h-5"
          />
          <span className="font-medium">Featured Product</span>
        </label>
      </div>

      {/* Enable Sale */}
      <div className="mb-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={enableSale}
            onChange={(e) => setEnableSale(e.target.checked)}
            className="w-5 h-5"
          />
          <span className="font-medium">Enable Sale</span>
        </label>
      </div>

      {/* Sale Price - only show when enableSale is true */}
      {enableSale && (
        <>
          <div className="mb-4">
            <label className="block font-medium mb-1">Sale Price</label>
            <input
              type="number"
              step="0.01"
              value={salePrice}
              onChange={(e) => setSalePrice(e.target.value)}
              className="w-full border p-2"
            />
          </div>

          <div className="mb-4">
            <label className="block font-medium mb-1">Sale End Date</label>
            <input
              type="datetime-local"
              value={saleEndDate}
              onChange={(e) => setSaleEndDate(e.target.value)}
              className="w-full border p-2"
            />
            <p className="text-xs text-gray-500 mt-1">Sale end time uses UTC.<br />In winter: subtract 2 hours from your local time.<br />In summer: subtract 3 hours from your local time.</p>
          </div>
        </>
      )}

      {/* Buttons */}
      <div className="flex gap-2 mt-4">
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Create Product
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

function EditProductForm({ product, onCancel, onSave }) {
  const [category, setCategory] = useState(product.category || '');
  const [title, setTitle] = useState(product.title || '');
  const [slug, setSlug] = useState(product.slug || '');
  const [description, setDescription] = useState(product.description || '');
  const [price, setPrice] = useState(product.price?.toString() || '');
  const [lengths, setLengths] = useState(
    Array.isArray(product.length) 
      ? product.length.length > 0 ? product.length : [''] 
      : product.length ? [product.length] : ['']
  );
  const [stock, setStock] = useState(product.stock?.toString() || '');
  const [images, setImages] = useState(product.images || []);
  const [isFeatured, setIsFeatured] = useState(product.isFeatured || false);
  const [enableSale, setEnableSale] = useState(product.enableSale || false);
  const [salePrice, setSalePrice] = useState(product.salePrice?.toString() || '');
  const [saleEndDate, setSaleEndDate] = useState(
    product.saleEndDate ? new Date(product.saleEndDate).toISOString().slice(0, 16) : ''
  );
  const [autoGenerateSlug, setAutoGenerateSlug] = useState(false);

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (autoGenerateSlug) {
      setSlug(generateSlug(newTitle));
    }
  };

  const handleSlugChange = (e) => {
    setSlug(e.target.value);
    setAutoGenerateSlug(false);
  };

  const handleImagesChange = (urls) => {
    if (Array.isArray(urls)) {
      setImages(urls);
    } else if (typeof urls === 'string') {
      setImages([urls]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!category || !title || !price || !stock || images.length === 0) {
      alert('Please fill in all required fields: category, title, price, stock, and at least one image');
      return;
    }

    const productData = {
      category,
      title,
      slug,
      description: description || '',
      price: parseFloat(price),
      length: lengths.filter(l => l.trim() !== ''),
      stock: parseInt(stock, 10),
      images,
      isFeatured,
      enableSale,
      ...(enableSale && {
        salePrice: salePrice ? parseFloat(salePrice) : null,
        saleEndDate: saleEndDate || null,
      }),
    };

    onSave(productData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="text-sm border p-4 bg-gray-100 rounded mb-6"
    >
      <h2 className="text-xl font-bold mb-4">Edit Product</h2>

      {/* Category */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Category *</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border p-2"
          required
        >
          <option value="">Select a category</option>
          {VALID_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Title */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Title *</label>
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          className="w-full border p-2"
          required
        />
      </div>

      {/* Slug */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Slug *</label>
        <input
          type="text"
          value={slug}
          onChange={handleSlugChange}
          className="w-full border p-2"
          required
        />
        <div className="mt-1">
          <button
            type="button"
            onClick={() => {
              setSlug(generateSlug(title));
              setAutoGenerateSlug(true);
            }}
            className="text-xs text-blue-600 hover:underline"
          >
            Regenerate from title
          </button>
        </div>
      </div>

      {/* Description */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-2 h-28 resize-y"
          rows={4}
        />
      </div>

      {/* Price */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Price *</label>
        <input
          type="number"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full border p-2"
          required
        />
      </div>

      {/* Length */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Lengths (optional)</label>
        {lengths.map((length, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              value={length}
              onChange={(e) => {
                const newLengths = [...lengths];
                newLengths[index] = e.target.value;
                setLengths(newLengths);
              }}
              placeholder="e.g., 16 inches"
              className="flex-1 border p-2"
            />
            {lengths.length > 1 && (
              <button
                type="button"
                onClick={() => {
                  setLengths(lengths.filter((_, i) => i !== index));
                }}
                className="bg-red-500 text-white px-3 py-2 rounded"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => setLengths([...lengths, ''])}
          className="bg-blue-500 text-white px-3 py-2 rounded text-sm"
        >
          + Add Length
        </button>
      </div>

      {/* Stock */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Stock *</label>
        <input
          type="number"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          className="w-full border p-2"
          required
        />
      </div>

      {/* Images */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Images *</label>
        <Upload onFilesUpload={handleImagesChange} />
        {images.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {images.map((img, idx) => (
              <div key={idx} className="relative">
                <img
                  src={img}
                  alt={`Product image ${idx + 1}`}
                  className="w-24 h-24 object-cover border rounded"
                />
                <button
                  type="button"
                  onClick={() => setImages(images.filter((_, i) => i !== idx))}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 text-xs"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Is Featured */}
      <div className="mb-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
            className="w-5 h-5"
          />
          <span className="font-medium">Featured Product</span>
        </label>
      </div>

      {/* Enable Sale */}
      <div className="mb-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={enableSale}
            onChange={(e) => setEnableSale(e.target.checked)}
            className="w-5 h-5"
          />
          <span className="font-medium">Enable Sale</span>
        </label>
      </div>

      {/* Sale Price - only show when enableSale is true */}
      {enableSale && (
        <>
          <div className="mb-4">
            <label className="block font-medium mb-1">Sale Price</label>
            <input
              type="number"
              step="0.01"
              value={salePrice}
              onChange={(e) => setSalePrice(e.target.value)}
              className="w-full border p-2"
            />
          </div>

          <div className="mb-4">
            <label className="block font-medium mb-1">Sale End Date</label>
            <input
              type="datetime-local"
              value={saleEndDate}
              onChange={(e) => setSaleEndDate(e.target.value)}
              className="w-full border p-2"
            />
            <p className="text-xs text-gray-500 mt-1">Sale end time uses UTC.<br />In winter: subtract 2 hours from your local time.<br />In summer: subtract 3 hours from your local time.</p>
          </div>
        </>
      )}

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
