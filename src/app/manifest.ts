import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Muhammad Ahmad Aslam · AI Full-Stack Developer",
    short_name: "Ahmad Aslam",
    description:
      "AI full-stack developer building end-to-end products and the AI that powers them, from real-time web to the models underneath.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0f",
    theme_color: "#0a0a0f",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
    ],
  };
}
