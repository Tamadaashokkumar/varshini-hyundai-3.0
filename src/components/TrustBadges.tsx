"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Truck, RefreshCcw, HeadphonesIcon } from "lucide-react";

// ట్రస్ట్ ఫీచర్స్ డేటా
const features = [
  {
    icon: ShieldCheck,
    title: "100% Genuine Parts",
    description: "Authentic Hyundai Mobis spares",
    iconColor: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-100 dark:bg-blue-500/20",
    borderColor: "group-hover:border-blue-500/50",
  },
  {
    icon: Truck,
    title: "Express Delivery",
    description: "Fast & secure shipping across India",
    iconColor: "text-pink-600 dark:text-pink-400",
    bgColor: "bg-pink-100 dark:bg-pink-500/20",
    borderColor: "group-hover:border-pink-500/50",
  },
  {
    icon: RefreshCcw,
    title: "Easy Returns",
    description: "7-day hassle-free return policy",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-100 dark:bg-emerald-500/20",
    borderColor: "group-hover:border-emerald-500/50",
  },
  {
    icon: HeadphonesIcon,
    title: "Expert Support",
    description: "24/7 dedicated technical assistance",
    iconColor: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-100 dark:bg-amber-500/20",
    borderColor: "group-hover:border-amber-500/50",
  },
];

// యానిమేషన్ వేరియంట్స్ (ఒకదాని తర్వాత ఒకటి రావడానికి)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15, // ఒక్కో కార్డుకి మధ్య గ్యాప్
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

export const TrustBadges = () => {
  return (
    // 🔥 -mt-12 లేదా -mt-16 వాడటం వల్ల వీడియో పైకి కొద్దిగా చొచ్చుకుని వచ్చి చాలా ప్రీమియం గా కనిపిస్తుంది
    <section className="relative z-30 -mt-10 sm:-mt-16 mb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
      >
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ y: -5 }} // హోవర్ చేసినప్పుడు కొంచెం పైకి లేస్తుంది
              className={`group relative bg-white/80 dark:bg-[#1a0b2e]/90 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-5 sm:p-6 shadow-xl shadow-black/5 dark:shadow-black/40 overflow-hidden transition-all duration-300 ${feature.borderColor}`}
            >
              {/* హోవర్ చేసినప్పుడు వచ్చే లైట్ గ్లో ఎఫెక్ట్ */}
              <div className="absolute -inset-2 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />

              <div className="flex items-center gap-4 relative z-10">
                {/* ఐకాన్ బాక్స్ */}
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 ${feature.bgColor} ${feature.iconColor}`}
                >
                  <Icon size={24} strokeWidth={2.5} />
                </div>

                {/* టెక్స్ట్ */}
                <div>
                  <h4 className="font-extrabold text-sm sm:text-base text-gray-900 dark:text-white leading-tight mb-1">
                    {feature.title}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 font-medium leading-snug">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* షిమ్మర్ యానిమేషన్ కోసం CSS */}
      <style jsx global>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </section>
  );
};
