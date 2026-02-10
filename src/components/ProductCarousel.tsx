"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import {
  ArrowRight,
  ShoppingCart,
  Sparkles,
  Tag,
  Star,
  Zap,
} from "lucide-react";
import apiClient from "@/services/apiClient";

// Swiper CSS
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Interfaces
interface ProductImage {
  url: string;
}

interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  finalPrice: number;
  stock: number;
  images: ProductImage[];
  averageRating?: number; // Added rating
}

const ProductCarousel = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiClient.get("/products/featured");
        if (response.data?.success && response.data?.data?.products) {
          setProducts(response.data.data.products);
        }
      } catch (error) {
        console.error("Failed to fetch carousel products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const getImageUrl = (product: Product) => {
    if (product.images && product.images.length > 0) {
      return product.images[0].url;
    }
    return "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=400&auto=format&fit=crop";
  };

  if (loading) return null;
  if (products.length === 0) return null;

  return (
    <section className="relative w-full py-20 bg-gray-50 dark:bg-[#020617] overflow-hidden transition-colors duration-500">
      {/* 🌌 Ambient Background Glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 z-10">
        {/* Title Section */}
        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
          <div className="flex flex-col gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-cyan-400 rounded-full w-fit">
              <Sparkles size={14} className="animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest">
                Premium Selection
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight drop-shadow-sm leading-tight">
              Featured{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-cyan-400 dark:to-blue-500">
                Products
              </span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base max-w-lg font-medium">
              Top rated genuine parts curated for your Hyundai machine. Quality
              you can trust.
            </p>
          </div>

          {/* View All Button */}
          <Link
            href="/products"
            className="group hidden sm:flex items-center gap-2 px-6 py-3 rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm font-bold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-white/10 transition-all shadow-sm hover:shadow-md"
          >
            <span>View All Collection</span>
            <div className="bg-gray-100 dark:bg-white/20 p-1 rounded-full group-hover:bg-blue-500 group-hover:text-white transition-colors">
              <ArrowRight
                size={14}
                className="group-hover:translate-x-0.5 transition-transform"
              />
            </div>
          </Link>
        </div>

        {/* Swiper Slider */}
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={24}
          slidesPerView={1.2}
          navigation
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          pagination={{ clickable: true, dynamicBullets: true }}
          breakpoints={{
            640: { slidesPerView: 2, spaceBetween: 24 },
            850: { slidesPerView: 3, spaceBetween: 28 },
            1150: { slidesPerView: 4, spaceBetween: 32 },
          }}
          className="!pb-16 !px-2 product-swiper"
        >
          {products.map((product) => {
            const discount =
              product.price > product.finalPrice
                ? Math.round(
                    ((product.price - product.finalPrice) / product.price) *
                      100,
                  )
                : 0;

            return (
              <SwiperSlide key={product._id} className="h-auto pt-2">
                <Link
                  href={`/products/${product._id}`}
                  className="block h-full group"
                >
                  {/* ✨ Glass Card Container */}
                  <div className="h-full flex flex-col bg-white dark:bg-[#0f172a]/60 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-[1.5rem] overflow-hidden hover:shadow-2xl hover:shadow-blue-500/10 dark:hover:shadow-black/50 hover:-translate-y-2 transition-all duration-500">
                    {/* Image Area */}
                    <div className="relative h-64 w-full bg-gray-50 dark:bg-[#0b1121] flex items-center justify-center overflow-hidden border-b border-gray-100 dark:border-white/5">
                      {/* Image */}
                      <Image
                        src={getImageUrl(product)}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-contain w-full h-full p-6 group-hover:scale-110 transition-transform duration-700 ease-out z-10"
                        unoptimized={true}
                      />

                      {/* Badges */}
                      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                        {product.stock <= 0 ? (
                          <span className="bg-red-500/90 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-lg border border-red-400/30 uppercase tracking-wider">
                            Out of Stock
                          </span>
                        ) : discount > 0 ? (
                          <span className="bg-yellow-400 text-yellow-950 px-2.5 py-1 rounded-lg text-[10px] font-extrabold shadow-lg border-b-2 border-yellow-500 flex items-center gap-1">
                            <Zap size={10} fill="currentColor" /> -{discount}%
                            OFF
                          </span>
                        ) : null}
                      </div>
                    </div>

                    {/* Content Area */}
                    <div className="p-5 flex flex-col flex-grow relative bg-white dark:bg-transparent">
                      {/* Category Tag */}
                      <div className="mb-2 flex justify-between items-center">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 dark:text-cyan-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-md border border-blue-100 dark:border-blue-500/20">
                          {product.category}
                        </span>
                        {/* Rating Mockup (Optional) */}
                        <div className="flex items-center gap-1 text-[10px] font-bold text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded-full border border-amber-100 dark:border-amber-500/20">
                          <Star size={10} fill="currentColor" /> 4.5
                        </div>
                      </div>

                      <h3
                        className="text-gray-900 dark:text-white font-bold text-base leading-snug line-clamp-2 mb-3 group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors"
                        title={product.name}
                      >
                        {product.name}
                      </h3>

                      <div className="mt-auto pt-4 border-t border-dashed border-gray-200 dark:border-white/10 flex items-center justify-between">
                        <div className="flex flex-col">
                          {discount > 0 && (
                            <span className="text-xs text-gray-400 line-through mb-0.5 font-medium">
                              ₹{product.price.toLocaleString()}
                            </span>
                          )}
                          <span className="text-xl font-black text-gray-900 dark:text-white">
                            ₹{product.finalPrice.toLocaleString()}
                          </span>
                        </div>

                        {/* Add to Cart Button */}
                        <button className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-600 dark:text-white group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-blue-500/40">
                          <ShoppingCart size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>

        {/* Mobile View All Button */}
        <div className="mt-8 flex justify-center sm:hidden">
          <Link
            href="/products"
            className="flex items-center gap-2 text-xs font-bold text-white bg-blue-600 px-6 py-3.5 rounded-xl shadow-lg shadow-blue-600/30 active:scale-95 transition-transform w-full justify-center"
          >
            <span>View All Products</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* Custom Styles for Swiper Pagination */}
      <style jsx global>{`
        .swiper-pagination-bullet {
          background-color: #94a3b8 !important;
          opacity: 0.4;
          width: 6px;
          height: 6px;
          transition: all 0.3s;
        }
        .swiper-pagination-bullet-active {
          background-color: #3b82f6 !important; /* Blue-500 */
          opacity: 1;
          width: 20px;
          border-radius: 4px;
        }
        .dark .swiper-pagination-bullet-active {
          background-color: #06b6d4 !important; /* Cyan-500 */
        }
        .swiper-button-next,
        .swiper-button-prev {
          color: #1e293b;
          background: rgba(255, 255, 255, 0.9);
          width: 44px;
          height: 44px;
          border-radius: 50%;
          backdrop-filter: blur(8px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(0, 0, 0, 0.05);
          transition: all 0.3s;
        }
        .swiper-button-next:hover,
        .swiper-button-prev:hover {
          background: #3b82f6;
          color: white;
          transform: scale(1.1);
        }
        .swiper-button-next:after,
        .swiper-button-prev:after {
          font-size: 18px;
          font-weight: bold;
        }
        .dark .swiper-button-next,
        .dark .swiper-button-prev {
          background: rgba(30, 41, 59, 0.8);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .dark .swiper-button-next:hover,
        .dark .swiper-button-prev:hover {
          background: #06b6d4;
          color: black;
        }
        .swiper-button-disabled {
          opacity: 0 !important;
        }
      `}</style>
    </section>
  );
};

export default ProductCarousel;
