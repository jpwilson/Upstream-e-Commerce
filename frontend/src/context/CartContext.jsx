import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState({ items: [], total_price: '0.00', total_items: 0 });
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/cart/');
      setCart(res.data);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    const res = await api.post('/cart/add/', { product_id: productId, quantity });
    setCart(res.data);
    return res.data;
  };

  const updateItem = async (itemId, quantity) => {
    const res = await api.patch(`/cart/items/${itemId}/`, { quantity });
    setCart(res.data);
    return res.data;
  };

  const removeItem = async (itemId) => {
    const res = await api.delete(`/cart/items/${itemId}/remove/`);
    setCart(res.data);
    return res.data;
  };

  const clearCart = async () => {
    const res = await api.post('/cart/clear/');
    setCart(res.data);
    return res.data;
  };

  return (
    <CartContext.Provider value={{ cart, loading, fetchCart, addToCart, updateItem, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
