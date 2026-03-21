import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await api.get('/accounts/check/');
      setUser(res.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    const res = await api.post('/accounts/login/', { username, password });
    setUser(res.data);
    return res.data;
  };

  const register = async (data) => {
    const res = await api.post('/accounts/register/', data);
    setUser(res.data);
    return res.data;
  };

  const logout = async () => {
    await api.post('/accounts/logout/');
    setUser(null);
  };

  const updateProfile = async (data) => {
    const res = await api.patch('/accounts/profile/update/', data);
    setUser(res.data);
    return res.data;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
