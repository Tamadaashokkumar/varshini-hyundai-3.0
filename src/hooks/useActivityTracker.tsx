"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { io, Socket } from "socket.io-client";
import { useStore } from "@/store/useStore";
import axios from "axios";

interface User {
  _id: string;
  id?: string;
  name?: string;
  role?: string;
}

// Backend URL
const SOCKET_URL = (
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000"
).replace(/\/api\/?$/, "");

const socket: Socket = io(SOCKET_URL, {
  autoConnect: true,
  path: "/socket.io/",
  transports: ["websocket"],
  withCredentials: true,
});

export const useActivityTracker = (user: User | null | undefined) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { cart, cartItemCount } = useStore();

  const [location, setLocation] = useState<string>("Unknown");
  const [deviceInfo, setDeviceInfo] = useState<string>("Desktop");
  const [batteryLevel, setBatteryLevel] = useState<string>("");
  const isTabActive = useRef(true);

  // 1. DATA COLLECTION (Device, Location, Battery)
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const res = await axios.get("http://ip-api.com/json");
        if (res.data.status === "success") {
          setLocation(`${res.data.city}, ${res.data.regionName}`);
        } else {
          const fallback = await axios.get("https://ipapi.co/json/");
          setLocation(`${fallback.data.city}, ${fallback.data.region_code}`);
        }
      } catch (e) {
        console.error("Location Error:", e);
        setLocation("India (Loc Failed)");
      }
    };
    fetchLocation();

    const ua = navigator.userAgent;
    if (/Mobi|Android/i.test(ua)) setDeviceInfo("Mobile");
    else if (/iPad|Tablet/i.test(ua)) setDeviceInfo("Tablet");
    else setDeviceInfo("Desktop");

    if ((navigator as any).getBattery) {
      (navigator as any).getBattery().then((battery: any) => {
        setBatteryLevel(`${Math.round(battery.level * 100)}%`);
      });
    }
  }, []);

  // 2. LISTENERS (Exit Intent, Tab Change)
  useEffect(() => {
    const handleVisibilityChange = () => {
      isTabActive.current = !document.hidden;
      sendLiveUpdate("TAB_CHANGE", { isActive: isTabActive.current });
    };

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY < 10) {
        console.log("🚀 Exit Intent Triggered!");
        sendLiveUpdate("EXIT_INTENT", { alert: "User might leave!" });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.documentElement.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.documentElement.removeEventListener(
        "mouseleave",
        handleMouseLeave,
      );
    };
  }, [location, deviceInfo]);

  // 3. SEND DATA TO ADMIN
  const sendLiveUpdate = (action: string, extraDetails: any = {}) => {
    if (user?.role === "admin") return;

    const userId = user?._id || user?.id || null;
    const userName = user?.name || "Guest";

    const cartSummary =
      cart?.items?.map((item) => ({
        name: item.product.name,
        price: item.price,
        qty: item.quantity,
      })) || [];

    socket.emit("track_activity", {
      action: action,
      userId: userId,
      userName: userName,
      details: { ...extraDetails, page: pathname },
      path: pathname,
      meta: {
        location,
        device: deviceInfo,
        battery: batteryLevel,
        isTabActive: isTabActive.current,
        cart: {
          count: cartItemCount,
          total: cart?.totalAmount || 0,
          items: cartSummary,
        },
      },
      saveToDb: true,
    });
  };

  // 4. MAIN PAGE VIEW TRIGGER
  useEffect(() => {
    if (!pathname || user?.role === "admin") return;
    const timer = setTimeout(() => {
      sendLiveUpdate("PAGE_VIEW");
    }, 1000);
    return () => clearTimeout(timer);
  }, [pathname, user, location, deviceInfo, cartItemCount]);

  // 5. CHAT LISTENER (Fix)
  useEffect(() => {
    const userId = user?._id || user?.id;
    if (userId) {
      socket.emit("join_room", `user:${userId}`);
    }
  }, [user]);

  // 🔥 6. NEW: CLICK TRACKING (Inside the function now)
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Get text or tag name
      const clickedText =
        target.innerText?.slice(0, 30) || target.tagName || "Unknown Element";

      if (clickedText) {
        socket.emit("track_activity", {
          action: "CLICK",
          userId: user?._id || "Guest", // Now 'user' is accessible here
          userName: user?.name || "Guest",
          details: {
            element: clickedText,
            x: e.clientX,
            y: e.clientY,
          },
          path: window.location.pathname,
          saveToDb: true,
        });
      }
    };

    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, [user]); // Valid dependency

  // Button Clicks Helper
  const trackAction = (actionName: string, details: any = {}) => {
    sendLiveUpdate(actionName, details);
  };

  return { trackAction };
};
