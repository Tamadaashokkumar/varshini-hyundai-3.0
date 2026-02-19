// app/verify-email/[token]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import apiClient from "@/services/apiClient";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function VerifyEmail() {
  const { token } = useParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await apiClient.get(`/auth/verify-email/${token}`);
        if (res.data.success) {
          setStatus("success");
          toast.success("Email verified successfully!");
          setTimeout(() => router.push("/login"), 3000);
        }
      } catch (err) {
        setStatus("error");
        toast.error("Verification failed or link expired.");
      }
    };
    if (token) verify();
  }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] text-white">
      <div className="text-center p-8 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-xl">
        {status === "loading" && (
          <Loader2 className="animate-spin mx-auto mb-4" size={40} />
        )}
        {status === "success" && (
          <>
            <CheckCircle2 className="text-green-500 mx-auto mb-4" size={60} />
            <h1 className="text-2xl font-bold">Email Verified!</h1>
            <p className="text-gray-400 mt-2">Redirecting to login...</p>
          </>
        )}
        {status === "error" && (
          <>
            <XCircle className="text-red-500 mx-auto mb-4" size={60} />
            <h1 className="text-2xl font-bold">Verification Failed</h1>
            <p className="text-gray-400 mt-2">
              The link might be expired or invalid.
            </p>
            <button
              onClick={() => router.push("/login")}
              className="mt-4 text-blue-500 underline"
            >
              Back to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}
