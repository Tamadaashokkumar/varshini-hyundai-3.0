// // src/app/checkout/page.tsx
// "use client";

// import { useEffect, useState, useCallback } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useRouter } from "next/navigation";
// import { useStore } from "@/store/useStore";
// import { useAuth } from "@/hooks/useAuth";
// import apiClient from "@/services/apiClient";
// import toast from "react-hot-toast";
// import {
//   MapPin,
//   Plus,
//   CreditCard,
//   Package,
//   Tag,
//   Truck,
//   CheckCircle,
//   Loader2,
//   Home,
//   Building,
//   Wallet,
//   DollarSign,
//   AlertCircle,
// } from "lucide-react";
// import { AddAddressModal } from "@/components/checkout/AddAddressModal";
// import styles from "./page.module.css";

// // ==================== TYPE DEFINITIONS ====================
// interface Address {
//   _id: string;
//   addressType: string;
//   street: string;
//   city: string;
//   state: string;
//   pincode: string;
//   isDefault: boolean;
// }

// interface OrderResponse {
//   success: boolean;
//   data: {
//     order: {
//       _id: string;
//       orderNumber: string;
//       totalAmount: number;
//       paymentMethod: string;
//     };
//   };
// }

// interface RazorpayOrderResponse {
//   success: boolean;
//   data: {
//     razorpayOrderId: string;
//     amount: number;
//     keyId: string;
//     currency: string;
//   };
// }

// interface RazorpayResponse {
//   razorpay_order_id: string;
//   razorpay_payment_id: string;
//   razorpay_signature: string;
// }

// type PaymentMethod = "Razorpay" | "COD";

// // Extend Window interface for Razorpay
// declare global {
//   interface Window {
//     Razorpay: any;
//   }
// }

// // ==================== MAIN COMPONENT ====================
// export default function CheckoutPage() {
//   const router = useRouter();
//   const { user, isAuthenticated, loading: authLoading } = useAuth();
//   const { cart, setCart } = useStore();

//   // State management
//   const [addresses, setAddresses] = useState<Address[]>([]);
//   const [selectedAddressId, setSelectedAddressId] = useState<string>("");
//   const [selectedPaymentMethod, setSelectedPaymentMethod] =
//     useState<PaymentMethod>("Razorpay");
//   const [loading, setLoading] = useState(true);
//   const [processing, setProcessing] = useState(false);
//   const [showAddAddressModal, setShowAddAddressModal] = useState(false);
//   const [razorpayLoaded, setRazorpayLoaded] = useState(false);
//   const [scriptError, setScriptError] = useState(false);

//   // ==================== EFFECTS ====================
//   useEffect(() => {
//     if (!authLoading && !isAuthenticated) {
//       toast.error("Please login to continue");
//       router.push("/login");
//       return;
//     }

//     if (!authLoading && isAuthenticated && (!cart || cart.items.length === 0)) {
//       toast.error("Your cart is empty");
//       router.push("/cart");
//       return;
//     }

//     if (isAuthenticated && cart && cart.items.length > 0) {
//       fetchAddresses();
//       loadRazorpayScript();
//     }
//   }, [authLoading, isAuthenticated, cart, router]);

//   // ==================== RAZORPAY SCRIPT LOADING ====================
//   const loadRazorpayScript = useCallback(() => {
//     if (window.Razorpay) {
//       setRazorpayLoaded(true);
//       return;
//     }

//     const existingScript = document.querySelector('script[src*="razorpay"]');
//     if (existingScript) {
//       existingScript.addEventListener("load", () => {
//         setRazorpayLoaded(true);
//       });
//       return;
//     }

//     const script = document.createElement("script");
//     script.src = "https://checkout.razorpay.com/v1/checkout.js";
//     script.async = true;

//     script.onload = () => {
//       setRazorpayLoaded(true);
//       setScriptError(false);
//     };

//     script.onerror = () => {
//       setScriptError(true);
//       setRazorpayLoaded(false);
//       toast.error("Failed to load payment gateway");
//     };

//     document.body.appendChild(script);
//   }, []);

//   // ==================== FETCH ADDRESSES ====================
//   const fetchAddresses = async () => {
//     setLoading(true);
//     try {
//       const response = await apiClient.get("/auth/profile");
//       if (response.data.success) {
//         const userAddresses = response.data.data.user.addresses || [];
//         setAddresses(userAddresses);

//         const defaultAddress = userAddresses.find(
//           (addr: Address) => addr.isDefault,
//         );
//         if (defaultAddress) {
//           setSelectedAddressId(defaultAddress._id);
//         } else if (userAddresses.length > 0) {
//           setSelectedAddressId(userAddresses[0]._id);
//         }
//       }
//     } catch (error: any) {
//       console.error("Error fetching addresses:", error);
//       toast.error("Failed to load addresses");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ==================== ADDRESS HANDLERS ====================
//   const handleAddressAdded = useCallback(() => {
//     setShowAddAddressModal(false);
//     fetchAddresses();
//     toast.success("Address added successfully");
//   }, []);

//   // ==================== COD PAYMENT HANDLER ====================
//   const handleCODPayment = async () => {
//     if (!selectedAddressId) {
//       toast.error("Please select a delivery address");
//       return;
//     }

//     if (!cart) {
//       toast.error("Cart is empty");
//       return;
//     }

//     setProcessing(true);

//     try {
//       const orderPayload = {
//         shippingAddressId: selectedAddressId,
//         paymentMethod: "COD",
//       };

//       const response = await apiClient.post("/orders", orderPayload);
//       const apiResponse = response.data;

//       console.log("Full API Response:", apiResponse);

//       if (!apiResponse.success) {
//         throw new Error(apiResponse.message || "Failed to create order");
//       }

//       const orderId = apiResponse.data?.order?._id;

//       if (!orderId) {
//         throw new Error("Order ID missing in response");
//       }

//       toast.success(apiResponse.message || "Order placed successfully!");
//       router.push(`/orders/success?orderId=${orderId}`);
//     } catch (error: any) {
//       console.error("COD Payment error:", error);
//       const errorMessage =
//         error.response?.data?.message ||
//         error.response?.data?.error ||
//         error.message ||
//         "Failed to place order";

//       toast.error(errorMessage);
//     } finally {
//       setProcessing(false);
//     }
//   };

//   // ==================== UNIFIED PAYMENT HANDLER ====================
//   const handlePayment = () => {
//     if (selectedPaymentMethod === "COD") {
//       handleCODPayment();
//     } else {
//       // handleRazorpayPayment();
//       toast.error("Online payment integration pending"); // Temporary placeholder
//     }
//   };

//   // ==================== LOADING STATE ====================
//   if (authLoading || loading) {
//     return <LoadingSkeleton />;
//   }

//   if (!isAuthenticated || !cart) {
//     return null;
//   }

//   // ==================== RENDER ====================
//   return (
//     <div
//       className={`${styles.container} bg-gray-50 dark:bg-black min-h-screen`}
//     >
//       <motion.div
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//         className={styles.header}
//       >
//         <h1
//           className={`${styles.title} text-3xl font-bold text-gray-900 dark:text-white`}
//         >
//           Checkout
//         </h1>
//         <p
//           className={`${styles.subtitle} text-gray-600 dark:text-gray-400 mt-2`}
//         >
//           Complete your order securely
//         </p>
//       </motion.div>

//       <div className={styles.content}>
//         <div className={styles.leftColumn}>
//           {/* Address Section */}
//           <motion.div
//             initial={{ opacity: 0, x: -20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.6, delay: 0.2 }}
//             className={`${styles.section} bg-white dark:bg-[#FFFFFF0D] border border-gray-100 dark:border-gray-800`}
//           >
//             <div className={styles.sectionHeader}>
//               <MapPin className="text-blue-600 dark:text-blue-400" size={24} />
//               <h2
//                 className={`${styles.sectionTitle} text-xl font-bold text-gray-900 dark:text-white`}
//               >
//                 Delivery Address
//               </h2>
//             </div>

//             {addresses.length === 0 ? (
//               <div className={styles.noAddresses}>
//                 <MapPin size={48} className="text-gray-400 mb-4" />
//                 <p className="text-gray-600 dark:text-gray-400 mb-4">
//                   No saved addresses. Add one to continue.
//                 </p>
//                 <motion.button
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   onClick={() => setShowAddAddressModal(true)}
//                   className={`${styles.addAddressButton} bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400`}
//                 >
//                   <Plus size={20} />
//                   Add Delivery Address
//                 </motion.button>
//               </div>
//             ) : (
//               <>
//                 <div className={styles.addressList}>
//                   {addresses.map((address, index) => (
//                     <motion.div
//                       key={address._id}
//                       initial={{ opacity: 0, y: 20 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{ delay: index * 0.1 }}
//                       onClick={() => setSelectedAddressId(address._id)}
//                       className={`${styles.addressCard} border rounded-xl p-4 cursor-pointer relative transition-all ${
//                         selectedAddressId === address._id
//                           ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/10 dark:border-blue-400"
//                           : "border-gray-200 dark:border-gray-700 hover:border-blue-300 bg-white dark:bg-transparent"
//                       }`}
//                     >
//                       {selectedAddressId === address._id && (
//                         <motion.div
//                           initial={{ scale: 0 }}
//                           animate={{ scale: 1 }}
//                           className="absolute top-4 right-4 text-blue-600 dark:text-blue-400"
//                         >
//                           <CheckCircle size={20} />
//                         </motion.div>
//                       )}

//                       <div className="flex items-center gap-2 mb-2">
//                         {address.addressType === "Home" ? (
//                           <Home
//                             size={18}
//                             className="text-gray-500 dark:text-gray-400"
//                           />
//                         ) : (
//                           <Building
//                             size={18}
//                             className="text-gray-500 dark:text-gray-400"
//                           />
//                         )}
//                         <span className="font-semibold text-gray-900 dark:text-white">
//                           {address.addressType}
//                         </span>
//                         {address.isDefault && (
//                           <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full">
//                             Default
//                           </span>
//                         )}
//                       </div>

//                       <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
//                         <p>{address.street}</p>
//                         <p>
//                           {address.city}, {address.state}
//                         </p>
//                         <p className="font-medium">PIN: {address.pincode}</p>
//                       </div>
//                     </motion.div>
//                   ))}
//                 </div>

//                 <motion.button
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                   onClick={() => setShowAddAddressModal(true)}
//                   className="mt-4 flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
//                 >
//                   <Plus size={18} />
//                   Add New Address
//                 </motion.button>
//               </>
//             )}
//           </motion.div>

//           {/* Payment Method Section */}
//           <motion.div
//             initial={{ opacity: 0, x: -20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.6, delay: 0.4 }}
//             className={`${styles.section} bg-white dark:bg-[#FFFFFF0D] border border-gray-100 dark:border-gray-800`}
//           >
//             <div className={styles.sectionHeader}>
//               <CreditCard
//                 className="text-blue-600 dark:text-blue-400"
//                 size={24}
//               />
//               <h2
//                 className={`${styles.sectionTitle} text-xl font-bold text-gray-900 dark:text-white`}
//               >
//                 Payment Method
//               </h2>
//             </div>

//             <div className={styles.paymentMethods}>
//               <motion.div
//                 whileHover={{ scale: 1.02 }}
//                 onClick={() => setSelectedPaymentMethod("Razorpay")}
//                 className={`${styles.paymentCard} border rounded-xl p-4 cursor-pointer relative transition-all ${
//                   selectedPaymentMethod === "Razorpay"
//                     ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/10 dark:border-blue-400"
//                     : "border-gray-200 dark:border-gray-700 bg-white dark:bg-transparent"
//                 }`}
//               >
//                 {selectedPaymentMethod === "Razorpay" && (
//                   <div className="absolute top-4 right-4 text-blue-600 dark:text-blue-400">
//                     <CheckCircle size={20} />
//                   </div>
//                 )}
//                 <Wallet
//                   size={32}
//                   className="text-blue-600 dark:text-blue-400 mb-3"
//                 />
//                 <h3 className="font-bold text-gray-900 dark:text-white mb-1">
//                   Online Payment
//                 </h3>
//                 <p className="text-sm text-gray-500 dark:text-gray-400">
//                   Pay with Card, UPI, Net Banking
//                 </p>
//                 {!razorpayLoaded && selectedPaymentMethod === "Razorpay" && (
//                   <div className="flex items-center gap-2 mt-2 text-xs text-yellow-600 dark:text-yellow-500">
//                     <AlertCircle size={14} />
//                     <span>Loading...</span>
//                   </div>
//                 )}
//               </motion.div>

//               <motion.div
//                 whileHover={{ scale: 1.02 }}
//                 onClick={() => setSelectedPaymentMethod("COD")}
//                 className={`${styles.paymentCard} border rounded-xl p-4 cursor-pointer relative transition-all ${
//                   selectedPaymentMethod === "COD"
//                     ? "border-green-500 bg-green-50/50 dark:bg-green-900/10 dark:border-green-400"
//                     : "border-gray-200 dark:border-gray-700 bg-white dark:bg-transparent"
//                 }`}
//               >
//                 {selectedPaymentMethod === "COD" && (
//                   <div className="absolute top-4 right-4 text-green-600 dark:text-green-400">
//                     <CheckCircle size={20} />
//                   </div>
//                 )}
//                 <DollarSign
//                   size={32}
//                   className="text-green-600 dark:text-green-400 mb-3"
//                 />
//                 <h3 className="font-bold text-gray-900 dark:text-white mb-1">
//                   Cash on Delivery
//                 </h3>
//                 <p className="text-sm text-gray-500 dark:text-gray-400">
//                   Pay when you receive
//                 </p>
//               </motion.div>
//             </div>
//           </motion.div>
//         </div>

//         {/* Order Summary */}
//         <motion.div
//           initial={{ opacity: 0, x: 20 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 0.6, delay: 0.3 }}
//           className={`${styles.orderSummary} bg-white dark:bg-[#FFFFFF0D] border border-gray-100 dark:border-gray-800`}
//         >
//           <h2
//             className={`${styles.summaryTitle} text-xl font-bold text-gray-900 dark:text-white mb-6`}
//           >
//             Order Summary
//           </h2>

//           <div className={styles.itemsPreview}>
//             <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
//               {cart.totalItems} {cart.totalItems === 1 ? "item" : "items"}
//             </p>
//             <div className="space-y-3 mb-4">
//               {cart.items.slice(0, 3).map((item) => (
//                 <div
//                   key={item._id}
//                   className="flex justify-between items-start text-sm"
//                 >
//                   <span className="text-gray-700 dark:text-gray-300">
//                     {item.product.name} × {item.quantity}
//                   </span>
//                   <span className="font-semibold text-gray-900 dark:text-white">
//                     ₹{item.subtotal}
//                   </span>
//                 </div>
//               ))}
//               {cart.items.length > 3 && (
//                 <p className="text-xs text-blue-600 dark:text-blue-400 font-medium cursor-pointer">
//                   +{cart.items.length - 3} more items
//                 </p>
//               )}
//             </div>
//           </div>

//           <div className="border-t border-gray-100 dark:border-gray-800 pt-4 space-y-3">
//             <div className="flex justify-between text-sm">
//               <span className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
//                 <Package size={16} />
//                 Subtotal
//               </span>
//               <span className="font-medium text-gray-900 dark:text-white">
//                 ₹{cart.subtotal}
//               </span>
//             </div>

//             <div className="flex justify-between text-sm">
//               <span className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
//                 <Tag size={16} />
//                 GST (18%)
//               </span>
//               <span className="font-medium text-gray-900 dark:text-white">
//                 ₹{cart.tax}
//               </span>
//             </div>

//             <div className="flex justify-between text-sm">
//               <span className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
//                 <Truck size={16} />
//                 Shipping
//               </span>
//               <span className="font-medium text-gray-900 dark:text-white">
//                 {cart.shippingCharges === 0 ? (
//                   <span className="text-green-600 dark:text-green-400 font-bold">
//                     FREE
//                   </span>
//                 ) : (
//                   `₹${cart.shippingCharges}`
//                 )}
//               </span>
//             </div>

//             <div className="border-t border-dashed border-gray-200 dark:border-gray-700 my-4" />

//             <div className="flex justify-between items-center text-lg font-bold">
//               <span className="text-gray-900 dark:text-white">Total</span>
//               <span className="text-blue-600 dark:text-blue-400">
//                 ₹{cart.totalAmount}
//               </span>
//             </div>
//           </div>

//           <motion.button
//             whileHover={{ scale: processing ? 1 : 1.02 }}
//             whileTap={{ scale: processing ? 1 : 0.98 }}
//             onClick={handlePayment}
//             disabled={
//               processing || !selectedAddressId || addresses.length === 0
//             }
//             className={`${styles.paymentButton} w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/30 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
//           >
//             {processing ? (
//               <>
//                 <Loader2 size={20} className="animate-spin" />
//                 Processing...
//               </>
//             ) : (
//               <>
//                 {selectedPaymentMethod === "Razorpay" ? (
//                   <>
//                     <CreditCard size={20} />
//                     Pay ₹{cart.totalAmount}
//                   </>
//                 ) : (
//                   <>
//                     <DollarSign size={20} />
//                     Place Order (COD)
//                   </>
//                 )}
//               </>
//             )}
//           </motion.button>

//           <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
//             <CheckCircle
//               size={14}
//               className="text-green-600 dark:text-green-500"
//             />
//             <span>
//               {selectedPaymentMethod === "Razorpay"
//                 ? "Secure payment by Razorpay"
//                 : "Safe Cash on Delivery"}
//             </span>
//           </div>
//         </motion.div>
//       </div>

//       <AnimatePresence>
//         {showAddAddressModal && (
//           <AddAddressModal
//             onClose={() => setShowAddAddressModal(false)}
//             onSuccess={handleAddressAdded}
//           />
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

// function LoadingSkeleton() {
//   return (
//     <div className={`${styles.container} bg-gray-50 dark:bg-black p-8`}>
//       <div className={styles.header}>
//         <div className="h-10 w-48 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse mb-3" />
//         <div className="h-5 w-64 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
//       </div>
//       <div className={styles.content}>
//         <div className={styles.leftColumn}>
//           <div
//             className="bg-white dark:bg-gray-900 rounded-xl p-6 mb-6"
//             style={{ height: "400px" }}
//           >
//             <div className="h-full w-full bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
//           </div>
//           <div
//             className="bg-white dark:bg-gray-900 rounded-xl p-6"
//             style={{ height: "300px" }}
//           >
//             <div className="h-full w-full bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
//           </div>
//         </div>
//         <div
//           className="bg-white dark:bg-gray-900 rounded-xl p-6"
//           style={{ height: "500px" }}
//         >
//           <div className="h-full w-full bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
//         </div>
//       </div>
//     </div>
//   );
// }

// "use client";

// import { useEffect, useState, useCallback } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useRouter } from "next/navigation";
// import { useStore } from "@/store/useStore";
// import { useAuth } from "@/hooks/useAuth";
// import apiClient from "@/services/apiClient";
// import toast from "react-hot-toast";
// import {
//   MapPin,
//   Plus,
//   CreditCard,
//   Package,
//   Tag,
//   Truck,
//   CheckCircle,
//   Loader2,
//   Home,
//   Building,
//   Wallet,
//   DollarSign,
//   ShieldCheck,
// } from "lucide-react";
// import { AddAddressModal } from "@/components/checkout/AddAddressModal";
// import styles from "./page.module.css";

// // ==================== TYPE DEFINITIONS ====================
// interface Address {
//   _id: string;
//   addressType: string;
//   street: string;
//   city: string;
//   state: string;
//   pincode: string;
//   isDefault: boolean;
// }

// type PaymentMethod = "Razorpay" | "COD";

// // ==================== MAIN COMPONENT ====================
// export default function CheckoutPage() {
//   const router = useRouter();
//   const { user, isAuthenticated, loading: authLoading } = useAuth();
//   const { cart, setCart } = useStore();

//   // State management
//   const [addresses, setAddresses] = useState<Address[]>([]);
//   const [selectedAddressId, setSelectedAddressId] = useState<string>("");
//   const [selectedPaymentMethod, setSelectedPaymentMethod] =
//     useState<PaymentMethod>("COD");

//   // Loading States
//   const [loading, setLoading] = useState(true); // Initial data fetch
//   const [processing, setProcessing] = useState(false); // Order submission
//   const [isOrderPlaced, setIsOrderPlaced] = useState(false); // Success transition

//   // Modals & Pincode
//   const [showAddAddressModal, setShowAddAddressModal] = useState(false);
//   const [pincode, setPincode] = useState("");
//   const [pincodeStatus, setPincodeStatus] = useState<
//     "loading" | "success" | "error" | null
//   >(null);
//   const [deliveryMsg, setDeliveryMsg] = useState("");

//   // 🔥 MASTER LOADER LOGIC
//   // పేజీ లోడ్ అవుతున్నప్పుడు, లేదా ఆర్డర్ ప్రాసెస్ అవుతున్నప్పుడు, లేదా సక్సెస్ అయ్యాక
//   // ఈ లోడర్ స్క్రీన్ ని కవర్ చేస్తుంది.
//   const showOverlayLoader =
//     authLoading || loading || processing || isOrderPlaced;

//   // ==================== EFFECTS ====================

//   // 1. Auth & Cart Validation (Reload Issue Fix)
//   useEffect(() => {
//     if (authLoading) return; // Wait for auth

//     if (!isAuthenticated) {
//       toast.error("Please login to continue");
//       router.push("/login");
//       return;
//     }

//     // Cart Check - only if not already placed order
//     if (!isOrderPlaced && cart !== null && !loading) {
//       if (cart.items.length === 0) {
//         // చిన్న డిలే ఇవ్వడం వల్ల రీలోడ్ అప్పుడు వెంటనే Redirect అవ్వదు
//         const timer = setTimeout(() => {
//           if (cart.items.length === 0) {
//             toast.error("Your cart is empty");
//             router.push("/cart");
//           }
//         }, 500);
//         return () => clearTimeout(timer);
//       }
//     }
//   }, [authLoading, isAuthenticated, cart, router, isOrderPlaced, loading]);

//   // 2. Load Data
//   useEffect(() => {
//     if (isAuthenticated && cart && cart.items.length > 0) {
//       fetchAddresses();
//     } else if (isAuthenticated && cart && cart.items.length === 0) {
//       setLoading(false); // Cart empty but authenticated (handled by redirect above)
//     }
//   }, [isAuthenticated, cart]);

//   // 3. Load Saved Pincode
//   useEffect(() => {
//     const savedPin = localStorage.getItem("user_pincode");
//     if (savedPin) {
//       setPincode(savedPin);
//       checkDelivery(savedPin);
//     }
//   }, []);

//   // ==================== API FUNCTIONS ====================
//   const fetchAddresses = async () => {
//     setLoading(true);
//     try {
//       const response = await apiClient.get("/auth/profile");
//       if (response.data.success) {
//         const userAddresses = response.data.data.user.addresses || [];
//         setAddresses(userAddresses);

//         const defaultAddress = userAddresses.find(
//           (addr: Address) => addr.isDefault,
//         );
//         if (defaultAddress) setSelectedAddressId(defaultAddress._id);
//         else if (userAddresses.length > 0)
//           setSelectedAddressId(userAddresses[0]._id);
//       }
//     } catch (error) {
//       console.error("Error fetching addresses:", error);
//       toast.error("Failed to load addresses");
//     } finally {
//       setLoading(false);
//     }
//   };

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

//         // Delivery Date Logic (Same as before)
//         let deliveryDate = new Date();
//         if (deliveryDate.getHours() >= 14)
//           deliveryDate.setDate(deliveryDate.getDate() + 1);

//         let daysToAdd = 7;
//         const isLocalHyd =
//           codeToCheck.startsWith("500") ||
//           codeToCheck.startsWith("501") ||
//           codeToCheck.startsWith("502");
//         const isSouthMetro =
//           codeToCheck.startsWith("560") || codeToCheck.startsWith("600");

//         if (isLocalHyd) daysToAdd = 2;
//         else if (state === "Telangana") daysToAdd = 3;
//         else if (state === "Andhra Pradesh") daysToAdd = 4;
//         else if (
//           isSouthMetro ||
//           ["Karnataka", "Tamil Nadu", "Maharashtra"].includes(state)
//         )
//           daysToAdd = 5;
//         else daysToAdd = 7;

//         deliveryDate.setDate(deliveryDate.getDate() + daysToAdd);
//         if (deliveryDate.getDay() === 0)
//           deliveryDate.setDate(deliveryDate.getDate() + 1);

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

//   const handleAddressAdded = useCallback(() => {
//     setShowAddAddressModal(false);
//     fetchAddresses();
//     toast.success("Address added successfully");
//   }, []);

//   const handlePlaceOrder = async () => {
//     if (!selectedAddressId)
//       return toast.error("Please select a delivery address");
//     if (!cart) return toast.error("Cart is empty");

//     setProcessing(true); // START OVERLAY LOADER

//     try {
//       const orderPayload = {
//         shippingAddressId: selectedAddressId,
//         paymentMethod: selectedPaymentMethod,
//       };

//       const response = await apiClient.post("/orders", orderPayload);

//       if (response.data.success) {
//         const orderId = response.data.data?.order?._id;
//         if (!orderId) throw new Error("Order ID missing");

//         toast.success("Order placed successfully!");
//         setIsOrderPlaced(true); // KEEP OVERLAY LOADER ON
//         setCart(null);
//         router.push(`/orders/success?orderId=${orderId}`);
//       } else {
//         throw new Error(response.data.message || "Failed");
//       }
//     } catch (error: any) {
//       console.error("Order Error:", error);
//       toast.error(error.response?.data?.message || "Failed to place order");
//       setProcessing(false); // Hide loader only on error
//     }
//   };

//   const handlePaymentClick = () => {
//     if (selectedPaymentMethod === "Razorpay") {
//       toast.error("Online payment unavailable. Use COD.");
//       setSelectedPaymentMethod("COD");
//     } else {
//       handlePlaceOrder();
//     }
//   };

//   // ==================== RENDER ====================
//   return (
//     <div
//       className={`${styles.container} bg-gray-50 dark:bg-black min-h-screen relative`}
//     >
//       {/* 🔥🔥 1. BIG ANIMATED OVERLAY LOADER 🔥🔥 */}
//       {/* ఇది Loading, Processing, Success అన్ని సమయాల్లో టాప్ లో ఉంటుంది */}
//       <AnimatePresence>
//         {showOverlayLoader && (
//           <CheckoutLoader
//             message={
//               isOrderPlaced
//                 ? "Order Placed Successfully!"
//                 : processing
//                   ? "Securing your Order..."
//                   : "Loading Checkout..."
//             }
//           />
//         )}
//       </AnimatePresence>

//       {/* 🔥🔥 2. CONDITIONAL CONTENT RENDER 🔥🔥 */}
//       {/* - authLoading లేదా loading ఉన్నప్పుడు 'LoadingSkeleton' చూపిస్తాం.
//          - దీని వల్ల పేజీ Height ఉంటుంది, Footer పైకి రాదు.
//          - పైన ఉన్న 'CheckoutLoader' దీని పైన కవర్ చేస్తుంది కాబట్టి యూజర్ కి స్మూత్ గా ఉంటుంది.
//       */}
//       {authLoading || loading || !cart ? (
//         <LoadingSkeleton />
//       ) : (
//         // అసలు కంటెంట్ (Data is Ready)
//         isAuthenticated &&
//         cart && (
//           <>
//             <motion.div
//               initial={{ opacity: 0, y: -20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6 }}
//               className={styles.header}
//             >
//               <h1
//                 className={`${styles.title} text-3xl font-bold text-gray-900 dark:text-white`}
//               >
//                 Checkout
//               </h1>
//               <p
//                 className={`${styles.subtitle} text-gray-600 dark:text-gray-400 mt-2`}
//               >
//                 Complete your order securely
//               </p>
//             </motion.div>

//             <div className={styles.content}>
//               <div className={styles.leftColumn}>
//                 {/* Address Section */}
//                 <motion.div
//                   initial={{ opacity: 0, x: -20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   className={`${styles.section} bg-white dark:bg-[#FFFFFF0D] border border-gray-100 dark:border-gray-800`}
//                 >
//                   <div className={styles.sectionHeader}>
//                     <MapPin
//                       className="text-blue-600 dark:text-blue-400"
//                       size={24}
//                     />
//                     <h2
//                       className={`${styles.sectionTitle} text-xl font-bold text-gray-900 dark:text-white`}
//                     >
//                       Delivery Address
//                     </h2>
//                   </div>

//                   {addresses.length === 0 ? (
//                     <div className={styles.noAddresses}>
//                       <MapPin size={48} className="text-gray-400 mb-4" />
//                       <p className="text-gray-600 dark:text-gray-400 mb-4">
//                         No saved addresses.
//                       </p>
//                       <button
//                         onClick={() => setShowAddAddressModal(true)}
//                         className={`${styles.addAddressButton} bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400`}
//                       >
//                         <Plus size={20} /> Add Delivery Address
//                       </button>
//                     </div>
//                   ) : (
//                     <>
//                       <div className={styles.addressList}>
//                         {addresses.map((address) => (
//                           <div
//                             key={address._id}
//                             onClick={() => setSelectedAddressId(address._id)}
//                             className={`${styles.addressCard} border rounded-xl p-4 cursor-pointer relative transition-all ${
//                               selectedAddressId === address._id
//                                 ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/10"
//                                 : "border-gray-200 dark:border-gray-700"
//                             }`}
//                           >
//                             {selectedAddressId === address._id && (
//                               <div className="absolute top-4 right-4 text-blue-600 dark:text-blue-400">
//                                 <CheckCircle size={20} />
//                               </div>
//                             )}
//                             <div className="flex items-center gap-2 mb-2">
//                               {address.addressType === "Home" ? (
//                                 <Home size={18} />
//                               ) : (
//                                 <Building size={18} />
//                               )}
//                               <span className="font-semibold text-gray-900 dark:text-white">
//                                 {address.addressType}
//                               </span>
//                               {address.isDefault && (
//                                 <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
//                                   Default
//                                 </span>
//                               )}
//                             </div>
//                             <div className="text-sm text-gray-600 dark:text-gray-300">
//                               <p>{address.street}</p>
//                               <p>
//                                 {address.city}, {address.state}
//                               </p>
//                               <p className="font-bold">{address.pincode}</p>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                       <button
//                         onClick={() => setShowAddAddressModal(true)}
//                         className="mt-4 flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
//                       >
//                         <Plus size={18} /> Add New Address
//                       </button>
//                     </>
//                   )}
//                 </motion.div>

//                 {/* Payment Method */}
//                 <motion.div
//                   initial={{ opacity: 0, x: -20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   transition={{ delay: 0.2 }}
//                   className={`${styles.section} bg-white dark:bg-[#FFFFFF0D] border border-gray-100 dark:border-gray-800`}
//                 >
//                   <div className={styles.sectionHeader}>
//                     <CreditCard
//                       className="text-blue-600 dark:text-blue-400"
//                       size={24}
//                     />
//                     <h2
//                       className={`${styles.sectionTitle} text-xl font-bold text-gray-900 dark:text-white`}
//                     >
//                       Payment Method
//                     </h2>
//                   </div>
//                   <div className={styles.paymentMethods}>
//                     <div
//                       onClick={() => setSelectedPaymentMethod("Razorpay")}
//                       className={`${styles.paymentCard} border rounded-xl p-4 cursor-pointer relative ${
//                         selectedPaymentMethod === "Razorpay"
//                           ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/10"
//                           : "border-gray-200 dark:border-gray-700 opacity-60"
//                       }`}
//                     >
//                       {selectedPaymentMethod === "Razorpay" && (
//                         <div className="absolute top-4 right-4 text-blue-600">
//                           <CheckCircle size={20} />
//                         </div>
//                       )}
//                       <Wallet size={32} className="text-blue-600 mb-3" />
//                       <h3 className="font-bold text-gray-900 dark:text-white">
//                         Online Payment
//                       </h3>
//                       <span className="text-[10px] bg-yellow-100 text-yellow-800 px-2 rounded">
//                         Coming Soon
//                       </span>
//                     </div>
//                     <div
//                       onClick={() => setSelectedPaymentMethod("COD")}
//                       className={`${styles.paymentCard} border rounded-xl p-4 cursor-pointer relative ${
//                         selectedPaymentMethod === "COD"
//                           ? "border-green-500 bg-green-50/50 dark:bg-green-900/10"
//                           : "border-gray-200 dark:border-gray-700"
//                       }`}
//                     >
//                       {selectedPaymentMethod === "COD" && (
//                         <div className="absolute top-4 right-4 text-green-600">
//                           <CheckCircle size={20} />
//                         </div>
//                       )}
//                       <DollarSign size={32} className="text-green-600 mb-3" />
//                       <h3 className="font-bold text-gray-900 dark:text-white">
//                         Cash on Delivery
//                       </h3>
//                       <p className="text-sm text-gray-500">
//                         Pay when you receive
//                       </p>
//                     </div>
//                   </div>
//                 </motion.div>
//               </div>

//               {/* Right Column: Order Summary */}
//               <div
//                 className={
//                   styles.orderSummary +
//                   " bg-white dark:bg-[#FFFFFF0D] border border-gray-100 dark:border-gray-800"
//                 }
//               >
//                 <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
//                   Order Summary
//                 </h2>
//                 <div className="space-y-4 mb-6">
//                   {cart.items.slice(0, 3).map((item) => (
//                     <div
//                       key={item._id}
//                       className="flex justify-between text-sm"
//                     >
//                       <span className="text-gray-700 dark:text-gray-300">
//                         {item.product.name} × {item.quantity}
//                       </span>
//                       <span className="font-semibold text-gray-900 dark:text-white">
//                         ₹{item.subtotal}
//                       </span>
//                     </div>
//                   ))}
//                   {cart.items.length > 3 && (
//                     <p className="text-xs text-blue-500">
//                       +{cart.items.length - 3} more items
//                     </p>
//                   )}
//                 </div>

//                 <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
//                   <div className="flex justify-between text-sm">
//                     <span>Subtotal</span>
//                     <span>₹{cart.subtotal}</span>
//                   </div>
//                   <div className="flex justify-between text-sm">
//                     <span>Tax</span>
//                     <span>₹{cart.tax}</span>
//                   </div>
//                   <div className="flex justify-between text-sm">
//                     <span>Shipping</span>
//                     <span className="text-green-500">
//                       {cart.shippingCharges === 0
//                         ? "FREE"
//                         : `₹${cart.shippingCharges}`}
//                     </span>
//                   </div>
//                   <div className="flex justify-between text-lg font-bold mt-2 pt-2 border-t dark:border-gray-700">
//                     <span>Total</span>
//                     <span className="text-blue-600">₹{cart.totalAmount}</span>
//                   </div>
//                 </div>

//                 {/* Pincode Checker */}
//                 <div className="mt-6 pt-6 border-t dark:border-gray-700">
//                   {pincodeStatus === "success" ? (
//                     <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
//                       <div className="flex justify-between items-center mb-1">
//                         <div className="flex items-center gap-2 text-green-700 dark:text-green-400 font-bold text-xs uppercase">
//                           <Truck size={14} /> Estimated Delivery
//                         </div>
//                         <button
//                           onClick={() => {
//                             setPincodeStatus(null);
//                             setDeliveryMsg("");
//                           }}
//                           className="text-xs text-blue-500 font-bold"
//                         >
//                           CHANGE
//                         </button>
//                       </div>
//                       <p className="text-sm font-bold text-gray-900 dark:text-white">
//                         {deliveryMsg}
//                       </p>
//                       <p className="text-xs text-gray-500">to {pincode}</p>
//                     </div>
//                   ) : (
//                     <div className="flex gap-2">
//                       <input
//                         type="text"
//                         maxLength={6}
//                         placeholder="Enter Pincode"
//                         value={pincode}
//                         onChange={(e) =>
//                           setPincode(e.target.value.replace(/\D/g, ""))
//                         }
//                         className="flex-1 bg-gray-50 dark:bg-black/20 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm"
//                       />
//                       <button
//                         onClick={() => checkDelivery()}
//                         disabled={pincodeStatus === "loading"}
//                         className="bg-gray-200 dark:bg-gray-800 px-3 rounded-lg text-sm font-bold"
//                       >
//                         {pincodeStatus === "loading" ? (
//                           <Loader2 className="animate-spin" size={16} />
//                         ) : (
//                           "Check"
//                         )}
//                       </button>
//                     </div>
//                   )}
//                   {pincodeStatus === "error" && (
//                     <p className="text-xs text-red-500 mt-1">{deliveryMsg}</p>
//                   )}
//                 </div>

//                 {/* Pay Button */}
//                 <motion.button
//                   whileTap={{ scale: 0.98 }}
//                   onClick={handlePaymentClick}
//                   disabled={processing || !selectedAddressId}
//                   className={`${styles.paymentButton} w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
//                 >
//                   {processing ? (
//                     <>
//                       <Loader2 className="animate-spin" /> Processing...
//                     </>
//                   ) : selectedPaymentMethod === "Razorpay" ? (
//                     `Pay ₹${cart.totalAmount}`
//                   ) : (
//                     "Place Order (COD)"
//                   )}
//                 </motion.button>
//               </div>
//             </div>

//             <AnimatePresence>
//               {showAddAddressModal && (
//                 <AddAddressModal
//                   onClose={() => setShowAddAddressModal(false)}
//                   onSuccess={handleAddressAdded}
//                 />
//               )}
//             </AnimatePresence>
//           </>
//         )
//       )}
//     </div>
//   );
// }

// // ==================== HELPER COMPONENTS ====================

// function LoadingSkeleton() {
//   return (
//     <div
//       className={`${styles.container} bg-gray-50 dark:bg-black p-8 min-h-screen`}
//     >
//       <div className="h-10 w-48 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse mb-6" />
//       <div className={styles.content}>
//         <div className={styles.leftColumn}>
//           <div className="bg-white dark:bg-gray-900 rounded-xl p-6 mb-6 h-[200px] animate-pulse" />
//           <div className="bg-white dark:bg-gray-900 rounded-xl p-6 h-[150px] animate-pulse" />
//         </div>
//         <div className="bg-white dark:bg-gray-900 rounded-xl p-6 h-[400px] animate-pulse" />
//       </div>
//     </div>
//   );
// }

// // ==================== BRANDED LOADER COMPONENT ====================

// function CheckoutLoader({ message }: { message: string }) {
//   return (
//     <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050B14] overflow-hidden">
//       {/* 1. Background Ambience */}
//       <motion.div
//         initial={{ opacity: 0.3, scale: 0.8 }}
//         animate={{ opacity: 0.6, scale: 1.2 }}
//         transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
//         className="absolute h-96 w-96 rounded-full bg-blue-700/10 blur-[120px]"
//       />

//       <div className="relative flex flex-col items-center justify-center gap-10 z-10">
//         {/* 2. Brand Name */}
//         <div className="text-center space-y-2">
//           <h1 className="text-2xl md:text-3xl font-bold tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-white to-blue-400 font-sans uppercase">
//             VARSHINI HYUNDAI
//           </h1>
//           {/* Dynamic Message passing from Props */}
//           <motion.p
//             key={message}
//             initial={{ opacity: 0, y: 5 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="text-xs text-blue-400/80 tracking-[0.5em] uppercase font-medium"
//           >
//             {message}
//           </motion.p>
//         </div>

//         {/* 3. Spinner Animation */}
//         <div className="relative h-24 w-24 mt-4">
//           {/* Outer Ring */}
//           <div
//             className="absolute inset-0 box-border rounded-full border-[3px] border-t-blue-500 border-r-transparent border-b-blue-500/30 border-l-transparent shadow-[0_0_20px_rgba(59,130,246,0.2)] animate-spin"
//             style={{ animationDuration: "2s" }}
//           />

//           {/* Inner Ring */}
//           <div
//             className="absolute inset-4 box-border rounded-full border-[3px] border-t-transparent border-r-cyan-400 border-b-transparent border-l-cyan-400/50 animate-spin"
//             style={{ animationDuration: "1.5s", animationDirection: "reverse" }}
//           />

//           {/* Center Icon (Shield for Security) */}
//           <div className="absolute inset-0 m-auto h-10 w-10 flex items-center justify-center rounded-full bg-gradient-to-tr from-blue-900 to-[#050B14] border border-blue-500/30">
//             {/* Note: Ensure ShieldCheck is imported from lucide-react */}
//             <ShieldCheck size={18} className="text-blue-400 animate-pulse" />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

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

  const handlePlaceOrder = async () => {
    if (!selectedAddressId)
      return toast.error("Please select a delivery address");
    if (!cart || cart.items.length === 0) return toast.error("Cart is empty");

    setProcessing(true);
    try {
      const orderPayload = {
        shippingAddressId: selectedAddressId,
        paymentMethod: selectedPaymentMethod,
      };
      const response = await apiClient.post("/orders", orderPayload);

      if (response.data.success) {
        const orderId = response.data.data?.order?._id;
        toast.success("Order placed successfully!");
        setCart(null);
        router.push(`/orders/success?orderId=${orderId}`);
      } else {
        throw new Error(response.data.message || "Failed");
      }
    } catch (error: any) {
      console.error("Order Error:", error);
      toast.error(error.response?.data?.message || "Failed to place order");
      setProcessing(false);
    }
  };

  const handlePaymentClick = () => {
    if (selectedPaymentMethod === "Razorpay") {
      toast.error("Online payment unavailable. Use COD.");
      setSelectedPaymentMethod("COD");
    } else {
      handlePlaceOrder();
    }
  };

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

                  {/* Online Payment (Coming Soon) */}
                  <div
                    onClick={() =>
                      toast.error("Online payments are currently disabled.")
                    }
                    className="flex items-center gap-4 p-5 rounded-2xl border-2 border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02] opacity-60 cursor-not-allowed grayscale transition-all"
                  >
                    <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-500/20 text-blue-600 flex items-center justify-center flex-shrink-0">
                      <Wallet size={24} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base text-gray-900 dark:text-white">
                          Online Payment
                        </h3>
                        <span className="text-[10px] font-bold bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full uppercase tracking-wider">
                          Soon
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        UPI, Credit/Debit Cards, Net Banking
                      </p>
                    </div>
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
