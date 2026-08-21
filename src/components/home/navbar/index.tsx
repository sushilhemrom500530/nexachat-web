'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MessageSquare, Menu, X, ArrowRight, BookOpen, Layers, Zap, Cpu } from 'lucide-react';
import { useAuth } from '@/context';
import { DOCS_URL } from '@/lib';

export function HomeNavbar() {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
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

        {/* Desktop Navigation Links */}
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
            href={DOCS_URL}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 hover:text-indigo-400 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>API Docs</span>
          </a>
        </nav>

        {/* Action CTA & Mobile Menu Trigger */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/chat"
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold transition-all duration-200"
          >
            <span>{user ? 'Open App' : 'Launch Web App'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          {/* Mobile hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950/95 backdrop-blur-2xl px-4 py-5 space-y-3 animate-fadeIn">
          <nav className="flex flex-col space-y-2 text-sm font-medium text-slate-300">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-slate-900 hover:text-white transition-colors"
            >
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>Features</span>
            </a>
            <a
              href="#interactive-demo"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-slate-900 hover:text-white transition-colors"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Interactive Live Demo</span>
            </a>
            <a
              href="#architecture"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-slate-900 hover:text-white transition-colors"
            >
              <Cpu className="w-4 h-4 text-purple-400" />
              <span>System Architecture</span>
            </a>
            <a
              href={DOCS_URL}
              target="_blank"
              rel="noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-slate-900 hover:text-white transition-colors"
            >
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>API Specification Docs</span>
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
