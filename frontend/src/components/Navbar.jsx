import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import api from '../api';

function Navbar() {
  const { user, login, logout } = useAuth();
  const { cart, fetchCart } = useCart();
  const navigate = useNavigate();

  const [demoAccounts, setDemoAccounts] = useState([]);
  const [demoOpen, setDemoOpen] = useState(false);
  const [loggingIn, setLoggingIn] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    api.get('/accounts/demo-accounts/').then(res => setDemoAccounts(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDemoOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDemoLogin = async (account) => {
    setLoggingIn(account.username);
    try {
      if (user) await logout();
      await login(account.username, account.password);
      await fetchCart();
      setDemoOpen(false);
      setMenuOpen(false);
      navigate('/');
    } catch (err) {
      console.error('Demo login failed:', err);
    } finally {
      setLoggingIn(null);
    }
  };

  const handleLogout = async () => {
    try { await logout(); setMenuOpen(false); } catch (err) { console.error('Logout failed:', err); }
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl shadow-sm">
      <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto w-full">
        {/* Left: logo */}
        <div className="flex items-center gap-4">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-primary active:scale-95 duration-200 lg:hidden">
            <span className="material-symbols-outlined">menu</span>
          </button>
          <Link to="/" className="text-2xl font-black tracking-tight text-primary">
            Kid Palace
          </Link>
        </div>

        {/* Center: desktop nav */}
        <nav className="hidden lg:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium text-on-surface/70 hover:text-primary transition-colors">Products</Link>
          <Link to="/changelog" className="text-sm font-medium text-on-surface/70 hover:text-primary transition-colors">Changelog</Link>
          {user && (
            <>
              <Link to="/orders" className="text-sm font-medium text-on-surface/70 hover:text-primary transition-colors">My Orders</Link>
              <Link to="/profile" className="text-sm font-medium text-on-surface/70 hover:text-primary transition-colors">Profile</Link>
            </>
          )}
          {!user && (
            <>
              <Link to="/login" className="text-sm font-medium text-on-surface/70 hover:text-primary transition-colors">Login</Link>
              <Link to="/register" className="text-sm font-medium text-on-surface/70 hover:text-primary transition-colors">Register</Link>
            </>
          )}
        </nav>

        {/* Right: actions */}
        <div className="flex items-center gap-3">
          {/* Demo dropdown */}
          {demoAccounts.length > 0 && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDemoOpen(!demoOpen)}
                className="bg-primary text-on-primary text-xs font-bold px-4 py-2 rounded-full hover:bg-on-primary-container active:scale-95 transition-all duration-200"
              >
                Demo ▾
              </button>
              {demoOpen && (
                <div className="absolute right-0 top-full mt-2 bg-surface-container-lowest rounded-2xl shadow-xl border border-outline-variant/20 min-w-[220px] overflow-hidden z-50">
                  <div className="px-4 pt-4 pb-2 text-xs font-bold uppercase tracking-widest text-outline">Quick Login</div>
                  {demoAccounts.map((account) => (
                    <button
                      key={account.username}
                      className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-surface-container-high transition-colors disabled:opacity-50"
                      onClick={() => handleDemoLogin(account)}
                      disabled={loggingIn !== null}
                    >
                      <span className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-primary text-sm font-bold">
                        {account.display_name.charAt(0)}
                      </span>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-on-surface">{account.display_name}</div>
                        <div className="text-xs text-outline">{account.role}</div>
                      </div>
                      {loggingIn === account.username && (
                        <span className="text-primary text-xs font-bold animate-pulse">...</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Cart button */}
          <Link to="/cart" className="relative text-primary active:scale-95 duration-200">
            <span className="material-symbols-outlined">shopping_cart</span>
            {cart.total_items > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-error text-on-error text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {cart.total_items}
              </span>
            )}
          </Link>

          {/* User / Logout for desktop */}
          {user && (
            <button onClick={handleLogout} className="hidden lg:flex text-on-surface/60 hover:text-primary transition-colors active:scale-95">
              <span className="material-symbols-outlined">logout</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden bg-surface-container-lowest border-t border-outline-variant/20 px-6 py-4 space-y-3">
          <Link to="/" onClick={() => setMenuOpen(false)} className="block text-sm font-medium text-on-surface py-2">Products</Link>
          <Link to="/changelog" onClick={() => setMenuOpen(false)} className="block text-sm font-medium text-on-surface py-2">Changelog</Link>
          {user ? (
            <>
              <Link to="/orders" onClick={() => setMenuOpen(false)} className="block text-sm font-medium text-on-surface py-2">My Orders</Link>
              <Link to="/profile" onClick={() => setMenuOpen(false)} className="block text-sm font-medium text-on-surface py-2">Profile</Link>
              <button onClick={handleLogout} className="block text-sm font-medium text-error py-2">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="block text-sm font-medium text-on-surface py-2">Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="block text-sm font-medium text-on-surface py-2">Register</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}

export default Navbar;
