import React from 'react';
import { ThumbsUp, ThumbsDown, User, Bot } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface MessageProps {
    id?: string;
    role: 'user' | 'ai';
    content: string;
    rating?: number;
    onRate?: (id: string, rating: number) => void;
}

export const MessageBubble: React.FC<MessageProps> = ({ id, role, content, rating, onRate }) => {
    const isUser = role === 'user';

    return (
        <div className={cn('flex w-full mb-6', isUser ? 'justify-end' : 'justify-start')}>
            <div className={cn(
                'flex max-w-[95%] sm:max-w-[80%] rounded-2xl p-3 sm:p-4 shadow-sm',
                isUser ? 'bg-primary text-primary-foreground ml-4 sm:ml-12 rounded-tr-none' : 'bg-card text-card-foreground border border-border mr-4 sm:mr-12 rounded-tl-none'
            )}>
                {!isUser && (
                    <div className="shrink-0 mr-3 sm:mr-4 mt-1">
                        <div className="bg-blue-100 text-blue-600 p-1.5 sm:p-2 rounded-full">
                            <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                    </div>
                )}
                
                <div className="flex flex-col min-w-0 flex-1">
                    <div className="whitespace-pre-wrap leading-relaxed wrap-break-words text-sm sm:text-base">
                        {content}
                    </div>
                    
                    {!isUser && id && (
                        <div className="flex items-center gap-3 mt-4 pt-3 border-t border-slate-100">
                            <span className="text-xs text-slate-400">Was this helpful?</span>
                            <button 
                                onClick={() => onRate && onRate(id, 1)}
                                className={cn(
                                    "p-1.5 rounded-md transition-colors hover:bg-slate-100 text-slate-400",
                                    rating === 1 && "text-green-500 bg-green-50"
                                )}
                                aria-label="Helpful"
                            >
                                <ThumbsUp size={16} />
                            </button>
                            <button 
                                onClick={() => onRate && onRate(id, 0)}
                                className={cn(
                                    "p-1.5 rounded-md transition-colors hover:bg-slate-100 text-slate-400",
                                    rating === 0 && "text-red-500 bg-red-50"
                                )}
                                aria-label="Not Helpful"
                            >
                                <ThumbsDown size={16} />
                            </button>
                        </div>
                    )}
                </div>

                {isUser && (
                    <div className="shrink-0 ml-4 mt-1">
                        <div className="bg-blue-600 text-white p-2 rounded-full">
                            <User size={20} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
