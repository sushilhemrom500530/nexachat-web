'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Users, X, Check, Loader2, Search, Plus } from 'lucide-react';
import { api } from '@/lib/api';
import { User } from '@/types';
import { useChat } from '@/context/ChatContext';
import { useAuth } from '@/context/AuthContext';
import { Avatar } from '@/components/common/Avatar';
import { ErrorBanner } from '@/components/common/ErrorBanner';

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateGroupModal({ isOpen, onClose }: CreateGroupModalProps) {
  const { createGroup } = useChat();
  const { user: currentUser } = useAuth();
  const [groupName, setGroupName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchUsers = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsLoadingSearch(false);
      return;
    }
    setIsLoadingSearch(true);
    try {
      const users = await api.searchUsers(query);
      // Filter out self
      const filtered = users.filter((u) => u._id !== currentUser?._id);
      setSearchResults(filtered);
    } catch {
      // Ignore background search error
    } finally {
      setIsLoadingSearch(false);
    }
  }, [currentUser?._id]);

  useEffect(() => {
    if (!isOpen) {
      setGroupName('');
      setSearchQuery('');
      setSearchResults([]);
      setSelectedUsers([]);
      setError(null);
      return;
    }
    const timer = setTimeout(() => {
      searchUsers(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, isOpen, searchUsers]);

  if (!isOpen) return null;

  const toggleSelectUser = (u: User) => {
    if (selectedUsers.some((sel) => sel._id === u._id)) {
      setSelectedUsers((prev) => prev.filter((sel) => sel._id !== u._id));
    } else {
      setSelectedUsers((prev) => [...prev, u]);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim()) {
      setError('Please provide a group name.');
      return;
    }
    if (selectedUsers.length === 0) {
      setError('Please select at least one participant.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      const participantIds = selectedUsers.map((u) => u._id);
      await createGroup(groupName.trim(), participantIds);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create group');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-semibold text-white">Create Group Conversation</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-4 border-b border-slate-800">
            <ErrorBanner message={error} onDismiss={() => setError(null)} />
          </div>
        )}

        <form onSubmit={handleCreate} className="flex-1 flex flex-col overflow-hidden">
          <div className="p-5 space-y-4 overflow-y-auto flex-1">
            {/* Group Name Input */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Group Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Engineering Core, Design Guild..."
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-800/70 border border-slate-700/60 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Selected Participants Chips */}
            {selectedUsers.length > 0 && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Selected Participants ({selectedUsers.length})
                </label>
                <div className="flex flex-wrap gap-2 p-2.5 bg-slate-950/40 rounded-xl border border-slate-800">
                  {selectedUsers.map((u) => (
                    <div
                      key={u._id}
                      className="inline-flex items-center gap-1.5 pl-2 pr-1.5 py-1 rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-200 text-xs font-medium"
                    >
                      <Avatar name={u.name} size="xs" />
                      <span className="max-w-[120px] truncate">{u.name}</span>
                      <button
                        type="button"
                        onClick={() => toggleSelectUser(u)}
                        className="p-0.5 hover:bg-indigo-500/30 rounded text-indigo-300 hover:text-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Search and Select Participants */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Add Members
              </label>
              <div className="relative mb-3">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="Search participants by name or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-800/60 border border-slate-700/60 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>

              {/* User Results */}
              <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                {isLoadingSearch ? (
                  <div className="flex items-center justify-center py-6 text-slate-400">
                    <Loader2 className="w-5 h-5 animate-spin text-indigo-400 mr-2" />
                    <span className="text-xs">Searching...</span>
                  </div>
                ) : searchResults.length > 0 ? (
                  searchResults.map((u) => {
                    const isSelected = selectedUsers.some((s) => s._id === u._id);
                    return (
                      <div
                        key={u._id}
                        onClick={() => toggleSelectUser(u)}
                        className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all border ${
                          isSelected
                            ? 'bg-indigo-600/15 border-indigo-500/40 text-white'
                            : 'bg-slate-800/30 hover:bg-slate-800/60 border-slate-800/60 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Avatar name={u.name} size="sm" />
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-white truncate">{u.name}</p>
                            <p className="text-[11px] text-slate-400 truncate">{u.phone}</p>
                          </div>
                        </div>

                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                            isSelected
                              ? 'bg-indigo-600 border-indigo-500 text-white'
                              : 'border-slate-700 bg-slate-800 text-transparent hover:border-slate-500'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    );
                  })
                ) : searchQuery.trim() ? (
                  <p className="text-center text-xs text-slate-500 py-4">No matching users found</p>
                ) : (
                  <p className="text-center text-xs text-slate-500 py-4">
                    Type a user&apos;s name or phone above to add to this group.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Footer CTA */}
          <div className="p-4 border-t border-slate-800 bg-slate-900/80 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !groupName.trim() || selectedUsers.length === 0}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Creating Group...</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Group ({selectedUsers.length + 1} members)</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
