'use client';

import React from 'react';
import { Conversation } from '@/types';
import { useAuth } from '@/context';
import { Avatar } from '@/components/common';
import { formatConversationTime, cn } from '@/lib';
import { CheckCheck } from 'lucide-react';

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  unreadCount?: number;
  onClick: () => void;
}

export function ConversationItem({
  conversation,
  isActive,
  unreadCount = 0,
  onClick,
}: ConversationItemProps) {
  const { user: currentUser } = useAuth();
  const isGroup = conversation.type === 'group';

  // Determine conversation title
  const title = isGroup
    ? conversation.name || 'Unnamed Group'
    : conversation.participant?.name || 'User';

  // Determine last message text & sender
  const lastMsg = conversation.lastMessage;
  const lastMsgText = lastMsg?.text || (isGroup ? 'Group created' : 'No messages yet');
  const lastMsgSenderId =
    typeof lastMsg?.sender === 'object'
      ? (lastMsg.sender as { _id: string })._id
      : lastMsg?.sender;
  const isMyLastMsg = lastMsgSenderId === currentUser?._id;

  const timeString = formatConversationTime(
    lastMsg?.createdAt || conversation.updatedAt || conversation.createdAt
  );

  return (
    <div
      onClick={onClick}
      className={cn(
        'group relative flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all select-none border',
        isActive
          ? 'bg-gradient-to-r from-indigo-900/40 via-indigo-950/40 to-slate-900/40 border-indigo-500/40 shadow-lg shadow-indigo-950/40'
          : 'bg-slate-900/20 hover:bg-slate-800/50 border-transparent hover:border-slate-800/80 text-slate-300'
      )}
    >
      {/* Active Indicator Bar */}
      {isActive && (
        <div className="absolute left-0 inset-y-2.5 w-1 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-r-full" />
      )}

      {/* Avatar */}
      <Avatar
        name={title}
        isGroup={isGroup}
        size="md"
        showOnline={!isGroup}
      />

      {/* Info Body */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1 mb-1">
          <h4
            className={cn(
              'text-sm font-semibold truncate transition-colors',
              isActive ? 'text-white font-bold' : 'text-slate-200 group-hover:text-white'
            )}
          >
            {title}
          </h4>
          {timeString && (
            <span
              className={cn(
                'text-[11px] flex-shrink-0 transition-colors',
                isActive ? 'text-indigo-300' : 'text-slate-500'
              )}
            >
              {timeString}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between gap-2">
          <p
            className={cn(
              'text-xs truncate flex items-center gap-1',
              unreadCount > 0 ? 'font-semibold text-slate-200' : 'text-slate-400'
            )}
          >
            {isMyLastMsg && <CheckCheck className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />}
            <span className="truncate">{lastMsgText}</span>
          </p>

          {unreadCount > 0 && (
            <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[10px] font-bold shadow-md shadow-indigo-500/30 flex-shrink-0 animate-pulse">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
