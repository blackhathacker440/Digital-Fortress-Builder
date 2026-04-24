import { motion } from "framer-motion";
import { TerminalWindow } from "./Terminal";
import { Cpu, GitBranch, Coffee, Zap } from "lucide-react";

const STATS = [
  { icon: GitBranch, label: "Daily commits, on average", value: "8" },
  { icon: Coffee, label: "Cups of coffee per build", value: "∞" },
  { icon: Cpu, label: "RAM allocated to VS Code", value: "16gb" },
  { icon: Zap, label: "Average response time", value: "< 1h" },
];

export function Bio() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-6"
          >
            <div className="font-mono text-xs tracking-[0.3em] text-primary mb-3">
              // 04 — THE OPERATOR
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.05]">
              The human <br />
              behind the <span className="text-gradient-neon">terminal.</span>
            </h2>

            <div className="mt-8 space-y-5 text-muted-foreground leading-relaxed text-base sm:text-lg">
              <p>
                I'm a developer who works at the intersection of
                <span className="text-foreground font-medium"> logic</span> and
                <span className="text-foreground font-medium"> creativity</span>.
                Coding isn't just work for me — it's an art form. Whether I'm
                wiring up complex React components or patching system
                vulnerabilities, I treat every line like it matters.
              </p>
              <p>
                When I'm not shipping code, I'm exploring new tech stacks and
                tuning my development environment to perfection. Optimization is
                a hobby. Polish is non-negotiable.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-4">
              {STATS.map((s, i) => {
                const Icon = s.icon;
                return (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * i, duration: 0.5 }}
                    className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-4 hover:border-primary/40 transition-colors"
                  >
                    <Icon className="h-4 w-4 text-primary mb-3" />
                    <div className="font-mono text-2xl text-foreground">
                      {s.value}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 leading-snug">
                      {s.label}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="lg:col-span-6"
          >
            <TerminalWindow />
            <div className="mt-3 flex items-center justify-between font-mono text-[10px] tracking-widest text-muted-foreground px-2">
              <span>SHELL.LIVE_FEED</span>
              <span className="text-primary">REC ●</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
