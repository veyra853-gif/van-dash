'use client';

import { useState, useEffect } from 'react';

// Fixed list of Lebanese Governorates
const VALID_GOVERNORATES = [
  'Beirut',
  'Mount Lebanon',
  'North Lebanon',
  'South Lebanon',
  'Bekaa',
  'Nabatieh',
  'Akkar',
  'Baalbek-Hermel'
];

export default function DeliveryPage() {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPrices, setEditingPrices] = useState({});
  const [saving, setSaving] = useState({});
  const [selectedGovernorate, setSelectedGovernorate] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/delivery');
      if (response.ok) {
        const data = await response.json();
        setDeliveries(data);
        // Initialize editing prices with current prices
        const initialPrices = {};
        data.forEach((delivery) => {
          initialPrices[delivery.id] = delivery.price.toString();
        });
        setEditingPrices(initialPrices);
      } else {
        const errorData = await response.json();
        console.error('Error fetching deliveries:', errorData);
        alert(`Failed to fetch deliveries: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error fetching deliveries:', error);
      alert(`Error fetching deliveries: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePriceChange = (id, value) => {
    setEditingPrices({
      ...editingPrices,
      [id]: value
    });
  };

  const handleAddDelivery = async () => {
    if (!selectedGovernorate || !newPrice) {
      alert('Please select a governorate and enter a price');
      return;
    }

    const price = parseFloat(newPrice);
    if (isNaN(price) || price < 0) {
      alert('Please enter a valid positive number for price');
      return;
    }

    try {
      setAdding(true);
      const response = await fetch('/api/delivery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ governorate: selectedGovernorate, price }),
      });

      if (response.ok) {
        const result = await response.json();
        alert('Delivery added successfully');
        // Reset form
        setSelectedGovernorate('');
        setNewPrice('');
        // Refresh deliveries list
        await fetchDeliveries();
      } else {
        const errorData = await response.json();
        alert(`Failed to add delivery: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error adding delivery:', error);
      alert(`Error adding delivery: ${error.message}`);
    } finally {
      setAdding(false);
    }
  };

  const handleSave = async (id) => {
    const price = parseFloat(editingPrices[id]);
    
    if (isNaN(price) || price < 0) {
      alert('Please enter a valid positive number for price');
      return;
    }

    try {
      setSaving({ ...saving, [id]: true });
      const response = await fetch(`/api/delivery/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price }),
      });

      if (response.ok) {
        const result = await response.json();
        alert('Price updated successfully');
        // Update the local state with the new price
        setDeliveries(deliveries.map(d => 
          d.id === id ? { ...d, price: result.data.price } : d
        ));
      } else {
        const errorData = await response.json();
        alert(`Failed to update price: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating delivery:', error);
      alert(`Error updating delivery: ${error.message}`);
    } finally {
      setSaving({ ...saving, [id]: false });
    }
  };

  // Get list of already saved governorates
  const savedGovernorates = deliveries.map(d => d.governorate);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-4">
        <p>Loading deliveries...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-2 sm:p-4 text-sm">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl sm:text-2xl font-bold">Delivery Pricing</h1>
      </div>

      {/* Add New Delivery Form */}
      <div className="bg-gray-100 border p-3 sm:p-4 rounded mb-6">
        <h2 className="text-base sm:text-lg font-bold mb-4">Add New Delivery</h2>
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1 w-full sm:w-auto">
            <label className="block font-medium mb-1">Governorate *</label>
            <select
              value={selectedGovernorate}
              onChange={(e) => setSelectedGovernorate(e.target.value)}
              className="w-full border p-2 rounded"
              disabled={adding}
            >
              <option value="">Select a governorate</option>
              {VALID_GOVERNORATES.map((gov) => (
                <option
                  key={gov}
                  value={gov}
                  disabled={savedGovernorates.includes(gov)}
                >
                  {gov} {savedGovernorates.includes(gov) ? '(Already added)' : ''}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1 w-full sm:w-auto">
            <label className="block font-medium mb-1">Price ($) *</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              className="w-full border p-2 rounded"
              placeholder="Enter price"
              disabled={adding}
            />
          </div>
          <div className="w-full sm:w-auto">
            <button
              onClick={handleAddDelivery}
              disabled={adding || !selectedGovernorate || !newPrice || savedGovernorates.includes(selectedGovernorate)}
              className="w-full sm:w-auto bg-blue-500 text-white px-6 py-2 rounded disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
            >
              {adding ? 'Adding...' : 'Add'}
            </button>
          </div>
        </div>
      </div>

      {/* Delivery Pricing Table */}
      <h2 className="text-base sm:text-lg font-bold mb-4">Delivery Pricing</h2>
      
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-200 mb-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Governorate</th>
              <th className="border p-2 text-left">Price ($)</th>
              <th className="border p-2 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {deliveries.length === 0 ? (
              <tr>
                <td colSpan={3} className="border p-4 text-center text-gray-500">
                  No deliveries found
                </td>
              </tr>
            ) : (
              deliveries.map((delivery) => (
                <tr key={delivery.id}>
                  <td className="border p-2 font-medium">{delivery.governorate}</td>
                  <td className="border p-2">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={editingPrices[delivery.id] || ''}
                      onChange={(e) => handlePriceChange(delivery.id, e.target.value)}
                      className="w-full border p-2 rounded"
                      disabled={saving[delivery.id]}
                    />
                  </td>
                  <td className="border p-2">
                    <button
                      onClick={() => handleSave(delivery.id)}
                      disabled={saving[delivery.id]}
                      className="bg-green-500 text-white px-4 py-2 rounded disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-green-600 transition-colors"
                    >
                      {saving[delivery.id] ? 'Saving...' : 'Save'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {deliveries.length === 0 ? (
          <div className="text-center text-gray-500 p-4 border border-gray-200 rounded">
            No deliveries found
          </div>
        ) : (
          deliveries.map((delivery) => (
            <div key={delivery.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <div className="mb-3">
                <label className="block font-semibold text-sm mb-1">Governorate</label>
                <div className="text-base">{delivery.governorate}</div>
              </div>
              <div className="mb-3">
                <label className="block font-semibold text-sm mb-1">Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={editingPrices[delivery.id] || ''}
                  onChange={(e) => handlePriceChange(delivery.id, e.target.value)}
                  className="w-full border p-2 rounded"
                  disabled={saving[delivery.id]}
                />
              </div>
              <button
                onClick={() => handleSave(delivery.id)}
                disabled={saving[delivery.id]}
                className="w-full bg-green-500 text-white px-4 py-2 rounded disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-green-600 transition-colors"
              >
                {saving[delivery.id] ? 'Saving...' : 'Save'}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

