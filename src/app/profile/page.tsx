"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import {
  User,
  Package,
  MapPin,
  Edit,
  Save,
  X,
  Plus,
  Trash2,
  Phone,
  Mail,
  Home,
  Building,
  ChevronRight,
  AlertTriangle,
  Check,
  Loader2,
} from "lucide-react";
import apiClient from "@/services/apiClient";
import toast from "react-hot-toast";
import { Address } from "@/store/useStore";

type Tab = "profile" | "orders" | "addresses";

interface AddressFormData {
  addressType: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export default function ProfilePage() {
  const {
    user,
    isAuthenticated,
    loading: authLoading,
    refreshUser,
  } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [loading, setLoading] = useState(false);

  const [profileData, setProfileData] = useState({
    name: "",
    phone: "",
  });
  const [fetchingPincode, setFetchingPincode] = useState(false);

  const [addressData, setAddressData] = useState<AddressFormData>({
    addressType: "Home",
    street: "",
    city: "",
    state: "",
    pincode: "",
    isDefault: false,
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name,
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleProfileUpdate = async () => {
    setLoading(true);
    try {
      const response = await apiClient.put("/auth/profile", profileData);
      if (response.data.success) {
        toast.success("Profile updated successfully", { icon: "✨" });
        setIsEditing(false);
        await refreshUser();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = async () => {
    setLoading(true);
    try {
      const response = await apiClient.post("/auth/address", addressData);
      if (response.data.success) {
        toast.success("Address added successfully", { icon: "🏠" });
        setShowAddressModal(false);
        resetAddressForm();
        await refreshUser();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to add address");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAddress = async () => {
    if (!editingAddress) return;

    console.log("SENDING UPDATE REQUEST:", {
      id: editingAddress._id,
      data: addressData,
    });
    setLoading(true);
    try {
      const response = await apiClient.put(
        `/auth/address/${editingAddress._id}`,
        addressData,
      );
      console.log("UPDATE RESPONSE:", response.data);
      if (response.data.success) {
        toast.success("Address updated successfully", { icon: "✅" });
        setShowAddressModal(false);
        setEditingAddress(null);
        resetAddressForm();
        console.log("Reloading page now...");
        await refreshUser();
      }
    } catch (error: any) {
      console.error("UPDATE ERROR:", error);
      console.error("Error Response:", error.response?.data);
      toast.error(error.response?.data?.error || "Failed to update address");
    } finally {
      setLoading(false);
    }
  };

  // 👇 Pincode Change & Auto-Fetch Logic
  const handlePincodeChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const code = e.target.value.replace(/\D/g, ""); // కేవలం నంబర్స్ మాత్రమే తీసుకుంటుంది

    // స్టేట్ అప్‌డేట్
    setAddressData((prev) => ({ ...prev, pincode: code }));

    // 6 అంకెలు రాగానే API కాల్ చేయాలి
    if (code.length === 6) {
      setFetchingPincode(true);
      try {
        const response = await fetch(
          `https://api.postalpincode.in/pincode/${code}`,
        );
        const data = await response.json();

        if (data[0].Status === "Success") {
          const { District, State } = data[0].PostOffice[0];

          setAddressData((prev) => ({
            ...prev,
            city: District,
            state: State,
            pincode: code, // కన్ఫర్మేషన్ కోసం
          }));
          toast.success("Location found!", { icon: "📍" });
        } else {
          toast.error("Invalid Pincode");
          setAddressData((prev) => ({ ...prev, city: "", state: "" }));
        }
      } catch (error) {
        console.error("Pincode API Error", error);
      } finally {
        setFetchingPincode(false);
      }
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    console.log("DELETING ADDRESS ID:", addressId);
    try {
      const response = await apiClient.delete(`/auth/address/${addressId}`);
      console.log("DELETE RESPONSE:", response.data);
      if (response.data.success) {
        toast.success("Address deleted successfully", { icon: "🗑️" });
        console.log("Reloading page now...");
        await refreshUser();
      }
    } catch (error: any) {
      console.error("DELETE ERROR:", error);
      toast.error(error.response?.data?.error || "Failed to delete address");
    }
  };

  const openAddressModal = (address?: Address) => {
    if (address) {
      setEditingAddress(address);
      setAddressData({
        addressType: address.addressType,
        street: address.street,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        isDefault: address.isDefault,
      });
    }
    setShowAddressModal(true);
  };

  const resetAddressForm = () => {
    setAddressData({
      addressType: "Home",
      street: "",
      city: "",
      state: "",
      pincode: "",
      isDefault: false,
    });
    setEditingAddress(null);
  };

  if (authLoading || !user) {
    return <LoadingSkeleton />;
  }

  // --- ATTRACTIVE STYLES WITH GRADIENTS & GLASSMORPHISM ---

  // Main Background with subtle gradient
  const containerClass =
    "min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50 dark:from-gray-950 dark:via-[#0A101F] dark:to-black pt-24 pb-12 px-4 sm:px-6 lg:px-8";
  const wrapperClass = "max-w-6xl mx-auto flex flex-col md:flex-row gap-8";

  // Glassmorphism Card Style (Used for Sidebar and Main Content)
  const glassCardClass =
    "bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.5)] p-6 sm:p-8";

  const sidebarClass = "w-full md:w-1/4 flex-shrink-0";

  // Sticky sidebar behavior
  const sidebarContainerClass = `${glassCardClass} md:sticky md:top-28 h-fit`;

  // Navigation Buttons Styling
  const getNavBtnClass = (isActive: boolean) => `
    w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 font-medium text-sm sm:text-base group
    ${
      isActive
        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25"
        : "text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-white/5 hover:text-blue-700 dark:hover:text-white"
    }
  `;

  const mainClass = "flex-1 w-full min-w-0";
  const titleClass =
    "text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 mb-8";

  // Modern Input Styling
  const inputGroupClass = "space-y-2.5";
  const labelClass =
    "flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300";
  const inputClass =
    "w-full bg-white/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed backdrop-blur-sm placeholder:text-gray-400";

  // Gradient Button Styling (Primary)
  const primaryBtnClass =
    "flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transition-all scale-[0.99] hover:scale-100 active:scale-95 font-semibold text-sm";

  // Secondary Button Styling
  const secondaryBtnClass =
    "flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-50 dark:bg-white/5 text-blue-700 dark:text-blue-300 rounded-xl hover:bg-blue-100 dark:hover:bg-white/10 transition-colors text-sm font-medium border border-blue-100 dark:border-white/5";

  return (
    <div className={containerClass}>
      <div className={wrapperClass}>
        {/* --- Sidebar --- */}
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={sidebarClass}
        >
          <div className={sidebarContainerClass}>
            <div className="flex flex-col items-center text-center mb-8">
              {/* Attractive Avatar with Gradient & Glow */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-4xl sm:text-5xl font-bold text-white shadow-xl border-4 border-white dark:border-[#0A101F]">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </div>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-4">
                {user.name}
              </h2>
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mt-1 break-all">
                {user.email}
              </p>
            </div>

            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab("profile")}
                className={getNavBtnClass(activeTab === "profile")}
              >
                <div className="flex items-center gap-3">
                  <User size={20} /> <span>Profile</span>
                </div>
                <ChevronRight
                  size={18}
                  className={`transition-transform ${activeTab === "profile" ? "rotate-90" : "opacity-0 group-hover:opacity-50"}`}
                />
              </button>
              <button
                onClick={() => setActiveTab("orders")}
                className={getNavBtnClass(activeTab === "orders")}
              >
                <div className="flex items-center gap-3">
                  <Package size={20} /> <span>Orders</span>
                </div>
                <ChevronRight
                  size={18}
                  className={`transition-transform ${activeTab === "orders" ? "rotate-90" : "opacity-0 group-hover:opacity-50"}`}
                />
              </button>
              <button
                onClick={() => setActiveTab("addresses")}
                className={getNavBtnClass(activeTab === "addresses")}
              >
                <div className="flex items-center gap-3">
                  <MapPin size={20} /> <span>Addresses</span>
                </div>
                <ChevronRight
                  size={18}
                  className={`transition-transform ${activeTab === "addresses" ? "rotate-90" : "opacity-0 group-hover:opacity-50"}`}
                />
              </button>
            </nav>
          </div>
        </motion.aside>

        {/* --- Main Content --- */}
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className={mainClass}
        >
          <AnimatePresence mode="wait">
            {/* PROFILE TAB */}
            {activeTab === "profile" && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className={glassCardClass}
              >
                {/* --- PHONE NUMBER WARNING ALERT --- */}
                {!loading && user && user.phone === "0000000000" && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 p-4 rounded-2xl bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 flex items-start gap-4"
                  >
                    <div className="p-2 bg-orange-100 dark:bg-orange-500/20 rounded-full text-orange-600 dark:text-orange-400 flex-shrink-0">
                      <AlertTriangle size={24} />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-gray-900 dark:text-white mb-1">
                        Update Your Phone Number
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                        It looks like your phone number is missing or invalid.
                        Please update it to a valid 10-digit number to receive
                        order updates.
                      </p>
                      {!isEditing && (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="text-sm font-bold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1"
                        >
                          Update Now <ChevronRight size={14} />
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
                {/* ---------------------------------- */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-gray-200/50 dark:border-white/5 pb-6">
                  <div>
                    <h2 className={titleClass + " mb-1"}>
                      Personal Information
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      Manage your personal details.
                    </p>
                  </div>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className={secondaryBtnClass}
                    >
                      <Edit size={16} /> Edit Profile
                    </button>
                  ) : (
                    <div className="flex gap-3 w-full sm:w-auto">
                      <button
                        onClick={handleProfileUpdate}
                        disabled={loading}
                        className={primaryBtnClass + " flex-1 sm:flex-none"}
                      >
                        {loading ? (
                          <span className="animate-spin">❄️</span>
                        ) : (
                          <Save size={18} />
                        )}{" "}
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setProfileData({
                            name: user.name,
                            phone: user.phone || "",
                          });
                        }}
                        className="px-4 py-2.5 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors text-sm font-medium flex items-center justify-center gap-2 flex-1 sm:flex-none"
                      >
                        <X size={18} /> Cancel
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                  <div className={inputGroupClass + " lg:col-span-2"}>
                    <label className={labelClass}>
                      <User
                        size={18}
                        className="text-blue-600 dark:text-blue-400"
                      />{" "}
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) =>
                        setProfileData({ ...profileData, name: e.target.value })
                      }
                      disabled={!isEditing}
                      className={inputClass}
                    />
                  </div>

                  <div className={inputGroupClass}>
                    <label className={labelClass}>
                      <Mail
                        size={18}
                        className="text-blue-600 dark:text-blue-400"
                      />{" "}
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className={`${inputClass} opacity-70`}
                    />
                  </div>

                  <div className={inputGroupClass}>
                    <label className={labelClass}>
                      <Phone
                        size={18}
                        className="text-blue-600 dark:text-blue-400"
                      />{" "}
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          phone: e.target.value,
                        })
                      }
                      disabled={!isEditing}
                      className={inputClass}
                      placeholder="+91 99999 99999"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* ORDERS TAB */}
            {activeTab === "orders" && (
              <motion.div
                key="orders"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className={glassCardClass}
              >
                <h2 className={titleClass}>Order History</h2>
                <div className="flex flex-col items-center justify-center py-16 text-center rounded-3xl bg-blue-50/50 dark:bg-black/20 border border-blue-100 dark:border-white/5">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-full flex items-center justify-center mb-6 shadow-inner">
                    <Package
                      size={40}
                      className="text-blue-600 dark:text-blue-400 drop-shadow-sm"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    No orders yet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                    Once you place orders, they will appear here. Start shopping
                    now!
                  </p>
                  <a href="/orders" className={primaryBtnClass}>
                    Browse Products
                  </a>
                </div>
              </motion.div>
            )}

            {/* ADDRESSES TAB */}
            {activeTab === "addresses" && (
              <motion.div
                key="addresses"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className={glassCardClass}
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-gray-200/50 dark:border-white/5 pb-6">
                  <div>
                    <h2 className={titleClass + " mb-1"}>Saved Addresses</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      Manage your delivery locations.
                    </p>
                  </div>
                  <button
                    onClick={() => openAddressModal()}
                    className={primaryBtnClass + " w-full sm:w-auto"}
                  >
                    <Plus size={18} /> Add New Address
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {user.addresses && user.addresses.length > 0 ? (
                    user.addresses.map((address, index) => (
                      <motion.div
                        key={address._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative bg-white/60 dark:bg-white/5 border border-white/40 dark:border-white/10 rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group backdrop-blur-md"
                      >
                        {/* Gradient Border Effect on Hover */}
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"></div>

                        {address.isDefault && (
                          <span className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1 rounded-full shadow-sm">
                            Default
                          </span>
                        )}

                        <div className="flex items-center gap-4 mb-5">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 flex items-center justify-center text-blue-600 dark:text-blue-300 shadow-sm">
                            {address.addressType === "Home" ? (
                              <Home size={22} />
                            ) : (
                              <Building size={22} />
                            )}
                          </div>
                          <div>
                            <span className="font-bold text-lg text-gray-900 dark:text-white">
                              {address.addressType}
                            </span>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Delivery Address
                            </p>
                          </div>
                        </div>

                        <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1.5 mb-6 pl-1">
                          <p className="font-medium">{address.street}</p>
                          <p>
                            {address.city}, {address.state}
                          </p>
                          <p className="font-semibold text-blue-600 dark:text-blue-400">
                            PIN: {address.pincode}
                          </p>
                        </div>

                        <div className="flex items-center gap-3 pt-4 border-t border-gray-200/50 dark:border-white/10">
                          <button
                            onClick={() => openAddressModal(address)}
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-white/5 hover:bg-blue-50 dark:hover:bg-white/10 hover:text-blue-700 dark:hover:text-white rounded-xl transition-all"
                          >
                            <Edit size={16} /> Edit
                          </button>
                          <button
                            onClick={() => handleDeleteAddress(address._id)}
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-xl transition-all"
                          >
                            <Trash2 size={16} /> Delete
                          </button>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="col-span-full py-16 text-center text-gray-500 dark:text-gray-400 bg-blue-50/50 dark:bg-black/20 rounded-3xl border border-dashed border-blue-200 dark:border-white/10 backdrop-blur-sm">
                      <MapPin
                        size={48}
                        className="mx-auto mb-4 text-blue-400/50"
                      />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        No addresses saved
                      </h3>
                      <p>Add an address for faster checkout.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.main>
      </div>

      {/* --- Glassmorphism Address Modal (FIXED & PINCODE AUTO-FETCH) --- */}
      <AnimatePresence>
        {showAddressModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowAddressModal(false);
                resetAddressForm();
              }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white/90 dark:bg-[#1a1f2e]/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 dark:border-white/10 overflow-hidden z-10 flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200/50 dark:border-white/10 flex justify-between items-center bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-white/5 dark:to-white/5">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  {editingAddress ? (
                    <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600">
                      <Edit size={16} />
                    </div>
                  ) : (
                    <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600">
                      <Plus size={16} />
                    </div>
                  )}
                  {editingAddress ? "Edit Address" : "New Address"}
                </h3>
                <button
                  onClick={() => {
                    setShowAddressModal(false);
                    resetAddressForm();
                  }}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white transition-colors p-1.5 hover:bg-black/5 dark:hover:bg-white/10 rounded-full"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Form Body */}
              <div className="p-6 overflow-y-auto custom-scrollbar">
                <div className="space-y-5">
                  {/* Address Type (Chips) */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">
                      Address Type
                    </label>
                    <div className="flex gap-3">
                      {["Home", "Work", "Other"].map((type) => {
                        const isActive = addressData.addressType === type;
                        return (
                          <button
                            key={type}
                            onClick={() =>
                              setAddressData({
                                ...addressData,
                                addressType: type,
                              })
                            }
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border ${
                              isActive
                                ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/25 scale-[1.02]"
                                : "bg-white dark:bg-black/20 border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5"
                            }`}
                          >
                            {type === "Home" && <Home size={16} />}
                            {type === "Work" && <Building size={16} />}
                            {type === "Other" && <MapPin size={16} />}
                            {type}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Pincode Input with Auto-Fetch */}
                  <div>
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1 mb-1.5 flex justify-between">
                      <span>Pincode</span>
                      {fetchingPincode && (
                        <span className="text-blue-600 flex items-center gap-1">
                          <Loader2 size={12} className="animate-spin" /> Finding
                          Location...
                        </span>
                      )}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={addressData.pincode}
                        onChange={handlePincodeChange}
                        placeholder="Enter 6-digit Pincode"
                        maxLength={6}
                        className={
                          inputClass +
                          " py-2.5 text-sm font-mono tracking-wide pr-10"
                        }
                      />
                      {addressData.pincode.length === 6 && !fetchingPincode && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
                          <Check size={18} />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* City & State (Auto-filled) */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1 mb-1.5 block">
                        City
                      </label>
                      <input
                        type="text"
                        value={addressData.city}
                        readOnly // Auto-filled కాబట్టి readOnly పెట్టచ్చు, లేదా ఎడిట్ కి వదిలేయచ్చు
                        onChange={(e) =>
                          setAddressData({
                            ...addressData,
                            city: e.target.value,
                          })
                        }
                        placeholder="Auto-filled"
                        className={`${inputClass} py-2.5 text-sm ${addressData.city ? "bg-blue-50/50 dark:bg-blue-900/10" : ""}`}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1 mb-1.5 block">
                        State
                      </label>
                      <input
                        type="text"
                        value={addressData.state}
                        readOnly
                        onChange={(e) =>
                          setAddressData({
                            ...addressData,
                            state: e.target.value,
                          })
                        }
                        placeholder="Auto-filled"
                        className={`${inputClass} py-2.5 text-sm ${addressData.state ? "bg-blue-50/50 dark:bg-blue-900/10" : ""}`}
                      />
                    </div>
                  </div>

                  {/* Street Address */}
                  <div>
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1 mb-1.5 block">
                      Street Address / Area
                    </label>
                    <textarea
                      value={addressData.street}
                      onChange={(e) =>
                        setAddressData({
                          ...addressData,
                          street: e.target.value,
                        })
                      }
                      placeholder="Flat No, Building, Landmark"
                      rows={2}
                      className={inputClass + " text-sm resize-none py-2.5"}
                    />
                  </div>

                  {/* Default Checkbox */}
                  <div
                    onClick={() =>
                      setAddressData({
                        ...addressData,
                        isDefault: !addressData.isDefault,
                      })
                    }
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      addressData.isDefault
                        ? "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800"
                        : "bg-gray-50 border-gray-200 dark:bg-white/5 dark:border-white/10"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${
                        addressData.isDefault
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 dark:bg-white/20"
                      }`}
                    >
                      {addressData.isDefault && (
                        <Check size={14} strokeWidth={3} />
                      )}
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Use as default delivery address
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 pt-2 bg-white/50 dark:bg-black/20 backdrop-blur-sm border-t border-gray-100 dark:border-white/5">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={
                    editingAddress ? handleUpdateAddress : handleAddAddress
                  }
                  disabled={loading || fetchingPincode} // Pincode తెస్తున్నప్పుడు డిసేబుల్
                  className={
                    "w-full " +
                    primaryBtnClass +
                    " py-3.5 text-sm shadow-xl shadow-blue-500/20"
                  }
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 size={16} className="animate-spin" />
                      Saving...
                    </div>
                  ) : (
                    <>{editingAddress ? "Update Address" : "Save Address"}</>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Updated Loading Skeleton to match new style
function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black pt-24 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/4 h-96 bg-white/50 dark:bg-white/5 backdrop-blur-xl rounded-3xl border border-white/20 animate-pulse shadow-xl" />
        <div className="flex-1 h-[32rem] bg-white/50 dark:bg-white/5 backdrop-blur-xl rounded-3xl border border-white/20 animate-pulse shadow-xl" />
      </div>
    </div>
  );
}
