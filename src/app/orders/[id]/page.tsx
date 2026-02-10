"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Package,
  CheckCircle2,
  CreditCard,
  Calendar,
  AlertCircle,
  Phone,
  MapPin,
  XCircle,
  AlertTriangle,
  Truck,
  Download,
  RefreshCw,
  RotateCcw,
  Clock,
  ChevronRight,
  Receipt,
  Star,
} from "lucide-react";
import apiClient from "@/services/apiClient";
import toast from "react-hot-toast";
import Link from "next/link";
// Helper for images
const getImageUrl = (imagePath: string | undefined) => {
  if (!imagePath) return null;
  if (imagePath.startsWith("http")) return imagePath;
  const cleanPath = imagePath.startsWith("/") ? imagePath.slice(1) : imagePath;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "";
  return `${baseUrl}/${cleanPath}`;
};

const ORDER_STEPS = ["Placed", "Confirmed", "Shipped", "Delivered"];

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // --- Modals State ---
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedItemForReturn, setSelectedItemForReturn] = useState<any>(null);

  const [reason, setReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchOrderDetails();
    }
  }, [params.id]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/orders/${params.id}`);
      if (response.data.success && response.data.data.order) {
        setOrder(response.data.data.order);
      } else {
        setOrder(response.data.data);
      }
    } catch (error: any) {
      toast.error("Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  // --- 1. CANCEL ORDER ---
  const handleCancelOrder = async () => {
    if (!reason.trim()) {
      toast.error("Please provide a reason");
      return;
    }
    try {
      setIsProcessing(true);
      const response = await apiClient.put(`/orders/${params.id}/cancel`, {
        cancellationReason: reason,
      });
      if (response.data.success) {
        toast.success("Order cancelled");
        setShowCancelModal(false);
        setReason("");
        fetchOrderDetails();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Cancellation failed");
    } finally {
      setIsProcessing(false);
    }
  };

  // --- 2. RE-ORDER (Buy Again) ---
  const handleReorder = async () => {
    try {
      setIsProcessing(true);
      const response = await apiClient.post(`/orders/${params.id}/reorder`);
      if (response.data.success) {
        toast.success("Items added to cart!");
        router.push("/cart");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to reorder");
    } finally {
      setIsProcessing(false);
    }
  };

  // --- 3. DOWNLOAD INVOICE ---
  const handleDownloadInvoice = async () => {
    try {
      toast.loading("Generating Invoice...");
      const response = await apiClient.get(`/orders/${params.id}/invoice`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `INV-${order.orderNumber}.pdf`);
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.dismiss();
      toast.success("Invoice Downloaded");
    } catch (error: any) {
      // 🔥 FIX: Add ': any' here
      console.error("Download error:", error);
      toast.dismiss();

      // ఇప్పుడు మీరు error.response ని యాక్సెస్ చేయవచ్చు
      const msg =
        error?.response?.data?.message || "Failed to download invoice";
      toast.error(msg);
    }
  };

  // --- 4. RETURN ITEM ---
  const handleReturnItem = async () => {
    if (!reason.trim()) return toast.error("Please provide a reason");
    try {
      setIsProcessing(true);
      const response = await apiClient.put(
        `/orders/${order._id}/return/${selectedItemForReturn._id}`,
        { reason },
      );
      if (response.data.success) {
        toast.success("Return request submitted");
        setShowReturnModal(false);
        setReason("");
        fetchOrderDetails();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Request failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const getProgressWidth = (status: string) => {
    if (!status || status === "Cancelled") return 0;
    const index = ORDER_STEPS.indexOf(status);
    if (index === -1) return 0;
    return ((index + 1) / ORDER_STEPS.length) * 100;
  };

  const isStepCompleted = (step: string, currentStatus: string) => {
    if (!currentStatus || currentStatus === "Cancelled") return false;
    const stepIndex = ORDER_STEPS.indexOf(step);
    const currentIndex = ORDER_STEPS.indexOf(currentStatus);
    return stepIndex <= currentIndex;
  };

  // --- Loading State (Branded) ---
  if (loading) {
    return (
      // 1. Background: Light Mode లో White, Dark Mode లో మీ పాత Dark Blue
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white dark:bg-[#050B14] overflow-hidden transition-colors duration-300">
        {/* --- Background Ambience --- */}
        {/* Light: Subtle Blue Glow | Dark: Deep Blue Glow */}
        <motion.div
          initial={{ opacity: 0.3, scale: 0.8 }}
          animate={{ opacity: 0.6, scale: 1.2 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute h-96 w-96 rounded-full bg-blue-100 dark:bg-blue-700/10 blur-[120px]"
        />

        <div className="relative flex flex-col items-center justify-center gap-10 z-10">
          {/* --- Brand Name --- */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-blue-900 via-blue-600 to-blue-900 dark:from-blue-400 dark:via-white dark:to-blue-400 font-sans uppercase">
              VARSHINI HYUNDAI
            </h1>
            <p className="text-xs tracking-[0.5em] uppercase font-medium text-blue-800/70 dark:text-blue-400/80">
              Retrieving Order Details...
            </p>
          </div>

          {/* --- Spinner Animation --- */}
          <div className="relative h-24 w-24 mt-4">
            {/* Outer Ring */}
            <div
              className="absolute inset-0 box-border rounded-full border-[3px] border-l-transparent shadow-[0_0_20px_rgba(37,99,235,0.2)] dark:shadow-[0_0_20px_rgba(59,130,246,0.2)] animate-spin border-t-blue-600 border-r-transparent border-b-blue-100 dark:border-t-blue-500 dark:border-b-blue-500/30"
              style={{ animationDuration: "2s" }}
            />

            {/* Inner Ring */}
            <div
              className="absolute inset-4 box-border rounded-full border-[3px] border-t-transparent border-b-transparent animate-spin border-r-cyan-600 border-l-cyan-100 dark:border-r-cyan-400 dark:border-l-cyan-400/50"
              style={{
                animationDuration: "1.5s",
                animationDirection: "reverse",
              }}
            />

            {/* Center Icon Background */}
            <div className="absolute inset-0 m-auto h-10 w-10 flex items-center justify-center rounded-full bg-gradient-to-tr from-white to-blue-50 dark:from-blue-900 dark:to-[#050B14] border border-blue-200 dark:border-blue-500/30">
              <Receipt
                size={18}
                className="text-blue-700 dark:text-blue-400 animate-pulse"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Not Found
  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-[#030712] text-gray-900 dark:text-white p-4">
        <div className="w-20 h-20 bg-red-50 dark:bg-red-900/10 rounded-full flex items-center justify-center mb-6">
          <AlertCircle size={40} className="text-red-500" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Order Not Found</h2>
        <p className="text-gray-500 mb-8">
          We couldn't find the order you're looking for.
        </p>
        <button
          onClick={() => router.push("/orders")}
          className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-black rounded-xl font-bold hover:opacity-90 transition-opacity"
        >
          Return to Orders
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#030712] text-gray-900 dark:text-white p-4 md:p-8 pt-24 md:pt-28 relative transition-colors duration-500 overflow-hidden">
      {/* 🌌 Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-500/5 dark:bg-blue-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-indigo-500/5 dark:bg-purple-600/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Navigation & Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
          <div>
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mb-4 transition-colors group"
            >
              <div className="p-1.5 rounded-full bg-gray-100 dark:bg-white/10 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
                <ArrowLeft size={16} />
              </div>
              Back to Orders
            </button>
            <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-gray-900 dark:text-white">
                Order #{order.orderNumber}
              </h1>
              <span
                className={`w-fit px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border flex items-center gap-1.5 ${
                  order.orderStatus === "Cancelled"
                    ? "bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/50"
                    : order.orderStatus === "Delivered"
                      ? "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/50"
                      : "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/50"
                }`}
              >
                {order.orderStatus === "Cancelled" ? (
                  <XCircle size={14} />
                ) : (
                  <CheckCircle2 size={14} />
                )}
                {order.orderStatus}
              </span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 flex items-center gap-2 font-medium">
              <Calendar size={14} /> Placed on{" "}
              {new Date(order.createdAt).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {/* INVOICE BUTTON */}
            {order.orderStatus === "Delivered" && (
              <button
                onClick={handleDownloadInvoice}
                className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-white rounded-xl hover:bg-gray-50 dark:hover:bg-white/10 transition shadow-sm font-bold text-sm"
              >
                <Download size={16} /> Invoice
              </button>
            )}

            {/* RE-ORDER BUTTON */}
            <button
              onClick={handleReorder}
              disabled={isProcessing}
              className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-black rounded-xl hover:opacity-90 transition shadow-lg shadow-gray-200/50 dark:shadow-none disabled:opacity-50 font-bold text-sm"
            >
              {isProcessing ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <RefreshCw size={16} />
              )}
              Buy Again
            </button>

            {/* CANCEL BUTTON */}
            {["Placed", "Confirmed"].includes(order.orderStatus) && (
              <button
                onClick={() => setShowCancelModal(true)}
                className="flex items-center gap-2 px-5 py-2.5 text-red-600 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/20 transition font-bold text-sm"
              >
                Cancel Order
              </button>
            )}
          </div>
        </div>

        {/* TRACKING BAR (Timeline) */}
        {order.orderStatus !== "Cancelled" && (
          <div className="bg-white/60 dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-xl rounded-[2rem] p-8 mb-8 shadow-sm relative overflow-hidden">
            {/* Decorative BG Gradient */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/5 to-transparent rounded-full blur-3xl -z-10" />

            <h3 className="text-lg font-bold mb-8 flex items-center gap-2">
              <Truck size={20} className="text-blue-500" /> Tracking Status
            </h3>

            <div className="relative px-4">
              {/* Background Line */}
              <div className="absolute top-1/2 left-0 right-0 h-1.5 bg-gray-100 dark:bg-white/10 -translate-y-1/2 rounded-full mx-8 lg:mx-12" />

              {/* Progress Line */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${getProgressWidth(order.orderStatus)}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="absolute top-1/2 left-0 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 -translate-y-1/2 rounded-full z-0 mx-8 lg:mx-12 origin-left"
                style={{ maxWidth: "calc(100% - 64px)" }} // Adjust for padding
              />

              {/* Steps */}
              <div className="relative z-10 flex justify-between w-full">
                {ORDER_STEPS.map((step) => {
                  const completed = isStepCompleted(step, order.orderStatus);
                  const isCurrent = step === order.orderStatus;

                  return (
                    <div
                      key={step}
                      className="flex flex-col items-center gap-3"
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${
                          completed
                            ? "bg-white dark:bg-[#0A101F] border-blue-500 text-blue-500 shadow-lg shadow-blue-500/20 scale-110"
                            : "bg-gray-50 dark:bg-[#0A101F] border-gray-200 dark:border-white/10 text-gray-300 dark:text-gray-600"
                        }`}
                      >
                        {completed ? (
                          <CheckCircle2 size={18} strokeWidth={3} />
                        ) : (
                          <div className="w-2.5 h-2.5 bg-gray-300 dark:bg-gray-600 rounded-full" />
                        )}
                      </div>
                      <span
                        className={`text-xs md:text-sm font-bold tracking-wide ${completed ? "text-blue-600 dark:text-blue-400" : "text-gray-400 dark:text-gray-600"}`}
                      >
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* CANCELLED BANNER */}
        {order.orderStatus === "Cancelled" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-[2rem] p-6 mb-8 flex items-center gap-5"
          >
            <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-900/20 flex items-center justify-center text-red-600 dark:text-red-400 shadow-inner">
              <XCircle size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-red-900 dark:text-red-100">
                Order Cancelled
              </h3>
              <p className="text-sm text-red-700 dark:text-red-300/80 mt-1">
                Reason provided:{" "}
                <span className="font-semibold italic">
                  "{order.cancellationReason || "Not specified"}"
                </span>
              </p>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT: Items List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/80 dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-xl rounded-[2rem] p-6 md:p-8 shadow-sm">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Package size={20} className="text-blue-500" /> Items in Order
              </h3>

              <div className="space-y-4">
                {order.items.map((item: any) => {
                  const imageUrl = getImageUrl(
                    item.image || item.product?.images?.[0]?.url,
                  );
                  return (
                    <div
                      key={item._id}
                      className="group flex gap-4 p-4 bg-gray-50/50 dark:bg-black/20 rounded-2xl border border-gray-100 dark:border-white/5 hover:border-blue-200 dark:hover:border-blue-500/30 transition-colors"
                    >
                      {/* Product Image */}
                      <div className="relative w-20 h-20 bg-white dark:bg-white/5 rounded-xl overflow-hidden flex-shrink-0 border border-gray-200 dark:border-white/10">
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={item.name}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-400">
                            <Package size={24} />
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <h4 className="font-bold text-gray-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {item.name}
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-mono mt-1 bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded w-fit">
                              PN: {item.partNumber}
                            </p>
                          </div>
                          <p className="font-bold text-gray-900 dark:text-white text-lg">
                            ₹{item.subtotal?.toLocaleString()}
                          </p>
                        </div>

                        {/* 👇 ఈ బ్లాక్ ని అప్‌డేట్ చేయండి 👇 */}
                        <div className="flex justify-between items-end mt-2">
                          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                            Qty: {item.quantity} × ₹{item.price}
                          </p>

                          {/* 🔥 ACTIONS GROUP (Review & Return) */}
                          <div className="flex items-center gap-2">
                            {/* ✅ 1. REVIEW BUTTON (Only if Delivered) */}
                            {order.orderStatus === "Delivered" && (
                              <Link
                                href={`/products/${
                                  typeof item.product === "object"
                                    ? item.product?.slug
                                    : item.product
                                }#reviews`}
                                className="text-xs font-bold text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300 bg-cyan-50 dark:bg-cyan-900/20 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 border border-cyan-100 dark:border-cyan-900/30"
                              >
                                <Star size={12} /> Rate Product
                              </Link>
                            )}

                            {/* 🔄 2. RETURN BUTTON LOGIC (Existing Logic) */}
                            {order.orderStatus === "Delivered" &&
                              item.returnStatus === "None" && (
                                <button
                                  onClick={() => {
                                    setSelectedItemForReturn(item);
                                    setShowReturnModal(true);
                                  }}
                                  className="text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 border border-blue-100 dark:border-blue-900/30"
                                >
                                  <RotateCcw size={12} /> Return
                                </button>
                              )}

                            {/* 🏷️ 3. RETURN STATUS BADGE */}
                            {item.returnStatus !== "None" && (
                              <span
                                className={`text-xs px-2.5 py-1 rounded-lg border font-bold ${
                                  item.returnStatus === "Returned"
                                    ? "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-500/30"
                                    : "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-500/30"
                                }`}
                              >
                                {item.returnStatus === "Requested"
                                  ? "Return Requested"
                                  : item.returnStatus}
                              </span>
                            )}
                          </div>
                        </div>
                        {/* 👆 Update End 👆 */}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Timeline / Activity Log */}
            <div className="bg-white/80 dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-xl rounded-[2rem] p-6 md:p-8 shadow-sm">
              <h3 className="text-lg font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
                <Clock size={20} className="text-purple-500" /> Order History
              </h3>
              <div className="relative border-l-2 border-gray-100 dark:border-white/10 ml-3 space-y-8 pb-2">
                {order.statusHistory
                  ?.slice()
                  .reverse()
                  .map((history: any, idx: number) => (
                    <div key={idx} className="relative pl-8">
                      <div
                        className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 ${
                          idx === 0
                            ? "bg-purple-500 border-purple-500 ring-4 ring-purple-100 dark:ring-purple-900/30"
                            : "bg-gray-200 border-gray-300 dark:bg-gray-700 dark:border-gray-600"
                        }`}
                      />
                      <p className="text-sm font-bold text-gray-900 dark:text-white">
                        {history.status}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5 font-medium">
                        {new Date(history.timestamp).toLocaleString()}
                      </p>
                      {history.note && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 bg-gray-50 dark:bg-white/5 p-3 rounded-xl border border-gray-100 dark:border-white/5 italic">
                          "{history.note}"
                        </p>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* RIGHT: Info Cards */}
          <div className="space-y-6">
            {/* Summary Card */}
            <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/10 rounded-[2rem] p-6 shadow-xl shadow-gray-200/50 dark:shadow-none">
              <h3 className="text-lg font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
                <Receipt size={20} className="text-indigo-500" /> Order Summary
              </h3>
              <div className="space-y-4 text-sm font-medium">
                <div className="flex justify-between text-gray-500 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span className="text-gray-900 dark:text-white">
                    ₹{order.subtotal?.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-gray-500 dark:text-gray-400">
                  <span>Tax ({order.taxPercentage}%)</span>
                  <span className="text-gray-900 dark:text-white">
                    ₹{order.tax?.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-gray-500 dark:text-gray-400">
                  <span>Shipping</span>
                  <span className="text-gray-900 dark:text-white">
                    {order.shippingCharges === 0
                      ? "Free"
                      : `₹${order.shippingCharges}`}
                  </span>
                </div>

                {order.discountAmount > 0 && (
                  <div className="flex justify-between text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-lg">
                    <span>Discount</span>
                    <span>-₹{order.discountAmount}</span>
                  </div>
                )}

                <div className="border-t-2 border-dashed border-gray-200 dark:border-white/10 pt-4 flex justify-between items-end">
                  <span className="text-gray-900 dark:text-white font-bold">
                    Total Pay
                  </span>
                  <span className="text-2xl font-black text-blue-600 dark:text-blue-400">
                    ₹{order.totalAmount?.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gray-50 dark:bg-white/5 rounded-2xl flex items-center justify-between border border-gray-100 dark:border-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white dark:bg-white/10 rounded-lg text-gray-500">
                    <CreditCard size={18} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Method
                    </span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white uppercase">
                      {order.paymentMethod}
                    </span>
                  </div>
                </div>
                <span
                  className={`text-xs font-bold px-2 py-1 rounded uppercase ${order.paymentStatus === "Completed" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}
                >
                  {order.paymentStatus}
                </span>
              </div>
            </div>

            {/* Shipping Address Card */}
            <div className="bg-white/80 dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-xl rounded-[2rem] p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                <MapPin size={20} className="text-red-500" /> Delivery Address
              </h3>
              <div className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed space-y-1">
                <p className="font-bold text-gray-900 dark:text-white text-base">
                  {order.user?.name}
                </p>
                <p>{order.shippingAddress?.street}</p>
                <p>
                  {order.shippingAddress?.city}, {order.shippingAddress?.state}
                </p>
                <p className="font-mono text-gray-500 tracking-wide">
                  {order.shippingAddress?.pincode}
                </p>

                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/5 flex items-center gap-2 text-gray-900 dark:text-white font-medium">
                  <Phone size={14} className="text-gray-400" />{" "}
                  {order.shippingAddress?.phone}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- MODALS (Centered & Frosted) --- */}

      {/* Cancel Modal */}
      <AnimatePresence>
        {showCancelModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-[#0A101F] p-6 md:p-8 rounded-[2rem] w-full max-w-sm border border-gray-200 dark:border-white/10 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-red-500" />
              <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center text-red-600 mb-4">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                Cancel Order
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                Are you sure? This action cannot be undone and you will lose
                this order.
              </p>

              <div className="space-y-4">
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Please specify a reason..."
                  className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50 mb-2 h-24 resize-none text-gray-900 dark:text-white"
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowCancelModal(false)}
                    className="flex-1 py-3 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-sm font-bold text-gray-900 dark:text-white transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleCancelOrder}
                    disabled={isProcessing}
                    className="flex-1 py-3 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700 disabled:opacity-50 transition-colors shadow-lg shadow-red-500/20"
                  >
                    {isProcessing ? "Processing..." : "Confirm Cancel"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Return Modal */}
      <AnimatePresence>
        {showReturnModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-[#0A101F] p-6 md:p-8 rounded-[2rem] w-full max-w-sm border border-gray-200 dark:border-white/10 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-500" />
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-600 mb-4">
                <RotateCcw size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                Return Item
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                You are returning:{" "}
                <span className="font-bold text-gray-900 dark:text-white block mt-1">
                  {selectedItemForReturn?.name}
                </span>
              </p>

              <div className="space-y-4">
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Why are you returning this?"
                  className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 h-24 resize-none text-gray-900 dark:text-white"
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowReturnModal(false)}
                    className="flex-1 py-3 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-sm font-bold text-gray-900 dark:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReturnItem}
                    disabled={isProcessing}
                    className="flex-1 py-3 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-lg shadow-blue-500/20"
                  >
                    {isProcessing ? "Submitting..." : "Submit Request"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
