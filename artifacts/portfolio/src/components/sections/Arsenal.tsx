import { motion } from "framer-motion";
import { Code2, Server, ShieldCheck, Wrench } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Cat = {
  id: string;
  icon: LucideIcon;
  title: string;
  tagline: string;
  color: "primary" | "secondary" | "accent" | "emerald";
  items: { name: string; level: number }[];
};

const CATEGORIES: Cat[] = [
  {
    id: "frontend",
    icon: Code2,
    title: "Frontend Mastery",
    tagline: "High-fidelity UIs with RGB accents",
    color: "primary",
    items: [
      { name: "React.js", level: 96 },
      { name: "React Native", level: 92 },
      { name: "TypeScript", level: 94 },
      { name: "Tailwind / Motion", level: 90 },
    ],
  },
  {
    id: "backend",
    icon: Server,
    title: "Backend Architecture",
    tagline: "Scalable, fast, never flaky",
    color: "secondary",
    items: [
      { name: "Node.js", level: 95 },
      { name: "Express", level: 93 },
      { name: "Firebase", level: 88 },
      { name: "PostgreSQL", level: 86 },
    ],
  },
  {
    id: "security",
    icon: ShieldCheck,
    title: "Security Suite",
    tagline: "Defense in depth, by design",
    color: "accent",
    items: [
      { name: "Pentesting", level: 90 },
      { name: "Secure Code Analysis", level: 88 },
      { name: "Linux Terminal", level: 95 },
      { name: "Python Automation", level: 92 },
    ],
  },
  {
    id: "tools",
    icon: Wrench,
    title: "Operator Tools",
    tagline: "The kit that ships the work",
    color: "emerald",
    items: [
      { name: "Git", level: 96 },
      { name: "VS Code", level: 95 },
      { name: "Postman", level: 90 },
      { name: "Nmap", level: 87 },
    ],
  },
];

const COLOR_CLASS: Record<Cat["color"], { text: string; bg: string; bar: string; border: string }> = {
  primary: {
    text: "text-primary",
    bg: "bg-primary/10",
    bar: "from-primary to-cyan-300",
    border: "border-primary/40",
  },
  secondary: {
    text: "text-secondary",
    bg: "bg-secondary/10",
    bar: "from-secondary to-purple-300",
    border: "border-secondary/40",
  },
  accent: {
    text: "text-accent",
    bg: "bg-accent/10",
    bar: "from-accent to-pink-300",
    border: "border-accent/40",
  },
  emerald: {
    text: "text-emerald-400",
    bg: "bg-emerald-500/10",
    bar: "from-emerald-400 to-emerald-200",
    border: "border-emerald-500/40",
  },
};

export function Arsenal() {
  return (
    <section id="arsenal" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="// 02 — TECHNICAL DNA"
          title="The Arsenal"
          subtitle="Not a list of buzzwords. A loadout — battle-tested, daily-driven, and ready to ship."
        />

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-5">
          {CATEGORIES.map((cat, i) => {
            const Icon = cat.icon;
            const c = COLOR_CLASS[cat.color];
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className="neon-border rounded-2xl p-px"
              >
                <div className="rounded-2xl bg-card/70 backdrop-blur-sm p-6 sm:p-7 h-full">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${c.bg} border ${c.border}`}>
                          <Icon className={`h-5 w-5 ${c.text}`} />
                        </span>
                        <h3 className="text-xl font-semibold text-foreground">
                          {cat.title}
                        </h3>
                      </div>
                      <p className="text-sm text-muted-foreground ml-13 pl-1">
                        {cat.tagline}
                      </p>
                    </div>
                    <span className={`font-mono text-[10px] tracking-widest ${c.text}`}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <ul className="space-y-3">
                    {cat.items.map((item, j) => (
                      <li key={item.name}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-mono text-sm text-foreground">
                            {item.name}
                          </span>
                          <span className={`font-mono text-xs ${c.text}`}>
                            {item.level}%
                          </span>
                        </div>
                        <div className="h-1 w-full rounded-full bg-muted/40 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${item.level}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.3 + j * 0.08, ease: "easeOut" }}
                            className={`h-full rounded-full bg-gradient-to-r ${c.bar}`}
                            style={{ boxShadow: `0 0 10px currentColor` }}
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="max-w-2xl"
    >
      <div className="font-mono text-xs tracking-[0.3em] text-primary mb-3">
        {eyebrow}
      </div>
      <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base sm:text-lg text-muted-foreground">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
