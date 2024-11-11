import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "One Peak",
    short_name: "OnePeak",
    id: "/",
    description: "someOne to sPeak",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: "/app-icon-192.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "/app-icon-512.png",
        sizes: "512x512",
        type: "image/png"
      }
    ]
  };
}
