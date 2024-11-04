/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
        pathname: "/**"
      }
    ],
    formats: ["image/avif", "image/webp"],
    domains: ["hayfkffvhrshjassogbx.supabase.co", "lh3.googleusercontent.com", "files.slack.com"]
  }
};

export default nextConfig;
