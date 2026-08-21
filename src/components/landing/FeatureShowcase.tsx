'use client';

import React from 'react';
import {
  MessageSquare,
  Users,
  Radio,
  ArrowDown,
  ShieldCheck,
  Sparkles,
  Smartphone,
  Layers,
} from 'lucide-react';

export function FeatureShowcase() {
  const features = [
    {
      icon: Radio,
      color: 'from-blue-500 to-indigo-600',
      title: 'Real-Time WebSocket Protocol',
      description:
        'Live bidirectional message transport powered by Socket.io. New direct & group messages pop up instantly without requiring browser reloads.',
    },
    {
      icon: ArrowDown,
      color: 'from-purple-500 to-pink-600',
      title: 'Smart Non-Intrusive Auto-Scroll',
      description:
        'Smoothly auto-scrolls down when you are at the bottom. If you scroll up to inspect conversation history, auto-scroll is safely paused and an unread pill appears.',
    },
    {
      icon: Users,
      color: 'from-emerald-500 to-teal-600',
      title: 'Dynamic Group Collaboration',
      description:
        'Create group chats with multiple participants. Assign admins, rename channels, add new members, or leave groups with instant server synchronization.',
    },
    {
      icon: Smartphone,
      color: 'from-amber-500 to-orange-600',
      title: 'Frictionless Phone + Name Auth',
      description:
        'No multi-step signups or passwords. Entering your phone number auto-registers or authenticates you, issuing an enterprise-grade JWT session.',
    },
    {
      icon: MessageSquare,
      color: 'from-rose-500 to-red-600',
      title: '1-to-1 Instant User Discovery',
      description:
        'Search colleagues and peers by name or phone with debounced live querying. Start direct conversation threads with a single click.',
    },
    {
      icon: Layers,
      color: 'from-cyan-500 to-blue-600',
      title: 'Resilient Multi-State Handling',
      description:
        'Comprehensive shimmer skeletons, error banners with retry triggers, optimistic message posting, and empty state illustrations.',
    },
  ];

  return (
    <section id="features" className="py-20 md:py-28 bg-slate-950/60 border-t border-slate-850 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase font-mono tracking-widest font-semibold text-indigo-400">
            Engineered For Speed & Polish
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-2">
            Every feature crafted with precision
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-3 leading-relaxed">
            From socket back-off reconnection to non-intrusive scroll observers, NexaChat is built to feel like a premium native product.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="group relative p-7 rounded-3xl bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/40 hover:bg-slate-900/90 transition-all duration-300 shadow-lg shadow-black/40 hover:-translate-y-1"
              >
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center text-white shadow-lg mb-5 group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-6 h-6 stroke-[1.8]" />
                </div>

                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                  {f.title}
                </h3>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                  {f.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
