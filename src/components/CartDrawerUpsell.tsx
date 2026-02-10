"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Loader2, Sparkles } from "lucide-react";
import apiClient from "@/services/apiClient";
import { useStore } from "@/store/useStore";
import toast from "react-hot-toast";

export default function CartDrawerUpsell() {
  const { cart, setCart } = useStore();
  const [recommendation, setRecommendation] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const fetchUpsell = async () => {
      // కార్ట్ ఖాళీగా ఉంటే ఏం చూపించొద్దు
      if (!cart || !cart.items || cart.items.length === 0) return;

      // లాజిక్: కార్ట్‌లో ఉన్న మొదటి (లేదా లేటెస్ట్) ప్రొడక్ట్ తీసుకోవాలి
      // సాధారణంగా last added item (0 index or last index depends on your sorting)
      const anchorItem = cart.items[0].product;

      try {
        setLoading(true);
        const res = await apiClient.get(
          `/products/${anchorItem._id}/smart-bundle`,
        );

        if (res.data.success && res.data.data.suggestedAddons.length > 0) {
          // కార్ట్‌లో లేని ప్రొడక్ట్ మాత్రమే చూపించు
          const cartIds = cart.items.map((i: any) => i.product._id);
          const validRec = res.data.data.suggestedAddons.find(
            (addon: any) => !cartIds.includes(addon._id),
          );

          if (validRec) setRecommendation(validRec);
        }
      } catch (err) {
        console.error("Upsell fetch error");
      } finally {
        setLoading(false);
      }
    };

    fetchUpsell();
  }, [cart?.items?.length]); // ఐటమ్స్ మారినప్పుడల్లా చెక్ చెయ్

  const addToCart = async () => {
    if (!recommendation) return;
    setAdding(true);
    try {
      const res = await apiClient.post("/cart/add", {
        productId: recommendation._id,
        quantity: 1,
      });
      if (res.data.success) {
        setCart(res.data.data.cart);
        toast.success("Added to cart!");
        setRecommendation(null); // యాడ్ అయ్యాక తీసేయ్
      }
    } catch (err) {
      toast.error("Failed to add");
    } finally {
      setAdding(false);
    }
  };

  if (!recommendation) return null;

  return (
    <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-purple-900/10 border border-blue-100 dark:border-white/5 rounded-xl">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles
          size={12}
          className="text-amber-500 fill-amber-500 animate-pulse"
        />
        <p className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
          Complete the kit
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Image */}
        <div className="relative w-12 h-12 bg-white dark:bg-black/20 rounded-lg border border-gray-200 dark:border-white/10 flex-shrink-0">
          <Image
            src={recommendation.images[0]?.url || ""}
            alt={recommendation.name}
            fill
            className="object-contain p-1"
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h4 className="text-xs font-semibold text-gray-900 dark:text-white truncate">
            {recommendation.name}
          </h4>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-900 dark:text-white">
              ₹
              {(
                recommendation.discountPrice || recommendation.price
              ).toLocaleString()}
            </span>
            {recommendation.discountPrice && (
              <span className="text-[10px] text-green-600 dark:text-emerald-400 bg-green-100 dark:bg-emerald-500/10 px-1 rounded">
                Save ₹{recommendation.price - recommendation.discountPrice}
              </span>
            )}
          </div>
        </div>

        {/* Add Button */}
        <button
          onClick={addToCart}
          disabled={adding}
          className="h-8 w-8 flex items-center justify-center bg-gray-900 dark:bg-white text-white dark:text-black rounded-lg hover:scale-105 active:scale-95 transition-all shadow-md"
        >
          {adding ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Plus size={16} />
          )}
        </button>
      </div>
    </div>
  );
}
