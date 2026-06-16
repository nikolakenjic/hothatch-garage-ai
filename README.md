# 🚗 HotHatch Garage AI

A full-stack web application for hot hatch enthusiasts who want to manage their cars, track modifications, and get AI-powered upgrade recommendations — all in one place.

---

## ✨ Features

- 🔐 JWT authentication with secure cookie storage
- 🚗 Full car management (add, edit, delete)
- 🔧 Modification tracking with cost overview
- 🤖 AI build planner powered by Groq (LLaMA 3)
- 🌙 Dark mode support
- 📱 Fully responsive design

---

## 🛠 Tech Stack

### Frontend

- **Next.js 15** (App Router, Server Components)
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui**
- **React Hook Form + Zod**

### Backend

- **Node.js + Express**
- **TypeScript**
- **MongoDB + Mongoose**
- **JWT Authentication**
- **Groq API (LLaMA 3)**

---

## ⚙️ Getting Started

### Prerequisites

- Node.js 18+
- MongoDB database
- Groq API key

### Backend Setup

```bash
cd server
npm install
```

Create `.env` file in `/server`:

```env
PORT=3010
MONGO_URI=your_mongo_uri
GROQ_API_KEY=your_api_key
JWT_SECRET=your_secret
```

```bash
npm run dev
```

### Frontend Setup

```bash
cd client
npm install
```

Create `.env.local` file in `/client`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3010/api/v1
```

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📡 API Endpoints

### 🔐 Auth

| Method | Endpoint                | Description       |
| ------ | ----------------------- | ----------------- |
| POST   | `/api/v1/auth/register` | Register new user |
| POST   | `/api/v1/auth/login`    | Login             |

### 🚗 Cars

| Method | Endpoint           | Description       |
| ------ | ------------------ | ----------------- |
| GET    | `/api/v1/cars`     | Get all user cars |
| POST   | `/api/v1/cars`     | Add new car       |
| GET    | `/api/v1/cars/:id` | Get car by ID     |
| PATCH  | `/api/v1/cars/:id` | Update car        |
| DELETE | `/api/v1/cars/:id` | Delete car        |

### 🔧 Modifications

| Method | Endpoint                       | Description           |
| ------ | ------------------------------ | --------------------- |
| GET    | `/api/v1/modifications/:carId` | Get car modifications |
| POST   | `/api/v1/modifications/:carId` | Add modification      |
| PATCH  | `/api/v1/modifications/:id`    | Update modification   |
| DELETE | `/api/v1/modifications/:id`    | Delete modification   |

### 🤖 AI

| Method | Endpoint                       | Description            |
| ------ | ------------------------------ | ---------------------- |
| POST   | `/api/v1/ai/build-plan/:carId` | Generate AI build plan |

---

## 🏗 Architecture Decisions

**Server Components for data fetching**
Pages that need data use Next.js Server Components — data is fetched on the server before the page is sent to the browser. No loading spinners, no useEffect, faster page loads.

**Service layer pattern**
All API calls go through a `BaseService` class with shared HTTP methods. Each feature has its own service (`CarService`, `ModificationService`) that builds on top of it. One place to change if the API ever changes.

**Feature-based component structure**
Components that are only used on one page live next to that page in a `_components` folder. Shared components live in the global `components` folder. This makes the codebase easy to navigate as it grows.

---

## 🔐 Security Notes

- Passwords are hashed with bcrypt on the server
- JWT tokens are stored in cookies with `SameSite=Strict`
- Token expiry checked on the client before making requests
- Note: tokens are stored in accessible cookies — `httpOnly` cookies would be more secure and is a planned improvement

---

## 🚀 Future Improvements

- Real-time AI chat for build advice
- Image upload for cars
- Modification cost charts and analytics
- Community features to connect with other enthusiasts

---

## 📸 Screenshots

_Coming soon_

---

## 🏗 Backend Architecture

The backend follows a feature-based architecture.

Each module contains its own:

- Controller
- Service
- Model
- Validation schemas
- Routes

Example:

```text
modules/
├── auth
├── car
├── modification
└── ai
```

### Request Flow

```text
Route
↓
Validation Middleware
↓
Controller
↓
Service
↓
Database
```

### Error Handling

The application uses:

- Custom `AppError` class
- `catchAsync` wrapper for async controllers
- Global error handler middleware

This ensures consistent API responses and centralized error management.

### Ownership Protection

Users can only access resources they own.

Ownership checks are implemented through reusable service helpers such as:

- `findOwnedCarOrFail`
- `findOwnedModificationOrFail`

This prevents unauthorized access to cars and modifications belonging to other users.
