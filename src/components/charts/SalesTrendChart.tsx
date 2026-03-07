import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { week: "W1", sales: 100, target: 120 },
  { week: "W2", sales: 150, target: 140 },
  { week: "W3", sales: 120, target: 130 },
  { week: "W4", sales: 200, target: 180 },
  { week: "W5", sales: 180, target: 160 },
  { week: "W6", sales: 220, target: 200 },
  { week: "W7", sales: 250, target: 230 },
  { week: "W8", sales: 300, target: 280 },
];

export function SalesTrendChart() {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={itemVariants}
      className="bg-linear-to-br from-slate-800 to-slate-900 rounded-xl border border-white/10 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <TrendingUp size={20} className="text-orange-500" />
          Sales Trend
        </h2>
        <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full">
          vs Target
        </span>
      </div>

      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis
              dataKey="week"
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
            <Area
              type="monotone"
              dataKey="sales"
              stroke="#f97316"
              fill="rgba(249, 115, 22, 0.2)"
              animationDuration={800}
            />
            <Area
              type="monotone"
              dataKey="target"
              stroke="#8b5cf6"
              fill="rgba(139, 92, 246, 0.1)"
              animationDuration={800}
              strokeDasharray="5 5"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
