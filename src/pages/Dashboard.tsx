import { MainLayout } from "@/layouts/MainLayout";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import {
  Package,
  Users,
  FileText,
  DollarSign,
  TrendingUp,
  ShoppingCart,
  Clock,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { useRecentActivities } from "@/hooks/useRecentActivities";
import { useLowStockItems } from "@/hooks/useLowStockItems";

// Generate progress bar widths at module level to avoid Math.random during render
const PROGRESS_WIDTHS = [
  Math.random() * 40 + 60,
  Math.random() * 40 + 60,
  Math.random() * 40 + 60,
  Math.random() * 40 + 60,
];

export function DashboardPage() {
  const { user } = useAuth();
  const { products, clients, invoices, revenue } = useDashboardStats();
  const { activities, loading: activitiesLoading } = useRecentActivities();
  const { items: lowStockItems, loading: lowStockLoading } = useLowStockItems();

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "invoice":
        return FileText;
      case "product":
        return Package;
      case "client":
        return Users;
      case "stock":
        return ShoppingCart;
      case "order":
        return ShoppingCart;
      default:
        return Clock;
    }
  };

  const formatRevenue = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
      .format(amount)
      .replace("XOF", "FCFA");
  };

  const statCards = [
    {
      title: "Total Products",
      value: products.toLocaleString(),
      icon: Package,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-500/10",
      textColor: "text-blue-500",
      trend: "+12.5%",
      trendUp: true,
      delay: 0.1,
      width: PROGRESS_WIDTHS[0],
    },
    {
      title: "Total Clients",
      value: clients.toLocaleString(),
      icon: Users,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-500/10",
      textColor: "text-green-500",
      trend: "+8.2%",
      trendUp: true,
      delay: 0.2,
      width: PROGRESS_WIDTHS[1],
    },
    {
      title: "Total Invoices",
      value: invoices.toLocaleString(),
      icon: FileText,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-500/10",
      textColor: "text-purple-500",
      trend: "-3.1%",
      trendUp: false,
      delay: 0.3,
      width: PROGRESS_WIDTHS[2],
    },
    {
      title: "Revenue",
      value: formatRevenue(revenue),
      icon: DollarSign,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-500/10",
      textColor: "text-orange-500",
      trend: "+23.5%",
      trendUp: true,
      delay: 0.4,
      width: PROGRESS_WIDTHS[3],
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <MainLayout>
      <motion.div
        className="space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header Section */}
        <DashboardHeader userName={user?.displayName || "User"} />

        {/* Stats Grid */}
        <motion.div
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
          variants={containerVariants}
        >
          {statCards.map((card, index) => (
            <motion.div
              key={card.title}
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="group relative overflow-hidden bg-linear-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-white/10 hover:border-orange-500/30 transition-all duration-300"
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 1px 1px, rgba(249,115,22,0.2) 1px, transparent 0)",
                    backgroundSize: "20px 20px",
                  }}
                />
              </div>

              {/* Icon with gradient background */}
              <div className="relative z-10">
                <div
                  className={`w-12 h-12 rounded-lg bg-linear-to-r ${card.color} p-2.5 mb-4 shadow-lg`}
                >
                  <card.icon className="w-full h-full text-white" />
                </div>

                {/* Trend Indicator */}
                <div className="absolute top-6 right-6">
                  <div
                    className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                      card.trendUp
                        ? "bg-green-500/10 text-green-400"
                        : "bg-red-500/10 text-red-400"
                    }`}
                  >
                    {card.trendUp ? (
                      <ArrowUpRight size={14} />
                    ) : (
                      <ArrowDownRight size={14} />
                    )}
                    {card.trend}
                  </div>
                </div>

                {/* Stats */}
                <div>
                  <p className="text-sm text-gray-400 mb-1">{card.title}</p>
                  <p className="text-2xl font-bold text-white">{card.value}</p>
                </div>

                {/* Progress Bar (example) */}
                <div className="mt-4 h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full bg-linear-to-r ${card.color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${card.width}%` }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 1 }}
                  />
                </div>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-linear-to-r from-orange-500/0 via-orange-500/5 to-orange-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </motion.div>
          ))}
        </motion.div>

        {/* Charts and Tables Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-2 bg-linear-to-br from-slate-800 to-slate-900 rounded-xl border border-white/10 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Clock size={20} className="text-orange-500" />
                Recent Activity
              </h2>
              <motion.button
                className="text-sm text-orange-400 hover:text-orange-300 transition-colors"
                whileHover={{ x: 5 }}
              >
                View All →
              </motion.button>
            </div>

            <div className="space-y-4">
              {activitiesLoading ? (
                <p className="text-gray-400 text-sm">Loading activities...</p>
              ) : activities.length > 0 ? (
                activities.map((activity, index) => {
                  const IconComponent = getActivityIcon(activity.type);
                  return (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
                        <IconComponent size={20} className="text-orange-500" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">
                          {activity.action}
                        </p>
                        <p className="text-sm text-gray-400">{activity.item}</p>
                      </div>
                      <span className="text-xs text-gray-500">
                        {activity.time}
                      </span>
                    </motion.div>
                  );
                })
              ) : (
                <p className="text-gray-400 text-sm">No recent activities</p>
              )}
            </div>
          </motion.div>

          {/* Low Stock Alert */}
          <motion.div
            variants={itemVariants}
            className="bg-linear-to-br from-slate-800 to-slate-900 rounded-xl border border-white/10 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <AlertCircle size={20} className="text-orange-500" />
                Low Stock Alert
              </h2>
              <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-full">
                {lowStockItems.length} items
              </span>
            </div>

            <div className="space-y-4">
              {lowStockLoading ? (
                <p className="text-gray-400 text-sm">Loading stock data...</p>
              ) : lowStockItems.length > 0 ? (
                lowStockItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="relative"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                        <Package size={16} className="text-red-500" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-sm font-medium">
                          {item.name}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-gray-400">
                            Stock: {item.stock}
                          </span>
                          <span className="text-xs text-red-400">
                            Threshold: {item.threshold}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-linear-to-r from-red-500 to-orange-500"
                        initial={{ width: 0 }}
                        animate={{
                          width: `${(item.stock / item.threshold) * 100}%`,
                        }}
                        transition={{ delay: 0.5 + index * 0.1, duration: 1 }}
                      />
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className="text-gray-400 text-sm">
                  All items are well stocked
                </p>
              )}
            </div>

            {/* Quick Action */}
            <motion.button
              className="w-full mt-6 py-2 px-4 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 rounded-lg text-sm font-medium transition-colors border border-orange-500/20"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Restock Items
            </motion.button>
          </motion.div>
        </div>

        {/* Quick Actions Grid */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            {
              label: "Add Product",
              icon: Package,
              color: "from-blue-500 to-blue-600",
            },
            {
              label: "New Client",
              icon: Users,
              color: "from-green-500 to-green-600",
            },
            {
              label: "Create Invoice",
              icon: FileText,
              color: "from-purple-500 to-purple-600",
            },
            {
              label: "View Reports",
              icon: TrendingUp,
              color: "from-orange-500 to-orange-600",
            },
          ].map((action, index) => (
            <motion.button
              key={action.label}
              whileHover={{ y: -5, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="group relative overflow-hidden bg-linear-to-br from-slate-800 to-slate-900 rounded-xl p-4 border border-white/10 hover:border-orange-500/30 transition-all duration-300"
            >
              <div
                className={`w-10 h-10 rounded-lg bg-linear-to-r ${action.color} p-2 mb-3`}
              >
                <action.icon className="w-full h-full text-white" />
              </div>
              <p className="text-white text-sm font-medium">{action.label}</p>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-linear-to-r from-orange-500/0 via-orange-500/5 to-orange-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </motion.button>
          ))}
        </motion.div>
      </motion.div>
    </MainLayout>
  );
}
