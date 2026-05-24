# Chatty Backend API Documentation

This document is for frontend development against the current Chatty backend.

## Frontend Readiness

The backend is ready enough to start frontend implementation for:

- Authentication: register, login, refresh token, logout, sessions, change password.
- Users: profile lookup, search, presence, profile update.
- Conversations: private/group conversations and participant management.
- Messages: send, list, mark read, unread count.
- File upload: authenticated multipart image upload.
- Realtime chat: SignalR hub at `/hubs/chat`.

Known frontend-facing notes:

- Protected endpoints require `Authorization: Bearer {accessToken}`.
- CORS currently allows `http://localhost:4200`.
- Local launch URLs are `http://localhost:5249` and `https://localhost:7277`.
- Swagger is enabled in Development at `/swagger`.
- JSON examples below use camelCase.
- `MessageType` and `MessageStatus` are numeric enums unless backend JSON enum settings are changed.

## Base URLs

Local HTTP:

```text
http://localhost:5249
```

Local HTTPS:

```text
https://localhost:7277
```

## Common Headers

For JSON requests:

```http
Content-Type: application/json
Accept: application/json
```

For authenticated requests:

```http
Authorization: Bearer {accessToken}
```

Correlation id is optional. If omitted, backend creates one:

```http
X-Correlation-ID: {uuid}
```

## Error Shape

Most business errors return:

```json
{
  "error": "User not found."
}
```

Validation errors can return ASP.NET validation problem details:

```json
{
  "type": "https://tools.ietf.org/html/rfc9110#section-15.5.1",
  "title": "One or more validation errors occurred.",
  "status": 400,
  "errors": {
    "email": ["'Email' is not a valid email address."]
  }
}
```

Unhandled exceptions return problem details:

```json
{
  "title": "Internal Server Error",
  "detail": "An unexpected error occurred.",
  "status": 500,
  "instance": "trace-id"
}
```

## Enums

### MessageType

```text
0 = Text
1 = Image
2 = File
```

### MessageStatus

```text
0 = Sent
1 = Delivered
2 = Read
```

## DTO Reference

### UserDto

```json
{
  "id": "uuid",
  "userName": "alice",
  "email": "alice@example.com",
  "displayName": "Alice",
  "avatarUrl": "https://...",
  "bio": "Hello",
  "createdAt": "2026-05-24T10:00:00Z",
  "lastActive": "2026-05-24T10:00:00Z",
  "latestLogin": "2026-05-24T10:00:00Z",
  "latestLogout": null
}
```

### UserPresenceDto

```json
{
  "userId": "uuid",
  "isOnline": true,
  "lastActiveUtc": "2026-05-24T10:00:00Z",
  "offlineMinutes": null
}
```

### ConversationDto

```json
{
  "id": "uuid",
  "name": "Project team",
  "isGroup": true,
  "ownerId": "uuid",
  "owner": {},
  "participants": [],
  "lastMessage": {},
  "createdAt": "2026-05-24T10:00:00Z",
  "updatedAt": "2026-05-24T10:05:00Z"
}
```

### ConversationParticipantDto

```json
{
  "conversationId": "uuid",
  "userId": "uuid",
  "isAdmin": false,
  "joinedAt": "2026-05-24T10:00:00Z",
  "user": {}
}
```

### MessageDto

```json
{
  "id": "uuid",
  "conversationId": "uuid",
  "senderId": "uuid",
  "content": "Hello",
  "type": 0,
  "status": 0,
  "sender": {},
  "attachments": [],
  "receipts": [],
  "createdAt": "2026-05-24T10:00:00Z",
  "updatedAt": null
}
```

### MessageAttachmentDto

```json
{
  "id": "uuid",
  "messageId": "uuid",
  "fileName": "image.png",
  "fileUrl": "https://...",
  "contentType": "image/png",
  "fileSizeBytes": 123456
}
```

### MessageReceiptDto

```json
{
  "messageId": "uuid",
  "userId": "uuid",
  "status": 2,
  "deliveredAt": "2026-05-24T10:01:00Z",
  "readAt": "2026-05-24T10:02:00Z",
  "user": {}
}
```

### PagedList<T>

Used by user search:

```json
{
  "items": [],
  "totalCount": 10,
  "pageIndex": 1,
  "pageSize": 20,
  "totalPages": 1,
  "hasPreviousPage": false,
  "hasNextPage": false
}
```

## Auth API

### Register

```http
POST /api/auth/register
```

Auth: public.

Request:

```json
{
  "userName": "alice",
  "email": "alice@example.com",
  "password": "Password123!"
}
```

Response `200 OK`:

```json
{
  "id": "uuid",
  "userName": "alice",
  "email": "alice@example.com",
  "displayName": null
}
```

Possible statuses: `200`, `400`, `409`.

### Login

```http
POST /api/auth/login
```

Auth: public.

Request:

```json
{
  "email": "alice@example.com",
  "password": "Password123!"
}
```

Response `200 OK`:

```json
{
  "userId": "uuid",
  "accessToken": "jwt",
  "expiresIn": 900,
  "refreshToken": "refresh-token",
  "refreshExpiresIn": 2592000
}
```

Possible statuses: `200`, `400`, `401`.

### Refresh Token

```http
POST /api/auth/refresh
```

Auth: public.

Request:

```json
{
  "refreshToken": "refresh-token"
}
```

Response `200 OK`:

```json
{
  "accessToken": "jwt",
  "expiresIn": 900,
  "refreshToken": "new-refresh-token",
  "refreshExpiresIn": 2592000
}
```

Possible statuses: `200`, `400`, `401`.

### Logout

```http
POST /api/auth/logout
```

Auth: required.

Request:

```json
{
  "userId": "uuid",
  "refreshToken": "refresh-token"
}
```

Response: `204 No Content`.

Possible statuses: `204`, `400`, `401`, `403`.

### Logout All Sessions

```http
POST /api/auth/logout-all-sessions
```

Auth: required.

Request:

```json
{
  "userId": "uuid"
}
```

Response: `204 No Content`.

Possible statuses: `204`, `400`, `401`, `403`.

### Change Password

```http
POST /api/auth/change-password
```

Auth: required.

Request:

```json
{
  "userId": "uuid",
  "currentPassword": "Password123!",
  "newPassword": "NewPassword123!"
}
```

Response: `204 No Content`.

Possible statuses: `204`, `400`, `401`, `403`, `404`.

### Get Active Sessions

```http
GET /api/auth/sessions
```

Auth: required.

Response `200 OK`:

```json
[
  {
    "tokenId": "uuid",
    "createdAt": "2026-05-24T10:00:00Z",
    "expiresAt": "2026-06-23T10:00:00Z",
    "createdByIp": "127.0.0.1",
    "isRevoked": false,
    "isReused": false
  }
]
```

Possible statuses: `200`, `401`.

## Users API

All users endpoints require auth.

### Get User By Id

```http
GET /api/users/{id}
```

Response `200 OK`: `UserDto`.

Possible statuses: `200`, `401`, `404`.

### Get User By Username

```http
GET /api/users/by-username/{userName}
```

Response `200 OK`: `UserDto`.

Possible statuses: `200`, `401`, `404`.

### Search Users

```http
GET /api/users/search?keyword=ali&pageIndex=1&pageSize=20
```

Response `200 OK`: `PagedList<UserDto>`.

If keyword is empty, response is:

```json
{
  "items": [],
  "totalCount": 0
}
```

Possible statuses: `200`, `401`.

### Get User Presence

```http
GET /api/users/{id}/presence
```

Response `200 OK`: `UserPresenceDto`.

Possible statuses: `200`, `401`, `404`.

### Update Profile

```http
PUT /api/users/{id}
```

Only the current authenticated user can update their own profile.

Request:

```json
{
  "displayName": "Alice Nguyen",
  "avatarUrl": "https://...",
  "bio": "Frontend engineer"
}
```

Response `200 OK`: `UserDto`.

Possible statuses: `200`, `401`, `403`, `404`.

## Conversations API

All conversation endpoints require auth.

### Create Private Conversation

```http
POST /api/conversations/private
```

The current user must be either `userAId` or `userBId`.

Request:

```json
{
  "userAId": "uuid",
  "userBId": "uuid"
}
```

Response `201 Created`: `ConversationDto`.

Possible statuses: `201`, `400`, `401`, `403`, `404`.

### Create Group Conversation

```http
POST /api/conversations/group
```

The current user must match `ownerId`. Backend adds owner to participants if missing.

Request:

```json
{
  "ownerId": "uuid",
  "name": "Project team",
  "participantIds": ["uuid", "uuid"]
}
```

Response `201 Created`: `ConversationDto`.

Possible statuses: `201`, `400`, `401`, `403`, `404`.

### Get My Conversations

```http
GET /api/conversations
```

Optional query:

```http
GET /api/conversations?userId={currentUserId}
```

If `userId` is supplied, it must equal the current authenticated user id. Backend still uses current user id.

Response `200 OK`:

```json
[
  {
    "id": "uuid",
    "name": "Project team",
    "isGroup": true,
    "ownerId": "uuid",
    "participants": [],
    "lastMessage": null,
    "createdAt": "2026-05-24T10:00:00Z",
    "updatedAt": null
  }
]
```

Possible statuses: `200`, `401`, `403`.

### Get Conversation By Id

```http
GET /api/conversations/{id}
```

Current user must be a participant.

Response `200 OK`: `ConversationDto`.

Possible statuses: `200`, `401`, `403`, `404`.

### Add Participant

```http
POST /api/conversations/{id}/participants
```

For group conversations, only the owner can add participants.

Request:

```json
{
  "userId": "uuid"
}
```

Response: `204 No Content`.

Possible statuses: `204`, `400`, `401`, `403`, `404`.

### Remove Participant

```http
DELETE /api/conversations/{id}/participants/{userId}
```

For group conversations, owner can remove anyone; a user can remove themselves.

Response: `204 No Content`.

Possible statuses: `204`, `400`, `401`, `403`, `404`.

## Messages API

All message endpoints require auth and are scoped under a conversation.

### Send Message

```http
POST /api/conversations/{conversationId}/messages
```

`senderId` must match the current authenticated user id.

Text request:

```json
{
  "senderId": "uuid",
  "content": "Hello",
  "type": 0,
  "attachments": null
}
```

Image/file request after upload:

```json
{
  "senderId": "uuid",
  "content": "image.png",
  "type": 1,
  "attachments": [
    {
      "fileName": "image.png",
      "fileUrl": "https://...",
      "contentType": "image/png",
      "fileSizeBytes": 123456
    }
  ]
}
```

Response `201 Created`: `MessageDto`.

Possible statuses: `201`, `400`, `401`, `403`, `404`.

### Get Messages

```http
GET /api/conversations/{conversationId}/messages?page=1&pageSize=50
```

Current user must be a participant.

Response `200 OK`:

```json
[
  {
    "id": "uuid",
    "conversationId": "uuid",
    "senderId": "uuid",
    "content": "Hello",
    "type": 0,
    "status": 0,
    "attachments": [],
    "receipts": [],
    "createdAt": "2026-05-24T10:00:00Z",
    "updatedAt": null
  }
]
```

Possible statuses: `200`, `400`, `401`, `403`.

### Mark Conversation As Read

```http
PUT /api/conversations/{conversationId}/messages/read
```

Response: `204 No Content`.

Possible statuses: `204`, `401`, `403`.

### Get Unread Count

```http
GET /api/conversations/{conversationId}/messages/unread-count
```

Response `200 OK`:

```json
{
  "count": 3
}
```

Possible statuses: `200`, `401`, `403`.

## Files API

### Upload File

```http
POST /api/files/upload
```

Auth: required.

Content type:

```http
multipart/form-data
```

Form field:

```text
file = selected image file
```

Limits:

- Max size: 10 MB.
- Allowed extensions: `.jpg`, `.jpeg`, `.png`, `.gif`, `.bmp`, `.tiff`, `.webp`.

Response `200 OK`:

```json
{
  "fileUrl": "https://..."
}
```

Possible statuses: `200`, `400`, `401`, `413`, `500`.

Frontend flow for image message:

1. Upload image with `POST /api/files/upload`.
2. Use returned `fileUrl` in `attachments`.
3. Send message with `type: 1`.

## SignalR Realtime API

Hub path:

```text
/hubs/chat
```

Auth: required. For JavaScript SignalR client, pass the access token with `accessTokenFactory`.

Example:

```ts
import * as signalR from "@microsoft/signalr";

const connection = new signalR.HubConnectionBuilder()
  .withUrl("http://localhost:5249/hubs/chat", {
    accessTokenFactory: () => accessToken,
  })
  .withAutomaticReconnect()
  .build();

await connection.start();
```

### Client Methods To Listen For

The server calls these client-side handlers:

```ts
connection.on("ReceiveMessage", (message: MessageDto) => {});

connection.on(
  "MessagesRead",
  (conversationId: string, readerUserId: string, messageIds: string[]) => {}
);

connection.on(
  "UserJoinedConversation",
  (conversationId: string, userId: string) => {}
);

connection.on(
  "UserLeftConversation",
  (conversationId: string, userId: string) => {}
);
```

### Server Hub Methods To Call

Join a conversation group:

```ts
await connection.invoke("JoinConversation", conversationId);
```

Leave a conversation group:

```ts
await connection.invoke("LeaveConversation", conversationId);
```

Keep presence fresh:

```ts
await connection.invoke("Heartbeat");
```

Recommended frontend behavior:

1. Start SignalR after login.
2. Join a conversation when opening its chat view.
3. Leave it when closing/navigating away.
4. Send messages through REST API.
5. Update UI from `ReceiveMessage`.
6. Call mark-read REST endpoint when the conversation is visible.

## Suggested Frontend Data Flow

### Initial App Load

1. Read tokens from secure frontend storage.
2. If access token is expired, call `POST /api/auth/refresh`.
3. Start SignalR connection.
4. Fetch current user's conversations with `GET /api/conversations`.
5. Fetch selected conversation messages with `GET /api/conversations/{id}/messages`.

### Login Flow

1. Call `POST /api/auth/login`.
2. Store `accessToken`, `refreshToken`, `userId`, and expiry timestamps.
3. Start SignalR.
4. Navigate to conversation list.

### Token Refresh Flow

1. On `401`, call `POST /api/auth/refresh`.
2. Replace both access token and refresh token.
3. Retry the failed request once.
4. If refresh fails, clear session and return to login.

### Sending Text Message

1. Call `POST /api/conversations/{conversationId}/messages`.
2. Optimistically append message if desired.
3. Reconcile with returned `MessageDto`.
4. Other clients receive `ReceiveMessage`.

### Sending Image Message

1. Call `POST /api/files/upload` with multipart form.
2. Call send message endpoint using returned `fileUrl`.
3. Render attachment URL from `message.attachments`.

## TypeScript Type Hints

```ts
export type MessageType = 0 | 1 | 2;
export type MessageStatus = 0 | 1 | 2;

export interface LoginResponseDto {
  userId: string;
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
  refreshExpiresIn: number;
}

export interface UserDto {
  id: string;
  userName: string;
  email: string;
  displayName?: string | null;
  avatarUrl?: string | null;
  bio?: string | null;
  createdAt: string;
  lastActive?: string | null;
  latestLogin?: string | null;
  latestLogout?: string | null;
}

export interface ConversationDto {
  id: string;
  name?: string | null;
  isGroup: boolean;
  ownerId?: string | null;
  owner?: UserDto | null;
  participants?: ConversationParticipantDto[] | null;
  lastMessage?: MessageDto | null;
  createdAt: string;
  updatedAt?: string | null;
}

export interface ConversationParticipantDto {
  conversationId: string;
  userId: string;
  isAdmin: boolean;
  joinedAt: string;
  user?: UserDto | null;
}

export interface MessageDto {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type: MessageType;
  status: MessageStatus;
  sender?: UserDto | null;
  attachments?: MessageAttachmentDto[] | null;
  receipts?: MessageReceiptDto[] | null;
  createdAt: string;
  updatedAt?: string | null;
}

export interface MessageAttachmentDto {
  id?: string;
  messageId?: string;
  fileName: string;
  fileUrl: string;
  contentType?: string | null;
  fileSizeBytes?: number | null;
}

export interface MessageReceiptDto {
  messageId: string;
  userId: string;
  status: MessageStatus;
  deliveredAt?: string | null;
  readAt?: string | null;
  user?: UserDto | null;
}
```

