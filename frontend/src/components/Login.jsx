import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

function Login() {
  const { login } = useAuth();
  const { fetchCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.username, form.password);
      await fetchCart();
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed.');
    } finally { setLoading(false); }
  };

  const inputClass = "w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all";

  return (
    <div className="py-8 flex items-center justify-center min-h-[60vh]">
      <div className="w-full max-w-md bg-surface-container-lowest p-8 rounded-3xl shadow-sm border border-outline-variant/10">
        <div className="text-center mb-8">
          <span className="material-symbols-outlined text-5xl text-primary mb-2">account_circle</span>
          <h1 className="text-2xl font-extrabold">Welcome Back</h1>
          <p className="text-sm text-outline mt-1">Sign in to your account</p>
        </div>
        {error && (
          <div className="bg-error-container text-on-error-container p-3 rounded-xl mb-4 text-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">error</span>{error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-outline mb-1.5">Username</label>
            <input type="text" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required className={inputClass} />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-outline mb-1.5">Password</label>
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required className={inputClass} />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-primary text-on-primary rounded-full py-4 font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? <><span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>Logging in...</> : 'Login'}
          </button>
        </form>
        <p className="text-center mt-6 text-sm text-outline">
          Don't have an account? <Link to="/register" className="text-primary font-semibold hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
