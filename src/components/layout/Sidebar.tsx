import { useState, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useSidebarData } from "@/hooks/useSidebarData";
import { useScrollPosition } from "@/hooks/useScrollPosition";
import {
  Menu,
  X,
  Home,
  FileText,
  Users,
  Package,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Store,
  Hammer,
  Wrench,
  Truck,
  HelpCircle,
  Bell,
  UserCircle,
  ShoppingCart,
  TrendingUp,
  Award,
  Shield,
  HardHat,
  ClipboardList,
  DollarSign,
} from "lucide-react";

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { invoices, products, orders, notifications } = useSidebarData();
  const { isVisible } = useScrollPosition();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Create navigation sections dynamically with badge counts
  const navSections = useMemo(
    () => [
      {
        title: "MAIN",
        items: [
          { name: "Dashboard", path: "/dashboard", icon: <Home size={20} /> },
          {
            name: "Inventory",
            path: "/inventory",
            icon: <Package size={20} />,
            badge: products > 0 ? products : undefined,
          },
          { name: "Sales", path: "/sales", icon: <TrendingUp size={20} /> },
          {
            name: "Invoices",
            path: "/invoices",
            icon: <FileText size={20} />,
            badge: invoices > 0 ? invoices : undefined,
          },
        ],
      },
      {
        title: "MANAGEMENT",
        items: [
          { name: "Clients", path: "/clients", icon: <Users size={20} /> },
          { name: "Suppliers", path: "/suppliers", icon: <Truck size={20} /> },
          {
            name: "Products",
            path: "/products",
            icon: <ShoppingCart size={20} />,
          },
          {
            name: "Orders",
            path: "/orders",
            icon: <ClipboardList size={20} />,
            badge: orders > 0 ? orders : undefined,
          },
        ],
      },
      {
        title: "ANALYTICS",
        items: [
          { name: "Reports", path: "/reports", icon: <BarChart3 size={20} /> },
          { name: "Revenue", path: "/revenue", icon: <DollarSign size={20} /> },
          {
            name: "Performance",
            path: "/performance",
            icon: <Award size={20} />,
          },
        ],
      },
      {
        title: "SETTINGS",
        items: [
          { name: "Profile", path: "/profile", icon: <UserCircle size={20} /> },
          {
            name: "Notifications",
            path: "/notifications",
            icon: <Bell size={20} />,
            badge: notifications > 0 ? notifications : undefined,
          },
          { name: "Settings", path: "/settings", icon: <Settings size={20} /> },
          { name: "Help", path: "/help", icon: <HelpCircle size={20} /> },
        ],
      },
    ],
    [invoices, products, orders, notifications],
  );

  const isActive = (path: string) => location.pathname === path;

  // Animation variants
  const sidebarVariants = {
    open: {
      width: "16rem",
    },
    closed: {
      width: "5rem",
    },
  };

  const itemVariants = {
    open: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.2 },
    },
    closed: {
      opacity: 0,
      x: -20,
      transition: { duration: 0.1 },
    },
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <motion.button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-3 right-3 z-50 lg:hidden p-2 rounded-lg bg-linear-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          opacity: isVisible ? 1 : 0,
          y: isVisible ? 0 : -60,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
      </motion.button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-30 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        variants={sidebarVariants}
        initial={false}
        animate={isOpen ? "open" : "closed"}
        transition={{ duration: 0.3 }}
        className={`fixed left-0 top-0 h-screen bg-linear-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-white/10 flex flex-col z-40 lg:relative lg:z-auto overflow-hidden ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(249,115,22,0.2) 1px, transparent 0)",
              backgroundSize: "30px 30px",
            }}
          />
        </div>

        {/* Animated Hardware Icons Background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
          {[Hammer, Wrench, Package, HardHat, Shield].map((Icon, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                top: `${10 + i * 20}%`,
                left: `${10 + i * 15}%`,
              }}
              animate={{
                y: [0, -20, 20, 0],
                x: [0, 10, -10, 0],
                rotate: [0, 45, -45, 0],
              }}
              transition={{
                duration: 10 + i * 2,
                repeat: Infinity,
                delay: i * 2,
                ease: "linear",
              }}
            >
              <Icon size={40} className="text-orange-500/20" />
            </motion.div>
          ))}
        </div>

        {/* Logo Section */}
        <motion.div
          className="relative p-6 border-b border-white/10 flex items-center justify-between overflow-hidden"
          animate={{ height: isOpen ? "auto" : "5rem" }}
        >
          {isOpen ? (
            <motion.div
              variants={itemVariants}
              initial="closed"
              animate="open"
              className="flex flex-col relative z-10 w-full"
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <motion.div
                    whileHover={{ rotate: 180 }}
                    transition={{ duration: 0.5 }}
                    className="relative"
                  >
                    <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-md" />
                    <Store
                      className="text-orange-500 relative z-10"
                      size={36}
                    />
                  </motion.div>
                  <div>
                    <motion.h1
                      className="text-white font-bold text-xl"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      Adetech
                    </motion.h1>
                    <motion.p
                      className="text-orange-400 text-xs flex items-center gap-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Hammer size={12} />
                      Hardware Store
                      <Wrench size={12} />
                    </motion.p>
                  </div>
                </div>

                {/* Toggle button for desktop */}
                <motion.button
                  onClick={() => setIsOpen(!isOpen)}
                  className="hidden lg:flex p-1.5 rounded-lg hover:bg-white/10 text-orange-400 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronLeft size={18} />
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              variants={itemVariants}
              initial="closed"
              animate="open"
              className="w-full flex flex-col items-center gap-1 relative z-10"
            >
              <motion.div whileHover={{ scale: 1.1 }} className="relative">
                <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-md" />
                <Store className="text-orange-500 relative z-10" size={28} />
              </motion.div>

              {/* Toggle button for desktop when collapsed */}
              <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="hidden lg:flex p-1.5 rounded-lg hover:bg-white/10 text-orange-400 transition-colors mt-2"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronRight size={16} />
              </motion.button>
            </motion.div>
          )}
        </motion.div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-3 py-6 overflow-y-auto scrollbar-thin scrollbar-thumb-orange-500/20 scrollbar-track-transparent">
          {navSections.map((section, sectionIndex) => (
            <div key={section.title} className="mb-6 last:mb-0">
              {/* Section Title */}
              <AnimatePresence>
                {isOpen && (
                  <motion.h3
                    initial={{ opacity: 0, height: 0 }}
                    animate={{
                      opacity: 1,
                      height: "auto",
                      marginBottom: "0.75rem",
                    }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    className="text-xs font-semibold text-orange-400/60 uppercase tracking-wider px-4 overflow-hidden"
                  >
                    {section.title}
                  </motion.h3>
                )}
              </AnimatePresence>

              {/* Section Items */}
              <div className="space-y-1">
                {section.items.map((item, index) => (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: sectionIndex * 0.1 + index * 0.05 }}
                  >
                    <Link
                      to={item.path}
                      onClick={() => setIsMobileOpen(false)}
                      onMouseEnter={() => !isOpen && setShowTooltip(item.path)}
                      onMouseLeave={() => setShowTooltip(null)}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group relative overflow-hidden ${
                        isActive(item.path)
                          ? "bg-linear-to-r from-orange-500/20 to-orange-600/10 text-orange-400"
                          : "text-orange-200/60 hover:text-orange-200 hover:bg-white/5"
                      }`}
                    >
                      {/* Active Indicator */}
                      {isActive(item.path) && (
                        <motion.div
                          className="absolute inset-0 bg-linear-to-r from-orange-500/10 to-transparent"
                          layoutId="activeIndicator"
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                          }}
                        />
                      )}

                      {/* Icon with badge */}
                      <span className="relative z-10 shrink-0 flex items-center justify-center">
                        {item.icon}
                        {item.badge && !isOpen && (
                          <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">
                            {item.badge > 9 ? "9+" : item.badge}
                          </span>
                        )}
                      </span>

                      {/* Label and badge for open state */}
                      {isOpen && (
                        <motion.span
                          className="relative z-10 flex-1 whitespace-nowrap font-medium flex items-center justify-between"
                          variants={itemVariants}
                        >
                          <span>{item.name}</span>
                          {item.badge && (
                            <span className="px-1.5 py-0.5 bg-orange-500/20 text-orange-400 rounded-md text-xs font-bold">
                              {item.badge}
                            </span>
                          )}
                        </motion.span>
                      )}

                      {/* Hover effect */}
                      <motion.div
                        className="absolute inset-0 bg-linear-to-r from-orange-500/0 via-orange-500/5 to-orange-500/0"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: "100%" }}
                        transition={{ duration: 0.5 }}
                      />
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Divider */}
        <div className="px-3 py-2">
          <div className="h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
        </div>

        {/* Logout Section */}
        <motion.div
          className="p-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 group relative overflow-hidden"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="shrink-0 flex items-center justify-center relative z-10">
              <LogOut size={20} />
            </span>
            {isOpen && (
              <motion.span
                className="whitespace-nowrap font-medium relative z-10"
                variants={itemVariants}
              >
                Logout
              </motion.span>
            )}

            {/* Hover effect */}
            <motion.div
              className="absolute inset-0 bg-linear-to-r from-red-500/0 via-red-500/10 to-red-500/0"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.5 }}
            />
          </motion.button>
        </motion.div>

        {/* User Info (when sidebar is open) */}
        {isOpen && user && (
          <motion.div
            className="p-4 border-t border-white/10 mt-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-linear-to-r from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold">
                  {user.displayName
                    ? user.displayName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                    : (user.email?.[0].toUpperCase() ?? "U")}
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">
                  {user.displayName || "User"}
                </p>
                <p className="text-orange-400/60 text-xs truncate">
                  {user.email}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tooltips for collapsed state */}
        {!isOpen && (
          <div className="absolute left-full ml-2 pointer-events-none">
            {navSections
              .flatMap((section) => section.items)
              .map((item) => (
                <AnimatePresence key={item.path}>
                  {showTooltip === item.path && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="bg-slate-800 text-white px-3 py-1.5 rounded-lg text-sm whitespace-nowrap shadow-lg border border-white/10"
                    >
                      {item.name}
                      {item.badge && (
                        <span className="ml-2 px-1.5 py-0.5 bg-orange-500 text-xs rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              ))}
          </div>
        )}
      </motion.aside>
    </>
  );
}

export default Sidebar;
