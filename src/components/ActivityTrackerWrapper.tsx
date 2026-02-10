"use client";

import { useActivityTracker } from "../hooks/useActivityTracker";
import { useStore } from "@/store/useStore"; // 🔥 మీ Zustand Store ని ఇంపోర్ట్ చేయండి

const ActivityTrackerWrapper = () => {
  // 1. Zustand Store నుండి User ని డైరెక్ట్ గా తీసుకోండి
  // (Redux లో useSelector ఎలానో, Zustand లో ఇది అలా పని చేస్తుంది)
  const user = useStore((state) => state.user);

  // 2. ఆ యూజర్ ని హుక్ కి పంపండి
  useActivityTracker(user as any);

  return null;
};

export default ActivityTrackerWrapper;
