import { motion } from "framer-motion";
import { useState } from "react";
import { Send, ArrowUpRight } from "lucide-react";
import {
  SiGithub,
  SiYoutube,
  SiInstagram,
  SiTiktok,
} from "react-icons/si";
import { FaLinkedin } from "react-icons/fa6";
import type { IconType } from "react-icons";
import { SectionHeader } from "./Arsenal";
import { useToast } from "@/hooks/use-toast";

type Social = {
  icon: IconType;
  label: string;
  href: string;
  handle: string;
  accent: string;
};

const SOCIALS: Social[] = [
  {
    icon: SiGithub,
    label: "GitHub",
    href: "https://github.com/blackhathacker440",
    handle: "@blackhathacker440",
    accent: "text-primary",
  },
  {
    icon: SiYoutube,
    label: "YouTube",
    href: "https://youtube.com/@ablack_hat_hacker?si=rKNBiZcSmJqAh3N-",
    handle: "@ablack_hat_hacker",
    accent: "text-accent",
  },
  {
    icon: SiInstagram,
    label: "Instagram",
    href: "https://www.instagram.com/abhhash_440?igsh=MXN2d2Fpa2FlZWZyNA==",
    handle: "@abhhash_440",
    accent: "text-pink-400",
  },
  {
    icon: FaLinkedin,
    label: "LinkedIn",
    href: "https://www.linkedin.com/me?trk=p_mwlite_feed-secondary_nav",
    handle: "/in/operator",
    accent: "text-secondary",
  },
  {
    icon: SiTiktok,
    label: "TikTok",
    href: "https://www.tiktok.com/@black_hat_hacker440?_r=1&_t=ZS-95naJhC8gpp",
    handle: "@black_hat_hacker440",
    accent: "text-foreground",
  },
];

export function Contact() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !message.trim()) {
      toast({
        title: "Missing payload",
        description: "Need both an email and a message before transmission.",
        variant: "destructive",
      });
      return;
    }
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setEmail("");
      setMessage("");
      toast({
        title: "Transmission received.",
        description: "Encrypted handshake complete. I'll respond within one business day.",
      });
    }, 900);
  }

  return (
    <section id="contact" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="// 07 — INITIATE CONTACT"
          title="Open a secure channel."
          subtitle="Got a build, audit, or wild idea? Send the brief, or hit me on any of the networks below."
        />

        <div className="mt-16 grid lg:grid-cols-5 gap-8">
          {/* Left — form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3 neon-border rounded-2xl p-px"
          >
            <form
              onSubmit={onSubmit}
              className="rounded-2xl bg-card/70 backdrop-blur-sm p-6 sm:p-8 space-y-5"
            >
              <div>
                <label className="font-mono text-[11px] tracking-widest text-primary block mb-2">
                  YOUR_EMAIL
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="commander@yourdomain.com"
                  className="w-full bg-background/60 border border-border rounded-lg px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                />
              </div>
              <div>
                <label className="font-mono text-[11px] tracking-widest text-primary block mb-2">
                  PAYLOAD
                </label>
                <textarea
                  required
                  rows={6}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe the build, the brief, or the bug..."
                  className="w-full bg-background/60 border border-border rounded-lg px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none transition-all"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="font-mono text-[10px] tracking-widest text-muted-foreground">
                  END-TO-END · ENCRYPTED
                </span>
                <button
                  type="submit"
                  disabled={sending}
                  className="neon-border group relative inline-flex items-center gap-2 rounded-lg px-5 py-2.5 font-medium disabled:opacity-60"
                >
                  <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary via-secondary to-accent" />
                  <span className="relative z-10 flex items-center gap-2 text-background font-semibold">
                    {sending ? "Transmitting..." : "Transmit"}
                    <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </button>
              </div>
            </form>
          </motion.div>

          {/* Right — socials */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-2 space-y-3"
          >
            {SOCIALS.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.05 * i }}
                  className="group flex items-center gap-4 rounded-xl border border-border bg-card/50 backdrop-blur-sm p-4 hover:border-primary/40 hover:bg-card/80 transition-all"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 border border-primary/30 group-hover:bg-primary/20 transition-colors">
                    <Icon className={`h-4 w-4 ${s.accent}`} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground">
                      {s.label}
                    </div>
                    <div className="font-mono text-xs text-muted-foreground truncate">
                      {s.handle}
                    </div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
                </motion.a>
              );
            })}

            <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono text-xs text-emerald-400 tracking-wider">
                  CURRENTLY_AVAILABLE
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                DM open across all platforms. I read every message.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
