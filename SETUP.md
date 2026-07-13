# ⚡ VS Code Setup Guide — Step by Step

## Step 1: Install Prerequisites
- Node.js 18+ → https://nodejs.org
- MongoDB Atlas account → https://cloud.mongodb.com (free)
- Cloudinary account → https://cloudinary.com (free)

## Step 2: Open in VS Code
```bash
code airbnb-clone
```

## Step 3: Setup Backend
Open terminal in VS Code (Ctrl+`) and run:
```bash
cd backend
npm install
cp .env.example .env
```
Now open `.env` and fill in:
- `MONGODB_URI` → your Atlas connection string
- `JWT_ACCESS_SECRET` → any random 32+ char string
- `JWT_REFRESH_SECRET` → any other random 32+ char string
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` → from cloudinary.com
- `EMAIL_USER`, `EMAIL_PASS` → Gmail + App Password (optional)

Start backend:
```bash
npm run dev
# ✅ Server running on http://localhost:5000
```

## Step 4: Setup Frontend
Open new terminal:
```bash
cd frontend
npm install
cp .env.example .env
# .env already has: VITE_API_BASE_URL=http://localhost:5000/api
npm run dev
# ✅ Frontend on http://localhost:5173
```

## Step 5: Make yourself Admin
1. Register at http://localhost:5173/register
2. Open MongoDB Atlas → Browse Collections → users
3. Find your user → Edit → change `role` to `"admin"`
4. Log in again → you'll have full Admin Panel access

## Step 6: Create test data
1. Log in as admin → go to /host/listings/new
2. Create a few listings with images
3. Register a second account as a regular user
4. Browse, book, wishlist, and review listings

## Recommended VS Code Extensions
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- MongoDB for VS Code
- Thunder Client (API testing)

## Running Both Together
Use VS Code Split Terminal:
- Terminal 1: `cd backend && npm run dev`
- Terminal 2: `cd frontend && npm run dev`
