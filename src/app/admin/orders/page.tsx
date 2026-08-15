'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { ShoppingBag, Eye, MapPin, Truck, CheckCircle, Clock, Search } from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders').then((r) => r.json());
      if (res.orders) setOrders(res.orders);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    await fetch('/api/orders', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_id: orderId, status: newStatus })
    });
    loadOrders();
    if (selectedOrder && selectedOrder.order.id === orderId) {
      setSelectedOrder({ ...selectedOrder, order: { ...selectedOrder.order, status: newStatus } });
    }
  };

  const viewOrderDetails = async (orderId: string) => {
    const res = await fetch(`/api/orders?id=${orderId}`).then((r) => r.json());
    if (res.order) setSelectedOrder(res);
  };

  const filteredOrders = statusFilter === 'ALL'
    ? orders
    : orders.filter((o) => o.status === statusFilter);

  return (
    <div className="flex min-h-screen bg-stone-950 text-stone-100 font-sans">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-10 space-y-6 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-900/30 pb-4">
          <div>
            <h1 className="font-serif text-3xl font-semibold text-amber-100">Order Management</h1>
            <p className="text-xs text-stone-400 mt-1">
              Process customer orders, update delivery pipeline statuses, and view addresses.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-stone-400">Filter Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-stone-900 border border-stone-800 text-amber-200 px-3 py-2 rounded-lg text-xs"
            >
              <option value="ALL">All Orders</option>
              <option value="Payment Pending">Payment Pending</option>
              <option value="Payment Confirmed">Payment Confirmed</option>
              <option value="Processing">Processing / Crafting</option>
              <option value="Ready to Ship">Ready to Ship</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-stone-900/80 border border-stone-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-300">
              <thead className="bg-stone-950 text-amber-400 uppercase font-mono text-[10px]">
                <tr>
                  <th className="p-4">Order Ref</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Total Amount</th>
                  <th className="p-4">Payment</th>
                  <th className="p-4">Order Status</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800">
                {filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-stone-800/40 transition">
                    <td className="p-4 font-mono font-bold text-amber-200">{ord.order_number}</td>
                    <td className="p-4">
                      <p className="font-bold text-amber-100">{ord.customer_name}</p>
                      <p className="text-[10px] text-stone-500">{ord.customer_phone}</p>
                    </td>
                    <td className="p-4 font-mono font-bold text-amber-200">₹{ord.total_amount}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${ord.payment_status === 'Confirmed' ? 'bg-emerald-950 text-emerald-300' : 'bg-red-950 text-red-300'}`}>
                        {ord.payment_status}
                      </span>
                    </td>
                    <td className="p-4">
                      <select
                        value={ord.status}
                        onChange={(e) => handleUpdateStatus(ord.id, e.target.value)}
                        className="bg-stone-950 border border-stone-800 text-amber-300 rounded px-2 py-1 text-xs focus:outline-none"
                      >
                        <option value="Payment Pending">Payment Pending</option>
                        <option value="Payment Confirmed">Payment Confirmed</option>
                        <option value="Processing">Processing</option>
                        <option value="Ready to Ship">Ready to Ship</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="Refunded">Refunded</option>
                      </select>
                    </td>
                    <td className="p-4 text-stone-500">{new Date(ord.created_at).toLocaleDateString()}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => viewOrderDetails(ord.id)}
                        className="p-2 bg-stone-950 hover:bg-stone-800 text-amber-400 rounded-lg border border-stone-800"
                        title="View Full Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="bg-stone-900 border border-amber-800 rounded-2xl p-6 sm:p-8 max-w-xl w-full space-y-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center border-b border-stone-800 pb-3">
              <div>
                <h2 className="font-serif text-xl font-semibold text-amber-100">
                  Order {selectedOrder.order.order_number}
                </h2>
                <p className="text-[11px] text-stone-400 font-mono">ID: {selectedOrder.order.id}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-stone-400 hover:text-amber-300">
                Close
              </button>
            </div>

            {/* Customer & Address */}
            <div className="grid grid-cols-2 gap-4 text-xs bg-stone-950 p-4 rounded-xl border border-stone-800">
              <div>
                <span className="text-stone-500 block">Customer Info:</span>
                <p className="font-bold text-amber-200">{selectedOrder.order.customer_name}</p>
                <p className="text-stone-400">{selectedOrder.order.customer_email}</p>
                <p className="text-stone-400">{selectedOrder.order.customer_phone}</p>
              </div>
              <div>
                <span className="text-stone-500 block">Shipping Address:</span>
                <p className="text-stone-300">
                  {JSON.parse(selectedOrder.order.shipping_address_json || '{}').address_line1}, {JSON.parse(selectedOrder.order.shipping_address_json || '{}').city}, {JSON.parse(selectedOrder.order.shipping_address_json || '{}').state} - {JSON.parse(selectedOrder.order.shipping_address_json || '{}').pincode}
                </p>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-2 text-xs">
              <h4 className="font-serif font-bold text-amber-200">Order Items</h4>
              {selectedOrder.items.map((i: any) => (
                <div key={i.id} className="flex justify-between items-center p-2 bg-stone-950/60 rounded border border-stone-800">
                  <span>{i.product_name} (Qty: {i.quantity})</span>
                  <span className="font-mono text-amber-200 font-bold">₹{i.total}</span>
                </div>
              ))}
            </div>

            {/* Status change in Modal */}
            <div className="p-4 bg-stone-950 rounded-xl border border-stone-800 space-y-2 text-xs">
              <label className="block text-stone-400">Update Delivery Pipeline Status:</label>
              <select
                value={selectedOrder.order.status}
                onChange={(e) => handleUpdateStatus(selectedOrder.order.id, e.target.value)}
                className="w-full bg-stone-900 border border-stone-800 text-amber-300 rounded p-2 text-xs"
              >
                <option value="Payment Pending">Payment Pending</option>
                <option value="Payment Confirmed">Payment Confirmed</option>
                <option value="Processing">Processing / Crafting</option>
                <option value="Ready to Ship">Ready to Ship</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Refunded">Refunded</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
