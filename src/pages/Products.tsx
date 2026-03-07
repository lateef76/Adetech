import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useProducts } from "@/hooks/useProducts";
import type { Product } from "@/hooks/useProducts";
import { useProductMutations } from "@/hooks/useProductMutations";
import { MainLayout } from "@/layouts/MainLayout";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { ProductForm } from "@/components/ProductForm";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle,
  Package,
  Filter,
  X,
  DollarSign,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

export function ProductsPage() {
  const { user } = useAuth();
  const { products, loading, error, refetch } = useProducts();
  const {
    addProduct,
    updateProduct,
    deleteProduct,
    isLoading: isFormLoading,
  } = useProductMutations();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Get unique categories
  const categories = ["all", ...new Set(products.map((p) => p.category))];

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Categorize by stock status
  const lowStockProducts = filteredProducts.filter(
    (p) => p.stock <= p.lowStockThreshold && p.stock > 0,
  );

  const inStockProducts = filteredProducts.filter(
    (p) => p.stock > p.lowStockThreshold,
  );

  // Calculate stats
  const totalValue = filteredProducts.reduce(
    (sum, p) => sum + p.price * p.stock,
    0,
  );

  const handleOpenForm = (product?: Product) => {
    setSelectedProduct(product);
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setSelectedProduct(undefined);
  };

  const handleFormSubmit = async (formData: Partial<Product>) => {
    try {
      if (selectedProduct) {
        await updateProduct(selectedProduct.id, formData);
        setSuccessMessage("Product updated successfully!");
      } else {
        await addProduct(formData);
        setSuccessMessage("Product created successfully!");
      }
      handleCloseForm();
      refetch();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error("Form submission error:", err);
    }
  };

  const handleDelete = async (productId: string) => {
    try {
      await deleteProduct(productId);
      setSuccessMessage("Product deleted successfully!");
      setDeleteConfirm(null);
      refetch();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR").format(price) + " FCFA";
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
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

        {/* Header Section */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col md:flex-row md:justify-between md:items-center gap-4"
        >
          <div>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-500/20 rounded-xl">
                <Package size={28} className="text-orange-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-linear-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
                  Products
                </h1>
                <p className="text-gray-400 mt-1">
                  Manage your inventory and track stock levels
                </p>
              </div>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleOpenForm()}
            className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-orange-500 to-orange-600 text-white rounded-xl font-medium shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-300 group"
          >
            <Plus
              size={20}
              className="group-hover:rotate-90 transition-transform duration-300"
            />
            Add Product
          </motion.button>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-linear-to-br from-slate-800 to-slate-900 rounded-xl p-5 border border-white/10 hover:border-orange-500/30 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Package size={20} className="text-blue-400" />
              </div>
              <span className="text-xs text-blue-400 bg-blue-500/20 px-2 py-1 rounded-full">
                Total
              </span>
            </div>
            <p className="text-2xl font-bold text-white">
              {filteredProducts.length}
            </p>
            <p className="text-sm text-gray-400 mt-1">Total Products</p>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="bg-linear-to-br from-slate-800 to-slate-900 rounded-xl p-5 border border-white/10 hover:border-orange-500/30 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <CheckCircle size={20} className="text-green-400" />
              </div>
              <span className="text-xs text-green-400 bg-green-500/20 px-2 py-1 rounded-full">
                In Stock
              </span>
            </div>
            <p className="text-2xl font-bold text-white">
              {inStockProducts.length}
            </p>
            <p className="text-sm text-gray-400 mt-1">Healthy Stock</p>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="bg-linear-to-br from-slate-800 to-slate-900 rounded-xl p-5 border border-white/10 hover:border-orange-500/30 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <AlertCircle size={20} className="text-yellow-400" />
              </div>
              <span className="text-xs text-yellow-400 bg-yellow-500/20 px-2 py-1 rounded-full">
                Low Stock
              </span>
            </div>
            <p className="text-2xl font-bold text-white">
              {lowStockProducts.length}
            </p>
            <p className="text-sm text-gray-400 mt-1">Need Reorder</p>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="bg-linear-to-br from-slate-800 to-slate-900 rounded-xl p-5 border border-white/10 hover:border-orange-500/30 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <DollarSign size={20} className="text-purple-400" />
              </div>
              <span className="text-xs text-purple-400 bg-purple-500/20 px-2 py-1 rounded-full">
                Value
              </span>
            </div>
            <p className="text-2xl font-bold text-white">
              {formatPrice(totalValue)}
            </p>
            <p className="text-sm text-gray-400 mt-1">Inventory Value</p>
          </motion.div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col md:flex-row gap-4"
        >
          <div className="flex-1 relative group">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-orange-400 transition-colors duration-300"
            />
            <input
              type="text"
              placeholder="Search by name or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 hover:bg-slate-800/80"
            />
          </div>

          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-gray-300 hover:text-orange-400 hover:border-orange-500/30 transition-all duration-300 flex items-center gap-2"
            >
              <Filter size={18} />
              <span className="hidden sm:inline">Filters</span>
            </motion.button>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="flex-1 md:flex-none px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 hover:bg-slate-800/80"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat} className="bg-slate-800">
                  {cat === "all" ? "All Categories" : cat}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Active Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-slate-800/30 rounded-xl p-4 border border-white/10"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-orange-400">
                  Active Filters
                </h3>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setCategoryFilter("all");
                  }}
                  className="text-xs text-gray-400 hover:text-orange-400 transition-colors flex items-center gap-1"
                >
                  <X size={14} />
                  Clear all
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {searchQuery && (
                  <span className="px-3 py-1.5 bg-orange-500/10 border border-orange-500/30 rounded-lg text-sm text-orange-300 flex items-center gap-2">
                    Search: {searchQuery}
                    <button onClick={() => setSearchQuery("")}>
                      <X size={14} className="hover:text-orange-400" />
                    </button>
                  </span>
                )}
                {categoryFilter !== "all" && (
                  <span className="px-3 py-1.5 bg-orange-500/10 border border-orange-500/30 rounded-lg text-sm text-orange-300 flex items-center gap-2">
                    Category: {categoryFilter}
                    <button onClick={() => setCategoryFilter("all")}>
                      <X size={14} className="hover:text-orange-400" />
                    </button>
                  </span>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Products Table */}
        <motion.div
          variants={itemVariants}
          className="bg-linear-to-br from-slate-800 to-slate-900 rounded-xl border border-white/10 overflow-hidden shadow-xl"
        >
          {loading ? (
            <div className="p-12 text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"
              />
              <p className="text-gray-400">Loading products...</p>
            </div>
          ) : error ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={32} className="text-red-400" />
              </div>
              <p className="text-red-400">Error: {error}</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package size={32} className="text-gray-500" />
              </div>
              <p className="text-gray-400 mb-2">No products found</p>
              <p className="text-sm text-gray-500">
                Create your first product to get started
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10 bg-slate-700/30">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      SKU
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredProducts.map((product, index) => {
                    const isLowStock =
                      product.stock <= product.lowStockThreshold &&
                      product.stock > 0;
                    const isOutOfStock = product.stock === 0;

                    return (
                      <motion.tr
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-white/5 transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-linear-to-br from-slate-700 to-slate-800 rounded-lg border border-white/10 flex items-center justify-center">
                              <Package
                                size={18}
                                className="text-orange-400/70"
                              />
                            </div>
                            <span className="text-white font-medium">
                              {product.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-gray-400 text-sm font-mono">
                            {product.sku}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-orange-500/10 text-orange-300 rounded-full text-xs font-medium">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-white font-medium">
                            {formatPrice(product.price)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                isOutOfStock
                                  ? "bg-red-500/20 text-red-300"
                                  : isLowStock
                                    ? "bg-yellow-500/20 text-yellow-300"
                                    : "bg-green-500/20 text-green-300"
                              }`}
                            >
                              {product.stock} units
                            </span>
                            {isLowStock && !isOutOfStock && (
                              <TrendingDown
                                size={14}
                                className="text-yellow-400"
                              />
                            )}
                            {!isLowStock &&
                              !isOutOfStock &&
                              product.stock > 0 && (
                                <TrendingUp
                                  size={14}
                                  className="text-green-400"
                                />
                              )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center gap-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleOpenForm(product)}
                              className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-all duration-300"
                              title="Edit product"
                            >
                              <Edit size={16} />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setDeleteConfirm(product.id)}
                              className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all duration-300"
                              title="Delete product"
                            >
                              <Trash2 size={16} />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* Product Form Modal */}
      <AnimatePresence>
        {formOpen && (
          <ProductForm
            product={selectedProduct}
            onSubmit={handleFormSubmit}
            onClose={handleCloseForm}
            isLoading={isFormLoading}
          />
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-linear-to-br from-slate-800 to-slate-900 rounded-2xl border border-white/10 p-6 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 size={32} className="text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-white text-center mb-2">
                Delete Product?
              </h3>
              <p className="text-gray-400 text-center mb-6">
                This action cannot be undone. The product will be permanently
                deleted.
              </p>
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-gray-300 font-medium hover:bg-slate-600/50 transition-all duration-300"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleDelete(deleteConfirm)}
                  disabled={isFormLoading}
                  className="flex-1 px-4 py-3 bg-linear-to-r from-red-500 to-red-600 rounded-xl text-white font-medium shadow-lg shadow-red-500/25 hover:shadow-red-500/40 transition-all duration-300 disabled:opacity-50"
                >
                  {isFormLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <motion.div
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                      Deleting...
                    </span>
                  ) : (
                    "Delete"
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Message */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="fixed top-4 right-4 bg-linear-to-r from-green-500/20 to-green-600/20 border border-green-500/30 rounded-xl p-4 flex items-center gap-3 z-50 shadow-xl backdrop-blur-sm"
          >
            <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
              <CheckCircle size={18} className="text-green-400" />
            </div>
            <span className="text-green-300 font-medium">{successMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </MainLayout>
  );
}
