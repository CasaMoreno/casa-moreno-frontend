import axios from 'axios';

const apiClient = axios.create({
    // ALTERAÇÃO AQUI: Apontando para o seu novo backend na AWS
    baseURL: 'https://api.casa-moreno.com',
    //baseURL: 'http://localhost:8085',
    headers: {
        'Content-Type': 'application/json',
    },
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

export default apiClient;