import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import OrderHistory from './components/OrderHistory';
import OrderConfirmation from './components/OrderConfirmation';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import Changelog from './components/Changelog';

function App() {
  return (
    <div className="min-h-dvh flex flex-col bg-surface text-on-surface">
      <Navbar />
      <main className="flex-1 mt-20 pb-28 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/products/:slug" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<OrderHistory />} />
          <Route path="/orders/:orderNumber" element={<OrderConfirmation />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/changelog" element={<Changelog />} />
        </Routes>
      </main>
      <footer className="bg-inverse-surface text-inverse-on-surface text-center py-6 text-sm space-y-1">
        <p>&copy; 2026 Kid Palace. All rights reserved.</p>
        <p><a href="/changelog" className="text-inverse-primary hover:underline">Changelog</a></p>
      </footer>
      <BottomNav />
    </div>
  );
}

export default App;
