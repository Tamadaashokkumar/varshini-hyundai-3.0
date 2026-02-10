"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/store/useStore";

import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  Loader2,
  Truck,
  CheckCircle,
  AlertCircle,
  Zap,
  ArrowRight,
} from "lucide-react";
import apiClient from "@/services/apiClient";
import toast from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";
import CartDrawerUpsell from "./CartDrawerUpsell";

// --- HELPER: Safe Image URL ---
const getProductImage = (product: any) => {
  const image = product?.images?.[0]?.url;
  if (!image) return null;
  return image.startsWith("http")
    ? image
    : `${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "")}/${image}`;
};

export const CartDrawer = () => {
  const { user, isCartDrawerOpen, toggleCartDrawer, cart, setCart } =
    useStore();
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    if (isCartDrawerOpen) {
      fetchCart();
    }
  }, [isCartDrawerOpen]);

  const fetchCart = async () => {
    try {
      const response = await apiClient.get("/cart");
      if (response.data.success) {
        setCart(response.data.data.cart);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  const updateQuantity = async (
    itemId: string,
    newQty: number,
    maxStock: number,
  ) => {
    if (newQty < 1) return;
    if (newQty > maxStock) {
      toast.error(`Only ${maxStock} items available!`);
      return;
    }

    setUpdating(itemId);
    try {
      const response = await apiClient.put(`/cart/update/${itemId}`, {
        quantity: newQty,
      });
      if (response.data.success) {
        setCart(response.data.data.cart);
        toast.success("Cart updated");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update cart");
    } finally {
      setUpdating(null);
    }
  };

  const removeItem = async (itemId: string) => {
    setUpdating(itemId);
    try {
      const response = await apiClient.delete(`/cart/remove/${itemId}`);
      if (response.data.success) {
        setCart(response.data.data.cart);
        toast.success("Item removed");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to remove item");
    } finally {
      setUpdating(null);
    }
  };

  if (user?.role === "admin") {
    return null;
  }

  return (
    <AnimatePresence>
      {isCartDrawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCartDrawer}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[450px] bg-white dark:bg-[#0a0a0a] shadow-2xl z-[101] flex flex-col border-l border-gray-200 dark:border-white/10"
          >
            {/* --- HEADER --- */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-white/5 bg-white/50 dark:bg-white/[0.02] backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 dark:bg-blue-500/20 p-2 rounded-xl text-blue-600 dark:text-blue-400">
                  <ShoppingBag size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    Your Cart
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {cart?.totalItems || 0} items selected
                  </p>
                </div>
              </div>
              <button
                onClick={toggleCartDrawer}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* --- CONTENT AREA --- */}
            <div className="flex-1 overflow-y-auto p-5 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-white/10">
              {!cart || cart.items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                  <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-full">
                    <ShoppingBag
                      size={48}
                      className="text-gray-300 dark:text-gray-600"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Cart is empty
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Looks like you haven't added anything yet.
                    </p>
                  </div>
                  <button
                    onClick={toggleCartDrawer}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence>
                    {cart.items.map((item, index) => {
                      const imageUrl = getProductImage(item.product);
                      const isUpdating = updating === item._id;
                      const originalPrice = item.product.price;
                      const sellingPrice = item.price;
                      const hasDiscount = originalPrice > sellingPrice;

                      return (
                        <motion.div
                          key={item._id}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -50 }}
                          className="flex gap-4 p-3 bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-white/5 rounded-2xl group"
                        >
                          {/* Image */}
                          <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100 dark:bg-white/5 flex-shrink-0 border border-gray-100 dark:border-white/5">
                            {imageUrl ? (
                              <Image
                                src={imageUrl}
                                alt={item.product.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <ShoppingBag size={20} />
                              </div>
                            )}
                          </div>

                          {/* Details */}
                          <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <div>
                              <div className="flex justify-between items-start gap-2">
                                <h3 className="font-medium text-sm text-gray-900 dark:text-white truncate pr-4">
                                  {item.product.name}
                                </h3>
                                <button
                                  onClick={() => removeItem(item._id)}
                                  disabled={isUpdating}
                                  className="text-gray-400 hover:text-red-500 p-1 rounded hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                                >
                                  {isUpdating ? (
                                    <Loader2
                                      size={14}
                                      className="animate-spin"
                                    />
                                  ) : (
                                    <Trash2 size={14} />
                                  )}
                                </button>
                              </div>

                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-sm font-bold text-gray-900 dark:text-white">
                                  ₹{sellingPrice?.toLocaleString()}
                                </span>
                                {hasDiscount && (
                                  <span className="text-xs text-gray-400 line-through">
                                    ₹{originalPrice?.toLocaleString()}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Controls */}
                            <div className="flex items-center justify-between mt-2">
                              {/* Quantity */}
                              <div className="flex items-center border border-gray-200 dark:border-white/10 rounded-lg h-8 bg-gray-50 dark:bg-white/5">
                                <button
                                  onClick={() =>
                                    updateQuantity(
                                      item._id,
                                      item.quantity - 1,
                                      item.product.stock,
                                    )
                                  }
                                  disabled={item.quantity <= 1 || isUpdating}
                                  className="w-8 flex items-center justify-center text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white disabled:opacity-30"
                                >
                                  <Minus size={14} />
                                </button>
                                <span className="w-8 text-center text-xs font-semibold text-gray-900 dark:text-white">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    updateQuantity(
                                      item._id,
                                      item.quantity + 1,
                                      item.product.stock,
                                    )
                                  }
                                  disabled={
                                    item.quantity >= item.product.stock ||
                                    isUpdating
                                  }
                                  className="w-8 flex items-center justify-center text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white disabled:opacity-30"
                                >
                                  <Plus size={14} />
                                </button>
                              </div>

                              {/* Stock Warning */}
                              {item.product.stock <= 5 && (
                                <span className="text-[10px] font-medium text-orange-600 dark:text-orange-400 flex items-center gap-1 bg-orange-50 dark:bg-orange-500/10 px-1.5 py-0.5 rounded">
                                  <AlertCircle size={10} /> {item.product.stock}{" "}
                                  left
                                </span>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              )}
            </div>

            <div className="px-4 pb-2">
              <CartDrawerUpsell />
            </div>

            {/* --- FOOTER --- */}
            {cart && cart.items.length > 0 && (
              <div className="border-t border-gray-200 dark:border-white/10 p-5 bg-gray-50 dark:bg-black/40">
                {/* Free Shipping Progress */}
                {cart.shippingCharges > 0 && (
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-blue-600 dark:text-blue-400 mb-1.5 font-medium">
                      <span>
                        Add ₹{(5000 - cart.subtotal).toLocaleString()} for Free
                        Shipping
                      </span>
                      <Truck size={14} />
                    </div>
                    <div className="h-1.5 w-full bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all duration-500"
                        style={{ width: `${(cart.subtotal / 5000) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Totals */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>Subtotal</span>
                    <span>₹{cart.subtotal?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-white/10">
                    <span>Total</span>
                    <span>₹{cart.totalAmount?.toLocaleString()}</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  onClick={toggleCartDrawer}
                  className="block w-full"
                >
                  <button className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]">
                    Checkout Now <ArrowRight size={16} />
                  </button>
                </Link>

                <Link
                  href="/cart"
                  onClick={toggleCartDrawer}
                  className="block w-full mt-3 text-center"
                >
                  <span className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
                    View full cart
                  </span>
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
