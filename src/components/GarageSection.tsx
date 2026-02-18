"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Car,
  Wrench,
  Loader2,
  Fuel,
  Calendar,
  ChevronDown,
  Sparkles,
  Search,
  CheckCircle2,
  Zap,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useStore } from "@/store/useStore";
import { addToGarage } from "@/services/userService";
import { HYUNDAI_DATA } from "../../data/carData";

const FUEL_TYPES = ["Petrol", "Diesel", "CNG", "EV"];

// Models for Marquee
const COMPATIBLE_MODELS = [
  "CRETA",
  "VERNA",
  "i20",
  "VENUE",
  "TUCSON",
  "ALCAZAR",
  "AURA",
  "SANTRO",
  "ELANTRA",
  "EXTER",
  "IONIQ 5",
];

// 🔥 NEW: Bright Color Palette for Marquee Items
const MARQUEE_COLORS = [
  "text-blue-600 dark:text-cyan-400",
  "text-fuchsia-600 dark:text-pink-400",
  "text-violet-600 dark:text-purple-400",
  "text-indigo-600 dark:text-indigo-400",
  "text-rose-600 dark:text-rose-400",
];

export default function GarageSection() {
  const router = useRouter();
  const { user } = useAuth();
  const { addVehicleLocal, setSavedVehicles, setSelectedVehicle } = useStore();

  const [formData, setFormData] = useState({
    model: "",
    year: "",
    variant: "",
    fuelType: "Petrol",
  });

  const [loading, setLoading] = useState(false);

  const modelOptions = HYUNDAI_DATA.map((car) => car.model);
  const selectedCarData = HYUNDAI_DATA.find(
    (car) => car.model === formData.model,
  );
  const yearOptions = selectedCarData ? selectedCarData.years : [];
  const variantOptions = selectedCarData ? selectedCarData.variants : [];

  const handleShowParts = async () => {
    if (!formData.model || !formData.year || !formData.variant) {
      toast.error("Please select all vehicle details.");
      return;
    }

    setLoading(true);

    const vehicleData = {
      model: formData.model,
      year: formData.year,
      variant: formData.variant,
      fuelType: formData.fuelType,
    };

    try {
      if (user) {
        const res = await addToGarage(vehicleData);
        setSavedVehicles(res as any);
        if (res && res.length > 0)
          setSelectedVehicle(res[res.length - 1] as any);
        toast.success(`${formData.model} added to your Garage!`);
      } else {
        addVehicleLocal(vehicleData);
        toast.success(`${formData.model} saved locally!`);
      }

      const queryParams = new URLSearchParams({
        model: formData.model,
        year: formData.year,
        variant: formData.variant,
      }).toString();

      router.push(`/products?${queryParams}`);
    } catch (error: any) {
      console.error(error);
      toast.error("Failed to save vehicle.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative w-full min-h-screen lg:min-h-[85vh] flex flex-col items-center justify-center overflow-hidden bg-gray-50 dark:bg-[#0f1115] py-12 lg:py-0">
      {/* --- Dynamic Background --- */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-white to-gray-200 dark:from-gray-950 dark:via-[#0a0f1d] dark:to-black" />
        <div className="absolute inset-0 opacity-[0.05] dark:opacity-[0.15] bg-[linear-gradient(to_right,#000000_1px,transparent_1px),linear-gradient(to_bottom,#000000_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-400/10 dark:bg-blue-600/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-400/10 dark:bg-cyan-500/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen" />
      </div>

      <div className="relative z-10 w-full px-4 md:px-6 lg:px-12 flex flex-col items-center flex-grow justify-center">
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="w-full max-w-7xl mx-auto"
        >
          {/* --- Main Card Container --- */}
          <div className="bg-white dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl shadow-xl dark:shadow-2xl overflow-hidden flex flex-col">
            {/* Top Section: Grid (Blue Panel + Form) */}
            <div className="grid grid-cols-1 lg:grid-cols-3">
              {/* --- Left Panel: Title --- */}
              <div className="lg:col-span-1 bg-gradient-to-br from-blue-600 to-cyan-700 p-8 lg:p-12 flex flex-col justify-center relative overflow-hidden text-center lg:text-left">
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] mix-blend-overlay"></div>
                <div className="relative z-10 space-y-4">
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/20 text-cyan-100 text-[11px] font-bold uppercase tracking-widest border border-white/10 w-fit mx-auto lg:mx-0">
                    <Sparkles size={12} className="text-cyan-300" />
                    Genuine Parts Finder
                  </span>
                  <h1 className="text-3xl lg:text-5xl font-black text-white leading-tight tracking-tight">
                    Find Your <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 to-white">
                      Perfect Fit.
                    </span>
                  </h1>
                  <p className="text-blue-100/90 text-sm font-medium leading-relaxed max-w-xs mx-auto lg:mx-0">
                    Select your Hyundai model to instantly filter thousands of
                    100% compatible OEM parts.
                  </p>
                </div>
              </div>

              {/* --- Right Panel: Form --- */}
              <div className="lg:col-span-2 p-6 lg:p-10 flex flex-col justify-center">
                <div className="space-y-6 lg:space-y-8">
                  {/* Row 1: Model & Fuel */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Model Select */}
                    <div className="space-y-2.5">
                      <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 tracking-wider flex items-center gap-2">
                        <Car
                          size={14}
                          className="text-blue-600 dark:text-cyan-500"
                        />{" "}
                        Select Model
                      </label>
                      <div className="relative group">
                        <select
                          value={formData.model}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              model: e.target.value,
                              year: "",
                              variant: "",
                            })
                          }
                          className="w-full h-14 pl-4 pr-10 bg-gray-50 dark:bg-[#1a1d26] border border-gray-200 dark:border-white/10 rounded-xl outline-none focus:border-blue-500 dark:focus:border-cyan-500 focus:ring-1 focus:ring-blue-500 dark:focus:ring-cyan-500 text-gray-900 dark:text-white font-bold text-sm transition-all appearance-none cursor-pointer hover:border-gray-300 dark:hover:border-white/20"
                        >
                          <option value="" disabled className="text-gray-500">
                            Select Car Model
                          </option>
                          {modelOptions.map((m) => (
                            <option
                              key={m}
                              value={m}
                              className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                            >
                              Hyundai {m}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                          size={18}
                        />
                      </div>
                    </div>

                    {/* Fuel Type */}
                    <div className="space-y-2.5">
                      <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 tracking-wider flex items-center gap-2">
                        <Fuel
                          size={14}
                          className="text-blue-600 dark:text-cyan-500"
                        />{" "}
                        Fuel Type
                      </label>
                      <div className="grid grid-cols-4 gap-2 bg-gray-100 dark:bg-[#1a1d26] p-1.5 rounded-xl border border-gray-200 dark:border-white/10">
                        {FUEL_TYPES.map((fuel) => (
                          <button
                            key={fuel}
                            onClick={() =>
                              setFormData({ ...formData, fuelType: fuel })
                            }
                            className={`relative rounded-lg py-2.5 text-[11px] font-bold transition-all flex flex-col items-center justify-center gap-1 ${
                              formData.fuelType === fuel
                                ? "bg-white dark:bg-gradient-to-br dark:from-cyan-600 dark:to-blue-600 text-blue-700 dark:text-white shadow-sm dark:shadow-lg ring-1 ring-gray-200 dark:ring-0"
                                : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/5"
                            }`}
                          >
                            {fuel}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Row 2: Year, Variant & Button */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
                    {/* Year */}
                    <div className="lg:col-span-3 space-y-2.5">
                      <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 tracking-wider flex items-center gap-2">
                        <Calendar
                          size={14}
                          className="text-blue-600 dark:text-cyan-500"
                        />{" "}
                        Year
                      </label>
                      <div className="relative">
                        <select
                          value={formData.year}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              year: e.target.value,
                            }))
                          }
                          disabled={!formData.model}
                          className="w-full h-14 pl-4 pr-10 bg-gray-50 dark:bg-[#1a1d26] border border-gray-200 dark:border-white/10 rounded-xl outline-none focus:border-blue-500 dark:focus:border-cyan-500 text-gray-900 dark:text-white font-bold text-sm transition-all appearance-none disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-300 dark:hover:border-white/20"
                        >
                          <option value="">Year</option>
                          {yearOptions.map((y) => (
                            <option
                              key={y}
                              value={y}
                              className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                            >
                              {y}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                          size={18}
                        />
                      </div>
                    </div>

                    {/* Variant */}
                    <div className="lg:col-span-5 space-y-2.5">
                      <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 tracking-wider flex items-center gap-2">
                        <Wrench
                          size={14}
                          className="text-blue-600 dark:text-cyan-500"
                        />{" "}
                        Variant
                      </label>
                      <div className="relative">
                        <select
                          value={formData.variant}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              variant: e.target.value,
                            }))
                          }
                          disabled={!formData.model}
                          className="w-full h-14 pl-4 pr-10 bg-gray-50 dark:bg-[#1a1d26] border border-gray-200 dark:border-white/10 rounded-xl outline-none focus:border-blue-500 dark:focus:border-cyan-500 text-gray-900 dark:text-white font-bold text-sm transition-all appearance-none disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-300 dark:hover:border-white/20"
                        >
                          <option value="">Select Variant</option>
                          {variantOptions.map((v) => (
                            <option
                              key={v}
                              value={v}
                              className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                            >
                              {v}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                          size={18}
                        />
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="lg:col-span-4">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleShowParts}
                        disabled={
                          loading ||
                          !formData.model ||
                          !formData.year ||
                          !formData.variant
                        }
                        className="w-full h-14 bg-blue-700 dark:bg-white text-white dark:text-black font-extrabold text-sm uppercase tracking-widest rounded-xl hover:bg-blue-800 dark:hover:bg-cyan-50 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20 dark:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                      >
                        {loading ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : (
                          <>
                            Search Parts <Search size={18} />
                          </>
                        )}
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* --- BOTTOM MARQUEE STRIP (INSIDE CARD) - UPDATED COLORS --- */}
            <div className="relative w-full border-t border-gray-100 dark:border-white/5 bg-gray-50/80 dark:bg-black/40">
              {/* Label */}
              <div className="absolute left-0 top-0 bottom-0 z-20 bg-gradient-to-r from-gray-50 via-gray-50 to-transparent dark:from-[#11131a] dark:via-[#11131a] dark:to-transparent px-5 flex items-center">
                <span className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-widest text-blue-700 dark:text-cyan-300 drop-shadow-sm">
                  <Zap size={12} className="fill-current" /> Supported
                </span>
              </div>

              {/* Marquee Content with Bright, Different Colors */}
              <div className="py-3.5 flex animate-marquee whitespace-nowrap items-centermask-image-gradient pl-28">
                {[
                  ...COMPATIBLE_MODELS,
                  ...COMPATIBLE_MODELS,
                  ...COMPATIBLE_MODELS,
                ].map((model, i) => {
                  // Cycle through the bright color palette
                  const colorClass = MARQUEE_COLORS[i % MARQUEE_COLORS.length];
                  return (
                    <div
                      key={i}
                      className="flex items-center gap-8 mx-4 hover:scale-110 transition-transform cursor-default"
                    >
                      <span
                        className={`text-xs font-extrabold uppercase tracking-wider drop-shadow-sm ${colorClass}`}
                      >
                        {model}
                      </span>
                      {/* Bright Separator Dot */}
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400/50 dark:bg-cyan-400/50 animate-pulse" />
                    </div>
                  );
                })}
              </div>

              {/* Right Fade */}
              <div className="absolute right-0 top-0 bottom-0 z-20 w-24 bg-gradient-to-l from-gray-50 dark:from-[#11131a] to-transparent pointer-events-none" />
            </div>
          </div>

          {/* Trust Indicators (Outside Card) */}
          <div className="mt-8 flex flex-wrap justify-center gap-4 lg:gap-8 text-gray-500 dark:text-white/40 text-xs font-bold uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <CheckCircle2
                size={14}
                className="text-blue-600 dark:text-cyan-500"
              />{" "}
              100% Genuine Parts
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2
                size={14}
                className="text-blue-600 dark:text-cyan-500"
              />{" "}
              Hyundai Certified
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2
                size={14}
                className="text-blue-600 dark:text-cyan-500"
              />{" "}
              Fast Delivery
            </div>
          </div>
        </motion.div>
      </div>

      {/* Marquee Animation Style */}
      <style jsx global>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </section>
  );
}
