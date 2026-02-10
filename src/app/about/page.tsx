// src/app/about/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Shield,
  Truck,
  Users,
  Award,
  Target,
  Heart,
  ArrowRight,
} from "lucide-react";

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050B14] text-gray-900 dark:text-white transition-colors duration-300">
      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-200/50 dark:bg-grid-white/5 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold tracking-widest uppercase mb-4">
              Driving Excellence
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
              We Are{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-hyundai-blue to-blue-500">
                Varshini Spares
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              Your trusted partner for genuine Hyundai spare parts. We bridge
              the gap between quality and accessibility, ensuring your vehicle
              runs exactly as it should.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 2. STATS SECTION */}
      <section className="py-10 border-y border-gray-200 dark:border-white/5 bg-white dark:bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <StatCard number="10K+" label="Happy Customers" />
            <StatCard number="5000+" label="Genuine Parts" />
            <StatCard number="100%" label="Original Quality" />
            <StatCard number="24/7" label="Expert Support" />
          </div>
        </div>
      </section>

      {/* 3. MISSION & VISION */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
          >
            {/* Image Side */}
            <motion.div
              variants={itemVariants}
              className="relative aspect-video md:aspect-square rounded-3xl overflow-hidden shadow-2xl"
            >
              <Image
                src="https://images.unsplash.com/photo-1487754180451-c456f719a1fc?q=80&w=1000&auto=format&fit=crop"
                alt="Car Warehouse"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                <p className="font-bold text-xl">Est. 2024</p>
                <p className="text-sm opacity-80">Serving Hyderabad & Beyond</p>
              </div>
            </motion.div>

            {/* Content Side */}
            <div className="space-y-8">
              <motion.div variants={itemVariants}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-500/10 rounded-xl text-blue-600 dark:text-blue-400">
                    <Target size={24} />
                  </div>
                  <h2 className="text-3xl font-bold">Our Mission</h2>
                </div>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  To revolutionize the auto spares industry by providing a
                  transparent, reliable, and efficient platform where every car
                  owner can find the exact genuine part they need, without the
                  fear of counterfeits.
                </p>
              </motion.div>

              <motion.div variants={itemVariants}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-red-100 dark:bg-red-500/10 rounded-xl text-red-600 dark:text-red-400">
                    <Heart size={24} />
                  </div>
                  <h2 className="text-3xl font-bold">Our Values</h2>
                </div>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  We believe in integrity, speed, and customer obsession. Your
                  safety on the road is our priority, which is why we never
                  compromise on the authenticity of our inventory.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4. WHY CHOOSE US */}
      <section className="py-20 bg-gray-100 dark:bg-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-4">
              Why Choose Varshini Spares?
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              We are not just a store; we are car enthusiasts committed to
              keeping your vehicle in top condition.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Shield size={32} />}
              title="100% Genuine"
              desc="Directly sourced from authorized manufacturers. Every part comes with a warranty."
              color="blue"
            />
            <FeatureCard
              icon={<Truck size={32} />}
              title="Fast Delivery"
              desc="Lightning fast shipping across Hyderabad. Safe packaging guaranteed."
              color="green"
            />
            <FeatureCard
              icon={<Award size={32} />}
              title="Best Prices"
              desc="Competitive pricing without hidden costs. Value for your money."
              color="purple"
            />
          </div>
        </div>
      </section>

      {/* 5. CTA SECTION */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-hyundai-blue to-blue-700 p-10 md:p-16 text-center text-white shadow-2xl">
            {/* Background Pattern */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <svg
                width="100%"
                height="100%"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <pattern
                    id="grid"
                    width="40"
                    height="40"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M 40 0 L 0 0 0 40"
                      fill="none"
                      stroke="white"
                      strokeWidth="1"
                    />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative z-10"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to upgrade your ride?
              </h2>
              <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
                Explore our catalog of thousands of spare parts and get them
                delivered to your doorstep today.
              </p>
              <Link href="/">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-blue-700 px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2 mx-auto"
                >
                  Shop Now <ArrowRight size={20} />
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ------------------- SUB COMPONENTS -------------------

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="space-y-2"
    >
      <div className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-cyan-500">
        {number}
      </div>
      <div className="text-sm md:text-base text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">
        {label}
      </div>
    </motion.div>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
  color,
}: {
  icon: any;
  title: string;
  desc: string;
  color: string;
}) {
  const colors: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
    green:
      "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400",
    purple:
      "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-[#0F172A] p-8 rounded-2xl border border-gray-100 dark:border-white/5 shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <div
        className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${colors[color]}`}
      >
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
        {desc}
      </p>
    </motion.div>
  );
}
