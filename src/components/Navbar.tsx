// "use client";

// import { useState, useEffect } from "react";
// import Link from "next/link";
// import { motion, AnimatePresence } from "framer-motion";
// import { useStore } from "@/store/useStore";
// import { useAuth } from "@/hooks/useAuth";
// import { usePathname } from "next/navigation";
// import toast from "react-hot-toast"; // Ensure react-hot-toast is installed
// import {
//   ShoppingCart,
//   Menu,
//   X,
//   Sun,
//   Moon,
//   LogOut,
//   Package,
//   Settings,
//   Heart,
//   Search,
//   User,
//   ChevronRight,
//   Car, // ✅ Added Car Icon
// } from "lucide-react";

// export const Navbar = () => {
//   const [scrolled, setScrolled] = useState(false);
//   const {
//     theme,
//     toggleTheme,
//     cartItemCount,
//     toggleCartDrawer,
//     isMobileMenuOpen,
//     toggleMobileMenu,
//   } = useStore();
//   const { user, isAuthenticated, logout } = useAuth();

//   // --- 🚗 MY GARAGE STATE & LOGIC ---
//   const [userGarage, setUserGarage] = useState<{
//     model: string;
//     year: number;
//   } | null>(null);
//   const [isGarageModalOpen, setIsGarageModalOpen] = useState(false);
//   const [garageForm, setGarageForm] = useState({ model: "", year: "" });

//   // Load Garage from Local Storage
//   useEffect(() => {
//     const handleScroll = () => {
//       setScrolled(window.scrollY > 20);
//     };
//     window.addEventListener("scroll", handleScroll);

//     // Check Local Storage
//     const savedGarage = localStorage.getItem("myGarage");
//     if (savedGarage) {
//       setUserGarage(JSON.parse(savedGarage));
//     }

//     // Listen for storage events (to sync if changed in another tab/component)
//     const handleStorageChange = () => {
//       const updated = localStorage.getItem("myGarage");
//       setUserGarage(updated ? JSON.parse(updated) : null);
//     };
//     window.addEventListener("storage", handleStorageChange);

//     return () => {
//       window.removeEventListener("scroll", handleScroll);
//       window.removeEventListener("storage", handleStorageChange);
//     };
//   }, []);

//   const saveGarage = () => {
//     if (!garageForm.model || !garageForm.year) {
//       toast.error("Please fill all fields");
//       return;
//     }
//     const car = { model: garageForm.model, year: parseInt(garageForm.year) };
//     localStorage.setItem("myGarage", JSON.stringify(car));
//     setUserGarage(car);
//     setIsGarageModalOpen(false);
//     toast.success("Garage updated!");
//   };

//   const removeGarage = () => {
//     localStorage.removeItem("myGarage");
//     setUserGarage(null);
//     setGarageForm({ model: "", year: "" });
//     toast.success("Car removed from garage");
//   };

//   // -----------------------------------

//   const pathname = usePathname();
//   if (
//     pathname === "/login" ||
//     pathname === "/register" ||
//     pathname === "/forgot-password" ||
//     pathname?.startsWith("/admin") ||
//     pathname === "/chat"
//   ) {
//     return null;
//   }

//   return (
//     <>
//       <motion.nav
//         initial={{ y: -100 }}
//         animate={{ y: 0 }}
//         transition={{ duration: 0.5, ease: "easeOut" }}
//         className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
//           scrolled || isMobileMenuOpen
//             ? "h-16 bg-white/90 dark:bg-[#050B14]/90 backdrop-blur-xl shadow-sm"
//             : "h-20 bg-transparent"
//         }`}
//       >
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
//           <div className="flex items-center justify-between h-full">
//             {/* Logo */}
//             <Link
//               href="/"
//               className="flex items-center gap-2 group relative z-50"
//             >
//               <motion.div
//                 whileHover={{ scale: 1.05 }}
//                 className="text-xl sm:text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500"
//               >
//                 VARSHINI
//               </motion.div>
//               <div className="h-4 w-[1px] bg-gray-300 dark:bg-gray-700 mx-1" />
//               <div className="flex flex-col justify-center">
//                 <span className="text-[10px] sm:text-xs font-bold text-gray-900 dark:text-white leading-none tracking-wide">
//                   HYUNDAI
//                 </span>
//                 <span className="text-[8px] uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
//                   Spares
//                 </span>
//               </div>
//             </Link>

//             {/* Desktop Navigation */}
//             <div className="hidden md:flex items-center gap-8">
//               <NavLink href="/products">Products</NavLink>
//               <NavLink href="/categories">Categories</NavLink>
//               {isAuthenticated && <NavLink href="/orders">Orders</NavLink>}
//             </div>

//             {/* Right actions */}
//             <div className="flex items-center gap-2 sm:gap-3">
//               {/* Theme Toggle */}
//               <motion.button
//                 whileTap={{ scale: 0.9 }}
//                 onClick={toggleTheme}
//                 className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 transition-colors hidden sm:flex"
//               >
//                 {theme === "dark" ? (
//                   <Sun size={18} className="text-yellow-400" />
//                 ) : (
//                   <Moon size={18} />
//                 )}
//               </motion.button>

//               {/* ✅ NEW: My Garage Icon (Desktop) */}
//               <motion.button
//                 whileTap={{ scale: 0.9 }}
//                 onClick={() => setIsGarageModalOpen(true)}
//                 className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 transition-colors relative hidden sm:flex"
//                 title="My Garage"
//               >
//                 <Car
//                   size={20}
//                   className={
//                     userGarage ? "text-cyan-600 dark:text-cyan-400" : ""
//                   }
//                 />
//                 {userGarage && (
//                   <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-cyan-500 rounded-full ring-2 ring-white dark:ring-[#050B14]"></span>
//                 )}
//               </motion.button>

//               {/* Wishlist */}
//               <Link href="/wishlist">
//                 <motion.button
//                   whileTap={{ scale: 0.9 }}
//                   className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 transition-colors"
//                 >
//                   <Heart size={20} />
//                 </motion.button>
//               </Link>

//               {/* Cart */}
//               <motion.button
//                 whileTap={{ scale: 0.9 }}
//                 onClick={toggleCartDrawer}
//                 className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 transition-colors"
//               >
//                 <ShoppingCart size={20} />
//                 {cartItemCount > 0 && (
//                   <motion.div
//                     initial={{ scale: 0 }}
//                     animate={{ scale: 1 }}
//                     className="absolute -top-0.5 -right-0.5 bg-blue-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm border-2 border-white dark:border-[#050B14]"
//                   >
//                     {cartItemCount}
//                   </motion.div>
//                 )}
//               </motion.button>

//               {/* User Menu (Desktop Dropdown) */}
//               {isAuthenticated ? (
//                 <div className="relative group hidden md:block ml-2">
//                   <div className="cursor-pointer py-2">
//                     <motion.div
//                       whileHover={{ scale: 1.05 }}
//                       className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 p-[2px]"
//                     >
//                       <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center">
//                         <span className="font-bold text-sm text-blue-600 dark:text-cyan-400">
//                           {user?.name?.[0]?.toUpperCase()}
//                         </span>
//                       </div>
//                     </motion.div>
//                   </div>

//                   {/* Dropdown Content */}
//                   <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-50 w-56">
//                     <div className="bg-white dark:bg-[#0F172A] rounded-xl shadow-xl border border-gray-100 dark:border-white/10 overflow-hidden">
//                       <div className="px-4 py-3 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5">
//                         <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
//                           {user?.name}
//                         </p>
//                         <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
//                           {user?.email}
//                         </p>
//                       </div>
//                       <div className="p-1">
//                         <DropdownLink
//                           href="/profile"
//                           icon={User}
//                           label="Profile"
//                         />
//                         <DropdownLink
//                           href="/orders"
//                           icon={Package}
//                           label="My Orders"
//                         />
//                         <div className="my-1 border-t border-gray-100 dark:border-white/5" />
//                         <button
//                           onClick={logout}
//                           className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
//                         >
//                           <LogOut size={14} /> Sign Out
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ) : (
//                 <Link href="/login" className="hidden md:block ml-2">
//                   <motion.button
//                     whileHover={{ scale: 1.02 }}
//                     whileTap={{ scale: 0.98 }}
//                     className="px-5 py-2 bg-blue-600 text-white rounded-full text-sm font-semibold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-colors"
//                   >
//                     Login
//                   </motion.button>
//                 </Link>
//               )}

//               {/* Mobile Menu Button */}
//               <motion.button
//                 whileTap={{ scale: 0.9 }}
//                 onClick={toggleMobileMenu}
//                 className="md:hidden p-2 ml-1 rounded-full bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white"
//               >
//                 {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
//               </motion.button>
//             </div>
//           </div>
//         </div>
//       </motion.nav>

//       {/* Mobile Menu Overlay (Beautiful Drawer) */}
//       <AnimatePresence>
//         {isMobileMenuOpen && (
//           <>
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               onClick={toggleMobileMenu}
//               className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
//             />
//             <motion.div
//               initial={{ x: "100%" }}
//               animate={{ x: 0 }}
//               exit={{ x: "100%" }}
//               transition={{ type: "spring", damping: 30, stiffness: 300 }}
//               className="fixed right-0 top-0 bottom-0 w-[85%] max-w-[320px] bg-white dark:bg-[#0F172A] shadow-2xl z-50 md:hidden flex flex-col"
//             >
//               {/* Drawer Header with Close Button */}
//               <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-white/5">
//                 <span className="font-bold text-lg text-gray-900 dark:text-white">
//                   Menu
//                 </span>
//                 <button
//                   onClick={toggleMobileMenu}
//                   className="p-2 rounded-full bg-gray-100 dark:bg-white/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-gray-600 dark:text-gray-300 hover:text-red-500 transition-colors"
//                 >
//                   <X size={20} />
//                 </button>
//               </div>

//               <div className="flex flex-col h-full overflow-y-auto px-5 py-6">
//                 {/* User Info Card */}
//                 {isAuthenticated ? (
//                   <div className="mb-8 p-5 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/20">
//                     <div className="flex items-center gap-4">
//                       <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white text-xl font-bold border border-white/30">
//                         {user?.name?.[0]?.toUpperCase()}
//                       </div>
//                       <div className="overflow-hidden">
//                         <p className="font-bold text-white text-lg truncate">
//                           {user?.name}
//                         </p>
//                         <p className="text-xs text-blue-100 truncate opacity-90">
//                           {user?.email}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="mb-8 text-center p-6 bg-gray-50 dark:bg-white/5 rounded-2xl border border-dashed border-gray-300 dark:border-white/10">
//                     <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
//                       Welcome!
//                     </h3>
//                     <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
//                       Login to view orders
//                     </p>
//                     <Link href="/login" onClick={toggleMobileMenu}>
//                       <button className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 active:scale-95 transition-transform text-sm">
//                         Login / Sign Up
//                       </button>
//                     </Link>
//                   </div>
//                 )}

//                 {/* Navigation Links */}
//                 <nav className="flex-1 space-y-2">
//                   <MobileLink
//                     href="/products"
//                     icon={Package}
//                     onClick={toggleMobileMenu}
//                   >
//                     All Products
//                   </MobileLink>

//                   {/* ✅ NEW: Mobile My Garage Link */}
//                   <button
//                     onClick={() => {
//                       toggleMobileMenu();
//                       setIsGarageModalOpen(true);
//                     }}
//                     className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-white/5 rounded-xl transition-all active:scale-95 group"
//                   >
//                     <div className="flex items-center gap-3">
//                       <div
//                         className={`p-2 rounded-lg bg-gray-100 dark:bg-white/5 group-hover:bg-blue-100 dark:group-hover:bg-blue-500/20 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors ${userGarage ? "text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/20" : ""}`}
//                       >
//                         <Car size={18} />
//                       </div>
//                       <span
//                         className={
//                           userGarage ? "text-cyan-700 dark:text-cyan-300" : ""
//                         }
//                       >
//                         My Garage {userGarage ? `(${userGarage.model})` : ""}
//                       </span>
//                     </div>
//                     <ChevronRight
//                       size={16}
//                       className="text-gray-300 dark:text-gray-600 group-hover:text-blue-500"
//                     />
//                   </button>

//                   <MobileLink
//                     href="/categories"
//                     icon={Search}
//                     onClick={toggleMobileMenu}
//                   >
//                     Categories
//                   </MobileLink>
//                   <MobileLink
//                     href="/wishlist"
//                     icon={Heart}
//                     onClick={toggleMobileMenu}
//                   >
//                     My Wishlist
//                   </MobileLink>

//                   {isAuthenticated && (
//                     <>
//                       <div className="my-4 border-t border-gray-100 dark:border-white/5" />
//                       <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-2">
//                         Account
//                       </p>
//                       <MobileLink
//                         href="/orders"
//                         icon={Package}
//                         onClick={toggleMobileMenu}
//                       >
//                         My Orders
//                       </MobileLink>
//                       <MobileLink
//                         href="/profile"
//                         icon={Settings}
//                         onClick={toggleMobileMenu}
//                       >
//                         Settings
//                       </MobileLink>
//                     </>
//                   )}
//                 </nav>

//                 {/* Footer Actions */}
//                 <div className="pt-6 mt-auto border-t border-gray-100 dark:border-white/5 space-y-3">
//                   {/* Theme Toggle Button Mobile */}
//                   <button
//                     onClick={toggleTheme}
//                     className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-white/5"
//                   >
//                     <span className="text-sm font-medium flex items-center gap-2">
//                       {theme === "dark" ? (
//                         <Moon size={16} />
//                       ) : (
//                         <Sun size={16} />
//                       )}
//                       Appearance
//                     </span>
//                     <span className="text-xs font-bold px-2 py-1 rounded bg-white dark:bg-black/20 text-gray-500 dark:text-gray-400">
//                       {theme === "dark" ? "Dark" : "Light"}
//                     </span>
//                   </button>

//                   {isAuthenticated && (
//                     <button
//                       onClick={() => {
//                         logout();
//                         toggleMobileMenu();
//                       }}
//                       className="w-full flex items-center justify-center gap-2 py-3.5 text-red-500 bg-red-50 dark:bg-red-500/10 font-bold rounded-xl transition-colors hover:bg-red-100 dark:hover:bg-red-500/20 active:scale-95"
//                     >
//                       <LogOut size={18} /> Sign Out
//                     </button>
//                   )}
//                 </div>
//               </div>
//             </motion.div>
//           </>
//         )}
//       </AnimatePresence>

//       {/* 🚙 GARAGE GLOBAL MODAL POPUP */}
//       <AnimatePresence>
//         {isGarageModalOpen && (
//           <>
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               onClick={() => setIsGarageModalOpen(false)}
//               className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
//             />
//             <motion.div
//               initial={{ opacity: 0, scale: 0.9, y: 20 }}
//               animate={{ opacity: 1, scale: 1, y: 0 }}
//               exit={{ opacity: 0, scale: 0.9, y: 20 }}
//               className="fixed inset-0 m-auto w-[90%] max-w-md h-fit p-6 bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/10 rounded-3xl shadow-2xl z-[101]"
//             >
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
//                   <Car className="text-cyan-600" />
//                   {userGarage ? "Your Garage" : "Add Your Car"}
//                 </h2>
//                 <button
//                   onClick={() => setIsGarageModalOpen(false)}
//                   className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full"
//                 >
//                   <X size={20} className="text-gray-500" />
//                 </button>
//               </div>

//               {userGarage ? (
//                 // View Mode
//                 <div className="text-center">
//                   <div className="bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-100 dark:border-cyan-800/30 rounded-2xl p-6 mb-6">
//                     <Car
//                       size={48}
//                       className="mx-auto text-cyan-600 dark:text-cyan-400 mb-3"
//                     />
//                     <h3 className="text-xl font-black text-gray-900 dark:text-white">
//                       Hyundai {userGarage.model}
//                     </h3>
//                     <p className="text-gray-500 dark:text-gray-400">
//                       {userGarage.year}
//                     </p>
//                   </div>
//                   <button
//                     onClick={removeGarage}
//                     className="w-full py-3 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 font-bold rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
//                   >
//                     Change Vehicle
//                   </button>
//                 </div>
//               ) : (
//                 // Edit Mode
//                 <div className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                       Car Model
//                     </label>
//                     <input
//                       type="text"
//                       placeholder="e.g. Creta, Swift, City"
//                       value={garageForm.model}
//                       onChange={(e) =>
//                         setGarageForm({ ...garageForm, model: e.target.value })
//                       }
//                       className="w-full p-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-cyan-500 transition-colors text-gray-900 dark:text-white"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                       Year
//                     </label>
//                     <input
//                       type="number"
//                       placeholder="e.g. 2020"
//                       value={garageForm.year}
//                       onChange={(e) =>
//                         setGarageForm({ ...garageForm, year: e.target.value })
//                       }
//                       className="w-full p-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-cyan-500 transition-colors text-gray-900 dark:text-white"
//                     />
//                   </div>
//                   <button
//                     onClick={saveGarage}
//                     className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/20 transition-all mt-2"
//                   >
//                     Save Vehicle
//                   </button>
//                 </div>
//               )}
//             </motion.div>
//           </>
//         )}
//       </AnimatePresence>
//     </>
//   );
// };

// // 🛠️ Helper Components

// function NavLink({
//   href,
//   children,
// }: {
//   href: string;
//   children: React.ReactNode;
// }) {
//   return (
//     <Link
//       href={href}
//       className="relative font-medium text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white transition-colors group"
//     >
//       {children}
//       <span className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full group-hover:left-0" />
//     </Link>
//   );
// }

// function DropdownLink({
//   href,
//   icon: Icon,
//   label,
// }: {
//   href: string;
//   icon: any;
//   label: string;
// }) {
//   return (
//     <Link
//       href={href}
//       className="flex items-center gap-3 px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-white/10 rounded-lg transition-colors group"
//     >
//       <Icon
//         size={14}
//         className="text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
//       />
//       {label}
//     </Link>
//   );
// }

// function MobileLink({
//   href,
//   onClick,
//   icon: Icon,
//   children,
// }: {
//   href: string;
//   onClick: () => void;
//   icon: any;
//   children: React.ReactNode;
// }) {
//   return (
//     <Link
//       href={href}
//       onClick={onClick}
//       className="flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-white/5 rounded-xl transition-all active:scale-95 group"
//     >
//       <div className="flex items-center gap-3">
//         <div className="p-2 rounded-lg bg-gray-100 dark:bg-white/5 group-hover:bg-blue-100 dark:group-hover:bg-blue-500/20 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
//           <Icon size={18} />
//         </div>
//         {children}
//       </div>
//       <ChevronRight
//         size={16}
//         className="text-gray-300 dark:text-gray-600 group-hover:text-blue-500"
//       />
//     </Link>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/store/useStore";
import { useAuth } from "@/hooks/useAuth";
import { usePathname } from "next/navigation";
import { GarageModal } from "./GarageModal"; // ✅ Import Modal here
import {
  ShoppingCart,
  Menu,
  X,
  Sun,
  Moon,
  LogOut,
  Package,
  Settings,
  Heart,
  Search,
  User,
  ChevronRight,
  Car,
} from "lucide-react";

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const {
    theme,
    toggleTheme,
    cartItemCount,
    toggleCartDrawer,
    isMobileMenuOpen,
    toggleMobileMenu,
    selectedVehicle, // ✅ Store నుండి కారు డేటా తీసుకుంటున్నాం
  } = useStore();

  const { user, isAuthenticated, logout } = useAuth();

  // Modal State only (Logic is moved to Store & Component)
  const [isGarageModalOpen, setIsGarageModalOpen] = useState(false);

  // Scroll Effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const pathname = usePathname();
  if (
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/forgot-password" ||
    pathname?.startsWith("/admin") ||
    pathname === "/chat" ||
    pathname === "/checkout"
  ) {
    return null;
  }

  const isAdmin = user?.role === "admin";

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled || isMobileMenuOpen
            ? "h-16 bg-white/90 dark:bg-[#050B14]/90 backdrop-blur-xl shadow-sm"
            : "h-20 bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 group relative z-50"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-xl sm:text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500"
              >
                VARSHINI
              </motion.div>
              <div className="h-4 w-[1px] bg-gray-300 dark:bg-gray-700 mx-1" />
              <div className="flex flex-col justify-center">
                <span className="text-[10px] sm:text-xs font-bold text-gray-900 dark:text-white leading-none tracking-wide">
                  HYUNDAI
                </span>
                <span className="text-[8px] uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
                  Spares
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <NavLink href="/products">Products</NavLink>
              <NavLink href="/categories">Categories</NavLink>
              {isAuthenticated && !isAdmin && (
                <NavLink href="/orders">Orders</NavLink>
              )}
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Theme Toggle */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 transition-colors hidden sm:flex"
              >
                {theme === "dark" ? (
                  <Sun size={18} className="text-yellow-400" />
                ) : (
                  <Moon size={18} />
                )}
              </motion.button>

              {!isAdmin && (
                <>
                  {/* My Garage Button (Desktop) */}
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsGarageModalOpen(true)}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 transition-colors relative hidden sm:flex items-center gap-2"
                    title="My Garage"
                  >
                    <Car
                      size={20}
                      className={
                        selectedVehicle
                          ? "text-cyan-600 dark:text-cyan-400"
                          : ""
                      }
                    />
                    {/* కారు సెలెక్ట్ చేస్తే గ్రీన్ డాట్ బదులు టెక్స్ట్ చూపిస్తున్నాం */}
                    {selectedVehicle && (
                      <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 hidden lg:block">
                        {selectedVehicle.model}
                      </span>
                    )}
                    {!selectedVehicle && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                    )}
                  </motion.button>

                  {/* Wishlist */}
                  <Link href="/wishlist">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 transition-colors"
                    >
                      <Heart size={20} />
                    </motion.button>
                  </Link>

                  {/* Cart */}
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleCartDrawer}
                    className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 transition-colors"
                  >
                    <ShoppingCart size={20} />
                    {cartItemCount > 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-0.5 -right-0.5 bg-blue-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm border-2 border-white dark:border-[#050B14]"
                      >
                        {cartItemCount}
                      </motion.div>
                    )}
                  </motion.button>
                </>
              )}

              {/* User Menu */}
              {isAuthenticated ? (
                <div className="relative group hidden md:block ml-2">
                  <div className="cursor-pointer py-2">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 p-[2px]"
                    >
                      <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center">
                        <span className="font-bold text-sm text-blue-600 dark:text-cyan-400">
                          {user?.name?.[0]?.toUpperCase()}
                        </span>
                      </div>
                    </motion.div>
                  </div>

                  {/* Dropdown Content */}
                  <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-50 w-56">
                    <div className="bg-white dark:bg-[#0F172A] rounded-xl shadow-xl border border-gray-100 dark:border-white/10 overflow-hidden">
                      <div className="px-4 py-3 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5">
                        <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                          {user?.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {user?.email}
                        </p>
                      </div>
                      <div className="p-1">
                        <DropdownLink
                          href="/profile"
                          icon={User}
                          label="Profile"
                        />
                        {!isAdmin && (
                          <DropdownLink
                            href="/orders"
                            icon={Package}
                            label="My Orders"
                          />
                        )}
                        <div className="my-1 border-t border-gray-100 dark:border-white/5" />
                        <button
                          onClick={logout}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          <LogOut size={14} /> Sign Out
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <Link href="/login" className="hidden md:block ml-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-5 py-2 bg-blue-600 text-white rounded-full text-sm font-semibold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-colors"
                  >
                    Login
                  </motion.button>
                </Link>
              )}

              {/* Mobile Menu Button */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={toggleMobileMenu}
                className="md:hidden p-2 ml-1 rounded-full bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white"
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleMobileMenu}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-[85%] max-w-[320px] bg-white dark:bg-[#0F172A] shadow-2xl z-50 md:hidden flex flex-col"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-white/5">
                <span className="font-bold text-lg text-gray-900 dark:text-white">
                  Menu
                </span>
                <button
                  onClick={toggleMobileMenu}
                  className="p-2 rounded-full bg-gray-100 dark:bg-white/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-gray-600 dark:text-gray-300 hover:text-red-500 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex flex-col h-full overflow-y-auto px-5 py-6">
                {isAuthenticated ? (
                  <div className="mb-8 p-5 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/20">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white text-xl font-bold border border-white/30">
                        {user?.name?.[0]?.toUpperCase()}
                      </div>
                      <div className="overflow-hidden">
                        <p className="font-bold text-white text-lg truncate">
                          {user?.name}
                        </p>
                        <p className="text-xs text-blue-100 truncate opacity-90">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mb-8 text-center p-6 bg-gray-50 dark:bg-white/5 rounded-2xl border border-dashed border-gray-300 dark:border-white/10">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                      Welcome!
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                      Login to view orders
                    </p>
                    <Link href="/login" onClick={toggleMobileMenu}>
                      <button className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 active:scale-95 transition-transform text-sm">
                        Login / Sign Up
                      </button>
                    </Link>
                  </div>
                )}

                {/* Navigation Links */}
                <nav className="flex-1 space-y-2">
                  <MobileLink
                    href="/products"
                    icon={Package}
                    onClick={toggleMobileMenu}
                  >
                    All Products
                  </MobileLink>

                  {!isAdmin && (
                    <>
                      {/* Mobile Garage Button */}
                      <button
                        onClick={() => {
                          toggleMobileMenu();
                          setIsGarageModalOpen(true);
                        }}
                        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-white/5 rounded-xl transition-all active:scale-95 group"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-lg bg-gray-100 dark:bg-white/5 group-hover:bg-blue-100 dark:group-hover:bg-blue-500/20 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors ${
                              selectedVehicle
                                ? "text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/20"
                                : ""
                            }`}
                          >
                            <Car size={18} />
                          </div>
                          <span
                            className={
                              selectedVehicle
                                ? "text-cyan-700 dark:text-cyan-300"
                                : ""
                            }
                          >
                            My Garage{" "}
                            {selectedVehicle
                              ? `(${selectedVehicle.model})`
                              : ""}
                          </span>
                        </div>
                        <ChevronRight
                          size={16}
                          className="text-gray-300 dark:text-gray-600 group-hover:text-blue-500"
                        />
                      </button>

                      <MobileLink
                        href="/wishlist"
                        icon={Heart}
                        onClick={toggleMobileMenu}
                      >
                        My Wishlist
                      </MobileLink>
                    </>
                  )}

                  <MobileLink
                    href="/categories"
                    icon={Search}
                    onClick={toggleMobileMenu}
                  >
                    Categories
                  </MobileLink>

                  {isAuthenticated && (
                    <>
                      <div className="my-4 border-t border-gray-100 dark:border-white/5" />
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-2">
                        Account
                      </p>
                      {!isAdmin && (
                        <MobileLink
                          href="/orders"
                          icon={Package}
                          onClick={toggleMobileMenu}
                        >
                          My Orders
                        </MobileLink>
                      )}
                      <MobileLink
                        href="/profile"
                        icon={Settings}
                        onClick={toggleMobileMenu}
                      >
                        Settings
                      </MobileLink>
                    </>
                  )}
                </nav>

                {/* Footer Actions */}
                <div className="pt-6 mt-auto border-t border-gray-100 dark:border-white/5 space-y-3">
                  <button
                    onClick={toggleTheme}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-white/5"
                  >
                    <span className="text-sm font-medium flex items-center gap-2">
                      {theme === "dark" ? (
                        <Moon size={16} />
                      ) : (
                        <Sun size={16} />
                      )}
                      Appearance
                    </span>
                    <span className="text-xs font-bold px-2 py-1 rounded bg-white dark:bg-black/20 text-gray-500 dark:text-gray-400">
                      {theme === "dark" ? "Dark" : "Light"}
                    </span>
                  </button>

                  {isAuthenticated && (
                    <button
                      onClick={() => {
                        logout();
                        toggleMobileMenu();
                      }}
                      className="w-full flex items-center justify-center gap-2 py-3.5 text-red-500 bg-red-50 dark:bg-red-500/10 font-bold rounded-xl transition-colors hover:bg-red-100 dark:hover:bg-red-500/20 active:scale-95"
                    >
                      <LogOut size={18} /> Sign Out
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ✅ NEW: Garage Modal Component (Clean Integration) */}
      <GarageModal
        isOpen={isGarageModalOpen}
        onClose={() => setIsGarageModalOpen(false)}
      />
    </>
  );
};

// 🛠️ Helper Components (No Changes Needed Here)

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="relative font-medium text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white transition-colors group"
    >
      {children}
      <span className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full group-hover:left-0" />
    </Link>
  );
}

function DropdownLink({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: any;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-white/10 rounded-lg transition-colors group"
    >
      <Icon
        size={14}
        className="text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
      />
      {label}
    </Link>
  );
}

function MobileLink({
  href,
  onClick,
  icon: Icon,
  children,
}: {
  href: string;
  onClick: () => void;
  icon: any;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-white/5 rounded-xl transition-all active:scale-95 group"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-gray-100 dark:bg-white/5 group-hover:bg-blue-100 dark:group-hover:bg-blue-500/20 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          <Icon size={18} />
        </div>
        {children}
      </div>
      <ChevronRight
        size={16}
        className="text-gray-300 dark:text-gray-600 group-hover:text-blue-500"
      />
    </Link>
  );
}
