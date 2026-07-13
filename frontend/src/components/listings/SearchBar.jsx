import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiSearch, FiMapPin, FiCalendar, FiUsers } from "react-icons/fi";

export default function SearchBar() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ city:"", checkIn:"", checkOut:"", guests:"1" });

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (form.city) params.set("city", form.city);
    if (form.guests) params.set("guests", form.guests);
    navigate(`/listings?${params.toString()}`);
  };

  return (
    <motion.form onSubmit={handleSearch}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-hover p-2 flex flex-col md:flex-row gap-2 md:gap-0 md:items-center border border-gray-100 dark:border-gray-700"
      initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}>

      <div className="flex items-center gap-3 flex-1 px-4 py-2 md:border-r border-gray-200 dark:border-gray-700">
        <FiMapPin className="text-primary flex-shrink-0"/>
        <input className="w-full outline-none text-sm bg-transparent dark:text-white placeholder-gray-400"
          placeholder="Where are you going?"
          value={form.city}
          onChange={e => setForm(p => ({...p, city:e.target.value}))}/>
      </div>
      <div className="flex items-center gap-3 flex-1 px-4 py-2 md:border-r border-gray-200 dark:border-gray-700">
        <FiCalendar className="text-primary flex-shrink-0"/>
        <input type="date" className="w-full outline-none text-sm bg-transparent dark:text-white text-gray-600 dark:text-gray-300"
          value={form.checkIn} onChange={e => setForm(p => ({...p, checkIn:e.target.value}))}
          min={new Date().toISOString().split("T")[0]}/>
      </div>
      <div className="flex items-center gap-3 flex-1 px-4 py-2 md:border-r border-gray-200 dark:border-gray-700">
        <FiCalendar className="text-primary flex-shrink-0"/>
        <input type="date" className="w-full outline-none text-sm bg-transparent dark:text-white text-gray-600 dark:text-gray-300"
          value={form.checkOut} onChange={e => setForm(p => ({...p, checkOut:e.target.value}))}
          min={form.checkIn || new Date().toISOString().split("T")[0]}/>
      </div>
      <div className="flex items-center gap-3 px-4 py-2">
        <FiUsers className="text-primary flex-shrink-0"/>
        <select className="outline-none text-sm bg-transparent dark:text-white dark:bg-gray-800"
          value={form.guests} onChange={e => setForm(p => ({...p, guests:e.target.value}))}>
          {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n} Guest{n>1?"s":""}</option>)}
        </select>
      </div>
      <button type="submit" className="btn-primary flex items-center gap-2 whitespace-nowrap">
        <FiSearch size={16}/> Search
      </button>
    </motion.form>
  );
}
