import { motion } from "framer-motion";
import { Package } from "lucide-react";
import { useTopProductsData } from "@/hooks/useTopProductsData";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function TopProductsChart() {
  const { data, loading, error } = useTopProductsData();

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (loading) {
    return (
      <motion.div
        variants={itemVariants}
        className="bg-linear-to-br from-slate-800 to-slate-900 rounded-xl border border-white/10 p-6"
      >
        <p className="text-gray-400">Loading product data...</p>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        variants={itemVariants}
        className="bg-linear-to-br from-slate-800 to-slate-900 rounded-xl border border-white/10 p-6"
      >
        <p className="text-red-400">Error: {error}</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={itemVariants}
      className="bg-linear-to-br from-slate-800 to-slate-900 rounded-xl border border-white/10 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Package size={20} className="text-orange-500" />
          Top Products
        </h2>
        <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full">
          Top 6
        </span>
      </div>

      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.1)"
            />
            <XAxis
              dataKey="name"
              stroke="rgba(255,255,255,0.3)"
              style={{ fontSize: "12px" }}
            />
            <YAxis
              stroke="rgba(255,255,255,0.3)"
              style={{ fontSize: "12px" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(15, 23, 42, 0.9)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                color: "#fff",
              }}
            />
            <Bar dataKey="sales" fill="#f97316" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
