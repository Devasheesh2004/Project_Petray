"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { Users, MessageSquare, ArrowLeft, Loader2, ThumbsUp, ThumbsDown, LogOut } from 'lucide-react';
import Link from 'next/link';

const API_BASE_URL = '/api';

interface FeedbackItem {
    _id: string;
    userId: { username: string };
    createdAt: string;
    query: string;
    response: string;
    rating?: number;
}

export default function AdminDashboard() {
    const { isAdmin, isAuthenticated, logout } = useAuth();
    const router = useRouter();
    const [stats, setStats] = useState<{ totalUsers: number, feedbacks: FeedbackItem[] } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/');
            return;
        }

        if (!isAdmin) {
            router.push('/');
            return;
        }

        const fetchStats = async () => {
            try {
                const { data } = await axios.get(`${API_BASE_URL}/admin/stats`);
                setStats(data);
            } catch (err) {
                console.error("Failed to fetch stats", err);
                setError("Failed to load admin dashboard data.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, [isAuthenticated, isAdmin, router]);

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50">
                <Loader2 className="animate-spin text-blue-600" size={48} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col h-screen items-center justify-center bg-slate-50 p-4">
                <div className="bg-red-50 text-red-600 p-4 rounded-xl">
                    {error}
                </div>
                <Link href="/" className="mt-4 text-blue-600 hover:underline flex items-center gap-2">
                    <ArrowLeft size={16} /> Return to Home
                </Link>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50 py-10 px-4">
            <div className="max-w-5xl mx-auto space-y-8">
                <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Admin Dashboard</h1>
                        <p className="text-slate-500 text-xs sm:text-sm mt-1">Platform statistics and user feedback</p>
                    </div>
                    <button 
                        onClick={() => {
                            logout();
                            router.push('/');
                        }}
                        className="flex items-center gap-2 text-slate-500 hover:text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors font-medium text-sm sm:text-base w-full sm:w-auto justify-center sm:justify-start border sm:border-none border-slate-200"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
                        <div className="bg-blue-100 text-blue-600 p-3 sm:p-4 rounded-xl">
                            <Users size={28} className="sm:w-8 sm:h-8" />
                        </div>
                        <div>
                            <p className="text-xs sm:text-sm text-slate-500 font-medium">Total Registered Users</p>
                            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">{stats?.totalUsers || 0}</h2>
                        </div>
                    </div>
                    
                    <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
                        <div className="bg-green-100 text-green-600 p-3 sm:p-4 rounded-xl">
                            <MessageSquare size={28} className="sm:w-8 sm:h-8" />
                        </div>
                        <div>
                            <p className="text-xs sm:text-sm text-slate-500 font-medium">Total Rated Responses</p>
                            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">{stats?.feedbacks?.length || 0}</h2>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-4 sm:p-6 border-b border-slate-200 bg-slate-50/50">
                        <h2 className="text-base sm:text-lg font-semibold text-slate-800">Recent User Feedback</h2>
                    </div>
                    
                    <div className="divide-y divide-slate-100">
                        {stats?.feedbacks && stats.feedbacks.length > 0 ? (
                            stats.feedbacks.map((fb, index) => (
                                <div key={fb._id || index} className="p-4 sm:p-6 hover:bg-slate-50 transition-colors">
                                    <div className="flex flex-col sm:flex-row items-start sm:justify-between gap-4">
                                        <div className="space-y-3 flex-1 w-full min-w-0">
                                            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500">
                                                <span className="font-medium text-slate-700 truncate">@{fb.userId?.username || 'Unknown User'}</span>
                                                <span>•</span>
                                                <span className="truncate">{new Date(fb.createdAt).toLocaleString()}</span>
                                            </div>
                                            
                                            <div>
                                                <p className="text-xs sm:text-sm font-medium text-slate-800 mb-1">User Query:</p>
                                                <p className="text-sm text-slate-600 bg-slate-100 p-2 sm:p-3 rounded-xl wrap-break-words">{fb.query}</p>
                                            </div>
                                            
                                            <div>
                                                <p className="text-xs sm:text-sm font-medium text-slate-800 mb-1">AI Response:</p>
                                                <p className="text-sm text-slate-600 bg-slate-50 border border-slate-100 p-2 sm:p-3 rounded-xl whitespace-pre-wrap wrap-break-words">{fb.response}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex sm:flex-col items-center justify-start sm:justify-center p-2 sm:p-3 rounded-xl mt-2 sm:mt-8 w-full sm:w-auto">
                                            {fb.rating === 1 ? (
                                                <div className="flex sm:flex-col items-center gap-2 sm:gap-0 text-green-600 bg-green-50 p-2 sm:p-3 rounded-xl w-full sm:w-auto justify-center">
                                                    <ThumbsUp size={20} className="sm:mb-1 sm:w-6 sm:h-6" />
                                                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Helpful</span>
                                                </div>
                                            ) : (
                                                <div className="flex sm:flex-col items-center gap-2 sm:gap-0 text-red-600 bg-red-50 p-2 sm:p-3 rounded-xl w-full sm:w-auto justify-center">
                                                    <ThumbsDown size={20} className="sm:mb-1 sm:w-6 sm:h-6" />
                                                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Not Helpful</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-10 text-center text-slate-500">
                                <MessageSquare size={48} className="mx-auto mb-4 opacity-20" />
                                <p>No feedback has been submitted yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
