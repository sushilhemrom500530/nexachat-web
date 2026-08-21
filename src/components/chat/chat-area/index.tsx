'use client';

import React from 'react';
import { useChat } from '@/context/ChatContext';
import { ChatHeader } from '../chat-header';
import { MessageList } from '../message-list';
import { MessageInput } from '../message-input';
import { EmptyState, ErrorBanner } from '@/components/common';

interface ChatAreaProps {
  onBackToSidebar?: () => void;
}

export function ChatArea({ onBackToSidebar }: ChatAreaProps) {
  const {
    activeConversation,
    messages,
    isLoadingMessages,
    sendMessage,
    isSending,
    error,
    clearError,
    refreshMessages,
  } = useChat();

  if (!activeConversation) {
    return (
      <main className="flex-1 hidden md:flex items-center justify-center bg-slate-950/40 relative overflow-hidden">
        <div className="absolute inset-0 bg-radial from-indigo-900/10 via-transparent to-transparent pointer-events-none" />
        <EmptyState
          type="no-conversation-selected"
          title="No Conversation Selected"
          description="Select a chat from the sidebar or click 'New Chat' to start talking with anyone in real-time."
        />
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col h-full bg-slate-950/30 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl pointer-events-none" />

      {/* Chat Header */}
      <ChatHeader
        conversation={activeConversation}
        onBack={onBackToSidebar}
      />

      {/* Error Alert if any */}
      {error && (
        <div className="px-4 py-2 bg-slate-950/80 border-b border-slate-800">
          <ErrorBanner
            message={error}
            onRetry={() => refreshMessages(activeConversation._id)}
            onDismiss={clearError}
          />
        </div>
      )}

      {/* Message Feed */}
      <MessageList
        conversation={activeConversation}
        messages={messages}
        isLoading={isLoadingMessages}
      />

      {/* Message Input Box */}
      <MessageInput
        onSendMessage={sendMessage}
        isSending={isSending}
      />
    </main>
  );
}
