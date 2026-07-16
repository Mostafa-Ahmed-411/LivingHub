# Maeesha — Functional Requirements Specification (FRS)

**Version:** 0.2
**Companion to:** Maeesha-PRD.md
**Purpose:** Break down every module into Main Function + detailed Functional Requirements, so each can be converted directly into tickets/user stories.

---

## Module 1 — Authentication

### Main Function
Handle identity, role assignment, and session management for Guest, User, Owner, and Admin.

### Functional Requirements

**FR-1.1 Sign Up**
- Input: `fullName`, `email` or `phone`, `password`, `role` (`user` | `owner`)
- Validate email format / phone format (Egyptian format if phone-based)
- Password: min 8 chars, at least 1 number
- Hash password (bcrypt) before storing
- Send verification email/OTP (recommend OTP for phone-based, since students may not always check email)
- On success → create `pending_verification` account, do not allow login until verified

**FR-1.2 Login**
- Input: `email/phone`, `password`
- Return JWT access token (short-lived, ~15 min) + refresh token (httpOnly cookie, ~7 days)
- Reject if account is `pending_verification`, `banned`, or `rejected` (for owners still under admin review)
- Rate-limit login attempts (5 attempts / 15 min) to prevent brute force

**FR-1.3 Forgot Password**
- Input: email/phone
- Generate time-limited reset token (15 min expiry)
- Send reset link/OTP
- On reset: invalidate all existing refresh tokens for that user (force re-login everywhere)

**FR-1.4 Role-Based Access Control (RBAC)**
- Middleware checks `req.user.role` against route permissions
- Roles: `guest` (no token), `user`, `owner`, `admin`
- Owner-specific routes (`/units/add`, etc.) must also check `owner.paymentStatus` or `owner.isApproved` where relevant

### Edge Cases to Handle
- Duplicate email/phone on signup → clear error, not generic 500
- Expired refresh token → force logout on frontend, not silent fail
- Owner tries `Add Unit` before completing payment → blocked with clear message, not a 403 with no explanation

---

## Module 2 — Unit Management (Core Entity)

### Main Function
Allow Owners/Admins to create, edit, and manage listings; allow Users/Guests to browse and filter them.

### Functional Requirements

**FR-2.1 Add Unit**
- Only accessible to `owner` (after payment approval) and `admin`
- Step 1: Select `unitType` (`apartment` | `room` | `studio` | `bed`)
- Step 2: If `apartment` → ask `listingType` (`rent` | `sale`); otherwise `listingType` is forced to `rent` (disable Sale option in UI entirely, don't just hide validation error)
- Step 3: Dynamic form based on type:
  | Field | apartment | room/studio | bed |
  |---|---|---|---|
  | Specifications (text) | ✅ | ✅ | ✅ (bed specs) |
  | Beds per room | ✅ | ✅ | ✅ |
  | Rooms per apartment | ✅ | ✅ | — |
  | Floor number | ✅ | ✅ | ✅ |
  | Address | ✅ | ✅ | ✅ |
  | Price | ✅ | ✅ | ✅ |
  | Description/Notes (free text) | ✅ | ✅ | ✅ |
  | Images (multiple) | ✅ | ✅ | ✅ |
- Step 4: Submit → status = `pending_payment` (if owner hasn't paid the listing fee) or `pending_approval` (if paid, waiting for admin content review)
- Backend must re-validate `listingType` vs `unitType` even if frontend blocks it (never trust client-side only)

**FR-2.2 Edit Unit**
- Owner can edit own units only (`ownerId === req.user._id`)
- Admin can edit any unit
- Editing a `rented`/`sold` unit should be restricted to non-critical fields (description, images) — price/type changes on an active unit should require re-approval

**FR-2.3 Delete/Deactivate Unit**
- Soft delete (`isActive: false`) instead of hard delete — preserves history for `My History` tab and payment records

**FR-2.4 Browse & Filter Units**
- Filters: `unitType`, `listingType`, `priceRange`, `governorate/city`, `nearestUniversity`, `availability`
- Pagination (cursor-based recommended for scale, or page-based for MVP simplicity)
- Sort options: newest, price ascending/descending

**FR-2.5 Unit Status Lifecycle**
```
pending_payment → pending_approval → available → (rented | sold) → history
                                    → rejected (admin can reject with reason)
```
- Every status change should be logged with `changedBy`, `timestamp`, `reason` (for audit/dispute resolution)

### Edge Cases
- Owner submits unit, payment fails midway → unit should not appear anywhere except owner's own "pending" list
- Admin rejects a unit → owner must receive a notification with rejection reason, not just silence

---

## Module 3 — Home Page & Search

### Main Function
Public entry point showing recommended units and providing access to full search/filter experience.

### Functional Requirements

**FR-3.1 Favorites (Paid Placement) System**

Owners can pay to make their unit a **Favorite**. Capped at **20 concurrent Favorites** platform-wide.

- **How it works:**
  - Owner pays a "favorite fee" (same manual Vodafone Cash/InstaPay + admin approval pattern as Module 7)
  - If a slot is available (less than 20 active Favorites), admin approves and the unit becomes a Favorite for **30 days**
  - If all 20 slots are taken, the request is rejected and the owner is notified to try again later (no waitlist in MVP)
  - After 30 days, the Favorite status expires automatically and the slot frees up

- **Ranking:** Favorites are ordered by rating (highest first). Paying guarantees a slot, not a fixed position.

- **Where Favorites appear:**
  1. **Home — Recommended section:** shows Favorites only, no other units mixed in. If 1 owner is currently a Favorite, only 1 unit shows. If none are active, the section stays empty (with an "no featured units yet" message).
  2. **Search results:** active Favorites are pinned to the top of the first page only (ranked by rating), followed by regular units below.

- **Dependency:** ranking by rating needs a Reviews module that isn't built yet. Until then, rank by newest first as a temporary fallback.

- **Open decision:** if a payment is rejected because slots are full, does the owner get an automatic refund, or do they need to contact support manually?

**FR-3.2 Search Entry Point**
- Prominent search button/input on Home → redirects to `/search` with query params preserved (e.g., `?university=Cairo University`)

**FR-3.3 Search Results Page**
- Reuses FR-2.4 filtering logic
- Should support URL-shareable filters (so a user can share a filtered link)

**FR-3.4 Static Content**
- "About Us" / "Why Maeesha" section — static content, likely CMS-editable by Admin in the future, hardcoded for MVP

---

## Module 4 — User (Student) Dashboard

### Main Function
Give students visibility into their bookings, communications, and account details.

### Functional Requirements

**FR-4.1 Dashboard Home**
- Stats: total bookings, active bookings, completed transactions
- Chart: bookings over time (simple bar/line chart is enough for MVP — Recharts recommended)
- Quick shortcuts: "Browse Units" and "My Saved Favorites" as CTA buttons on the dashboard home, instead of requiring navigation through the sidebar

**FR-4.2 Information / Edit Information**
- View: name, email/phone, profile picture, joined date, gender, date of birth, hometown (student's home governorate/city — kept separate from unit `address` in Module 2), faculty (for students) *or* job/occupation (for expats/non-students) as two separate optional fields
- Edit: name, phone, profile picture, password change (require current password), faculty/job, hometown

**FR-4.3 My Chats**
- List of conversations sorted by `lastMessageAt desc`
- Unread indicator per conversation

**FR-4.4 My Units**
- Units currently rented/purchased by this user
- Show status: active rental, pending confirmation, etc.

**FR-4.5 My History**
- Past completed transactions (read-only)
- Include: unit snapshot (in case listing was later edited/deleted), dates, amount paid

**FR-4.6 Community (Future)**
- Not in MVP scope — placeholder tab

---

## Module 5 — Owner Dashboard

### Main Function
Give owners tools to manage their listings and track performance.

### Functional Requirements

**FR-5.1 Dashboard Home**
- Stats: total units listed (by type), booked count, available count
- Chart: bookings/inquiries over time

**FR-5.2 Add Unit (persistent button)**
- Always visible in navbar/sidebar regardless of current page
- Disabled state with tooltip if owner has an unpaid pending listing fee

**FR-5.3 My Units**
- List of owner's own units with status badges (`pending_payment`, `pending_approval`, `available`, `rented`, `rejected`)
- Quick actions: Edit, Deactivate, View inquiries

**FR-5.4 My History**
- Completed rentals/sales (read-only, for owner's own records)

**FR-5.5 Information / Edit Information / My Chats**
- Same structure as User (FR-4.2, FR-4.3), scoped to owner's account

---

## Module 6 — Admin Dashboard

### Main Function
Full platform control: approvals, user management, payments, and business features (ads).

### Functional Requirements

**FR-6.1 Dashboard Home**
- Platform-wide stats: total users, total owners, total units by type, booked vs available ratio
- Chart: platform growth over time (new signups, new listings)

**FR-6.2 Pendings Tab**
- List of units with status `pending_approval` or `pending_payment`
- For `pending_payment`: show payment proof (screenshot/transaction ID) submitted by owner
- Actions: **Approve** (→ status `available`), **Reject** (→ requires reason, notifies owner)
- All actions logged in `AuditLog` (adminId, action, targetId, timestamp, reason)

**FR-6.3 User Management**
- View/search all users and owners
- Actions: ban/unban, view their units/history

**FR-6.4 Ads Management**
- Add/Edit/Delete advertisement entries
- Fields: `title`, `image`, `targetLocation`, `linkUrl`, `startDate`, `endDate`, `isActive`
- Ads displayed contextually (e.g., on search results page filtered by matching location)

**FR-6.5 Information / Edit Information / My Chats / My Units / My History**
- Same as Owner (admin can also directly list units if acting as a broker)

### Edge Cases
- Two admins approving the same pending unit simultaneously → use optimistic locking or a DB transaction to avoid double-processing
- Rejected owner listing fee payment (fraudulent proof) → admin needs a "flag user" action, not just reject silently

---

## Module 7 — Payment Flow (Manual, MVP)

### Main Function
Collect the listing fee from Owners via manual mobile wallet transfer, verified by Admin.

### Functional Requirements

**FR-7.1 Initiate Payment**
- On "Add Unit" submission, owner is shown the platform's Vodafone Cash/InstaPay number
- Owner uploads: `transactionScreenshot` (image) + `transactionId` (text, optional but recommended)
- Creates a `Payment` record: `{ ownerId, unitId, amount, method, proofImage, transactionId, status: "pending" }`

**FR-7.2 Admin Manual Review**
- Admin sees payment proof in Pendings tab
- Approve → `Payment.status = "confirmed"`, unit moves to `pending_approval` (content review) or directly `available` if content was already fine
- Reject → `Payment.status = "rejected"`, owner notified with reason, can resubmit

**FR-7.3 Payment Audit Log**
- Every approve/reject action stored with `adminId`, `timestamp` — required for future disputes and accounting

### Recommendation
This manual flow works for MVP/launch but will not scale past a small number of daily transactions. Flag this in the backlog as **"Migrate to Paymob/Fawry integration — Phase 2"** so the team plans the payment table schema in a way that a future gateway can slot in without a full rewrite (i.e., keep `method` and `status` generic enums, not hardcoded to "manual").

---

## Module 8 — Chat / Messaging

### Main Function
Secure in-platform communication between Students and Owners without exposing personal phone numbers directly.

### Functional Requirements

**FR-8.1 Start Conversation**
- Triggered from a Unit page ("Contact Owner" button)
- Creates or reuses existing `Conversation` between the two users, scoped to that unit

**FR-8.2 Real-time Messaging**
- Recommend Socket.io for real-time delivery
- Message read/unread status
- Store messages in MongoDB for history

**FR-8.3 Safety**
- Consider basic content filtering (block sharing of raw phone numbers/external links) to keep communication on-platform, at least in MVP

---

## Module 9 — Notification System

### Main Function
Keep all roles informed of relevant events without needing to poll manually.

### Functional Requirements

**FR-9.1 Triggers**
- New chat message
- Unit approved/rejected
- Payment confirmed/rejected
- Booking confirmed

**FR-9.2 Delivery**
- MVP: in-app notification bell + unread count
- Phase 2: Email and/or push notifications

**FR-9.3 Data Model**
```js
Notification {
  userId, type, message, relatedEntityId, isRead, createdAt
}
```

---

## Module 10 — Rating & Reviews

### Main Function
Let students who completed a real transaction rate their experience, producing the trust signal used for ranking and display in Module 2 (Unit Management) and Module 3 (Favorites/Search).

### Functional Requirements

**FR-10.1 Who Can Rate**
- Only users with a `completed` transaction for that specific unit (from `My History`, FR-4.5)
- One review per transaction, not per user/unit — the same user renting the same unit twice can leave two separate reviews

**FR-10.2 What Gets Rated**
- Rate the **Unit** (1–5 stars + optional comment)
- Roll the rating up into the **Owner's** aggregate rating as well, since repeat owners matter for trust, not just individual listings

**FR-10.3 Data Model**
```js
Review {
  userId, unitId, ownerId, transactionId,
  rating: Number (1-5),
  comment: String (optional),
  isHidden: Boolean (default false),
  createdAt, updatedAt
}
```

**FR-10.4 Aggregation**
- On create/edit/delete → recalculate `Unit.averageRating` + `Unit.reviewsCount`, and separately `Owner.averageRating`
- Recalculate on write, not on every read, since these fields are already used in sort queries for Favorites/Search

**FR-10.5 Edit Window**
- Reviewer can edit their review within a limited window (e.g., 7 days) — allows corrections without permanent regret-driven reviews

**FR-10.6 Moderation**
- Admin can hide a review (`isHidden = true`) without deleting it, consistent with the approval/audit pattern used elsewhere in the platform
- Recalculate the aggregate immediately once a review is hidden

**FR-10.7 Where It's Used**
- Unit detail page (rating + comments)
- Owner profile (aggregate rating)
- Module 3 Favorites ranking
- Module 3 organic Search ranking

---

## Module 11 — Community (Future Scope — not MVP)

### Main Function
Allow students to post/interact socially (roommate search, general discussion).

### Functional Requirements (Phase 2)
- Create post (text + optional image)
- Comment/like
- Report post (moderation queue for Admin)

---

## Suggested Build Order (Sprint Planning)

1. **Sprint 1:** Auth (FR-1.x) + basic User/Owner/Admin role scaffolding
2. **Sprint 2:** Unit Management (FR-2.x) — this is your core entity, everything depends on it
3. **Sprint 3:** Home + Search/Filter (FR-3.x, FR-2.4)
4. **Sprint 4:** Owner Dashboard + Payment Flow (FR-5.x, FR-7.x) — needed before real owners can use the platform
5. **Sprint 5:** Admin Dashboard + Pendings/Approvals (FR-6.x)
6. **Sprint 6:** User Dashboard (FR-4.x)
7. **Sprint 7:** Chat (FR-8.x) + Notifications (FR-9.x)
8. **Sprint 8:** Rating & Reviews (FR-10.x) — unlocks real `averageRating` values for Favorites/Search ranking
9. **Backlog/Phase 2:** Ads (FR-6.4), Community (Module 11), real payment gateway

Rationale: Unit Management is the highest-risk, highest-dependency module — build and stabilize it before dashboards that just display/consume it. Rating & Reviews comes after Chat/Notifications since it depends on completed transactions existing first.
