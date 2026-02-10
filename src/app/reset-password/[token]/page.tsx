"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import {
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  ShieldCheck,
  Sun,
  Moon,
  Sparkles,
} from "lucide-react";
import apiClient from "@/services/apiClient";
import { toast } from "sonner";

// --- Animations ---
const containerVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const backgroundGradient = {
  animate: {
    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
  },
  transition: {
    duration: 15,
    repeat: Infinity,
    ease: "linear",
  },
};

export default function ResetPasswordPage() {
  // --- Same Logic State ---
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [mounted, setMounted] = useState(false);

  const router = useRouter();
  const params = useParams();
  const token = params.token;

  useEffect(() => {
    setMounted(true);
  }, []);

  // --- Same Logic Handler ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // 1. Validation
    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setStatus("loading");

    try {
      // 2. API CALL
      const response = await apiClient.patch(`/auth/reset-password/${token}`, {
        password: password,
      });

      if (response.data.success) {
        setStatus("success");
        toast.success("Password reset successfully! Redirecting...");

        // 3. Redirect
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      }
    } catch (error: any) {
      setStatus("error");
      const msg = error.response?.data?.message || "Token invalid or expired.";
      setErrorMessage(msg);
    }
  };

  if (!mounted) return null;

  return (
    <div
      className={`min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden font-sans transition-colors duration-500 ${
        isDarkMode ? "bg-neutral-950 text-white" : "bg-slate-50 text-slate-900"
      }`}
    >
      {/* --- Premium Background Effects --- */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Grid Pattern */}
        <div
          className={`absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20`}
        ></div>
        <div
          className={`absolute inset-0 opacity-[0.4]`}
          style={{
            backgroundImage: `linear-gradient(${
              isDarkMode ? "#333" : "#e5e7eb"
            } 1px, transparent 1px), linear-gradient(90deg, ${
              isDarkMode ? "#333" : "#e5e7eb"
            } 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        ></div>

        {/* Animated Orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 50, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/30 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, -50, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/30 rounded-full blur-[120px]"
        />
      </div>

      {/* --- Theme Toggle --- */}
      <motion.button
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsDarkMode(!isDarkMode)}
        className={`absolute top-6 right-6 z-50 p-3 rounded-full shadow-lg backdrop-blur-md border transition-all ${
          isDarkMode
            ? "bg-white/10 border-white/20 text-yellow-400 hover:bg-white/20"
            : "bg-white/80 border-slate-200 text-slate-700 hover:bg-white"
        }`}
      >
        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
      </motion.button>

      {/* --- Main Glass Card --- */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className={`w-full max-w-[480px] rounded-3xl relative z-10 transition-all duration-500 overflow-hidden ${
          isDarkMode
            ? "bg-neutral-900/60 backdrop-blur-2xl border border-white/10 shadow-[0_0_40px_-10px_rgba(0,0,0,0.7)]"
            : "bg-white/70 backdrop-blur-2xl border border-white/60 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)]"
        }`}
      >
        {/* Top Decorative Line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

        <div className="p-8 md:p-10">
          {/* SUCCESS STATE UI */}
          <AnimatePresence mode="wait">
            {status === "success" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center justify-center text-center py-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="w-24 h-24 bg-gradient-to-tr from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 mb-6"
                >
                  <CheckCircle2 size={48} className="text-white" />
                </motion.div>
                <h2
                  className={`text-3xl font-bold mb-3 ${
                    isDarkMode ? "text-white" : "text-slate-800"
                  }`}
                >
                  All Set!
                </h2>
                <p
                  className={`text-base max-w-xs mx-auto mb-8 ${
                    isDarkMode ? "text-neutral-400" : "text-slate-500"
                  }`}
                >
                  Your password has been securely updated. Redirecting you to
                  login...
                </p>
                <div className="flex items-center gap-2 text-sm font-medium text-blue-500">
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  Redirecting...
                </div>
              </motion.div>
            ) : (
              // FORM STATE UI
              <motion.div key="form" exit={{ opacity: 0, y: -20 }}>
                {/* Header */}
                <div className="text-center mb-10">
                  <motion.div
                    initial={{ rotate: -10, scale: 0.8 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ type: "spring", duration: 0.8 }}
                    className={`w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center shadow-xl ${
                      isDarkMode
                        ? "bg-gradient-to-br from-neutral-800 to-neutral-700 border border-white/10"
                        : "bg-white border border-slate-100 shadow-blue-100"
                    }`}
                  >
                    <KeyRound
                      size={32}
                      className="text-blue-500 drop-shadow-md"
                    />
                  </motion.div>
                  <h1
                    className={`text-3xl font-bold mb-3 tracking-tight ${
                      isDarkMode ? "text-white" : "text-slate-900"
                    }`}
                  >
                    Reset Password
                  </h1>
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-neutral-400" : "text-slate-500"
                    }`}
                  >
                    Choose a strong password to secure your account.
                  </p>
                </div>

                {/* Error Message */}
                <AnimatePresence>
                  {status === "error" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-6 overflow-hidden"
                    >
                      <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium flex items-center gap-3">
                        <AlertCircle size={18} />
                        {errorMessage}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* New Password Input */}
                  <motion.div variants={itemVariants} className="group">
                    <label
                      className={`block text-xs font-semibold uppercase tracking-wider mb-2 ml-1 ${
                        isDarkMode ? "text-neutral-500" : "text-slate-500"
                      }`}
                    >
                      New Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock
                          size={18}
                          className={`transition-colors duration-300 ${
                            isDarkMode
                              ? "text-neutral-500 group-focus-within:text-blue-400"
                              : "text-slate-400 group-focus-within:text-blue-500"
                          }`}
                        />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="••••••••"
                        className={`w-full pl-11 pr-4 py-4 rounded-xl border-2 outline-none font-medium transition-all duration-300 ${
                          isDarkMode
                            ? "bg-neutral-800/50 border-neutral-700 text-white placeholder-neutral-600 focus:border-blue-500/50 focus:bg-neutral-800 focus:shadow-[0_0_20px_rgba(59,130,246,0.15)]"
                            : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:shadow-[0_0_20px_rgba(59,130,246,0.1)]"
                        }`}
                      />
                    </div>
                  </motion.div>

                  {/* Confirm Password Input */}
                  <motion.div variants={itemVariants} className="group">
                    <label
                      className={`block text-xs font-semibold uppercase tracking-wider mb-2 ml-1 ${
                        isDarkMode ? "text-neutral-500" : "text-slate-500"
                      }`}
                    >
                      Confirm Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <ShieldCheck
                          size={18}
                          className={`transition-colors duration-300 ${
                            isDarkMode
                              ? "text-neutral-500 group-focus-within:text-blue-400"
                              : "text-slate-400 group-focus-within:text-blue-500"
                          }`}
                        />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        placeholder="••••••••"
                        className={`w-full pl-11 pr-12 py-4 rounded-xl border-2 outline-none font-medium transition-all duration-300 ${
                          isDarkMode
                            ? "bg-neutral-800/50 border-neutral-700 text-white placeholder-neutral-600 focus:border-blue-500/50 focus:bg-neutral-800 focus:shadow-[0_0_20px_rgba(59,130,246,0.15)]"
                            : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:shadow-[0_0_20px_rgba(59,130,246,0.1)]"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={`absolute inset-y-0 right-0 pr-4 flex items-center transition-colors cursor-pointer ${
                          isDarkMode
                            ? "text-neutral-500 hover:text-white"
                            : "text-slate-400 hover:text-slate-700"
                        }`}
                      >
                        {showPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                  </motion.div>

                  {/* Submit Button */}
                  <motion.div variants={itemVariants} className="pt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={status === "loading"}
                      className={`relative w-full overflow-hidden rounded-xl font-bold text-lg py-4 shadow-xl transition-all ${
                        status === "loading"
                          ? "cursor-not-allowed opacity-80"
                          : "hover:shadow-blue-500/25"
                      } bg-gradient-to-r from-blue-600 to-indigo-600 text-white border border-white/10`}
                    >
                      {/* Button Shine Effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] animate-[shimmer_2s_infinite]" />

                      <div className="flex items-center justify-center gap-2 relative z-10">
                        {status === "loading" ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            Reset Password <ArrowRight size={20} />
                          </>
                        )}
                      </div>
                    </motion.button>
                  </motion.div>
                </form>

                {/* Footer Links */}
                <motion.div
                  variants={itemVariants}
                  className="mt-8 text-center"
                >
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-neutral-500" : "text-slate-400"
                    }`}
                  >
                    Remember your password?{" "}
                    <span
                      onClick={() => router.push("/login")}
                      className="text-blue-500 hover:text-blue-400 font-medium cursor-pointer hover:underline transition-all"
                    >
                      Login here
                    </span>
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Tailwind Custom Animation Style (Add this to your globals.css if needed, or inline here for functionality) */}
      <style jsx global>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}
