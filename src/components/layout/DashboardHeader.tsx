import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import { useMemo } from "react";

// Motivational quotes for sales and business
const MOTIVATIONAL_QUOTES = [
  "Every sale brings you closer to your goals—keep pushing!",
  "Your success today will inspire your tomorrow.",
  "Great things never came from comfort zones.",
  "Stay focused, stay determined, success will follow.",
  "Sales excellence is a choice, not a talent.",
  "Today's effort is tomorrow's achievement.",
  "Success is the sum of small efforts repeated day in and day out.",
  "You have unlimited potential—use it.",
  "The best time to close a deal was yesterday. The second best is today.",
  "Believe in your expertise, trust your instincts, deliver excellence.",
];

interface DashboardHeaderProps {
  title?: string;
  description?: string;
  userName?: string;
  onMenuClick?: () => void;
  children?: React.ReactNode;
  showWelcome?: boolean;
}

export function DashboardHeader({
  title = "Dashboard",
  description = "Welcome back to your dashboard",
  userName,
  onMenuClick,
  children,
  showWelcome = false,
}: DashboardHeaderProps) {
  // Get a random quote based on userName (consistent per session)
  const quote = useMemo(() => {
    if (!userName) return MOTIVATIONAL_QUOTES[0];
    const hash = userName
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return MOTIVATIONAL_QUOTES[hash % MOTIVATIONAL_QUOTES.length];
  }, [userName]);

  // Format welcome message
  const welcomeMessage =
    showWelcome && userName
      ? `Welcome back, ${userName.split(" ")[0]}!`
      : title;
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
              {showWelcome ? welcomeMessage : title}
            </h1>
            {showWelcome && userName ? (
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 italic">
                💡 {quote}
              </p>
            ) : description ? (
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {description}
              </p>
            ) : null}
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
