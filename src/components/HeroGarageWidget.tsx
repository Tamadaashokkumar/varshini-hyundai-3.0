"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Car,
  Search,
  ArrowRight,
  X,
  Calendar,
  ShieldCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function HeroGarageWidget() {
  const router = useRouter();
  const [garage, setGarage] = useState<{ model: string; year: string } | null>(
    null,
  );
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem("myGarage");
    if (saved) setGarage(JSON.parse(saved));
  }, []);

  const handleSetGarage = () => {
    if (!model || !year) return;
    const newGarage = { model, year };
    localStorage.setItem("myGarage", JSON.stringify(newGarage));
    setGarage(newGarage);
    router.push("/products");
  };

  const handleClear = () => {
    localStorage.removeItem("myGarage");
    setGarage(null);
    setModel("");
    setYear("");
  };

  if (!isMounted) return null;

  return (
    <section className="relative w-full px-4 py-4 z-20">
      <div className="max-w-7xl mx-auto">
        {/* Main Container: Slim & Wide */}
        <div className="relative overflow-hidden bg-white/80 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-3xl shadow-lg transition-all">
          <div className="flex flex-col md:flex-row items-center justify-between p-4 md:p-6 gap-6">
            {/* LEFT SIDE: Mini Branding (Compact) */}
            <div className="flex items-center gap-4 min-w-fit">
              <div className="hidden sm:flex w-12 h-12 bg-blue-600 rounded-2xl items-center justify-center text-white shadow-lg shadow-blue-500/30">
                <Car size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
                  My Garage
                </h2>
                <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-tighter">
                  <ShieldCheck size={12} />
                  <span>Verified Compatibility</span>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE: Interactive Area */}
            <div className="w-full flex-1 max-w-4xl">
              <AnimatePresence mode="wait">
                {garage ? (
                  // STATE: VEHICLE DISPLAYED (Horizontal Row)
                  <motion.div
                    key="active-view"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex flex-wrap items-center justify-between bg-slate-50 dark:bg-slate-800/50 p-3 px-5 rounded-2xl border border-slate-100 dark:border-slate-700 gap-4"
                  >
                    <div className="flex items-center gap-6">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          Selected Model
                        </p>
                        <p className="text-lg font-bold text-slate-900 dark:text-white leading-none mt-1">
                          {garage.model}
                        </p>
                      </div>
                      <div className="h-8 w-[1px] bg-slate-300 dark:bg-slate-700" />
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          Year
                        </p>
                        <p className="text-lg font-bold text-slate-900 dark:text-white leading-none mt-1">
                          {garage.year}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => router.push("/products")}
                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-all flex items-center gap-2 shadow-md shadow-blue-500/20"
                      >
                        Shop Parts <ArrowRight size={16} />
                      </button>
                      <button
                        onClick={handleClear}
                        className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  // STATE: MINI FORM (Horizontal)
                  <motion.div
                    key="form-view"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid grid-cols-1 sm:grid-cols-12 gap-3"
                  >
                    <div className="sm:col-span-5 relative group">
                      <Search
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500"
                        size={18}
                      />
                      <input
                        type="text"
                        placeholder="Vehicle Model (e.g. i20)"
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-11 pr-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all dark:text-white"
                      />
                    </div>

                    <div className="sm:col-span-4 relative group">
                      <Calendar
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500"
                        size={18}
                      />
                      <input
                        type="number"
                        placeholder="Year"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-11 pr-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all dark:text-white"
                      />
                    </div>

                    <button
                      onClick={handleSetGarage}
                      disabled={!model || !year}
                      className="sm:col-span-3 bg-slate-900 dark:bg-blue-600 hover:bg-black dark:hover:bg-blue-700 text-white text-sm font-bold rounded-xl py-3 px-4 flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:grayscale shadow-lg shadow-slate-200 dark:shadow-none"
                    >
                      Check Fit <ArrowRight size={16} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Bottom Accent Line */}
          <div className="h-1 w-full bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-20" />
        </div>
      </div>
    </section>
  );
}
