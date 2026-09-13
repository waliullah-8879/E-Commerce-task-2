import { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';
import { api } from '../lib/api';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const { showToast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem('northstar_token');
    if (!token) return;

    api('/auth/me')
      .then(data => setUser(data))
      .catch(() => {
        localStorage.removeItem('northstar_token');
        setUser(null);
      });
  }, []);

  const login = async (email, password) => {
    try {
      const data = await api('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem('northstar_token', data.token);
      setUser(data.user);
      showToast(`Welcome back, ${data.user.name}!`, 'success');
      return true;
    } catch (err) {
      showToast(err.message, 'error');
      return false;
    }
  };

  const register = async (name, email, password) => {
    try {
      const data = await api('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      });
      localStorage.setItem('northstar_token', data.token);
      setUser(data.user);
      showToast(`Welcome to Northstar, ${data.user.name}!`, 'success');
      return true;
    } catch (err) {
      showToast(err.message, 'error');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('northstar_token');
    setUser(null);
    showToast('Logged out.', 'info');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
