'use client';

import React from 'react';
import Link from 'next/link';
import { MessageSquare, ArrowLeft, Home, Compass, BookOpen } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden text-slate-100 selection:bg-indigo-500 selection:text-white select-none">
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/15 to-pink-600/10 blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Main Glass Card */}
      <div className="relative w-full max-w-lg bg-slate-900/80 border border-slate-800/80 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-indigo-950/60 backdrop-blur-2xl text-center overflow-hidden">
        {/* Top Glow Highlights */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

        {/* 404 Error Graphic / Icon */}
        <div className="relative mb-6 inline-block">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-pink-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mx-auto shadow-inner ring-4 ring-indigo-500/10">
            <Compass className="w-10 h-10 stroke-[1.75] text-indigo-400 animate-spin-slow" />
          </div>
          <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-indigo-600 text-[11px] font-mono font-bold text-white shadow-md shadow-indigo-600/50 border border-indigo-400/40">
            404
          </span>
        </div>

        {/* Headline & Description */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
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
        <div className="mt-8 pt-6 border-t border-slate-800/80 flex items-center justify-center gap-6 text-xs text-slate-400">
          <Link
            href="/auth/login"
            className="hover:text-indigo-400 transition-colors flex items-center gap-1"
          >
            <span>Login Screen</span>
          </Link>
          <span className="text-slate-700">•</span>
          <a
            href="https://frontend-task-chatapp.onrender.com/docs/"
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
