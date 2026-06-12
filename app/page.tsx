import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import Forge from "@/components/sections/Forge";
import Hero from "@/components/sections/Hero";
import Mission from "@/components/sections/Mission";
import Technology from "@/components/sections/Technology";
import Vision from "@/components/sections/Vision";
import Why from "@/components/sections/Why";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="top">
        <Hero />
        <div className="glow-divider mx-auto max-w-6xl" />
        <Mission />
        <Forge />
        <Technology />
        <Why />
        <Vision />
      </main>
      <Footer />
    </>
  );
}
