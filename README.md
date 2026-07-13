# 🏠 StayEase — Full Stack Airbnb Clone

A production-grade Airbnb clone built with the MERN stack for placement portfolio.

## 🚀 Quick Start

### 1. Clone and setup
```bash
git clone <your-repo>
cd airbnb-clone
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Fill in your .env values (MongoDB, JWT, Cloudinary, Email)
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# Set VITE_API_BASE_URL=http://localhost:5000/api
npm run dev
```

### 4. Open
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api/health

## 🔐 Test Credentials
Create accounts via /register. To make someone admin, update their role directly in MongoDB Atlas:
```
db.users.updateOne({ email: "you@email.com" }, { $set: { role: "admin" } })
```

## ✅ Features
- JWT Auth (Access + Refresh tokens, HTTP-Only cookies)
- Role-based access: User / Host / Admin
- Property listings with Cloudinary image upload
- Advanced search + filters (city, type, price, bedrooms, amenities)
- Full booking system with price breakdown
- Wishlist (toggle save/remove)
- Reviews & star ratings
- Host dashboard (manage listings + bookings)
- Admin panel (users, listings, analytics)
- Dark mode
- Fully responsive (mobile-first)
- Email notifications (booking confirmation, password reset)

## 🛠 Tech Stack
| Layer | Tech |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, Redux Toolkit, Framer Motion |
| Backend | Node.js, Express.js, MongoDB, Mongoose |
| Auth | JWT (Access + Refresh tokens), bcrypt, HTTP-Only Cookies |
| Images | Cloudinary |
| Email | Nodemailer (Gmail SMTP) |
| Deploy | Vercel (FE) + Render (BE) + MongoDB Atlas |

## 📁 Folder Structure
```
airbnb-clone/
├── backend/
│   └── src/
│       ├── controllers/   # Route handlers
│       ├── models/        # Mongoose schemas
│       ├── routes/        # Express routers
│       ├── middlewares/   # Auth, upload, error
│       ├── utils/         # JWT, email, cloudinary
│       └── config/        # DB, cloudinary setup
└── frontend/
    └── src/
        ├── pages/         # All page components
        ├── components/    # Reusable UI components
        ├── redux/         # State management
        ├── services/      # API calls (Axios)
        ├── hooks/         # Custom React hooks
        └── utils/         # Helpers, constants
```

## 🌍 Deployment
- **Frontend** → Vercel: `npm run build` → deploy `dist/`
- **Backend** → Render: set all env vars in Render dashboard
- **Database** → MongoDB Atlas (free tier)
- **Images** → Cloudinary (free tier)
