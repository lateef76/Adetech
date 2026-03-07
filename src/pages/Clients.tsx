import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useClients } from "@/hooks/useClients";
import type { Client } from "@/hooks/useClients";
import { useClientMutations } from "@/hooks/useClientMutations";
import { MainLayout } from "@/layouts/MainLayout";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { ClientForm } from "@/components/ClientForm";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
  Filter,
  X,
  Building2,
  Users,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Download,
  RefreshCw,
} from "lucide-react";

export function ClientsPage() {
  // Client management page
  const { user } = useAuth();
  const { clients, loading, error, refetch } = useClients();
  const {
    addClient,
    updateClient,
    deleteClient,
    isLoading: isFormLoading,
  } = useClientMutations();
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | undefined>();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Filter clients
  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (client.company &&
        client.company.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = typeFilter === "all" || client.type === typeFilter;
    const matchesStatus =
      statusFilter === "all" || client.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  // Calculate stats
  const activeClients = filteredClients.filter((c) => c.status === "active");
  const businessClients = filteredClients.filter((c) => c.type === "business");
  const individualClients = filteredClients.filter(
    (c) => c.type === "individual",
  );
  const totalClients = filteredClients.length;

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleOpenForm = (client?: Client) => {
    setSelectedClient(client);
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setSelectedClient(undefined);
  };

  const handleFormSubmit = async (formData: Partial<Client>) => {
    try {
      if (selectedClient) {
        await updateClient(selectedClient.id, formData);
        setSuccessMessage("Client updated successfully!");
      } else {
        await addClient(formData);
        setSuccessMessage("Client created successfully!");
      }
      handleCloseForm();
      refetch();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error("Form submission error:", err);
    }
  };

  const handleDelete = async (clientId: string) => {
    try {
      await deleteClient(clientId);
      setSuccessMessage("Client deleted successfully!");
      setDeleteConfirm(null);
      refetch();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error("Delete error:", err);
    }
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
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <Users size={28} className="text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-linear-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent">
                Clients
              </h1>
              <p className="text-gray-400 mt-1">
                Manage your customer and client information
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              className="p-3 bg-slate-700/50 border border-white/10 rounded-xl text-gray-300 hover:text-blue-400 hover:border-blue-500/30 transition-all duration-300"
            >
              <RefreshCw
                size={20}
                className={refreshing ? "animate-spin" : ""}
              />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleOpenForm()}
              className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300"
            >
              <Plus
                size={20}
                className="group-hover:rotate-90 transition-transform duration-300"
              />
              Add Client
            </motion.button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-linear-to-br from-slate-800 to-slate-900 rounded-xl p-5 border border-white/10 hover:border-blue-500/30 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Users size={20} className="text-blue-400" />
              </div>
              <span className="text-xs text-blue-400 bg-blue-500/20 px-2 py-1 rounded-full">
                Total
              </span>
            </div>
            <p className="text-2xl font-bold text-white">{totalClients}</p>
            <p className="text-sm text-gray-400 mt-1">Total Clients</p>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="bg-linear-to-br from-slate-800 to-slate-900 rounded-xl p-5 border border-white/10 hover:border-green-500/30 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <CheckCircle size={20} className="text-green-400" />
              </div>
              <span className="text-xs text-green-400 bg-green-500/20 px-2 py-1 rounded-full">
                Active
              </span>
            </div>
            <p className="text-2xl font-bold text-white">
              {activeClients.length}
            </p>
            <p className="text-sm text-gray-400 mt-1">Active Clients</p>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="bg-linear-to-br from-slate-800 to-slate-900 rounded-xl p-5 border border-white/10 hover:border-purple-500/30 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Briefcase size={20} className="text-purple-400" />
              </div>
              <span className="text-xs text-purple-400 bg-purple-500/20 px-2 py-1 rounded-full">
                Business
              </span>
            </div>
            <p className="text-2xl font-bold text-white">
              {businessClients.length}
            </p>
            <p className="text-sm text-gray-400 mt-1">Business Clients</p>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="bg-linear-to-br from-slate-800 to-slate-900 rounded-xl p-5 border border-white/10 hover:border-orange-500/30 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <User size={20} className="text-orange-400" />
              </div>
              <span className="text-xs text-orange-400 bg-orange-500/20 px-2 py-1 rounded-full">
                Individual
              </span>
            </div>
            <p className="text-2xl font-bold text-white">
              {individualClients.length}
            </p>
            <p className="text-sm text-gray-400 mt-1">Individual Clients</p>
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
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-blue-400 transition-colors duration-300"
            />
            <input
              type="text"
              placeholder="Search by name, email, phone, or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 hover:bg-slate-800/80"
            />
          </div>

          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-gray-300 hover:text-blue-400 hover:border-blue-500/30 transition-all duration-300 flex items-center gap-2"
            >
              <Filter size={18} />
              <span className="hidden sm:inline">Filters</span>
            </motion.button>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 hover:bg-slate-800/80"
            >
              <option value="all" className="bg-slate-800">
                All Types
              </option>
              <option value="individual" className="bg-slate-800">
                Individual
              </option>
              <option value="business" className="bg-slate-800">
                Business
              </option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 hover:bg-slate-800/80"
            >
              <option value="all" className="bg-slate-800">
                All Status
              </option>
              <option value="active" className="bg-slate-800">
                Active
              </option>
              <option value="inactive" className="bg-slate-800">
                Inactive
              </option>
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
                <h3 className="text-sm font-medium text-blue-400">
                  Active Filters
                </h3>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setTypeFilter("all");
                    setStatusFilter("all");
                  }}
                  className="text-xs text-gray-400 hover:text-blue-400 transition-colors flex items-center gap-1"
                >
                  <X size={14} />
                  Clear all
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {searchQuery && (
                  <span className="px-3 py-1.5 bg-blue-500/10 border border-blue-500/30 rounded-lg text-sm text-blue-300 flex items-center gap-2">
                    Search: {searchQuery}
                    <button onClick={() => setSearchQuery("")}>
                      <X size={14} className="hover:text-blue-400" />
                    </button>
                  </span>
                )}
                {typeFilter !== "all" && (
                  <span className="px-3 py-1.5 bg-blue-500/10 border border-blue-500/30 rounded-lg text-sm text-blue-300 flex items-center gap-2">
                    Type: {typeFilter}
                    <button onClick={() => setTypeFilter("all")}>
                      <X size={14} className="hover:text-blue-400" />
                    </button>
                  </span>
                )}
                {statusFilter !== "all" && (
                  <span className="px-3 py-1.5 bg-blue-500/10 border border-blue-500/30 rounded-lg text-sm text-blue-300 flex items-center gap-2">
                    Status: {statusFilter}
                    <button onClick={() => setStatusFilter("all")}>
                      <X size={14} className="hover:text-blue-400" />
                    </button>
                  </span>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Clients Table */}
        <motion.div
          variants={itemVariants}
          className="bg-linear-to-br from-slate-800 to-slate-900 rounded-xl border border-white/10 overflow-hidden shadow-xl"
        >
          {loading ? (
            <div className="p-12 text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
              />
              <p className="text-gray-400">Loading clients...</p>
            </div>
          ) : error ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={32} className="text-red-400" />
              </div>
              <p className="text-red-400">Error: {error}</p>
            </div>
          ) : filteredClients.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users size={32} className="text-gray-500" />
              </div>
              <p className="text-gray-400 mb-2">No clients found</p>
              <p className="text-sm text-gray-500">
                Create your first client to get started
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10 bg-slate-700/30">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredClients.map((client, index) => (
                    <motion.tr
                      key={client.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-white/5 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                            {client.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-white">
                              {client.name}
                            </p>
                            {client.company && (
                              <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                                <Building2
                                  size={12}
                                  className="text-blue-400"
                                />
                                {client.company}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <p className="text-sm text-gray-300 flex items-center gap-2">
                            <Mail size={14} className="text-blue-400" />
                            {client.email}
                          </p>
                          <p className="text-sm text-gray-300 flex items-center gap-2">
                            <Phone size={14} className="text-blue-400" />
                            {client.phone}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <p className="text-sm text-gray-300 flex items-center gap-2">
                            <MapPin size={14} className="text-blue-400" />
                            {client.city}, {client.country}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                            client.type === "business"
                              ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                              : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                          }`}
                        >
                          {client.type === "business" ? (
                            <Briefcase size={12} />
                          ) : (
                            <User size={12} />
                          )}
                          {client.type === "business"
                            ? "Business"
                            : "Individual"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                            client.status === "active"
                              ? "bg-green-500/20 text-green-300 border border-green-500/30"
                              : "bg-gray-500/20 text-gray-300 border border-gray-500/30"
                          }`}
                        >
                          {client.status === "active" ? (
                            <CheckCircle size={12} />
                          ) : (
                            <AlertCircle size={12} />
                          )}
                          {client.status === "active" ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleOpenForm(client)}
                            className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-all duration-300"
                            title="Edit client"
                          >
                            <Edit size={16} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setDeleteConfirm(client.id)}
                            className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all duration-300"
                            title="Delete client"
                          >
                            <Trash2 size={16} />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Export Section */}
        {filteredClients.length > 0 && (
          <motion.div variants={itemVariants} className="flex justify-end">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 border border-white/10 rounded-xl text-gray-300 hover:text-blue-400 hover:border-blue-500/30 transition-all duration-300"
            >
              <Download size={18} />
              <span>Export List</span>
            </motion.button>
          </motion.div>
        )}
      </motion.div>

      {/* Client Form Modal */}
      <AnimatePresence>
        {formOpen && (
          <ClientForm
            client={selectedClient}
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
                Delete Client?
              </h3>
              <p className="text-gray-400 text-center mb-6">
                This action cannot be undone. The client and all associated data
                will be permanently deleted.
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
