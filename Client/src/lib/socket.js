import { io } from 'socket.io-client';

// Helper to get cookie
const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
};

// Ensure socket connects to the ROOT domain, not /api
const getSocketURL = () => {
    const url = import.meta.env.VITE_API_URL || '';
    try {
        const origin = new URL(url).origin;
        return origin;
    } catch {
        return url.replace(/\/api$/, '');
    }
};

const socket = io(getSocketURL(), {
    auth: (cb) => {
        cb({
            token: localStorage.getItem('token') || getCookie('token')
        });
    },
    autoConnect: false,
    transports: ['polling', 'websocket'], // Try both
});

export default socket;
