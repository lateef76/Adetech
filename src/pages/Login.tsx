import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Lock,
  Mail,
  ArrowRight,
  Hammer,
  Wrench,
  Settings,
  Shield,
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

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const result = await authService.signIn(email, password);

    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.error?.message || "Login failed. Please try again.");
    }

    setIsLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setIsLoading(true);

    const result = await authService.signInWithGoogle();

    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(
        result.error?.message || "Google sign-in failed. Please try again.",
      );
    }

    setIsLoading(false);
  };

  // Floating animation for background elements
  const floatingIcons = [
    { Icon: Hammer, delay: 0, duration: 3, x: 20, y: 30 },
    { Icon: Wrench, delay: 1, duration: 4, x: -15, y: 20 },
    { Icon: Settings, delay: 2, duration: 3.5, x: 25, y: -25 },
    { Icon: Shield, delay: 1.5, duration: 4.5, x: -20, y: -15 },
  ];

  return (
    <div className="min-h-screen w-full flex overflow-hidden relative bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Animated background with hardware store theme */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Background image with overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110 animate-slow-zoom"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1530124566582-a618bc2615dc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")',
          }}
        />

        {/* Multiple overlay layers for depth */}
        <div className="absolute inset-0 bg-linear-to-r from-slate-900/95 via-slate-900/80 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,var(--tw-gradient-stops))] from-orange-500/10 via-transparent to-transparent" />

        {/* Animated floating hardware icons */}
        {floatingIcons.map(({ Icon, delay, duration, x, y }, index) => (
          <motion.div
            key={index}
            className="absolute text-orange-500/20"
            style={{
              top: `${20 + index * 15}%`,
              left: `${10 + index * 8}%`,
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
            <Icon size={60 + index * 20} />
          </motion.div>
        ))}

        {/* Animated grid pattern */}
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)",
              backgroundSize: "50px 50px",
            }}
          />
        </div>
      </div>

      {/* Main content */}
      <div className="relative w-full flex items-center justify-end px-4 sm:px-6 lg:px-8">
        {/* Decorative line */}
        <motion.div
          className="absolute left-0 top-0 bottom-0 w-1 bg-linear-to-b from-orange-500 via-orange-400 to-orange-500"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "100%", opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        />

        {/* Login container */}
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Welcome text */}
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
              Manage Your Invoices Effortlessly
            </p>
          </motion.div>

          {/* Login card */}
          <motion.div
            className="backdrop-blur-xl bg-white/10 rounded-2xl p-8 shadow-2xl border border-white/20"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            whileHover={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" }}
          >
            <motion.h2
              className="text-2xl font-semibold text-white mb-6 text-right"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              Welcome Back
            </motion.h2>

            <form onSubmit={handleSubmit} className="space-y-6">
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
              {/* Email field */}
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-11 text-white placeholder-orange-200/50 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 hover:bg-white/10"
                    placeholder="Enter your email"
                    required
                  />
                  <motion.div
                    className="absolute inset-0 rounded-lg bg-linear-to-r from-orange-500/0 via-orange-500/0 to-orange-500/0"
                    whileHover={{
                      background:
                        "linear-gradient(90deg, rgba(249,115,22,0) 0%, rgba(249,115,22,0.1) 50%, rgba(249,115,22,0) 100%)",
                      transition: { duration: 0.5 },
                    }}
                  />
                </div>
              </motion.div>

              {/* Password field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 }}
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
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-11 text-white placeholder-orange-200/50 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 hover:bg-white/10"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </motion.div>

              {/* Remember me & Forgot password */}
              <motion.div
                className="flex items-center justify-between"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <label className="flex items-center space-x-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-white/20 bg-white/5 text-orange-500 focus:ring-orange-500/50 focus:ring-offset-0"
                  />
                  <span className="text-sm text-orange-200/70 group-hover:text-orange-200 transition-colors">
                    Remember me
                  </span>
                </label>
                <motion.button
                  onClick={() => navigate("/forgot-password")}
                  className="text-sm text-orange-400 hover:text-orange-300 transition-colors bg-transparent border-none cursor-pointer"
                  whileHover={{ x: -2 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  Forgot password?
                </motion.button>
              </motion.div>

              {/* Login button */}
              <motion.button
                type="submit"
                className="w-full relative overflow-hidden group bg-linear-to-r from-orange-500 to-orange-600 text-white py-3 px-4 rounded-lg font-medium shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading}
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
                      Sign In
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
            </form>

            {/* Google Sign In Button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-transparent text-orange-200/60">
                    Or continue with
                  </span>
                </div>
              </div>

              <motion.button
                type="button"
                onClick={handleGoogleSignIn}
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
                  Sign in with Google
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

            {/* Sign up link */}
            <motion.p
              className="text-center text-orange-200/70 text-sm mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3 }}
            >
              Don't have an account?{" "}
              <motion.button
                onClick={() => navigate("/register")}
                className="text-orange-400 hover:text-orange-300 font-medium bg-transparent border-none cursor-pointer"
                whileHover={{ x: 2 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                Sign up here
              </motion.button>
            </motion.p>

            {/* Decorative elements */}
            <div className="absolute -top-2 -right-2 w-20 h-20 bg-orange-500/20 rounded-full blur-2xl" />
            <div className="absolute -bottom-2 -left-2 w-20 h-20 bg-blue-500/20 rounded-full blur-2xl" />
          </motion.div>

          {/* Trust badges */}
          <motion.div
            className="mt-8 flex justify-center gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
          >
            {["Secure", "Reliable", "24/7 Support"].map((text) => (
              <motion.div
                key={text}
                className="flex items-center gap-2 text-orange-200/60 text-sm"
                whileHover={{ color: "#f97316", scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Shield size={14} className="text-orange-500" />
                <span>{text}</span>
              </motion.div>
            ))}
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
          Why Choose Adetech?
        </h3>
        <div className="space-y-6">
          {[
            {
              icon: Hammer,
              text: "Premium Quality Tools",
              desc: "Top brands and durable equipment",
            },
            {
              icon: Wrench,
              text: "Expert Advice",
              desc: "Professional guidance for your projects",
            },
            {
              icon: Settings,
              text: "Wide Selection",
              desc: "Thousands of products in stock",
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

        {/* Testimonial */}
        <motion.div
          className="mt-8 p-4 bg-white/5 rounded-lg border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <p className="text-orange-200/80 text-sm italic">
            "Adetech has transformed how we manage our invoicing. Fast,
            reliable, and easy to use!"
          </p>
          <div className="mt-2 flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
              JD
            </div>
            <div>
              <p className="text-white text-sm font-medium">John Doe</p>
              <p className="text-orange-200/60 text-xs">Business Owner</p>
            </div>
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

export { Login as LoginPage };
export default Login;
