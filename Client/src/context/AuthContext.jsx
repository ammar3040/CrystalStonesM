import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    };

    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => {
        return localStorage.getItem('token') || getCookie('token');
    });

    const getUserFromCookie = () => {
        try {
            const cookies = document.cookie.split('; ');
            const userCookie = cookies.find(c => c.startsWith('user='));
            if (userCookie) {
                const cookieValue = decodeURIComponent(userCookie.split('=')[1]);
                if (cookieValue === 'undefined') return null;

                // Handle Express-style "j:" prefix
                const jsonString = cookieValue.startsWith('j:')
                    ? cookieValue.substring(2)
                    : cookieValue;

                const parsedUser = JSON.parse(jsonString);
                // Standardize uid vs id
                if (parsedUser && !parsedUser.uid && parsedUser.id) {
                    parsedUser.uid = parsedUser.id;
                }
                return parsedUser;
            }
        } catch (err) {
            console.error('Failed to parse user cookie:', err);
        }
        return null;
    };

    // Initialize state
    useEffect(() => {
        const initialUser = getUserFromCookie();
        setUser(initialUser);

        // If we found a token in cookie but not in localStorage, sync it
        const cookieToken = getCookie('token');
        if (cookieToken && !localStorage.getItem('token')) {
            localStorage.setItem('token', cookieToken);
        }
    }, []);

    // Function to handle login
    const login = (userData, userToken) => {
        if (userToken) {
            localStorage.setItem('token', userToken);
            setToken(userToken);
        }

        // Standardize uid
        if (userData && !userData.uid && userData.id) {
            userData.uid = userData.id;
        }

        setUser(userData);
    };

    // Function to handle logout
    const logout = () => {
        localStorage.removeItem('token');
        // Also clear the token cookie
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        setToken(null);
        setUser(null);
        // Redirect will be handled by window.location.href in components if needed,
        // but clearing state here is essential for UI reactivity.
        window.location.href = `${import.meta.env.VITE_API_URL}/logout`;
    };

    // Sync state if cookies change (optional, but good for reactivity)
    useEffect(() => {
        const handleCookieChange = () => {
            const currentUser = getUserFromCookie();
            setUser(currentUser);
            const currentToken = localStorage.getItem('token') || getCookie('token');
            setToken(currentToken);
        };

        // Since there's no native cookie change listener, we can poll or rely on actions.
        // For now, let's just listen for storage changes (for token) and manual triggers.
        window.addEventListener('storage', (e) => {
            if (e.key === 'token') {
                setToken(e.newValue);
                setUser(getUserFromCookie());
            }
        });

        // Add a small interval to check for cookie changes (e.g., after Google auth redirect)
        const interval = setInterval(() => {
            const currentUser = getUserFromCookie();
            if (JSON.stringify(currentUser) !== JSON.stringify(user)) {
                setUser(currentUser);
            }
            const currentToken = localStorage.getItem('token') || getCookie('token');
            if (currentToken !== token) {
                setToken(currentToken);
                if (currentToken) localStorage.setItem('token', currentToken);
            }
        }, 2000);

        return () => {
            window.removeEventListener('storage', handleCookieChange);
            clearInterval(interval);
        };
    }, [user, token]);

    const value = {
        user,
        token,
        isLoggedIn: !!user,
        login,
        logout,
        refreshUser: () => setUser(getUserFromCookie())
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
