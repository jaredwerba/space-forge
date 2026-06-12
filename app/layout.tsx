import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Inter, Space_Grotesk } from "next/font/google";
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

export const metadata: Metadata = {
  title: "SpaceForge — Building Power on the Moon",
  description:
    "SpaceForge turns lunar regolith into iron, titanium, and aluminum structures using AI-powered lasers — forging the first operational fission reactor on the Moon, from dust to fission.",
  openGraph: {
    title: "SpaceForge — Building Power on the Moon",
    description:
      "From dust to fission: reactor components forged in-situ from lunar regolith.",
    type: "website",
    siteName: "SpaceForge",
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
      className={`${inter.variable} ${grotesk.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
