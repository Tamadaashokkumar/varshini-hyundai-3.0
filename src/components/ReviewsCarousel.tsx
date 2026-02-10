"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { Quote, Star, Verified } from "lucide-react";

// Swiper Styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const reviews = [
  {
    id: 1,
    name: "Ravi Teja",
    car: "Hyundai Creta",
    rating: 5,
    comment:
      "Original parts received! I was worried about quality, but the bumper fits perfectly. Fast delivery to Hyderabad.",
    initial: "R",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: 2,
    name: "Suresh Reddy",
    car: "Hyundai Verna",
    rating: 5,
    comment:
      "Best price compared to local market. The headlight assembly was packed very securely. Highly recommended!",
    initial: "S",
    color: "from-purple-500 to-pink-500",
  },
  {
    id: 3,
    name: "Anil Kumar",
    car: "Hyundai i20",
    rating: 4,
    comment:
      "Good service. The part is genuine, but delivery took one extra day. Overall satisfied with the purchase.",
    initial: "A",
    color: "from-amber-500 to-orange-500",
  },
  {
    id: 4,
    name: "Karthik Varma",
    car: "Hyundai Venue",
    rating: 5,
    comment:
      "Found rare parts for my Venue here. Customer support helped me choose the right model. Thank you Varshini Spares!",
    initial: "K",
    color: "from-emerald-500 to-teal-500",
  },
  {
    id: 5,
    name: "Manoj P",
    car: "Hyundai Tucson",
    rating: 5,
    comment:
      "Premium quality and genuine finish. Will definitely order brake pads from here next time.",
    initial: "M",
    color: "from-indigo-500 to-violet-500",
  },
];

// Star Rating Component
const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex gap-1 mb-4">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={16}
          className={`${
            i < rating
              ? "fill-yellow-400 text-yellow-400 drop-shadow-md"
              : "text-gray-300 dark:text-gray-600"
          }`}
        />
      ))}
    </div>
  );
};

const ReviewsCarousel = () => {
  return (
    <section className="w-full  py-24 relative overflow-hidden bg-slate-50 dark:bg-[#020617]">
      {/* 🌌 Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-500/5 dark:bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-500/5 dark:bg-purple-600/10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16">
          <span className="text-cyan-600 dark:text-cyan-400 font-bold tracking-widest uppercase text-xs mb-3 block">
            Testimonials
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-6">
            Trusted by{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
              Thousands
            </span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Don't just take our word for it. Here is what car owners across
            India have to say about our genuine parts and service.
          </p>
        </div>

        {/* Carousel */}
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          spaceBetween={30}
          slidesPerView={1}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          pagination={{ clickable: true, dynamicBullets: true }}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="pb-20 px-4"
        >
          {reviews.map((review) => (
            <SwiperSlide key={review.id} className="h-auto pt-4">
              {/* --- GLASS CARD --- */}
              <div className="group relative h-full flex flex-col p-8 bg-white dark:bg-[#0a0a0f] border border-slate-200 dark:border-white/5 rounded-[2rem] shadow-xl hover:shadow-2xl hover:shadow-blue-500/10 dark:shadow-none hover:-translate-y-2 transition-all duration-500 overflow-hidden">
                {/* Gradient Border Overlay on Hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${review.color} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500`}
                />

                {/* Quote Icon */}
                <div className="absolute top-8 right-8 text-slate-200 dark:text-white/5 group-hover:text-blue-500/10 transition-colors duration-500">
                  <Quote size={64} fill="currentColor" />
                </div>

                {/* User Info Header */}
                <div className="flex items-center gap-4 mb-6 relative z-10">
                  {/* Avatar with Gradient Ring */}
                  <div
                    className={`w-14 h-14 rounded-full p-[2px] bg-gradient-to-tr ${review.color}`}
                  >
                    <div className="w-full h-full rounded-full bg-white dark:bg-[#0a0a0f] flex items-center justify-center text-slate-900 dark:text-white font-black text-xl shadow-inner">
                      {review.initial}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-lg leading-tight">
                      {review.name}
                    </h3>
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">
                      {review.car} Owner
                    </p>
                  </div>
                </div>

                {/* Stars */}
                <StarRating rating={review.rating} />

                {/* Comment */}
                <div className="flex-grow relative z-10">
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[15px] font-medium">
                    "{review.comment}"
                  </p>
                </div>

                {/* Verified Badge */}
                <div className="mt-8 pt-5 border-t border-slate-100 dark:border-white/5 flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-widest">
                  <div className="p-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                    <Verified size={12} strokeWidth={3} />
                  </div>
                  Verified Purchase
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Swiper Pagination Customization */}
      <style jsx global>{`
        .swiper-pagination-bullet {
          background-color: #94a3b8 !important;
          opacity: 0.4;
          width: 8px;
          height: 8px;
          transition: all 0.3s;
        }
        .swiper-pagination-bullet-active {
          background-color: #3b82f6 !important;
          opacity: 1;
          width: 24px;
          border-radius: 4px;
        }
        .dark .swiper-pagination-bullet-active {
          background-color: #06b6d4 !important;
        }
      `}</style>
    </section>
  );
};

export default ReviewsCarousel;
