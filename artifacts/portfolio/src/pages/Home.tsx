import { Nav } from "@/components/Nav";
import { Hero } from "@/components/sections/Hero";
import { Arsenal } from "@/components/sections/Arsenal";
import { Services } from "@/components/sections/Services";
import { Bio } from "@/components/sections/Bio";
import { Activity } from "@/components/sections/Activity";
import { DriveMode } from "@/components/sections/DriveMode";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="relative min-h-screen w-full text-foreground">
      <Nav />
      <main>
        <Hero />
        <Arsenal />
        <Services />
        <Bio />
        <Activity />
        <DriveMode />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
