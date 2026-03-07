import { useState } from "react";
import { motion } from "framer-motion";
import {
  X,
  Package,
  Tag,
  DollarSign,
  Layers,
  AlertCircle,
  FileText,
  Hash,
} from "lucide-react";
import type { Product } from "@/hooks/useProducts";

interface ProductFormProps {
  product?: Product;
  onSubmit: (formData: Partial<Product>) => void;
  onClose: () => void;
  isLoading?: boolean;
}

export function ProductForm({
  product,
  onSubmit,
  onClose,
  isLoading = false,
}: ProductFormProps) {
  const [formData, setFormData] = useState<Partial<Product>>(
    product || {
      name: "",
      sku: "",
      category: "",
      price: 0,
      stock: 0,
      lowStockThreshold: 10,
      description: "",
    },
  );

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "stock" || name === "lowStockThreshold"
          ? parseFloat(value) || 0
          : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="bg-linear-to-br from-slate-800 to-slate-900 rounded-2xl border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-white/10 bg-linear-to-br from-slate-800 to-slate-900 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-orange-500/20 rounded-xl">
              <Package size={22} className="text-orange-400" />
            </div>
            <h2 className="text-2xl font-bold bg-linear-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
              {product ? "Edit Product" : "Add New Product"}
            </h2>
          </div>
          <motion.button
            whileHover={{ rotate: 90, scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors group"
          >
            <X
              size={20}
              className="text-gray-400 group-hover:text-orange-400 transition-colors"
            />
          </motion.button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Name and SKU */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex text-sm font-medium text-orange-300/80 mb-2 items-center gap-2">
                <Tag size={14} className="text-orange-400" />
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name || ""}
                onChange={handleChange}
                required
                placeholder="e.g., Professional Hammer"
                className="w-full px-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 hover:bg-slate-700/80"
              />
            </div>
            <div>
              <label className="flex text-sm font-medium text-orange-300/80 mb-2 items-center gap-2">
                <Hash size={14} className="text-orange-400" />
                SKU *
              </label>
              <input
                type="text"
                name="sku"
                value={formData.sku || ""}
                onChange={handleChange}
                required
                placeholder="e.g., HAM-001"
                className="w-full px-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 hover:bg-slate-700/80"
              />
            </div>
          </div>

          {/* Category and Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex text-sm font-medium text-orange-300/80 mb-2 items-center gap-2">
                <Layers size={14} className="text-orange-400" />
                Category *
              </label>
              <input
                type="text"
                name="category"
                value={formData.category || ""}
                onChange={handleChange}
                required
                placeholder="e.g., Hand Tools"
                className="w-full px-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 hover:bg-slate-700/80"
              />
            </div>
            <div>
              <label className="flex text-sm font-medium text-orange-300/80 mb-2 items-center gap-2">
                <DollarSign size={14} className="text-orange-400" />
                Price (FCFA) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price || 0}
                onChange={handleChange}
                required
                min="0"
                step="100"
                placeholder="e.g., 25000"
                className="w-full px-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 hover:bg-slate-700/80"
              />
            </div>
          </div>

          {/* Stock and Low Threshold */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex text-sm font-medium text-orange-300/80 mb-2 items-center gap-2">
                <Package size={14} className="text-orange-400" />
                Stock Quantity *
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock || 0}
                onChange={handleChange}
                required
                min="0"
                className="w-full px-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 hover:bg-slate-700/80"
              />
            </div>
            <div>
              <label className="flex text-sm font-medium text-orange-300/80 mb-2 items-center gap-2">
                <AlertCircle size={14} className="text-orange-400" />
                Low Stock Threshold *
              </label>
              <input
                type="number"
                name="lowStockThreshold"
                value={formData.lowStockThreshold || 10}
                onChange={handleChange}
                required
                min="0"
                className="w-full px-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 hover:bg-slate-700/80"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="flex text-sm font-medium text-orange-300/80 mb-2 items-center gap-2">
              <FileText size={14} className="text-orange-400" />
              Description
            </label>
            <textarea
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              placeholder="Enter product description, specifications, or additional details..."
              rows={4}
              className="w-full px-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 hover:bg-slate-700/80 resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t border-white/10">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-gray-300 font-medium hover:bg-slate-600/50 hover:text-white transition-all duration-300"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-linear-to-r from-orange-500 to-orange-600 rounded-xl text-white font-medium shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
            >
              <span className="relative z-10">
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.div
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                    Saving...
                  </span>
                ) : product ? (
                  "Update Product"
                ) : (
                  "Create Product"
                )}
              </span>
              <motion.div
                className="absolute inset-0 bg-linear-to-r from-orange-600 to-orange-700"
                initial={{ x: "100%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          </div>
        </form>

        {/* Decorative Elements */}
        <div className="absolute -top-2 -right-2 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-2 -left-2 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      </motion.div>
    </motion.div>
  );
}
