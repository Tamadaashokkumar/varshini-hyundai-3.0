"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Home,
  Package,
  ShoppingCart,
  Heart,
  Shield,
  Truck,
  ChevronDown,
  ArrowRight,
  Sparkles,
  Clock,
} from "lucide-react";
import SupportActionCards from "@/components/SupportActionCards";
export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();

  // --- Data Arrays ---
  const quickLinks = [
    { name: "Home", href: "/", icon: Home },
    { name: "All Products", href: "/products", icon: Package },
    { name: "My Cart", href: "/cart", icon: ShoppingCart },
    { name: "Track Order", href: "/orders", icon: Package },
  ];

  const categories = [
    { name: "Engine Components", href: "/categories/Engine" },
    { name: "Brake Systems", href: "/categories/Brake" },
    { name: "Electrical & Lights", href: "/categories/Electrical" },
    { name: "Body & Suspension", href: "/categories/Body" },
  ];

  const policies = [
    { name: "About Company", href: "/about" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Return & Refund", href: "/returns" },
  ];

  const socialLinks = [
    {
      name: "Facebook",
      icon: Facebook,
      href: "#",
      color: "hover:bg-[#1877F2] hover:text-white dark:hover:text-white",
    },
    {
      name: "Twitter",
      icon: Twitter,
      href: "#",
      color: "hover:bg-[#1DA1F2] hover:text-white dark:hover:text-white",
    },
    {
      name: "Instagram",
      icon: Instagram,
      href: "#",
      color:
        "hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white dark:hover:text-white",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      href: "#",
      color: "hover:bg-[#0A66C2] hover:text-white dark:hover:text-white",
    },
    {
      name: "YouTube",
      icon: Youtube,
      href: "#",
      color: "hover:bg-[#FF0000] hover:text-white dark:hover:text-white",
    },
  ];

  const features = [
    {
      icon: Shield,
      title: "100% Genuine",
      description: "Authentic parts guaranteed",
      bg: "bg-blue-50 dark:bg-blue-500/10",
      text: "text-blue-600 dark:text-blue-400",
    },
    {
      icon: Truck,
      title: "Express Shipping",
      description: "Fast delivery across India",
      bg: "bg-green-50 dark:bg-green-500/10",
      text: "text-green-600 dark:text-green-400",
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Expert assistance anytime",
      bg: "bg-purple-50 dark:bg-purple-500/10",
      text: "text-purple-600 dark:text-purple-400",
    },
  ];

  // Hide footer on specific pages
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

  return (
    <>
      <SupportActionCards />
      <footer className="relative mt-auto pt-16 pb-8 overflow-hidden bg-gray-50 dark:bg-[#030712] transition-colors duration-500">
        {/* 🌌 Background Ambience */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-300 dark:via-white/10 to-transparent"></div>
          <div className="absolute -top-[400px] left-1/4 w-[800px] h-[800px] bg-blue-500/5 dark:bg-blue-600/5 rounded-full blur-[120px]"></div>
          <div className="absolute -bottom-[400px] right-1/4 w-[800px] h-[800px] bg-indigo-500/5 dark:bg-indigo-600/5 rounded-full blur-[120px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          {/* 1. Features Grid (Floating Cards) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4 p-5 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md transition-all duration-300 group"
              >
                <div
                  className={`p-3.5 rounded-xl ${feature.bg} ${feature.text} group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon size={24} strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-base">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* 2. Main Footer Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 pb-12 border-b border-gray-200 dark:border-white/5">
            {/* Brand Column (Left) */}
            <div className="lg:col-span-4 space-y-6">
              <Link href="/" className="inline-block group">
                <div className="flex flex-col">
                  <h2 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white flex items-center gap-1">
                    VARSHINI
                    <span className="w-2 h-2 rounded-full bg-blue-600 mt-3 animate-pulse"></span>
                  </h2>
                  <span className="text-xs font-bold tracking-[0.3em] text-blue-600 dark:text-blue-400 uppercase pl-1">
                    Hyundai Spares
                  </span>
                </div>
              </Link>

              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm max-w-sm">
                Your premium destination for authentic Hyundai parts. We ensure
                your vehicle runs perfectly with components that match factory
                specifications.
              </p>

              <div className="space-y-4 pt-2">
                <ContactItem
                  icon={MapPin}
                  text="123 Auto Nagar, Hyderabad, India"
                />
                <ContactItem
                  icon={Phone}
                  text="+91 8096936290"
                  href="tel:+918096936290"
                />
                <ContactItem
                  icon={Mail}
                  text="support@varshinispares.com"
                  href="mailto:support@varshinispares.com"
                />
              </div>
            </div>

            {/* Links Columns (Right) */}
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4">
              <FooterSection title="Explore">
                <ul className="space-y-3">
                  {quickLinks.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="group flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300"
                      >
                        <ArrowRight
                          size={14}
                          className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 text-blue-500"
                        />
                        <span className="group-hover:translate-x-1 transition-transform duration-300">
                          {link.name}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </FooterSection>

              <FooterSection title="Categories">
                <ul className="space-y-3">
                  {categories.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="group flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-white/20 group-hover:bg-blue-500 transition-colors"></span>
                        <span className="group-hover:translate-x-1 transition-transform duration-300">
                          {item.name}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </FooterSection>

              <FooterSection title="Company">
                <ul className="space-y-3">
                  {policies.map((policy) => (
                    <li key={policy.name}>
                      <Link
                        href={policy.href}
                        className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-white transition-colors hover:underline decoration-blue-500/30 underline-offset-4"
                      >
                        {policy.name}
                      </Link>
                    </li>
                  ))}
                </ul>

                {/* Socials */}
                <div className="mt-8">
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4 opacity-80">
                    Follow Us
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {socialLinks.map((social) => (
                      <motion.a
                        key={social.name}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ y: -3 }}
                        whileTap={{ scale: 0.95 }}
                        className={`p-2 rounded-lg bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 transition-all duration-300 ${social.color}`}
                      >
                        <social.icon size={18} />
                      </motion.a>
                    ))}
                  </div>
                </div>
              </FooterSection>
            </div>
          </div>

          {/* 3. Bottom Bar */}
          <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-500 dark:text-gray-500 font-medium text-center md:text-left">
              © {currentYear} Varshini Hyundai Spares.{" "}
              <span className="hidden sm:inline">|</span> All rights reserved.
            </p>

            <div className="flex items-center gap-1 text-xs text-gray-400">
              <span>Made with</span>
              <Heart
                size={10}
                className="text-red-500 fill-red-500 animate-pulse"
              />
              <span>for your car</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

// ----------------------------------------------------------------------
// 🛠️ Helper Components
// ----------------------------------------------------------------------

// 1. Mobile Responsive Accordion
const FooterSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 dark:border-white/5 md:border-none last:border-none">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-4 md:py-0 md:mb-6 group"
      >
        <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest">
          {title}
        </h3>
        {/* Chevron for mobile */}
        <div
          className={`md:hidden p-1 rounded-full transition-colors duration-300 ${isOpen ? "bg-blue-50 dark:bg-white/10 text-blue-600 dark:text-white" : "text-gray-400"}`}
        >
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out md:h-auto md:opacity-100 ${
          isOpen
            ? "max-h-64 opacity-100 mb-6"
            : "max-h-0 opacity-0 md:max-h-none md:mb-0"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

// 2. Contact Item
const ContactItem = ({
  icon: Icon,
  text,
  href,
}: {
  icon: any;
  text: string;
  href?: string;
}) => (
  <div className="flex items-start gap-4 group">
    <div className="mt-1 p-2 rounded-lg bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
      <Icon size={14} />
    </div>
    <div className="flex-1">
      {href ? (
        <a
          href={href}
          className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white transition-colors block leading-relaxed"
        >
          {text}
        </a>
      ) : (
        <span className="text-sm font-medium text-gray-600 dark:text-gray-300 block leading-relaxed">
          {text}
        </span>
      )}
    </div>
  </div>
);
