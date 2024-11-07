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
        src: "/app-icon.png",
        sizes: "156x156",
        type: "image/png"
      },
      {
        src: "/app-icon.png",
        sizes: "156x156",
        type: "image/png"
      }
    ]
  };
}
