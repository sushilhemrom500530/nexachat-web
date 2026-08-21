'use client';

import React from 'react';
import Link from 'next/link';
import { MessageSquare, Home, BookOpen } from 'lucide-react';
import { DOCS_URL } from '@/lib';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden text-slate-100 selection:bg-indigo-500 selection:text-white select-none">
      {/* Ambient Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-600/15 via-purple-600/15 to-transparent blur-[130px] rounded-full pointer-events-none -z-10" />

      {/* Main Card */}
      <div className="relative w-full text-center overflow-hidden">
        {/* Prominent 404 Text */}
        <div className="mb-4">
          <span className="text-6xl sm:text-7xl font-black bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent tracking-tight">
            404
          </span>
        </div>

        {/* Headline & Description */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
          Page Not Found
        </h1>
        <p className="text-sm text-slate-400 leading-relaxed max-w-sm mx-auto mb-8 font-normal">
          The conversation thread or destination you are looking for has moved, expired, or does not exist in our real-time protocol.
        </p>

        {/* Primary Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-slate-200 hover:text-white text-xs font-semibold shadow-sm transition-all"
          >
            <Home className="w-4 h-4 text-slate-400" />
            <span>Back to Home</span>
          </Link>

          <Link
            href="/chat"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Launch Live Chat</span>
          </Link>
        </div>

        {/* Quick Links Footer */}
        <div className="mt-8 pt-6 border-t border-t-slate-800/80 flex items-center justify-center gap-6 text-xs text-slate-400">
          <Link
            href="/auth/login"
            className="hover:text-indigo-400 transition-colors flex items-center gap-1"
          >
            <span>Login Screen</span>
          </Link>
          <span className="text-slate-700">•</span>
          <a
            href={DOCS_URL}
            target="_blank"
            rel="noreferrer"
            className="hover:text-indigo-400 transition-colors flex items-center gap-1"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>API Docs</span>
          </a>
        </div>
      </div>
    </div>
  );
}
