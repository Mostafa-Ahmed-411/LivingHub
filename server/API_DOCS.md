# Maeesha API Documentation

**Base URL:** `http://localhost:5000/api`

## 1. Authentication (`/api/auth`)

| Method | Endpoint | Description | Role | Body / Params | Responses |
|---|---|---|---|---|---|
| POST | `/signup` | Register new user/owner | Public | `fullName`, `email`/`phone`, `password`, `role` (user/owner) | 201 Created (userId) |
| POST | `/verify` | Verify account via OTP | Public | `identifier` (email/phone), `code` | 200 OK |
| POST | `/login` | Login | Public | `identifier`, `password` | 200 OK (accessToken, user data). Set-Cookie: refreshToken |
| POST | `/refresh` | Get new access token | Public | `Cookie: refreshToken` | 200 OK (accessToken). Set-Cookie: refreshToken |
| POST | `/logout` | Logout | Auth | `Cookie: refreshToken` | 200 OK. Clears Cookie. |
| POST | `/forgot-password` | Request password reset | Public | `identifier` | 200 OK |
| POST | `/reset-password` | Reset password | Public | `token`, `newPassword` | 200 OK |
| POST | `/resend-otp` | Resend verification code | Public | `identifier` | 200 OK |

## 2. Unit Management (`/api/units`)

| Method | Endpoint | Description | Role | Body / Params | Responses |
|---|---|---|---|---|---|
| POST | `/` | Create a new unit | Owner/Admin | `FormData`: `images[]`, `unitType`, `listingType`, `price`, `address`, `description`, etc. | 201 Created |
| GET | `/:id` | Get unit details | Public | `Params`: `id` | 200 OK |
| PUT | `/:id` | Edit unit | Owner/Admin | `FormData`: `images[]`, updated fields | 200 OK |
| DELETE | `/:id` | Deactivate unit (Soft delete) | Owner/Admin | `Params`: `id` | 200 OK |
| PUT | `/:id/status` | Mark unit rented/sold | Owner/Admin | `status` (rented/sold), `tenantId` (optional) | 200 OK |

## 3. Search & Home (`/api/search`)

| Method | Endpoint | Description | Role | Body / Params | Responses |
|---|---|---|---|---|---|
| GET | `/recommended` | Get latest available units | Public | None | 200 OK (8 units) |
| GET | `/` | Search units | Public | `Query`: `unitType`, `listingType`, `minPrice`, `maxPrice`, `city`, `sort`, `page`, `limit` | 200 OK (Paginated) |

## 4. Owner Dashboard & Payments (`/api/owner`)

| Method | Endpoint | Description | Role | Body / Params | Responses |
|---|---|---|---|---|---|
| GET | `/dashboard/stats` | Owner stats | Owner | None | 200 OK |
| GET | `/dashboard/units` | My active units | Owner | None | 200 OK |
| GET | `/dashboard/history` | Rented/Sold units | Owner | None | 200 OK |
| POST | `/payments/initiate`| Pay for a unit | Owner | `FormData`: `proofImage`, `unitId`, `amount`, `method`, `transactionId` | 201 Created |
| GET | `/payments/my-payments`| Payment history | Owner | None | 200 OK |

## 5. User (Student) Dashboard (`/api/user`)

| Method | Endpoint | Description | Role | Body / Params | Responses |
|---|---|---|---|---|---|
| GET | `/dashboard/stats` | Booking stats | Auth | None | 200 OK |
| GET | `/dashboard/profile`| View profile | Auth | None | 200 OK |
| PUT | `/dashboard/profile`| Edit profile | Auth | `FormData`: `profileImage`, `fullName`, `email`, `phone` | 200 OK |
| PUT | `/dashboard/change-password` | Change password | Auth | `currentPassword`, `newPassword` | 200 OK |
| GET | `/dashboard/units` | My active rented units| Auth | None | 200 OK |
| GET | `/dashboard/history`| Past transactions | Auth | None | 200 OK |

## 6. Admin Dashboard (`/api/admin`)

| Method | Endpoint | Description | Role | Body / Params | Responses |
|---|---|---|---|---|---|
| GET | `/stats` | Platform statistics, sparklines, growth data & recent activity | Admin | None | 200 OK (`{ stats, sparklineUsers, sparklineUnits, growthData, recentActivity }`) |
| GET | `/pendings` | Pending units & payments | Admin | None | 200 OK |
| POST | `/units/:id/approve`| Approve unit | Admin | `Params`: `id` | 200 OK |
| POST | `/units/:id/reject` | Reject unit | Admin | `Params`: `id`, `Body`: `reason` | 200 OK |
| POST | `/payments/:id/approve` | Confirm payment | Admin | `Params`: `id` | 200 OK |
| POST | `/payments/:id/reject`| Reject payment | Admin | `Params`: `id`, `Body`: `reason` | 200 OK |
| GET | `/users` | List/search users | Admin | `Query`: `search`, `role`, `page` | 200 OK |
| POST | `/users/:id/ban` | Ban/Unban user | Admin | `Params`: `id` | 200 OK |
| POST | `/users/:id/flag` | Flag/Unflag user | Admin | `Params`: `id` | 200 OK |
| POST | `/ads` | Create an ad | Admin | `FormData`: `image`, `title`, `targetLocation`, `startDate`, `endDate`, `linkUrl` | 201 Created |
| GET | `/ads` | List all ads | Admin | None | 200 OK |
| POST | `/ads/:id/toggle` | Activate/Deactivate ad | Admin | `Params`: `id` | 200 OK |

## 7. Chat System (`/api/chat` & Socket.io)

### REST API
| Method | Endpoint | Description | Role | Body / Params | Responses |
|---|---|---|---|---|---|
| POST | `/start` | Start conversation for unit | Auth | `unitId` | 200 OK (Returns conv info) |
| GET | `/` | List my conversations | Auth | None | 200 OK |
| GET | `/:conversationId/messages`| Get message history | Auth | `Params`: `conversationId`, `Query`: `page`, `limit` | 200 OK |

### Socket.io Events (`/`)
- **Connection**: Requires auth token during handshake (`auth: { token: 'JWT_TOKEN' }`).
- **Emit `joinConversation`**: `{ conversationId }` -> Joins the specific chat room.
- **Emit `sendMessage`**: `{ conversationId, content }` -> Broadcasts to room. Returns error if blocked content (phone/links).
- **On `messageReceived`**: Event fired to receiver with new message payload.
- **Emit `markAsRead`**: `{ messageIds: ['id1', 'id2'] }` -> Marks messages as read in DB.

## 8. Notifications (`/api/notifications`)

| Method | Endpoint | Description | Role | Body / Params | Responses |
|---|---|---|---|---|---|
| GET | `/` | Get user notifications | Auth | `Query`: `page`, `limit` | 200 OK (Paginated + unreadCount) |
| PUT | `/mark-all-read` | Mark all as read | Auth | None | 200 OK |
| PUT | `/:id/read` | Mark single as read | Auth | `Params`: `id` | 200 OK |
