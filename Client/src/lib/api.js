import axios from 'axios';
import toast from 'react-hot-toast';

// Helper to get cookie by name
const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
};

const getBaseURL = () => {
    let url = import.meta.env.VITE_API_URL || '';
    if (url.endsWith('/')) url = url.slice(0, -1);
    // Ensure it ends with /api but not /api/api
    if (!url.endsWith('/api')) {
        url += '/api';
    }
    return url;
};

const api = axios.create({
    baseURL: getBaseURL(),
    withCredentials: true,
});

// Request interceptor for JWT
api.interceptors.request.use(
    (config) => {
        let token = localStorage.getItem('token');

        // Fallback to cookie if localStorage is empty (e.g., after Google Login)
        if (!token) {
            token = getCookie('token');
        }

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
