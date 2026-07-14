# 🏠 StayEase — Full Stack Airbnb Clone

<div align="center">

![StayEase Banner](https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1200&h=400&fit=crop)

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://stay-ease-airbnb-clone.vercel.app)
[![Backend API](https://img.shields.io/badge/Backend%20API-Render-purple?style=for-the-badge&logo=render)](https://stayease-airbnb-clone-1.onrender.com/api/health)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue?style=for-the-badge&logo=github)](https://github.com/amitsgupta11/stayease)

**A production-grade Airbnb Clone built with the MERN Stack**

[🌐 Live Demo](https://stay-ease-airbnb-clone.vercel.app) • [🔗 API Health](https://stayease-airbnb-clone-1.onrender.com/api/health) • [📱 Mobile Friendly](https://stay-ease-airbnb-clone.vercel.app)

</div>

---

## 🚀 Live Links

| Service | URL |
|---------|-----|
| 🌐 **Frontend (Vercel)** | https://stay-ease-airbnb-clone.vercel.app |
| ⚙️ **Backend API (Render)** | https://stayease-airbnb-clone-1.onrender.com |
| 🏥 **API Health Check** | https://stayease-airbnb-clone-1.onrender.com/api/health |

> ⚠️ **Note:** Backend is hosted on Render free tier — first request may take 30-60 seconds to wake up.

---

## 📸 Screenshots

| Home Page | Listings | Property Detail |
|-----------|----------|-----------------|
| ![Home](https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=400&h=250&fit=crop) | ![Listings](https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=250&fit=crop) | ![Detail](https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=250&fit=crop) |

| Host Dashboard | Admin Panel | Booking Page |
|----------------|-------------|--------------|
| ![Host](https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=400&h=250&fit=crop) | ![Admin](https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&h=250&fit=crop) | ![Booking](https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=250&fit=crop) |

---

## ✨ Features

### 🔐 Authentication
- JWT Authentication with Access Token (15 min) + Refresh Token (7 days)
- HTTP-Only Cookies for security
- Role-Based Access Control (User / Host / Admin)
- Forgot Password & Reset Password via Email
- Profile management with avatar upload

### 🏠 Listings
- Browse 50+ properties across India
- Advanced search by city, property type, price range
- Filter by bedrooms, bathrooms, guests, amenities
- Sorting (price, rating, newest)
- Pagination
- Image gallery with Swiper.js

### 📅 Booking System
- Date picker with availability check
- Real-time price calculation
  - Base price × nights
  - Cleaning fee
  - Service fee (14%)
  - GST taxes (18%)
- Booking confirmation with email notification
- Cancel booking
- Booking history

### ❤️ Wishlist
- Save/unsave properties
- Persistent across sessions
- Dedicated wishlist page

### ⭐ Reviews
- Star ratings (1-5)
- Write, edit, delete reviews
- Average rating calculation
- Only verified guests can review

### 🏡 Host Dashboard
- Create listings with multi-image upload
- Step-by-step listing wizard (6 steps)
- Edit/Delete listings
- View incoming bookings
- Revenue analytics

### 👑 Admin Panel
- Platform analytics dashboard
- Manage all users (view, delete, change role)
- Manage all listings
- View all bookings
- Revenue statistics

### 🎨 UI/UX
- Fully responsive (Mobile + Tablet + Desktop)
- Dark mode toggle
- Smooth animations with Framer Motion
- Loading skeletons
- Toast notifications
- 404 page

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 18** | UI Framework |
| **Vite** | Build Tool (10x faster than CRA) |
| **Tailwind CSS** | Styling |
| **Redux Toolkit** | State Management |
| **Redux Persist** | Persist auth state |
| **Axios** | HTTP Client with interceptors |
| **React Router v6** | Client-side routing |
| **Framer Motion** | Animations |
| **React Hook Form** | Form management |
| **React Hot Toast** | Notifications |
| **Swiper.js** | Image carousel |
| **React Loading Skeleton** | Loading states |

### Backend
| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime |
| **Express.js** | Web Framework |
| **MongoDB** | Database |
| **Mongoose** | ODM |
| **JWT** | Authentication |
| **bcryptjs** | Password hashing (12 rounds) |
| **Cloudinary** | Image storage & CDN |
| **Multer** | File upload handling |
| **Nodemailer** | Email service |
| **Helmet** | Security headers |
| **Express Rate Limit** | Brute force protection |
| **CORS** | Cross-origin resource sharing |

### DevOps & Deployment
| Service | Purpose |
|---------|---------|
| **Vercel** | Frontend hosting |
| **Render** | Backend hosting |
| **MongoDB Atlas** | Cloud database |
| **Cloudinary** | Image CDN |
| **GitHub** | Version control |

---

## 📁 Project Structure

```
stayease/
├── frontend/                  # React + Vite app
│   └── src/
│       ├── components/        # Reusable UI components
│       │   ├── common/        # Navbar, Footer
│       │   ├── listings/      # ListingCard, SearchBar, FilterBar
│       │   ├── reviews/       # ReviewList
│       │   └── ui/            # Spinner, StarRating, LoadingPage
│       ├── pages/             # All page components
│       │   ├── auth/          # Login, Register, ForgotPassword
│       │   ├── listings/      # HomePage, ListingsPage, DetailPage
│       │   ├── booking/       # BookingPage, ConfirmPage
│       │   ├── host/          # Dashboard, CreateListing, EditListing
│       │   ├── admin/         # Dashboard, Users, Listings
│       │   └── user/          # Profile, Bookings, Wishlist
│       ├── redux/             # State management
│       │   └── slices/        # auth, listings, booking, wishlist, ui
│       ├── services/          # API calls (Axios)
│       ├── hooks/             # useAuth, useListings, useWishlist
│       └── utils/             # helpers, constants
│
└── backend/                   # Express REST API
    └── src/
        ├── controllers/       # Route handlers (7 controllers)
        ├── models/            # Mongoose schemas (5 models)
        ├── routes/            # Express routers (7 routes)
        ├── middlewares/       # Auth, upload, error handling
        ├── utils/             # JWT, email, cloudinary helpers
        └── config/            # DB, cloudinary configuration
```

---

## 🗄️ Database Schema

```
Users         → name, email, password(hashed), role, avatar, tokens
Listings      → host, title, description, images, location, pricing, amenities
Bookings      → listing, guest, host, dates, guests, pricing snapshot, status
Reviews       → listing, author, booking, rating, comment, categories
Wishlists     → user, listings[]
```

---

## 🔌 API Endpoints

```
POST   /api/auth/register          → Register new user
POST   /api/auth/login             → Login
POST   /api/auth/logout            → Logout
POST   /api/auth/refresh-token     → Refresh access token
POST   /api/auth/forgot-password   → Send reset email
PUT    /api/auth/reset-password    → Reset password

GET    /api/listings               → Get all (search + filter + paginate)
GET    /api/listings/:id           → Get single listing
POST   /api/listings               → Create listing (Host)
PUT    /api/listings/:id           → Update listing (Host)
DELETE /api/listings/:id           → Delete listing (Host/Admin)

POST   /api/bookings               → Create booking
GET    /api/bookings/:id           → Get booking
PUT    /api/bookings/:id/cancel    → Cancel booking

GET    /api/reviews/listing/:id    → Get listing reviews
POST   /api/reviews                → Create review
PUT    /api/reviews/:id            → Edit review
DELETE /api/reviews/:id            → Delete review

GET    /api/wishlist               → Get wishlist
POST   /api/wishlist               → Toggle wishlist

GET    /api/admin/dashboard        → Analytics (Admin)
GET    /api/admin/users            → All users (Admin)
GET    /api/admin/listings         → All listings (Admin)
```

---

## 🔒 Security Features

- ✅ **Helmet** — Secure HTTP headers
- ✅ **Rate Limiting** — 200 req/15min globally, 10/15min on auth
- ✅ **JWT** — Short-lived access tokens (15 min)
- ✅ **HTTP-Only Cookies** — Refresh tokens immune to XSS
- ✅ **bcrypt** — Password hashing with 12 salt rounds
- ✅ **CORS** — Whitelisted origins only
- ✅ **Input Validation** — All routes validated
- ✅ **Role-Based Access** — User/Host/Admin permissions

---

## ⚡ Quick Start (Local Development)

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free)
- Cloudinary account (free)

### 1. Clone Repository
```bash
git clone https://github.com/amitsgupta11/stayease.git
cd stayease
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Fill in your .env values
npm run dev
# ✅ Running on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
# Create .env with:
# VITE_API_BASE_URL=http://localhost:5000/api
npm run dev
# ✅ Running on http://localhost:5173
```

### 4. Seed Database (Add 50 sample listings)
```bash
cd backend
node src/seed.js        # Add 10 listings
node src/seed-extra.js  # Add 40 more listings
```

### 5. Make yourself Admin
```
MongoDB Atlas → airbnb-clone → users → Edit your user → role: "admin"
```

---

## 🌍 Deployment

| Layer | Platform | Status |
|-------|----------|--------|
| Frontend | Vercel | ✅ Live |
| Backend | Render | ✅ Live |
| Database | MongoDB Atlas | ✅ Live |
| Images | Cloudinary | ✅ Live |

---

## 👨‍💻 Developer

**Amit Gupta**
- 🎓 Final Year B.Tech CSE
- 🌐 Portfolio-project: [stay-ease-airbnb-clone.vercel.app](https://stay-ease-airbnb-clone.vercel.app)
- 📧 Email: amitsgupta18@gmail.com
- 💼 GitHub: [@amitsgupta11](https://github.com/amitsgupta11)

---

## 📄 License

This project is built for educational and portfolio purposes.

---

<div align="center">

**⭐ If you found this project helpful, please give it a star!**

Made with ❤️ by Amit Gupta

</div>
