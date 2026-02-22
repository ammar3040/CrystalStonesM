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
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));

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
        };

        // Since there's no native cookie change listener, we can poll or rely on actions.
        // For now, let's just listen for storage changes (for token) and manual triggers.
        window.addEventListener('storage', (e) => {
            if (e.key === 'token') {
                setToken(e.newValue);
                setUser(getUserFromCookie());
            }
        });

        return () => window.removeEventListener('storage', handleCookieChange);
    }, []);

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
