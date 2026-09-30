import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CodeTrail — Learn coding one step at a time",
  description: "A playful, path-based coding learning experience.",
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
