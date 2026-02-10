// "use client";

// import { useEffect, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import {
//   ShoppingCart,
//   Plus,
//   Minus,
//   Trash2,
//   ArrowRight,
//   Package,
//   Truck,
//   AlertCircle,
//   Loader2,
//   CheckCircle,
//   ShieldCheck,
//   Zap,
//   MapPin, // ✅ Added MapPin icon
// } from "lucide-react";
// import { useStore } from "@/store/useStore";
// import apiClient from "@/services/apiClient";
// import toast from "react-hot-toast";

// // --- HELPER: Compatibility Logic ---
// const checkCompatibility = (product: any, userCar: any) => {
//   if (
//     !userCar ||
//     !product.compatibleModels ||
//     product.compatibleModels.length === 0
//   )
//     return null;

//   return product.compatibleModels.some((item: any) => {
//     const modelMatch = item.modelName
//       .toLowerCase()
//       .includes(userCar.model.toLowerCase());
//     const endYear = item.yearTo || new Date().getFullYear();
//     const yearMatch = userCar.year >= item.yearFrom && userCar.year <= endYear;
//     return modelMatch && yearMatch;
//   });
// };

// // --- HELPER: Safe Image URL ---
// const getProductImage = (product: any) => {
//   const image = product?.images?.[0]?.url;
//   if (!image) return null;
//   return image.startsWith("http")
//     ? image
//     : `${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "")}/${image}`;
// };

// export default function CartPage() {
//   const router = useRouter();
//   const { cart, setCart } = useStore();
//   const [loading, setLoading] = useState(true);
//   const [updating, setUpdating] = useState<string | null>(null);
//   const [couponCode, setCouponCode] = useState("");
//   const [userGarage, setUserGarage] = useState<{
//     model: string;
//     year: number;
//   } | null>(null);

//   // ✅ NEW: Pincode States
//   const [pincode, setPincode] = useState("");
//   const [pincodeStatus, setPincodeStatus] = useState<
//     "loading" | "success" | "error" | null
//   >(null);
//   const [deliveryMsg, setDeliveryMsg] = useState("");

//   // ✅ NEW: Recommendations State
//   const [recommendations, setRecommendations] = useState<any[]>([]);
//   const [loadingRecs, setLoadingRecs] = useState(false);
//   const [addingRec, setAddingRec] = useState<string | null>(null);

//   const fetchCart = async () => {
//     try {
//       setLoading(true);
//       const response = await apiClient.get("/cart");
//       if (response.data.success) {
//         setCart(response.data.data.cart);
//       }
//     } catch (error) {
//       console.error("Error fetching cart:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ NEW: Fetch Recommendations when Cart Changes
//   useEffect(() => {
//     const fetchRecommendations = async () => {
//       // కార్ట్ ఖాళీగా ఉంటే రిటర్న్ అయిపో
//       if (!cart || !cart.items || cart.items.length === 0) return;

//       // లాజిక్: కార్ట్‌లో ఉన్న మొదటి ప్రొడక్ట్ ని బేస్ చేసుకుని సజెషన్స్ అడుగుతాం
//       const anchorItem = cart.items[0].product;

//       try {
//         setLoadingRecs(true);
//         const res = await apiClient.get(
//           `/products/${anchorItem._id}/smart-bundle`,
//         );

//         if (res.data.success && res.data.data.suggestedAddons.length > 0) {
//           // 🔥 CRITICAL: ఆల్రెడీ కార్ట్‌లో ఉన్నవాటిని ఫిల్టర్ చేయాలి
//           const cartProductIds = cart.items.map(
//             (item: any) => item.product._id,
//           );

//           const filteredRecs = res.data.data.suggestedAddons.filter(
//             (addon: any) => !cartProductIds.includes(addon._id),
//           );

//           setRecommendations(filteredRecs);
//         }
//       } catch (error) {
//         console.error("Failed to load recommendations");
//       } finally {
//         setLoadingRecs(false);
//       }
//     };

//     fetchRecommendations();
//   }, [cart]); // Cart మారినప్పుడల్లా ఇది రన్ అవుతుంది

//   // ✅ NEW: Add Recommendation to Cart
//   const addRecommendation = async (productId: string) => {
//     setAddingRec(productId);
//     try {
//       const res = await apiClient.post("/cart/add", { productId, quantity: 1 });
//       if (res.data.success) {
//         setCart(res.data.data.cart);
//         toast.success("Added to cart!");
//         // యాడ్ అయ్యాక ఆ ఐటమ్‌ని లిస్ట్ లోంచి తీసేయాలి
//         setRecommendations((prev) => prev.filter((p) => p._id !== productId));
//       }
//     } catch (error) {
//       toast.error("Failed to add item");
//     } finally {
//       setAddingRec(null);
//     }
//   };

//   // ✅ NEW: Load Saved Pincode on Mount
//   useEffect(() => {
//     fetchCart();
//     const savedPin = localStorage.getItem("user_pincode");
//     if (savedPin) {
//       setPincode(savedPin);
//       checkDelivery(savedPin);
//     }
//     // Load Garage Data
//     const savedGarage = localStorage.getItem("myGarage");
//     if (savedGarage) setUserGarage(JSON.parse(savedGarage));
//   }, []);

//   const updateQuantity = async (
//     itemId: string,
//     newQty: number,
//     maxStock: number,
//   ) => {
//     if (newQty < 1) return;
//     if (newQty > maxStock) {
//       toast.error(`Only ${maxStock} items available!`);
//       return;
//     }
//     setUpdating(itemId);
//     try {
//       const response = await apiClient.put(`/cart/update/${itemId}`, {
//         quantity: newQty,
//       });
//       if (response.data.success) {
//         setCart(response.data.data.cart);
//         toast.success("Cart updated");
//       }
//     } catch (error: any) {
//       toast.error(error.response?.data?.message || "Update failed");
//     } finally {
//       setUpdating(null);
//     }
//   };

//   const removeItem = async (itemId: string) => {
//     setUpdating(itemId);
//     try {
//       const response = await apiClient.delete(`/cart/remove/${itemId}`);
//       if (response.data.success) {
//         setCart(response.data.data.cart);
//         toast.success("Item removed");
//       }
//     } catch (error: any) {
//       toast.error(error.response?.data?.message || "Remove failed");
//     } finally {
//       setUpdating(null);
//     }
//   };

//   // ✅ NEW: Pincode Delivery Logic (Speed Post/Uppal Base)
//   const checkDelivery = async (manualCode?: string) => {
//     const codeToCheck = typeof manualCode === "string" ? manualCode : pincode;
//     if (!codeToCheck || codeToCheck.length !== 6) {
//       setPincodeStatus("error");
//       setDeliveryMsg("Enter valid pincode");
//       return;
//     }

//     setPincodeStatus("loading");
//     try {
//       const res = await fetch(
//         `https://api.postalpincode.in/pincode/${codeToCheck}`,
//       );
//       const data = await res.json();

//       if (data && data[0].Status === "Success") {
//         const details = data[0].PostOffice[0];
//         const state = details.State;

//         // Realistic Dispatch Timing (2 PM Cutoff)
//         let deliveryDate = new Date();
//         const currentHour = deliveryDate.getHours();
//         if (currentHour >= 14) {
//           deliveryDate.setDate(deliveryDate.getDate() + 1);
//         }

//         // Logic based on Uppal/Hyderabad Origin
//         let daysToAdd = 7;
//         const isLocalHyd =
//           codeToCheck.startsWith("500") ||
//           codeToCheck.startsWith("501") ||
//           codeToCheck.startsWith("502");
//         const isSouthMetro =
//           codeToCheck.startsWith("560") || codeToCheck.startsWith("600");

//         if (isLocalHyd) {
//           daysToAdd = 2;
//         } else if (state === "Telangana") {
//           daysToAdd = 3;
//         } else if (state === "Andhra Pradesh") {
//           daysToAdd = 4;
//         } else if (
//           isSouthMetro ||
//           ["Karnataka", "Tamil Nadu", "Maharashtra"].includes(state)
//         ) {
//           daysToAdd = 5;
//         } else if (
//           [
//             "Assam",
//             "Manipur",
//             "Meghalaya",
//             "Mizoram",
//             "Nagaland",
//             "Tripura",
//             "Jammu and Kashmir",
//           ].includes(state)
//         ) {
//           daysToAdd = 9;
//         } else {
//           daysToAdd = 7;
//         }

//         deliveryDate.setDate(deliveryDate.getDate() + daysToAdd);

//         // Sunday Skip
//         if (deliveryDate.getDay() === 0) {
//           deliveryDate.setDate(deliveryDate.getDate() + 1);
//         }

//         const dateString = deliveryDate.toLocaleDateString("en-IN", {
//           weekday: "long",
//           day: "numeric",
//           month: "short",
//         });

//         localStorage.setItem("user_pincode", codeToCheck);
//         setPincodeStatus("success");
//         setDeliveryMsg(`Arrives by ${dateString}`);
//       } else {
//         setPincodeStatus("error");
//         setDeliveryMsg("Not serviceable");
//       }
//     } catch (err) {
//       setPincodeStatus("error");
//       setDeliveryMsg("Verification failed");
//     }
//   };

//   // --- Loading State ---
//   if (loading) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-[#0a0a0a] pt-20">
//         <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
//         <p className="text-gray-500 dark:text-gray-400 font-medium">
//           Loading your cart...
//         </p>
//       </div>
//     );
//   }

//   // --- Empty State ---
//   if (!cart || !cart.items || cart.items.length === 0) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-[#0a0a0a] px-4 pt-20">
//         <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-0 dark:opacity-100 transition-opacity">
//           <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px]" />
//           <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px]" />
//         </div>
//         <motion.div
//           initial={{ scale: 0.9, opacity: 0 }}
//           animate={{ scale: 1, opacity: 1 }}
//           className="relative z-10 text-center max-w-md p-8 rounded-3xl border border-gray-200 dark:border-white/5 bg-white dark:bg-white/[0.03] shadow-xl dark:shadow-2xl dark:backdrop-blur-xl"
//         >
//           <div className="bg-gray-100 dark:bg-white/5 p-6 rounded-full inline-block shadow-sm mb-6 ring-1 ring-gray-200 dark:ring-white/10">
//             <ShoppingCart size={64} className="text-gray-400" />
//           </div>
//           <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
//             Your cart is empty
//           </h2>
//           <p className="text-gray-500 dark:text-gray-400 mb-8 text-lg">
//             Looks like you haven't added any spare parts yet.
//           </p>
//           <button
//             onClick={() => router.push("/")}
//             className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg shadow-blue-600/20 transition-all transform hover:-translate-y-1 w-full"
//           >
//             Start Shopping
//           </button>
//         </motion.div>
//       </div>
//     );
//   }

//   // --- Main Render ---
//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] pt-24 pb-12 transition-colors duration-300">
//       {/* Background Glow (Dark Mode Only) */}
//       <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-0 dark:opacity-100 transition-opacity">
//         <div className="absolute top-0 left-1/4 w-[1000px] h-[400px] bg-blue-900/10 rounded-full blur-[120px]" />
//         <div className="absolute bottom-0 right-1/4 w-[800px] h-[400px] bg-purple-900/10 rounded-full blur-[120px]" />
//       </div>

//       <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Page Header */}
//         <div className="flex items-center justify-between mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3 tracking-tight">
//               Shopping Cart
//               <span className="text-sm font-medium bg-blue-100 dark:bg-white/5 text-blue-700 dark:text-gray-300 px-3 py-1 rounded-full border border-blue-200 dark:border-white/10">
//                 {cart.totalItems} Items
//               </span>
//             </h1>
//           </div>
//         </div>

//         <div className="grid lg:grid-cols-3 gap-8">
//           {/* --- LEFT COLUMN: ITEMS --- */}
//           <div className="lg:col-span-2 space-y-4">
//             <AnimatePresence>
//               {cart.items.map((item: any) => {
//                 const imageUrl = getProductImage(item.product);
//                 const isUpdating = updating === item._id;

//                 const originalPrice = item.product.price;
//                 const sellingPrice = item.price;
//                 const hasDiscount = originalPrice > sellingPrice;
//                 const fitStatus = userGarage
//                   ? checkCompatibility(item.product, userGarage)
//                   : null;
//                 return (
//                   <motion.div
//                     key={item._id}
//                     layout
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, x: -100 }}
//                     className="group relative bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-white/5 rounded-2xl p-4 sm:p-6 shadow-sm dark:shadow-none hover:shadow-md dark:hover:bg-white/[0.06] transition-all"
//                   >
//                     <div className="flex gap-4 sm:gap-6">
//                       <div className="relative h-24 w-24 sm:h-32 sm:w-32 flex-shrink-0 overflow-hidden rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20">
//                         {imageUrl ? (
//                           <Image
//                             src={imageUrl}
//                             alt={item.product?.name}
//                             fill
//                             sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//                             className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
//                           />
//                         ) : (
//                           <div className="h-full w-full flex items-center justify-center text-gray-400 dark:text-gray-600">
//                             <Package size={32} />
//                           </div>
//                         )}
//                       </div>

//                       <div className="flex flex-1 flex-col justify-between">
//                         <div>
//                           <div className="flex justify-between items-start">
//                             <div>
//                               <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 leading-snug">
//                                 {item.product?.name}
//                               </h3>
//                               <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-mono">
//                                 Part #: {item.product?.partNumber}
//                               </p>
//                               {/* 🔥 INSERT THIS BLOCK: Garage Fitment Check */}
//                               <div className="mt-2">
//                                 {userGarage ? (
//                                   <div
//                                     className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${
//                                       fitStatus
//                                         ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20"
//                                         : "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/20"
//                                     }`}
//                                   >
//                                     {fitStatus ? (
//                                       <>
//                                         <CheckCircle size={12} /> Fits your{" "}
//                                         {userGarage.model}
//                                       </>
//                                     ) : (
//                                       <>
//                                         <AlertCircle size={12} /> Doesn't fit{" "}
//                                         {userGarage.model}
//                                       </>
//                                     )}
//                                   </div>
//                                 ) : (
//                                   // గ్యారేజ్ లేకపోతే సెట్ చేసుకోమని చిన్న లింక్
//                                   <button
//                                     onClick={() =>
//                                       alert(
//                                         "Please add your car in the Navbar or Home page!",
//                                       )
//                                     } // లేదా Modal ఓపెన్ చేసే లాజిక్
//                                     className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:underline"
//                                   >
//                                     <AlertCircle size={12} /> Check
//                                     compatibility
//                                   </button>
//                                 )}
//                               </div>
//                             </div>
//                             <button
//                               onClick={() => removeItem(item._id)}
//                               disabled={isUpdating}
//                               className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
//                               title="Remove Item"
//                             >
//                               {isUpdating ? (
//                                 <Loader2 className="animate-spin h-5 w-5" />
//                               ) : (
//                                 <Trash2 size={20} />
//                               )}
//                             </button>
//                           </div>

//                           <div className="mt-3 flex flex-wrap items-center gap-3">
//                             <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
//                               ₹{sellingPrice?.toLocaleString()}
//                             </span>
//                             {hasDiscount && (
//                               <>
//                                 <span className="text-sm text-gray-400 dark:text-gray-500 line-through">
//                                   ₹{originalPrice?.toLocaleString()}
//                                 </span>
//                                 <span className="text-[10px] font-bold text-green-700 dark:text-emerald-300 bg-green-100 dark:bg-emerald-500/10 px-2 py-0.5 rounded border border-green-200 dark:border-emerald-500/20 flex items-center gap-1">
//                                   <Zap
//                                     size={10}
//                                     className="fill-green-700 dark:fill-emerald-300"
//                                   />
//                                   SAVED ₹
//                                   {(
//                                     originalPrice - sellingPrice
//                                   ).toLocaleString()}
//                                 </span>
//                               </>
//                             )}
//                           </div>
//                         </div>

//                         <div className="flex items-center justify-between mt-4">
//                           <div className="flex items-center border border-gray-200 dark:border-white/10 rounded-xl bg-gray-50 dark:bg-black/20">
//                             <button
//                               onClick={() =>
//                                 updateQuantity(
//                                   item._id,
//                                   item.quantity - 1,
//                                   item.product.stock,
//                                 )
//                               }
//                               disabled={item.quantity <= 1 || isUpdating}
//                               className="p-2 sm:p-3 hover:bg-white dark:hover:bg-white/10 rounded-l-xl text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-30 transition"
//                             >
//                               <Minus size={16} />
//                             </button>
//                             <span className="w-10 text-center font-mono text-sm text-gray-900 dark:text-white">
//                               {item.quantity}
//                             </span>
//                             <button
//                               onClick={() =>
//                                 updateQuantity(
//                                   item._id,
//                                   item.quantity + 1,
//                                   item.product.stock,
//                                 )
//                               }
//                               disabled={
//                                 item.quantity >= item.product.stock ||
//                                 isUpdating
//                               }
//                               className="p-2 sm:p-3 hover:bg-white dark:hover:bg-white/10 rounded-r-xl text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-30 transition"
//                             >
//                               <Plus size={16} />
//                             </button>
//                           </div>
//                           {item.product?.stock <= 5 && (
//                             <span className="text-xs font-medium text-orange-600 dark:text-amber-400 flex items-center gap-1 bg-orange-50 dark:bg-amber-500/10 px-2 py-1 rounded-lg border border-orange-200 dark:border-amber-500/20">
//                               <AlertCircle size={14} /> Only{" "}
//                               {item.product.stock} left
//                             </span>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   </motion.div>
//                 );
//               })}
//             </AnimatePresence>

//             {/* ================= 🔥 NEW: SMART UPSELL SECTION 🔥 ================= */}
//             {recommendations.length > 0 && (
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 className="mt-8 pt-8 border-t border-dashed border-gray-200 dark:border-white/10"
//               >
//                 <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
//                   <span className="text-blue-600">✨</span> You might have
//                   missed these
//                 </h3>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   {recommendations.map((rec) => (
//                     <div
//                       key={rec._id}
//                       className="flex items-center gap-3 p-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/5 rounded-xl hover:border-blue-300 dark:hover:border-blue-500/30 transition-all shadow-sm group"
//                     >
//                       {/* Image */}
//                       <div className="relative w-16 h-16 flex-shrink-0 bg-gray-50 dark:bg-black/20 rounded-lg overflow-hidden border border-gray-100 dark:border-white/5">
//                         <Image
//                           src={rec.images?.[0]?.url || ""}
//                           alt={rec.name}
//                           sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//                           fill
//                           className="object-contain p-1 group-hover:scale-110 transition-transform"
//                         />
//                       </div>

//                       {/* Info */}
//                       <div className="flex-1 min-w-0">
//                         <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
//                           {rec.name}
//                         </h4>
//                         <div className="flex items-center gap-2 mt-1">
//                           <span className="text-sm font-bold text-gray-900 dark:text-white">
//                             ₹{(rec.discountPrice || rec.price).toLocaleString()}
//                           </span>
//                           {rec.discountPrice && (
//                             <span className="text-xs text-green-600 dark:text-emerald-400 bg-green-100 dark:bg-emerald-500/10 px-1.5 rounded">
//                               Save ₹{rec.price - rec.discountPrice}
//                             </span>
//                           )}
//                         </div>
//                       </div>

//                       {/* Add Button */}
//                       <button
//                         onClick={() => addRecommendation(rec._id)}
//                         disabled={addingRec === rec._id}
//                         className="p-2 bg-blue-50 dark:bg-blue-600/10 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-600 hover:text-white dark:hover:bg-blue-500 transition-colors disabled:opacity-50"
//                       >
//                         {addingRec === rec._id ? (
//                           <Loader2 size={18} className="animate-spin" />
//                         ) : (
//                           <Plus size={18} />
//                         )}
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               </motion.div>
//             )}
//             {/* ================= END UPSELL SECTION ================= */}
//           </div>

//           {/* --- RIGHT COLUMN: SUMMARY --- */}
//           <div className="lg:col-span-1">
//             <div className="bg-white dark:bg-white/[0.03] dark:backdrop-blur-xl border border-gray-200 dark:border-white/5 rounded-3xl p-6 sticky top-28 shadow-lg dark:shadow-2xl">
//               <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
//                 Order Summary
//               </h2>

//               <div className="space-y-4 text-sm">
//                 <div className="flex justify-between text-gray-600 dark:text-gray-400">
//                   <span>Subtotal</span>
//                   <span className="font-medium text-gray-900 dark:text-gray-200">
//                     ₹{cart.subtotal?.toLocaleString()}
//                   </span>
//                 </div>

//                 <div className="flex justify-between text-gray-600 dark:text-gray-400">
//                   <span>GST ({cart.taxPercentage}%)</span>
//                   <span className="font-medium text-gray-900 dark:text-gray-200">
//                     ₹{cart.tax?.toLocaleString()}
//                   </span>
//                 </div>

//                 <div className="flex justify-between text-gray-600 dark:text-gray-400">
//                   <span>Shipping</span>
//                   {cart.shippingCharges === 0 ? (
//                     <span className="text-green-600 dark:text-emerald-400 font-bold flex items-center gap-1">
//                       FREE <CheckCircle size={14} />
//                     </span>
//                   ) : (
//                     <span className="font-medium text-gray-900 dark:text-gray-200">
//                       ₹{cart.shippingCharges}
//                     </span>
//                   )}
//                 </div>

//                 {cart.shippingCharges > 0 && (
//                   <div className="bg-blue-50 dark:bg-blue-500/5 p-3 rounded-xl border border-blue-100 dark:border-blue-500/20 mt-2">
//                     <div className="flex justify-between text-xs text-blue-700 dark:text-blue-300 mb-2">
//                       <span>
//                         Add <b>₹{(5000 - cart.subtotal).toLocaleString()}</b>{" "}
//                         for Free Shipping
//                       </span>
//                       <Truck size={14} />
//                     </div>
//                     <div className="h-1.5 w-full bg-blue-200 dark:bg-blue-900/50 rounded-full overflow-hidden">
//                       <div
//                         className="h-full bg-blue-600 dark:bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"
//                         style={{ width: `${(cart.subtotal / 5000) * 100}%` }}
//                       />
//                     </div>
//                   </div>
//                 )}

//                 <div className="border-t border-dashed border-gray-200 dark:border-white/10 pt-4 mt-4">
//                   <div className="flex justify-between items-end">
//                     <span className="text-base font-semibold text-gray-900 dark:text-white">
//                       Total Amount
//                     </span>
//                     <span className="text-2xl font-bold text-blue-600 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-blue-400 dark:to-purple-400">
//                       ₹{cart.totalAmount?.toLocaleString()}
//                     </span>
//                   </div>
//                   <p className="text-[10px] text-gray-500 mt-1 text-right">
//                     Includes all taxes & charges
//                   </p>
//                 </div>
//               </div>

//               {/* ✅ NEW: Delivery Estimate Feature (Glassmorphism & Amazon Style) */}
//               <div className="mt-6 pt-6 border-t border-gray-200 dark:border-white/5">
//                 <div className="mb-3">
//                   {pincodeStatus === "success" ? (
//                     <motion.div
//                       initial={{ opacity: 0, scale: 0.95 }}
//                       animate={{ opacity: 1, scale: 1 }}
//                       className="relative overflow-hidden flex flex-col gap-1 p-4 bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl shadow-xl transition-all"
//                     >
//                       <div className="absolute -top-10 -right-10 w-24 h-24 bg-cyan-500/10 rounded-full blur-3xl"></div>
//                       <div className="flex justify-between items-start relative z-10">
//                         <div className="flex items-center gap-2">
//                           <Truck size={16} className="text-emerald-500" />
//                           <span className="text-[10px] font-black uppercase tracking-[0.15em] text-emerald-600 dark:text-emerald-400">
//                             Estimated Delivery
//                           </span>
//                         </div>
//                         <button
//                           onClick={() => {
//                             setPincodeStatus(null);
//                             setDeliveryMsg("");
//                           }}
//                           className="text-[10px] font-bold text-cyan-600 hover:text-cyan-500 uppercase tracking-wider"
//                         >
//                           CHANGE
//                         </button>
//                       </div>
//                       <div className="mt-1 relative z-10">
//                         <p className="text-sm font-bold text-gray-900 dark:text-white tracking-tight">
//                           {deliveryMsg}
//                         </p>
//                         <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
//                           Shipping to{" "}
//                           <span className="font-semibold text-gray-700 dark:text-gray-300">
//                             {pincode}
//                           </span>
//                         </p>
//                       </div>
//                     </motion.div>
//                   ) : (
//                     <div className="relative">
//                       <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-1">
//                         <MapPin size={12} /> Check Delivery Date
//                       </label>
//                       <div className="flex gap-2">
//                         <input
//                           type="text"
//                           maxLength={6}
//                           placeholder="PINCODE"
//                           className="flex-1 bg-gray-50 dark:bg-black/20 border border-gray-300 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:outline-none placeholder-gray-400 dark:placeholder-gray-600 transition-all"
//                           value={pincode}
//                           onChange={(e) =>
//                             setPincode(e.target.value.replace(/\D/g, ""))
//                           }
//                           onKeyDown={(e) =>
//                             e.key === "Enter" && checkDelivery()
//                           }
//                         />
//                         <button
//                           onClick={() => checkDelivery()}
//                           disabled={pincodeStatus === "loading"}
//                           className="bg-gray-200 dark:bg-white/10 text-gray-900 dark:text-white px-4 rounded-xl text-sm font-bold hover:bg-gray-300 dark:hover:bg-white/20 disabled:opacity-50 transition-colors"
//                         >
//                           {pincodeStatus === "loading" ? (
//                             <Loader2 size={16} className="animate-spin" />
//                           ) : (
//                             "Check"
//                           )}
//                         </button>
//                       </div>
//                       {pincodeStatus === "error" && (
//                         <p className="text-[10px] text-red-500 mt-1 font-medium">
//                           {deliveryMsg}
//                         </p>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Coupon Code Section */}
//               <div className="mt-4 pt-4 border-t border-gray-200 dark:border-white/5">
//                 <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">
//                   Have a Coupon?
//                 </label>
//                 <div className="flex gap-2">
//                   <input
//                     type="text"
//                     placeholder="ENTER CODE"
//                     value={couponCode}
//                     onChange={(e) =>
//                       setCouponCode(e.target.value.toUpperCase())
//                     }
//                     className="flex-1 bg-gray-50 dark:bg-black/20 border border-gray-300 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:outline-none uppercase placeholder-gray-400 dark:placeholder-gray-600 transition-all"
//                   />
//                   <button
//                     onClick={() => toast.success("Coupon logic coming soon!")}
//                     disabled={!couponCode}
//                     className="bg-gray-900 dark:bg-white text-white dark:text-black px-5 py-3 rounded-xl text-sm font-bold hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                   >
//                     Apply
//                   </button>
//                 </div>
//               </div>

//               <button
//                 onClick={() => router.push("/checkout")}
//                 className="w-full mt-6 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-600 dark:to-blue-500 hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-500 dark:hover:to-blue-400 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 transition-all transform active:scale-[0.98] border border-blue-500/20"
//               >
//                 Checkout <ArrowRight size={20} />
//               </button>

//               <div className="mt-6 flex items-center justify-center gap-4 text-xs text-gray-500">
//                 <span className="flex items-center gap-1.5">
//                   <ShieldCheck
//                     size={14}
//                     className="text-green-600 dark:text-emerald-500"
//                   />{" "}
//                   Secure
//                 </span>
//                 <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700"></span>
//                 <span className="flex items-center gap-1.5">
//                   <Package
//                     size={14}
//                     className="text-blue-600 dark:text-blue-500"
//                   />{" "}
//                   Genuine
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  Package,
  Truck,
  AlertCircle,
  Loader2,
  CheckCircle,
  ShieldCheck,
  Zap,
  MapPin,
} from "lucide-react";
import { useStore } from "@/store/useStore";
import apiClient from "@/services/apiClient";
import toast from "react-hot-toast";

// --- HELPER: Compatibility Logic ---
const checkCompatibility = (product: any, userCar: any) => {
  if (
    !userCar ||
    !product.compatibleModels ||
    product.compatibleModels.length === 0
  )
    return null;

  return product.compatibleModels.some((item: any) => {
    const modelMatch = item.modelName
      .toLowerCase()
      .includes(userCar.model.toLowerCase());
    const endYear = item.yearTo || new Date().getFullYear();
    const yearMatch = userCar.year >= item.yearFrom && userCar.year <= endYear;
    return modelMatch && yearMatch;
  });
};

// --- HELPER: Safe Image URL ---
const getProductImage = (product: any) => {
  const image = product?.images?.[0]?.url;
  if (!image) return null;
  return image.startsWith("http")
    ? image
    : `${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "")}/${image}`;
};

export default function CartPage() {
  const router = useRouter();
  const { cart, setCart } = useStore();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState("");
  const [userGarage, setUserGarage] = useState<{
    model: string;
    year: number;
  } | null>(null);

  // ✅ NEW: Pincode States
  const [pincode, setPincode] = useState("");
  const [pincodeStatus, setPincodeStatus] = useState<
    "loading" | "success" | "error" | null
  >(null);
  const [deliveryMsg, setDeliveryMsg] = useState("");

  // ✅ NEW: Recommendations State
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loadingRecs, setLoadingRecs] = useState(false);
  const [addingRec, setAddingRec] = useState<string | null>(null);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/cart");
      if (response.data.success) {
        setCart(response.data.data.cart);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ NEW: Fetch Recommendations when Cart Changes
  useEffect(() => {
    const fetchRecommendations = async () => {
      // కార్ట్ ఖాళీగా ఉంటే రిటర్న్ అయిపో
      if (!cart || !cart.items || cart.items.length === 0) return;

      // లాజిక్: కార్ట్‌లో ఉన్న మొదటి ప్రొడక్ట్ ని బేస్ చేసుకుని సజెషన్స్ అడుగుతాం
      const anchorItem = cart.items[0].product;

      try {
        setLoadingRecs(true);
        const res = await apiClient.get(
          `/products/${anchorItem._id}/smart-bundle`,
        );

        if (res.data.success && res.data.data.suggestedAddons.length > 0) {
          // 🔥 CRITICAL: ఆల్రెడీ కార్ట్‌లో ఉన్నవాటిని ఫిల్టర్ చేయాలి
          const cartProductIds = cart.items.map(
            (item: any) => item.product._id,
          );

          const filteredRecs = res.data.data.suggestedAddons.filter(
            (addon: any) => !cartProductIds.includes(addon._id),
          );

          setRecommendations(filteredRecs);
        }
      } catch (error) {
        console.error("Failed to load recommendations");
      } finally {
        setLoadingRecs(false);
      }
    };

    fetchRecommendations();
  }, [cart]); // Cart మారినప్పుడల్లా ఇది రన్ అవుతుంది

  // ✅ NEW: Add Recommendation to Cart
  const addRecommendation = async (productId: string) => {
    setAddingRec(productId);
    try {
      const res = await apiClient.post("/cart/add", { productId, quantity: 1 });
      if (res.data.success) {
        setCart(res.data.data.cart);
        toast.success("Added to cart!");
        // యాడ్ అయ్యాక ఆ ఐటమ్‌ని లిస్ట్ లోంచి తీసేయాలి
        setRecommendations((prev) => prev.filter((p) => p._id !== productId));
      }
    } catch (error) {
      toast.error("Failed to add item");
    } finally {
      setAddingRec(null);
    }
  };

  // ✅ NEW: Load Saved Pincode on Mount
  useEffect(() => {
    fetchCart();
    const savedPin = localStorage.getItem("user_pincode");
    if (savedPin) {
      setPincode(savedPin);
      checkDelivery(savedPin);
    }
    // Load Garage Data
    const savedGarage = localStorage.getItem("myGarage");
    if (savedGarage) setUserGarage(JSON.parse(savedGarage));
  }, []);

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
      toast.error(error.response?.data?.message || "Update failed");
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
      toast.error(error.response?.data?.message || "Remove failed");
    } finally {
      setUpdating(null);
    }
  };

  // ✅ NEW: Pincode Delivery Logic (Speed Post/Uppal Base)
  const checkDelivery = async (manualCode?: string) => {
    const codeToCheck = typeof manualCode === "string" ? manualCode : pincode;
    if (!codeToCheck || codeToCheck.length !== 6) {
      setPincodeStatus("error");
      setDeliveryMsg("Enter valid pincode");
      return;
    }

    setPincodeStatus("loading");
    try {
      const res = await fetch(
        `https://api.postalpincode.in/pincode/${codeToCheck}`,
      );
      const data = await res.json();

      if (data && data[0].Status === "Success") {
        const details = data[0].PostOffice[0];
        const state = details.State;

        // Realistic Dispatch Timing (2 PM Cutoff)
        let deliveryDate = new Date();
        const currentHour = deliveryDate.getHours();
        if (currentHour >= 14) {
          deliveryDate.setDate(deliveryDate.getDate() + 1);
        }

        // Logic based on Uppal/Hyderabad Origin
        let daysToAdd = 7;
        const isLocalHyd =
          codeToCheck.startsWith("500") ||
          codeToCheck.startsWith("501") ||
          codeToCheck.startsWith("502");
        const isSouthMetro =
          codeToCheck.startsWith("560") || codeToCheck.startsWith("600");

        if (isLocalHyd) {
          daysToAdd = 2;
        } else if (state === "Telangana") {
          daysToAdd = 3;
        } else if (state === "Andhra Pradesh") {
          daysToAdd = 4;
        } else if (
          isSouthMetro ||
          ["Karnataka", "Tamil Nadu", "Maharashtra"].includes(state)
        ) {
          daysToAdd = 5;
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
          daysToAdd = 9;
        } else {
          daysToAdd = 7;
        }

        deliveryDate.setDate(deliveryDate.getDate() + daysToAdd);

        // Sunday Skip
        if (deliveryDate.getDay() === 0) {
          deliveryDate.setDate(deliveryDate.getDate() + 1);
        }

        const dateString = deliveryDate.toLocaleDateString("en-IN", {
          weekday: "long",
          day: "numeric",
          month: "short",
        });

        localStorage.setItem("user_pincode", codeToCheck);
        setPincodeStatus("success");
        setDeliveryMsg(`Arrives by ${dateString}`);
      } else {
        setPincodeStatus("error");
        setDeliveryMsg("Not serviceable");
      }
    } catch (err) {
      setPincodeStatus("error");
      setDeliveryMsg("Verification failed");
    }
  };

  // --- Loading State (Branded) ---
  if (loading) {
    return (
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050B14] overflow-hidden">
        {/* Background Ambience */}
        <motion.div
          initial={{ opacity: 0.3, scale: 0.8 }}
          animate={{ opacity: 0.6, scale: 1.2 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute h-96 w-96 rounded-full bg-blue-700/10 blur-[120px]"
        />

        <div className="relative flex flex-col items-center justify-center gap-10 z-10">
          {/* Brand Name */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-white to-blue-400 font-sans uppercase">
              VARSHINI HYUNDAI
            </h1>
            <p className="text-xs text-blue-400/80 tracking-[0.5em] uppercase font-medium">
              Reviewing Your Cart...
            </p>
          </div>

          {/* Spinner Animation */}
          <div className="relative h-24 w-24 mt-4">
            <div
              className="absolute inset-0 box-border rounded-full border-[3px] border-t-blue-500 border-r-transparent border-b-blue-500/30 border-l-transparent shadow-[0_0_20px_rgba(59,130,246,0.2)] animate-spin"
              style={{ animationDuration: "2s" }}
            />
            <div
              className="absolute inset-4 box-border rounded-full border-[3px] border-t-transparent border-r-cyan-400 border-b-transparent border-l-cyan-400/50 animate-spin"
              style={{
                animationDuration: "1.5s",
                animationDirection: "reverse",
              }}
            />
            <div className="absolute inset-0 m-auto h-10 w-10 flex items-center justify-center rounded-full bg-gradient-to-tr from-blue-900 to-[#050B14] border border-blue-500/30">
              <ShoppingCart size={18} className="text-blue-400 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Empty State ---
  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-[#0a0a0a] px-4 pt-20">
        <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-0 dark:opacity-100 transition-opacity">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px]" />
        </div>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative z-10 text-center max-w-md p-8 rounded-3xl border border-gray-200 dark:border-white/5 bg-white dark:bg-white/[0.03] shadow-xl dark:shadow-2xl dark:backdrop-blur-xl"
        >
          <div className="bg-gray-100 dark:bg-white/5 p-6 rounded-full inline-block shadow-sm mb-6 ring-1 ring-gray-200 dark:ring-white/10">
            <ShoppingCart size={64} className="text-gray-400" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Your cart is empty
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8 text-lg">
            Looks like you haven't added any spare parts yet.
          </p>
          <button
            onClick={() => router.push("/")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg shadow-blue-600/20 transition-all transform hover:-translate-y-1 w-full"
          >
            Start Shopping
          </button>
        </motion.div>
      </div>
    );
  }

  // --- Main Render ---
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] pt-20 sm:pt-24 pb-12 transition-colors duration-300">
      {/* Background Glow (Dark Mode Only) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-0 dark:opacity-100 transition-opacity">
        <div className="absolute top-0 left-1/4 w-[1000px] h-[400px] bg-blue-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[800px] h-[400px] bg-purple-900/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3 tracking-tight">
              Shopping Cart
              <span className="text-sm font-medium bg-blue-100 dark:bg-white/5 text-blue-700 dark:text-gray-300 px-3 py-1 rounded-full border border-blue-200 dark:border-white/10">
                {cart.totalItems} Items
              </span>
            </h1>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* --- LEFT COLUMN: ITEMS --- */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {cart.items.map((item: any) => {
                const imageUrl = getProductImage(item.product);
                const isUpdating = updating === item._id;

                const originalPrice = item.product.price;
                const sellingPrice = item.price;
                const hasDiscount = originalPrice > sellingPrice;
                const fitStatus = userGarage
                  ? checkCompatibility(item.product, userGarage)
                  : null;
                return (
                  <motion.div
                    key={item._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    className="group relative bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-white/5 rounded-2xl p-4 sm:p-6 shadow-sm dark:shadow-none hover:shadow-md dark:hover:bg-white/[0.06] transition-all"
                  >
                    <div className="flex gap-4 sm:gap-6">
                      <div className="relative h-20 w-20 sm:h-32 sm:w-32 flex-shrink-0 overflow-hidden rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20">
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={item.product?.name}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-gray-400 dark:text-gray-600">
                            <Package size={32} />
                          </div>
                        )}
                      </div>

                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 leading-snug">
                                {item.product?.name}
                              </h3>
                              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 font-mono">
                                Part #: {item.product?.partNumber}
                              </p>
                              {/* 🔥 INSERT THIS BLOCK: Garage Fitment Check */}
                              <div className="mt-2">
                                {userGarage ? (
                                  <div
                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${
                                      fitStatus
                                        ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20"
                                        : "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/20"
                                    }`}
                                  >
                                    {fitStatus ? (
                                      <>
                                        <CheckCircle size={12} /> Fits your{" "}
                                        {userGarage.model}
                                      </>
                                    ) : (
                                      <>
                                        <AlertCircle size={12} /> Doesn't fit{" "}
                                        {userGarage.model}
                                      </>
                                    )}
                                  </div>
                                ) : (
                                  // గ్యారేజ్ లేకపోతే సెట్ చేసుకోమని చిన్న లింక్
                                  <button
                                    onClick={() =>
                                      alert(
                                        "Please add your car in the Navbar or Home page!",
                                      )
                                    } // లేదా Modal ఓపెన్ చేసే లాజిక్
                                    className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:underline"
                                  >
                                    <AlertCircle size={12} /> Check
                                    compatibility
                                  </button>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={() => removeItem(item._id)}
                              disabled={isUpdating}
                              className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                              title="Remove Item"
                            >
                              {isUpdating ? (
                                <Loader2 className="animate-spin h-5 w-5" />
                              ) : (
                                <Trash2 size={20} />
                              )}
                            </button>
                          </div>

                          <div className="mt-3 flex flex-wrap items-center gap-3">
                            <span className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                              ₹{sellingPrice?.toLocaleString()}
                            </span>
                            {hasDiscount && (
                              <>
                                <span className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 line-through">
                                  ₹{originalPrice?.toLocaleString()}
                                </span>
                                <span className="text-[10px] font-bold text-green-700 dark:text-emerald-300 bg-green-100 dark:bg-emerald-500/10 px-2 py-0.5 rounded border border-green-200 dark:border-emerald-500/20 flex items-center gap-1">
                                  <Zap
                                    size={10}
                                    className="fill-green-700 dark:fill-emerald-300"
                                  />
                                  SAVED ₹
                                  {(
                                    originalPrice - sellingPrice
                                  ).toLocaleString()}
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center border border-gray-200 dark:border-white/10 rounded-xl bg-gray-50 dark:bg-black/20">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item._id,
                                  item.quantity - 1,
                                  item.product.stock,
                                )
                              }
                              disabled={item.quantity <= 1 || isUpdating}
                              className="p-1.5 sm:p-3 hover:bg-white dark:hover:bg-white/10 rounded-l-xl text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-30 transition"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="w-8 sm:w-10 text-center font-mono text-sm text-gray-900 dark:text-white">
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
                              className="p-1.5 sm:p-3 hover:bg-white dark:hover:bg-white/10 rounded-r-xl text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-30 transition"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                          {item.product?.stock <= 5 && (
                            <span className="text-[10px] sm:text-xs font-medium text-orange-600 dark:text-amber-400 flex items-center gap-1 bg-orange-50 dark:bg-amber-500/10 px-2 py-1 rounded-lg border border-orange-200 dark:border-amber-500/20">
                              <AlertCircle size={14} /> Only{" "}
                              {item.product.stock} left
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* ================= 🔥 NEW: SMART UPSELL SECTION 🔥 ================= */}
            {recommendations.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 pt-8 border-t border-dashed border-gray-200 dark:border-white/10"
              >
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="text-blue-600">✨</span> You might have
                  missed these
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {recommendations.map((rec) => (
                    <div
                      key={rec._id}
                      className="flex items-center gap-3 p-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/5 rounded-xl hover:border-blue-300 dark:hover:border-blue-500/30 transition-all shadow-sm group"
                    >
                      {/* Image */}
                      <div className="relative w-16 h-16 flex-shrink-0 bg-gray-50 dark:bg-black/20 rounded-lg overflow-hidden border border-gray-100 dark:border-white/5">
                        <Image
                          src={rec.images?.[0]?.url || ""}
                          alt={rec.name}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          fill
                          className="object-contain p-1 group-hover:scale-110 transition-transform"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                          {rec.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm font-bold text-gray-900 dark:text-white">
                            ₹{(rec.discountPrice || rec.price).toLocaleString()}
                          </span>
                          {rec.discountPrice && (
                            <span className="text-xs text-green-600 dark:text-emerald-400 bg-green-100 dark:bg-emerald-500/10 px-1.5 rounded">
                              Save ₹{rec.price - rec.discountPrice}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Add Button */}
                      <button
                        onClick={() => addRecommendation(rec._id)}
                        disabled={addingRec === rec._id}
                        className="p-2 bg-blue-50 dark:bg-blue-600/10 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-600 hover:text-white dark:hover:bg-blue-500 transition-colors disabled:opacity-50"
                      >
                        {addingRec === rec._id ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : (
                          <Plus size={18} />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
            {/* ================= END UPSELL SECTION ================= */}
          </div>

          {/* --- RIGHT COLUMN: SUMMARY --- */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-white/[0.03] dark:backdrop-blur-xl border border-gray-200 dark:border-white/5 rounded-3xl p-4 sm:p-6 lg:sticky lg:top-28 shadow-lg dark:shadow-2xl">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                Order Summary
              </h2>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900 dark:text-gray-200">
                    ₹{cart.subtotal?.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>GST ({cart.taxPercentage}%)</span>
                  <span className="font-medium text-gray-900 dark:text-gray-200">
                    ₹{cart.tax?.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Shipping</span>
                  {cart.shippingCharges === 0 ? (
                    <span className="text-green-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                      FREE <CheckCircle size={14} />
                    </span>
                  ) : (
                    <span className="font-medium text-gray-900 dark:text-gray-200">
                      ₹{cart.shippingCharges}
                    </span>
                  )}
                </div>

                {cart.shippingCharges > 0 && (
                  <div className="bg-blue-50 dark:bg-blue-500/5 p-3 rounded-xl border border-blue-100 dark:border-blue-500/20 mt-2">
                    <div className="flex justify-between text-xs text-blue-700 dark:text-blue-300 mb-2">
                      <span>
                        Add <b>₹{(5000 - cart.subtotal).toLocaleString()}</b>{" "}
                        for Free Shipping
                      </span>
                      <Truck size={14} />
                    </div>
                    <div className="h-1.5 w-full bg-blue-200 dark:bg-blue-900/50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 dark:bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                        style={{ width: `${(cart.subtotal / 5000) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="border-t border-dashed border-gray-200 dark:border-white/10 pt-4 mt-4">
                  <div className="flex justify-between items-end">
                    <span className="text-base font-semibold text-gray-900 dark:text-white">
                      Total Amount
                    </span>
                    <span className="text-2xl font-bold text-blue-600 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-blue-400 dark:to-purple-400">
                      ₹{cart.totalAmount?.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1 text-right">
                    Includes all taxes & charges
                  </p>
                </div>
              </div>

              {/* ✅ NEW: Delivery Estimate Feature (Glassmorphism & Amazon Style) */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-white/5">
                <div className="mb-3">
                  {pincodeStatus === "success" ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative overflow-hidden flex flex-col gap-1 p-4 bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl shadow-xl transition-all"
                    >
                      <div className="absolute -top-10 -right-10 w-24 h-24 bg-cyan-500/10 rounded-full blur-3xl"></div>
                      <div className="flex justify-between items-start relative z-10">
                        <div className="flex items-center gap-2">
                          <Truck size={16} className="text-emerald-500" />
                          <span className="text-[10px] font-black uppercase tracking-[0.15em] text-emerald-600 dark:text-emerald-400">
                            Estimated Delivery
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            setPincodeStatus(null);
                            setDeliveryMsg("");
                          }}
                          className="text-[10px] font-bold text-cyan-600 hover:text-cyan-500 uppercase tracking-wider"
                        >
                          CHANGE
                        </button>
                      </div>
                      <div className="mt-1 relative z-10">
                        <p className="text-sm font-bold text-gray-900 dark:text-white tracking-tight">
                          {deliveryMsg}
                        </p>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                          Shipping to{" "}
                          <span className="font-semibold text-gray-700 dark:text-gray-300">
                            {pincode}
                          </span>
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="relative">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-1">
                        <MapPin size={12} /> Check Delivery Date
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          maxLength={6}
                          placeholder="PINCODE"
                          className="flex-1 bg-gray-50 dark:bg-black/20 border border-gray-300 dark:border-white/10 rounded-xl px-3 py-2.5 sm:px-4 sm:py-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:outline-none placeholder-gray-400 dark:placeholder-gray-600 transition-all"
                          value={pincode}
                          onChange={(e) =>
                            setPincode(e.target.value.replace(/\D/g, ""))
                          }
                          onKeyDown={(e) =>
                            e.key === "Enter" && checkDelivery()
                          }
                        />
                        <button
                          onClick={() => checkDelivery()}
                          disabled={pincodeStatus === "loading"}
                          className="bg-gray-200 dark:bg-white/10 text-gray-900 dark:text-white px-4 rounded-xl text-sm font-bold hover:bg-gray-300 dark:hover:bg-white/20 disabled:opacity-50 transition-colors"
                        >
                          {pincodeStatus === "loading" ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            "Check"
                          )}
                        </button>
                      </div>
                      {pincodeStatus === "error" && (
                        <p className="text-[10px] text-red-500 mt-1 font-medium">
                          {deliveryMsg}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Coupon Code Section */}
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-white/5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">
                  Have a Coupon?
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="ENTER CODE"
                    value={couponCode}
                    onChange={(e) =>
                      setCouponCode(e.target.value.toUpperCase())
                    }
                    className="flex-1 bg-gray-50 dark:bg-black/20 border border-gray-300 dark:border-white/10 rounded-xl px-3 py-2.5 sm:px-4 sm:py-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:outline-none uppercase placeholder-gray-400 dark:placeholder-gray-600 transition-all"
                  />
                  <button
                    onClick={() => toast.success("Coupon logic coming soon!")}
                    disabled={!couponCode}
                    className="bg-gray-900 dark:bg-white text-white dark:text-black px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl text-sm font-bold hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </div>

              <button
                onClick={() => router.push("/checkout")}
                className="w-full mt-6 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-600 dark:to-blue-500 hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-500 dark:hover:to-blue-400 text-white py-3 sm:py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 transition-all transform active:scale-[0.98] border border-blue-500/20"
              >
                Checkout <ArrowRight size={20} />
              </button>

              <div className="mt-6 flex items-center justify-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck
                    size={14}
                    className="text-green-600 dark:text-emerald-500"
                  />{" "}
                  Secure
                </span>
                <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700"></span>
                <span className="flex items-center gap-1.5">
                  <Package
                    size={14}
                    className="text-blue-600 dark:text-blue-500"
                  />{" "}
                  Genuine
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
