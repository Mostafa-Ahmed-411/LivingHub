# Maeesha Backend API

This is the backend for Maeesha, a student housing platform for renting and buying apartments, rooms, studios, and beds.

## Tech Stack
- Node.js & Express.js
- MongoDB & Mongoose
- JSON Web Tokens (JWT) for Authentication
- Socket.io for Real-time Chat
- Multer for Image Uploads
- bcryptjs for Password Hashing

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (running locally or a MongoDB Atlas URI)

### Installation

1. **Clone the repository and install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Copy the `.env.example` file to `.env` and configure your settings:
   ```bash
   cp .env.example .env
   ```
   *Make sure to provide values for `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` (e.g., generate a random string).*

3. **Seed the Admin User (Optional but recommended):**
   ```bash
   npm run seed
   ```
   This will create a default admin user:
   - **Email:** `admin@maeesha.com`
   - **Password:** `admin1234`

4. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   The server will start on `http://localhost:5000` (or whatever `PORT` is defined in `.env`).

## Features & Modules
- **Authentication:** JWT Access + Refresh token flow, OTP verification (simulated).
- **Unit Management:** CRUD for properties (apartment, room, studio, bed).
- **Search & Filters:** Public endpoints to find available units.
- **Dashboards:** Separate functionality for Students (Users), Owners, and Admins.
- **Payment Flow:** Manual payment proof upload and admin verification.
- **Chat:** Real-time messaging using Socket.io.
- **Notifications:** In-app notification system.

## API Documentation
An exported Postman Collection or Markdown API Spec should be used to interact with the endpoints.
All API routes are prefixed with `/api`.
