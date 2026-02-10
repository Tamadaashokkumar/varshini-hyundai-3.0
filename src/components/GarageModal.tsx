"use client";
import { useState } from "react";
import { X, Car, Check, Trash2, Plus, Wrench } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/store/useStore";
import { addToGarage, deleteFromGarage } from "@/services/userService";
import { useAuth } from "@/hooks/useAuth";
import toast from "react-hot-toast";
import { HYUNDAI_DATA } from "../../data/carData"; // ✅ Data Import ముఖ్యం

interface GarageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FUEL_TYPES = ["Petrol", "Diesel", "CNG", "EV"];

export const GarageModal = ({ isOpen, onClose }: GarageModalProps) => {
  const { user } = useAuth();

  const {
    addVehicleLocal,
    removeVehicleLocal,
    savedVehicles,
    setSavedVehicles,
    selectedVehicle,
    setSelectedVehicle,
  } = useStore();

  const [activeTab, setActiveTab] = useState<"list" | "add">(
    savedVehicles.length > 0 ? "list" : "add",
  );

  // ✅ State లో Variant ని కూడా యాడ్ చేశాం
  const [form, setForm] = useState({
    model: "",
    year: "",
    variant: "",
    fuelType: "Petrol",
  });
  const [loading, setLoading] = useState(false);

  // ✅ Derived Data (Home Page లాగే డైనమిక్ గా వస్తుంది)
  const modelOptions = HYUNDAI_DATA.map((car) => car.model);
  const selectedCarData = HYUNDAI_DATA.find((car) => car.model === form.model);
  const yearOptions = selectedCarData ? selectedCarData.years : [];
  const variantOptions = selectedCarData ? selectedCarData.variants : [];

  // --- SUBMIT FORM ---
  const handleSubmit = async () => {
    if (!form.model || !form.year || !form.fuelType || !form.variant)
      return toast.error("Please select all fields");

    setLoading(true);
    try {
      const vehicleData = {
        model: form.model,
        year: form.year,
        variant: form.variant, // ✅ Correct Variant
        fuelType: form.fuelType,
      };

      if (user) {
        const res = await addToGarage(vehicleData);
        setSavedVehicles(res as any);
        if (res && res.length > 0)
          setSelectedVehicle(res[res.length - 1] as any);
      } else {
        addVehicleLocal(vehicleData);
      }

      toast.success("Vehicle Added Successfully!");
      setActiveTab("list");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to add vehicle");
    } finally {
      setLoading(false);
    }
  };

  // --- DELETE CAR ---
  const handleDelete = async (e: any, vehicle: any) => {
    e.stopPropagation();
    if (!confirm("Remove this car?")) return;

    if (user && vehicle._id) {
      try {
        const res = await deleteFromGarage(vehicle._id);
        setSavedVehicles(res as any);
        if (selectedVehicle?._id === vehicle._id) setSelectedVehicle(null);
        toast.success("Vehicle removed");
      } catch (err) {
        toast.error("Failed to remove");
      }
    } else {
      removeVehicleLocal(vehicle.model);
      toast.success("Vehicle removed");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 m-auto w-[90%] max-w-md h-fit max-h-[90vh] flex flex-col bg-white dark:bg-[#121212] rounded-3xl border border-gray-200 dark:border-white/10 shadow-2xl z-[101] overflow-hidden"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 pb-2">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Car className="text-cyan-600" /> My Garage
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full text-gray-500"
              >
                <X size={20} />
              </button>
            </div>

            {/* Tabs */}
            {savedVehicles.length > 0 && (
              <div className="flex px-6 gap-4 mb-4 border-b border-gray-100 dark:border-white/5">
                <button
                  onClick={() => setActiveTab("list")}
                  className={`pb-2 text-sm font-bold border-b-2 transition-colors ${activeTab === "list" ? "border-cyan-600 text-cyan-600" : "border-transparent text-gray-500"}`}
                >
                  My Vehicles
                </button>
                <button
                  onClick={() => setActiveTab("add")}
                  className={`pb-2 text-sm font-bold border-b-2 transition-colors ${activeTab === "add" ? "border-cyan-600 text-cyan-600" : "border-transparent text-gray-500"}`}
                >
                  Add New
                </button>
              </div>
            )}

            <div className="p-6 pt-0 overflow-y-auto">
              {/* === VIEW 1: VEHICLE LIST === */}
              {activeTab === "list" && savedVehicles.length > 0 ? (
                <div className="space-y-3">
                  {savedVehicles.map((car, idx) => {
                    const isActive =
                      (selectedVehicle?._id === car._id && user) ||
                      (selectedVehicle?.model === car.model && !user);
                    return (
                      <div
                        key={idx}
                        onClick={() => {
                          setSelectedVehicle(car);
                          toast.success(`Active: ${car.model}`);
                          onClose();
                        }}
                        className={`p-4 rounded-2xl border-2 cursor-pointer flex items-center justify-between group transition-all ${
                          isActive
                            ? "border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20"
                            : "border-gray-100 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/20"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-full ${isActive ? "bg-cyan-600 text-white" : "bg-gray-200 dark:bg-white/10 text-gray-500"}`}
                          >
                            <Car size={20} />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 dark:text-white">
                              {car.model}
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {car.year} • {car.variant}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {isActive && (
                            <span className="text-xs font-bold text-cyan-600 bg-white px-2 py-1 rounded-md shadow-sm">
                              Active
                            </span>
                          )}
                          <button
                            onClick={(e) => handleDelete(e, car)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  <button
                    onClick={() => setActiveTab("add")}
                    className="w-full py-3 mt-2 border border-dashed border-gray-300 dark:border-white/20 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 transition-all flex items-center justify-center gap-2"
                  >
                    <Plus size={16} /> Add Another Car
                  </button>
                </div>
              ) : (
                /* === VIEW 2: ADD FORM === */
                <div className="space-y-5">
                  {/* Model Selection */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                      Select Model
                    </label>
                    <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto pr-1 scrollbar-hide">
                      {modelOptions.map((m) => (
                        <button
                          key={m}
                          onClick={() =>
                            setForm({
                              model: m,
                              year: "",
                              variant: "",
                              fuelType: "Petrol",
                            })
                          }
                          className={`py-2 px-1 text-xs font-bold rounded-xl border transition-all ${form.model === m ? "bg-cyan-600 text-white border-cyan-600" : "bg-gray-50 dark:bg-white/5 border-gray-200 hover:border-cyan-500"}`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Fuel Type */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                      Fuel Type
                    </label>
                    <div className="flex gap-2">
                      {FUEL_TYPES.map((fuel) => (
                        <button
                          key={fuel}
                          onClick={() => setForm({ ...form, fuelType: fuel })}
                          className={`flex-1 py-2 text-xs font-bold rounded-xl border ${form.fuelType === fuel ? "bg-gray-900 dark:bg-white text-white dark:text-black" : "bg-gray-50 dark:bg-white/5 border-gray-200"}`}
                        >
                          {fuel}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Year & Variant (Side by Side) */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                        Year
                      </label>
                      <select
                        value={form.year}
                        onChange={(e) =>
                          setForm({ ...form, year: e.target.value })
                        }
                        disabled={!form.model}
                        className="w-full p-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl outline-none focus:border-cyan-500 disabled:opacity-50"
                      >
                        <option value="">Select Year</option>
                        {yearOptions.map((y) => (
                          <option key={y} value={y}>
                            {y}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* 🔥 Variant Selection (New) */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                        Variant
                      </label>
                      <select
                        value={form.variant}
                        onChange={(e) =>
                          setForm({ ...form, variant: e.target.value })
                        }
                        disabled={!form.model}
                        className="w-full p-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl outline-none focus:border-cyan-500 disabled:opacity-50"
                      >
                        <option value="">Select Variant</option>
                        {variantOptions.map((v) => (
                          <option key={v} value={v}>
                            {v}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full py-3.5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-cyan-500/25 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      "Saving..."
                    ) : (
                      <>
                        Save Vehicle <Check size={18} />
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
