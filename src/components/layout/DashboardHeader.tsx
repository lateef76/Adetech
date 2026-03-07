import { motion } from "framer-motion";
import { Menu } from "lucide-react";

interface DashboardHeaderProps {
  title?: string;
  description?: string;
  userName?: string;
  onMenuClick?: () => void;
  children?: React.ReactNode;
}

export function DashboardHeader({
  title = "Dashboard",
  description = "Welcome back to your dashboard",
  userName,
  onMenuClick,
  children,
}: DashboardHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-6 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-4"
    >
      <div className="flex items-center justify-between">
        {/* Left Section - Menu Button & Title */}
        <div className="flex items-center gap-3">
          {/* Mobile Menu Button */}
          {onMenuClick && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <Menu size={20} />
            </motion.button>
          )}

          {/* Title & Description */}
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold bg-linear-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
              {title}
            </h1>
            {description && (
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Right Section - User Name */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800">
            {userName && (
              <>
                <div className="w-6 h-6 rounded-lg bg-linear-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {userName.charAt(0)}
                  </span>
                </div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {userName}
                </span>
              </>
            )}
          </div>

          {/* Custom Children */}
          {children}
        </div>
      </div>
    </motion.div>
  );
}
