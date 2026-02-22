// src/components/ProductCard.tsx
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import {
  ShoppingCart,
  Heart,
  Eye,
  Zap,
  AlertCircle,
  Image as ImageIcon,
  Star,
  Timer,
  CheckCircle2,
} from "lucide-react";
import WishlistButton from "./WishlistButton";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import toast from "react-hot-toast";

// 1.  Interfaces (Kept exactly as provided)
interface ProductImage {
  url: string;
  publicId: string;
  _id?: string;
}

interface Product {
  _id: string;
  id?: string;
  slug: string;
  name: string;
  partNumber?: string;
  category: string;
  price: number;
  discountPrice?: number;
  stock: number;
  stockStatus?: string;
  images: ProductImage[];
  averageRating?: number;
  totalReviews?: number;
  flashSale?: {
    isActive: boolean;
    salePrice?: number;
    startTime?: string;
    endTime?: string;
  };
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: any) => void | Promise<void>;
  index?: number;
  initialWishlistState?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = React.memo(
  ({ product, onAddToCart, index = 0, initialWishlistState = false }) => {
    const [imageError, setImageError] = useState(false);

    const { user } = useAuth();

    //  Safe ID Check
    const productId = product._id || product.id;

    if (!productId) {
      return null;
    }

    const router = useRouter();

    //  Image Logic (Kept exactly as is)
    const getImageUrl = () => {
      if (!product.images || product.images.length === 0) return null;
      const firstImage = product.images[0];
      const imagePath =
        typeof firstImage === "string" ? firstImage : firstImage?.url;

      if (!imagePath) return null;
      if (imagePath.startsWith("http")) return imagePath;

      const cleanPath = imagePath.startsWith("/")
        ? imagePath.slice(1)
        : imagePath;
      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "";
      return `${baseUrl}/${cleanPath}`;
    };

    const displayImage = getImageUrl();
    const fallbackImage =
      "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=600&auto=format&fit=crop";

    //  Price & Stock Logic
    const isFlashSaleActive =
      product.flashSale?.isActive &&
      product.flashSale.salePrice &&
      new Date(product.flashSale.endTime!) > new Date();

    const finalPrice = isFlashSaleActive
      ? product.flashSale!.salePrice!
      : product.discountPrice || product.price;

    const originalPrice = product.price;

    const discountPercent =
      originalPrice > finalPrice
        ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100)
        : 0;

    const isOutOfStock =
      product.stock <= 0 || product.stockStatus === "Out of Stock";
    const isLowStock =
      !isOutOfStock &&
      (product.stock < 5 || product.stockStatus === "Low Stock");

    const handleAddToCart = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!user) {
        toast.error("Please login to add items");
        router.push(`/login?redirect=/products/${product._id}`);
        return;
      }
      if (onAddToCart) {
        onAddToCart(product);
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{
          duration: 0.4,
          delay: index * 0.05,
          ease: "easeOut",
        }}
        className="group relative h-full"
      >
        <Link
          href={`/products/${product.slug || product._id}`}
          className="block h-full"
        >
          <div className="relative h-full bg-white dark:bg-gradient-to-br dark:from-[#0B1121] dark:to-[#1e3a8a] border border-gray-200 dark:border-blue-500/30 rounded-[1.5rem] overflow-hidden shadow-sm hover:shadow-xl hover:shadow-blue-200/50 dark:hover:shadow-blue-600/20 transition-all duration-500 flex flex-col group-hover:-translate-y-1">
            {/* Wishlist Button (Top Right) */}
            <div className="absolute top-3 right-3 z-30">
              <div className="bg-white/80 dark:bg-blue-950/60 backdrop-blur-md rounded-full shadow-sm p-1 hover:scale-110 transition-transform active:scale-95 cursor-pointer border border-transparent dark:border-blue-400/20">
                <WishlistButton
                  productId={product._id}
                  initialState={initialWishlistState}
                />
              </div>
            </div>

            {/* 🏷️ Status Badges (Top Left) */}
            <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5">
              {isOutOfStock ? (
                <span className="bg-red-500 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-md border border-red-400">
                  Out of Stock
                </span>
              ) : isFlashSaleActive ? (
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-lg flex items-center gap-1 animate-pulse border border-white/20">
                  <Timer size={11} strokeWidth={3} /> Flash Sale
                </span>
              ) : isLowStock ? (
                <span className="bg-amber-500 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-md flex items-center gap-1 border border-amber-400">
                  <Zap size={11} fill="currentColor" /> Low Stock
                </span>
              ) : (
                <span className="bg-emerald-500/90 dark:bg-emerald-500 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1 backdrop-blur-md border border-emerald-400/50">
                  <CheckCircle2 size={11} /> In Stock
                </span>
              )}
            </div>

            {/* 🏷️ Discount Badge */}
            {discountPercent > 0 && !isOutOfStock && (
              <div className="absolute top-12 left-3 z-20">
                <span className="bg-yellow-400 text-black px-2.5 py-0.5 rounded-md text-[10px] font-extrabold shadow-lg border-b-2 border-yellow-600">
                  -{discountPercent}%
                </span>
              </div>
            )}

            <div className="relative aspect-square overflow-hidden bg-gray-50 dark:bg-[#020617]/50 border-b border-gray-100 dark:border-blue-500/10">
              <div className="w-full h-full relative transition-transform duration-700 ease-out group-hover:scale-[1.08]">
                <Image
                  src={
                    !imageError && displayImage ? displayImage : fallbackImage
                  }
                  alt={product.name}
                  fill
                  className="object-cover"
                  onError={() => setImageError(true)}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />

                {/* Fallback Overlay */}
                {imageError && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 dark:bg-white/5 text-gray-400">
                    <ImageIcon size={32} className="mb-2 opacity-50" />
                    <span className="text-xs">No Image</span>
                  </div>
                )}
              </div>

              {/* Quick Actions (Hover) */}
              <div className="absolute right-3 bottom-3 flex flex-col gap-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-20">
                <button
                  className="p-2.5 bg-white dark:bg-blue-900/80 text-gray-700 dark:text-blue-100 rounded-full shadow-xl border border-gray-100 dark:border-blue-500/30 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-500 dark:hover:text-white transition-all"
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                >
                  <Eye size={16} />
                </button>
              </div>
            </div>

            {/* 📝 Content Section */}
            <div className="p-5 flex flex-col flex-grow relative bg-white dark:bg-transparent">
              {/* Category & Rating Row */}
              <div className="mb-2.5 flex justify-between items-center">
                <span className="text-[10px] font-bold tracking-widest text-blue-600 dark:text-cyan-300 uppercase bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-md border border-blue-100 dark:border-blue-500/30">
                  {product.category || "Spare Part"}
                </span>

                {product.averageRating && product.averageRating > 0 && (
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50 dark:bg-amber-950/40 px-2 py-1 rounded-full border border-amber-100 dark:border-amber-500/20">
                    <Star size={10} fill="currentColor" />
                    {product.averageRating.toFixed(1)}
                  </div>
                )}
              </div>

              {/* Title */}
              <h3 className="font-bold text-gray-900 dark:text-blue-50 text-sm sm:text-[15px] leading-snug line-clamp-2 mb-1 group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
                {product.name}
              </h3>

              {/* Part Number */}
              {product.partNumber && (
                <p className="text-[11px] text-gray-500 dark:text-blue-200/60 font-mono tracking-wide mb-3">
                  PN: {product.partNumber}
                </p>
              )}

              <div className="mt-auto pt-4 border-t border-dashed border-gray-200 dark:border-blue-500/20 flex items-end justify-between">
                {/* Price Section */}
                <div className="flex flex-col">
                  {discountPercent > 0 ? (
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-400 dark:text-blue-300/50 line-through font-medium">
                        ₹{originalPrice.toLocaleString()}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-lg sm:text-xl font-extrabold text-gray-900 dark:text-white">
                          ₹{finalPrice.toLocaleString()}
                        </span>
                        {isFlashSaleActive && (
                          <Zap
                            size={16}
                            className="text-purple-500 dark:text-purple-400 fill-current animate-bounce"
                          />
                        )}
                      </div>
                    </div>
                  ) : (
                    <span className="text-lg sm:text-xl font-extrabold text-gray-900 dark:text-white">
                      ₹{originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>

              {/* Add to Cart Button */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`mt-4 w-full py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-bold tracking-wide transition-all shadow-md hover:shadow-lg
                ${
                  isOutOfStock
                    ? "bg-gray-100 dark:bg-slate-800 text-gray-400 cursor-not-allowed shadow-none border border-gray-200 dark:border-white/5"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 dark:from-cyan-500 dark:to-blue-600 dark:hover:from-cyan-400 dark:hover:to-blue-500 text-white border border-white/10 shadow-blue-500/20"
                }`}
              >
                {isOutOfStock ? (
                  "Out of Stock"
                ) : (
                  <>
                    <ShoppingCart size={18} strokeWidth={2.5} />
                    Add to Cart
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  },
);

ProductCard.displayName = "ProductCard";
