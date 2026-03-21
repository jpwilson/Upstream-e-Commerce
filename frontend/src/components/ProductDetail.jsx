import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import { useCart } from '../context/CartContext';

function ProductDetail() {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [addedMessage, setAddedMessage] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/products/items/${slug}/`);
        setProduct(res.data);
      } catch (err) { console.error('Failed to load product:', err); }
      finally { setLoading(false); }
    };
    fetchProduct();
  }, [slug]);

  const handleAddToCart = async () => {
    try {
      await addToCart(product.id, quantity);
      setAddedMessage('Added to cart!');
      setTimeout(() => setAddedMessage(''), 2000);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to add to cart');
    }
  };

  if (loading) return (
    <div className="text-center py-20 text-outline">
      <span className="material-symbols-outlined text-4xl animate-spin">progress_activity</span>
    </div>
  );
  if (!product) return (
    <div className="text-center py-20 text-outline">
      <span className="material-symbols-outlined text-5xl mb-4">error_outline</span>
      <p>Product not found.</p>
    </div>
  );

  return (
    <div className="py-8">
      <Link to="/" className="inline-flex items-center gap-1 text-outline hover:text-primary transition-colors text-sm mb-6">
        <span className="material-symbols-outlined text-lg">arrow_back</span>
        Back to Products
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Images */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative bg-primary-container/30 rounded-2xl overflow-hidden aspect-square flex items-center justify-center">
            {product.images && product.images.length > 0 ? (
              <img
                src={product.images[selectedImage]?.image}
                alt={product.name}
                className="w-4/5 h-4/5 object-contain hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="text-outline flex flex-col items-center gap-2">
                <span className="material-symbols-outlined text-5xl">image</span>
                <span className="text-sm">No Image Available</span>
              </div>
            )}
          </div>
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((img, idx) => (
                <div
                  key={img.id}
                  className={`aspect-square rounded-xl overflow-hidden cursor-pointer transition-all ${
                    idx === selectedImage ? 'ring-2 ring-primary' : 'opacity-60 hover:opacity-100'
                  }`}
                  onClick={() => setSelectedImage(idx)}
                >
                  <img src={img.image} alt={img.alt_text || product.name} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="lg:col-span-5 flex flex-col justify-center space-y-6">
          <div>
            <nav className="flex items-center gap-2 text-sm text-outline mb-4">
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              <span className="material-symbols-outlined text-xs">chevron_right</span>
              {product.category && (
                <>
                  <span>{product.category.name}</span>
                  <span className="material-symbols-outlined text-xs">chevron_right</span>
                </>
              )}
              <span className="text-primary font-medium">{product.name}</span>
            </nav>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-on-surface leading-tight mb-2">
              {product.name}
            </h1>
            <p className="text-xs text-outline mt-1">SKU: {product.sku}</p>
          </div>

          <div className="bg-surface-container-low p-6 rounded-2xl">
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-4xl font-black text-primary">${product.price}</span>
              {product.compare_at_price && (
                <span className="text-lg text-outline line-through">${product.compare_at_price}</span>
              )}
            </div>

            <p className="text-on-surface/70 leading-relaxed mb-6">{product.description}</p>

            {/* Stock */}
            <div className="mb-6">
              {product.in_stock ? (
                product.low_stock ? (
                  <div className="inline-flex items-center gap-2 bg-tertiary-container/40 text-on-tertiary-container px-3 py-1.5 rounded-full text-xs font-bold">
                    <span className="material-symbols-outlined text-sm">warning</span>
                    Low Stock – Only {product.stock_quantity} left
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 bg-secondary-container/40 text-on-secondary-container px-3 py-1.5 rounded-full text-xs font-bold">
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                    In Stock
                  </div>
                )
              ) : (
                <div className="inline-flex items-center gap-2 bg-error-container text-on-error-container px-3 py-1.5 rounded-full text-xs font-bold">
                  <span className="material-symbols-outlined text-sm">block</span>
                  Out of Stock
                </div>
              )}
            </div>

            {/* Quantity + Add to Cart */}
            {product.in_stock && (
              <div className="space-y-4">
                <div className="flex items-center gap-6">
                  <span className="font-bold text-xs uppercase tracking-widest text-outline">Quantity</span>
                  <div className="flex items-center bg-surface-container-lowest rounded-full p-1 border border-outline-variant/20 shadow-sm">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 flex items-center justify-center text-primary hover:bg-primary-container rounded-full transition-colors"
                    >
                      <span className="material-symbols-outlined">remove</span>
                    </button>
                    <span className="px-5 font-bold">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                      className="w-10 h-10 flex items-center justify-center text-primary hover:bg-primary-container rounded-full transition-colors"
                    >
                      <span className="material-symbols-outlined">add</span>
                    </button>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-primary text-on-primary rounded-full py-4 px-8 font-bold text-lg shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                  >
                    <span className="material-symbols-outlined">shopping_basket</span>
                    {addedMessage || 'Add to Cart'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-3 p-4 bg-secondary-container/30 rounded-xl">
              <span className="material-symbols-outlined text-secondary">local_shipping</span>
              <span className="text-xs font-bold text-secondary">Free Shipping $50+</span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-tertiary-container/30 rounded-xl">
              <span className="material-symbols-outlined text-tertiary">verified_user</span>
              <span className="text-xs font-bold text-tertiary">Safe & Non-Toxic</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
