'use client';

import React from 'react';
import { Terminal, Server, Smartphone, Cpu, ShieldCheck, Database, RefreshCw } from 'lucide-react';

export function ArchitectureVisualizer() {
  return (
    <section id="architecture" className="py-20 md:py-28 border-t border-slate-850 bg-slate-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase font-mono tracking-widest font-semibold text-purple-400">
            System Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-2">
            Dual-Channel REST & WebSocket Pipe
          </h2>
          <p className="text-slate-400 text-sm mt-3">
            Designed for high concurrency, instant message dispatch, and zero UI stutter.
          </p>
        </div>

        {/* Architecture Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Box 1: Client State */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Next.js Client Engine</h3>
                <p className="text-xs text-slate-400">React 19 • App Router</p>
              </div>
            </div>
            <ul className="text-xs text-slate-300 space-y-2 font-mono">
              <li className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/40 border border-slate-700/50">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>AuthContext: JWT Session & Profile</span>
              </li>
              <li className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/40 border border-slate-700/50">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                <span>ChatContext: Optimistic State & Cache</span>
              </li>
              <li className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/40 border border-slate-700/50">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                <span>ScrollObserver: Non-intrusive auto-scroll</span>
              </li>
            </ul>
          </div>

          {/* Box 2: Transport Protocol */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Hybrid Transport Layer</h3>
                <p className="text-xs text-slate-400">REST + WebSocket (Socket.io)</p>
              </div>
            </div>
            <ul className="text-xs text-slate-300 space-y-2 font-mono">
              <li className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/40 border border-slate-700/50">
                <span className="text-indigo-400 font-bold">POST</span>
                <span className="truncate">/api/messages (REST Fallback)</span>
              </li>
              <li className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/40 border border-slate-700/50">
                <span className="text-emerald-400 font-bold">WS</span>
                <span className="truncate">message:new (Instant Broadcast)</span>
              </li>
              <li className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/40 border border-slate-700/50">
                <span className="text-amber-400 font-bold">WS</span>
                <span className="truncate">conversation:updated (Group Sync)</span>
              </li>
            </ul>
          </div>

          {/* Box 3: Production Specs */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Security & Resilience</h3>
                <p className="text-xs text-slate-400">Production Standards</p>
              </div>
            </div>
            <ul className="text-xs text-slate-300 space-y-2 font-mono">
              <li className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/40 border border-slate-700/50">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Bearer JWT Handshake Authentication</span>
              </li>
              <li className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/40 border border-slate-700/50">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                <span>Auto Exponential Back-off Reconnect</span>
              </li>
              <li className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/40 border border-slate-700/50">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                <span>Normalized DTO Response Parsing</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
