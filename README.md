# 🚗 HotHatch Garage AI

A full-stack MERN application that allows users to manage their cars, track modifications, and get AI-powered upgrade recommendations.

---

## 📌 Features

- 🔐 Authentication (JWT)
- 🚗 Car management (CRUD)
- 🔧 Modification tracking
- 🤖 AI upgrade recommendations (Groq API)
- 📊 Recommendation history

---

## 🛠 Tech Stack

- **Backend:** Node.js, Express, TypeScript
- **Database:** MongoDB, Mongoose
- **AI:** Groq (LLaMA 3)
- **Validation:** Zod
- **Auth:** JWT + Protected Routes

---

## ⚙️ Installation

```bash
git clone <repo-url>
cd hothatch-garage-ai
npm install
```

Create `.env` file:

```env
PORT=5000
MONGO_URI=your_mongo_uri
GROQ_API_KEY=your_api_key
JWT_SECRET=your_secret
```

Run server:

```bash
npm run dev
```

---

## 📡 API Endpoints

### 🔐 Auth

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/user/me`

---

### 🚗 Cars

- `POST /api/v1/cars`
- `GET /api/v1/cars`
- `GET /api/v1/cars/:id`
- `PATCH /api/v1/cars/:id`
- `DELETE /api/v1/cars/:id`

---

### 🔧 Modifications

- `POST /api/v1/modifications/:carId`
- `GET /api/v1/modifications/:carId`
- `PATCH /api/v1/modifications/:id`
- `DELETE /api/v1/modifications/:id`

---

### 🤖 AI

- `POST /api/v1/ai/recommend`
- `POST /api/v1/ai/upgrade/:carId`
- `GET /api/v1/ai/recommendations`
- `GET /api/v1/ai/recommendations/car/:carId`

---

## 🧠 Architecture

- Controllers handle business logic
- Middleware handles validation & authentication
- Global error handler manages errors
- Zod ensures input validation

---

## 🚀 Future Improvements

- Frontend with Next.js
- AI interview simulation
- Performance tracking
- Image upload for cars

---
