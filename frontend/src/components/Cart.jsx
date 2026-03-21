import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function Cart() {
  const { cart, updateItem, removeItem, clearCart, loading } = useCart();

  if (loading) return (
    <div className="text-center py-20 text-outline">
      <span className="material-symbols-outlined text-4xl animate-spin">progress_activity</span>
    </div>
  );

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="py-8">
        <h1 className="text-3xl font-extrabold tracking-tight mb-8">Shopping Cart</h1>
        <div className="text-center py-16 text-outline">
          <span className="material-symbols-outlined text-6xl mb-4">shopping_cart</span>
          <p className="text-lg font-medium mb-6">Your cart is empty.</p>
          <Link to="/" className="bg-primary text-on-primary rounded-full px-8 py-3 font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all inline-flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = parseFloat(cart.total_price);
  const shipping = subtotal >= 50 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <div className="py-8">
      <h1 className="text-3xl font-extrabold tracking-tight mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          {cart.items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 bg-surface-container-lowest p-4 rounded-2xl shadow-sm border border-outline-variant/10">
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-surface-container-low shrink-0">
                {item.product_detail?.primary_image ? (
                  <img src={item.product_detail.primary_image} alt={item.product_detail.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-outline">
                    <span className="material-symbols-outlined">image</span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <Link to={`/products/${item.product_detail?.slug}`} className="font-bold text-sm text-on-surface hover:text-primary transition-colors truncate block">
                  {item.product_detail?.name}
                </Link>
                <p className="text-primary font-black text-sm mt-0.5">${item.product_detail?.price}</p>
              </div>
              <div className="flex items-center bg-surface-container rounded-full p-0.5 border border-outline-variant/20">
                <button onClick={() => updateItem(item.id, item.quantity - 1)} disabled={item.quantity <= 1} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-primary-container transition-colors disabled:opacity-30">
                  <span className="material-symbols-outlined text-sm">remove</span>
                </button>
                <span className="px-3 text-sm font-bold">{item.quantity}</span>
                <button onClick={() => updateItem(item.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-primary-container transition-colors">
                  <span className="material-symbols-outlined text-sm">add</span>
                </button>
              </div>
              <span className="font-black text-sm min-w-[60px] text-right">${item.line_total}</span>
              <button onClick={() => removeItem(item.id)} className="text-error/60 hover:text-error transition-colors">
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/10 h-fit sticky top-24">
          <h2 className="text-lg font-extrabold mb-4">Order Summary</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-on-surface/60">Subtotal ({cart.total_items} items)</span><span className="font-semibold">${subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-on-surface/60">Shipping</span><span className="font-semibold">{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span></div>
            <div className="flex justify-between"><span className="text-on-surface/60">Tax (est.)</span><span className="font-semibold">${tax.toFixed(2)}</span></div>
            <div className="border-t-2 border-outline-variant/20 pt-3 flex justify-between text-lg font-extrabold">
              <span>Total</span><span className="text-primary">${total.toFixed(2)}</span>
            </div>
          </div>
          <Link to="/checkout" className="mt-6 bg-primary text-on-primary rounded-full py-4 px-6 font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 w-full">
            <span className="material-symbols-outlined">lock</span>
            Proceed to Checkout
          </Link>
          <button onClick={clearCart} className="mt-3 w-full text-sm text-error/70 hover:text-error font-medium py-2 transition-colors">
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
