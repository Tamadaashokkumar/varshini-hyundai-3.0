"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Mail,
  ArrowRight,
  CheckCircle2,
  Home,
  Sun,
  Moon,
  KeyRound,
  ChevronLeft,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";
import Image from "next/image";
// 🔥 1. Import API Client
import apiClient from "@/services/apiClient";

// --- Animations ---
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const blobAnimation = {
  animate: {
    scale: [1, 1.1, 1],
    opacity: [0.3, 0.6, 0.3],
    rotate: [0, 90, 0],
  },
  transition: { duration: 15, repeat: Infinity, ease: "linear" },
};

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Hydration fix
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage(null);

    try {
      // 🔥 2. REAL API CALL
      // Backend Endpoint: /auth/forgot-password
      const response = await apiClient.post("/auth/forgot-password", { email });

      if (response.data.success) {
        setStatus("success");
      }
    } catch (error: any) {
      setStatus("error");
      // Backend నుండి వచ్చిన ఎర్రర్ మెసేజ్ చూపించు (Ex: "User not found")
      const msg =
        error.response?.data?.message ||
        "Something went wrong. Please check your email.";
      setErrorMessage(msg);
    }
  };

  if (!mounted) return null;

  return (
    <div
      className={`min-h-screen w-full flex items-center justify-center p-4 lg:p-8 relative overflow-hidden transition-colors duration-700 font-sans ${
        isDarkMode ? "bg-[#050505] text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* ================= BACKGROUND AMBIENCE ================= */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        {isDarkMode && (
          <>
            <motion.div
              animate={blobAnimation.animate}
              transition={blobAnimation.transition}
              className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[150px]"
            />
            <motion.div
              animate={blobAnimation.animate}
              transition={{ ...blobAnimation.transition, delay: 5 }}
              className="absolute bottom-[-20%] right-[-10%] w-[700px] h-[700px] bg-indigo-600/10 rounded-full blur-[150px]"
            />
          </>
        )}
      </div>

      {/* ================= NAVBAR ================= */}
      <nav className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-50">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform">
            <span className="font-bold text-xl">V</span>
          </div>
          <span className="hidden md:block text-lg font-bold tracking-tight">
            VARSHINI <span className="text-blue-500">HYUNDAI</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2.5 rounded-full transition-all border ${
              isDarkMode
                ? "bg-white/5 border-white/10 text-yellow-400 hover:bg-white/10"
                : "bg-white border-gray-200 text-gray-600 hover:bg-gray-100 shadow-sm"
            }`}
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <Link href="/">
            <button
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all border ${
                isDarkMode
                  ? "bg-white/5 border-white/10 hover:bg-white/10"
                  : "bg-white border-gray-200 hover:bg-gray-50 shadow-sm"
              }`}
            >
              <Home size={16} /> <span className="hidden sm:inline">Home</span>
            </button>
          </Link>
        </div>
      </nav>

      {/* ================= MAIN CARD ================= */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`w-full max-w-[1000px] min-h-[600px] grid grid-cols-1 lg:grid-cols-2 rounded-[2.5rem] overflow-hidden shadow-2xl relative z-10 border transition-all duration-500 ${
          isDarkMode
            ? "bg-[#0a0a0a]/60 backdrop-blur-3xl border-white/10 shadow-black/60"
            : "bg-white/80 backdrop-blur-2xl border-white/60 shadow-blue-200/40"
        }`}
      >
        {/* ================= LEFT SIDE (IMAGE) ================= */}
        <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden group">
          {/* Dynamic Background */}
          <div
            className={`absolute inset-0 transition-colors duration-500 ${
              isDarkMode
                ? "bg-gradient-to-br from-blue-900/30 via-[#050505] to-[#050505]"
                : "bg-gradient-to-br from-blue-100 via-white to-white"
            }`}
          />

          {/* Decorative Circle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-[80px] group-hover:bg-blue-500/30 transition-colors duration-700" />

          {/* Content */}
          <div className="relative z-10">
            <div
              className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border backdrop-blur-md mb-6 ${
                isDarkMode
                  ? "bg-white/10 border-white/10 text-blue-200"
                  : "bg-white/60 border-blue-100 text-blue-800 shadow-sm"
              }`}
            >
              <ShieldCheck size={12} /> Account Recovery
            </div>
            <h2
              className={`text-5xl font-black leading-tight mb-4 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Secure Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500">
                Account.
              </span>
            </h2>
            <p
              className={`text-lg max-w-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Don't worry, we'll send you reset instructions. It happens to the
              best of us.
            </p>
          </div>

          {/* Car Image */}
          <div className="relative z-10 mt-auto flex justify-center">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <Image
                src="/images/cretapng.png"
                alt="Hyundai Creta"
                width={600}
                height={400}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-700 ease-in-out"
                priority
              />
            </motion.div>
          </div>
        </div>

        {/* ================= RIGHT SIDE (FORM) ================= */}
        <div
          className={`flex flex-col justify-center p-8 lg:p-12 transition-colors duration-500 ${
            isDarkMode ? "bg-transparent" : "bg-white/50"
          }`}
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="max-w-md w-full mx-auto"
          >
            <AnimatePresence mode="wait">
              {status === "success" ? (
                // ✅ SUCCESS STATE
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="text-center"
                >
                  <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/20">
                    <CheckCircle2 size={40} className="text-green-500" />
                  </div>
                  <h2
                    className={`text-3xl font-bold mb-3 ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Check your inbox
                  </h2>
                  <p
                    className={`text-sm mb-8 ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    We have sent password reset instructions to <br />
                    <span className="text-blue-500 font-semibold">{email}</span>
                  </p>
                  <Link href="/login">
                    <button className="w-full bg-white/10 hover:bg-white/15 border border-white/10 text-white font-bold py-3.5 rounded-xl transition-all">
                      Back to Login
                    </button>
                  </Link>
                </motion.div>
              ) : (
                // 📝 FORM STATE
                <motion.div key="form" exit={{ opacity: 0, y: -20 }}>
                  {/* Header */}
                  <motion.div
                    variants={itemVariants}
                    className="mb-8 text-center lg:text-left"
                  >
                    <Link
                      href="/login"
                      className="inline-flex items-center gap-1 text-xs font-bold text-blue-500 hover:text-blue-400 mb-6 transition-colors uppercase tracking-wide"
                    >
                      <ChevronLeft size={14} /> Back to Login
                    </Link>
                    <div className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/30 mb-6 lg:hidden mx-auto">
                      <KeyRound size={28} strokeWidth={1.5} />
                    </div>
                    <h1
                      className={`text-3xl font-bold mb-3 ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Forgot Password?
                    </h1>
                    <p
                      className={`${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Enter your email to reset your password.
                    </p>
                  </motion.div>

                  {/* Error Message */}
                  {status === "error" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-center gap-3"
                    >
                      <AlertCircle className="shrink-0" size={18} />
                      {errorMessage}
                    </motion.div>
                  )}

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <motion.div variants={itemVariants}>
                      <label
                        className={`block text-xs font-bold uppercase tracking-wider mb-2 ml-1 ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Registered Email
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Mail
                            className={`h-5 w-5 transition-colors ${
                              isDarkMode
                                ? "text-gray-500 group-focus-within:text-blue-400"
                                : "text-gray-400 group-focus-within:text-blue-500"
                            }`}
                          />
                        </div>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          placeholder="name@example.com"
                          className={`block w-full pl-11 pr-4 py-3.5 rounded-xl border-2 outline-none transition-all duration-300 font-medium ${
                            isDarkMode
                              ? "bg-white/5 border-white/5 text-white placeholder-gray-600 focus:bg-white/10 focus:border-blue-500/50"
                              : "bg-gray-50 border-gray-100 text-gray-900 placeholder-gray-400 focus:bg-white focus:border-blue-500"
                          }`}
                        />
                      </div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="pt-2">
                      <button
                        type="submit"
                        disabled={status === "loading"}
                        className="w-full relative group overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/30 transition-all duration-300 transform active:scale-[0.98]"
                      >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          {status === "loading" ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <>
                              Send Instructions <ArrowRight size={18} />
                            </>
                          )}
                        </span>
                        {/* Glow Effect */}
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                      </button>
                    </motion.div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.div>

      {/* Footer Links */}
      <div
        className={`absolute bottom-4 left-0 w-full text-center text-[10px] uppercase tracking-widest font-medium opacity-50 ${
          isDarkMode ? "text-white" : "text-gray-900"
        }`}
      >
        <Link
          href="/privacy"
          className="mx-2 hover:opacity-100 cursor-pointer transition-opacity"
        >
          Privacy Policy
        </Link>{" "}
        •
        <Link
          href="/terms"
          className="mx-2 hover:opacity-100 cursor-pointer transition-opacity"
        >
          Terms of Service
        </Link>
      </div>
    </div>
  );
}
