"use client";

import { useState } from "react";
import { X, MapPin, Loader2, Home, Building, Check } from "lucide-react";
import { motion } from "framer-motion";
import apiClient from "@/services/apiClient";
import toast from "react-hot-toast";

interface AddAddressModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function AddAddressModal({ onClose, onSuccess }: AddAddressModalProps) {
  const [formData, setFormData] = useState({
    addressType: "Home",
    street: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
    isDefault: false,
  });

  const [loading, setLoading] = useState(false);
  const [pincodeLoading, setPincodeLoading] = useState(false);

  // 🔥 PINCODE AUTO-FILL LOGIC
  const handlePincodeChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const code = e.target.value.replace(/\D/g, ""); // Allow only numbers
    setFormData((prev) => ({ ...prev, pincode: code }));

    if (code.length === 6) {
      setPincodeLoading(true);
      try {
        const response = await fetch(
          `https://api.postalpincode.in/pincode/${code}`,
        );
        const data = await response.json();

        if (data[0].Status === "Success") {
          const details = data[0].PostOffice[0];
          setFormData((prev) => ({
            ...prev,
            city: details.District,
            state: details.State,
          }));
          toast.success(`Found: ${details.District}, ${details.State}`);
        } else {
          toast.error("Invalid Pincode");
        }
      } catch (error) {
        console.error("Pincode Error:", error);
      } finally {
        setPincodeLoading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Basic Validation
    if (formData.phone.length < 10) {
      toast.error("Enter valid 10-digit phone number");
      setLoading(false);
      return;
    }

    try {
      const response = await apiClient.post("/auth/address/add", formData);
      if (response.data.success) {
        onSuccess();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to add address");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-[#0f172a] w-full max-w-lg rounded-3xl border border-gray-200 dark:border-slate-800 shadow-2xl overflow-hidden relative"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-gray-50/50 dark:bg-slate-900/50">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <MapPin className="text-blue-600" size={20} /> New Address
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={20} className="text-gray-500 dark:text-slate-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Address Type Selection */}
          <div className="flex gap-4">
            {["Home", "Work", "Other"].map((type) => (
              <label
                key={type}
                className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                  formData.addressType === type
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                    : "border-gray-200 dark:border-slate-700 text-gray-500 hover:border-gray-300 dark:hover:border-slate-600"
                }`}
              >
                <input
                  type="radio"
                  name="addressType"
                  value={type}
                  checked={formData.addressType === type}
                  onChange={(e) =>
                    setFormData({ ...formData, addressType: e.target.value })
                  }
                  className="hidden"
                />
                {type === "Home" && <Home size={16} />}
                {type === "Work" && <Building size={16} />}
                <span className="font-bold text-sm">{type}</span>
              </label>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase">
                Pincode
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  required
                  value={formData.pincode}
                  onChange={handlePincodeChange}
                  className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="e.g. 500081"
                />
                {pincodeLoading && (
                  <div className="absolute right-3 top-3">
                    <Loader2 size={16} className="animate-spin text-blue-600" />
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase">
                Phone
              </label>
              <input
                type="tel"
                maxLength={10}
                required
                value={formData.phone}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    phone: e.target.value.replace(/\D/g, ""),
                  })
                }
                className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="10-digit number"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase">
              Street / Flat / Area
            </label>
            <textarea
              required
              rows={2}
              value={formData.street}
              onChange={(e) =>
                setFormData({ ...formData, street: e.target.value })
              }
              className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
              placeholder="e.g. Flat 402, Sunshine Apartments, Madhapur"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase">
                City
              </label>
              <input
                type="text"
                required
                readOnly
                value={formData.city}
                className="w-full bg-gray-100 dark:bg-slate-800 border border-transparent rounded-xl px-4 py-3 text-sm font-bold text-gray-700 dark:text-slate-300 cursor-not-allowed"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase">
                State
              </label>
              <input
                type="text"
                required
                readOnly
                value={formData.state}
                className="w-full bg-gray-100 dark:bg-slate-800 border border-transparent rounded-xl px-4 py-3 text-sm font-bold text-gray-700 dark:text-slate-300 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <div
                className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${formData.isDefault ? "bg-blue-600 border-blue-600" : "border-gray-400"}`}
              >
                {formData.isDefault && (
                  <Check size={14} className="text-white" />
                )}
              </div>
              <input
                type="checkbox"
                className="hidden"
                checked={formData.isDefault}
                onChange={(e) =>
                  setFormData({ ...formData, isDefault: e.target.checked })
                }
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Set as default address
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Save Address"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
