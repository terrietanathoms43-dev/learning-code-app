import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CodeTrail",
    short_name: "CodeTrail",
    description:
      "A playful coding trail for Python and web development with real challenges, saved projects, progress tracking, and an AI Code Coach.",
    start_url: "/learn",
    display: "standalone",
    icons: [
      {
        src: "/mascot.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
