import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function ProductCard({ product }) {
  const { addToCart } = useCart();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await addToCart(product.id);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to add to cart');
    }
  };

  return (
    <Link to={`/products/${product.slug}`} className="group cursor-pointer block">
      <div className="bg-surface-container-low rounded-2xl p-4 mb-3 relative overflow-hidden">
        {product.primary_image ? (
          <img
            src={product.primary_image}
            alt={product.name}
            className="w-full aspect-square object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full aspect-square rounded-xl bg-surface-container-high flex items-center justify-center text-outline text-sm">
            <span className="material-symbols-outlined text-3xl">image</span>
          </div>
        )}
        {product.compare_at_price && (
          <div className="absolute top-6 left-6 bg-error text-on-error px-3 py-1 rounded-full text-xs font-bold shadow-sm">
            Sale
          </div>
        )}
        {product.in_stock && (
          <button
            onClick={handleAddToCart}
            className="absolute bottom-6 right-6 bg-surface-container-lowest p-2.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary-container active:scale-90"
          >
            <span className="material-symbols-outlined text-primary text-xl">add_shopping_cart</span>
          </button>
        )}
      </div>
      <div className="px-1">
        {product.category_name && (
          <span className="text-xs font-medium text-outline">{product.category_name}</span>
        )}
        <h3 className="font-bold text-on-surface text-sm mt-0.5 leading-snug">{product.name}</h3>
        <div className="flex items-baseline gap-2 mt-1.5">
          <span className="text-primary font-black text-lg">${product.price}</span>
          {product.compare_at_price && (
            <span className="text-outline line-through text-sm">${product.compare_at_price}</span>
          )}
        </div>
        {!product.in_stock && (
          <span className="text-xs font-semibold text-error mt-1 block">Out of Stock</span>
        )}
      </div>
    </Link>
  );
}

export default ProductCard;
