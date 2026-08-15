'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { ShieldCheck, Lock, CreditCard, QrCode, Truck, CheckCircle2, AlertCircle } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Rajasthan');
  const [pincode, setPincode] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [notes, setNotes] = useState('');

  const [cartCalc, setCartCalc] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showSimulatedUpiModal, setShowSimulatedUpiModal] = useState(false);
  const [pendingOrder, setPendingOrder] = useState<any>(null);

  useEffect(() => {
    if (items.length === 0) return;

    fetch('/api/cart/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: items.map((i) => ({ product_id: i.product_id, quantity: i.quantity })),
        coupon_code: couponCode
      })
    })
      .then((r) => r.json())
      .then((d) => setCartCalc(d))
      .catch(console.error);
  }, [items, couponCode]);

  if (items.length === 0 && !pendingOrder) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] text-stone-900 flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 max-w-lg mx-auto text-center py-20 px-4 space-y-4">
          <h2 className="font-serif text-2xl text-stone-900">Your cart is empty.</h2>
          <p className="text-xs text-stone-600">Please add items to cart before checking out.</p>
          <a href="/shop" className="inline-block bg-[#C85A32] text-white px-6 py-2.5 rounded-lg text-xs font-medium hover:bg-amber-800 transition">
            Explore Collection
          </a>
        </div>
        <Footer />
      </div>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      const shippingAddress = {
        name: customerName,
        phone: customerPhone,
        address_line1: addressLine1,
        address_line2: addressLine2,
        city: city,
        state: state,
        pincode: pincode,
        country: 'India'
      };

      const res = await fetch('/api/checkout/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone,
          shipping_address: shippingAddress,
          items: items.map((i) => ({ product_id: i.product_id, quantity: i.quantity })),
          coupon_code: couponCode,
          notes: notes
        })
      }).then((r) => r.json());

      if (!res.success) {
        throw new Error(res.error || 'Failed to create order');
      }

      setPendingOrder(res);
      setShowSimulatedUpiModal(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during order creation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmPayment = async (simulateSuccess = true) => {
    if (!pendingOrder) return;
    setIsSubmitting(true);

    try {
      const verifyRes = await fetch('/api/checkout/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: pendingOrder.order_id,
          razorpay_order_id: pendingOrder.razorpay_order_id,
          razorpay_payment_id: `pay_sim_${Date.now()}`,
          razorpay_signature: `sig_sim_${Date.now()}`,
          simulate_success: simulateSuccess
        })
      }).then((r) => r.json());

      if (verifyRes.success) {
        clearCart();
        router.push(`/order-confirmation/${pendingOrder.order_id}`);
      } else {
        setErrorMsg(verifyRes.error || 'Payment verification failed');
      }
    } catch (e: any) {
      setErrorMsg(e.message);
    } finally {
      setIsSubmitting(false);
      setShowSimulatedUpiModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-900 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 w-full">
        <div className="border-b border-amber-900/10 pb-4">
          <h1 className="font-serif text-3xl font-semibold text-stone-900 flex items-center gap-2">
            <Lock className="w-6 h-6 text-[#C85A32]" /> Secure Checkout (Guest & Account)
          </h1>
          <p className="text-xs text-stone-600 mt-1">
            Complete your shipping details. No mandatory account creation required.
          </p>
        </div>

        {errorMsg && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Shipping Address Form (8 cols) */}
          <div className="lg:col-span-7 bg-white border border-amber-900/10 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
            <h2 className="font-serif text-xl font-semibold text-stone-900 border-b border-stone-100 pb-3">
              1. Customer & Indian Shipping Address
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="block text-stone-700 font-medium mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Radhika Sharma"
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2.5 text-stone-900 focus:outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="radhika@example.com"
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2.5 text-stone-900 focus:outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">Mobile Number (WhatsApp) *</label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2.5 text-stone-900 focus:outline-none focus:border-amber-600"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-stone-700 font-medium mb-1">Address Line 1 (House/Building/Street) *</label>
                <input
                  type="text"
                  required
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  placeholder="e.g. Flat 402, Rosewood Apartments, MG Road"
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2.5 text-stone-900 focus:outline-none focus:border-amber-600"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-stone-700 font-medium mb-1">Address Line 2 (Landmark / Area)</label>
                <input
                  type="text"
                  value={addressLine2}
                  onChange={(e) => setAddressLine2(e.target.value)}
                  placeholder="Near City Mall"
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2.5 text-stone-900 focus:outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">City *</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Jaipur"
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2.5 text-stone-900 focus:outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">State *</label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="e.g. Rajasthan"
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2.5 text-stone-900 focus:outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">PIN Code *</label>
                <input
                  type="text"
                  required
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="302001"
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2.5 text-stone-900 focus:outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">Country</label>
                <input
                  type="text"
                  disabled
                  value="India"
                  className="w-full bg-stone-100 border border-stone-200 text-stone-500 rounded-lg px-3 py-2.5 cursor-not-allowed"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-stone-700 font-medium mb-1">Special Order Notes / Gift Message</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Please wrap in festive paper with a birthday note."
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-900 focus:outline-none focus:border-amber-600"
                />
              </div>
            </div>
          </div>

          {/* Right Summary (5 cols) */}
          <div className="lg:col-span-5 bg-white border border-amber-900/10 rounded-2xl p-6 space-y-6 sticky top-24 shadow-sm">
            <h2 className="font-serif text-xl font-semibold text-stone-900 border-b border-stone-100 pb-3">
              2. Order Summary
            </h2>

            {/* Item List */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
              {items.map((i) => {
                const price = i.sale_price !== null && i.sale_price < i.price ? i.sale_price : i.price;
                return (
                  <div key={i.product_id} className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <img src={i.image} alt="" className="w-10 h-10 object-cover rounded border border-stone-200" />
                      <div className="truncate">
                        <p className="font-medium text-stone-900 truncate">{i.name}</p>
                        <p className="text-[10px] text-stone-500">Qty: {i.quantity}</p>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-stone-900 ml-2">
                      ₹{(price * i.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Totals */}
            <div className="border-t border-stone-100 pt-4 space-y-2 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono text-stone-900 font-bold">₹{cartCalc?.subtotal || 0}</span>
              </div>
              {cartCalc?.coupon_discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Coupon Discount ({cartCalc.applied_coupon?.code})</span>
                  <span className="font-mono font-bold">- ₹{cartCalc.coupon_discount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-mono text-stone-900">
                  {cartCalc?.shipping_charge === 0 ? 'FREE' : `₹${cartCalc?.shipping_charge || 0}`}
                </span>
              </div>
              <div className="flex justify-between pt-3 border-t border-stone-100 text-lg font-serif font-bold text-stone-900">
                <span>Total Payable</span>
                <span className="font-mono text-[#C85A32]">
                  ₹{cartCalc ? Math.round(cartCalc.final_total).toLocaleString('en-IN') : 0}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#C85A32] hover:bg-amber-800 text-white py-4 rounded-xl font-medium text-sm shadow-md transition flex items-center justify-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              {isSubmitting ? 'Processing Payment...' : 'Proceed to UPI / Card Payment'}
            </button>
          </div>
        </form>
      </main>

      {/* Simulated Razorpay / UPI Payment Gateway Modal */}
      {showSimulatedUpiModal && pendingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 p-4 backdrop-blur-md">
          <div className="bg-white border border-amber-900/20 rounded-2xl p-6 sm:p-8 max-w-md w-full text-center space-y-6 shadow-2xl">
            <div className="space-y-2">
              <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] uppercase tracking-widest px-3 py-1 rounded-full font-mono font-bold">
                Razorpay Test Sandbox / UPI Gateway
              </span>
              <h3 className="font-serif text-2xl font-bold text-stone-900">Payable: ₹{(pendingOrder.amount / 100).toLocaleString('en-IN')}</h3>
              <p className="text-xs text-stone-500 font-mono">Order Ref: {pendingOrder.order_number}</p>
            </div>

            {/* UPI QR Display */}
            <div className="bg-stone-50 p-4 rounded-xl inline-block border border-amber-900/10 shadow-sm">
              <img
                src={`/api/qr?url=${encodeURIComponent(`upi://pay?pa=kalakriti@upi&pn=KalaKritiArts&am=${pendingOrder.amount / 100}&cu=INR&tn=${pendingOrder.order_number}`)}`}
                alt="UPI Payment QR"
                className="w-48 h-48 mx-auto"
              />
              <p className="text-[10px] text-stone-600 font-mono mt-2 font-bold">Scan with GPay / PhonePe / Paytm / BHIM</p>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => handleConfirmPayment(true)}
                disabled={isSubmitting}
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md transition flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" /> Simulate Successful Payment
              </button>
              <button
                onClick={() => handleConfirmPayment(false)}
                disabled={isSubmitting}
                className="w-full bg-stone-100 hover:bg-stone-200 text-stone-700 py-2.5 rounded-xl text-xs font-medium transition"
              >
                Simulate Payment Failure
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
