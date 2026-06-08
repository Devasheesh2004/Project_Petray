"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface User {
    id: string;
    username: string;
    isAdmin: boolean;
}

interface AuthContextType {
    user: User | null;
    login: (user: User) => void;
    logout: () => void;
    isAuthenticated: boolean;
    isAdmin: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Configure Axios default to automatically send cookies with every request
axios.defaults.withCredentials = true;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data } = await axios.get(`${API_BASE_URL}/auth/me`);
                setUser(data.user);
            } catch {
                console.log("No valid session found.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchUser();
    }, []);

    const login = (newUser: User) => {
        setUser(newUser);
    };

    const logout = async () => {
        try {
            await axios.post(`${API_BASE_URL}/auth/logout`);
        } catch (e) {
            console.error("Logout error", e);
        } finally {
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            login,
            logout,
            isAuthenticated: !!user,
            isAdmin: user?.isAdmin || false,
            isLoading,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
