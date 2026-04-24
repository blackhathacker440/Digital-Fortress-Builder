import { motion } from "framer-motion";
import { ArrowRight, Shield, Sparkles } from "lucide-react";
import { Shield3D } from "@/components/three/Shield";
import { WebGLGate } from "@/components/three/CanvasFallback";

export function Hero() {
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden"
    >
      <div className="absolute inset-0 bg-grid bg-grid-fade pointer-events-none" />
      <div className="absolute inset-0 scanlines pointer-events-none opacity-40" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left — copy */}
          <div className="lg:col-span-7 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-mono text-primary mb-6"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              SYSTEM ONLINE / v3.7.2
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-sans text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[1.02] tracking-tight"
            >
              Architecting Code.
              <br />
              <span className="text-gradient-neon">Securing the Future.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="mt-6 font-mono text-sm sm:text-base text-primary/90"
            >
              {"> "}Full-Stack Developer
              <span className="text-muted-foreground"> & </span>
              Security Enthusiast.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="mt-6 max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed"
            >
              I don't just write software — I build digital fortresses that look
              futuristic and run bulletproof. Every component is engineered. Every
              endpoint is hardened. Every pixel earns its place on screen.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <button
                onClick={() => scrollTo("arsenal")}
                className="neon-border group relative inline-flex items-center gap-2 rounded-lg bg-primary/15 px-6 py-3 font-medium text-primary-foreground"
              >
                <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary via-secondary to-accent opacity-90 group-hover:opacity-100 transition-opacity" />
                <span className="relative z-10 flex items-center gap-2 text-background font-semibold">
                  <Shield className="h-4 w-4" />
                  View Arsenal
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </button>

              <button
                onClick={() => scrollTo("contact")}
                className="neon-border group relative inline-flex items-center gap-2 rounded-lg px-6 py-3 font-medium text-foreground hover:text-primary transition-colors"
              >
                <span className="absolute inset-0 rounded-lg bg-card/60 backdrop-blur-sm" />
                <span className="relative z-10 flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Initiate Contact
                </span>
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="mt-12 grid grid-cols-3 gap-6 max-w-md"
            >
              {[
                { v: "5+", l: "YEARS BUILDING" },
                { v: "60+", l: "SHIPPED PROJECTS" },
                { v: "0", l: "BREACHES ON WATCH" },
              ].map((s) => (
                <div key={s.l}>
                  <div className="font-mono text-2xl sm:text-3xl text-primary">
                    {s.v}
                  </div>
                  <div className="mt-1 font-mono text-[10px] tracking-widest text-muted-foreground">
                    {s.l}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — 3D Shield */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="lg:col-span-5 relative h-[420px] sm:h-[520px] lg:h-[600px] order-first lg:order-last"
          >
            <div className="absolute inset-0 rounded-3xl">
              <WebGLGate
                fallback={
                  <div className="h-full w-full flex items-center justify-center">
                    <div className="relative h-64 w-64 rounded-full border-2 border-primary/40 animate-pulse">
                      <div className="absolute inset-6 rounded-full border border-secondary/40" />
                      <div className="absolute inset-12 rounded-full border border-accent/40" />
                      <div className="absolute inset-0 flex items-center justify-center font-mono text-xs text-primary tracking-widest">
                        SECURITY_CORE
                      </div>
                    </div>
                  </div>
                }
              >
                <Shield3D />
              </WebGLGate>
            </div>
            {/* Decorative HUD corners */}
            {[
              "top-4 left-4 border-l-2 border-t-2",
              "top-4 right-4 border-r-2 border-t-2",
              "bottom-4 left-4 border-l-2 border-b-2",
              "bottom-4 right-4 border-r-2 border-b-2",
            ].map((c) => (
              <div
                key={c}
                className={`absolute h-6 w-6 border-primary/60 ${c}`}
              />
            ))}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-[0.3em] text-primary/70">
              SECURITY_CORE.SYS
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-muted-foreground"
      >
        <span className="font-mono text-[10px] tracking-widest">SCROLL</span>
        <span className="h-8 w-px bg-gradient-to-b from-primary to-transparent" />
      </motion.div>
    </section>
  );
}
