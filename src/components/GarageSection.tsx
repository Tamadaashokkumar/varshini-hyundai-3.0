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
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useStore } from "@/store/useStore";
import { addToGarage } from "@/services/userService";
import { HYUNDAI_DATA } from "../../data/carData";

const FUEL_TYPES = ["Petrol", "Diesel", "CNG", "EV"];

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
    <section id="garage-section" className="relative z-30 py-12 px-4 md:py-16">
      <div className="container mx-auto max-w-3xl">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white dark:bg-[#12121a] rounded-[2rem] shadow-2xl border border-gray-200 dark:border-white/10 overflow-hidden relative"
        >
          {/* Decorative Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none" />

          {/* Header Section */}
          <div className="bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-6 md:p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
            <div className="relative z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-cyan-300 mb-3 backdrop-blur-sm">
                <Sparkles size={12} /> Easy Finder
              </span>
              <h2 className="text-2xl md:text-4xl font-black text-white tracking-tight mb-2">
                Find Your Parts
              </h2>
              <p className="text-blue-200/80 text-xs md:text-sm font-medium max-w-md mx-auto">
                Select your vehicle details below to filter 100% compatible
                genuine spares.
              </p>
            </div>
          </div>

          {/* Form Section */}
          <div className="p-6 md:p-10 space-y-6">
            {/* 1. MODEL DROPDOWN (Updated to Dropdown) */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 ml-1">
                Select Model
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-600 dark:text-cyan-500 group-focus-within:scale-110 transition-transform">
                  <Car size={20} />
                </div>
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
                  className="w-full h-14 pl-12 pr-10 bg-gray-50 dark:bg-black/20 border-2 border-gray-100 dark:border-white/5 rounded-2xl outline-none focus:border-cyan-500 dark:focus:border-cyan-500 text-gray-900 dark:text-white font-bold text-sm appearance-none transition-all cursor-pointer shadow-sm focus:shadow-lg focus:shadow-cyan-500/10"
                >
                  <option value="" disabled>
                    Select your Car Model (e.g. Creta)
                  </option>
                  {modelOptions.map((m) => (
                    <option
                      key={m}
                      value={m}
                      className="bg-white dark:bg-gray-900"
                    >
                      Hyundai {m}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <ChevronDown size={16} />
                </div>
              </div>
            </div>

            {/* 2. FUEL TYPE (Beautiful Grid) */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 ml-1">
                Fuel Type
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {FUEL_TYPES.map((fuel) => (
                  <button
                    key={fuel}
                    onClick={() => setFormData({ ...formData, fuelType: fuel })}
                    className={`relative py-3 px-2 rounded-xl border-2 text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                      formData.fuelType === fuel
                        ? "bg-cyan-50 dark:bg-cyan-900/20 border-cyan-500 text-cyan-700 dark:text-cyan-400"
                        : "bg-white dark:bg-white/5 border-transparent hover:border-gray-200 dark:hover:border-white/10 text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {formData.fuelType === fuel && (
                      <motion.div
                        layoutId="activeFuel"
                        className="absolute inset-0 border-2 border-cyan-500 rounded-xl"
                      />
                    )}
                    <Fuel
                      size={14}
                      className={
                        formData.fuelType === fuel ? "fill-current" : ""
                      }
                    />
                    {fuel}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. YEAR & VARIANT (Side by Side) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Year */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 ml-1">
                  Year
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-600 dark:text-cyan-500">
                    <Calendar size={18} />
                  </div>
                  <select
                    value={formData.year}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, year: e.target.value }))
                    }
                    disabled={!formData.model}
                    className="w-full h-14 pl-12 pr-10 bg-gray-50 dark:bg-black/20 border-2 border-gray-100 dark:border-white/5 rounded-2xl outline-none focus:border-cyan-500 dark:focus:border-cyan-500 text-gray-900 dark:text-white font-bold text-sm appearance-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">
                      {formData.model ? "Select Year" : "Model First"}
                    </option>
                    {yearOptions.map((y) => (
                      <option
                        key={y}
                        value={y}
                        className="bg-white dark:bg-gray-900"
                      >
                        {y}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <ChevronDown size={16} />
                  </div>
                </div>
              </div>

              {/* Variant */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 ml-1">
                  Variant
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-600 dark:text-cyan-500">
                    <Wrench size={18} />
                  </div>
                  <select
                    value={formData.variant}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        variant: e.target.value,
                      }))
                    }
                    disabled={!formData.model}
                    className="w-full h-14 pl-12 pr-10 bg-gray-50 dark:bg-black/20 border-2 border-gray-100 dark:border-white/5 rounded-2xl outline-none focus:border-cyan-500 dark:focus:border-cyan-500 text-gray-900 dark:text-white font-bold text-sm appearance-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">
                      {formData.model ? "Select Variant" : "Model First"}
                    </option>
                    {variantOptions.map((v) => (
                      <option
                        key={v}
                        value={v}
                        className="bg-white dark:bg-gray-900"
                      >
                        {v}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <ChevronDown size={16} />
                  </div>
                </div>
              </div>
            </div>

            {/* ACTION BUTTON */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleShowParts}
              disabled={
                loading ||
                !formData.model ||
                !formData.year ||
                !formData.variant
              }
              className="w-full py-4 mt-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-extrabold text-sm uppercase tracking-widest rounded-2xl shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" /> saving...
                </>
              ) : (
                <>
                  Show Compatible Parts <Wrench size={18} />
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
