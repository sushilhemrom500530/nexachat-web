'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context';
import { MessageSquare, Phone, User as UserIcon, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { ErrorBanner } from '@/components/common';
import Link from 'next/link';

interface LoginCardProps {
  onSuccess?: () => void;
  isFullPage?: boolean;
}

export function LoginCard({ onSuccess, isFullPage = false }: LoginCardProps) {
  const router = useRouter();
  const { user, login, isLoading, error, clearError } = useAuth();
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');

  // If already logged in on full page, redirect to /chat
  useEffect(() => {
    if (user && isFullPage) {
      router.push('/chat');
    }
  }, [user, isFullPage, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim() || !name.trim() || isLoading) return;
    try {
      await login(phone.trim(), name.trim());
      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/chat');
      }
    } catch {
      // Handled in context
    }
  };

  const handleQuickFill = (demoPhone: string, demoName: string) => {
    setPhone(demoPhone);
    setName(demoName);
    clearError();
  };

  return (
    <div className="relative w-full max-w-md bg-slate-900/90 border border-slate-800/80 rounded-3xl p-8 shadow-2xl shadow-indigo-950/50 backdrop-blur-xl overflow-hidden">
      {/* Ambient Glows */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30 mb-4 ring-4 ring-indigo-500/10">
          <MessageSquare className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Welcome to NexaChat
        </h2>
        <p className="text-sm text-slate-400 mt-1.5">
          Real-time conversations with instant login & auto-registration.
        </p>
      </div>

      {error && (
        <div className="mb-5">
          <ErrorBanner message={error} onDismiss={clearError} />
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 ml-1">
            Your Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <UserIcon className="w-4 h-4" />
            </div>
            <input
              type="text"
              required
              placeholder="e.g. Sushil Hemrom"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) clearError();
              }}
              className="w-full pl-10 pr-4 py-3 bg-slate-800/60 border border-slate-700/60 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 ml-1">
            Phone Number
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Phone className="w-4 h-4" />
            </div>
            <input
              type="tel"
              required
              placeholder="e.g. +8801700000001"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                if (error) clearError();
              }}
              className="w-full pl-10 pr-4 py-3 bg-slate-800/60 border border-slate-700/60 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>
          <p className="text-[11px] text-slate-500 mt-1 ml-1">
            * If you are new, entering your number will automatically register you.
          </p>
        </div>

        <button
          type="submit"
          disabled={isLoading || !phone.trim() || !name.trim()}
          className="w-full mt-2 py-3.5 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Connecting...</span>
            </>
          ) : (
            <>
              <span>Enter NexaChat</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Quick Test Accounts */}
      <div className="mt-6 pt-5 border-t border-t-slate-800/80">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Quick Test Accounts:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handleQuickFill('+8801700000001', 'Sushil Tester')}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800/70 hover:bg-slate-800 border border-slate-700/50 text-slate-300 text-xs transition-colors hover:border-indigo-500/50"
          >
            👤 Sushil (+8801700000001)
          </button>
          <button
            type="button"
            onClick={() => handleQuickFill('+15551234567', 'Ada Lovelace')}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800/70 hover:bg-slate-800 border border-slate-700/50 text-slate-300 text-xs transition-colors hover:border-purple-500/50"
          >
            👩‍💻 Ada (+15551234567)
          </button>
        </div>
      </div>

      {isFullPage && (
        <div className="mt-5 text-center">
          <Link
            href="/"
            className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      )}
    </div>
  );
}
