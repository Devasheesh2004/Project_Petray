"use client";

import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const API_BASE_URL = '/api';

export const AuthScreen: React.FC = () => {
    const { login } = useAuth();
    const [isLoginView, setIsLoginView] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const endpoint = isLoginView ? '/auth/login' : '/auth/register';
            const { data } = await axios.post(`${API_BASE_URL}${endpoint}`, { username, password });
            
            login(data.user);
        } catch (err: unknown) {
            console.error('Auth error:', err);
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.error || 'Authentication failed. Please try again.');
            } else {
                setError('Authentication failed. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-slate-800">
                        {isLoginView ? 'Welcome Back' : 'Create Account'}
                    </h1>
                    <p className="text-sm text-slate-500 mt-2">
                        {isLoginView ? 'Enter your details to sign in' : 'Sign up to get started'}
                    </p>
                </div>

                {error && (
                    <div className="flex items-center gap-2 p-3 mb-6 text-red-600 bg-red-50 border border-red-100 rounded-lg text-sm">
                        <AlertCircle size={16} className="shrink" />
                        <p>{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                        <input 
                            type="text"
                            required
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all"
                            placeholder="Enter your username"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                        <div className="relative">
                            <input 
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="w-full px-4 py-2 pr-12 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all"
                                placeholder="Enter your password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>
                    
                    <button 
                        type="submit"
                        disabled={isLoading}
                        className={cn(
                            "w-full flex items-center justify-center py-2.5 rounded-xl text-white font-medium transition-all mt-6",
                            isLoading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 shadow-sm"
                        )}
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={20} /> : (isLoginView ? 'Sign In' : 'Sign Up')}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-slate-500">
                    {isLoginView ? "Don't have an account? " : "Already have an account? "}
                    <button 
                        onClick={() => {
                            setIsLoginView(!isLoginView);
                            setError(null);
                        }}
                        className="text-blue-600 hover:underline font-medium"
                    >
                        {isLoginView ? 'Sign Up' : 'Sign In'}
                    </button>
                </div>
            </div>
        </div>
    );
};
