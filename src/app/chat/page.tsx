'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useChat } from '@/context/ChatContext';
import { Sidebar } from '@/components/chat/Sidebar';
import { ChatArea } from '@/components/chat/ChatArea';
import { LoginModal } from '@/components/auth/LoginModal';
import Link from 'next/link';
import { MessageSquare, Sparkles, ExternalLink, Globe } from 'lucide-react';

function ChatWorkspace() {
  const { user, isLoading } = useAuth();
  const { activeConversation, selectConversation } = useChat();
  const [mobileView, setMobileView] = useState<'sidebar' | 'chat'>('sidebar');

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4 animate-bounce">
          <MessageSquare className="w-6 h-6" />
        </div>
        <p className="text-sm font-medium text-slate-300">Initializing NexaChat...</p>
      </div>
    );
  }

  if (!user) {
    return <LoginModal isOpen={true} />;
  }

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Top Navbar */}
      <nav className="h-12 px-4 bg-slate-950 border-b border-slate-800/80 flex items-center justify-between z-20 select-none">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 text-white font-bold text-sm tracking-tight hover:opacity-90 transition-opacity"
          >
            <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs">
              <MessageSquare className="w-3.5 h-3.5" />
            </div>
            <span>NexaChat</span>
          </Link>
          <span className="text-slate-600 text-xs hidden sm:inline">|</span>
          <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">Live Workspace</span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-medium transition-all"
          >
            <Globe className="w-3.5 h-3.5 text-indigo-400" />
            <span>Landing Page</span>
          </Link>
        </div>
      </nav>

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar Panel */}
        <div
          className={`w-full md:w-80 lg:w-96 flex-shrink-0 h-full ${
            activeConversation && mobileView === 'chat' ? 'hidden md:flex' : 'flex'
          }`}
        >
          <Sidebar />
        </div>

        {/* Chat Panel */}
        <div
          className={`flex-1 h-full ${
            !activeConversation || mobileView === 'sidebar' ? 'hidden md:flex' : 'flex'
          }`}
        >
          <ChatArea
            onBackToSidebar={() => {
              setMobileView('sidebar');
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return <ChatWorkspace />;
}
