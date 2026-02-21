import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

// Request interceptor for JWT
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 429) {
            toast.error('Too many requests. Please slow down.');
        } else if (error.response?.status === 401) {
            // Handle unauthorized (optional: logout user)
            localStorage.removeItem('token');
        }
        return Promise.reject(error);
    }
);

export default api;
