'use client';

import { useState, useEffect } from 'react';

interface OrderItem {
  productId: string;
  name: string;
  variant?: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  orderNumber: string;
  status: 'PENDING' | 'DELIVERED' | 'CANCELLED';
  customerName: string;
  customerPhone: string;
  country: string;
  governorate: string;
  district: string;
  city: string;
  streetName: string;
  buildingName?: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  deliveredAt?: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      } else {
        const errorData = await response.json();
        console.error('Error fetching orders:', errorData);
        alert(`Failed to fetch orders: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      alert(`Error fetching orders: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeliver = async (orderId: string) => {
    if (!confirm('Are you sure you want to mark this order as delivered? This will decrement product stock.')) {
      return;
    }

    try {
      setProcessing(orderId);
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'deliver' }),
      });

      if (response.ok) {
        const result = await response.json();
        alert('Order marked as delivered successfully');
        await fetchOrders(); // Refresh orders list
      } else {
        const errorData = await response.json();
        alert(`Failed to deliver order: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error delivering order:', error);
      alert(`Error delivering order: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setProcessing(null);
    }
  };

  const handleDelete = async (orderId: string) => {
    if (!confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      return;
    }

    try {
      setProcessing(orderId);
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'delete' }),
      });

      if (response.ok) {
        alert('Order deleted successfully');
        await fetchOrders(); // Refresh orders list
      } else {
        const errorData = await response.json();
        alert(`Failed to delete order: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      alert(`Error deleting order: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setProcessing(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  const getStatusBadge = (status: string) => {
    const statusStyles: Record<string, { bg: string; text: string }> = {
      PENDING: { bg: '#ffc107', text: '#000' },
      DELIVERED: { bg: '#28a745', text: '#fff' },
      CANCELLED: { bg: '#dc3545', text: '#fff' },
    };

    const style = statusStyles[status] || { bg: '#6c757d', text: '#fff' };

    return (
      <span
        style={{
          backgroundColor: style.bg,
          color: style.text,
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: 'bold',
        }}
      >
        {status}
      </span>
    );
  };

  const renderOrderDetails = (order: Order) => {
    const items = Array.isArray(order.items) ? order.items : [];
    
    return (
      <div className="bg-gray-50 p-4 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Customer Information */}
          <div className="bg-white p-3 rounded border border-gray-200">
            <h3 className="font-semibold text-sm mb-2 text-gray-700">Customer Information</h3>
            <div className="space-y-1 text-sm">
              <div><span className="font-medium">Name:</span> {order.customerName}</div>
              <div><span className="font-medium">Phone:</span> {order.customerPhone}</div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="bg-white p-3 rounded border border-gray-200">
            <h3 className="font-semibold text-sm mb-2 text-gray-700">Delivery Address</h3>
            <div className="space-y-1 text-sm">
              <div><span className="font-medium">Country:</span> {order.country}</div>
              <div><span className="font-medium">Governorate:</span> {order.governorate}</div>
              <div><span className="font-medium">District:</span> {order.district}</div>
              <div><span className="font-medium">City:</span> {order.city}</div>
              <div><span className="font-medium">Street:</span> {order.streetName}</div>
              {order.buildingName && (
                <div><span className="font-medium">Building:</span> {order.buildingName}</div>
              )}
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white p-3 rounded border border-gray-200 mb-4">
          <h3 className="font-semibold text-sm mb-3 text-gray-700">Order Items</h3>
          {items.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left p-2">Product</th>
                    <th className="text-left p-2">Variant</th>
                    <th className="text-right p-2">Quantity</th>
                    <th className="text-right p-2">Price</th>
                    <th className="text-right p-2">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item: OrderItem, index: number) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="p-2">{item.name}</td>
                      <td className="p-2 text-gray-600">{item.variant || '-'}</td>
                      <td className="p-2 text-right">{item.quantity}</td>
                      <td className="p-2 text-right">${item.price.toFixed(2)}</td>
                      <td className="p-2 text-right font-medium">
                        ${(item.quantity * item.price).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No items found</p>
          )}
        </div>

        {/* Order Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-3 rounded border border-gray-200">
            <h3 className="font-semibold text-sm mb-2 text-gray-700">Order Summary</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>${order.shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold border-t border-gray-200 pt-1 mt-1">
                <span>Total:</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-3 rounded border border-gray-200">
            <h3 className="font-semibold text-sm mb-2 text-gray-700">Payment & Dates</h3>
            <div className="space-y-1 text-sm">
              <div><span className="font-medium">Payment Method:</span> {order.paymentMethod}</div>
              <div><span className="font-medium">Created:</span> {formatDate(order.createdAt)}</div>
              {order.updatedAt && (
                <div><span className="font-medium">Updated:</span> {formatDate(order.updatedAt)}</div>
              )}
              {order.deliveredAt && (
                <div><span className="font-medium">Delivered:</span> {formatDate(order.deliveredAt)}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>Orders</h1>
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Orders</h1>

      {orders.length === 0 ? (
        <p className="text-gray-600">No orders found.</p>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border-collapse bg-white shadow-sm">
              <thead>
                <tr className="bg-gray-50 border-b-2 border-gray-200">
                  <th className="p-3 text-left text-sm font-semibold text-gray-700">Order #</th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-700">Customer</th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-700">Date</th>
                  <th className="p-3 text-right text-sm font-semibold text-gray-700">Total</th>
                  <th className="p-3 text-center text-sm font-semibold text-gray-700">Status</th>
                  <th className="p-3 text-center text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <>
                    <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                      <td className="p-3">
                        <strong className="text-sm">{order.orderNumber}</strong>
                      </td>
                      <td className="p-3">
                        <div>
                          <div className="font-semibold text-sm">{order.customerName}</div>
                          <div className="text-xs text-gray-500">{order.customerPhone}</div>
                        </div>
                      </td>
                      <td className="p-3 text-sm">{formatDate(order.createdAt)}</td>
                      <td className="p-3 text-right text-sm font-semibold">
                        ${order.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="p-3 text-center">{getStatusBadge(order.status)}</td>
                      <td className="p-3 text-center">
                        <div className="flex gap-2 justify-center items-center">
                          <button
                            onClick={() => toggleOrderDetails(order.id)}
                            className="px-3 py-1.5 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
                          >
                            {expandedOrders.has(order.id) ? 'Hide Details' : 'View Details'}
                          </button>
                          {order.status === 'PENDING' && (
                            <>
                              <button
                                onClick={() => handleDeliver(order.id)}
                                disabled={processing === order.id}
                                className="px-3 py-1.5 bg-green-600 text-white rounded text-xs hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                              >
                                {processing === order.id ? 'Processing...' : 'Deliver'}
                              </button>
                              <button
                                onClick={() => handleDelete(order.id)}
                                disabled={processing === order.id}
                                className="px-3 py-1.5 bg-red-600 text-white rounded text-xs hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                    {expandedOrders.has(order.id) && (
                      <tr>
                        <td colSpan={6} className="p-0">
                          {renderOrderDetails(order)}
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <div className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="font-bold text-base mb-1">{order.orderNumber}</div>
                      <div className="text-xs text-gray-500">{formatDate(order.createdAt)}</div>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>
                  
                  <div className="border-t border-gray-200 pt-3 mb-3">
                    <div className="text-sm mb-1">
                      <span className="font-semibold">Customer:</span> {order.customerName}
                    </div>
                    <div className="text-sm text-gray-600 mb-2">{order.customerPhone}</div>
                    <div className="text-sm">
                      <span className="font-semibold">Total:</span>{' '}
                      <span className="font-bold text-green-600">
                        ${order.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 pt-3 border-t border-gray-200">
                    <button
                      onClick={() => toggleOrderDetails(order.id)}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                    >
                      {expandedOrders.has(order.id) ? 'Hide Details' : 'View Details'}
                    </button>
                    {order.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => handleDeliver(order.id)}
                          disabled={processing === order.id}
                          className="w-full px-4 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                        >
                          {processing === order.id ? 'Processing...' : 'Mark as Delivered'}
                        </button>
                        <button
                          onClick={() => handleDelete(order.id)}
                          disabled={processing === order.id}
                          className="w-full px-4 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Expanded Details for Mobile */}
                {expandedOrders.has(order.id) && (
                  <div className="border-t border-gray-200">
                    {renderOrderDetails(order)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}




