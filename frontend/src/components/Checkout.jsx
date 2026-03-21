import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

function Checkout() {
  const { user } = useAuth();
  const { cart, fetchCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    guest_email: '',
    payment_method: 'credit_card',
    shipping_first_name: user?.first_name || '',
    shipping_last_name: user?.last_name || '',
    shipping_address_1: user?.profile?.address_1 || '',
    shipping_address_2: user?.profile?.address_2 || '',
    shipping_city: user?.profile?.city || '',
    shipping_state: user?.profile?.state || '',
    shipping_zip: user?.profile?.zip_code || '',
    shipping_country: user?.profile?.country || 'US',
    phone: user?.profile?.phone || '',
    notes: '',
    card_number: '',
    card_expiry: '',
    card_cvc: '',
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const orderData = { ...form };
      delete orderData.card_number;
      delete orderData.card_expiry;
      delete orderData.card_cvc;
      if (!user && !form.guest_email) { setError('Email is required for guest checkout.'); setLoading(false); return; }
      const orderRes = await api.post('/orders/create/', orderData);
      const order = orderRes.data;
      await api.post('/payments/process/', { order_number: order.order_number, payment_method: form.payment_method, token: 'tok_stub_visa' });
      await fetchCart();
      navigate(`/orders/${order.order_number}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Checkout failed. Please try again.');
    } finally { setLoading(false); }
  };

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="py-8">
        <h1 className="text-3xl font-extrabold tracking-tight mb-8">Checkout</h1>
        <div className="text-center py-16 text-outline">
          <span className="material-symbols-outlined text-5xl mb-4">shopping_cart</span>
          <p>Your cart is empty.</p>
        </div>
      </div>
    );
  }

  const subtotal = parseFloat(cart.total_price);
  const tax = subtotal * 0.08;
  const shipping = subtotal >= 50 ? 0 : 5.99;
  const total = subtotal + tax + shipping;

  const inputClass = "w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all";
  const labelClass = "block text-xs font-bold uppercase tracking-wider text-outline mb-1.5";

  return (
    <div className="py-8">
      <h1 className="text-3xl font-extrabold tracking-tight mb-8">Checkout</h1>
      {error && (
        <div className="bg-error-container text-on-error-container p-4 rounded-xl mb-6 text-sm flex items-center gap-2">
          <span className="material-symbols-outlined text-lg">error</span>{error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Guest email */}
            {!user && (
              <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/10">
                <h2 className="text-lg font-extrabold mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">mail</span>Contact
                </h2>
                <div>
                  <label className={labelClass}>Email *</label>
                  <input type="email" name="guest_email" value={form.guest_email} onChange={handleChange} required className={inputClass} />
                </div>
              </div>
            )}

            {/* Shipping */}
            <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/10">
              <h2 className="text-lg font-extrabold mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">local_shipping</span>Shipping Address
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><label className={labelClass}>First Name *</label><input type="text" name="shipping_first_name" value={form.shipping_first_name} onChange={handleChange} required className={inputClass} /></div>
                  <div><label className={labelClass}>Last Name *</label><input type="text" name="shipping_last_name" value={form.shipping_last_name} onChange={handleChange} required className={inputClass} /></div>
                </div>
                <div><label className={labelClass}>Address Line 1 *</label><input type="text" name="shipping_address_1" value={form.shipping_address_1} onChange={handleChange} required className={inputClass} /></div>
                <div><label className={labelClass}>Address Line 2</label><input type="text" name="shipping_address_2" value={form.shipping_address_2} onChange={handleChange} className={inputClass} /></div>
                <div className="grid grid-cols-3 gap-4">
                  <div><label className={labelClass}>City *</label><input type="text" name="shipping_city" value={form.shipping_city} onChange={handleChange} required className={inputClass} /></div>
                  <div><label className={labelClass}>State *</label><input type="text" name="shipping_state" value={form.shipping_state} onChange={handleChange} required className={inputClass} /></div>
                  <div><label className={labelClass}>ZIP *</label><input type="text" name="shipping_zip" value={form.shipping_zip} onChange={handleChange} required className={inputClass} /></div>
                </div>
                <div><label className={labelClass}>Phone</label><input type="tel" name="phone" value={form.phone} onChange={handleChange} className={inputClass} /></div>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/10">
              <h2 className="text-lg font-extrabold mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">credit_card</span>Payment
              </h2>
              <div className="flex gap-3 mb-4">
                <label className={`flex-1 flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${form.payment_method === 'credit_card' ? 'border-primary bg-primary-container/20' : 'border-outline-variant/20'}`}>
                  <input type="radio" name="payment_method" value="credit_card" checked={form.payment_method === 'credit_card'} onChange={handleChange} className="accent-primary" />
                  <span className="text-sm font-semibold">Credit Card</span>
                </label>
                <label className={`flex-1 flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${form.payment_method === 'paypal' ? 'border-primary bg-primary-container/20' : 'border-outline-variant/20'}`}>
                  <input type="radio" name="payment_method" value="paypal" checked={form.payment_method === 'paypal'} onChange={handleChange} className="accent-primary" />
                  <span className="text-sm font-semibold">PayPal</span>
                </label>
              </div>
              {form.payment_method === 'credit_card' && (
                <div className="space-y-4">
                  <div><label className={labelClass}>Card Number</label><input type="text" name="card_number" placeholder="4242 4242 4242 4242" value={form.card_number} onChange={handleChange} className={inputClass} /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className={labelClass}>Expiry</label><input type="text" name="card_expiry" placeholder="MM/YY" value={form.card_expiry} onChange={handleChange} className={inputClass} /></div>
                    <div><label className={labelClass}>CVC</label><input type="text" name="card_cvc" placeholder="123" value={form.card_cvc} onChange={handleChange} className={inputClass} /></div>
                  </div>
                  <p className="text-xs text-outline italic">* Payment stub — no real charges will be made.</p>
                </div>
              )}
              {form.payment_method === 'paypal' && <p className="text-xs text-outline italic">* PayPal stub — no real redirect.</p>}
            </div>

            {/* Notes */}
            <div>
              <label className={labelClass}>Order Notes</label>
              <textarea name="notes" value={form.notes} onChange={handleChange} rows="3" placeholder="Special instructions..." className={inputClass + " resize-none"} />
            </div>
          </div>

          {/* Summary sidebar */}
          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/10 h-fit sticky top-24">
            <h2 className="text-lg font-extrabold mb-4">Order Summary</h2>
            <div className="space-y-2 mb-4">
              {cart.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-on-surface/60 truncate mr-2">{item.product_detail?.name} x{item.quantity}</span>
                  <span className="font-semibold shrink-0">${item.line_total}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-outline-variant/20 pt-3 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-on-surface/60">Subtotal</span><span className="font-semibold">${subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-on-surface/60">Tax (8%)</span><span className="font-semibold">${tax.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-on-surface/60">Shipping</span><span className="font-semibold">{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span></div>
              <div className="border-t-2 border-outline-variant/20 pt-3 flex justify-between text-lg font-extrabold">
                <span>Total</span><span className="text-primary">${total.toFixed(2)}</span>
              </div>
            </div>
            <button type="submit" disabled={loading} className="mt-6 w-full bg-primary text-on-primary rounded-full py-4 font-bold text-lg shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2">
              {loading ? (
                <><span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>Processing...</>
              ) : (
                <><span className="material-symbols-outlined text-lg">lock</span>Place Order</>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Checkout;
