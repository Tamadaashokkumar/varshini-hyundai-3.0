"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Phone, X } from "lucide-react";

export default function PhoneWarningModal() {
  const { user, loading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    console.log(user);
    // యూజర్ లాగిన్ అయ్యి ఉండి, ఫోన్ నెంబర్ డమ్మీగా ఉంటేనే పాప్-అప్ ఓపెన్ అవ్వాలి
    if (!loading && user && user.phone === "0000000000") {
      setIsOpen(true);
    }
  }, [user, loading]);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          {/* 1. Backdrop (వెనుక నల్లగా/మసకగా చేసే లేయర్) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose} // బయట క్లిక్ చేస్తే క్లోజ్ అవ్వాలంటే ఇది ఉంచండి
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* 2. The Popup Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-gray-900 border border-amber-500/30 shadow-2xl shadow-black/50"
          >
            {/* Header / Gradient Top */}
            <div className="h-2 w-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500" />

            <div className="p-8">
              {/* Close Button (Top Right) */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 text-gray-500 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              <div className="flex flex-col items-center text-center">
                {/* Icon Circle */}
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-amber-500/10 ring-1 ring-amber-500/50">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-500 text-black shadow-lg shadow-amber-500/40">
                    <AlertTriangle size={32} strokeWidth={2.5} />
                  </div>
                </div>

                {/* Text Content */}
                <h2 className="text-2xl font-bold text-white mb-3">
                  Missing Phone Number
                </h2>
                <p className="text-gray-400 leading-relaxed mb-8">
                  Hey{" "}
                  <span className="text-white font-semibold">{user?.name}</span>
                  , we noticed your phone number is missing. Our delivery
                  partners need it to contact you.
                  <br />
                  <span className="text-amber-500 font-medium">
                    Please update it to place orders.
                  </span>
                </p>

                {/* Actions */}
                <div className="flex w-full flex-col gap-3 sm:flex-row">
                  <button
                    onClick={handleClose}
                    className="w-full rounded-xl border border-gray-700 bg-transparent py-3.5 font-semibold text-gray-300 transition-colors hover:bg-gray-800 hover:text-white sm:w-1/2"
                  >
                    Skip for Now
                  </button>

                  <Link href="/profile" className="w-full sm:w-1/2">
                    <button className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-500 py-3.5 font-bold text-black shadow-lg shadow-amber-500/20 transition-all hover:bg-amber-400 hover:scale-[1.02]">
                      <Phone size={18} className="fill-current" />
                      Update Now
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
