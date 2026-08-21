import { AuthResponse, Conversation, Message, MessagesResponse, User } from '@/types';

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_API_BASE_URL ||
  'https://frontend-task-chatapp.onrender.com/api';

export const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL ||
  process.env.NEXT_SOCKET_URL ||
  'https://frontend-task-chatapp.onrender.com';

export const DOCS_URL =
  process.env.NEXT_PUBLIC_DOCS_URL ||
  process.env.NEXT_DOCS_URL ||
  'https://frontend-task-chatapp.onrender.com/docs/';

class ApiClient {
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('nexachat_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return headers;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = { ...this.getHeaders(), ...(options.headers || {}) };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const errorMessage =
          data?.error?.message ||
          data?.message ||
          `Request failed with status ${response.status}`;
        throw new Error(errorMessage);
      }

      return data as T;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected network error occurred');
    }
  }

  // --- Auth APIs ---
  async login(phone: string, name: string): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ phone, name }),
    });
  }

  async getMe(): Promise<User> {
    return this.request<User>('/auth/me', {
      method: 'GET',
    });
  }

  // --- Users APIs ---
  async searchUsers(query: string): Promise<User[]> {
    if (!query || !query.trim()) return [];
    const res = await this.request<User[] | { data: User[] }>(`/users/search?q=${encodeURIComponent(query.trim())}`, {
      method: 'GET',
    });
    if (Array.isArray(res)) return res;
    if (res && Array.isArray(res.data)) return res.data;
    return [];
  }

  // --- Conversations APIs ---
  async getConversations(): Promise<Conversation[]> {
    const res = await this.request<Conversation[] | { data: Conversation[] }>('/conversations', {
      method: 'GET',
    });
    if (Array.isArray(res)) return res;
    if (res && Array.isArray(res.data)) return res.data;
    return [];
  }

  async startDirectConversation(userId: string): Promise<Conversation> {
    const res = await this.request<Conversation | { data: Conversation }>('/conversations', {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
    if ('data' in res && res.data) return res.data;
    return res as Conversation;
  }

  async createGroup(name: string, participantIds: string[]): Promise<Conversation> {
    const res = await this.request<Conversation | { data: Conversation }>('/conversations/group', {
      method: 'POST',
      body: JSON.stringify({ name, participantIds }),
    });
    if ('data' in res && res.data) return res.data;
    return res as Conversation;
  }

  async addParticipants(conversationId: string, userIds: string[]): Promise<Conversation> {
    return this.request<Conversation>(`/conversations/${conversationId}/participants`, {
      method: 'POST',
      body: JSON.stringify({ userIds }),
    });
  }

  async removeParticipant(conversationId: string, userId: string): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`/conversations/${conversationId}/participants/${userId}`, {
      method: 'DELETE',
    });
  }

  async promoteAdmin(conversationId: string, userId: string): Promise<Conversation> {
    return this.request<Conversation>(`/conversations/${conversationId}/admins`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  }

  async renameGroup(conversationId: string, name: string): Promise<Conversation> {
    return this.request<Conversation>(`/conversations/${conversationId}`, {
      method: 'PATCH',
      body: JSON.stringify({ name }),
    });
  }

  // --- Messages APIs ---
  async getMessages(conversationId: string, limit = 50, before?: string): Promise<MessagesResponse> {
    let query = `?limit=${limit}`;
    if (before) {
      query += `&before=${encodeURIComponent(before)}`;
    }
    const res = await this.request<Message[] | MessagesResponse>(`/conversations/${conversationId}/messages${query}`, {
      method: 'GET',
    });

    if (Array.isArray(res)) {
      return { data: res, hasMore: false };
    }
    return res;
  }

  async sendMessage(conversationId: string, text: string): Promise<Message> {
    const res = await this.request<Message & { conversation?: string }>('/messages', {
      method: 'POST',
      body: JSON.stringify({ conversationId, text }),
    });

    return {
      ...res,
      conversationId: res.conversationId || res.conversation || conversationId,
    };
  }
}

export const api = new ApiClient();
