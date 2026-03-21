import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

function Register() {
  const { register } = useAuth();
  const { fetchCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '', password_confirm: '', first_name: '', last_name: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      await fetchCart();
      navigate('/');
    } catch (err) {
      const data = err.response?.data;
      if (typeof data === 'object') setError(Object.values(data).flat().join(' '));
      else setError('Registration failed.');
    } finally { setLoading(false); }
  };

  const inputClass = "w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all";
  const labelClass = "block text-xs font-bold uppercase tracking-wider text-outline mb-1.5";

  return (
    <div className="py-8 flex items-center justify-center min-h-[60vh]">
      <div className="w-full max-w-md bg-surface-container-lowest p-8 rounded-3xl shadow-sm border border-outline-variant/10">
        <div className="text-center mb-8">
          <span className="material-symbols-outlined text-5xl text-primary mb-2">person_add</span>
          <h1 className="text-2xl font-extrabold">Create Account</h1>
          <p className="text-sm text-outline mt-1">Join Kid Palace today</p>
        </div>
        {error && (
          <div className="bg-error-container text-on-error-container p-3 rounded-xl mb-4 text-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">error</span>{error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelClass}>First Name</label><input type="text" name="first_name" value={form.first_name} onChange={handleChange} className={inputClass} /></div>
            <div><label className={labelClass}>Last Name</label><input type="text" name="last_name" value={form.last_name} onChange={handleChange} className={inputClass} /></div>
          </div>
          <div><label className={labelClass}>Username *</label><input type="text" name="username" value={form.username} onChange={handleChange} required className={inputClass} /></div>
          <div><label className={labelClass}>Email *</label><input type="email" name="email" value={form.email} onChange={handleChange} required className={inputClass} /></div>
          <div><label className={labelClass}>Password *</label><input type="password" name="password" value={form.password} onChange={handleChange} required minLength={8} className={inputClass} /></div>
          <div><label className={labelClass}>Confirm Password *</label><input type="password" name="password_confirm" value={form.password_confirm} onChange={handleChange} required className={inputClass} /></div>
          <button type="submit" disabled={loading} className="w-full bg-primary text-on-primary rounded-full py-4 font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? <><span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>Creating...</> : 'Register'}
          </button>
        </form>
        <p className="text-center mt-6 text-sm text-outline">
          Already have an account? <Link to="/login" className="text-primary font-semibold hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
