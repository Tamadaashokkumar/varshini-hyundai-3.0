"use client";

import { useAuth } from "@/hooks/useAuth"; // మీ useAuth హుక్
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Car } from "lucide-react";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { checkAuthStatus } = useAuth();

  // UI State: స్ప్లాష్ స్క్రీన్ చూపించాలా వద్దా?
  const [showSplashScreen, setShowSplashScreen] = useState(true);

  // React Strict Mode లో డబుల్ కాల్ అవ్వకుండా Ref
  const initRef = useRef(false);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    const initApp = async () => {
      const startTime = Date.now();

      try {
        // 1. Backend Session Check (Cookies)
        await checkAuthStatus();
      } catch (error) {
        console.error("Auth Check Failed:", error);
      } finally {
        // 2. Calculate Remaining Time
        // కనీసం 800ms పాటు లోడింగ్ స్క్రీన్ కనిపించాలి (Smoothness కోసం)
        const elapsedTime = Date.now() - startTime;
        const minLoadingTime = 800; // 0.8 seconds
        const remainingTime = Math.max(0, minLoadingTime - elapsedTime);

        setTimeout(() => {
          setShowSplashScreen(false);
        }, remainingTime);
      }
    };

    initApp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Animation Settings (Same as your code) ---
  const spinTransition = {
    repeat: Infinity,
    ease: "linear",
    duration: 2,
  };

  const pulseTransition = {
    repeat: Infinity,
    repeatType: "reverse" as const,
    ease: "easeInOut",
    duration: 1.5,
  };

  return (
    <>
      <AnimatePresence>
        {showSplashScreen && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }} // Smooth fade out
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white dark:bg-[#050B14] overflow-hidden"
          >
            {/* --- Ambient Glow --- */}
            <motion.div
              initial={{ opacity: 0.3, scale: 0.8 }}
              animate={{ opacity: 0.6, scale: 1.2 }}
              transition={pulseTransition}
              className="absolute h-96 w-96 rounded-full bg-blue-100 dark:bg-blue-700/10 blur-[120px]"
            />

            <div className="relative flex flex-col items-center justify-center gap-10 z-10">
              {/* --- Brand Name --- */}
              <div className="text-center space-y-2">
                <motion.h1
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-2xl md:text-3xl font-bold tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-blue-900 via-blue-600 to-blue-900 dark:from-blue-400 dark:via-white dark:to-blue-400 font-sans uppercase"
                >
                  VARSHINI HYUNDAI
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="text-xs font-medium tracking-[0.5em] uppercase text-blue-800/70 dark:text-blue-400/80"
                >
                  Loading Experience...
                </motion.p>
              </div>

              {/* --- The Spinner Animation --- */}
              <div className="relative h-24 w-24 mt-4">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={spinTransition}
                  className="absolute inset-0 box-border rounded-full border-[3px] border-t-blue-600 border-r-transparent border-b-blue-100 border-l-transparent dark:border-t-blue-500 dark:border-b-blue-500/30 dark:shadow-[0_0_20px_rgba(59,130,246,0.2)]"
                />
                <motion.span
                  animate={{ rotate: -360 }}
                  transition={{ ...spinTransition, duration: 1.5 }}
                  className="absolute inset-4 box-border rounded-full border-[3px] border-t-transparent border-r-cyan-500 border-b-transparent border-l-cyan-200 dark:border-r-cyan-400 dark:border-l-cyan-400/50"
                />
                <motion.div
                  animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
                  transition={pulseTransition}
                  className="absolute inset-0 m-auto h-10 w-10 flex items-center justify-center rounded-full bg-white dark:bg-gradient-to-tr dark:from-blue-900 dark:to-[#050B14] border border-blue-100 dark:border-blue-500/30 shadow-inner"
                >
                  <Car size={18} className="text-blue-700 dark:text-blue-400" />
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Loads Here */}
      {!showSplashScreen && children}
    </>
  );
}
