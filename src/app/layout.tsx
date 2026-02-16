// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Orbitron } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Navbar } from "@/components/Navbar";
import { CartDrawer } from "@/components/CartDrawer";
import { Footer } from "@/components/Footer";
import ChatFloatingButton from "@/components/ChatFloatingButton";
import AdminMessageModal from "@/components/AdminMessageModal";
import ScrollToTop from "@/components/ScrollToTop";
import AuthProvider from "@/providers/AuthProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// --- IDI ADD CHEYANDI (THE FIX) ---
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Optional: zoom disable chestundi (app-like feel kosam)
  // Ee property keyboard open ayinappudu layout ni resize chestundi
  interactiveWidget: "resizes-content",
};
// ----------------------------------

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hyundai Spares | Premium Genuine Parts",
  description:
    "Discover premium genuine spare parts for your Hyundai vehicle. Quality assured. Performance guaranteed.",
  keywords:
    "Hyundai, spare parts, genuine parts, automotive, car parts, Creta, Verna, i20",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${orbitron.variable} font-body`}>
        <ThemeProvider>
          <AuthProvider>
            <ScrollToTop />

            <AdminMessageModal />
            <div className="flex flex-col min-h-screen bg-[#050B14] text-white antialiased">
              <Navbar />
              <main className="flex-1">{children}</main>

              <Footer />
            </div>
            <CartDrawer />
            <ChatFloatingButton />

            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: "rgba(0, 0, 0, 0.8)",
                  color: "#fff",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                },
                success: {
                  iconTheme: {
                    primary: "#00AAD2",
                    secondary: "#fff",
                  },
                },
              }}
            />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
