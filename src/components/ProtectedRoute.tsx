"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[]; // Optional: అడ్మిన్ పేజీల కోసం
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const { user, isAuthenticated, loading } = useAuth(); // AuthProvider నుండి వస్తుంది
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // 1. లోడింగ్ అయిపోయాక మాత్రమే చెక్ చేయాలి
    if (!loading) {
      // 2. లాగిన్ అవ్వకపోతే Login Page కి పంపించు
      if (!isAuthenticated) {
        toast.error("Please login first");
        router.replace(`/login?returnUrl=${encodeURIComponent(pathname)}`);
        return;
      }

      // 3. (Optional) రోల్ సరిపోకపోతే Home కి పంపించు
      if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        toast.error("Access Denied");
        router.replace("/");
      }
    }
  }, [loading, isAuthenticated, user, router, pathname, allowedRoles]);

  // లోడింగ్ అవుతుంటే లేదా లాగిన్ లేకపోతే పేజీ చూపించకూడదు (Null)
  if (loading || !isAuthenticated) {
    return null;
  }

  // రోల్ మ్యాచ్ కాకపోయినా చూపించకూడదు
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return null;
  }

  // అన్నీ ఓకే అయితేనే పేజీని చూపించు
  return <>{children}</>;
}
