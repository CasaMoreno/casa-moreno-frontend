import { createContext, useState, useEffect, useCallback } from 'react';
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
            userId: decodedToken.userId,
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

      localStorage.setItem('authToken', token);
      document.cookie = `authToken=${token}; path=/; max-age=86400; SameSite=Lax`;

      const decodedToken = jwtDecode(token);

      setUser({
        username: decodedToken.sub,
        userId: decodedToken.userId,
        scope: decodedToken.scope,
      });

      router.push('/');
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('Usuário ou senha inválidos.');
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';

    setUser(null);
    router.push('/auth/login');
  };

  // --- INÍCIO DA ALTERAÇÃO ---
  const register = async (userData) => {
    try {
      // Modificado para retornar os dados do usuário criado
      const response = await apiClient.post('/users/create', userData);
      return response.data;
    } catch (error) {
      console.error('Registration failed:', error);
      // Extrai a mensagem de erro da resposta da API, se disponível
      const errorMessage = error.response?.data?.message || 'Erro ao registrar. Verifique os dados e tente novamente.';
      throw new Error(errorMessage);
    }
  };
  // --- FIM DA ALTERAÇÃO ---

  const handleOauthToken = useCallback((token) => {
    if (typeof token !== 'string') {
      console.error("OAuth token is invalid or missing.");
      router.push('/auth/login?error=Falha na autenticação.');
      return;
    }

    try {
      localStorage.setItem('authToken', token);
      document.cookie = `authToken=${token}; path=/; max-age=86400; SameSite=Lax`;

      const decodedToken = jwtDecode(token);

      setUser({
        username: decodedToken.sub,
        userId: decodedToken.userId,
        scope: decodedToken.scope,
      });

      router.push('/');
    } catch (error) {
      console.error("Failed to process OAuth token:", error);
      localStorage.removeItem('authToken');
      document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      setUser(null);
      router.push('/auth/login');
    }
  }, [router]);


  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, handleOauthToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;