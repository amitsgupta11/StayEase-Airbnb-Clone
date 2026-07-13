import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3"><span className="text-xl">🏠</span><span className="font-bold text-primary">StayEase</span></div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Find unique places to stay around the world.</p>
        </div>
        <div>
          <h4 className="font-semibold text-sm mb-3 dark:text-white">Explore</h4>
          <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
            <li><Link to="/listings" className="hover:text-primary">All Listings</Link></li>
            <li><Link to="/listings?propertyType=villa" className="hover:text-primary">Villas</Link></li>
            <li><Link to="/listings?propertyType=apartment" className="hover:text-primary">Apartments</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-sm mb-3 dark:text-white">Hosting</h4>
          <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
            <li><Link to="/host" className="hover:text-primary">Become a Host</Link></li>
            <li><Link to="/host/listings/new" className="hover:text-primary">Create Listing</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-sm mb-3 dark:text-white">Support</h4>
          <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
            <li><a href="#" className="hover:text-primary">Help Center</a></li>
            <li><a href="#" className="hover:text-primary">Cancellation Policy</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-200 dark:border-gray-800 py-4 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} StayEase. Designed & Developed by ❤️Amit.
      </div>
    </footer>
  );
}
