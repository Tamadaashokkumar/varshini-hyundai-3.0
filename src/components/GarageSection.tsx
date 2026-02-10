"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Car, Wrench, Loader2, Fuel, Calendar } from "lucide-react";
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
    fuelType: "Petrol", // Default
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
      fuelType: formData.fuelType, // 🔥 Fixed: Taking directly from state
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
    <section id="garage-section" className="relative z-30 py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white dark:bg-[#12121a] rounded-[2.5rem] shadow-2xl border border-gray-200 dark:border-white/10 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-8 md:p-10 text-center">
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2">
              Find Parts For Your Hyundai
            </h2>
            <p className="text-blue-100 text-sm md:text-base font-medium">
              Select your vehicle to see compatible spares & accessories
            </p>
          </div>

          <div className="p-8 md:p-10">
            <div className="grid grid-cols-1 gap-8">
              {/* 1. MODEL SELECTION */}
              <div>
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
                  <Car size={16} className="text-cyan-600" /> Select Model
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {modelOptions.map((m) => (
                    <button
                      key={m}
                      onClick={() =>
                        setFormData({
                          ...formData,
                          model: m,
                          year: "",
                          variant: "",
                        })
                      }
                      className={`py-3 px-2 text-xs sm:text-sm font-bold rounded-xl border transition-all shadow-sm ${
                        formData.model === m
                          ? "bg-cyan-600 text-white border-cyan-600 ring-4 ring-cyan-100 dark:ring-cyan-900/30"
                          : "bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 hover:border-cyan-500 hover:shadow-md text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. FUEL TYPE SELECTION (🔥 Added This) */}
              <div>
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
                  <Fuel size={16} className="text-cyan-600" /> Select Fuel Type
                </label>
                <div className="flex gap-3">
                  {FUEL_TYPES.map((fuel) => (
                    <button
                      key={fuel}
                      onClick={() =>
                        setFormData({ ...formData, fuelType: fuel })
                      }
                      className={`flex-1 py-3 px-2 text-xs sm:text-sm font-bold rounded-xl border transition-all ${
                        formData.fuelType === fuel
                          ? "bg-gray-900 dark:bg-white text-white dark:text-black border-transparent shadow-lg"
                          : "bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 hover:border-gray-400 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {fuel}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. YEAR & VARIANT */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                    <Calendar size={16} className="text-cyan-600" /> Select Year
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
                      className="w-full p-4 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 text-gray-900 dark:text-white appearance-none transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                      <option value="" className="text-gray-500">
                        {formData.model ? "Select Year" : "Select Model First"}
                      </option>
                      {yearOptions.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                    <Wrench size={16} className="text-cyan-600" /> Select
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
                      className="w-full p-4 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 text-gray-900 dark:text-white appearance-none transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                      <option value="" className="text-gray-500">
                        {formData.model
                          ? "Select Variant"
                          : "Select Model First"}
                      </option>
                      {variantOptions.map((v) => (
                        <option key={v} value={v}>
                          {v}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <button
                onClick={handleShowParts}
                disabled={
                  loading ||
                  !formData.model ||
                  !formData.year ||
                  !formData.variant
                }
                className="w-full py-4 bg-gradient-to-r from-gray-900 to-gray-800 dark:from-cyan-600 dark:to-blue-600 hover:from-black hover:to-gray-900 dark:hover:from-cyan-500 dark:hover:to-blue-500 text-white font-bold text-sm uppercase tracking-widest rounded-xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Wrench size={20} /> Show Compatible Parts
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
