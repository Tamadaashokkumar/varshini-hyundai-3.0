"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

// Animation Settings
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

const dotTransition = {
  repeat: Infinity,
  repeatType: "reverse" as const,
  duration: 0.6,
  ease: "easeInOut",
};

export default function Loading() {
  const pathname = usePathname();

  const getLoadingText = (path: string | null) => {
    if (!path) return "Initializing System...";
    if (path.includes("/products") || path.includes("/shop"))
      return "Fetching Genuine Spares...";
    if (path.includes("/cart")) return "Reviewing Your Cart...";
    if (path.includes("/checkout")) return "Securing Payment Environment...";
    if (path.includes("/orders")) return "Retrieving Order History...";
    if (path.includes("/admin")) return "Accessing Admin Dashboard...";
    if (path.includes("/auth") || path.includes("/login"))
      return "Verifying Credentials...";
    return "Welcome to Varshini Hyundai...";
  };

  const loadingText = getLoadingText(pathname);

  return (
    // 1. Dynamic Background: White in Light Mode, Dark Blue/Black in Dark Mode
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white dark:bg-[#050B14] overflow-hidden transition-colors duration-300">
      {/* --- 2. Ambient Glow (Subtle Blue) --- */}
      <motion.div
        initial={{ opacity: 0.3, scale: 0.8 }}
        animate={{ opacity: 0.6, scale: 1.2 }}
        transition={pulseTransition}
        className="absolute h-96 w-96 rounded-full bg-blue-100 dark:bg-blue-700/10 blur-[120px]"
      />

      <div className="relative flex flex-col items-center justify-center gap-10 z-10">
        {/* --- 3. Brand Name --- */}
        <div className="text-center space-y-2">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            // Gradient Text: Dark Blue in Light Mode, White/Blue in Dark Mode
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
            Premium Spares
          </motion.p>
        </div>

        {/* --- 4. The Spinner Animation --- */}
        <div className="relative h-28 w-28 mt-4">
          {/* Outer Ring */}
          <motion.span
            animate={{ rotate: 360 }}
            transition={spinTransition}
            // Borders updated for visibility in both modes
            className="absolute inset-0 box-border rounded-full border-[3px] border-t-blue-600 border-r-transparent border-b-blue-100 border-l-transparent dark:border-t-blue-500 dark:border-b-blue-500/30 dark:shadow-[0_0_20px_rgba(59,130,246,0.2)]"
          />

          {/* Inner Ring (Counter Rotation) */}
          <motion.span
            animate={{ rotate: -360 }}
            transition={{ ...spinTransition, duration: 1.5 }}
            className="absolute inset-4 box-border rounded-full border-[3px] border-t-transparent border-r-cyan-500 border-b-transparent border-l-cyan-200 dark:border-r-cyan-400 dark:border-l-cyan-400/50"
          />

          {/* Center Logo/Icon */}
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
            transition={pulseTransition}
            className="absolute inset-0 m-auto h-12 w-12 flex items-center justify-center rounded-full bg-white dark:bg-gradient-to-tr dark:from-blue-900 dark:to-[#050B14] border border-blue-100 dark:border-blue-500/30 shadow-inner"
          >
            <div className="h-6 w-6 rounded-sm bg-blue-600/20 dark:bg-blue-500/20 rotate-45 border border-blue-600 dark:border-blue-400 blur-[1px]" />
          </motion.div>
        </div>

        {/* --- 5. Dynamic Loading Text --- */}
        <div className="flex flex-col items-center">
          <div className="flex items-center text-lg md:text-xl font-light tracking-wider font-mono text-gray-700 dark:text-gray-200">
            <span>{loadingText}</span>
            <motion.span
              className="ml-1 flex items-center gap-1"
              initial="start"
              animate="end"
            >
              {[0, 1, 2].map((index) => (
                <motion.span
                  key={index}
                  className="h-1 w-1 rounded-full bg-blue-600 dark:bg-cyan-400"
                  variants={{
                    start: { y: 0, opacity: 0.5 },
                    end: { y: -5, opacity: 1 },
                  }}
                  transition={{
                    ...dotTransition,
                    delay: index * 0.15,
                  }}
                />
              ))}
            </motion.span>
          </div>

          {/* Status Line */}
          <motion.div
            className="mt-2 h-[2px] w-24 bg-gradient-to-r from-transparent via-blue-600 dark:via-blue-500 to-transparent"
            animate={{ scaleX: [0.5, 1.5, 0.5], opacity: [0.5, 1, 0.5] }}
            transition={pulseTransition}
          />
        </div>
      </div>
    </div>
  );
}
