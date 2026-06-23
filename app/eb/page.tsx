import type { Metadata, Viewport } from "next";
import EbExperience from "@/components/eb/EbExperience";
import "./eb.css";

export const metadata: Metadata = {
  title: "LunarForge — Field Log / Where Dust Becomes Power",
  description:
    "A scroll-driven field record of building the first reactor housing on the Moon — regolith sintered into structure by autonomous lasers. Launch the core; we build the rest.",
};

export const viewport: Viewport = {
  themeColor: "#efece4",
};

export default function EbPage() {
  return <EbExperience />;
}
