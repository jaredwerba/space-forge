import type { Metadata, Viewport } from "next";
import {
  IBM_Plex_Mono,
  Inter,
  Pixelify_Sans,
  Space_Grotesk,
  Space_Mono,
  Tiny5,
} from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const grotesk = Space_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

// /neo type system: Tiny5 pixel headings + Space Mono pairing
const tiny5 = Tiny5({
  variable: "--font-pixel",
  subsets: ["latin"],
  weight: "400",
});

// /eb hero display — Pixelify Sans (variable; weight set in CSS)
const pixelify = Pixelify_Sans({
  variable: "--font-pixelify",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  variable: "--font-cmono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "LunarForge — Building Power on the Moon",
  description:
    "LunarForge turns lunar regolith into iron, titanium, and aluminum structures using AI-powered lasers. Launch the core — we build the rest: reactor housing sintered in-situ on the Moon.",
  openGraph: {
    title: "LunarForge — Building Power on the Moon",
    description:
      "From dust to fission: reactor housing sintered in-situ from lunar regolith.",
    type: "website",
    siteName: "LunarForge",
  },
};

export const viewport: Viewport = {
  themeColor: "#05060c",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${grotesk.variable} ${plexMono.variable} ${tiny5.variable} ${pixelify.variable} ${spaceMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
