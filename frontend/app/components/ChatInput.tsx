import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ChatInputProps {
    onSend: (message: string) => void;
    isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, isLoading }) => {
    const [message, setMessage] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (message.trim() && !isLoading) {
            onSend(message.trim());
            setMessage('');
            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
        }
    }, [message]);

    return (
        <form 
            onSubmit={handleSubmit}
            className="relative flex items-end w-full bg-white rounded-2xl border border-slate-200 shadow-sm focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-300 transition-all p-2"
        >
            <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask a support question..."
                className="w-full max-h-[150px] min-h-[44px] bg-transparent resize-none outline-none px-4 py-3 text-slate-800 placeholder-slate-400"
                rows={1}
                disabled={isLoading}
            />
            <button
                type="submit"
                disabled={!message.trim() || isLoading}
                className={cn(
                    "shrink-0 p-3 rounded-xl mb-1 mr-1 transition-all",
                    message.trim() && !isLoading
                        ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md"
                        : "bg-slate-100 text-slate-400 cursor-not-allowed"
                )}
            >
                {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
            </button>
        </form>
    );
};
