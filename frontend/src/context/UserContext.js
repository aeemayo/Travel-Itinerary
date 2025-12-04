import React, { createContext, useState, useEffect, useContext } from 'react';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check localStorage for saved user on mount
        const savedUser = localStorage.getItem('travel_user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = (userData) => {
        setUser(userData);
        try {
            localStorage.setItem('travel_user', JSON.stringify(userData));
        } catch (error) {
            console.error("Failed to save user to localStorage:", error);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('travel_user');
    };

    const updateProfile = (updates) => {
        const updatedUser = { ...user, ...updates };
        setUser(updatedUser);
        try {
            localStorage.setItem('travel_user', JSON.stringify(updatedUser));
        } catch (error) {
            console.error("Failed to save user to localStorage:", error);
            alert("Failed to save changes. Storage might be full.");
        }
    };

    return (
        <UserContext.Provider value={{ user, login, logout, updateProfile, loading }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
