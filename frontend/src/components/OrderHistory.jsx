import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';

function OrderHistory() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    const fetchOrders = async () => {
      try { const res = await api.get('/orders/'); setOrders(res.data); }
      catch (err) { console.error('Failed to load orders:', err); }
      finally { setLoading(false); }
    };
    fetchOrders();
  }, [user, navigate]);

  const statusStyles = {
    pending: 'bg-tertiary-container text-on-tertiary-container',
    processing: 'bg-secondary-container text-on-secondary-container',
    shipped: 'bg-primary-container text-on-primary-container',
    delivered: 'bg-secondary-container text-on-secondary-container',
    cancelled: 'bg-error-container text-on-error-container',
  };

  if (loading) return (
    <div className="text-center py-20 text-outline">
      <span className="material-symbols-outlined text-4xl animate-spin">progress_activity</span>
    </div>
  );

  return (
    <div className="py-8">
      <h1 className="text-3xl font-extrabold tracking-tight mb-8">Order History</h1>
      {orders.length === 0 ? (
        <div className="text-center py-16 text-outline">
          <span className="material-symbols-outlined text-6xl mb-4">receipt_long</span>
          <p className="text-lg font-medium mb-6">No orders yet.</p>
          <Link to="/" className="bg-primary text-on-primary rounded-full px-8 py-3 font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all inline-flex items-center gap-2">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/10">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div>
                  <h3 className="font-extrabold text-sm">Order #{order.order_number.slice(0, 8)}...</h3>
                  <p className="text-xs text-outline mt-0.5">{new Date(order.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                </div>
                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold capitalize ${statusStyles[order.status] || 'bg-surface-container-high text-on-surface'}`}>
                  {order.status}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {order.items.map((item) => (
                  <span key={item.id} className="text-xs bg-surface-container-low px-2.5 py-1 rounded-full text-on-surface/70">
                    {item.product_name} x{item.quantity}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between border-t border-outline-variant/10 pt-4">
                <span className="font-extrabold text-primary">Total: ${order.total}</span>
                <Link to={`/orders/${order.order_number}`} className="text-sm font-bold text-primary hover:underline flex items-center gap-1">
                  View Details <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrderHistory;
