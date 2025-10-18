import { createContext, useState, useContext, useEffect } from 'react';
import axios from '../config/axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await axios.post('/api/users/login', { email, password });
      localStorage.setItem('userInfo', JSON.stringify(data.data));
      setUser(data.data);
      toast.success('Login successful!');
      return data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      throw error;
    }
  };

  const register = async (name, email, password) => {
    try {
      const { data } = await axios.post('/api/users/register', { name, email, password });
      localStorage.setItem('userInfo', JSON.stringify(data.data));
      setUser(data.data);
      toast.success('Registration successful!');
      return data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
    toast.success('Logged out successfully');
  };

  const updateProfile = async (userData) => {
    try {
      const { data } = await axios.put('/api/users/profile', userData);
      localStorage.setItem('userInfo', JSON.stringify(data.data));
      setUser(data.data);
      toast.success('Profile updated successfully!');
      return data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
      throw error;
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateProfile,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

