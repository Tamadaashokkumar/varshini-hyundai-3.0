/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com", // 👈 Fix for About Page Error
      },
      {
        protocol: "http",
        hostname: "localhost", // For local backend images
      },
      {
        protocol: "https",
        hostname: "example.com", // మీ డమ్మీ డేటాలో ఉన్న లింక్స్ కోసం
      },
      {
        protocol: "https",
        hostname: "placehold.co", // డమ్మీ ఇమేజెస్ కోసం (Optional)
      },
      {
        protocol: "https",
        hostname: "loremflickr.com",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com", // 👈 Pexels domain add cheyandi
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org", // 👈 IDI ADD CHEYANDI
      },
      {
        protocol: "https",
        hostname: "cdn.pixabay.com", // ✅ PIXABAY ADDED
      },
    ],
  },
  experimental: {
    optimizeCss: true,
  },
};
export default nextConfig;
