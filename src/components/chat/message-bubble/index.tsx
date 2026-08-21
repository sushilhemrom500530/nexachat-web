'use client';

import React from 'react';
import { Message } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { formatMessageTime, cn } from '@/lib/utils';
import { CheckCheck, Clock, AlertCircle } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
  isGroup?: boolean;
}

export function MessageBubble({ message, isGroup = false }: MessageBubbleProps) {
  const { user: currentUser } = useAuth();

  const senderId =
    typeof message.sender === 'object'
      ? (message.sender as { _id: string })._id
      : message.sender;

  const senderName =
    typeof message.sender === 'object'
      ? (message.sender as { name?: string }).name
      : 'User';

  const isMe = senderId === currentUser?._id;
  const formattedTime = formatMessageTime(message.createdAt);

  return (
    <div
      className={cn(
        'group flex w-full my-1.5 px-4',
        isMe ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={cn(
          'relative max-w-[85%] sm:max-w-[70%] md:max-w-[60%] rounded-2xl p-3 shadow-md transition-all',
          isMe
            ? 'bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white rounded-tr-xs shadow-indigo-600/20'
            : 'bg-slate-900 border border-slate-800 text-slate-100 rounded-tl-xs shadow-black/40'
        )}
      >
        {/* Sender Name in Group Chat */}
        {!isMe && isGroup && senderName && (
          <p className="text-[11px] font-bold text-indigo-400 mb-1 tracking-wide">
            {senderName}
          </p>
        )}

        {/* Message Text */}
        <p className="text-sm whitespace-pre-wrap break-words leading-relaxed select-text">
          {message.text}
        </p>

        {/* Timestamp and Status Indicator */}
        <div
          className={cn(
            'flex items-center justify-end gap-1 mt-1 text-[10px] select-none',
            isMe ? 'text-indigo-200' : 'text-slate-400'
          )}
        >
          <span>{formattedTime}</span>

          {isMe && (
            <span>
              {message.status === 'sending' || message.isOptimistic ? (
                <Clock className="w-3 h-3 animate-pulse text-indigo-300" />
              ) : message.status === 'error' ? (
                <AlertCircle className="w-3 h-3 text-rose-300" />
              ) : (
                <CheckCheck className="w-3.5 h-3.5 text-indigo-200" />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
