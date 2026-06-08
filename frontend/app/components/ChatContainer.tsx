"use client";

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { MessageBubble, type MessageProps } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { BotMessageSquare, AlertCircle, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface ConversationItem {
    _id: string;
    query: string;
    response: string;
    rating?: number;
}

export const ChatContainer: React.FC = () => {
    const { logout, user, isAdmin, isAuthenticated } = useAuth();
    const [messages, setMessages] = useState<MessageProps[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const fetchHistory = async () => {
            if (!isAuthenticated) return;
            try {
                const { data } = await axios.get(`${API_BASE_URL}/chat/history`);
                const formattedMessages: MessageProps[] = [];
                
                data.forEach((item: ConversationItem) => {
                    formattedMessages.push({
                        role: 'user',
                        content: item.query
                    });
                    formattedMessages.push({
                        id: item._id,
                        role: 'ai',
                        content: item.response,
                        rating: item.rating
                    });
                });
                
                setMessages(formattedMessages);
            } catch (err) {
                console.error('Error fetching history:', err);
                setError('Failed to load conversation history.');
            }
        };

        fetchHistory();
    }, [isAuthenticated]);

    const handleSend = async (content: string) => {
        setError(null);
        setIsLoading(true);

        const newUserMsg: MessageProps = { role: 'user', content };
        setMessages(prev => [...prev, newUserMsg]);

        try {
            const { data } = await axios.post(`${API_BASE_URL}/chat`, { message: content });
            
            const newAiMsg: MessageProps = {
                id: data.id,
                role: 'ai',
                content: data.response
            };
            
            setMessages(prev => [...prev, newAiMsg]);
        } catch (err: unknown) {
            console.error('Error sending message:', err);
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.error || 'Failed to send message. Please try again.');
            } else {
                setError('Failed to send message. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleRate = async (id: string, rating: number) => {
        try {
            await axios.post(`${API_BASE_URL}/chat/rating`, { conversationId: id, rating });
            
            const automatedResponse = rating === 1
                ? "Thank you for the positive feedback! We're glad we could help."
                : "I'm so sorry that response wasn't helpful. Your feedback is really important and helps me learn to assist you better next time.";

            setMessages(prev => [
                ...prev.map(msg => msg.id === id ? { ...msg, rating } : msg),
                { role: 'ai', content: automatedResponse }
            ]);
        } catch (err) {
            console.error('Error rating message:', err);
            setError('Failed to submit rating.');
        }
    };

    return (
        <div className="flex flex-col h-full max-w-4xl mx-auto w-full bg-slate-50/50 relative">
            <header className="flex items-center justify-between gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-10">
                <div className="flex items-center gap-2 sm:gap-3">
                    <div className="bg-blue-600 text-white p-1.5 sm:p-2 rounded-xl shadow-sm shrink-0">
                        <BotMessageSquare size={20} className="sm:w-6 sm:h-6" />
                    </div>
                    <div className="min-w-0">
                        <h1 className="text-base sm:text-xl font-semibold text-slate-800 truncate">Support Assistant</h1>
                        <p className="text-xs sm:text-sm text-slate-500 truncate">Logged in as {user?.username}</p>
                    </div>
                </div>
                <div className="flex items-center gap-1 sm:gap-3 shrink-0">
                    {isAdmin && (
                        <Link href="/admin" className="text-xs sm:text-sm text-blue-600 hover:underline font-medium px-2 sm:px-3 py-1 text-center">
                            Admin<span className="hidden sm:inline"> Dashboard</span>
                        </Link>
                    )}
                    <button 
                        onClick={logout}
                        className="p-1.5 sm:p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium"
                    >
                        <LogOut size={16} />
                        <span className="hidden sm:inline">Logout</span>
                    </button>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto px-2 sm:px-4 py-4 sm:py-6 md:px-8 custom-scrollbar">
                {messages.length === 0 && !isLoading ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4">
                        <BotMessageSquare size={48} className="opacity-20" />
                        <p>No messages yet. Ask me anything!</p>
                    </div>
                ) : (
                    messages.map((msg, index) => (
                        <MessageBubble 
                            key={msg.id || index} 
                            {...msg} 
                            onRate={handleRate} 
                        />
                    ))
                )}
                
                {error && (
                    <div className="flex items-center gap-2 p-4 mb-4 text-red-600 bg-red-50 rounded-lg text-sm mx-auto max-w-md">
                        <AlertCircle size={16} />
                        <p>{error}</p>
                    </div>
                )}
                
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 md:p-6 bg-linear-to-t from-slate-50 to-transparent sticky bottom-0">
                <div className="max-w-3xl mx-auto">
                    <ChatInput onSend={handleSend} isLoading={isLoading} />
                </div>
            </div>
        </div>
    );
};
