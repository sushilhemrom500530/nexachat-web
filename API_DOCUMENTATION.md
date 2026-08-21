# NexaChat - API Documentation & Specification

> **Base URL (REST):** `https://frontend-task-chatapp.onrender.com/api`  
> **WebSocket (Socket.io) URL:** `https://frontend-task-chatapp.onrender.com`  
> **Authentication:** Bearer Token (`Authorization: Bearer <token>`)

---

## 1. Authentication (`/auth`)

### 1.1 Login / Auto-Register
* **Endpoint:** `POST /api/auth/login`
* **Description:** Authenticates an existing user or automatically creates a new account if the phone number is not found.
* **Headers:** `Content-Type: application/json`
* **Request Body:**
```json
{
  "phone": "+8801700000001",
  "name": "Sushil Tester"
}
```
* **Success Response (`200 OK` / `201 Created`):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "6a88239de5d6aac97521e231",
    "name": "Sushil Tester",
    "phone": "+8801700000001",
    "createdAt": "2026-08-21T10:08:29.635Z"
  }
}
```
* **Error Response (`400 Bad Request`):**
```json
{
  "error": {
    "message": "Phone number and name are required",
    "code": "VALIDATION_ERROR"
  }
}
```

---

### 1.2 Get Current User Profile (`/auth/me`)
* **Endpoint:** `GET /api/auth/me`
* **Description:** Restores and verifies active session using the JWT.
* **Headers:** `Authorization: Bearer <token>`
* **Success Response (`200 OK`):**
```json
{
  "_id": "6a88239de5d6aac97521e231",
  "name": "Sushil Tester",
  "phone": "+8801700000001",
  "createdAt": "2026-08-21T10:08:29.635Z"
}
```
* **Error Response (`401 Unauthorized`):**
```json
{
  "error": {
    "message": "Invalid or expired token",
    "code": "UNAUTHORIZED"
  }
}
```

---

## 2. Users Search (`/users`)

### 2.1 Search Users by Name or Phone
* **Endpoint:** `GET /api/users/search?q={searchTerm}`
* **Headers:** `Authorization: Bearer <token>`
* **Query Parameters:**
  * `q` (required, string): Query string to search by user's full name or phone number.
* **Success Response (`200 OK`):**
```json
[
  {
    "_id": "6a88239de5d6aac97521e231",
    "name": "Sushil Tester",
    "phone": "+8801700000001"
  }
]
```

---

## 3. Conversations (`/conversations`)

### 3.1 List All User Conversations
* **Endpoint:** `GET /api/conversations`
* **Headers:** `Authorization: Bearer <token>`
* **Description:** Returns all direct and group conversations the authenticated user is participating in.
* **Success Response (`200 OK`):**
```json
{
  "data": [
    {
      "_id": "6a88273de5d6aac97521e356",
      "type": "direct",
      "updatedAt": "2026-08-21T11:21:34.879Z",
      "participant": {
        "_id": "6a882468e5d6aac97521e25e",
        "name": "Ada Lovelace",
        "phone": "+15551234567"
      },
      "lastMessage": {
        "text": "Hello!",
        "sender": "6a882468e5d6aac97521e25e",
        "createdAt": "2026-08-21T11:21:34.644Z"
      }
    },
    {
      "_id": "6a88489fe5d6aac97522243a",
      "type": "group",
      "name": "Engineering Team",
      "createdBy": "6a882dbee5d6aac97521e819",
      "admins": ["6a882dbee5d6aac97521e819"],
      "participants": [
        {
          "_id": "6a882dbee5d6aac97521e819",
          "name": "Ada Lovelace",
          "phone": "+15551234567"
        },
        {
          "_id": "6a88239de5d6aac97521e231",
          "name": "Sushil Tester",
          "phone": "+8801700000001"
        }
      ],
      "updatedAt": "2026-08-21T12:46:37.074Z",
      "lastMessage": {}
    }
  ]
}
```

---

### 3.2 Start Direct (1-to-1) Conversation
* **Endpoint:** `POST /api/conversations`
* **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
* **Request Body:**
```json
{
  "userId": "6a882468e5d6aac97521e25e"
}
```
* **Success Response (`200 OK` / `201 Created`):**
```json
{
  "_id": "6a88273de5d6aac97521e356",
  "type": "direct",
  "participant": {
    "_id": "6a882468e5d6aac97521e25e",
    "name": "Ada Lovelace",
    "phone": "+15551234567"
  },
  "updatedAt": "2026-08-21T11:21:34.879Z"
}
```

---

### 3.3 Get Conversation Message History
* **Endpoint:** `GET /api/conversations/{id}/messages`
* **Headers:** `Authorization: Bearer <token>`
* **Path Parameters:**
  * `id` (string): The conversation ID.
* **Query Parameters:**
  * `limit` (integer, optional, default: 20)
  * `before` (string, optional): Cursor message ID for pagination.
* **Success Response (`200 OK`):**
```json
{
  "data": [
    {
      "_id": "msg_001",
      "conversationId": "6a88273de5d6aac97521e356",
      "sender": {
        "_id": "6a882468e5d6aac97521e25e",
        "name": "Ada Lovelace"
      },
      "text": "Hello!",
      "createdAt": "2026-08-21T11:21:34.644Z"
    }
  ],
  "hasMore": false
}
```

---

## 4. Groups Management (`/conversations/group`)

### 4.1 Create Group Conversation
* **Endpoint:** `POST /api/conversations/group`
* **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
* **Request Body:**
```json
{
  "name": "Project Team",
  "participantIds": [
    "6a88239ee5d6aac97521e234",
    "6a8824a9e5d6aac97521e264"
  ]
}
```
* **Success Response (`201 Created`):** Returns the created group conversation object with admins and populated participants.

---

### 4.2 Add Participants to Group
* **Endpoint:** `POST /api/conversations/{id}/participants`
* **Headers:** `Authorization: Bearer <token>`
* **Request Body:**
```json
{
  "userIds": ["6a882806e5d6aac97521e4b3"]
}
```

---

### 4.3 Remove Participant or Leave Group
* **Endpoint:** `DELETE /api/conversations/{id}/participants/{userId}`
* **Headers:** `Authorization: Bearer <token>`
* **Note:** Passing current user's ID leaves the group.

---

### 4.4 Promote Member to Admin
* **Endpoint:** `POST /api/conversations/{id}/admins`
* **Headers:** `Authorization: Bearer <token>`
* **Request Body:**
```json
{
  "userId": "6a88239de5d6aac97521e231"
}
```

---

### 4.5 Rename Group
* **Endpoint:** `PATCH /api/conversations/{id}`
* **Headers:** `Authorization: Bearer <token>`
* **Request Body:**
```json
{
  "name": "New Team Name"
}
```

---

## 5. Messages (`/messages`)

### 5.1 Send Message (REST API)
* **Endpoint:** `POST /api/messages`
* **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
* **Request Body:**
```json
{
  "conversationId": "6a88273de5d6aac97521e356",
  "text": "Hello there! Let's get started."
}
```
* **Success Response (`201 Created`):**
```json
{
  "_id": "6a88239de5d6aac97521e999",
  "conversationId": "6a88273de5d6aac97521e356",
  "sender": "6a88239de5d6aac97521e231",
  "text": "Hello there! Let's get started.",
  "createdAt": "2026-08-21T12:50:00.000Z"
}
```

---

## 6. Real-Time WebSocket Protocol (Socket.io)

* **Server URL:** `https://frontend-task-chatapp.onrender.com` (Root Origin)
* **Connection Initialization:**
```typescript
import { io } from "socket.io-client";

const socket = io("https://frontend-task-chatapp.onrender.com", {
  auth: { token: "<JWT_TOKEN>" },
  transports: ["websocket", "polling"],
  reconnection: true
});
```

### Supported Socket Events:
1. **`message:send` (Client → Server):**
   * Payload: `{ conversationId: string, text: string }`
   * Callback Ack: `(response) => { ... }`
2. **`message:new` (Server → Client):**
   * Triggered when a new direct or group message arrives.
   * Payload: Full message object.
3. **`conversation:updated` (Server → Client):**
   * Triggered when a group is created, renamed, or participants change.
