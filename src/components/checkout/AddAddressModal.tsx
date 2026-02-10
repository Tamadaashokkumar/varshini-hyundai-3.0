"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  MapPin,
  Building,
  Hash,
  Navigation,
  Briefcase,
  Home,
  Check,
  Loader2,
  AlertCircle,
  LocateFixed,
} from "lucide-react";
import apiClient from "@/services/apiClient";
import toast from "react-hot-toast";

interface AddAddressModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

interface AddressFormData {
  addressType: "Home" | "Work" | "Other";
  street: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

interface AddressFormErrors {
  street?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

export const AddAddressModal: React.FC<AddAddressModalProps> = ({
  onClose,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [pincodeLoading, setPincodeLoading] = useState(false);

  const [formData, setFormData] = useState<AddressFormData>({
    addressType: "Home",
    street: "",
    city: "",
    state: "",
    pincode: "",
    isDefault: false,
  });

  const [errors, setErrors] = useState<AddressFormErrors>({});

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case "street":
        if (!value.trim()) return "Street address is required";
        if (value.trim().length < 3) return "Address is too short";
        return "";
      case "city":
        if (!value.trim()) return "City is required";
        return "";
      case "state":
        if (!value.trim()) return "State is required";
        return "";
      case "pincode":
        if (!value.trim()) return "PIN Code is required";
        if (!/^\d{6}$/.test(value)) return "PIN Code must be exactly 6 digits";
        return "";
      default:
        return "";
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    if (name === "pincode") {
      if (!/^\d*$/.test(value)) return;
    }

    if (name === "pincode" && value.length === 6) {
      fetchPincodeDetails(value);
    }

    setFormData({
      ...formData,
      [name]: value,
    });

    if (errors[name as keyof AddressFormErrors]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }
  };

  const fetchPincodeDetails = async (code: string) => {
    setPincodeLoading(true);
    try {
      const response = await fetch(
        `https://api.postalpincode.in/pincode/${code}`,
      );
      const data = await response.json();

      if (data && data[0].Status === "Success") {
        const details = data[0].PostOffice[0];
        setFormData((prev) => ({
          ...prev,
          city: details.District,
          state: details.State,
          pincode: code,
        }));
        setErrors((prev) => ({ ...prev, city: undefined, state: undefined }));
        toast.success("City & State detected!");
      } else {
        toast.error("Invalid Pincode");
        setErrors((prev) => ({ ...prev, pincode: "Invalid PIN Code" }));
      }
    } catch (error) {
      console.error("Pincode API Error", error);
    } finally {
      setPincodeLoading(false);
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    const errorMsg = validateField(name, value);

    setErrors((prev) => ({
      ...prev,
      [name]: errorMsg || undefined,
    }));
  };

  const setAddressType = (type: "Home" | "Work" | "Other") => {
    setFormData({ ...formData, addressType: type });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: AddressFormErrors = {};
    let isValid = true;

    Object.keys(formData).forEach((key) => {
      if (key !== "addressType" && key !== "isDefault") {
        const error = validateField(
          key,
          formData[key as keyof AddressFormData] as string,
        );
        if (error) {
          newErrors[key as keyof AddressFormErrors] = error;
          isValid = false;
        }
      }
    });

    setErrors(newErrors);

    if (!isValid) {
      toast.error("Please fix the errors");
      return;
    }

    setLoading(true);

    try {
      const response = await apiClient.post("/auth/address", formData);

      if (response.data.success) {
        toast.success("Address added successfully");
        onSuccess();
        onClose();
      }
    } catch (error: any) {
      console.error("Add Address Error:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to add address";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // --- STYLES ---
  const getInputClass = (fieldName: keyof AddressFormErrors) => `
    w-full pl-11 pr-4 py-4
    bg-white/50 dark:bg-white/5 
    border rounded-2xl 
    text-gray-900 dark:text-white font-medium
    placeholder-gray-400 dark:placeholder-slate-500
    focus:outline-none transition-all duration-300
    ${
      errors[fieldName]
        ? "border-red-500/50 bg-red-50/50 focus:ring-4 focus:ring-red-500/10"
        : "border-gray-200 dark:border-white/10 focus:border-blue-500 focus:bg-white dark:focus:bg-black/20 focus:ring-4 focus:ring-blue-500/10"
    }
  `;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 30 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg bg-white/90 dark:bg-[#0f172a]/95 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20 dark:border-white/10"
        >
          {/* Header */}
          <div className="relative px-8 pt-8 pb-6 border-b border-gray-100 dark:border-white/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white">
                  <MapPin size={22} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
                    New Address
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-slate-400 font-medium">
                    Where should we deliver?
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2.5 text-gray-400 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full transition-all"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="p-8 space-y-7 max-h-[75vh] overflow-y-auto custom-scrollbar"
          >
            {/* Address Type */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-slate-500 pl-1">
                Save Address As
              </label>
              <div className="grid grid-cols-3 gap-3">
                {["Home", "Work", "Other"].map((type) => {
                  const isActive = formData.addressType === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setAddressType(type as any)}
                      className={`flex flex-col items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold transition-all border-2 ${
                        isActive
                          ? "bg-blue-50 dark:bg-blue-500/10 border-blue-500 text-blue-600 dark:text-blue-400"
                          : "bg-white dark:bg-white/5 text-gray-500 dark:text-slate-400 border-transparent hover:border-gray-200 dark:hover:border-white/10"
                      }`}
                    >
                      {type === "Home" && (
                        <Home
                          size={20}
                          className={isActive ? "fill-current" : ""}
                        />
                      )}
                      {type === "Work" && (
                        <Briefcase
                          size={20}
                          className={isActive ? "fill-current" : ""}
                        />
                      )}
                      {type === "Other" && (
                        <Navigation
                          size={20}
                          className={isActive ? "fill-current" : ""}
                        />
                      )}
                      {type}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Pincode Input */}
            <div className="space-y-1.5 relative group/field">
              <label className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase ml-1 transition-colors group-focus-within/field:text-blue-500">
                Pincode
              </label>
              <div className="relative">
                <Hash
                  className={`absolute left-4 top-4 text-gray-400 dark:text-slate-500 transition-colors group-focus-within/field:text-blue-500`}
                  size={20}
                />
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="6 Digits (e.g. 500081)"
                  maxLength={6}
                  className={getInputClass("pincode")}
                />
                {pincodeLoading && (
                  <div className="absolute right-4 top-4">
                    <Loader2 size={20} className="animate-spin text-blue-500" />
                  </div>
                )}
              </div>
              {errors.pincode && (
                <p className="text-xs text-red-500 pl-2 flex items-center gap-1 font-semibold animate-in fade-in slide-in-from-left-1">
                  <AlertCircle size={12} /> {errors.pincode}
                </p>
              )}
            </div>

            {/* City & State */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5 group/field">
                <label className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase ml-1">
                  City
                </label>
                <div className="relative">
                  <Building
                    className="absolute left-4 top-4 text-gray-400 dark:text-slate-500"
                    size={20}
                  />
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    readOnly
                    className={`${getInputClass("city")} cursor-not-allowed opacity-60 bg-gray-100 dark:bg-black/20`}
                  />
                </div>
              </div>
              <div className="space-y-1.5 group/field">
                <label className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase ml-1">
                  State
                </label>
                <div className="relative">
                  <LocateFixed
                    className="absolute left-4 top-4 text-gray-400 dark:text-slate-500"
                    size={20}
                  />
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    readOnly
                    className={`${getInputClass("state")} cursor-not-allowed opacity-60 bg-gray-100 dark:bg-black/20`}
                  />
                </div>
              </div>
            </div>

            {/* Street Address */}
            <div className="space-y-1.5 relative group/field">
              <label className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase ml-1 transition-colors group-focus-within/field:text-blue-500">
                Street Address
              </label>
              <div className="relative">
                <MapPin
                  className={`absolute left-4 top-4 transition-colors ${errors.street ? "text-red-500" : "text-gray-400 dark:text-slate-500 group-focus-within/field:text-blue-500"}`}
                  size={20}
                />
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="House No, Area, Landmark"
                  className={getInputClass("street")}
                />
              </div>
              {errors.street && (
                <p className="text-xs text-red-500 pl-2 font-semibold flex items-center gap-1 animate-in fade-in slide-in-from-left-1">
                  <AlertCircle size={12} /> {errors.street}
                </p>
              )}
            </div>

            {/* Default Toggle */}
            <div className="pt-2">
              <label className="flex items-center gap-4 cursor-pointer group p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border border-transparent hover:border-gray-100 dark:hover:border-white/5">
                <div
                  className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                    formData.isDefault
                      ? "bg-blue-500 border-blue-500"
                      : "border-gray-300 dark:border-slate-600 group-hover:border-blue-400"
                  }`}
                >
                  {formData.isDefault && (
                    <Check size={16} className="text-white" strokeWidth={3} />
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
                <span className="text-sm font-semibold text-gray-700 dark:text-slate-300">
                  Use as default address
                </span>
              </label>
            </div>

            {/* Actions */}
            <div className="pt-4 flex gap-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-4 rounded-2xl border border-gray-200 dark:border-white/10 text-gray-600 dark:text-slate-300 font-bold hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-[2] py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold shadow-lg shadow-blue-500/30 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Address"
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
