export interface User {
  _id: string;
  name: string;
  phone: string;
  createdAt?: string;
  avatar?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LastMessage {
  text?: string;
  sender?: string;
  createdAt?: string;
}

export interface Participant {
  _id: string;
  name: string;
  phone: string;
  avatar?: string;
}

export interface Conversation {
  _id: string;
  type: 'direct' | 'group';
  name?: string;
  participant?: Participant; // for 1-to-1 direct chats
  participants?: Participant[]; // for group chats
  admins?: string[]; // for group chats: user ids of admins
  createdBy?: string; // for group chats
  lastMessage?: LastMessage;
  updatedAt?: string;
  createdAt?: string;
  unreadCount?: number;
}

export interface MessageSender {
  _id: string;
  name: string;
  phone?: string;
}

export interface Message {
  _id: string;
  conversationId: string;
  sender: string | MessageSender;
  text: string;
  createdAt: string;
  isOptimistic?: boolean;
  status?: 'sending' | 'sent' | 'error';
}

export interface MessagesResponse {
  data: Message[];
  hasMore?: boolean;
}

export interface SearchUsersResponse {
  data?: User[];
}
