import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { SectionHeader } from "./Arsenal";

// Deterministic seeded RNG so the heatmap is stable across renders
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const WEEKS = 52;
const DAYS = 7;
const MONTH_LABELS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DAY_LABELS = ["Mon", "Wed", "Fri"];

function generateData() {
  const rng = mulberry32(20240924);
  const cells: number[] = [];
  for (let w = 0; w < WEEKS; w++) {
    for (let d = 0; d < DAYS; d++) {
      const weekend = d === 0 || d === 6;
      const base = weekend ? 0.3 : 0.85;
      const r = rng();
      // produce sparse zeros and richer high values
      let v = 0;
      if (r < base) {
        v = Math.floor(rng() * 12) + (rng() < 0.25 ? 4 : 0);
      }
      cells.push(v);
    }
  }
  return cells;
}

function levelFor(v: number) {
  if (v === 0) return 0;
  if (v <= 3) return 1;
  if (v <= 6) return 2;
  if (v <= 10) return 3;
  return 4;
}

const LEVEL_CLASS = [
  "bg-muted/30",
  "bg-primary/25 border border-primary/20",
  "bg-primary/55 border border-primary/30",
  "bg-secondary/70 border border-secondary/30 shadow-[0_0_6px_currentColor] text-secondary",
  "bg-accent border border-accent/40 shadow-[0_0_10px_currentColor] text-accent",
];

export function Activity() {
  const cells = useMemo(generateData, []);
  const [hover, setHover] = useState<{ w: number; d: number; v: number } | null>(null);

  const total = cells.reduce((a, b) => a + b, 0);
  const activeDays = cells.filter((v) => v > 0).length;
  const longestStreak = useMemo(() => {
    let best = 0, cur = 0;
    for (const v of cells) {
      if (v > 0) { cur += 1; best = Math.max(best, cur); }
      else cur = 0;
    }
    return best;
  }, [cells]);

  return (
    <section id="activity" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="// 05 — TELEMETRY"
          title="Code is a daily practice."
          subtitle="The proof is in the pattern. Active 6 days a week, every week — because consistency compounds."
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-12 neon-border rounded-2xl p-px"
        >
          <div className="rounded-2xl bg-card/70 backdrop-blur-sm p-6 sm:p-8">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
              <div>
                <div className="font-mono text-xs text-muted-foreground tracking-wider mb-1">
                  CONTRIBUTION_GRAPH.YEAR_TO_DATE
                </div>
                <div className="text-2xl sm:text-3xl font-semibold">
                  <span className="text-primary font-mono">{total.toLocaleString()}</span>
                  <span className="text-muted-foreground text-base ml-2">contributions in the last year</span>
                </div>
              </div>

              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="text-muted-foreground">Less</span>
                {[0, 1, 2, 3, 4].map((l) => (
                  <span key={l} className={`h-3 w-3 rounded-sm ${LEVEL_CLASS[l]}`} />
                ))}
                <span className="text-muted-foreground">More</span>
              </div>
            </div>

            {/* Heatmap */}
            <div className="overflow-x-auto pb-2">
              <div className="inline-block min-w-full">
                <div className="flex">
                  {/* Day labels */}
                  <div className="flex flex-col justify-between py-1 mr-2 font-mono text-[10px] text-muted-foreground h-[7.25rem] sm:h-[8.5rem]">
                    {DAY_LABELS.map((d) => (
                      <span key={d}>{d}</span>
                    ))}
                  </div>

                  {/* Grid */}
                  <div>
                    {/* Month labels */}
                    <div className="flex mb-1 font-mono text-[10px] text-muted-foreground">
                      {Array.from({ length: WEEKS }).map((_, w) => {
                        const showMonth = w % 4 === 0;
                        return (
                          <div key={w} className="w-3.5 sm:w-4 mr-0.5">
                            {showMonth && MONTH_LABELS[Math.floor((w / WEEKS) * 12)]}
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex">
                      {Array.from({ length: WEEKS }).map((_, w) => (
                        <div key={w} className="flex flex-col mr-0.5">
                          {Array.from({ length: DAYS }).map((_, d) => {
                            const v = cells[w * DAYS + d];
                            const level = levelFor(v);
                            return (
                              <div
                                key={d}
                                onMouseEnter={() => setHover({ w, d, v })}
                                onMouseLeave={() => setHover(null)}
                                className={`h-3 w-3 sm:h-3.5 sm:w-3.5 rounded-sm mb-0.5 transition-transform hover:scale-150 cursor-pointer ${LEVEL_CLASS[level]}`}
                              />
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-border/50 grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
              <Stat label="ACTIVE_DAYS" value={`${activeDays}/365`} color="text-primary" />
              <Stat label="LONGEST_STREAK" value={`${longestStreak}d`} color="text-secondary" />
              <Stat label="AVG_PER_DAY" value={(total / 365).toFixed(1)} color="text-accent" />
              <Stat label="STATUS" value={hover ? `${hover.v} commits` : "● ONLINE"} color="text-emerald-400" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div>
      <div className="text-muted-foreground tracking-widest text-[10px] mb-1">{label}</div>
      <div className={`text-lg ${color}`}>{value}</div>
    </div>
  );
}
