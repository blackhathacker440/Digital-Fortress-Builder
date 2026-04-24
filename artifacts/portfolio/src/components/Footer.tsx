import { Terminal } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative py-10 border-t border-border/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
            <Terminal className="h-4 w-4 text-primary" />
            <span className="text-primary">/</span>root_terminal —
            <span>© {new Date().getFullYear()} all systems reserved.</span>
          </div>
          <div className="font-mono text-[10px] tracking-widest text-muted-foreground">
            BUILD: v3.7.2 · UPTIME: 99.998% · LAT: 12ms
          </div>
        </div>
      </div>
    </footer>
  );
}
