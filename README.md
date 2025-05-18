# 🎬 DN Cinema

A modern cinema management and movie browsing application with a **Go** backend and **Angular** frontend.

---

## 🧱 Tech Stack

### Backend
- **Go**, **Gin** (REST API)
- **MongoDB** (NoSQL database)
- **JWT** (Authentication)
- **Godotenv** (Env config)
- **TMDB API** (Movie data)

### Frontend
- **Angular**, **NG-ZORRO**
- **RxJS**, **Angular Router**
- **TypeScript**

---

## ✨ Features

### 🔐 Authentication
- Register, Login, Forgot/Reset Password
- JWT-based auth, Email verification

### 🎥 Movie Browsing
- Search, view details, reviews, trailers
- Popular, Top Rated, Upcoming movies (TMDB)

### 📋 Watchlist
- Add/remove movies to/from personal watchlist
- Check watchlist status

---

## 🚀 Setup Instructions

### Backend

1. Navigate to `backend/`
2. Create `.env` file:
    ```env
    PORT=5000
    MONGODB_URI=...
    ```
3. Install dependencies:
    ```bash
    go mod tidy
    ```
4. Run the server:
    ```bash
    go run main.go
    ```

### Frontend

1. Navigate to `frontend/`
2. Install dependencies:
    ```bash
    npm install
    ```
3. Create `src/environments/environment.ts`:
    ```ts
    export const environment = {
      production: false,
      apiUrl: 'http://localhost:5000/api'
    };
    ```
4. Run dev server:
    ```bash
    ng serve
    ```
5. Access: [http://localhost:4200](http://localhost:4200)

---

## 📡 API Overview

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/verify-email`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`

### User
- `GET /api/user/me`
- `PATCH /api/user/profile`

### Movies
- `GET /api/movies/search`
- `GET /api/movies/popular`
- `GET /api/movies/top-rated`
- `GET /api/movies/now-playing`
- `GET /api/movies/upcoming`
- `GET /api/movies/:id`
- `GET /api/movies/:id/reviews`
- `GET /api/movies/:id/similar`

### Watchlist
- `GET /api/watchlist`
- `POST /api/watchlist`
- `DELETE /api/watchlist/:id`
- `GET /api/movies/watchlist/status/:id`

---

## ⚙️ Requirements

### Backend
- Go 1.16+
- MongoDB 4.4+
- Internet (for TMDB API)

### Frontend
- Node.js 14+
- npm 6+
- Angular CLI 14+

---

## 👤 Author
**DucNhat**

## 📄 License
This project is licensed under the [MIT License](LICENSE).
