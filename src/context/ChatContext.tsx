'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { Conversation, Message } from '@/types';
import { api } from '@/lib/api';
import { socketService } from '@/lib/socket';
import { useAuth } from './AuthContext';

interface ChatContextType {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  messages: Message[];
  isLoadingConversations: boolean;
  isLoadingMessages: boolean;
  isSending: boolean;
  error: string | null;
  isAtBottom: boolean;
  scrolledUpUnreadCount: number;
  unreadMap: Record<string, number>;
  selectConversation: (conversation: Conversation) => void;
  sendMessage: (text: string) => Promise<void>;
  startDirectChat: (userId: string) => Promise<Conversation>;
  createGroup: (name: string, participantIds: string[]) => Promise<Conversation>;
  refreshConversations: () => Promise<void>;
  refreshMessages: (conversationId: string) => Promise<void>;
  setIsAtBottom: (isBottom: boolean) => void;
  resetScrolledUpUnread: () => void;
  clearError: () => void;
  updateConversationInState: (updated: Partial<Conversation> & { _id: string }) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { user, token } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messagesMap, setMessagesMap] = useState<Record<string, Message[]>>({});
  const [isLoadingConversations, setIsLoadingConversations] = useState<boolean>(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Smart auto-scroll state
  const [isAtBottom, setIsAtBottom] = useState<boolean>(true);
  const [scrolledUpUnreadCount, setScrolledUpUnreadCount] = useState<number>(0);
  const [unreadMap, setUnreadMap] = useState<Record<string, number>>({});

  const activeConvRef = useRef<Conversation | null>(null);
  const isAtBottomRef = useRef<boolean>(true);

  useEffect(() => {
    activeConvRef.current = activeConversation;
  }, [activeConversation]);

  useEffect(() => {
    isAtBottomRef.current = isAtBottom;
    if (isAtBottom) {
      setScrolledUpUnreadCount(0);
    }
  }, [isAtBottom]);

  // Load all conversations
  const loadConversations = useCallback(async () => {
    if (!token) return;
    setIsLoadingConversations(true);
    setError(null);
    try {
      const data = await api.getConversations();
      // Sort by updatedAt descending
      const sorted = [...data].sort((a, b) => {
        const timeA = new Date(a.updatedAt || a.lastMessage?.createdAt || 0).getTime();
        const timeB = new Date(b.updatedAt || b.lastMessage?.createdAt || 0).getTime();
        return timeB - timeA;
      });
      setConversations(sorted);

      // Auto select first conversation if none selected
      if (!activeConvRef.current && sorted.length > 0) {
        selectConversation(sorted[0]);
      }
    } catch (err: unknown) {
      console.error('Failed to load conversations:', err);
      setError(err instanceof Error ? err.message : 'Failed to load conversations');
    } finally {
      setIsLoadingConversations(false);
    }
  }, [token]);

  // Load messages for a given conversation
  const loadMessages = useCallback(async (conversationId: string) => {
    if (!token || !conversationId) return;
    setIsLoadingMessages(true);
    setError(null);
    try {
      const res = await api.getMessages(conversationId);
      const fetchedMessages = Array.isArray(res) ? res : res.data || [];

      // Sort oldest to newest
      const sorted = [...fetchedMessages].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

      setMessagesMap((prev) => ({
        ...prev,
        [conversationId]: sorted,
      }));
    } catch (err: unknown) {
      console.error('Failed to load messages:', err);
      setError(err instanceof Error ? err.message : 'Failed to load message history');
    } finally {
      setIsLoadingMessages(false);
    }
  }, [token]);

  // Initial conversations fetch when user logs in
  useEffect(() => {
    if (token) {
      loadConversations();
    } else {
      setConversations([]);
      setActiveConversation(null);
      setMessagesMap({});
    }
  }, [token, loadConversations]);

  // Real-time socket message and conversation listeners
  useEffect(() => {
    if (!token) return;

    // Handle new incoming message
    const unsubMessage = socketService.onNewMessage((newMessage: Message & { conversation?: string }) => {
      const convId = newMessage.conversationId || newMessage.conversation || '';
      if (!convId) return;

      const currentActive = activeConvRef.current;
      const senderId = typeof newMessage.sender === 'object' ? newMessage.sender._id : newMessage.sender;
      const isMyMessage = senderId === user?._id;

      // 1. Update message list in messagesMap
      setMessagesMap((prev) => {
        const existing = prev[convId] || [];
        // Avoid duplicate by _id
        if (existing.some((m) => m._id === newMessage._id)) {
          return prev;
        }
        // Remove optimistic temporary version if any
        const filtered = existing.filter(
          (m) => !(m.isOptimistic && m.text === newMessage.text)
        );
        return {
          ...prev,
          [convId]: [...filtered, { ...newMessage, conversationId: convId }],
        };
      });

      // 2. Update conversation list & order
      setConversations((prev) => {
        const updated = prev.map((c) => {
          if (c._id === convId) {
            return {
              ...c,
              lastMessage: {
                text: newMessage.text,
                sender: senderId,
                createdAt: newMessage.createdAt,
              },
              updatedAt: newMessage.createdAt,
            };
          }
          return c;
        });

        // Sort to top
        return updated.sort((a, b) => {
          const timeA = new Date(a.updatedAt || a.lastMessage?.createdAt || 0).getTime();
          const timeB = new Date(b.updatedAt || b.lastMessage?.createdAt || 0).getTime();
          return timeB - timeA;
        });
      });

      // 3. Handle smart auto-scroll & unread counts
      if (currentActive && currentActive._id === convId) {
        if (!isAtBottomRef.current && !isMyMessage) {
          // User is scrolled up reading earlier messages -> show pill!
          setScrolledUpUnreadCount((c) => c + 1);
        }
      } else {
        // Message is for another conversation -> increment unread badge
        if (!isMyMessage) {
          setUnreadMap((prev) => ({
            ...prev,
            [convId]: (prev[convId] || 0) + 1,
          }));
        }
      }
    });

    // Handle conversation group updates (renames, participant additions)
    const unsubConv = socketService.onConversationUpdated((updatedConv: Conversation) => {
      setConversations((prev) => {
        const index = prev.findIndex((c) => c._id === updatedConv._id);
        if (index !== -1) {
          const clone = [...prev];
          clone[index] = { ...clone[index], ...updatedConv };
          return clone;
        } else {
          return [updatedConv, ...prev];
        }
      });

      if (activeConvRef.current && activeConvRef.current._id === updatedConv._id) {
        setActiveConversation((prev) => (prev ? { ...prev, ...updatedConv } : updatedConv));
      }
    });

    return () => {
      unsubMessage();
      unsubConv();
    };
  }, [token, user?._id]);

  // Select conversation
  const selectConversation = (conversation: Conversation) => {
    setActiveConversation(conversation);
    setScrolledUpUnreadCount(0);
    setIsAtBottom(true);
    // Clear unread count for this conversation
    setUnreadMap((prev) => ({ ...prev, [conversation._id]: 0 }));

    if (!messagesMap[conversation._id]) {
      loadMessages(conversation._id);
    }
  };

  // Send a message
  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || !activeConversation || !user) return;

    const convId = activeConversation._id;
    const tempId = `temp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    const optimisticMessage: Message = {
      _id: tempId,
      conversationId: convId,
      sender: {
        _id: user._id,
        name: user.name,
        phone: user.phone,
      },
      text: trimmed,
      createdAt: new Date().toISOString(),
      isOptimistic: true,
      status: 'sending',
    };

    // Optimistically add message
    setMessagesMap((prev) => ({
      ...prev,
      [convId]: [...(prev[convId] || []), optimisticMessage],
    }));

    // Optimistically update conversation lastMessage
    setConversations((prev) => {
      const updated = prev.map((c) => {
        if (c._id === convId) {
          return {
            ...c,
            lastMessage: {
              text: trimmed,
              sender: user._id,
              createdAt: optimisticMessage.createdAt,
            },
            updatedAt: optimisticMessage.createdAt,
          };
        }
        return c;
      });
      return updated.sort((a, b) => {
        const timeA = new Date(a.updatedAt || 0).getTime();
        const timeB = new Date(b.updatedAt || 0).getTime();
        return timeB - timeA;
      });
    });

    setIsSending(true);

    try {
      // Prioritize Socket.io connection when active
      if (socketService.isConnected()) {
        await socketService.sendMessage(convId, trimmed);
        setMessagesMap((prev) => {
          const list = prev[convId] || [];
          return {
            ...prev,
            [convId]: list.map((m) => (m._id === tempId ? { ...m, status: 'sent' } : m)),
          };
        });
      } else {
        // Fallback to REST API
        const sentMsg = await api.sendMessage(convId, trimmed);
        setMessagesMap((prev) => {
          const list = prev[convId] || [];
          return {
            ...prev,
            [convId]: list.map((m) => (m._id === tempId ? { ...sentMsg, status: 'sent' } : m)),
          };
        });
      }
    } catch (err: unknown) {
      console.error('Failed to send message:', err);
      setMessagesMap((prev) => {
        const list = prev[convId] || [];
        return {
          ...prev,
          [convId]: list.map((m) => (m._id === tempId ? { ...m, status: 'error' } : m)),
        };
      });
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  // Start direct conversation
  const startDirectChat = async (userId: string): Promise<Conversation> => {
    setError(null);
    try {
      const conv = await api.startDirectConversation(userId);
      setConversations((prev) => {
        const exists = prev.find((c) => c._id === conv._id);
        if (exists) return prev;
        return [conv, ...prev];
      });
      selectConversation(conv);
      return conv;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to start conversation';
      setError(message);
      throw err;
    }
  };

  // Create group conversation
  const createGroup = async (name: string, participantIds: string[]): Promise<Conversation> => {
    setError(null);
    try {
      const groupConv = await api.createGroup(name.trim(), participantIds);
      setConversations((prev) => [groupConv, ...prev]);
      selectConversation(groupConv);
      return groupConv;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create group';
      setError(message);
      throw err;
    }
  };

  const updateConversationInState = (updated: Partial<Conversation> & { _id: string }) => {
    setConversations((prev) =>
      prev.map((c) => (c._id === updated._id ? { ...c, ...updated } : c))
    );
    if (activeConversation && activeConversation._id === updated._id) {
      setActiveConversation((prev) => (prev ? { ...prev, ...updated } : null));
    }
  };

  const resetScrolledUpUnread = () => setScrolledUpUnreadCount(0);
  const clearError = () => setError(null);

  const currentMessages = activeConversation ? messagesMap[activeConversation._id] || [] : [];

  return (
    <ChatContext.Provider
      value={{
        conversations,
        activeConversation,
        messages: currentMessages,
        isLoadingConversations,
        isLoadingMessages,
        isSending,
        error,
        isAtBottom,
        scrolledUpUnreadCount,
        unreadMap,
        selectConversation,
        sendMessage,
        startDirectChat,
        createGroup,
        refreshConversations: loadConversations,
        refreshMessages: loadMessages,
        setIsAtBottom,
        resetScrolledUpUnread,
        clearError,
        updateConversationInState,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
