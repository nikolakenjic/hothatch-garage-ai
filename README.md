# HotHatch Garage AI

**A full-stack garage management platform with AI-powered automotive recommendations.**

HotHatch Garage AI helps car enthusiasts manage their vehicles, track modifications and costs, and plan future upgrades with AI assistance.

Built with Next.js, React, TypeScript, Node.js, Express, MongoDB, and Groq.

**Live Application:** https://hothatch-garage-ai.vercel.app/

---

## Features

### Authentication & Account Management

- Email/password registration and login
- Google OAuth authentication
- JWT access and refresh token authentication
- HttpOnly authentication cookies
- Persistent sessions and refresh token rotation
- Email verification
- Password recovery and reset
- Profile and account settings
- Multi-device session support

### Garage Management

- Add, view, update, and delete vehicles
- Manage personal vehicle collections
- Search, filter, and paginate vehicles
- View detailed vehicle information
- User-based resource ownership protection

### Modifications

- Create and manage vehicle modifications
- Track modification details and costs
- View modification summaries
- Associate modifications with owned vehicles

### AI Garage Advisor

- AI-powered vehicle recommendations
- Vehicle-specific upgrade recommendations
- Personalized build plans
- Next-upgrade suggestions
- Build reviews
- Modification cost analysis
- AI recommendation history

AI recommendations are generated through the Groq API and are intended as informational guidance.

### User Profile & Settings

- Edit profile information
- Update password for password-based accounts
- Manage preferences and privacy settings
- View account statistics
- Access public profiles where permitted

---

## Tech Stack

| Layer          | Technologies                                     |
| -------------- | ------------------------------------------------ |
| Frontend       | Next.js 16, React 19, TypeScript, Tailwind CSS 4 |
| UI             | shadcn/ui, Radix UI, Lucide React                |
| Forms          | React Hook Form, Zod                             |
| Backend        | Node.js 22+, Express 5, TypeScript               |
| Database       | MongoDB Atlas, Mongoose                          |
| Authentication | JWT, bcryptjs, Google OAuth / OpenID Connect     |
| AI             | Groq SDK                                         |
| Email          | Resend                                           |
| Deployment     | Vercel, Render                                   |
| Validation     | Zod                                              |

Supported Node.js versions follow the project engine constraint: `>=22 <25`.

---

## Project Architecture

The repository contains two main applications:

```text
hothatch-garage-ai/
├── client/                 # Next.js frontend
│   ├── app/                # App Router pages and API routes
│   ├── components/         # Shared UI components
│   ├── context/            # React context providers
│   ├── lib/                # Utilities and authentication helpers
│   ├── services/           # API service layer
│   └── types/              # TypeScript definitions
│
├── server/                 # Express backend
│   └── src/
│       ├── config/         # Environment configuration
│       ├── constants/      # Shared constants
│       ├── middlewares/    # Validation, auth and error handling
│       ├── modules/        # Feature-based backend modules
│       └── utils/          # Shared utilities
│
└── README.md
```

### Backend Design

The Express backend follows a feature-based architecture with separate routes, controllers, services, models, and validation schemas.

Typical request flow:

```text
HTTP Request
    ↓
Route / Middleware
    ↓
Zod Validation
    ↓
Controller
    ↓
Service / Business Logic
    ↓
Mongoose / MongoDB
```

Key architectural decisions include centralized error handling, reusable ownership checks, TypeScript types, and separation of HTTP handling from business logic.

### Frontend Design

The frontend uses Next.js App Router, combining Server Components for server-side data access with Client Components for interactive functionality.

Shared API communication is organized through a service layer. Authentication also uses Next.js API routes to support cookie forwarding between the frontend and backend.

### Google OAuth Flow

```text
Browser
   ↓
Next.js OAuth Start Route
   ↓
Google Authorization
   ↓
Next.js OAuth Callback
   ↓
Express ID Token Verification
   ↓
MongoDB User + Session
   ↓
HttpOnly Authentication Cookies
   ↓
Authenticated Dashboard
```

The OAuth flow uses state, nonce, PKCE, and an encrypted short-lived transaction cookie. Existing email/password accounts are not automatically linked to Google identities.

---

## Security

The application includes the following security measures:

- HttpOnly authentication cookies
- Short-lived access tokens and refresh token rotation
- Hashed refresh tokens stored in database sessions
- Password hashing using bcrypt
- Input validation using Zod
- API rate limiting
- Resource ownership checks
- Centralized error handling
- Helmet security middleware
- Environment-based CORS configuration
- Google ID token verification
- OAuth state, nonce, and PKCE protection

Security controls reduce risk but do not replace independent security auditing.

---

## Getting Started

### Prerequisites

- Node.js 22, 23, or 24
- npm
- MongoDB database
- Groq API key
- Resend API key and configured sender address
- Google OAuth credentials for Google sign-in

### 1. Clone the Repository

```bash
git clone https://github.com/nikolakenjic/hothatch-garage-ai.git
cd hothatch-garage-ai
```

### 2. Configure the Backend

```bash
cd server
npm install
```

Copy `server/.env.example` to `server/.env` and replace the placeholders with your own configuration.

Important variables include:

| Variable             | Purpose                               |
| -------------------- | ------------------------------------- |
| `NODE_ENV`           | Application environment               |
| `PORT`               | Express server port                   |
| `MONGO_URI`          | MongoDB connection string             |
| `JWT_SECRET`         | Access token signing secret           |
| `JWT_REFRESH_SECRET` | Refresh token signing secret          |
| `GROQ_API_KEY`       | Groq API credentials                  |
| `RESEND_API_KEY`     | Email provider credentials            |
| `EMAIL_FROM`         | Verified sender address               |
| `CLIENT_URL`         | Allowed frontend origin               |
| `COOKIE_DOMAIN`      | Optional authentication cookie domain |
| `GOOGLE_CLIENT_ID`   | Google OAuth audience verification    |

Start the backend:

```bash
npm run dev
```

### 3. Configure the Frontend

From the repository root:

```bash
cd client
npm install
```

Copy `client/.env.example` to `client/.env.local`.

Configure:

| Variable                     | Purpose                              |
| ---------------------------- | ------------------------------------ |
| `NEXT_PUBLIC_API_URL`        | Express API base URL                 |
| `GOOGLE_CLIENT_ID`           | Google OAuth Client ID               |
| `GOOGLE_CLIENT_SECRET`       | Google OAuth Client Secret           |
| `GOOGLE_REDIRECT_URI`        | OAuth callback URL                   |
| `GOOGLE_OAUTH_COOKIE_SECRET` | 32-byte encryption key in hex format |

Generate the OAuth transaction encryption key:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

For local development with the backend running on port `3010`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3010/api/v1
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback
```

Start the frontend:

```bash
npm run dev
```

Open http://localhost:3000.

Configure the corresponding local redirect URI in Google Cloud Console before using Google sign-in.

**Never commit real `.env` files, API keys, JWT secrets, or OAuth credentials.**

---

## API Overview

Express API base path:

```text
/api/v1
```

### Authentication

| Method | Endpoint                    | Description                        |
| ------ | --------------------------- | ---------------------------------- |
| POST   | `/auth/register`            | Register an account                |
| POST   | `/auth/login`               | Email/password login               |
| POST   | `/auth/google`              | Verify Google ID token and sign in |
| POST   | `/auth/logout`              | Log out                            |
| GET    | `/auth/me`                  | Get authenticated user             |
| POST   | `/auth/refresh`             | Refresh authentication             |
| POST   | `/auth/verify-email`        | Verify email address               |
| POST   | `/auth/resend-verification` | Resend verification                |
| POST   | `/auth/forgot-password`     | Request password reset             |
| POST   | `/auth/reset-password`      | Reset password                     |

Google browser authentication begins through the Next.js route `/api/auth/google/start`.

### Garage & Modifications

The backend provides authenticated CRUD APIs for vehicles and their modifications under `/cars` and `/modifications`.

Resources are associated with their owners, and protected operations enforce ownership checks.

### AI Garage Advisor

| Method | Endpoint                         | Description                    |
| ------ | -------------------------------- | ------------------------------ |
| POST   | `/ai/recommend`                  | Recommend a vehicle            |
| GET    | `/ai/recommendations`            | List AI recommendation history |
| GET    | `/ai/recommendations/car/:carId` | View recommendations for a car |
| POST   | `/ai/build-plan/:carId`          | Generate a build plan          |
| POST   | `/ai/next-upgrade/:carId`        | Suggest the next upgrade       |
| POST   | `/ai/build-review/:carId`        | Review a vehicle build         |
| POST   | `/ai/cost-analysis/:carId`       | Analyze modification costs     |

AI endpoints require authentication and generation endpoints are rate-limited.

---

## Development Commands

### Frontend

```bash
npm run dev
npm run build
npm run start
npm run lint
```

### Backend

```bash
npm run dev
npm run build
npm run start
```

The backend also includes Vitest tooling. Automated test coverage is planned for further development.

---

## Deployment

The application is deployed using:

- **Vercel:** Next.js frontend
- **Render:** Express API
- **MongoDB Atlas:** Hosted database

Development follows a branch-based Git workflow:

```text
feature/fix branch
       ↓
Pull Request
       ↓
develop
       ↓
Release Pull Request
       ↓
main
       ↓
Production Deployment
```

The `main` branch is used for production releases.

---

## Current Limitations & Roadmap

V1 focuses on the core production application.

Known limitations and future improvements:

- Google OAuth is initially configured in Testing mode with authorized test users.
- Broader automated integration and end-to-end test coverage is planned.
- Further observability, reliability improvements, and usability refinements are planned.
- Additional functionality will be considered after the V1 feature freeze.

---

## Project Status

**V1 — Deployed**

The core application, including Google authentication, garage management, modifications, user settings, and AI recommendations, is available in production.

**Live Demo:** https://hothatch-garage-ai.vercel.app/
