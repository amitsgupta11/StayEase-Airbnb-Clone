import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";

// Layouts
import MainLayout from "./layouts/MainLayout.jsx";
import AuthLayout from "./layouts/AuthLayout.jsx";

// Pages - Auth
import LoginPage from "./pages/auth/LoginPage.jsx";
import RegisterPage from "./pages/auth/RegisterPage.jsx";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage.jsx";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage.jsx";

// Pages - Listings
import HomePage from "./pages/listings/HomePage.jsx";
import ListingsPage from "./pages/listings/ListingsPage.jsx";
import ListingDetailPage from "./pages/listings/ListingDetailPage.jsx";

// Pages - Booking
import BookingPage from "./pages/booking/BookingPage.jsx";
import BookingConfirmPage from "./pages/booking/BookingConfirmPage.jsx";

// Pages - User
import ProfilePage from "./pages/user/ProfilePage.jsx";
import BookingsPage from "./pages/user/BookingsPage.jsx";
import WishlistPage from "./pages/user/WishlistPage.jsx";

// Pages - Host
import HostDashboardPage from "./pages/host/HostDashboardPage.jsx";
import CreateListingPage from "./pages/host/CreateListingPage.jsx";
import EditListingPage from "./pages/host/EditListingPage.jsx";

// Pages - Admin
import AdminDashboardPage from "./pages/admin/AdminDashboardPage.jsx";
import AdminUsersPage from "./pages/admin/AdminUsersPage.jsx";
import AdminListingsPage from "./pages/admin/AdminListingsPage.jsx";

// Routes
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

export default function App() {
  const { darkMode } = useSelector(s => s.ui);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <Router>
      <Toaster position="top-center" toastOptions={{
        duration: 3000,
        style: { borderRadius:"12px", padding:"12px 16px", fontSize:"14px" },
        success: { iconTheme:{ primary:"#FF5A5F", secondary:"white" } },
      }}/>
      <Routes>
        {/* Auth routes */}
        <Route element={<AuthLayout/>}>
          <Route path="/login"           element={<LoginPage/>}/>
          <Route path="/register"        element={<RegisterPage/>}/>
          <Route path="/forgot-password" element={<ForgotPasswordPage/>}/>
          <Route path="/reset-password/:token" element={<ResetPasswordPage/>}/>
        </Route>

        {/* Main routes */}
        <Route element={<MainLayout/>}>
          <Route path="/"               element={<HomePage/>}/>
          <Route path="/listings"       element={<ListingsPage/>}/>
          <Route path="/listings/:id"   element={<ListingDetailPage/>}/>

          {/* Protected - User */}
          <Route element={<ProtectedRoute/>}>
            <Route path="/book/:listingId"   element={<BookingPage/>}/>
            <Route path="/booking/:id"       element={<BookingConfirmPage/>}/>
            <Route path="/profile"           element={<ProfilePage/>}/>
            <Route path="/my-bookings"       element={<BookingsPage/>}/>
            <Route path="/wishlist"          element={<WishlistPage/>}/>
          </Route>

          {/* Protected - Host */}
          <Route element={<ProtectedRoute roles={["host","admin"]}/>}>
            <Route path="/host"              element={<HostDashboardPage/>}/>
            <Route path="/host/listings/new" element={<CreateListingPage/>}/>
            <Route path="/host/listings/:id/edit" element={<EditListingPage/>}/>
          </Route>

          {/* Protected - Admin */}
          <Route element={<ProtectedRoute roles={["admin"]}/>}>
            <Route path="/admin"             element={<AdminDashboardPage/>}/>
            <Route path="/admin/users"       element={<AdminUsersPage/>}/>
            <Route path="/admin/listings"    element={<AdminListingsPage/>}/>
          </Route>

          <Route path="*" element={<NotFoundPage/>}/>
        </Route>
      </Routes>
    </Router>
  );
}
