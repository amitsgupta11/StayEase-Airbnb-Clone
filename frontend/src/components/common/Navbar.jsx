import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiMenu, FiUser, FiHeart, FiSun, FiMoon, FiHome, FiLogOut, FiSettings } from "react-icons/fi";
import { MdAdminPanelSettings } from "react-icons/md";
import { toggleDarkMode } from "../../redux/slices/uiSlice.js";
import { useAuth } from "../../hooks/useAuth.js";
import { getInitials } from "../../utils/helpers.js";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, isAuthenticated, logout } = useAuth();
  const dispatch = useDispatch();
  const { darkMode } = useSelector(s => s.ui);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      navigate(`/listings?city=${encodeURIComponent(q)}`);
    } else {
      navigate("/listings");
    }
    setSearchQuery("");
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shadow-navbar">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <span className="text-2xl">🏠</span>
          <span className="text-xl font-bold text-primary hidden sm:block">StayEase</span>
        </Link>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="hidden md:flex items-center gap-3 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-2 hover:shadow-card transition-shadow flex-1 max-w-sm bg-white dark:bg-gray-900">
          <FiSearch className="text-primary flex-shrink-0" size={16}/>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search destinations..."
            className="w-full outline-none text-sm bg-transparent text-gray-700 dark:text-white placeholder-gray-400"
          />
        </form>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Dark mode */}
          <button
            onClick={() => dispatch(toggleDarkMode())}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-300">
            {darkMode ? <FiSun size={18}/> : <FiMoon size={18}/>}
          </button>

          {/* Become a Host */}
          {isAuthenticated && user?.role !== "admin" && (
            <Link to="/host" className="hidden md:block text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-2 rounded-lg transition-colors dark:text-gray-200">
              Become a Host
            </Link>
          )}

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 border border-gray-200 dark:border-gray-700 rounded-full px-3 py-2 hover:shadow-card transition-shadow">
              <FiMenu size={16} className="text-gray-600 dark:text-gray-300"/>
              {isAuthenticated ? (
                <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold overflow-hidden">
                  {user?.avatar?.url
                    ? <img src={user.avatar.url} alt={user.name} className="w-full h-full rounded-full object-cover"/>
                    : getInitials(user?.name)}
                </div>
              ) : (
                <FiUser size={16} className="text-gray-600 dark:text-gray-300"/>
              )}
            </button>

            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity:0, y:8, scale:0.95 }}
                  animate={{ opacity:1, y:0, scale:1 }}
                  exit={{ opacity:0, y:8, scale:0.95 }}
                  transition={{ duration:0.15 }}
                  className="absolute right-0 top-12 w-52 bg-white dark:bg-gray-800 rounded-2xl shadow-hover border border-gray-100 dark:border-gray-700 py-2 z-50">
                  {!isAuthenticated ? (
                    <>
                      <Link to="/login" onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold dark:text-white">
                        Log in
                      </Link>
                      <Link to="/register" onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-200">
                        Sign up
                      </Link>
                    </>
                  ) : (
                    <>
                      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                        <p className="font-semibold text-sm dark:text-white truncate">{user?.name}</p>
                        <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                      </div>
                      <Link to="/profile" onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-200">
                        <FiUser size={15}/> Profile
                      </Link>
                      <Link to="/my-bookings" onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-200">
                        <FiHome size={15}/> My Bookings
                      </Link>
                      <Link to="/wishlist" onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-200">
                        <FiHeart size={15}/> Wishlist
                      </Link>
                      {(user?.role === "host" || user?.role === "admin") && (
                        <Link to="/host" onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-200">
                          <FiSettings size={15}/> Host Dashboard
                        </Link>
                      )}
                      {user?.role === "admin" && (
                        <Link to="/admin" onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-200">
                          <MdAdminPanelSettings size={15}/> Admin Panel
                        </Link>
                      )}
                      <div className="border-t border-gray-100 dark:border-gray-700 mt-1">
                        <button
                          onClick={() => { logout(); setMenuOpen(false); }}
                          className="flex items-center gap-3 w-full px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 text-red-500">
                          <FiLogOut size={15}/> Logout
                        </button>
                      </div>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Mobile search */}
      <form onSubmit={handleSearch} className="md:hidden px-4 pb-3 flex gap-2">
        <div className="flex items-center gap-2 flex-1 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-2 bg-white dark:bg-gray-900">
          <FiSearch className="text-primary flex-shrink-0" size={14}/>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search destinations..."
            className="w-full outline-none text-sm bg-transparent text-gray-700 dark:text-white placeholder-gray-400"
          />
        </div>
        <button type="submit" className="bg-primary text-white rounded-full px-4 py-2 text-sm font-medium">
          Go
        </button>
      </form>
    </header>
  );
}
