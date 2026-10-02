import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AD Lavadores",
    short_name: "AD Lavadores",
    description: "Gestión de jugadores, entrenamientos, partidos y rivales",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#013d17",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
