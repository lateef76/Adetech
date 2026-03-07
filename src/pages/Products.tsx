import { MainLayout } from "@/layouts/MainLayout";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";

export function ProductsPage() {
  const { user } = useAuth();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
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
        <DashboardHeader userName={user?.displayName || "User"} />

        <motion.div variants={itemVariants} className="bg-slate-800 rounded-xl p-8 border border-white/10">
          <h1 className="text-3xl font-bold text-white mb-4">Products Management</h1>
          <p className="text-gray-300">Products page coming soon...</p>
        </motion.div>
      </motion.div>
    </MainLayout>
  );
}
