'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Zap, Users, Radio } from 'lucide-react';
import { InteractiveDemo } from '../interactive-demo';

export function HeroSection() {
  return (
    <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
      {/* Background Gradients & Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[900px] h-[400px] bg-gradient-to-tr from-indigo-600/15 via-purple-600/15 to-pink-600/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Feature Pill */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold backdrop-blur-md shadow-sm">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Production-Grade WebSocket & REST Architecture</span>
          </div>
        </div>

        {/* Headline */}
        <div className="text-center max-w-3xl mx-auto space-y-5">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.1]">
            Seamless real-time chat,{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              re-imagined for humans.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 leading-relaxed font-normal max-w-2xl mx-auto">
            Experience sub-50ms instant messaging, dynamic group collaboration with admin controls,
            and intelligent non-intrusive auto-scroll built on Next.js & Socket.io.
          </p>

          {/* Action CTAs */}
          <div className="pt-3 flex flex-wrap items-center justify-center gap-3.5">
            <Link
              href="/chat"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm transition-all duration-200"
            >
              <span>Launch Live Chat App</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href="#interactive-demo"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white font-semibold text-sm transition-all duration-200"
            >
              <span>Try Interactive Demo</span>
            </a>
          </div>

          {/* Micro Stats */}
          <div className="pt-8 flex items-center justify-center gap-6 sm:gap-12 text-slate-400 text-xs">
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Real-Time Socket.io</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-purple-400" />
              <span>Direct & Groups</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Radio className="w-4 h-4 text-emerald-400" />
              <span>Zero-Refresh Sync</span>
            </div>
          </div>
        </div>

        {/* Live Playground Showcase */}
        <div id="interactive-demo" className="mt-16 md:mt-20">
          <div className="text-center mb-6">
            <h3 className="text-xs uppercase tracking-widest font-mono text-indigo-400 font-semibold mb-1">
              Interactive Preview
            </h3>
            <h2 className="text-2xl font-bold text-white">Test the UX Engine Right Here</h2>
          </div>
          <InteractiveDemo />
        </div>
      </div>
    </section>
  );
}
