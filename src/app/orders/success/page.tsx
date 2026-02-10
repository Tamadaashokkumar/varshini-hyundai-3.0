"use client";

import { useEffect, useState, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CheckCircle,
  ArrowRight,
  Sparkles,
  Loader2,
  MapPin,
  Truck,
  Copy,
  Check,
  Plus,
  ShoppingBag, // ✅ Added Plus Icon
} from "lucide-react";
import Confetti from "react-confetti";
import apiClient from "@/services/apiClient";
import toast from "react-hot-toast";

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 50 },
  },
};

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [showConfetti, setShowConfetti] = useState(true);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [deliveryDateString, setDeliveryDateString] =
    useState("Calculating...");

  // ✅ NEW: Upsell States
  const [upsellItems, setUpsellItems] = useState<any[]>([]);
  const [addingUpsell, setAddingUpsell] = useState<string | null>(null);

  useEffect(() => {
    // Window Resize for Confetti
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    if (typeof window !== "undefined") {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      window.addEventListener("resize", handleResize);
    }

    // Stop Confetti after 6s
    const timer = setTimeout(() => setShowConfetti(false), 6000);

    // Fetch Order
    if (orderId) {
      fetchOrderDetails(orderId);
    }

    return () => {
      clearTimeout(timer);
      if (typeof window !== "undefined")
        window.removeEventListener("resize", handleResize);
    };
  }, [orderId]);

  // ✅ NEW: Fetch Upsell Logic
  // ✅ FIX: Robust Upsell Fetch Logic
  useEffect(() => {
    // ఆర్డర్ ఐటమ్స్ ఉన్నాయో లేదో గట్టిగా చెక్ చేస్తున్నాం
    if (orderDetails && orderDetails.items && orderDetails.items.length > 0) {
      const fetchUpsells = async () => {
        try {
          const firstItem = orderDetails.items[0];

          // 🔥 CRITICAL FIX:
          // కొన్నిసార్లు product మొత్తం ఆబ్జెక్ట్ లా రావచ్చు ({_id: '...', name: '...'})
          // కొన్నిసార్లు కేవలం ID స్ట్రింగ్ లా రావచ్చు ('65b...')
          const anchorId =
            typeof firstItem.product === "object"
              ? firstItem.product?._id
              : firstItem.product;

          // ID దొరక్కపోతే ఇక్కడే ఆపేయాలి (API కాల్ చేయొద్దు)
          if (!anchorId) {
            console.log("No valid anchor product ID found");
            return;
          }

          const res = await apiClient.get(`/products/${anchorId}/smart-bundle`);

          if (res.data.success && res.data.data.suggestedAddons.length > 0) {
            // Filter Logic
            const orderedIds = orderDetails.items.map((i: any) =>
              typeof i.product === "object" ? i.product._id : i.product,
            );

            const suggestions = res.data.data.suggestedAddons.filter(
              (addon: any) => !orderedIds.includes(addon._id),
            );

            setUpsellItems(suggestions.slice(0, 2));
          }
        } catch (err) {
          console.error("Upsell fetch failed (Silent Fail)");
        }
      };

      fetchUpsells();
    }
  }, [orderDetails]);

  // ✅ NEW: Buy Upsell Function
  const handleBuyUpsell = async (product: any) => {
    setAddingUpsell(product._id);
    try {
      await apiClient.post("/cart/add", {
        productId: product._id,
        quantity: 1,
      });
      toast.success("Added to new cart!");
      // కావాలంటే ఇక్కడ డైరెక్ట్ గా Checkout కి పంపొచ్చు
      router.push("/cart");
    } catch (error) {
      toast.error("Failed to add");
    } finally {
      setAddingUpsell(null);
    }
  };

  // --- PERFECT DELIVERY LOGIC (Hyderabad Origin) ---
  const calculateDelivery = (address: any) => {
    if (!address) return;

    const pincode = address.pincode || "";
    const state = address.state || "";

    let deliveryDate = new Date();

    // 1. Cutoff Time Rule: After 2 PM, dispatch happens next day
    if (deliveryDate.getHours() >= 14) {
      deliveryDate.setDate(deliveryDate.getDate() + 1);
    }

    let daysToAdd = 7; // Default fallback

    // Logic based on Uppal/Hyderabad Origin
    const isLocalHyd =
      pincode.startsWith("500") ||
      pincode.startsWith("501") ||
      pincode.startsWith("502");
    const isSouthMetro = pincode.startsWith("560") || pincode.startsWith("600"); // Bangalore/Chennai

    if (isLocalHyd) {
      daysToAdd = 2; // Local delivery
    } else if (state === "Telangana") {
      daysToAdd = 3; // Rest of TS
    } else if (state === "Andhra Pradesh") {
      daysToAdd = 4; // AP
    } else if (
      isSouthMetro ||
      ["Karnataka", "Tamil Nadu", "Maharashtra", "Kerala"].includes(state)
    ) {
      daysToAdd = 5; // South/West
    } else if (
      [
        "Assam",
        "Manipur",
        "Meghalaya",
        "Mizoram",
        "Nagaland",
        "Tripura",
        "Jammu and Kashmir",
      ].includes(state)
    ) {
      daysToAdd = 9; // Remote areas
    } else {
      daysToAdd = 7; // North India
    }

    deliveryDate.setDate(deliveryDate.getDate() + daysToAdd);

    // 2. Sunday Rule: Skip Sunday delivery
    if (deliveryDate.getDay() === 0) {
      deliveryDate.setDate(deliveryDate.getDate() + 1);
    }

    setDeliveryDateString(
      deliveryDate.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      }),
    );
  };

  const fetchOrderDetails = async (id: string) => {
    setLoading(true);
    try {
      const response = await apiClient.get(`/orders/${id}`);
      if (response.data.success) {
        const data = response.data.data.order || response.data.data;
        setOrderDetails(data);
        // Calculate delivery once data is available
        calculateDelivery(data.shippingAddress);
      }
    } catch (error) {
      console.error("Failed to fetch order details", error);
    } finally {
      setLoading(false);
    }
  };

  const copyOrderId = () => {
    if (orderDetails?.orderNumber) {
      navigator.clipboard.writeText(orderDetails.orderNumber);
      setCopied(true);
      toast.success("Order ID Copied!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // ✅ SOUND EFFECT: Custom MP3 File
  useEffect(() => {
    const audio = new Audio("/sounds/success.mp3");

    // ఆడియో ప్లే చేయడానికి ట్రై చేస్తుంది
    const playAudio = async () => {
      try {
        await audio.play();
      } catch (err) {
        console.log("Audio play blocked by browser:", err);
      }
    };

    setTimeout(playAudio, 500); // 0.5 sec delay
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 z-[9999] bg-white dark:bg-[#020617] flex flex-col items-center justify-center overflow-hidden">
        {/* 1. Background Ambient Glow (Backdrop) */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px]"
          />
        </div>

        {/* 2. Main Animated Container */}
        <div className="relative z-10 flex flex-col items-center">
          {/* LOGO / ICON ANIMATION */}
          <div className="relative mb-8">
            {/* Spinning Gradient Ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-32 h-32 rounded-full border-4 border-transparent border-t-blue-500 border-r-purple-500 border-b-blue-500/30 border-l-purple-500/30"
            />

            {/* Reverse Spinning Inner Ring */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 w-24 h-24 m-auto rounded-full border-2 border-dashed border-gray-300 dark:border-gray-700"
            />

            {/* Central Bouncing Icon */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <ShoppingBag className="text-white w-8 h-8" />
              </div>
            </motion.div>

            {/* Sparkles Decoration */}
            <motion.div
              animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              className="absolute -top-2 -right-2"
            >
              <Sparkles
                className="text-yellow-400 w-6 h-6"
                fill="currentColor"
              />
            </motion.div>
          </div>

          {/* TEXT ANIMATION */}
          <div className="text-center space-y-2">
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400"
            >
              Processing Order
            </motion.h2>

            <p className="text-gray-500 dark:text-gray-400 font-medium flex items-center gap-1">
              Please wait while we confirm your payment
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                ...
              </motion.span>
            </p>
          </div>

          {/* PROGRESS BAR */}
          <div className="mt-8 w-64 h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 bg-[length:200%_100%]"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    // ✅ Updated Background: Light gray for Light Mode, Deep Blue for Dark Mode
    <div className="min-h-screen bg-gray-50 dark:bg-[#020617] text-gray-900 dark:text-white flex flex-col items-center justify-center p-4 pt-20 relative overflow-hidden font-sans transition-colors duration-300">
      {/* 🌌 Background Ambience (Adaptive) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/10 dark:bg-indigo-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] dark:opacity-[0.03]"></div>
      </div>

      {/* 🎉 Confetti */}
      {showConfetti && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <Confetti
            width={windowSize.width}
            height={windowSize.height}
            recycle={false}
            numberOfPieces={400}
            gravity={0.15}
            colors={["#3b82f6", "#6366f1", "#10b981", "#fbbf24"]}
          />
        </div>
      )}

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-2xl"
      >
        {/* --- 1. Success Icon Animation --- */}
        <motion.div
          variants={itemVariants}
          className="mb-8 flex justify-center"
        >
          <div className="relative">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/30 relative z-10"
            >
              <CheckCircle
                size={48}
                className="text-white drop-shadow-md"
                strokeWidth={3}
              />
            </motion.div>
            {/* Pulse Rings */}
            <div className="absolute inset-0 bg-green-500/30 rounded-full animate-ping delay-75"></div>
            <div className="absolute -inset-4 bg-green-500/10 rounded-full blur-xl"></div>
          </div>
        </motion.div>

        {/* --- 2. Title Section --- */}
        <motion.div variants={itemVariants} className="text-center mb-10">
          <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tight text-gray-900 dark:text-white dark:bg-clip-text dark:text-transparent dark:bg-gradient-to-b dark:from-white dark:to-white/70">
            Order Confirmed!
          </h1>
          <p className="text-gray-600 dark:text-slate-400 text-lg md:text-xl font-medium max-w-md mx-auto leading-relaxed">
            Thank you for your purchase. We have received your order and are
            getting it ready.
          </p>
        </motion.div>

        {/* --- 3. The "Receipt" Card (Glassmorphism Light/Dark) --- */}
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-[2rem] overflow-hidden shadow-2xl dark:shadow-none relative"
        >
          {/* Top decorative gradient line */}
          <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

          <div className="p-6 md:p-8">
            {/* Header: ID & Copy */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-gray-100 dark:border-white/10 pb-6 mb-6">
              <div className="text-center md:text-left">
                <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-widest font-bold mb-1">
                  Order ID
                </p>
                <div
                  className="flex items-center gap-2 group cursor-pointer"
                  onClick={copyOrderId}
                >
                  <p className="text-xl md:text-2xl font-mono font-bold text-gray-900 dark:text-white tracking-wide">
                    {orderDetails?.orderNumber || orderId || "Loading..."}
                  </p>
                  <button className="p-1.5 rounded-lg bg-gray-100 dark:bg-white/5 group-hover:bg-gray-200 dark:group-hover:bg-white/10 transition-colors text-gray-500 dark:text-slate-400">
                    {copied ? (
                      <Check
                        size={14}
                        className="text-green-500 dark:text-green-400"
                      />
                    ) : (
                      <Copy size={14} />
                    )}
                  </button>
                </div>
              </div>
              {/* Status Pill */}
              <div className="px-4 py-1.5 rounded-full bg-green-100 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 text-green-700 dark:text-green-400 text-sm font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Processing
              </div>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-10 space-y-4">
                <Loader2 className="animate-spin text-blue-500 w-10 h-10" />
                <p className="text-gray-500 dark:text-slate-500 text-sm">
                  Fetching order details...
                </p>
              </div>
            ) : (
              <>
                {/* Order Timeline */}
                <div className="mb-8">
                  <div className="flex justify-between mb-2">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                      Placed
                    </span>
                    <span className="text-xs font-bold text-gray-500 dark:text-slate-600">
                      Shipped
                    </span>
                    <span className="text-xs font-bold text-gray-500 dark:text-slate-600">
                      Delivered
                    </span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "33%" }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-2 flex items-center gap-1">
                    <Sparkles
                      size={12}
                      className="text-yellow-500 dark:text-yellow-400"
                    />
                    We are currently processing your items.
                  </p>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 dark:bg-white/5 rounded-2xl p-5 border border-gray-100 dark:border-white/5">
                  {/* Delivery Info */}
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-500/20 rounded-lg text-blue-600 dark:text-blue-400">
                        <Truck size={18} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-slate-400 font-bold uppercase">
                          Estimated Delivery
                        </p>
                        <p className="text-gray-900 dark:text-white font-semibold">
                          {deliveryDateString}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-purple-100 dark:bg-purple-500/20 rounded-lg text-purple-600 dark:text-purple-400">
                        <MapPin size={18} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-slate-400 font-bold uppercase">
                          Shipping To
                        </p>
                        <p className="text-gray-900 dark:text-white font-semibold text-sm line-clamp-1">
                          {orderDetails?.shippingAddress?.city ||
                            "Your Location"}
                          , {orderDetails?.shippingAddress?.state}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Payment Summary */}
                  <div className="space-y-3 border-t md:border-t-0 md:border-l border-gray-200 dark:border-white/10 pt-4 md:pt-0 md:pl-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-slate-400">
                        Items ({orderDetails?.items?.length})
                      </span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        ₹{orderDetails?.subtotal?.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-slate-400">
                        Shipping
                      </span>
                      <span className="text-green-600 dark:text-green-400 font-medium">
                        Free
                      </span>
                    </div>
                    <div className="h-px bg-gray-200 dark:bg-white/10 my-1"></div>
                    <div className="flex justify-between text-base">
                      <span className="text-gray-900 dark:text-white font-bold">
                        Total Paid
                      </span>
                      <span className="text-xl font-black text-blue-600 dark:text-blue-400">
                        ₹{orderDetails?.totalAmount?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Bottom Actions Bar */}
          <div className="bg-gray-50 dark:bg-white/5 p-4 md:p-6 flex flex-col sm:flex-row gap-3 justify-end items-center">
            {/* Invoice Button Removed as Requested */}

            <div className="flex gap-3 w-full sm:w-auto">
              <button
                onClick={() => router.push("/orders")}
                className="flex-1 sm:flex-none py-2.5 px-5 rounded-xl bg-white dark:bg-white/10 hover:bg-gray-100 dark:hover:bg-white/20 text-gray-900 dark:text-white font-semibold transition-all border border-gray-200 dark:border-white/5 shadow-sm"
              >
                Track Order
              </button>
              <button
                onClick={() => router.push("/")}
                className="flex-1 sm:flex-none py-2.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 group"
              >
                Continue Shopping
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
            </div>
          </div>
        </motion.div>

        {/* ================= 🔥 NEW: POST-PURCHASE UPSELL 🔥 ================= */}
        {upsellItems.length > 0 && (
          <motion.div
            variants={itemVariants}
            className="mt-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 border border-blue-100 dark:border-white/5 rounded-[2rem] p-6 md:p-8 relative overflow-hidden"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 relative z-10">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles
                    size={16}
                    className="text-amber-500 animate-pulse"
                  />
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                    Exclusive Offer
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Did you forget these?
                </h3>
                <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
                  Customers who bought this also added these items.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
              {upsellItems.map((item) => (
                <div
                  key={item._id}
                  className="bg-white dark:bg-white/5 border border-white dark:border-white/5 p-4 rounded-2xl flex items-center gap-4 shadow-sm hover:shadow-md transition-all group"
                >
                  {/* Image */}
                  <div className="relative w-16 h-16 bg-gray-50 dark:bg-black/20 rounded-xl overflow-hidden flex-shrink-0">
                    {item.images?.[0]?.url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.images[0].url}
                        alt={item.name}
                        className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-500"
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm line-clamp-1">
                      {item.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-bold text-gray-900 dark:text-white text-sm">
                        ₹{(item.discountPrice || item.price).toLocaleString()}
                      </span>
                      {item.discountPrice && (
                        <span className="text-[10px] bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 px-1.5 py-0.5 rounded font-bold">
                          SAVE ₹
                          {(item.price - item.discountPrice).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Add Button */}
                  <button
                    onClick={() => handleBuyUpsell(item)}
                    disabled={addingUpsell === item._id}
                    className="w-10 h-10 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-600/20 transition-all active:scale-95 disabled:opacity-70 disabled:active:scale-100"
                  >
                    {addingUpsell === item._id ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <div className="relative">
                        <div className="absolute inset-0 bg-white/20 blur-sm rounded-full animate-ping"></div>
                        <Plus size={20} />
                      </div>
                    )}
                  </button>
                </div>
              ))}
            </div>

            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none"></div>
          </motion.div>
        )}

        {/* --- 4. Help Section --- */}
        <motion.div variants={itemVariants} className="mt-8 text-center">
          <p className="text-gray-500 dark:text-slate-500 text-sm">
            Need help?{" "}
            <a
              href="/chat"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Chat with support
            </a>{" "}
            or{" "}
            <a
              href="/orders"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              View details
            </a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 dark:bg-[#020617] flex items-center justify-center text-gray-900 dark:text-white">
          <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
