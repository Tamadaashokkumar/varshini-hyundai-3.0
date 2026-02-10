"use client";

import { useState, useEffect } from "react"; // Added imports
import { motion, AnimatePresence } from "framer-motion"; // Added AnimatePresence
import Link from "next/link";
import {
  Wrench,
  Car,
  Zap,
  Disc,
  Settings,
  Wind,
  Sparkles,
  ArrowRight,
  Layers,
  Thermometer,
  Cpu,
  CircleDashed,
} from "lucide-react";


const categories = [
  {
    id: "Engine",
    name: "Engine Parts",
    icon: Settings,
    description: "Pistons, filters, and core engine components",
    gradient: "from-orange-500 to-red-500",
    shadow: "group-hover:shadow-orange-500/20",
    bg: "bg-orange-500/10",
  },
  {
    id: "Body",
    name: "Body Parts",
    icon: Car,
    description: "Bumpers, mirrors, hoods, and panels",
    gradient: "from-blue-500 to-indigo-600",
    shadow: "group-hover:shadow-blue-500/20",
    bg: "bg-blue-500/10",
  },
  {
    id: "Brake",
    name: "Brake System",
    icon: Disc,
    description: "Pads, discs, calipers, and fluids",
    gradient: "from-red-500 to-rose-600",
    shadow: "group-hover:shadow-red-500/20",
    bg: "bg-red-500/10",
  },
  {
    id: "Electrical",
    name: "Electrical",
    icon: Zap, 
    description: "Lights, batteries, sensors, and wiring",
    gradient: "from-yellow-400 to-amber-500",
    shadow: "group-hover:shadow-yellow-500/20",
    bg: "bg-yellow-500/10",
  },
  {
    id: "Suspension",
    name: "Suspension",
    icon: CircleDashed, 
    description: "Shocks, struts, and steering parts",
    gradient: "from-emerald-400 to-green-600",
    shadow: "group-hover:shadow-green-500/20",
    bg: "bg-green-500/10",
  },
  {
    id: "Transmission",
    name: "Transmission",
    icon: Wrench,
    description: "Clutch kits, gears, and fluids",
    gradient: "from-zinc-500 to-slate-700",
    shadow: "group-hover:shadow-gray-500/20",
    bg: "bg-gray-500/10",
  },
  {
    id: "AC",
    name: "AC & Cooling",
    icon: Wind, 
    description: "Compressors, radiators, and fans",
    gradient: "from-cyan-400 to-blue-500",
    shadow: "group-hover:shadow-cyan-500/20",
    bg: "bg-cyan-500/10",
  },
  {
    id: "Accessories",
    name: "Accessories",
    icon: Sparkles,
    description: "Floor mats, covers, and upgrades",
    gradient: "from-purple-500 to-fuchsia-600",
    shadow: "group-hover:shadow-purple-500/20",
    bg: "bg-purple-500/10",
  },
];

export default function CategoriesIndexPage() {
  return (
    <>
      {/* --- EXISTING CODE STARTS HERE --- */}
      <div className="min-h-screen bg-gray-50 dark:bg-[#030712] text-gray-900 dark:text-white p-6 md:p-12 pt-[100px] md:pt-[120px] transition-colors duration-500 overflow-hidden relative">
        {/* 🌌 Background Ambience */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/5 dark:bg-blue-600/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/5 dark:bg-purple-600/10 rounded-full blur-[120px]"></div>
        </div>

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 relative z-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-md mb-4 shadow-sm">
            <Layers size={14} className="text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-gray-600 dark:text-gray-300">
              Catalog
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight">
            Browse by{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
              Category
            </span>
          </h1>

          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Explore our extensive collection of genuine Hyundai spare parts.
            Select a category below to filter parts specific to your vehicle's
            needs.
          </p>
        </motion.div>

        {/* Grid Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto relative z-10">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
            >
              <Link
                href={`/categories/${category.id}`}
                className="block h-full"
              >
                <motion.div
                  whileHover={{ y: -8 }}
                  whileTap={{ scale: 0.98 }}
                  className={`group h-full relative overflow-hidden rounded-[2rem] p-1 transition-all duration-300`}
                >
                  {/* Gradient Border on Hover (Hidden by default) */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2rem] blur-sm`}
                  />

                  {/* Card Content (Glass Effect) */}
                  <div
                    className={`relative h-full bg-white/80 dark:bg-[#121212]/90 backdrop-blur-xl border border-white/60 dark:border-white/5 rounded-[1.9rem] p-6 shadow-sm hover:shadow-2xl ${category.shadow} dark:shadow-none transition-all duration-300 flex flex-col items-start`}
                  >
                    {/* Decorative Background Blob inside card */}
                    <div
                      className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-10 blur-[50px] transition-opacity duration-500 rounded-full`}
                    />

                    {/* Icon Box */}
                    <div
                      className={`w-16 h-16 rounded-2xl ${category.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 relative overflow-hidden`}
                    >
                      {/* Icon Gradient Overlay (Light mode) */}
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-20 dark:opacity-0`}
                      ></div>

                      <category.icon
                        size={32}
                        className="relative z-10 text-gray-900 dark:text-white"
                        strokeWidth={1.5}
                      />
                    </div>

                    {/* Text Content */}
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {category.name}
                    </h3>

                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
                      {category.description}
                    </p>

                    {/* Action Link (Bottom) */}
                    <div className="mt-auto flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white opacity-80 group-hover:opacity-100 group-hover:gap-3 transition-all duration-300">
                      <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 group-hover:from-blue-600 group-hover:to-cyan-500">
                        Browse Products
                      </span>
                      <div
                        className={`p-1 rounded-full bg-gray-100 dark:bg-white/10 group-hover:bg-gradient-to-r ${category.gradient} group-hover:text-white transition-all`}
                      >
                        <ArrowRight size={14} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
}
