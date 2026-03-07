import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Lock,
  Mail,
  User,
  Phone,
  MapPin,
  Hammer,
  Wrench,
  Settings,
  Shield,
  ArrowRight,
  CheckCircle,
  Eye,
  EyeOff,
  Truck,
  CreditCard,
  HardHat,
} from "lucide-react";
import { authService } from "@/services/auth";

// Generate particles once at module level to avoid render-time random generation
const PARTICLES = [...Array(20)].map((_, i) => ({
  id: i,
  x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 800),
  y: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 600),
  duration: 3 + Math.random() * 2,
  delay: Math.random() * 2,
}));

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    address: "",
    businessType: "contractor",
    acceptTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState<string>("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Validation
      if (!formData.fullName.trim()) {
        setError("Company name is required");
        setIsLoading(false);
        return;
      }

      if (
        !formData.email.trim() ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
      ) {
        setError("Valid email address is required");
        setIsLoading(false);
        return;
      }

      if (formData.password.length < 8) {
        setError("Password must be at least 8 characters");
        setIsLoading(false);
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        setIsLoading(false);
        return;
      }

      if (!formData.acceptTerms) {
        setError("You must accept the terms and conditions");
        setIsLoading(false);
        return;
      }

      const result = await authService.signUp(
        formData.email,
        formData.password,
      );

      if (result.success) {
        setCurrentStep(2);
      } else {
        setError(result.error?.message || "Registration failed");
      }
    } catch {
      setError("An error occurred during registration");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setError("");
    setIsLoading(true);
    try {
      console.log("Starting Google Sign-In...");
      const result = await authService.signInWithGoogle();
      console.log("Google Sign-In result:", result);

      if (result.success) {
        // Redirect to dashboard on successful Google sign-in
        console.log("Google sign-in successful, redirecting...");
        navigate("/dashboard");
      } else {
        const errorMsg = result.error?.message || "Google sign-up failed";
        console.error("Google sign-in failed:", errorMsg);
        setError(errorMsg);
      }
    } catch (err) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : "An error occurred during Google sign-up";
      console.error("Google sign-up error:", err);
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // Password strength checker
  const getPasswordStrength = () => {
    const password = formData.password;
    let strength = 0;

    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    return strength;
  };

  const passwordStrength = getPasswordStrength();
  const strengthText = ["Weak", "Fair", "Good", "Strong"];
  const strengthColor = [
    "bg-red-500",
    "bg-yellow-500",
    "bg-blue-500",
    "bg-green-500",
  ];

  // Floating animation for background elements
  const floatingIcons = [
    { Icon: Hammer, delay: 0, duration: 3, x: 20, y: 30 },
    { Icon: Wrench, delay: 1, duration: 4, x: -15, y: 20 },
    { Icon: Settings, delay: 2, duration: 3.5, x: 25, y: -25 },
    { Icon: Truck, delay: 1.5, duration: 4.5, x: -20, y: -15 },
    { Icon: HardHat, delay: 2.5, duration: 4, x: 30, y: -20 },
    { Icon: CreditCard, delay: 3, duration: 3.8, x: -25, y: 25 },
  ];

  return (
    <div className="min-h-screen w-full flex overflow-hidden relative bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Animated background with hardware store theme */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110 animate-slow-zoom"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1530124566582-a618bc2615dc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")',
          }}
        />

        <div className="absolute inset-0 bg-linear-to-r from-slate-900/95 via-slate-900/80 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,var(--tw-gradient-stops))] from-orange-500/10 via-transparent to-transparent" />

        {/* Animated floating hardware icons */}
        {floatingIcons.map(({ Icon, delay, duration, x, y }, index) => (
          <motion.div
            key={index}
            className="absolute text-orange-500/20"
            style={{
              top: `${15 + index * 10}%`,
              left: `${5 + index * 8}%`,
            }}
            animate={{
              y: [0, y, 0],
              x: [0, x, 0],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration,
              delay,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          >
            <Icon size={50 + index * 15} />
          </motion.div>
        ))}

        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)",
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative w-full flex items-center justify-center lg:justify-end px-4 sm:px-6 lg:px-8 py-8">
        {/* Decorative line */}
        <motion.div
          className="absolute left-0 top-0 bottom-0 w-1 bg-linear-to-b from-orange-500 via-orange-400 to-orange-500"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "100%", opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        />

        {/* Registration container */}
        <motion.div
          className="w-full max-w-2xl"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Welcome header */}
          <motion.div
            className="mb-8 text-right"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <motion.h1
              className="text-5xl font-bold text-white mb-2"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              Adetech Quincaillerie
            </motion.h1>
            <p className="text-orange-200/80 text-lg">
              Create Your Invoice Account
            </p>
          </motion.div>

          {/* Registration card */}
          <motion.div
            className="backdrop-blur-xl bg-white/10 rounded-2xl p-8 shadow-2xl border border-white/20"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            {/* Step indicator */}
            {currentStep === 1 && (
              <motion.div
                className="flex justify-between mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {["Account Details", "Verification", "Welcome"].map(
                  (step, index) => (
                    <div key={step} className="flex items-center">
                      <div
                        className={`flex items-center justify-center w-8 h-8 rounded-full ${
                          index + 1 === 1
                            ? "bg-orange-500 text-white"
                            : "bg-white/10 text-orange-200/60"
                        }`}
                      >
                        {index + 1}
                      </div>
                      {index < 2 && (
                        <div
                          className={`w-20 h-1 mx-2 rounded ${
                            index + 1 < 1 ? "bg-orange-500" : "bg-white/10"
                          }`}
                        />
                      )}
                    </div>
                  ),
                )}
              </motion.div>
            )}

            {currentStep === 2 ? (
              /* Success Step */
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle size={48} className="text-white" />
                </motion.div>

                <h2 className="text-3xl font-bold text-white mb-4">
                  Welcome to Adetech Quincaillerie!
                </h2>
                <p className="text-orange-200/80 text-lg mb-8">
                  Your account has been successfully created
                </p>

                <div className="space-y-4">
                  <p className="text-orange-200/70">
                    We've sent a verification link to{" "}
                    <span className="text-orange-400 font-medium">
                      {formData.email}
                    </span>
                  </p>

                  <motion.button
                    type="button"
                    onClick={() => navigate("/dashboard")}
                    className="w-full relative overflow-hidden group bg-linear-to-r from-orange-500 to-orange-600 text-white py-3 px-4 rounded-lg font-medium shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Go to Dashboard
                      <ArrowRight size={18} />
                    </span>
                    <motion.div
                      className="absolute inset-0 bg-linear-to-r from-orange-600 to-orange-700"
                      initial={{ x: "100%" }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              /* Registration Form */
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Error Alert */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-500/20 border border-red-500/50 text-red-300 p-3 rounded-lg text-sm"
                  >
                    {error}
                  </motion.div>
                )}
                {/* Full Name */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <label className="block text-orange-200/90 text-sm font-medium mb-2 text-right">
                    Company Name
                  </label>
                  <div className="relative group">
                    <User
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-300/70 group-hover:text-orange-400 transition-colors"
                      size={20}
                    />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-11 text-white placeholder-orange-200/50 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 hover:bg-white/10"
                      placeholder="Enter your company name"
                      required
                    />
                  </div>
                </motion.div>

                {/* Email and Phone - Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <label className="block text-orange-200/90 text-sm font-medium mb-2 text-right">
                      Email Address
                    </label>
                    <div className="relative group">
                      <Mail
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-300/70 group-hover:text-orange-400 transition-colors"
                        size={20}
                      />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-11 text-white placeholder-orange-200/50 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 hover:bg-white/10"
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 }}
                  >
                    <label className="block text-orange-200/90 text-sm font-medium mb-2 text-right">
                      Phone Number
                    </label>
                    <div className="relative group">
                      <Phone
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-300/70 group-hover:text-orange-400 transition-colors"
                        size={20}
                      />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-11 text-white placeholder-orange-200/50 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 hover:bg-white/10"
                        placeholder="+1 234 567 8900"
                        required
                      />
                    </div>
                  </motion.div>
                </div>

                {/* Password and Confirm Password - Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.0 }}
                  >
                    <label className="block text-orange-200/90 text-sm font-medium mb-2 text-right">
                      Password
                    </label>
                    <div className="relative group">
                      <Lock
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-300/70 group-hover:text-orange-400 transition-colors"
                        size={20}
                      />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-11 text-white placeholder-orange-200/50 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 hover:bg-white/10"
                        placeholder="Create a password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-orange-300/70 hover:text-orange-400 transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>

                    {/* Password strength indicator */}
                    {formData.password && (
                      <motion.div
                        className="mt-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <div className="flex gap-1 h-1">
                          {[...Array(4)].map((_, i) => (
                            <div
                              key={i}
                              className={`flex-1 h-full rounded ${
                                i < passwordStrength
                                  ? strengthColor[passwordStrength - 1]
                                  : "bg-white/10"
                              }`}
                            />
                          ))}
                        </div>
                        <p
                          className={`text-xs mt-1 text-right ${
                            passwordStrength === 1
                              ? "text-red-400"
                              : passwordStrength === 2
                                ? "text-yellow-400"
                                : passwordStrength === 3
                                  ? "text-blue-400"
                                  : passwordStrength === 4
                                    ? "text-green-400"
                                    : "text-orange-200/50"
                          }`}
                        >
                          {passwordStrength > 0
                            ? strengthText[passwordStrength - 1]
                            : "Password strength"}
                        </p>
                      </motion.div>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.1 }}
                  >
                    <label className="block text-orange-200/90 text-sm font-medium mb-2 text-right">
                      Confirm Password
                    </label>
                    <div className="relative group">
                      <Lock
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-300/70 group-hover:text-orange-400 transition-colors"
                        size={20}
                      />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-11 text-white placeholder-orange-200/50 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 hover:bg-white/10"
                        placeholder="Confirm your password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-orange-300/70 hover:text-orange-400 transition-colors"
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                    {formData.confirmPassword &&
                      formData.password !== formData.confirmPassword && (
                        <p className="text-red-400 text-xs mt-1 text-right">
                          Passwords do not match
                        </p>
                      )}
                  </motion.div>
                </div>

                {/* Address */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2 }}
                >
                  <label className="block text-orange-200/90 text-sm font-medium mb-2 text-right">
                    Address (Optional)
                  </label>
                  <div className="relative group">
                    <MapPin
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-300/70 group-hover:text-orange-400 transition-colors"
                      size={20}
                    />
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-11 text-white placeholder-orange-200/50 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 hover:bg-white/10"
                      placeholder="Enter your address"
                    />
                  </div>
                </motion.div>

                {/* Business Type */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.3 }}
                >
                  <label className="block text-orange-200/90 text-sm font-medium mb-2 text-right">
                    Business Type
                  </label>
                  <select
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 hover:bg-white/10"
                  >
                    <option value="contractor" className="bg-slate-800">
                      Contractor
                    </option>
                    <option value="business" className="bg-slate-800">
                      Business
                    </option>
                    <option value="wholesale" className="bg-slate-800">
                      Wholesale
                    </option>
                  </select>
                </motion.div>

                {/* Terms and Conditions */}
                <motion.div
                  className="flex items-center justify-end gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.4 }}
                >
                  <label className="text-sm text-orange-200/70 cursor-pointer select-none">
                    I accept the{" "}
                    <a
                      href="#"
                      className="text-orange-400 hover:text-orange-300"
                    >
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a
                      href="#"
                      className="text-orange-400 hover:text-orange-300"
                    >
                      Privacy Policy
                    </a>
                  </label>
                  <input
                    type="checkbox"
                    name="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={handleChange}
                    className="w-4 h-4 rounded border-white/20 bg-white/5 text-orange-500 focus:ring-orange-500/50 focus:ring-offset-0"
                    required
                  />
                </motion.div>

                {/* Register button */}
                <motion.button
                  type="submit"
                  className="w-full relative overflow-hidden group bg-linear-to-r from-orange-500 to-orange-600 text-white py-3 px-4 rounded-lg font-medium shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={
                    isLoading ||
                    formData.password !== formData.confirmPassword ||
                    !formData.acceptTerms
                  }
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isLoading ? (
                      <motion.div
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                    ) : (
                      <>
                        Create Account
                        <ArrowRight
                          size={18}
                          className="group-hover:translate-x-1 transition-transform"
                        />
                      </>
                    )}
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-linear-to-r from-orange-600 to-orange-700"
                    initial={{ x: "100%" }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.button>

                {/* Google Sign Up Button */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.6 }}
                >
                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white/10"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-transparent text-orange-200/60">
                        Or sign up with
                      </span>
                    </div>
                  </div>

                  <motion.button
                    type="button"
                    onClick={handleGoogleSignUp}
                    className="w-full relative overflow-hidden group bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg py-3 px-4 flex items-center justify-center gap-3 transition-all duration-300"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isLoading}
                  >
                    {/* Google Icon SVG */}
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        className="text-orange-500"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        className="text-green-500"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        className="text-yellow-500"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        className="text-blue-500"
                      />
                    </svg>
                    <span className="text-white font-medium">
                      Sign up with Google
                    </span>

                    {/* Hover effect */}
                    <motion.div
                      className="absolute inset-0 bg-linear-to-r from-orange-500/0 via-orange-500/10 to-orange-500/0"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.5 }}
                    />
                  </motion.button>
                </motion.div>

                {/* Login link */}
                <motion.p
                  className="text-center text-orange-200/70 text-sm mt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.7 }}
                >
                  Already have an account?{" "}
                  <motion.a
                    href="/login"
                    className="text-orange-400 hover:text-orange-300 font-medium"
                    whileHover={{ x: 2 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    Sign in here
                  </motion.a>
                </motion.p>
              </form>
            )}

            {/* Decorative elements */}
            <div className="absolute -top-2 -right-2 w-20 h-20 bg-orange-500/20 rounded-full blur-2xl" />
            <div className="absolute -bottom-2 -left-2 w-20 h-20 bg-blue-500/20 rounded-full blur-2xl" />
          </motion.div>

          {/* Trust badges */}
          <motion.div
            className="mt-8 flex justify-center gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
          >
            {["Secure Registration", "Data Protection", "Member Benefits"].map(
              (text) => (
                <motion.div
                  key={text}
                  className="flex items-center gap-2 text-orange-200/60 text-sm"
                  whileHover={{ color: "#f97316", scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Shield size={14} className="text-orange-500" />
                  <span>{text}</span>
                </motion.div>
              ),
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* Hardware store features sidebar */}
      <motion.div
        className="hidden lg:flex absolute left-0 top-0 bottom-0 w-96 bg-linear-to-r from-slate-900/95 to-transparent p-8 flex-col justify-center pointer-events-none"
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <h3 className="text-orange-500 text-xl font-bold mb-6">
          Member Benefits
        </h3>
        <div className="space-y-6">
          {[
            {
              icon: Truck,
              text: "Fast Invoice Generation",
              desc: "Create invoices in seconds",
            },
            {
              icon: CreditCard,
              text: "Flexible Payment Tracking",
              desc: "Track payments across multiple methods",
            },
            {
              icon: Wrench,
              text: "Customizable Templates",
              desc: "Tailor invoices to your brand",
            },
            {
              icon: HardHat,
              text: "Professional Reports",
              desc: "Detailed business analytics",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              className="flex items-start gap-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <item.icon className="text-orange-500" size={24} />
              </div>
              <div>
                <h4 className="text-white font-medium">{item.text}</h4>
                <p className="text-orange-200/60 text-sm">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          className="mt-8 grid grid-cols-2 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-500">10K+</div>
            <div className="text-orange-200/60 text-sm">Happy Customers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-500">5K+</div>
            <div className="text-orange-200/60 text-sm">Products</div>
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom decorative elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-slate-900 to-transparent pointer-events-none" />

      {/* Animated particles */}
      {PARTICLES.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-1 h-1 bg-orange-500/30 rounded-full"
          initial={{
            x: particle.x,
            y: particle.y,
          }}
          animate={{
            y: [null, -30, 30, -30],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
          }}
        />
      ))}
    </div>
  );
};

export { Register as RegisterPage };
export default Register;
