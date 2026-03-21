import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Profile() {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({});
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    setForm({
      email: user.email || '', first_name: user.first_name || '', last_name: user.last_name || '',
      phone: user.profile?.phone || '', address_1: user.profile?.address_1 || '', address_2: user.profile?.address_2 || '',
      city: user.profile?.city || '', state: user.profile?.state || '', zip_code: user.profile?.zip_code || '',
      country: user.profile?.country || 'US',
    });
  }, [user, navigate]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setMessage(''); setLoading(true);
    try {
      await updateProfile(form);
      setMessage('Profile updated successfully.');
    } catch (err) { setError(err.response?.data?.error || 'Update failed.'); }
    finally { setLoading(false); }
  };

  if (!user) return null;

  const inputClass = "w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all";
  const labelClass = "block text-xs font-bold uppercase tracking-wider text-outline mb-1.5";

  return (
    <div className="py-8 max-w-2xl mx-auto">
      <div className="bg-surface-container-lowest p-8 rounded-3xl shadow-sm border border-outline-variant/10">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-primary-container flex items-center justify-center">
            <span className="material-symbols-outlined text-3xl text-primary">person</span>
          </div>
          <div>
            <h1 className="text-2xl font-extrabold">My Profile</h1>
            <p className="text-sm text-outline">@{user.username}</p>
          </div>
        </div>

        {message && (
          <div className="bg-secondary-container text-on-secondary-container p-3 rounded-xl mb-4 text-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">check_circle</span>{message}
          </div>
        )}
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
          <div><label className={labelClass}>Email</label><input type="email" name="email" value={form.email} onChange={handleChange} className={inputClass} /></div>
          <div><label className={labelClass}>Phone</label><input type="tel" name="phone" value={form.phone} onChange={handleChange} className={inputClass} /></div>

          <div className="border-t border-outline-variant/20 pt-4 mt-6">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-outline mb-4">Shipping Address</h2>
            <div className="space-y-4">
              <div><label className={labelClass}>Address Line 1</label><input type="text" name="address_1" value={form.address_1} onChange={handleChange} className={inputClass} /></div>
              <div><label className={labelClass}>Address Line 2</label><input type="text" name="address_2" value={form.address_2} onChange={handleChange} className={inputClass} /></div>
              <div className="grid grid-cols-3 gap-4">
                <div><label className={labelClass}>City</label><input type="text" name="city" value={form.city} onChange={handleChange} className={inputClass} /></div>
                <div><label className={labelClass}>State</label><input type="text" name="state" value={form.state} onChange={handleChange} className={inputClass} /></div>
                <div><label className={labelClass}>ZIP Code</label><input type="text" name="zip_code" value={form.zip_code} onChange={handleChange} className={inputClass} /></div>
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading} className="mt-6 bg-primary text-on-primary rounded-full py-4 px-8 font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? <><span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>Saving...</> : <><span className="material-symbols-outlined text-lg">save</span>Update Profile</>}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;
