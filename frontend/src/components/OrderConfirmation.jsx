import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';

function OrderConfirmation() {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try { const res = await api.get(`/orders/${orderNumber}/`); setOrder(res.data); }
      catch (err) { console.error('Failed to load order:', err); }
      finally { setLoading(false); }
    };
    fetchOrder();
  }, [orderNumber]);

  if (loading) return (
    <div className="text-center py-20 text-outline">
      <span className="material-symbols-outlined text-4xl animate-spin">progress_activity</span>
    </div>
  );
  if (!order) return (
    <div className="text-center py-20 text-outline">
      <span className="material-symbols-outlined text-5xl mb-4">error_outline</span>
      <p>Order not found.</p>
    </div>
  );

  return (
    <div className="py-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10">
        <span className="material-symbols-outlined text-6xl text-secondary icon-filled mb-2">check_circle</span>
        <h1 className="text-3xl font-extrabold text-secondary">Order Confirmed!</h1>
        <p className="text-outline mt-2">Thank you for your purchase</p>
        <p className="font-mono text-sm text-on-surface/50 mt-2 break-all">{order.order_number}</p>
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm border border-outline-variant/10">
          <h3 className="text-xs font-bold uppercase tracking-wider text-outline mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">local_shipping</span>Shipping Address
          </h3>
          <p className="text-sm font-semibold">{order.shipping_first_name} {order.shipping_last_name}</p>
          <p className="text-sm text-on-surface/60">{order.shipping_address_1}</p>
          {order.shipping_address_2 && <p className="text-sm text-on-surface/60">{order.shipping_address_2}</p>}
          <p className="text-sm text-on-surface/60">{order.shipping_city}, {order.shipping_state} {order.shipping_zip}</p>
        </div>
        <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm border border-outline-variant/10">
          <h3 className="text-xs font-bold uppercase tracking-wider text-outline mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">credit_card</span>Payment
          </h3>
          <p className="text-sm font-semibold">{order.payment_method === 'credit_card' ? 'Credit Card' : 'PayPal'}</p>
          <span className="inline-flex items-center gap-1 bg-secondary-container text-on-secondary-container px-2.5 py-1 rounded-full text-xs font-bold mt-2 capitalize">
            <span className="material-symbols-outlined text-sm icon-filled">check_circle</span>
            {order.payment_status}
          </span>
        </div>
      </div>

      {/* Items table */}
      <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/10 overflow-hidden mb-6">
        <div className="px-5 pt-5 pb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-outline flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">inventory_2</span>Items
          </h3>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-t border-outline-variant/10">
              <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-outline">Product</th>
              <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-outline hidden sm:table-cell">SKU</th>
              <th className="px-5 py-3 text-center text-xs font-bold uppercase tracking-wider text-outline">Qty</th>
              <th className="px-5 py-3 text-right text-xs font-bold uppercase tracking-wider text-outline">Price</th>
              <th className="px-5 py-3 text-right text-xs font-bold uppercase tracking-wider text-outline">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.id} className="border-t border-outline-variant/10">
                <td className="px-5 py-3 text-sm font-semibold">{item.product_name}</td>
                <td className="px-5 py-3 text-sm text-on-surface/50 hidden sm:table-cell">{item.product_sku}</td>
                <td className="px-5 py-3 text-sm text-center">{item.quantity}</td>
                <td className="px-5 py-3 text-sm text-right">${item.price}</td>
                <td className="px-5 py-3 text-sm text-right font-semibold">${item.line_total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm border border-outline-variant/10 max-w-xs ml-auto mb-8">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-on-surface/60">Subtotal</span><span className="font-semibold">${order.subtotal}</span></div>
          <div className="flex justify-between"><span className="text-on-surface/60">Tax</span><span className="font-semibold">${order.tax}</span></div>
          <div className="flex justify-between"><span className="text-on-surface/60">Shipping</span><span className="font-semibold">${order.shipping_cost}</span></div>
          <div className="border-t-2 border-outline-variant/20 pt-3 flex justify-between text-lg font-extrabold">
            <span>Total</span><span className="text-primary">${order.total}</span>
          </div>
        </div>
      </div>

      <div className="text-center">
        <Link to="/" className="bg-primary text-on-primary rounded-full px-8 py-4 font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all inline-flex items-center gap-2">
          <span className="material-symbols-outlined">storefront</span>
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

export default OrderConfirmation;
