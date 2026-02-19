"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { useAuth } from "@/hooks/useAuth";
import apiClient from "@/services/apiClient";
import toast from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  CreditCard,
  CheckCircle,
  Home,
  Building,
  Wallet,
  DollarSign,
  ShieldCheck,
  PackageCheck,
  Lock,
  ChevronRight,
  Gift,
  Car,
  Loader2,
  AlertCircle,
  Truck,
  ArrowLeft,
} from "lucide-react";
import { AddAddressModal } from "@/components/checkout/AddAddressModal";
import { loadRazorpayScript } from "@/utils/razorpay";

// --- LOADER COMPONENT ---
// --- PREMIUM ADAPTIVE LOADER ---
function CheckoutLoader({ message }: { message: string }) {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/90 dark:bg-[#020617]/95 backdrop-blur-xl transition-colors duration-500">
      {/* 1. Ambient Background Glow (Pulsing) */}
      <motion.div
        animate={{ opacity: [0.4, 0.7, 0.4], scale: [1, 1.1, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-[500px] h-[500px] bg-blue-300/30 dark:bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"
      />

      <div className="relative flex flex-col items-center justify-center gap-10 z-10">
        {/* 2. Advanced Multi-Ring Spinner */}
        <div className="relative h-32 w-32">
          {/* Outer Ring: Rotating Clockwise */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-blue-600 border-r-blue-600/30 dark:border-t-cyan-400 dark:border-r-cyan-400/30 shadow-[0_0_15px_rgba(59,130,246,0.2)] dark:shadow-[0_0_20px_rgba(34,211,238,0.2)]"
          />

          {/* Inner Ring: Rotating Counter-Clockwise */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-4 rounded-full border-[3px] border-transparent border-b-indigo-500 border-l-indigo-500/30 dark:border-b-blue-600 dark:border-l-blue-600/30"
          />

          {/* Center Core with Icon */}
          <div className="absolute inset-0 m-auto h-16 w-16 rounded-full bg-gradient-to-br from-white to-gray-50 dark:from-[#0f172a] dark:to-[#020617] shadow-xl flex items-center justify-center border border-gray-100 dark:border-blue-900/50">
            <ShieldCheck
              size={32}
              className="text-blue-600 dark:text-cyan-400 animate-[pulse_2s_infinite]"
            />
          </div>
        </div>

        {/* 3. Branding & Message */}
        <div className="text-center space-y-3">
          {/* Brand Name with Adaptive Gradient */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl md:text-3xl font-black tracking-[0.2em] font-sans uppercase text-transparent bg-clip-text bg-gradient-to-r from-blue-900 via-blue-600 to-indigo-900 dark:from-white dark:via-cyan-200 dark:to-blue-500"
          >
            VARSHINI HYUNDAI
          </motion.h1>

          {/* Dynamic Status Message */}
          <motion.div
            key={message}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
            <p className="text-xs font-bold tracking-[0.3em] uppercase text-blue-800/70 dark:text-blue-300/80">
              {message}
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// --- SKELETON LOADER ---
function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#020617] pt-24 pb-12 px-4 max-w-7xl mx-auto">
      <div className="h-10 w-48 bg-gray-200 dark:bg-white/5 rounded-xl animate-pulse mb-8" />
      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white dark:bg-white/5 rounded-[2rem] p-8 h-[200px] animate-pulse" />
          <div className="bg-white dark:bg-white/5 rounded-[2rem] p-8 h-[150px] animate-pulse" />
        </div>
        <div className="lg:col-span-4">
          <div className="bg-white dark:bg-white/5 rounded-[2rem] p-8 h-[400px] animate-pulse" />
        </div>
      </div>
    </div>
  );
}

// --- HELPER FOR IMAGES ---
const getImageUrl = (imagePath: string | undefined) => {
  if (!imagePath) return "/placeholder-part.png";
  if (imagePath.startsWith("http")) return imagePath;
  return `${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "")}/${imagePath.startsWith("/") ? imagePath.slice(1) : imagePath}`;
};

// --- TYPES ---
interface Address {
  _id: string;
  addressType: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
  phone?: string;
}

type PaymentMethod = "Razorpay" | "COD";

export default function CheckoutPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { cart, setCart } = useStore();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod>("COD");

  const [dataLoading, setDataLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [userGarage, setUserGarage] = useState<{
    model: string;
    year: number;
  } | null>(null);

  // --- INITIALIZATION ---
  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    const savedGarage = localStorage.getItem("myGarage");
    if (savedGarage) setUserGarage(JSON.parse(savedGarage));

    const initCheckout = async () => {
      setDataLoading(true);
      try {
        // Fetch Cart
        const cartRes = await apiClient.get("/cart");
        if (cartRes.data.success) {
          const fetchedCart = cartRes.data.data.cart;
          if (!fetchedCart || fetchedCart.items.length === 0) {
            toast.error("Your cart is empty");
            router.replace("/cart");
            return;
          }
          setCart(fetchedCart);
        }

        // Fetch Addresses
        const profileRes = await apiClient.get("/auth/profile");
        if (profileRes.data.success) {
          const userAddresses = profileRes.data.data.user.addresses || [];
          setAddresses(userAddresses);
          const defaultAddress = userAddresses.find(
            (addr: Address) => addr.isDefault,
          );
          if (defaultAddress) setSelectedAddressId(defaultAddress._id);
          else if (userAddresses.length > 0)
            setSelectedAddressId(userAddresses[0]._id);
        }
      } catch (error) {
        console.error("Checkout Init Error:", error);
        toast.error("Failed to load checkout details");
      } finally {
        setDataLoading(false);
      }
    };

    initCheckout();
  }, [authLoading, isAuthenticated, router, setCart]);

  const handleAddressAdded = useCallback(() => {
    setShowAddAddressModal(false);
    apiClient.get("/auth/profile").then((res) => {
      if (res.data.success) {
        const userAddresses = res.data.data.user.addresses || [];
        setAddresses(userAddresses);
        if (userAddresses.length === 1)
          setSelectedAddressId(userAddresses[0]._id);
      }
    });
    toast.success("Address added successfully");
  }, []);

  // const handlePlaceOrder = async () => {

  //   if (!selectedAddressId)
  //     return toast.error("Please select a delivery address");
  //   if (!cart || cart.items.length === 0) return toast.error("Cart is empty");

  //   setProcessing(true);
  //   try {
  //     const orderPayload = {
  //       shippingAddressId: selectedAddressId,
  //       paymentMethod: selectedPaymentMethod,
  //     };
  //     const response = await apiClient.post("/orders", orderPayload);

  //     if (response.data.success) {
  //       const orderId = response.data.data?.order?._id;
  //       toast.success("Order placed successfully!");
  //       setCart(null);
  //       router.push(`/orders/success?orderId=${orderId}`);
  //     } else {
  //       throw new Error(response.data.message || "Failed");
  //     }
  //   } catch (error: any) {
  //     console.error("Order Error:", error);
  //     toast.error(error.response?.data?.message || "Failed to place order");
  //     setProcessing(false);
  //   }
  // };

  // ---------------------------------------------------------
  // 🔥 PROFESSIONAL PAYMENT FLOW (REPLACE YOUR EXISTING FUNCTIONS)
  // ---------------------------------------------------------

  const handlePlaceOrder = async () => {
    if (!selectedAddressId)
      return toast.error("Please select a delivery address");
    if (!cart || cart.items.length === 0) return toast.error("Cart is empty");

    setProcessing(true);
    try {
      // 1. ముందుగా ఎప్పుడూ ఆర్డర్ క్రియేట్ చేయాలి (Pending Status)
      const orderPayload = {
        shippingAddressId: selectedAddressId,
        paymentMethod: selectedPaymentMethod, // "COD" or "Razorpay"
      };

      const response = await apiClient.post("/orders", orderPayload);

      if (response.data.success) {
        const orderId = response.data.data?.order?._id;

        // 2. ఒకవేళ కస్టమర్ COD కోరుకుంటే.. డైరెక్ట్ సక్సెస్ పేజీ!
        if (selectedPaymentMethod === "COD") {
          toast.success("Order placed successfully!");
          setCart(null);
          router.push(`/orders/success?orderId=${orderId}`);
        }
        // 3. ఆన్‌లైన్ పేమెంట్ అయితే.. Razorpay ని ట్రిగ్గర్ చేయాలి
        else if (selectedPaymentMethod === "Razorpay") {
          // ఇక్కడ await వాడొద్దు, ఎందుకంటే కింద catch బ్లాక్ ఫెయిల్ అవ్వకుండా చూసుకోవాలి
          initiateRazorpayPayment(orderId);
        }
      } else {
        throw new Error(response.data.message || "Failed to create order");
      }
    } catch (error: any) {
      console.error("Order Creation Error:", error);
      toast.error(error.response?.data?.message || "Failed to place order");
      setProcessing(false);
    }
  };

  const initiateRazorpayPayment = async (orderId: string) => {
    try {
      // 1. Load Script
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        toast.error("Failed to load payment gateway. Check your internet.");
        setProcessing(false);
        return;
      }

      // 2. Fetch Razorpay Order Details from Backend
      const { data } = await apiClient.post("/payments/create-razorpay-order", {
        orderId: orderId, // ముందే క్రియేట్ అయిన ఆర్డర్ ఐడీ ఇస్తున్నాం
      });

      const { razorpayOrderId, amount, currency, keyId } = data.data;

      // 3. Setup Razorpay Options
      const options = {
        key: keyId,
        amount: amount,
        currency: currency,
        name: "Varshini Hyundai Spares",
        description: "Premium Genuine Spare Parts",
        order_id: razorpayOrderId,

        // సక్సెస్ అయితే...
        handler: async function (response: any) {
          try {
            setProcessing(true); // Verification టైమ్ లో లోడర్
            const verifyRes = await apiClient.post(
              "/payments/verify-razorpay-payment",
              {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                orderId: orderId, // మన డేటాబేస్ ఆర్డర్ ఐడీ
              },
            );

            if (verifyRes.data.success) {
              toast.success("Payment Successful!");
              setCart(null); // పేమెంట్ అయ్యాక కార్ట్ క్లియర్
              router.push(`/orders/success?orderId=${orderId}`);
            }
          } catch (err: any) {
            toast.error("Payment Verification Failed!");
            router.push(`/orders/failed?orderId=${orderId}`);
          }
        },

        // పాప్-అప్ ని కస్టమర్ క్యాన్సిల్ చేస్తే (క్లోజ్ చేస్తే)
        modal: {
          ondismiss: function () {
            toast.error("Payment Cancelled");
            setProcessing(false);
            // ఆర్డర్ అయితే ప్లేస్ అయింది (Pending లాగా), కాబట్టి వాళ్లకి చూపిద్దాం
            router.push(`/orders/failed?orderId=${orderId}`);
          },
        },
        prefill: {
          name: "Customer", // మీ దగ్గర user state ఉంటే user.name వాడండి
          email: "customer@example.com",
        },
        theme: {
          color: "#2563EB",
        },
      };

      // 4. Open Razorpay Window
      const rzp = new (window as any).Razorpay(options);

      // ఒకవేళ కార్డ్ ఫెయిల్ అయితే (ఉదాహరణకు తప్పు OTP వేస్తే)
      rzp.on("payment.failed", async function (response: any) {
        await apiClient.post("/payments/payment-failed", {
          orderId,
          error: response.error,
        });
        toast.error(response.error.description || "Payment Failed");
        setProcessing(false);
        router.push(`/orders/failed?orderId=${orderId}`);
      });

      rzp.open();
    } catch (error: any) {
      console.error("Payment Initialization Error:", error);
      toast.error(error.response?.data?.message || "Could not start payment");
      setProcessing(false);
    }
  };

  // బటన్ మీద క్లిక్ చేయగానే డైరెక్ట్ గా ఆర్డర్ ప్లేస్ ఫంక్షన్ కే వెళ్తుంది.
  const handlePaymentClick = () => {
    handlePlaceOrder();
  };

  // ---------------------------------------------------------

  // --- HELPERS ---
  const checkFitment = (product: any) => {
    if (!userGarage || !product.compatibleModels) return null;
    return product.compatibleModels.some((item: any) => {
      const modelMatch = item.modelName
        .toLowerCase()
        .includes(userGarage.model.toLowerCase());
      const endYear = item.yearTo || new Date().getFullYear();
      return (
        modelMatch &&
        userGarage.year >= item.yearFrom &&
        userGarage.year <= endYear
      );
    });
  };

  const showSkeleton = authLoading || dataLoading;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#020617] text-gray-900 dark:text-white pt-24 pb-32 md:pb-16 relative font-sans transition-colors duration-500 overflow-x-hidden">
      {/* 🌌 Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/5 dark:bg-blue-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/5 dark:bg-purple-600/10 rounded-full blur-[120px]"></div>
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
      </div>

      <AnimatePresence>
        {processing && <CheckoutLoader message="Securing your Order..." />}
      </AnimatePresence>

      {/* Progress Header */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-white/80 dark:bg-[#020617]/80 backdrop-blur-xl z-40 border-b border-gray-200 dark:border-white/5 flex items-center justify-center shadow-sm">
        <div className="flex items-center gap-2 md:gap-6">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm">
            <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-xs border border-blue-200 dark:border-blue-500/30">
              1
            </span>
            Cart
          </div>
          <div className="w-8 h-[2px] bg-blue-600/30 rounded-full"></div>
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs shadow-lg shadow-blue-500/30">
              2
            </span>
            Checkout
          </div>
          <div className="w-8 h-[2px] bg-gray-300 dark:bg-white/10 rounded-full"></div>
          <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500 font-medium text-sm">
            <span className="w-6 h-6 rounded-full bg-gray-200 dark:bg-white/10 flex items-center justify-center text-xs">
              3
            </span>
            Done
          </div>
        </div>
      </div>

      {showSkeleton ? (
        <LoadingSkeleton />
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* --- BACK BUTTON SECTION --- */}
          <div className="mb-6">
            <Link
              href="/cart"
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
            >
              <div className="p-2 rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 group-hover:border-blue-500/50 transition-colors">
                <ArrowLeft size={16} />
              </div>
              Back to Cart
            </Link>
          </div>
          {/* Page Title */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <h1 className="text-3xl md:text-4xl font-black tracking-tight flex items-center gap-3">
              {/* Text Gradient */}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-700 via-blue-500 to-cyan-500 dark:from-blue-400 dark:via-cyan-400 dark:to-teal-300">
                Secure Checkout
              </span>

              {/* Icon with Matching Color */}
              <ShieldCheck
                className="text-blue-600 dark:text-cyan-400"
                strokeWidth={2.5}
              />
            </h1>
            <p className="text-gray-500 dark:text-slate-400 mt-2 font-medium flex items-center gap-2">
              <Lock size={14} className="text-emerald-500" /> All transactions
              are encrypted and secured.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
            {/* --- LEFT COLUMN: FORMS --- */}
            <div className="lg:col-span-8 space-y-8">
              {/* 1. ADDRESS SECTION */}
              <section className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-[2rem] p-6 md:p-8 shadow-sm relative overflow-hidden group">
                {/* Selection Highlight Line */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                <div className="flex justify-between items-center mb-6 relative z-10">
                  <h2 className="text-xl font-bold flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold shadow-lg shadow-blue-500/30">
                      1
                    </span>
                    Delivery Address
                  </h2>
                  <button
                    onClick={() => setShowAddAddressModal(true)}
                    className="text-xs font-bold bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-full hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors border border-blue-200 dark:border-blue-500/30 flex items-center gap-1"
                  >
                    <MapPin size={12} /> ADD NEW
                  </button>
                </div>

                {addresses.length === 0 ? (
                  <button
                    onClick={() => setShowAddAddressModal(true)}
                    className="w-full py-12 border-2 border-dashed border-gray-300 dark:border-white/10 rounded-2xl flex flex-col items-center justify-center text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-all group"
                  >
                    <div className="p-4 bg-gray-100 dark:bg-white/5 rounded-full mb-3 group-hover:bg-blue-50 dark:group-hover:bg-blue-500/10 transition-colors">
                      <MapPin size={24} />
                    </div>
                    <span className="font-semibold">
                      Add a Delivery Address
                    </span>
                  </button>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-4 relative z-10">
                    {addresses.map((address) => (
                      <div
                        key={address._id}
                        onClick={() => setSelectedAddressId(address._id)}
                        className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 group/card ${
                          selectedAddressId === address._id
                            ? "border-blue-500 bg-blue-50/50 dark:bg-blue-500/10 shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/20"
                            : "border-gray-100 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/20 bg-white dark:bg-black/20"
                        }`}
                      >
                        {selectedAddressId === address._id && (
                          <div className="absolute top-4 right-4 text-blue-500 bg-white dark:bg-[#020617] rounded-full shadow-sm">
                            <CheckCircle
                              size={20}
                              fill="currentColor"
                              className="text-white dark:text-blue-500"
                            />
                          </div>
                        )}
                        <div className="flex items-center gap-2 mb-3">
                          {address.addressType === "Home" ? (
                            <Home size={16} className="text-blue-500" />
                          ) : (
                            <Building size={16} className="text-purple-500" />
                          )}
                          <span className="font-bold text-sm uppercase tracking-wider text-gray-800 dark:text-gray-200">
                            {address.addressType}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed font-medium">
                          {address.street}, {address.city} <br />
                          <span className="text-gray-400 font-mono text-xs font-semibold">
                            {address.state} - {address.pincode}
                          </span>
                        </p>
                        {/* Hover Effect */}
                        <div className="absolute inset-0 border-2 border-blue-500/0 group-hover/card:border-blue-500/20 rounded-2xl transition-all pointer-events-none"></div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* 2. PAYMENT SECTION */}
              <section className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-[2rem] p-6 md:p-8 shadow-sm group">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500 opacity-0 group-hover:opacity-100 transition-opacity rounded-l-full"></div>
                <h2 className="text-xl font-bold flex items-center gap-3 mb-6">
                  <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold shadow-lg shadow-blue-500/30">
                    2
                  </span>
                  Payment Method
                </h2>

                <div className="space-y-4">
                  {/* COD Option */}
                  <div
                    onClick={() => setSelectedPaymentMethod("COD")}
                    className={`flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all relative overflow-hidden ${
                      selectedPaymentMethod === "COD"
                        ? "border-green-500 bg-green-50/50 dark:bg-green-500/10 shadow-lg shadow-green-500/10"
                        : "border-gray-100 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/20 bg-white dark:bg-black/20"
                    }`}
                  >
                    <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 flex items-center justify-center flex-shrink-0 border border-green-200 dark:border-green-500/30">
                      <DollarSign size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-base text-gray-900 dark:text-white">
                        Cash on Delivery
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        Pay securely with cash or UPI upon delivery.
                      </p>
                    </div>
                    {selectedPaymentMethod === "COD" && (
                      <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shadow-lg transform scale-110 transition-transform">
                        <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>

                  {/* Online Payment (Active now) */}
                  <div
                    onClick={() => setSelectedPaymentMethod("Razorpay")}
                    className={`flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all relative overflow-hidden ${
                      selectedPaymentMethod === "Razorpay"
                        ? "border-blue-500 bg-blue-50/50 dark:bg-blue-500/10 shadow-lg shadow-blue-500/10"
                        : "border-gray-100 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/20 bg-white dark:bg-black/20"
                    }`}
                  >
                    <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-500/20 text-blue-600 flex items-center justify-center flex-shrink-0 border border-blue-200 dark:border-blue-500/30">
                      <Wallet size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-base text-gray-900 dark:text-white">
                        Online Payment
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        UPI, Credit/Debit Cards, Net Banking
                      </p>
                    </div>
                    {selectedPaymentMethod === "Razorpay" && (
                      <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center shadow-lg transform scale-110 transition-transform">
                        <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="flex justify-center gap-6 mt-8 pt-6 border-t border-gray-200 dark:border-white/5 text-gray-400 dark:text-gray-500">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide">
                    <ShieldCheck size={16} className="text-green-500" /> Secure
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide">
                    <Lock size={16} className="text-blue-500" /> SSL Encrypted
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide">
                    <PackageCheck size={16} className="text-purple-500" />{" "}
                    Genuine
                  </div>
                </div>
              </section>
            </div>

            {/* --- RIGHT COLUMN: ORDER SUMMARY --- */}
            <div className="lg:col-span-4">
              <div className="sticky top-24 bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-[2rem] p-6 md:p-8 shadow-xl shadow-gray-200/50 dark:shadow-none">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                    Order Summary
                  </h2>
                  <span className="bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 text-xs font-bold px-2 py-1 rounded-md">
                    {cart?.totalItems} Items
                  </span>
                </div>

                {/* Items List */}
                <div className="space-y-4 mb-6 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                  {cart?.items.map((item: any) => {
                    const fits = checkFitment(item.product);
                    const image = item.product.images?.[0]?.url; // Safe Access

                    return (
                      <div
                        key={item._id}
                        className="flex gap-3 items-start group p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                      >
                        <div className="w-14 h-14 bg-white dark:bg-white/5 rounded-xl flex-shrink-0 relative overflow-hidden border border-gray-200 dark:border-white/10">
                          {image ? (
                            <Image
                              src={getImageUrl(image)}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <PackageCheck size={20} />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-900 dark:text-white truncate group-hover:text-blue-500 transition-colors">
                            {item.product.name}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mt-1">
                            <span className="font-mono bg-gray-100 dark:bg-white/10 px-1.5 rounded">
                              Qty: {item.quantity}
                            </span>
                            {fits && (
                              <span className="text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded flex items-center gap-0.5 font-bold border border-emerald-100 dark:border-emerald-500/20 text-[9px] uppercase tracking-wide">
                                <Car size={10} /> Fits Car
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="text-sm font-bold text-gray-900 dark:text-white">
                          ₹{(item.itemTotal || 0).toLocaleString()}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Coupon */}
                <div className="flex gap-2 p-1.5 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl mb-6 focus-within:border-blue-500 transition-colors">
                  <div className="pl-3 flex items-center text-gray-400">
                    <Gift size={18} />
                  </div>
                  <input
                    type="text"
                    placeholder="COUPON CODE"
                    value={couponCode}
                    onChange={(e) =>
                      setCouponCode(e.target.value.toUpperCase())
                    }
                    className="flex-1 bg-transparent border-none focus:ring-0 text-xs font-bold text-gray-900 dark:text-white placeholder-gray-400 uppercase outline-none"
                  />
                  <button
                    onClick={() => toast.success("Coupon feature coming soon!")}
                    className="bg-gray-900 dark:bg-white text-white dark:text-black px-4 py-2 rounded-lg text-xs font-bold hover:opacity-90 transition-opacity"
                  >
                    APPLY
                  </button>
                </div>

                {/* Calculations */}
                <div className="space-y-3 pt-4 border-t border-dashed border-gray-200 dark:border-white/10 text-sm font-medium">
                  <div className="flex justify-between text-gray-500 dark:text-gray-400">
                    <span>Subtotal</span>
                    <span className="text-gray-900 dark:text-white">
                      ₹{(cart?.subtotal || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-500 dark:text-gray-400">
                    <span>
                      GST & Taxes{" "}
                      <span className="text-[10px] bg-gray-100 dark:bg-white/10 px-1 rounded ml-1">
                        18%
                      </span>
                    </span>
                    <span className="text-gray-900 dark:text-white">
                      ₹{(cart?.tax || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-500 dark:text-gray-400">
                    <span>Shipping</span>
                    <span className="text-green-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                      <Truck size={12} />{" "}
                      {cart?.shippingCharges === 0
                        ? "FREE"
                        : `₹${cart?.shippingCharges}`}
                    </span>
                  </div>
                </div>

                {/* Total */}
                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-white/10 flex justify-between items-end">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider mb-1">
                      Total Payable
                    </p>
                    <p className="text-3xl font-black text-blue-600 dark:text-blue-400">
                      ₹{(cart?.totalAmount || 0).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Checkout Button (Desktop) */}
                <button
                  onClick={handlePaymentClick}
                  disabled={processing || !selectedAddressId}
                  className="hidden lg:flex w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/30 items-center justify-center gap-2 transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group border-t border-white/10"
                >
                  {processing ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <>
                      Confirm Order{" "}
                      <ChevronRight
                        size={20}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MOBILE STICKY BUTTON */}
      {!showSkeleton && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-[#020617]/90 backdrop-blur-xl border-t border-gray-200 dark:border-white/10 z-30 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.2)]">
          <div className="flex gap-4 items-center max-w-7xl mx-auto">
            <div className="flex-1">
              <p className="text-[10px] text-gray-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                Total Payable
              </p>
              <p className="text-xl font-black text-gray-900 dark:text-white">
                ₹{(cart?.totalAmount || 0).toLocaleString()}
              </p>
            </div>
            <button
              onClick={handlePaymentClick}
              disabled={processing || !selectedAddressId}
              className="flex-[1.5] bg-blue-600 text-white font-bold py-3.5 rounded-xl shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95 transition-transform"
            >
              {processing ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  Place Order <ChevronRight size={18} />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Address Modal */}
      <AnimatePresence>
        {showAddAddressModal && (
          <AddAddressModal
            onClose={() => setShowAddAddressModal(false)}
            onSuccess={handleAddressAdded}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
