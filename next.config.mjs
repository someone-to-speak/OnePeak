/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: ".com",
        pathname: "/**"
      }
    ],
    formats: ["image/avif", "image/webp"],
    domains: ["i.scdn.co", "hayfkffvhrshjassogbx.supabase.co"]
  }
};

export default nextConfig;
