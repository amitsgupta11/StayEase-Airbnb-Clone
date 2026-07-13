import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function NotFoundPage() {
  return (
    <motion.div className="min-h-[80vh] flex items-center justify-center text-center px-4"
      initial={{ opacity:0 }} animate={{ opacity:1 }}>
      <div>
        <p className="text-8xl mb-6">🏚️</p>
        <h1 className="text-5xl font-bold dark:text-white mb-3">404</h1>
        <p className="text-xl text-gray-500 dark:text-gray-400 mb-2">This page doesn't exist</p>
        <p className="text-sm text-gray-400 mb-8">The page you're looking for may have been moved or deleted.</p>
        <Link to="/" className="btn-primary">Go back home</Link>
      </div>
    </motion.div>
  );
}
