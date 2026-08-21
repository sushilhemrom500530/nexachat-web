'use client';

import React, { useState, useMemo } from 'react';
import { useChat } from '@/context/ChatContext';
import { useAuth } from '@/context/AuthContext';
import { ConversationItem } from '../conversation-item';
import { Avatar, ConversationListSkeleton, EmptyState } from '@/components/common';
import {
  Search,
  Plus,
  UserPlus,
  LogOut,
  Users,
  MessageCircle,
  Layers,
} from 'lucide-react';
import { SearchUserModal } from '../search-user-modal';
import { CreateGroupModal } from '../create-group-modal';

interface SidebarProps {
  onSelectConversation?: () => void;
}

export function Sidebar({ onSelectConversation }: SidebarProps) {
  const { user, logout } = useAuth();
  const {
    conversations,
    activeConversation,
    selectConversation,
    isLoadingConversations,
    unreadMap,
  } = useChat();

  const [searchFilter, setSearchFilter] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'direct' | 'group'>('all');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);

  // Filter conversations
  const filteredConversations = useMemo(() => {
    return conversations.filter((c) => {
      if (activeTab === 'direct' && c.type !== 'direct') return false;
      if (activeTab === 'group' && c.type !== 'group') return false;

      if (!searchFilter.trim()) return true;
      const title =
        c.type === 'group'
          ? c.name || ''
          : c.participant?.name || c.participant?.phone || '';
      return title.toLowerCase().includes(searchFilter.toLowerCase().trim());
    });
  }, [conversations, activeTab, searchFilter]);

  const totalUnread = useMemo(() => {
    return Object.values(unreadMap).reduce((acc, curr) => acc + curr, 0);
  }, [unreadMap]);

  return (
    <>
      <aside className="w-full md:w-80 lg:w-96 flex flex-col h-full bg-slate-950/80 border-r border-slate-800/80 backdrop-blur-xl select-none">
        {/* User Profile Bar */}
        <div className="p-4 border-b border-slate-800/80 bg-slate-900/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <Avatar name={user?.name} size="md" showOnline />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-white truncate">{user?.name}</h3>
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <p className="text-xs text-slate-400 truncate">{user?.phone}</p>
              </div>
            </div>

            <button
              onClick={logout}
              title="Log Out"
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 rounded-xl transition-all active:scale-95"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Action Header & Quick Buttons */}
        <div className="p-3 border-b border-slate-800/60 space-y-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSearchModalOpen(true)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all active:scale-95"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>New Chat</span>
            </button>

            <button
              onClick={() => setIsGroupModalOpen(true)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 hover:text-white rounded-xl text-xs font-semibold border border-slate-700/60 transition-all active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 text-purple-400" />
              <span>New Group</span>
            </button>
          </div>

          {/* Search Filter Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              <Search className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-900/60 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-900/80 rounded-xl border border-slate-800/80">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex-1 flex items-center justify-center gap-1 py-1 rounded-lg text-[11px] font-medium transition-all ${
                activeTab === 'all'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3 h-3" />
              <span>All</span>
              {totalUnread > 0 && (
                <span className="ml-0.5 px-1 py-0.2 bg-indigo-500 text-white text-[9px] rounded-full">
                  {totalUnread}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('direct')}
              className={`flex-1 flex items-center justify-center gap-1 py-1 rounded-lg text-[11px] font-medium transition-all ${
                activeTab === 'direct'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <MessageCircle className="w-3 h-3 text-indigo-400" />
              <span>Direct</span>
            </button>

            <button
              onClick={() => setActiveTab('group')}
              className={`flex-1 flex items-center justify-center gap-1 py-1 rounded-lg text-[11px] font-medium transition-all ${
                activeTab === 'group'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Users className="w-3 h-3 text-purple-400" />
              <span>Groups</span>
            </button>
          </div>
        </div>

        {/* Conversation Items List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {isLoadingConversations && conversations.length === 0 ? (
            <ConversationListSkeleton />
          ) : filteredConversations.length > 0 ? (
            filteredConversations.map((c) => (
              <ConversationItem
                key={c._id}
                conversation={c}
                isActive={activeConversation?._id === c._id}
                unreadCount={unreadMap[c._id] || 0}
                onClick={() => {
                  selectConversation(c);
                  onSelectConversation?.();
                }}
              />
            ))
          ) : conversations.length === 0 ? (
            <EmptyState
              type="no-conversations"
              title="No chats yet"
              description="Start a direct chat or create a group to begin messaging."
              actionText="Start Conversation"
              onAction={() => setIsSearchModalOpen(true)}
              className="py-12"
            />
          ) : (
            <div className="py-8 text-center text-xs text-slate-500">
              No conversations matched &quot;{searchFilter}&quot;
            </div>
          )}
        </div>
      </aside>

      {/* Modals */}
      <SearchUserModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />
      <CreateGroupModal
        isOpen={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
      />
    </>
  );
}
