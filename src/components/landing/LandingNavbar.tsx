'use client';

import React from 'react';
import Link from 'next/link';
import { MessageSquare, Sparkles, ArrowRight, BookOpen, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export function LandingNavbar() {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/75 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-200">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base text-white tracking-tight leading-none group-hover:text-indigo-400 transition-colors">
              NexaChat
            </span>
            <span className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">
              Real-Time Protocol
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-slate-300">
          <a href="#features" className="hover:text-indigo-400 transition-colors">
            Features
          </a>
          <a href="#interactive-demo" className="hover:text-indigo-400 transition-colors">
            Live Demo
          </a>
          <a href="#architecture" className="hover:text-indigo-400 transition-colors">
            Architecture
          </a>
          <a
            href="https://frontend-task-chatapp.onrender.com/docs/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 hover:text-indigo-400 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>API Docs</span>
          </a>
        </nav>

        {/* Action CTA */}
        <div className="flex items-center gap-3">
          <Link
            href="/chat"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all duration-200 hover:shadow-indigo-500/40 active:scale-95"
          >
            <span>{user ? 'Open Workspace' : 'Launch Web App'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
