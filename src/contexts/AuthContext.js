// src/contexts/AuthContext.js (VERSÃO COM COOKIES)

import { createContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import apiClient from '@/api/axios';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp * 1000 < Date.now()) {
          logout();
        } else {
          setUser({
            username: decodedToken.sub,
            userId: decodedToken['user id'],
            scope: decodedToken.scope,
          });
        }
      } catch (error) {
        console.error("Invalid token");
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await apiClient.post('/login', { username, password });
      const { token } = response.data;

      // Salva tanto no localStorage quanto no cookie
      localStorage.setItem('authToken', token);
      document.cookie = `authToken=${token}; path=/; max-age=86400; SameSite=Lax`; // Cookie de 1 dia

      const decodedToken = jwtDecode(token);

      setUser({
        username: decodedToken.sub,
        userId: decodedToken['user id'],
        scope: decodedToken.scope,
      });

      router.push('/');
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('Usuário ou senha inválidos.');
    }
  };

  const logout = () => {
    // Remove de ambos os lugares
    localStorage.removeItem('authToken');
    document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'; // Expira o cookie

    setUser(null);
    router.push('/auth/login');
  };

  const register = async (userData) => {
    try {
      await apiClient.post('/users/create', userData);
      router.push('/auth/login');
    } catch (error) {
      console.error('Registration failed:', error);
      throw new Error('Erro ao registrar. Tente novamente.');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;