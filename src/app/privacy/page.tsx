// src/app/privacy/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Server, Cookie, Mail, ArrowRight, FileText } from 'lucide-react';

// Sections Data
const sections = [
  {
    id: 'collection',
    title: 'Information We Collect',
    icon: <Eye size={24} />,
    content: 'We collect personal information that you voluntarily provide to us when you register on the website, express an interest in obtaining information about us or our products and services, when you participate in activities on the website or otherwise when you contact us. The personal information that we collect depends on the context of your interactions with us and the website, the choices you make and the products and features you use.',
    list: ['Name and Contact Data', 'Credentials', 'Payment Data', 'Social Media Login Data']
  },
  {
    id: 'use',
    title: 'How We Use Your Info',
    icon: <Server size={24} />,
    content: 'We use personal information collected via our website for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.',
    list: ['To facilitate account creation and logon process', 'To send you marketing and promotional communications', 'To fulfill and manage your orders', 'To post testimonials']
  },
  {
    id: 'security',
    title: 'Data Security',
    icon: <Lock size={24} />,
    content: 'We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure, so we cannot promise or guarantee that hackers, cybercriminals, or other unauthorized third parties will not be able to defeat our security.',
    list: []
  },
  {
    id: 'cookies',
    title: 'Cookie Policy',
    icon: <Cookie size={24} />,
    content: 'We may use cookies and similar tracking technologies (like web beacons and pixels) to access or store information. Specific information about how we use such technologies and how you can refuse certain cookies is set out in our Cookie Notice.',
    list: ['Essential Cookies', 'Analytics Cookies', 'Marketing Cookies']
  },
];

export default function PrivacyPolicyPage() {
  const [activeSection, setActiveSection] = useState('collection');

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
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-900/10 dark:to-transparent -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold tracking-widest uppercase mb-4">
              <Shield size={14} /> Legal Center
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
              Privacy <span className="text-transparent bg-clip-text bg-gradient-to-r from-hyundai-blue to-blue-500">Policy</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
              Your privacy matters to us. We are transparent about how we collect, use, and share your data at Varshini Spares.
            </p>
            <p className="mt-4 text-sm text-gray-400">Last updated: January 08, 2026</p>
          </motion.div>
        </div>
      </section>

      {/* 2. Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Left: Table of Contents (Sticky) */}
          <div className="lg:w-1/4 hidden lg:block">
            <div className="sticky top-32 space-y-2 p-4 bg-white dark:bg-white/5 backdrop-blur-md rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 px-3">On this page</h3>
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-3 ${
                    activeSection === section.id
                      ? 'bg-blue-50 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'
                  }`}
                >
                  {section.icon}
                  {section.title}
                </button>
              ))}
            </div>
          </div>

          {/* Right: Content */}
          <div className="lg:w-3/4 space-y-12">
            {sections.map((section, index) => (
              <motion.div
                id={section.id}
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onViewportEnter={() => setActiveSection(section.id)}
                className="bg-white dark:bg-white/5 p-8 md:p-10 rounded-3xl border border-gray-100 dark:border-white/5 shadow-lg dark:shadow-none hover:border-blue-200 dark:hover:border-blue-500/30 transition-colors"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-500/20 dark:to-indigo-500/20 text-blue-600 dark:text-blue-400">
                    {section.icon}
                  </div>
                  <h2 className="text-2xl font-bold">{section.title}</h2>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg mb-6">
                  {section.content}
                </p>

                {section.list.length > 0 && (
                  <ul className="space-y-3">
                    {section.list.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            ))}

            {/* Contact Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-hyundai-blue to-blue-700 rounded-3xl p-8 md:p-12 text-center text-white shadow-2xl"
            >
              <Mail size={40} className="mx-auto mb-4 opacity-80" />
              <h2 className="text-2xl font-bold mb-4">Have questions about your data?</h2>
              <p className="text-blue-100 mb-8 max-w-lg mx-auto">
                Our team is here to help you understand how your information is handled. Reach out to our Data Protection Officer.
              </p>
              <Link href="/contact">
                <button className="bg-white text-blue-700 px-8 py-3 rounded-xl font-bold hover:shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center gap-2 mx-auto">
                  Contact Support <ArrowRight size={18} />
                </button>
              </Link>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
}