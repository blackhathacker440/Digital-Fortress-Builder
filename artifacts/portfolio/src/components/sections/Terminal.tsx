import { useEffect, useRef, useState } from "react";

type Line = {
  text: string;
  type: "prompt" | "stdout" | "ok" | "warn" | "info";
};

const SCRIPTS: Line[][] = [
  [
    { text: "$ whoami", type: "prompt" },
    { text: "> full_stack_engineer & security_researcher", type: "info" },
    { text: "$ id --groups", type: "prompt" },
    { text: "> sudo, dev, blueteam, redteam, ship", type: "stdout" },
  ],
  [
    { text: "$ nmap -sV --top-ports 100 target.local", type: "prompt" },
    { text: "> Starting Nmap 7.94 ...", type: "stdout" },
    { text: "> 22/tcp   open   ssh     OpenSSH 9.2", type: "ok" },
    { text: "> 443/tcp  open   https   nginx 1.25 (TLS 1.3)", type: "ok" },
    { text: "> [!] 8080/tcp legacy admin panel — flag raised", type: "warn" },
  ],
  [
    { text: "$ pnpm run deploy --prod", type: "prompt" },
    { text: "> ▲ vite v6 — building for production ...", type: "stdout" },
    { text: "> ✓ 412 modules transformed in 1.2s", type: "ok" },
    { text: "> ✓ deployed to edge — 14 regions live", type: "ok" },
  ],
  [
    { text: "$ ./fortify.sh --harden --layer all", type: "prompt" },
    { text: "> [✓] firewall rules applied", type: "ok" },
    { text: "> [✓] dependencies audited (0 critical)", type: "ok" },
    { text: "> [✓] secrets rotated", type: "ok" },
    { text: "> system hardened. sleep tight.", type: "info" },
  ],
];

const COLOR: Record<Line["type"], string> = {
  prompt: "text-primary",
  stdout: "text-muted-foreground",
  ok: "text-emerald-400",
  warn: "text-accent",
  info: "text-secondary",
};

export function TerminalWindow() {
  const [scriptIdx, setScriptIdx] = useState(0);
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [printed, setPrinted] = useState<Line[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = SCRIPTS[scriptIdx];
    if (lineIdx >= script.length) {
      // pause then move to next script
      const t = setTimeout(() => {
        setScriptIdx((i) => (i + 1) % SCRIPTS.length);
        setLineIdx(0);
        setCharIdx(0);
        setPrinted([]);
      }, 1800);
      return () => clearTimeout(t);
    }

    const currentLine = script[lineIdx];
    if (charIdx < currentLine.text.length) {
      const isPrompt = currentLine.type === "prompt";
      const delay = isPrompt
        ? 35 + Math.random() * 45
        : 12 + Math.random() * 18;
      const t = setTimeout(() => setCharIdx((c) => c + 1), delay);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => {
        setPrinted((p) => [...p, currentLine]);
        setLineIdx((i) => i + 1);
        setCharIdx(0);
      }, currentLine.type === "prompt" ? 250 : 120);
      return () => clearTimeout(t);
    }
  }, [scriptIdx, lineIdx, charIdx]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [printed, charIdx]);

  const currentLine = SCRIPTS[scriptIdx][lineIdx];
  const partial = currentLine
    ? currentLine.text.slice(0, charIdx)
    : "";

  return (
    <div className="neon-border rounded-xl overflow-hidden bg-[#0a0d18]/95 backdrop-blur shadow-2xl">
      {/* macOS-style header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50 bg-card/60">
        <div className="flex gap-1.5">
          <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
          <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
          <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
        </div>
        <div className="flex-1 text-center font-mono text-xs text-muted-foreground tracking-wider">
          ~/secure-shell — bash — 80×24
        </div>
        <div className="font-mono text-[10px] text-primary/70">
          [LIVE]
        </div>
      </div>

      <div
        ref={containerRef}
        className="font-mono text-[13px] sm:text-sm p-4 sm:p-6 h-[280px] sm:h-[320px] overflow-y-auto leading-relaxed"
      >
        {printed.map((l, i) => (
          <div key={i} className={COLOR[l.type]}>
            {l.text}
          </div>
        ))}
        {currentLine && (
          <div className={COLOR[currentLine.type]}>
            <span>{partial}</span>
            <span className="terminal-cursor" />
          </div>
        )}
      </div>
    </div>
  );
}
