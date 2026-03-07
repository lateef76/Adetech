import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  ArrowLeft,
  Shield,
  Hammer,
  Wrench,
  Settings,
  HardHat,
  Lock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Send,
  Inbox,
} from "lucide-react";

// Generate particles once at module level to avoid render-time random generation
const PARTICLES = [...Array(20)].map((_, i) => ({
  id: i,
  x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 800),
  y: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 600),
  duration: 3 + Math.random() * 2,
  delay: Math.random() * 2,
}));

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (email.includes("@") && email.includes(".")) {
        setIsSubmitted(true);
      } else {
        setError("Please enter a valid email address");
      }
      setIsLoading(false);
    }, 1500);
  };

  const handleResendEmail = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  // Floating animation for background elements
  const floatingIcons = [
    { Icon: Hammer, delay: 0, duration: 3, x: 20, y: 30 },
    { Icon: Wrench, delay: 1, duration: 4, x: -15, y: 20 },
    { Icon: Settings, delay: 2, duration: 3.5, x: 25, y: -25 },
    { Icon: HardHat, delay: 1.5, duration: 4.5, x: -20, y: -15 },
    { Icon: Lock, delay: 2.5, duration: 4, x: 30, y: -20 },
  ];

  return (
    <div className="min-h-screen w-full flex overflow-hidden relative bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Animated background with invoice app theme */}
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
              top: `${15 + index * 12}%`,
              left: `${5 + index * 10}%`,
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
      <div className="relative w-full flex items-center justify-center lg:justify-end px-4 sm:px-6 lg:px-8">
        {/* Decorative line */}
        <motion.div
          className="absolute left-0 top-0 bottom-0 w-1 bg-linear-to-b from-orange-500 via-orange-400 to-orange-500"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "100%", opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        />

        {/* Forgot password container */}
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Back to login link */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.a
              href="/login"
              className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 transition-colors group"
              whileHover={{ x: -5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <ArrowLeft
                size={18}
                className="group-hover:-translate-x-1 transition-transform"
              />
              <span>Back to Login</span>
            </motion.a>
          </motion.div>

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
            <p className="text-orange-200/80 text-lg">Reset Your Password</p>
          </motion.div>

          {/* Forgot password card */}
          <motion.div
            className="backdrop-blur-xl bg-white/10 rounded-2xl p-8 shadow-2xl border border-white/20"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            whileHover={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" }}
          >
            {!isSubmitted ? (
              /* Email Input Form */
              <>
                <motion.div
                  className="text-center mb-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <motion.div
                    className="w-20 h-20 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4"
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                  >
                    <Lock className="text-orange-500" size={32} />
                  </motion.div>
                  <h2 className="text-2xl font-semibold text-white mb-2">
                    Forgot Password?
                  </h2>
                  <p className="text-orange-200/70 text-sm">
                    No worries! Enter your email address and we'll send you a
                    link to reset your password.
                  </p>
                </motion.div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email field */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
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
                        className={`w-full bg-white/5 border ${
                          error ? "border-red-500/50" : "border-white/10"
                        } rounded-lg py-3 px-11 text-white placeholder-orange-200/50 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 hover:bg-white/10`}
                        placeholder="Enter your email address"
                        required
                      />
                      {error && (
                        <motion.div
                          className="absolute right-3 top-1/2 transform -translate-y-1/2"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                        >
                          <AlertCircle className="text-red-500" size={18} />
                        </motion.div>
                      )}
                    </div>
                    {error && (
                      <motion.p
                        className="text-red-400 text-xs mt-1 text-right"
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        {error}
                      </motion.p>
                    )}
                  </motion.div>

                  {/* Submit button */}
                  <motion.button
                    type="submit"
                    className="w-full relative overflow-hidden group bg-linear-to-r from-orange-500 to-orange-600 text-white py-3 px-4 rounded-lg font-medium shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isLoading}
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
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <Send
                            size={18}
                            className="group-hover:translate-x-1 transition-transform"
                          />
                          <span>Send Reset Link</span>
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

                  {/* Security note */}
                  <motion.p
                    className="text-center text-orange-200/50 text-xs flex items-center justify-center gap-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 }}
                  >
                    <Shield size={12} />
                    We'll never share your email with anyone else
                  </motion.p>
                </form>
              </>
            ) : (
              /* Success Message */
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-4"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle size={48} className="text-white" />
                </motion.div>

                <h2 className="text-2xl font-bold text-white mb-3">
                  Check Your Email
                </h2>
                <p className="text-orange-200/70 mb-6">
                  We've sent a password reset link to:
                </p>
                <p className="text-orange-400 font-medium text-lg mb-4 bg-white/5 py-2 px-4 rounded-lg inline-block">
                  {email}
                </p>
                <p className="text-orange-200/60 text-sm mb-8">
                  The link will expire in 30 minutes for security reasons.
                </p>

                <div className="space-y-4">
                  <motion.button
                    onClick={handleResendEmail}
                    className="w-full relative overflow-hidden group bg-white/5 hover:bg-white/10 border border-white/10 text-white py-3 px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <motion.div
                        className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                    ) : (
                      <>
                        <RefreshCw
                          size={18}
                          className="group-hover:rotate-180 transition-transform duration-500"
                        />
                        <span>Resend Email</span>
                      </>
                    )}
                  </motion.button>

                  <motion.a
                    href="/login"
                    className="block w-full text-center relative overflow-hidden group bg-white/5 hover:bg-white/10 border border-white/10 text-orange-400 hover:text-orange-300 py-3 px-4 rounded-lg font-medium transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="relative z-10">← Back to Login</span>
                  </motion.a>
                </div>

                {/* Email tips */}
                <div className="mt-8 p-4 bg-white/5 rounded-lg border border-white/10 text-left">
                  <h3 className="text-white font-medium mb-2 text-sm flex items-center gap-2">
                    <Inbox size={16} className="text-orange-400" />
                    Didn't receive the email?
                  </h3>
                  <ul className="text-orange-200/60 text-xs space-y-2 list-disc list-inside">
                    <li>Check your spam or junk folder</li>
                    <li>Make sure you entered the correct email address</li>
                    <li>Wait a few minutes and try resending</li>
                    <li>Contact support if the problem persists</li>
                  </ul>
                </div>
              </motion.div>
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
            transition={{ delay: 1.0 }}
          >
            {["Secure", "Encrypted", "24/7 Support"].map((text) => (
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
        <h3 className="text-orange-500 text-xl font-bold mb-6">Need Help?</h3>
        <div className="space-y-6">
          {[
            {
              icon: Shield,
              text: "Account Security",
              desc: "Your data is protected with encryption",
            },
            {
              icon: RefreshCw,
              text: "Quick Recovery",
              desc: "Reset your password in minutes",
            },
            {
              icon: Mail,
              text: "Email Support",
              desc: "24/7 customer assistance",
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

        {/* Contact support */}
        <motion.div
          className="mt-8 p-4 bg-white/5 rounded-lg border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <p className="text-orange-200/80 text-sm text-center">
            Still having trouble?{" "}
            <a
              href="#"
              className="text-orange-400 hover:text-orange-300 font-medium"
            >
              Contact Support
            </a>
          </p>
        </motion.div>

        {/* Quick tips */}
        <motion.div
          className="mt-6 text-xs text-orange-200/40 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
        >
          <p>Password must be at least 8 characters</p>
          <p className="mt-1">
            Include numbers and special characters for security
          </p>
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

export { ForgotPassword as ForgotPasswordPage };
export default ForgotPassword;
