/**
 * Receipts Page - Phase 5
 * Displays all receipts with CRUD functionality in a beautiful receipt-themed layout
 */

import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "@/layouts/MainLayout";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  Receipt as ReceiptIcon,
  Filter,
  Download,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  X,
  CheckCircle,
  Clock,
  FileText,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useReceipts } from "@/hooks/useReceipts";
import { useReceiptMutations } from "@/hooks/useReceiptMutations";
import { ReceiptsTable } from "@/components/receipts";
import type { ReceiptStatus, Receipt } from "@/types/receipt";
import { ReceiptStatus as ReceiptStatusValues } from "@/types/receipt";
import { Badge } from "@/components/ui/badge";
import {
  exportReceiptsToCSV,
  printReceipt,
  downloadReceiptPDF,
  sendReceiptEmail,
} from "@/utils/receipt-utils";

export function ReceiptsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { receipts, stats, loading, refetch } = useReceipts();
  const { handleDeleteReceipt } = useReceiptMutations();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ReceiptStatus | "all">(
    "all",
  );
  const [showFilters, setShowFilters] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Generate stable random widths for skeleton loading (pre-generated to avoid impure function call)
  const skeletonWidths = useMemo(() => {
    return [65, 72, 68]; // Pre-generated random widths between 60-100
  }, []);

  // Filter receipts
  const filteredReceipts = useMemo(() => {
    return receipts.filter((receipt) => {
      const matchesSearch =
        receipt.receiptNumber
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        receipt.clientName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || receipt.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [receipts, searchTerm, statusFilter]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleExportAll = () => {
    exportReceiptsToCSV(filteredReceipts);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-SN", {
      style: "currency",
      currency: "XOF",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const statItems = [
    {
      label: "Total Receipts",
      value: stats?.totalReceipts || 0,
      icon: ReceiptIcon,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
      textColor: "text-purple-600 dark:text-purple-400",
      trend: "+12%",
    },
    {
      label: "Total Revenue",
      value: formatCurrency(stats?.totalAmount || 0),
      icon: DollarSign,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/30",
      textColor: "text-green-600 dark:text-green-400",
      trend: "+8%",
    },
    {
      label: "Paid Amount",
      value: formatCurrency(stats?.paidAmount || 0),
      icon: CheckCircle,
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
      textColor: "text-emerald-600 dark:text-emerald-400",
      trend: "+15%",
    },
    {
      label: "Pending Amount",
      value: formatCurrency(stats?.pendingAmount || 0),
      icon: Clock,
      color: "from-amber-500 to-amber-600",
      bgColor: "bg-amber-100 dark:bg-amber-900/30",
      textColor: "text-amber-600 dark:text-amber-400",
      trend: "-3%",
      trendDown: true,
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
      <DashboardHeader
        title="Receipts"
        description="Create, manage, and track your receipts and invoices"
        userName={user?.displayName || user?.email || "User"}
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statItems.map((stat, index) => (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="group"
            >
              <Card className="p-5 border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all duration-300 overflow-hidden relative">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
                      backgroundSize: "20px 20px",
                    }}
                  />
                </div>

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-2">
                    <div className={`p-2.5 rounded-xl ${stat.bgColor}`}>
                      <stat.icon size={18} className={stat.textColor} />
                    </div>
                    <div
                      className={`flex items-center gap-1 text-xs ${
                        stat.trendDown ? "text-red-500" : "text-green-500"
                      }`}
                    >
                      {stat.trendDown ? (
                        <TrendingDown size={12} />
                      ) : (
                        <TrendingUp size={12} />
                      )}
                      <span>{stat.trend}</span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {stat.value}
                  </p>
                  <div className="mt-3 h-1 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${skeletonWidths[index]}%` }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 1 }}
                      className={`h-full bg-linear-to-r ${stat.color}`}
                    />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Header with Actions */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col md:flex-row md:justify-between md:items-center gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
              <ReceiptIcon
                size={20}
                className="text-purple-600 dark:text-purple-400"
              />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-purple-300">
                Receipt Management
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                View and manage all your receipts
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="gap-2"
            >
              <RefreshCw
                size={14}
                className={refreshing ? "animate-spin" : ""}
              />
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportAll}
              className="gap-2"
            >
              <Download size={14} />
              Export
            </Button>
            <Button
              onClick={() => navigate("/receipts/new")}
              className="bg-linear-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 gap-2"
              size="sm"
            >
              <Plus size={16} />
              New Receipt
            </Button>
          </div>
        </motion.div>

        {/* Filters Section */}
        <motion.div variants={itemVariants} className="space-y-4">
          {/* Search and Filter Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Search by receipt number or client name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-10"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className={`flex-1 gap-2 ${showFilters ? "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800" : ""}`}
              >
                <Filter size={14} />
                Filters
              </Button>
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as ReceiptStatus | "all")
                }
                className="flex-1 px-3 py-2 border border-slate-300 rounded-md dark:bg-slate-800 dark:border-slate-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              >
                <option value="all">All Status</option>
                <option value={ReceiptStatusValues.DRAFT}>Draft</option>
                <option value={ReceiptStatusValues.ISSUED}>Issued</option>
                <option value={ReceiptStatusValues.PENDING}>Pending</option>
                <option value={ReceiptStatusValues.PAID}>Paid</option>
                <option value={ReceiptStatusValues.CANCELLED}>Cancelled</option>
              </select>
            </div>
          </div>

          {/* Active Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Active Filters
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                  }}
                  className="h-7 px-2 text-xs"
                >
                  Clear all
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {searchTerm && (
                  <Badge variant="secondary" className="gap-1 px-3 py-1">
                    Search: {searchTerm}
                    <X
                      size={12}
                      className="cursor-pointer"
                      onClick={() => setSearchTerm("")}
                    />
                  </Badge>
                )}
                {statusFilter !== "all" && (
                  <Badge variant="secondary" className="gap-1 px-3 py-1">
                    Status: {statusFilter}
                    <X
                      size={12}
                      className="cursor-pointer"
                      onClick={() => setStatusFilter("all")}
                    />
                  </Badge>
                )}
              </div>
            </motion.div>
          )}

          {/* Results Summary */}
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2">
              <FileText size={14} className="text-purple-500" />
              <span className="text-slate-600 dark:text-slate-400">
                Showing{" "}
                <span className="font-semibold text-slate-900 dark:text-white">
                  {filteredReceipts.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-900 dark:text-white">
                  {receipts.length}
                </span>{" "}
                receipts
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-slate-400" />
              <span className="text-slate-500 dark:text-slate-400">
                {new Date().toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Receipts Table */}
        <motion.div variants={itemVariants}>
          <ReceiptsTable
            receipts={filteredReceipts}
            onView={(receipt: Receipt) => navigate(`/receipts/${receipt.id}`)}
            onEdit={(receipt: Receipt) => navigate(`/receipts/${receipt.id}`)}
            onDelete={async (id: string) => {
              if (confirm("Are you sure you want to delete this receipt?")) {
                try {
                  await handleDeleteReceipt(id);
                  await refetch();
                } catch (error) {
                  console.error("Error deleting receipt:", error);
                  alert("Failed to delete receipt");
                }
              }
            }}
            onPrint={(receipt: Receipt) => {
              printReceipt(receipt);
            }}
            onDownload={(receipt: Receipt) => {
              downloadReceiptPDF(receipt);
            }}
            onSend={(receipt: Receipt) => {
              sendReceiptEmail(receipt);
            }}
            isLoading={loading}
          />
        </motion.div>

        {/* Quick Stats Footer */}
        {filteredReceipts.length > 0 && (
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <Card className="p-3 flex items-center gap-3 bg-linear-to-r from-purple-50 to-transparent dark:from-purple-900/10 border-purple-100 dark:border-purple-800">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <ReceiptIcon
                  size={16}
                  className="text-purple-600 dark:text-purple-400"
                />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Average per receipt
                </p>
                <p className="font-semibold text-slate-900 dark:text-white">
                  {formatCurrency(
                    (stats?.totalAmount || 0) / (stats?.totalReceipts || 1),
                  )}
                </p>
              </div>
            </Card>

            <Card className="p-3 flex items-center gap-3 bg-linear-to-r from-green-50 to-transparent dark:from-green-900/10 border-green-100 dark:border-green-800">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <CheckCircle
                  size={16}
                  className="text-green-600 dark:text-green-400"
                />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Paid receipts
                </p>
                <p className="font-semibold text-slate-900 dark:text-white">
                  {
                    receipts.filter(
                      (r) => r.status === ReceiptStatusValues.PAID,
                    ).length
                  }{" "}
                  receipts
                </p>
              </div>
            </Card>

            <Card className="p-3 flex items-center gap-3 bg-linear-to-r from-amber-50 to-transparent dark:from-amber-900/10 border-amber-100 dark:border-amber-800">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                <Clock
                  size={16}
                  className="text-amber-600 dark:text-amber-400"
                />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Pending receipts
                </p>
                <p className="font-semibold text-slate-900 dark:text-white">
                  {
                    receipts.filter(
                      (r) => r.status === ReceiptStatusValues.PENDING,
                    ).length
                  }{" "}
                  receipts
                </p>
              </div>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </MainLayout>
  );
}
