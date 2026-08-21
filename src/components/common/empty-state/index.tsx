'use client';

import React from 'react';
import { MessageSquareDashed, MessageSquarePlus, Users, Search } from 'lucide-react';
import { cn } from '@/lib';

interface EmptyStateProps {
  type: 'no-conversation-selected' | 'no-messages' | 'no-conversations' | 'no-search-results';
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

const configs = {
  'no-conversation-selected': {
    icon: MessageSquareDashed,
    defaultTitle: 'Select a conversation',
    defaultDesc: 'Choose an existing conversation from the sidebar or start a new chat with a friend or colleague.',
  },
  'no-messages': {
    icon: MessageSquarePlus,
    defaultTitle: 'No messages yet',
    defaultDesc: 'Say hello and start the conversation! New messages will appear in real-time.',
  },
  'no-conversations': {
    icon: Users,
    defaultTitle: 'No conversations found',
    defaultDesc: 'You have not joined any conversations yet. Search for users or create a new group.',
  },
  'no-search-results': {
    icon: Search,
    defaultTitle: 'No users found',
    defaultDesc: 'We couldn’t find anyone matching your search query. Try searching with a different name or phone number.',
  },
};

export function EmptyState({
  type,
  title,
  description,
  actionText,
  onAction,
  className,
}: EmptyStateProps) {
  const config = configs[type];
  const IconComponent = config.icon;

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-8 h-full max-w-md mx-auto select-none',
        className
      )}
    >
      <div className="relative mb-5">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-inner">
          <IconComponent className="w-8 h-8 stroke-[1.5]" />
        </div>
        <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 blur-xl rounded-full -z-10" />
      </div>

      <h3 className="text-lg font-semibold text-slate-200 mb-2">
        {title || config.defaultTitle}
      </h3>
      <p className="text-sm text-slate-400 max-w-sm mb-6 leading-relaxed">
        {description || config.defaultDesc}
      </p>

      {actionText && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium shadow-lg shadow-indigo-600/30 transition-all duration-200 active:scale-95"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}
