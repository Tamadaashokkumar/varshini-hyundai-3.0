// src/app/contact/page.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageSquare,
  ArrowRight,
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API Call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast.success("Message sent successfully! We will get back to you soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050B14] text-gray-900 dark:text-white transition-colors duration-300">
      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-12 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-grid-slate-200/50 dark:bg-grid-white/5 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))] -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold tracking-widest uppercase mb-4">
              24/7 Support
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
              Get in{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-hyundai-blue to-blue-500">
                Touch
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
              Have a question about a spare part? Need help with an order? Our
              team is here to assist you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 2. MAIN CONTENT (Grid Layout) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* LEFT: Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <ContactCard
                icon={<MapPin size={24} />}
                title="Our Location"
                content="Plot No. 42, Auto Nagar, Hyderabad, Telangana, 500070"
                delay={0.1}
              />
              <ContactCard
                icon={<Phone size={24} />}
                title="Phone Number"
                content="+91 8096936290"
                subContent="Mon-Sat (9am to 6pm)"
                delay={0.2}
              />
              <ContactCard
                icon={<Mail size={24} />}
                title="Email Address"
                content="support@varshinispares.com"
                subContent="We reply within 24 hours"
                delay={0.3}
              />
              <ContactCard
                icon={<Clock size={24} />}
                title="Working Hours"
                content="Monday - Saturday: 09:00 AM - 08:00 PM"
                subContent="Sunday: Closed"
                delay={0.4}
              />
            </div>

            {/* Map Preview */}
            <div className="relative h-64 rounded-3xl overflow-hidden shadow-lg border border-gray-200 dark:border-white/10 group">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3808.045089339328!2d78.54924877493406!3d17.36156358352125!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb98a143525213%3A0x629c17753556c420!2sAuto%20Nagar%2C%20Hyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1709928123456!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                className="group-hover:scale-105 transition-transform duration-700"
              ></iframe>
            </div>
          </motion.div>

          {/* RIGHT: Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="bg-white dark:bg-white/5 p-8 md:p-10 rounded-3xl border border-gray-100 dark:border-white/10 shadow-xl dark:shadow-none">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <MessageSquare className="text-blue-600 dark:text-blue-400" />
                Send us a Message
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Your Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      placeholder="Sai"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      placeholder="sai@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="Inquiry about spare part..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-gradient-to-r from-hyundai-blue to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Send Message <Send size={18} />
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// ------------------- COMPONENT: Contact Card -------------------

function ContactCard({
  icon,
  title,
  content,
  subContent,
  delay,
}: {
  icon: any;
  title: string;
  content: string;
  subContent?: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ x: 10 }}
      className="flex items-start gap-5 p-5 bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md transition-all cursor-default"
    >
      <div className="p-3 bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-xl">
        {icon}
      </div>
      <div>
        <h4 className="font-bold text-gray-900 dark:text-white text-lg">
          {title}
        </h4>
        <p className="text-gray-600 dark:text-gray-300 mt-1 font-medium">
          {content}
        </p>
        {subContent && (
          <p className="text-sm text-gray-400 mt-1">{subContent}</p>
        )}
      </div>
    </motion.div>
  );
}
