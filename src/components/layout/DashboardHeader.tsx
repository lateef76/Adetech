import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Search, Calendar, Clock } from "lucide-react";

interface DashboardHeaderProps {
  userName?: string;
}

export function DashboardHeader({
  userName = "John Doe",
}: DashboardHeaderProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = () => {
    return new Date().toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = () => {
    return currentTime.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={itemVariants}
      className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6 relative"
    >
      {/* Left Section - Date and Time Display Mobile */}
      <div className="flex items-center gap-3">
        {/* Date and Time Display - Mobile */}
        <motion.div
          className="flex flex-wrap items-center gap-2 lg:hidden ml-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-2 px-3 py-1.5 bg-linear-to-br from-slate-800 to-slate-900 border border-white/10 rounded-lg shadow-lg">
            <Calendar size={14} className="text-orange-400" />
            <span className="text-xs font-medium text-orange-100/90">
              {formatDate()}
            </span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-linear-to-br from-slate-800 to-slate-900 border border-white/10 rounded-lg shadow-lg">
            <Clock size={14} className="text-orange-400" />
            <span className="text-xs font-medium text-orange-100/90">
              {formatTime()}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Right Section - Search, Date/Time, User */}
      <motion.div
        className="flex items-center gap-2 lg:gap-3 w-full lg:flex-1"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        {/* Search Bar */}
        <div className="flex-1 relative group">
          <Search
            size={18}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-400/60 group-hover:text-orange-400 transition-colors duration-300"
          />
          <input
            type="text"
            placeholder="Search products, clients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-linear-to-br from-slate-800 to-slate-900 border border-white/10 rounded-xl text-white placeholder-orange-200/40 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 hover:border-white/20 shadow-lg"
          />
        </div>

        {/* Date and Time Display - Desktop */}
        <motion.div
          className="hidden lg:flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-2 px-4 py-2 bg-linear-to-br from-slate-800 to-slate-900 border border-white/10 rounded-xl shadow-lg hover:border-orange-500/30 transition-all duration-300">
            <Calendar size={16} className="text-orange-400" />
            <span className="text-sm font-medium text-orange-100/90 whitespace-nowrap">
              {formatDate()}
            </span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-linear-to-br from-slate-800 to-slate-900 border border-white/10 rounded-xl shadow-lg hover:border-orange-500/30 transition-all duration-300">
            <Clock size={16} className="text-orange-400" />
            <span className="text-sm font-medium text-orange-100/90 whitespace-nowrap">
              {formatTime()}
            </span>
          </div>
        </motion.div>

        {/* User Menu */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-3 px-4 py-2 rounded-xl bg-linear-to-br from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 transition-all duration-300 border border-white/10 hover:border-orange-500/30 shadow-lg group"
        >
          <div className="w-8 h-8 rounded-full bg-linear-to-r from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/25">
            <span className="text-white text-sm font-bold">
              {userName.charAt(0)}
            </span>
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-white text-sm font-medium group-hover:text-orange-400 transition-colors duration-300">
              {userName}
            </p>
            <p className="text-orange-300/60 text-xs">Administrator</p>
          </div>
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
