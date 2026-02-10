"use client";

import { motion } from "framer-motion";
import {
  Users,
  PackageCheck,
  Headphones,
  Globe,
  ArrowUpRight,
} from "lucide-react";

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // Stagger effect for children
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 50, damping: 20 },
  },
};

export function WhyChooseUs() {
  return (
    <section className="py-24 relative overflow-hidden bg-slate-50 dark:bg-[#020617]">
      {/* 🌌 Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/5 dark:bg-blue-600/10 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/5 dark:bg-cyan-500/10 rounded-full blur-[120px] -translate-x-1/3 translate-y-1/3" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-cyan-600 dark:text-cyan-400 font-bold tracking-widest uppercase text-xs mb-3 block">
              Authorized Distributor
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-6">
              Why{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                Varshini Spares?
              </span>
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
              We don't just sell parts; we deliver reliability. Experience the
              difference of genuine Hyundai Mobis components backed by expert
              support.
            </p>
          </motion.div>
        </div>

        {/* Bento Grid Layout */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <StatsCard
            icon={<PackageCheck size={28} />}
            number="50k+"
            label="Genuine Parts"
            desc="Directly sourced from Hyundai Mobis inventory with authenticity guarantee."
            accentColor="blue"
          />
          <StatsCard
            icon={<Users size={28} />}
            number="12k+"
            label="Happy Customers"
            desc="Trusted by mechanics, service centers & car owners across India."
            accentColor="cyan"
          />
          <StatsCard
            icon={<Globe size={28} />}
            number="250+"
            label="Cities Covered"
            desc="Lightning fast shipping network covering every corner of the country."
            accentColor="violet"
          />
          <StatsCard
            icon={<Headphones size={28} />}
            number="24/7"
            label="Expert Support"
            desc="Get technical assistance finding the right part via WhatsApp or Call."
            accentColor="emerald"
          />
        </motion.div>
      </div>
    </section>
  );
}

// ✨ Premium Stats Card Component
function StatsCard({ icon, number, label, desc, accentColor }: any) {
  // Dynamic Color Classes based on prop
  const colorMap: any = {
    blue: "from-blue-500 to-indigo-600 shadow-blue-500/20",
    cyan: "from-cyan-500 to-teal-500 shadow-cyan-500/20",
    violet: "from-violet-500 to-purple-600 shadow-violet-500/20",
    emerald: "from-emerald-500 to-green-600 shadow-emerald-500/20",
  };

  const bgHoverMap: any = {
    blue: "group-hover:border-blue-500/30 dark:group-hover:border-blue-400/30",
    cyan: "group-hover:border-cyan-500/30 dark:group-hover:border-cyan-400/30",
    violet:
      "group-hover:border-violet-500/30 dark:group-hover:border-violet-400/30",
    emerald:
      "group-hover:border-emerald-500/30 dark:group-hover:border-emerald-400/30",
  };

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -10 }}
      className={`group relative p-8 bg-white dark:bg-[#0a0a0f] border border-slate-200 dark:border-white/5 rounded-[2rem] shadow-xl dark:shadow-none overflow-hidden transition-all duration-500 ${bgHoverMap[accentColor]}`}
    >
      {/* Hover Gradient Overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${colorMap[accentColor]} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
      />

      {/* Top Decoration */}
      <div className="flex justify-between items-start mb-8">
        <div
          className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${colorMap[accentColor]} flex items-center justify-center text-white shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}
        >
          {icon}
        </div>
        <ArrowUpRight className="text-slate-300 dark:text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <h3 className="text-4xl font-black text-slate-900 dark:text-white mb-2 tracking-tight group-hover:scale-105 origin-left transition-transform duration-300">
          {number}
        </h3>
        <h4
          className={`text-lg font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r ${colorMap[accentColor]}`}
        >
          {label}
        </h4>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
          {desc}
        </p>
      </div>

      {/* Decorative Blob */}
      <div
        className={`absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br ${colorMap[accentColor]} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity duration-500`}
      />
    </motion.div>
  );
}
