import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function BottomNav() {
  const location = useLocation();
  const { user } = useAuth();
  const path = location.pathname;

  const navItems = [
    { to: '/', icon: 'home', label: 'Home', match: (p) => p === '/' },
    { to: '/cart', icon: 'shopping_cart', label: 'Cart', match: (p) => p === '/cart' },
    { to: user ? '/orders' : '/login', icon: 'receipt_long', label: 'Orders', match: (p) => p.startsWith('/orders') },
    { to: user ? '/profile' : '/login', icon: 'person', label: 'Account', match: (p) => p === '/profile' || p === '/login' || p === '/register' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-6 pt-3 bg-surface-container-lowest/90 backdrop-blur-2xl rounded-t-3xl z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.04)] border-t border-outline-variant/10 lg:hidden">
      {navItems.map((item) => {
        const active = item.match(path);
        return (
          <Link
            key={item.to}
            to={item.to}
            className={`flex flex-col items-center justify-center px-4 py-2 transition-all duration-300 active:scale-90 ${
              active
                ? 'bg-primary-container text-on-primary-container rounded-full px-5 scale-110'
                : 'text-on-surface/40 hover:text-primary'
            }`}
          >
            <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
            <span className="font-label text-[11px] font-semibold mt-0.5">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export default BottomNav;
