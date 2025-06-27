import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://api.casa-moreno.com',
  //baseURL: 'http://localhost:8085',
});

apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor para lidar com respostas de erro globalmente
apiClient.interceptors.response.use(
  (response) => {
    // Se a resposta for bem-sucedida, apenas a retorna
    return response;
  },
  (error) => {
    // Verifica se o erro é de autenticação (401 Unauthorized)
    if (error.response && error.response.status === 401) {
      // Apenas executa no lado do cliente (navegador)
      if (typeof window !== 'undefined') {
        console.error("Sessão expirada ou inválida. Redirecionando para o login.");

        // Limpa os dados de autenticação
        localStorage.removeItem('authToken');
        document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';

        // Redireciona para a página de login para evitar a "sessão esquisita"
        // Usamos window.location para forçar um recarregamento completo da aplicação
        window.location.href = '/auth/login';
      }
    }
    // Para outros erros, apenas os repassa
    return Promise.reject(error);
  }
);

export default apiClient;