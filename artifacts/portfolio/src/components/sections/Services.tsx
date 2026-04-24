import { motion } from "framer-motion";
import { Smartphone, Layers, Lock, Sparkles, ArrowUpRight } from "lucide-react";
import { SectionHeader } from "./Arsenal";

const SERVICES = [
  {
    icon: Smartphone,
    title: "Cross-Platform App Development",
    desc: "Seamless iOS + Android experiences from a single React Native codebase. Native feel, ship-day reliable.",
    tags: ["React Native", "Expo", "iOS", "Android"],
    color: "from-primary/30 to-cyan-500/10",
  },
  {
    icon: Layers,
    title: "Full-Stack Solutions",
    desc: "Robust end-to-end web applications focused on performance, clean code, and zero-friction developer experience.",
    tags: ["Node.js", "React", "PostgreSQL", "REST / WS"],
    color: "from-secondary/30 to-purple-500/10",
  },
  {
    icon: Lock,
    title: "Cyber Defense & Auditing",
    desc: "Security baked in at the root — threat modeling, code audits, and pentests that keep data and users safe.",
    tags: ["Pentesting", "OWASP", "Hardening", "Auditing"],
    color: "from-accent/30 to-pink-500/10",
  },
  {
    icon: Sparkles,
    title: "Next-Gen UI / UX",
    desc: "Immersive, dark-mode interfaces with 3D elements, motion, and the kind of polish people screenshot.",
    tags: ["Three.js", "Motion", "Design Systems"],
    color: "from-emerald-500/30 to-emerald-500/10",
  },
];

export function Services() {
  return (
    <section id="services" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="// 03 — DELIVERABLES"
          title="What I Deliver"
          subtitle="Four mission profiles. Pick one or stack them — the system scales with the brief."
        />

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-5">
          {SERVICES.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.article
                key={s.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="group relative neon-border rounded-2xl p-px"
              >
                <div className="relative rounded-2xl bg-card/70 backdrop-blur-sm overflow-hidden h-full">
                  <div className={`absolute inset-0 bg-gradient-to-br ${s.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  <div className="relative p-7 sm:p-8 h-full flex flex-col">
                    <div className="flex items-start justify-between">
                      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-background/80 border border-primary/30">
                        <Icon className="h-5 w-5 text-primary" />
                      </span>
                      <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
                    </div>

                    <h3 className="mt-6 text-xl sm:text-2xl font-semibold text-foreground">
                      {s.title}
                    </h3>
                    <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed flex-1">
                      {s.desc}
                    </p>

                    <div className="mt-6 flex flex-wrap gap-2">
                      {s.tags.map((t) => (
                        <span
                          key={t}
                          className="font-mono text-[10px] tracking-wider px-2.5 py-1 rounded-md bg-muted/50 border border-border text-muted-foreground"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="mt-6 pt-5 border-t border-border/50 flex items-center justify-between">
                      <span className="font-mono text-[10px] tracking-widest text-muted-foreground">
                        SVC.{String(i + 1).padStart(3, "0")}
                      </span>
                      <span className="font-mono text-[10px] tracking-widest text-emerald-400">
                        ● OPERATIONAL
                      </span>
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
