/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // 🔥 PERF UPDATE 1: ఆటోమేటిక్ గా బెస్ట్ ఇమేజ్ ఫార్మాట్ వాడటానికి
    formats: ["image/avif", "image/webp"],
    // 🔥 PERF UPDATE 2: ఇమేజెస్ ని సర్వర్ లో క్యాచ్ (Cache) చేసి ఫాస్ట్ గా ఇవ్వడానికి
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "example.com",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "loremflickr.com",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
      {
        protocol: "https",
        hostname: "cdn.pixabay.com",
      },
    ],
  },
  experimental: {
    optimizeCss: true,
    // 🔥 PERF UPDATE 3: ఐకాన్స్, యానిమేషన్ లైబ్రరీల అనవసరమైన కోడ్ ని ఆపడానికి
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  // 🔥 PERF UPDATE 4: ప్రొడక్షన్ లో అనవసరమైన console.log లు తొలగించడానికి (స్పీడ్ పెరుగుతుంది)
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production" ? { exclude: ["error"] } : false,
  },
};

export default nextConfig;
