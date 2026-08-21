import { io, Socket } from 'socket.io-client';
import { SOCKET_URL } from '../api';
import { Conversation, Message } from '@/types';

class SocketService {
  private socket: Socket | null = null;
  private token: string | null = null;

  connect(token: string) {
    if (this.socket && this.token === token && this.socket.connected) {
      return this.socket;
    }

    if (this.socket) {
      this.socket.disconnect();
    }

    this.token = token;
    this.socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    });

    this.socket.on('connect', () => {
      console.log('⚡ Socket connected successfully:', this.socket?.id);
    });

    this.socket.on('connect_error', (error) => {
      console.warn('⚠️ Socket connection error:', error.message);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('🔌 Socket disconnected:', reason);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.token = null;
    }
  }

  isConnected(): boolean {
    return Boolean(this.socket && this.socket.connected);
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  onNewMessage(callback: (message: Message) => void) {
    if (!this.socket) return () => {};
    this.socket.on('message:new', callback);
    return () => {
      this.socket?.off('message:new', callback);
    };
  }

  onConversationUpdated(callback: (conversation: Conversation) => void) {
    if (!this.socket) return () => {};
    this.socket.on('conversation:updated', callback);
    return () => {
      this.socket?.off('conversation:updated', callback);
    };
  }

  sendMessage(conversationId: string, text: string): Promise<boolean> {
    return new Promise((resolve) => {
      if (!this.socket || !this.socket.connected) {
        resolve(false);
        return;
      }
      this.socket.emit('message:send', { conversationId, text }, (ack: { ok?: boolean } | undefined) => {
        resolve(Boolean(ack?.ok !== false));
      });
      // Safety timeout after 2.5 seconds
      setTimeout(() => resolve(true), 2500);
    });
  }
}

export const socketService = new SocketService();
