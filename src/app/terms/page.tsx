// src/app/terms/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FileText, Users, ShoppingBag, ShieldCheck, AlertCircle, Scale, ArrowRight, CheckCircle } from 'lucide-react';

// Terms Sections Data
const termsSections = [
  {
    id: 'acceptance',
    title: 'Acceptance of Terms',
    icon: <CheckCircle size={24} />,
    content: 'By accessing and using this website (Varshini Spares), you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.',
  },
  {
    id: 'accounts',
    title: 'User Accounts',
    icon: <Users size={24} />,
    content: 'To access certain features of the platform, you may be required to create an account. You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer, and you agree to accept responsibility for all activities that occur under your account or password.',
  },
  {
    id: 'products',
    title: 'Products & Pricing',
    icon: <ShoppingBag size={24} />,
    content: 'We attempt to be as accurate as possible. However, we do not warrant that product descriptions or other content of this site is accurate, complete, reliable, current, or error-free. Prices and availability of items are subject to change without notice.',
  },
  {
    id: 'intellectual',
    title: 'Intellectual Property',
    icon: <ShieldCheck size={24} />,
    content: 'The Site and its original content, features, and functionality are owned by Varshini Spares and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.',
  },
  {
    id: 'liability',
    title: 'Limitation of Liability',
    icon: <AlertCircle size={24} />,
    content: 'In no event shall Varshini Spares, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.',
  },
  {
    id: 'governing',
    title: 'Governing Law',
    icon: <Scale size={24} />,
    content: 'These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.',
  },
];

export default function TermsPage() {
  const [activeSection, setActiveSection] = useState('acceptance');

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050B14] text-gray-900 dark:text-white transition-colors duration-300">
      
      {/* 1. Header Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full bg-grid-slate-200/50 dark:bg-grid-white/5 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))] -z-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 blur-[100px] rounded-full -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold tracking-widest uppercase mb-4">
              <FileText size={14} /> Agreements
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
              Terms & <span className="text-transparent bg-clip-text bg-gradient-to-r from-hyundai-blue to-blue-500">Conditions</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
              Please read these terms carefully before using our service. By using Varshini Spares, you agree to these rules.
            </p>
            <p className="mt-4 text-sm text-gray-400">Last updated: January 08, 2026</p>
          </motion.div>
        </div>
      </section>

      {/* 2. Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Left: Sticky Navigation */}
          <div className="lg:w-1/4 hidden lg:block">
            <div className="sticky top-32 space-y-2 p-4 bg-white dark:bg-white/5 backdrop-blur-md rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 px-3">Table of Contents</h3>
              {termsSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-3 ${
                    activeSection === section.id
                      ? 'bg-blue-50 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 shadow-sm border-l-4 border-blue-500'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 border-l-4 border-transparent'
                  }`}
                >
                  {section.title}
                </button>
              ))}
            </div>
          </div>

          {/* Right: Content Sections */}
          <div className="lg:w-3/4 space-y-8">
            {termsSections.map((section, index) => (
              <motion.div
                id={section.id}
                key={section.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onViewportEnter={() => setActiveSection(section.id)}
                className="group bg-white dark:bg-white/5 p-8 md:p-10 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-xl dark:shadow-none hover:border-blue-200 dark:hover:border-blue-500/30 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300 mt-1">
                    {section.icon}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {section.title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                      {section.content}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Bottom CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-12 p-8 rounded-3xl bg-gray-100 dark:bg-white/5 border border-dashed border-gray-300 dark:border-white/20 text-center"
            >
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                If you have any questions regarding our Terms and Conditions, please contact us.
              </p>
              <Link href="/contact">
                <button className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-black rounded-xl font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">
                  Contact Us <ArrowRight size={18} />
                </button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}