import { useState } from "react";
import { motion } from "framer-motion";
import {
  X,
  User,
  Mail,
  Phone,
  Building2,
  MapPin,
  AlertCircle,
  Users,
  Globe,
  Home,
  Briefcase,
  CheckCircle,
  Clock,
} from "lucide-react";
import type { Client } from "@/hooks/useClients";

interface ClientFormProps {
  client?: Client;
  onSubmit: (formData: Partial<Client>) => void;
  onClose: () => void;
  isLoading?: boolean;
}

export function ClientForm({
  client,
  onSubmit,
  onClose,
  isLoading = false,
}: ClientFormProps) {
  const [formData, setFormData] = useState<Partial<Client>>(
    client || {
      name: "",
      email: "",
      phone: "",
      company: "",
      address: "",
      city: "",
      country: "",
      type: "individual",
      status: "active",
    },
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
            <div className="p-3 bg-blue-500/20 rounded-xl">
              {client ? (
                <User size={24} className="text-blue-400" />
              ) : (
                <Users size={24} className="text-blue-400" />
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-linear-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent">
                {client ? "Edit Client" : "Add New Client"}
              </h2>
              <p className="text-xs text-blue-300/60 mt-1">
                {client
                  ? "Update client information"
                  : "Enter client details below"}
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ rotate: 90, scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors group"
          >
            <X
              size={20}
              className="text-gray-400 group-hover:text-blue-400 transition-colors"
            />
          </motion.button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Name and Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex text-sm font-medium text-blue-300/80 mb-2 items-center gap-2">
                <User size={14} className="text-blue-400" />
                Full Name <span className="text-red-400">*</span>
              </label>
              <div className="relative group">
                <User
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-blue-400 transition-colors duration-300"
                />
                <input
                  type="text"
                  name="name"
                  value={formData.name || ""}
                  onChange={handleChange}
                  required
                  placeholder="e.g., John Doe"
                  className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 hover:bg-slate-700/80"
                />
              </div>
            </div>
            <div>
              <label className="flex text-sm font-medium text-blue-300/80 mb-2 items-center gap-2">
                <Mail size={14} className="text-blue-400" />
                Email <span className="text-red-400">*</span>
              </label>
              <div className="relative group">
                <Mail
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-blue-400 transition-colors duration-300"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email || ""}
                  onChange={handleChange}
                  required
                  placeholder="e.g., john@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 hover:bg-slate-700/80"
                />
              </div>
            </div>
          </div>

          {/* Phone and Company */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex text-sm font-medium text-blue-300/80 mb-2 items-center gap-2">
                <Phone size={14} className="text-blue-400" />
                Phone <span className="text-red-400">*</span>
              </label>
              <div className="relative group">
                <Phone
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-blue-400 transition-colors duration-300"
                />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone || ""}
                  onChange={handleChange}
                  required
                  placeholder="e.g., +1234567890"
                  className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 hover:bg-slate-700/80"
                />
              </div>
            </div>
            <div>
              <label className="flex text-sm font-medium text-blue-300/80 mb-2 items-center gap-2">
                <Building2 size={14} className="text-blue-400" />
                Company
              </label>
              <div className="relative group">
                <Building2
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-blue-400 transition-colors duration-300"
                />
                <input
                  type="text"
                  name="company"
                  value={formData.company || ""}
                  onChange={handleChange}
                  placeholder="e.g., ABC Corporation"
                  className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 hover:bg-slate-700/80"
                />
              </div>
            </div>
          </div>

          {/* Address and City */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex text-sm font-medium text-blue-300/80 mb-2 items-center gap-2">
                <MapPin size={14} className="text-blue-400" />
                Address <span className="text-red-400">*</span>
              </label>
              <div className="relative group">
                <Home
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-blue-400 transition-colors duration-300"
                />
                <input
                  type="text"
                  name="address"
                  value={formData.address || ""}
                  onChange={handleChange}
                  required
                  placeholder="e.g., 123 Main Street"
                  className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 hover:bg-slate-700/80"
                />
              </div>
            </div>
            <div>
              <label className="flex text-sm font-medium text-blue-300/80 mb-2 items-center gap-2">
                <MapPin size={14} className="text-blue-400" />
                City <span className="text-red-400">*</span>
              </label>
              <div className="relative group">
                <MapPin
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-blue-400 transition-colors duration-300"
                />
                <input
                  type="text"
                  name="city"
                  value={formData.city || ""}
                  onChange={handleChange}
                  required
                  placeholder="e.g., New York"
                  className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 hover:bg-slate-700/80"
                />
              </div>
            </div>
          </div>

          {/* Country, Type, and Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="flex text-sm font-medium text-blue-300/80 mb-2 items-center gap-2">
                <Globe size={14} className="text-blue-400" />
                Country <span className="text-red-400">*</span>
              </label>
              <div className="relative group">
                <Globe
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-blue-400 transition-colors duration-300"
                />
                <input
                  type="text"
                  name="country"
                  value={formData.country || ""}
                  onChange={handleChange}
                  required
                  placeholder="e.g., USA"
                  className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 hover:bg-slate-700/80"
                />
              </div>
            </div>
            <div>
              <label className="flex text-sm font-medium text-blue-300/80 mb-2 items-center gap-2">
                <Briefcase size={14} className="text-blue-400" />
                Type <span className="text-red-400">*</span>
              </label>
              <div className="relative group">
                <User
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-blue-400 transition-colors duration-300"
                />
                <select
                  name="type"
                  value={formData.type || "individual"}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 hover:bg-slate-700/80 appearance-none"
                >
                  <option value="individual" className="bg-slate-800">
                    Individual
                  </option>
                  <option value="business" className="bg-slate-800">
                    Business
                  </option>
                </select>
              </div>
            </div>
            <div>
              <label className="flex text-sm font-medium text-blue-300/80 mb-2 items-center gap-2">
                <AlertCircle size={14} className="text-blue-400" />
                Status <span className="text-red-400">*</span>
              </label>
              <div className="relative group">
                {formData.status === "active" ? (
                  <CheckCircle
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400"
                  />
                ) : (
                  <Clock
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                )}
                <select
                  name="status"
                  value={formData.status || "active"}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 hover:bg-slate-700/80 appearance-none"
                >
                  <option value="active" className="bg-slate-800">
                    Active
                  </option>
                  <option value="inactive" className="bg-slate-800">
                    Inactive
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* Preview Card (optional visual feedback) */}
          {formData.name && formData.type && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl"
            >
              <p className="text-xs text-blue-300/60 mb-2">Client Preview</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-linear-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                  {formData.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-white font-medium">{formData.name}</p>
                  <p className="text-xs text-gray-400">
                    {formData.type === "business"
                      ? "Business Client"
                      : "Individual Client"}{" "}
                    • {formData.email}
                  </p>
                </div>
                <div className="ml-auto">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      formData.status === "active"
                        ? "bg-green-500/20 text-green-300"
                        : "bg-gray-500/20 text-gray-300"
                    }`}
                  >
                    {formData.status === "active" ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </motion.div>
          )}

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
              className="flex-1 px-4 py-3 bg-linear-to-r from-blue-500 to-blue-600 rounded-xl text-white font-medium shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <motion.div
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>{client ? "Update Client" : "Create Client"}</>
                )}
              </span>
              <motion.div
                className="absolute inset-0 bg-linear-to-r from-blue-600 to-blue-700"
                initial={{ x: "100%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          </div>
        </form>

        {/* Decorative Elements */}
        <div className="absolute -top-2 -right-2 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-2 -left-2 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      </motion.div>
    </motion.div>
  );
}
