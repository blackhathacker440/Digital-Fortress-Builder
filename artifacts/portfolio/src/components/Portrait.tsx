import { motion } from "framer-motion";

export function Portrait() {
  const base = import.meta.env.BASE_URL;
  return (
    <div className="relative h-full w-full flex items-center justify-center">
      {/* Outer rotating neon rings */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <div className="h-[420px] w-[420px] sm:h-[480px] sm:w-[480px] rounded-full border border-primary/30" />
      </motion.div>
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 36, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <div className="h-[480px] w-[480px] sm:h-[540px] sm:w-[540px] rounded-full border border-secondary/20" />
      </motion.div>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <div className="h-[540px] w-[540px] sm:h-[600px] sm:w-[600px] rounded-full border border-accent/15 border-dashed" />
      </motion.div>

      {/* Portrait disc */}
      <div className="relative">
        {/* Glow halo */}
        <div className="absolute -inset-6 rounded-full bg-gradient-to-tr from-primary/40 via-secondary/40 to-accent/40 blur-2xl opacity-70 animate-pulse" />

        {/* Conic neon ring */}
        <div className="relative h-72 w-72 sm:h-80 sm:w-80 rounded-full p-[3px] bg-[conic-gradient(from_0deg,theme(colors.cyan.400),theme(colors.purple.500),theme(colors.pink.500),theme(colors.cyan.400))] animate-spin-slow">
          <div className="h-full w-full rounded-full bg-background p-1.5">
            <div className="relative h-full w-full rounded-full overflow-hidden">
              <img
                src={`${base}portrait.jpg`}
                alt="Portrait"
                className="h-full w-full object-cover scale-110 contrast-110 saturate-110"
                style={{ filter: "brightness(0.95)" }}
              />
              {/* Cyberpunk color tint */}
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-secondary/20 mix-blend-overlay" />
              {/* Scanlines */}
              <div
                className="absolute inset-0 pointer-events-none opacity-40"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(0deg, rgba(0,0,0,0.35) 0px, rgba(0,0,0,0.35) 1px, transparent 1px, transparent 3px)",
                }}
              />
              {/* Vignette */}
              <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,transparent_55%,rgba(0,0,0,0.55)_100%)]" />
            </div>
          </div>
        </div>

        {/* Floating ID label below */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="absolute left-1/2 -translate-x-1/2 -bottom-6 px-3 py-1 rounded-full glass font-mono text-[10px] tracking-widest text-primary whitespace-nowrap"
        >
          ID.0440 · OPERATOR
        </motion.div>

        {/* Orbital pulse dots */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 pointer-events-none"
        >
          <span className="absolute -top-2 left-1/2 -translate-x-1/2 h-2 w-2 rounded-full bg-primary shadow-[0_0_12px_currentColor]" />
        </motion.div>
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 pointer-events-none"
        >
          <span className="absolute top-1/2 -right-2 -translate-y-1/2 h-2 w-2 rounded-full bg-accent shadow-[0_0_12px_currentColor]" />
        </motion.div>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 pointer-events-none"
        >
          <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-2 w-2 rounded-full bg-secondary shadow-[0_0_12px_currentColor]" />
        </motion.div>
      </div>

      {/* Side telemetry text */}
      <div className="hidden sm:block absolute top-6 right-6 font-mono text-[10px] tracking-widest text-primary/70 text-right leading-relaxed">
        <div>BIO_SCAN: OK</div>
        <div className="text-secondary">CLEARANCE: L7</div>
        <div className="text-accent">UPLINK: STABLE</div>
      </div>
      <div className="hidden sm:block absolute bottom-6 left-6 font-mono text-[10px] tracking-widest text-muted-foreground leading-relaxed">
        <div>LAT 23.81°N</div>
        <div>LON 90.41°E</div>
      </div>
    </div>
  );
}
