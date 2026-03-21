import { useState, useEffect } from 'react';
import api from '../api';
import ProductCard from './ProductCard';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [ordering, setOrdering] = useState('-created_at');

  useEffect(() => { fetchCategories(); }, []);
  useEffect(() => { fetchProducts(); }, [selectedCategory, ordering]);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/products/categories/');
      setCategories(res.data.results || res.data);
    } catch (err) { console.error('Failed to load categories:', err); }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = { ordering };
      if (selectedCategory) params.category__slug = selectedCategory;
      if (searchQuery) params.search = searchQuery;
      const res = await api.get('/products/items/', { params });
      setProducts(res.data.results || res.data);
    } catch (err) { console.error('Failed to load products:', err); }
    finally { setLoading(false); }
  };

  const handleSearch = (e) => { e.preventDefault(); fetchProducts(); };

  return (
    <div className="py-8">
      {/* Hero */}
      <div className="mb-10">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-on-surface leading-tight mb-2">
          Discover & Learn
        </h1>
        <p className="text-outline text-lg">Everything your little reader needs</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8 items-stretch sm:items-center">
        <form onSubmit={handleSearch} className="flex gap-2 flex-1 max-w-md">
          <div className="flex-1 relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-xl">search</span>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-surface-container-lowest border border-outline-variant/20 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
            />
          </div>
          <button type="submit" className="bg-primary text-on-primary rounded-full px-6 py-3 text-sm font-bold hover:bg-on-primary-container active:scale-95 transition-all shadow-lg shadow-primary/20">
            Search
          </button>
        </form>
        <div className="flex gap-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 bg-surface-container-lowest border border-outline-variant/20 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 appearance-none cursor-pointer"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>{cat.name}</option>
            ))}
          </select>
          <select
            value={ordering}
            onChange={(e) => setOrdering(e.target.value)}
            className="px-4 py-3 bg-surface-container-lowest border border-outline-variant/20 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 appearance-none cursor-pointer"
          >
            <option value="-created_at">Newest</option>
            <option value="price">Price: Low to High</option>
            <option value="-price">Price: High to Low</option>
            <option value="name">Name: A-Z</option>
          </select>
        </div>
      </div>

      {/* Products grid */}
      {loading ? (
        <div className="text-center py-20 text-outline">
          <span className="material-symbols-outlined text-4xl animate-spin">progress_activity</span>
          <p className="mt-4 text-sm">Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-outline">
          <span className="material-symbols-outlined text-5xl mb-4">search_off</span>
          <p className="text-lg font-medium">No products found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductList;
