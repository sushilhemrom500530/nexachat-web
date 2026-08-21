'use client';

import React, { useState } from 'react';
import { Conversation, User } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useChat } from '@/context/ChatContext';
import { api } from '@/lib/api';
import { Avatar } from '@/components/common/Avatar';
import {
  X,
  Users,
  Crown,
  UserPlus,
  Edit2,
  LogOut,
  Check,
  Loader2,
  Search,
  Shield,
} from 'lucide-react';
import { ErrorBanner } from '@/components/common/ErrorBanner';

interface GroupInfoDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  conversation: Conversation;
}

export function GroupInfoDrawer({ isOpen, onClose, conversation }: GroupInfoDrawerProps) {
  const { user: currentUser } = useAuth();
  const { updateConversationInState, refreshConversations } = useChat();

  const [isEditingName, setIsEditingName] = useState(false);
  const [newGroupName, setNewGroupName] = useState(conversation.name || '');
  const [isAddingMembers, setIsAddingMembers] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const isAdmin = conversation.admins?.includes(currentUser?._id || '') || conversation.createdBy === currentUser?._id;
  const participants = conversation.participants || [];

  const handleRename = async () => {
    if (!newGroupName.trim() || newGroupName.trim() === conversation.name) {
      setIsEditingName(false);
      return;
    }
    setIsActionLoading(true);
    setError(null);
    try {
      const updated = await api.renameGroup(conversation._id, newGroupName.trim());
      updateConversationInState({ _id: conversation._id, name: updated.name || newGroupName.trim() });
      setIsEditingName(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to rename group');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handlePromoteAdmin = async (userId: string) => {
    if (!isAdmin) return;
    setIsActionLoading(true);
    setError(null);
    try {
      await api.promoteAdmin(conversation._id, userId);
      const updatedAdmins = [...(conversation.admins || []), userId];
      updateConversationInState({ _id: conversation._id, admins: updatedAdmins });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to promote member');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleLeaveGroup = async () => {
    if (!currentUser) return;
    if (!confirm('Are you sure you want to leave this group?')) return;
    setIsActionLoading(true);
    setError(null);
    try {
      await api.removeParticipant(conversation._id, currentUser._id);
      await refreshConversations();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to leave group');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleSearchUsersToAdd = async (q: string) => {
    setSearchQuery(q);
    if (!q.trim()) {
      setSearchResults([]);
      return;
    }
    setIsLoadingSearch(true);
    try {
      const users = await api.searchUsers(q.trim());
      // Filter out existing participants
      const existingIds = new Set(participants.map((p) => p._id));
      setSearchResults(users.filter((u) => !existingIds.has(u._id)));
    } catch {
      // Ignore background search error
    } finally {
      setIsLoadingSearch(false);
    }
  };

  const handleAddMember = async (userToAdd: User) => {
    setIsActionLoading(true);
    setError(null);
    try {
      await api.addParticipants(conversation._id, [userToAdd._id]);
      const updatedParticipants = [
        ...participants,
        { _id: userToAdd._id, name: userToAdd.name, phone: userToAdd.phone },
      ];
      updateConversationInState({ _id: conversation._id, participants: updatedParticipants });
      setSearchResults((prev) => prev.filter((u) => u._id !== userToAdd._id));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to add member');
    } finally {
      setIsActionLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl shadow-black/80 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-bold text-white">Group Details</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Group Hero Info */}
        <div className="p-6 text-center border-b border-slate-800/80 bg-slate-950/30 flex flex-col items-center">
          <Avatar name={conversation.name} isGroup size="xl" className="mb-3" />

          {isEditingName ? (
            <div className="flex items-center gap-2 w-full max-w-xs mt-1">
              <input
                type="text"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                className="flex-1 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                autoFocus
              />
              <button
                onClick={handleRename}
                disabled={isActionLoading}
                className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all"
              >
                {isActionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <h2 className="text-lg font-bold text-white">{conversation.name}</h2>
              {isAdmin && (
                <button
                  onClick={() => setIsEditingName(true)}
                  className="p-1 text-slate-400 hover:text-white transition-colors"
                  title="Rename Group"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
          <p className="text-xs text-slate-400 mt-1">
            {participants.length} member{participants.length !== 1 ? 's' : ''}
          </p>
        </div>

        {error && (
          <div className="p-4 border-b border-slate-800">
            <ErrorBanner message={error} onDismiss={() => setError(null)} />
          </div>
        )}

        {/* Participants Section */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Members ({participants.length})
            </h4>
            {isAdmin && (
              <button
                onClick={() => setIsAddingMembers(!isAddingMembers)}
                className="inline-flex items-center gap-1 text-xs font-medium text-indigo-400 hover:text-indigo-300"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>{isAddingMembers ? 'Cancel' : 'Add Members'}</span>
              </button>
            )}
          </div>

          {/* Add Members Search Panel */}
          {isAddingMembers && (
            <div className="p-3 bg-slate-800/40 rounded-2xl border border-slate-700/60 space-y-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search user to add..."
                  value={searchQuery}
                  onChange={(e) => handleSearchUsersToAdd(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-900/80 border border-slate-700/60 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {isLoadingSearch ? (
                <div className="text-center py-2 text-xs text-slate-400">Searching...</div>
              ) : searchResults.length > 0 ? (
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {searchResults.map((u) => (
                    <div
                      key={u._id}
                      className="flex items-center justify-between p-2 rounded-lg bg-slate-800 hover:bg-slate-700/70 text-xs"
                    >
                      <span className="text-white font-medium truncate">{u.name}</span>
                      <button
                        onClick={() => handleAddMember(u)}
                        disabled={isActionLoading}
                        className="px-2 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[11px] font-semibold"
                      >
                        Add
                      </button>
                    </div>
                  ))}
                </div>
              ) : searchQuery.trim() ? (
                <div className="text-center py-2 text-xs text-slate-500">No users found</div>
              ) : null}
            </div>
          )}

          {/* Participants List */}
          <div className="space-y-2">
            {participants.map((p) => {
              const isMemberAdmin = conversation.admins?.includes(p._id) || conversation.createdBy === p._id;
              const isMe = p._id === currentUser?._id;

              return (
                <div
                  key={p._id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/30 border border-slate-800/60"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Avatar name={p.name} size="sm" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white truncate">
                        {p.name} {isMe && '(You)'}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">{p.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isMemberAdmin ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 text-[10px] font-bold border border-amber-500/20">
                        <Crown className="w-3 h-3 text-amber-400" />
                        Admin
                      </span>
                    ) : isAdmin ? (
                      <button
                        onClick={() => handlePromoteAdmin(p._id)}
                        disabled={isActionLoading}
                        className="text-[10px] font-medium text-slate-400 hover:text-indigo-300 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 transition-colors"
                      >
                        Make Admin
                      </button>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer with Leave Group Action */}
        <div className="p-4 border-t border-t-slate-800 bg-slate-900/80 flex items-center justify-between">
          <button
            onClick={handleLeaveGroup}
            disabled={isActionLoading}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 px-3 py-2 rounded-xl transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Leave Group</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
