import type { Metadata } from "next";
import "./globals.css";

const productionUrl = "https://learning-code-app.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(productionUrl),
  applicationName: "CodeTrail",
  title: {
    default: "CodeTrail — Learn coding one step at a time",
    template: "%s | CodeTrail",
  },
  description:
    "Learn Python, web development and JavaScript through short lessons, real coding challenges, saved projects, progress tracking, and an AI Code Coach.",
  icons: {
    icon: "/mascot.svg",
  },
  openGraph: {
    type: "website",
    url: productionUrl,
    siteName: "CodeTrail",
    title: "CodeTrail — Learn coding one step at a time",
    description:
      "Learn Python, web development and JavaScript through short lessons, real coding challenges, saved projects, progress tracking, and an AI Code Coach.",
  },
  twitter: {
    card: "summary",
    title: "CodeTrail — Learn coding one step at a time",
    description:
      "Learn Python, web development and JavaScript through short lessons, real coding challenges, saved projects, progress tracking, and an AI Code Coach.",
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
