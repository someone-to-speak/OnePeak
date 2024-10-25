/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: ".com",
        pathname: "/**"
      }
    ],
    formats: ["image/avif", "image/webp"],
    domains: ["i.scdn.co"]
  }
};

export default nextConfig;
