"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChatContainer } from './components/ChatContainer';
import { AuthScreen } from './components/AuthScreen';
import { useAuth } from './context/AuthContext';

export default function Home() {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      router.push('/admin');
    }
  }, [isAuthenticated, isAdmin, router]);

  if (isLoading || (isAuthenticated && isAdmin)) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <main className="flex h-screen w-full flex-col bg-slate-50">
      {isAuthenticated ? <ChatContainer /> : <AuthScreen />}
    </main>
  );
}
