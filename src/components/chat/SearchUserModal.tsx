'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Search, X, MessageSquarePlus, Loader2, User as UserIcon } from 'lucide-react';
import { api } from '@/lib/api';
import { User } from '@/types';
import { useChat } from '@/context/ChatContext';
import { useAuth } from '@/context/AuthContext';
import { Avatar } from '@/components/common/Avatar';
import { ErrorBanner } from '@/components/common/ErrorBanner';

interface SearchUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchUserModal({ isOpen, onClose }: SearchUserModalProps) {
  const { startDirectChat } = useChat();
  const { user: currentUser } = useAuth();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStartingChat, setIsStartingChat] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Debounced search
  const performSearch = useCallback(async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const users = await api.searchUsers(searchTerm);
      // Filter out self
      const filtered = users.filter((u) => u._id !== currentUser?._id);
      setResults(filtered);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to search users');
    } finally {
      setIsLoading(false);
    }
  }, [currentUser?._id]);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setResults([]);
      setError(null);
      return;
    }
    const timer = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, isOpen, performSearch]);

  if (!isOpen) return null;

  const handleStartChat = async (targetUser: User) => {
    setIsStartingChat(targetUser._id);
    setError(null);
    try {
      await startDirectChat(targetUser._id);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Could not start conversation');
    } finally {
      setIsStartingChat(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-semibold text-white">Start New Conversation</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-800/60 bg-slate-900/50">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              autoFocus
              placeholder="Search by name or phone number..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 bg-slate-800/80 border border-slate-700/60 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 border-b border-slate-800">
            <ErrorBanner message={error} onDismiss={() => setError(null)} />
          </div>
        )}

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 min-h-[220px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin text-indigo-400 mb-2" />
              <span className="text-sm">Searching users...</span>
            </div>
          ) : results.length > 0 ? (
            results.map((u) => (
              <div
                key={u._id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700/80 transition-all group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar name={u.name} size="md" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">{u.name}</p>
                    <p className="text-xs text-slate-400 truncate">{u.phone}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleStartChat(u)}
                  disabled={isStartingChat === u._id}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium shadow-md shadow-indigo-600/20 transition-all disabled:opacity-50 active:scale-95"
                >
                  {isStartingChat === u._id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <>
                      <MessageSquarePlus className="w-3.5 h-3.5" />
                      <span>Chat</span>
                    </>
                  )}
                </button>
              </div>
            ))
          ) : query.trim() ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400 text-center">
              <Search className="w-8 h-8 text-slate-600 mb-2 stroke-[1.5]" />
              <p className="text-sm font-medium text-slate-300">No users found</p>
              <p className="text-xs text-slate-500 mt-1">Try searching with a full phone number or name.</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400 text-center">
              <UserIcon className="w-8 h-8 text-slate-600 mb-2 stroke-[1.5]" />
              <p className="text-sm font-medium text-slate-300">Find someone to message</p>
              <p className="text-xs text-slate-500 mt-1">
                Type a name like &quot;Ada&quot;, &quot;Sushil&quot; or a phone number to search.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
