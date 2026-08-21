'use client';

import React, { useRef, useEffect, UIEvent } from 'react';
import { Message, Conversation } from '@/types';
import { MessageBubble } from './MessageBubble';
import { formatDateDivider } from '@/lib/utils';
import { MessagesFeedSkeleton } from '@/components/common/Skeleton';
import { EmptyState } from '@/components/common/EmptyState';
import { SmartScrollPill } from './SmartScrollPill';
import { useChat } from '@/context/ChatContext';

interface MessageListProps {
  conversation: Conversation;
  messages: Message[];
  isLoading: boolean;
}

export function MessageList({ conversation, messages, isLoading }: MessageListProps) {
  const { isAtBottom, setIsAtBottom, scrolledUpUnreadCount, resetScrolledUpUnread } = useChat();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const bottomAnchorRef = useRef<HTMLDivElement>(null);
  const prevMessagesLengthRef = useRef<number>(0);

  // Scroll to bottom helper
  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    if (bottomAnchorRef.current) {
      bottomAnchorRef.current.scrollIntoView({ behavior, block: 'end' });
    }
  };

  // Scroll listener to detect if user is near bottom
  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const distanceToBottom = target.scrollHeight - target.scrollTop - target.clientHeight;
    const isClose = distanceToBottom < 100;

    setIsAtBottom(isClose);
    if (isClose) {
      resetScrolledUpUnread();
    }
  };

  // Auto-scroll effect on new message
  useEffect(() => {
    const isNewMessageAdded = messages.length > prevMessagesLengthRef.current;
    prevMessagesLengthRef.current = messages.length;

    if (isNewMessageAdded) {
      if (isAtBottom) {
        scrollToBottom('smooth');
      }
    }
  }, [messages, isAtBottom]);

  // Initial scroll to bottom on conversation change
  useEffect(() => {
    const timeout = setTimeout(() => {
      scrollToBottom('auto');
    }, 50);
    return () => clearTimeout(timeout);
  }, [conversation._id]);

  const handleJumpToBottom = () => {
    resetScrolledUpUnread();
    setIsAtBottom(true);
    scrollToBottom('smooth');
  };

  if (isLoading && messages.length === 0) {
    return <MessagesFeedSkeleton />;
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <EmptyState
          type="no-messages"
          title="No messages yet"
          description="Send the first message to kick off this conversation!"
        />
      </div>
    );
  }

  // Group messages by date
  let lastDateString = '';

  return (
    <div className="relative flex-1 flex flex-col min-h-0">
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-1 scroll-smooth"
      >
        {messages.map((message) => {
          const messageDate = formatDateDivider(message.createdAt);
          const showDateDivider = messageDate !== lastDateString;
          if (showDateDivider) {
            lastDateString = messageDate;
          }

          return (
            <React.Fragment key={message._id}>
              {showDateDivider && messageDate && (
                <div className="flex items-center justify-center my-4 select-none">
                  <span className="px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/50 text-[11px] font-medium text-slate-400 backdrop-blur-sm shadow-sm">
                    {messageDate}
                  </span>
                </div>
              )}
              <MessageBubble
                message={message}
                isGroup={conversation.type === 'group'}
              />
            </React.Fragment>
          );
        })}
        <div ref={bottomAnchorRef} className="h-1" />
      </div>

      {/* Floating Smart Scroll Anchor */}
      <SmartScrollPill
        visible={!isAtBottom && scrolledUpUnreadCount > 0}
        unreadCount={scrolledUpUnreadCount}
        onClick={handleJumpToBottom}
      />
    </div>
  );
}
