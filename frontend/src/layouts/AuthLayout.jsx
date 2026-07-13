import { Outlet, Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <span className="text-3xl">🏠</span>
            <span className="text-2xl font-bold text-primary">StayEase</span>
          </Link>
        </div>
        <motion.div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card p-8"
          initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.4 }}>
          <Outlet />
        </motion.div>
      </div>
    </div>
  );
}
