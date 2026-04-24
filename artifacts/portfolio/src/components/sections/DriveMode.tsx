import { motion } from "framer-motion";
import { Gauge, Gamepad2, Zap } from "lucide-react";
import { CarGame } from "@/components/three/CarGame";
import { WebGLGate } from "@/components/three/CanvasFallback";
import { SectionHeader } from "./Arsenal";

export function DriveMode() {
  return (
    <section id="drive" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <SectionHeader
            eyebrow="// 06 — OFF-DUTY / SANDBOX"
            title="Drive Mode."
            subtitle="Because every operator needs a side project. Built fully in-browser with three.js — drive the neon grid."
          />
          <div className="hidden sm:flex items-center gap-2 font-mono text-xs text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            INTERACTIVE
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7 }}
          className="mt-12 neon-border rounded-2xl p-px"
        >
          <div className="rounded-2xl bg-card/50 backdrop-blur-sm p-3 sm:p-4">
            <WebGLGate
              fallback={
                <div className="h-[460px] sm:h-[560px] lg:h-[640px] flex items-center justify-center rounded-2xl border border-primary/30 bg-grid bg-grid-fade">
                  <div className="text-center">
                    <div className="font-mono text-sm text-primary mb-2">
                      DRIVE_MODE.UNAVAILABLE
                    </div>
                    <p className="text-muted-foreground max-w-sm">
                      WebGL is required to load Drive Mode. Try a desktop browser with hardware acceleration enabled.
                    </p>
                  </div>
                </div>
              }
            >
              <CarGame />
            </WebGLGate>
          </div>
        </motion.div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Tip
            icon={Gamepad2}
            label="CONTROLS"
            text="WASD or arrow keys to steer. Spacebar brakes. On mobile, on-screen pads appear."
          />
          <Tip
            icon={Gauge}
            label="HANDLING"
            text="Realistic momentum + lean physics. Steering tightens with speed — feather the gas."
          />
          <Tip
            icon={Zap}
            label="STACK"
            text="three.js, react-three-fiber, custom GLSL grid shader, all rendered live in your browser."
          />
        </div>
      </div>
    </section>
  );
}

function Tip({
  icon: Icon,
  label,
  text,
}: {
  icon: typeof Gauge;
  label: string;
  text: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-5">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="h-4 w-4 text-primary" />
        <span className="font-mono text-[10px] tracking-widest text-primary">
          {label}
        </span>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
    </div>
  );
}
