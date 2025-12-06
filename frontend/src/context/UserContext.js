import React, { createContext, useState, useEffect, useContext } from 'react';
import API_BASE_URL from '../config';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const UserContext = createContext(null);


export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [itineraries, setItineraries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Listen for Firebase auth state changes
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                // User is signed in
                const userData = {
                    id: firebaseUser.uid,
                    email: firebaseUser.email,
                    name: firebaseUser.displayName || '',
                    avatar: firebaseUser.photoURL || '',
                    joinedDate: new Date().toLocaleDateString()
                };
                setUser(userData);
                localStorage.setItem('travel_user', JSON.stringify(userData));
                fetchItineraries(firebaseUser.email);
            } else {
                // User is signed out
                setUser(null);
                setItineraries([]);
                localStorage.removeItem('travel_user');
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const fetchItineraries = async (email) => {
        if (!email) return;
        try {
            const response = await fetch(`${API_BASE_URL}/api/user/itineraries?email=${encodeURIComponent(email)}`);
            const data = await response.json();
            if (data.success) {
                setItineraries(data.itineraries || []);
            }
        } catch (error) {
            console.error("Failed to fetch itineraries:", error);
        }
    };

    const login = (userData) => {
        setUser(userData);
        try {
            localStorage.setItem('travel_user', JSON.stringify(userData));
            fetchItineraries(userData.email);
        } catch (error) {
            console.error("Failed to save user to localStorage:", error);
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            // State cleanup is handled by onAuthStateChanged
        } catch (error) {
            console.error("Failed to sign out:", error);
        }
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

    const saveItinerary = async (itinerary) => {
        if (!user?.email) return { success: false, error: 'Not logged in' };
        
        try {
            const itineraryData = {
                email: user.email,
                id: itinerary.id || String(Date.now()),
                destination: itinerary.destination,
                days: itinerary.days,
                budget: itinerary.budget,
                content: itinerary.content,
                imageUrl: itinerary.imageUrl,
                interests: itinerary.interests || [],
                createdAt: itinerary.createdAt || new Date().toISOString(),
                status: itinerary.status || 'planned'
            };

            const response = await fetch(`${API_BASE_URL}/api/user/save-itinerary`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(itineraryData)
            });

            const data = await response.json();
            
            if (data.success) {
                // Add to local state
                setItineraries(prev => [data.itinerary, ...prev].slice(0, 20));
                return { success: true, itinerary: data.itinerary };
            }
            return { success: false, error: data.error };
        } catch (error) {
            console.error("Failed to save itinerary:", error);
            return { success: false, error: error.message };
        }
    };

    const deleteItinerary = async (itineraryId) => {
        if (!user?.email) return { success: false, error: 'Not logged in' };
        
        try {
            const response = await fetch(`${API_BASE_URL}/api/user/delete-itinerary`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: user.email, itineraryId })
            });

            const data = await response.json();
            
            if (data.success) {
                setItineraries(prev => prev.filter(it => it.id !== itineraryId));
                return { success: true };
            }
            return { success: false, error: data.error };
        } catch (error) {
            console.error("Failed to delete itinerary:", error);
            return { success: false, error: error.message };
        }
    };

    const refreshItineraries = () => {
        if (user?.email) {
            fetchItineraries(user.email);
        }
    };

    return (
        <UserContext.Provider value={{ 
            user, 
            login, 
            logout, 
            updateProfile, 
            loading,
            itineraries,
            saveItinerary,
            deleteItinerary,
            refreshItineraries
        }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
