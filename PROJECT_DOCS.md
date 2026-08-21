# NexaChat — Production-Grade Web Application Implementation Plan

## Overview
A high-performance, real-time messaging application built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **Socket.io**. Designed for instant 1-to-1 direct messaging, dynamic group collaboration, smart auto-scroll UX, and showcased via an interactive product landing page.

---

## 🏛️ System Architecture

```
                               ┌────────────────────────────────┐
                               │     Next.js 16 (App Router)    │
                               └───────────────┬────────────────┘
                                               │
               ┌───────────────────────────────┴───────────────────────────────┐
               ▼                                                               ▼
    ┌─────────────────────┐                                         ┌─────────────────────┐
    │  Creative Landing   │                                         │    Chat Web App     │
    │  Page (/ route)     │                                         │   (/chat route)     │
    └─────────────────────┘                                         └──────────┬──────────┘
                                                                               │
                          ┌────────────────────────────┬───────────────────────┴────────────────────────────┐
                          ▼                            ▼                                                    ▼
               ┌─────────────────────┐      ┌─────────────────────┐                              ┌─────────────────────┐
               │    Auth Context     │      │     Chat Context    │                              │  Socket.io Manager  │
               │  - Token Storage    │      │  - Conversations    │                              │  - Auto-reconnect   │
               │  - /auth/me verify  │      │  - Message History  │                              │  - message:new      │
               │  - Auto-login       │      │  - Smart Scrolling  │                              │  - conv:updated     │
               └─────────────────────┘      └─────────────────────┘                              └─────────────────────┘
```

---

## 📁 Directory & Component Structure

```
src/
├── app/
│   ├── layout.tsx                # Root layout with fonts, theme & global providers
│   ├── globals.css               # Design tokens, custom scrollbars, animations
│   ├── page.tsx                  # Part 2: Creative Product Landing Page
│   └── chat/
│       └── page.tsx              # Part 1: Full-featured Chat Application Screen
├── context/
│   ├── auth/
│   │   └── index.tsx             # Session management, JWT persistence, user profile
│   ├── chat/
│   │   └── index.tsx             # Global chat state, real-time message dispatcher
│   └── index.ts                  # Barrel export for context hooks
├── lib/
│   ├── api/
│   │   └── index.ts              # REST API client with interceptors & endpoints
│   ├── socket/
│   │   └── index.ts              # Socket.io connection instance & event listeners
│   ├── utils/
│   │   └── index.ts              # Date formatting, avatar color generator, scroll helpers
│   └── index.ts                  # Barrel export for lib utilities
├── types/
│   └── index.ts                  # TypeScript interfaces (User, Conversation, Message, Group, Events)
└── components/
    ├── auth/                     # login-modal/index.tsx
    ├── chat/                     # sidebar, chat-area, chat-header, message-list, group-info-drawer...
    ├── common/                   # avatar, empty-state, skeleton, error-banner
    └── home/                     # navbar, hero-section, interactive-demo, feature-showcase, architecture-visualizer, footer
```

---

## ⚡ Key Implementation Highlights

### 1. Robust Real-Time Synchronization (Socket.io)
- Single connection lifecycle tied to authenticated user token.
- Listens to `message:new` for instantaneous incoming messages.
- Listens to `conversation:updated` for live group modifications (member additions, renames).
- Automatic REST fallback and optimistic message rendering.

### 2. Smart UX Auto-Scroll (Non-Intrusive)
- Monitors `scrollTop` and `scrollHeight`.
- If the user is near the bottom (< 120px threshold), auto-scrolls down seamlessly on new incoming message.
- If the user is scrolled up browsing past history, auto-scroll is paused and a sleek floating pill **"↓ New Messages"** appears with an unread count badge. Clicking the pill smoothly scrolls to the latest message.

### 3. Production-Ready Error & Loading Handling
- Shimmer skeletons while fetching conversations and message threads.
- Comprehensive fallback UI for empty message history or no active conversation.
- Structured API response normalization (handling various backend return shapes without crashing).
- Form validation: disabling message sending for whitespace-only strings.

---

## 🚀 Execution Steps

1. **Step 1:** Establish TypeScript definitions (`src/types/index.ts`) and HTTP API Client (`src/lib/api.ts`).
2. **Step 2:** Build Authentication Context (`AuthContext.tsx`) and Login UI (`LoginModal.tsx`).
3. **Step 3:** Implement Chat Context (`ChatContext.tsx`) with Socket.io integration (`src/lib/socket.ts`).
4. **Step 4:** Build the Chat Workspace:
   - Sidebar (`Sidebar.tsx`, `ConversationItem.tsx`, `SearchUserModal.tsx`, `CreateGroupModal.tsx`).
   - Chat View (`ChatArea.tsx`, `MessageList.tsx`, `MessageBubble.tsx`, `MessageInput.tsx`, `SmartScrollPill.tsx`, `GroupInfoDrawer.tsx`).
5. **Step 5:** Build the Creative Product Landing Page (`/` route) showcasing features and interactive demo.
6. **Step 6:** Verification, responsive testing, and finalizing the Part 3 Thought Process Write-up in `README.md`.
