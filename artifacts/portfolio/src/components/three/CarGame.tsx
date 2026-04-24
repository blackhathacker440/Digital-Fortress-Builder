import { useEffect, useMemo, useRef, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";

// ───────────────────────────────────────────────────────────────────────────
// Shared mutable state for input + telemetry, kept outside React to avoid
// re-renders inside the animation loop.
// ───────────────────────────────────────────────────────────────────────────
type Controls = {
  forward: boolean;
  back: boolean;
  left: boolean;
  right: boolean;
  brake: boolean;
};

const NEON_COLORS = ["#22d3ee", "#a855f7", "#ec4899", "#34d399"];

function Ground() {
  // Tron-style grid plane with shader
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color("#22d3ee") },
        uColorB: { value: new THREE.Color("#a855f7") },
        uFog: { value: new THREE.Color("#05060d") },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vWorldPos;
        void main() {
          vUv = uv;
          vec4 wp = modelMatrix * vec4(position, 1.0);
          vWorldPos = wp.xyz;
          gl_Position = projectionMatrix * viewMatrix * wp;
        }
      `,
      fragmentShader: `
        precision highp float;
        uniform float uTime;
        uniform vec3 uColor;
        uniform vec3 uColorB;
        uniform vec3 uFog;
        varying vec3 vWorldPos;
        void main() {
          float spacing = 4.0;
          vec2 g = abs(fract(vWorldPos.xz / spacing - 0.5) - 0.5) / fwidth(vWorldPos.xz / spacing);
          float line = 1.0 - min(min(g.x, g.y), 1.0);
          // pulse along distance
          float dist = length(vWorldPos.xz);
          float pulse = 0.5 + 0.5 * sin(dist * 0.05 - uTime * 1.4);
          vec3 col = mix(uColor, uColorB, pulse);
          float fadeDist = smoothstep(120.0, 18.0, dist);
          col *= line * (0.6 + pulse * 0.6);
          col *= fadeDist;
          float bg = 0.02 * (1.0 - fadeDist);
          vec3 final = col + uFog * bg;
          gl_FragColor = vec4(final, line * fadeDist + 0.04);
        }
      `,
      transparent: true,
      depthWrite: false,
    });
  }, []);

  useFrame((s) => {
    material.uniforms.uTime.value = s.clock.elapsedTime;
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[300, 300, 1, 1]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

function Car({
  carRef,
  controls,
  onSpeed,
  resetSignal,
}: {
  carRef: React.MutableRefObject<THREE.Group | null>;
  controls: React.MutableRefObject<Controls>;
  onSpeed: (s: number) => void;
  resetSignal: number;
}) {
  // physics state held in refs
  const velocity = useRef(0); // forward velocity along car heading
  const heading = useRef(0); // radians
  const brakeLightRef = useRef<THREE.MeshBasicMaterial>(null);
  const lastSpeedReport = useRef(0);

  useEffect(() => {
    // Reset position
    if (carRef.current) {
      carRef.current.position.set(0, 0.4, 0);
      carRef.current.rotation.set(0, 0, 0);
    }
    velocity.current = 0;
    heading.current = 0;
  }, [resetSignal, carRef]);

  useFrame((_, dt) => {
    if (!carRef.current) return;
    const c = controls.current;
    const accel = 18; // units / s^2
    const brakeDecel = 32;
    const friction = 5;
    const maxSpeed = 42;
    const reverseMax = -14;
    const turnRate = 1.6; // rad/s at full input

    // throttle / brake
    if (c.forward) velocity.current += accel * dt;
    if (c.back) velocity.current -= accel * 0.6 * dt;
    if (c.brake) {
      const sign = Math.sign(velocity.current);
      velocity.current -= sign * brakeDecel * dt;
      if (Math.sign(velocity.current) !== sign) velocity.current = 0;
    } else if (!c.forward && !c.back) {
      // friction
      const sign = Math.sign(velocity.current);
      velocity.current -= sign * friction * dt;
      if (Math.sign(velocity.current) !== sign) velocity.current = 0;
    }

    // clamp
    velocity.current = Math.max(reverseMax, Math.min(maxSpeed, velocity.current));

    // steering — only effective when moving
    const speedFactor = Math.min(1, Math.abs(velocity.current) / 6);
    const turn = (c.left ? 1 : 0) - (c.right ? 1 : 0);
    heading.current += turn * turnRate * dt * speedFactor * Math.sign(velocity.current || 1);

    // move
    const dx = -Math.sin(heading.current) * velocity.current * dt;
    const dz = -Math.cos(heading.current) * velocity.current * dt;
    carRef.current.position.x += dx;
    carRef.current.position.z += dz;
    carRef.current.rotation.y = heading.current;

    // tilt (lean into turns)
    const targetRoll = -turn * speedFactor * 0.12;
    carRef.current.rotation.z += (targetRoll - carRef.current.rotation.z) * 0.15;

    // brake lights
    if (brakeLightRef.current) {
      const on = c.brake || (c.back && velocity.current > 0);
      brakeLightRef.current.opacity = on ? 1 : 0.35;
      brakeLightRef.current.color.setHex(on ? 0xff0044 : 0x661122);
    }

    // report speed at most 10x/s
    const speedKmh = Math.round(velocity.current * 3.6 * 1.2);
    if (Math.abs(speedKmh - lastSpeedReport.current) >= 1) {
      lastSpeedReport.current = speedKmh;
      onSpeed(speedKmh);
    }
  });

  return (
    <group ref={carRef} position={[0, 0.4, 0]}>
      {/* Car body — sleek low-poly */}
      <mesh castShadow position={[0, 0.35, 0]}>
        <boxGeometry args={[1.2, 0.4, 2.4]} />
        <meshStandardMaterial
          color="#0a0e1a"
          emissive="#22d3ee"
          emissiveIntensity={0.6}
          metalness={0.85}
          roughness={0.25}
        />
      </mesh>
      {/* Cabin */}
      <mesh position={[0, 0.7, 0.1]}>
        <boxGeometry args={[1.0, 0.35, 1.2]} />
        <meshStandardMaterial
          color="#000"
          emissive="#a855f7"
          emissiveIntensity={0.5}
          metalness={0.95}
          roughness={0.2}
        />
      </mesh>
      {/* Front nose accent */}
      <mesh position={[0, 0.35, -1.1]}>
        <boxGeometry args={[1.05, 0.08, 0.1]} />
        <meshBasicMaterial color="#22d3ee" />
      </mesh>
      {/* Headlights */}
      <mesh position={[-0.45, 0.4, -1.21]}>
        <boxGeometry args={[0.18, 0.1, 0.05]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.45, 0.4, -1.21]}>
        <boxGeometry args={[0.18, 0.1, 0.05]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      {/* Brake lights bar */}
      <mesh position={[0, 0.42, 1.21]}>
        <boxGeometry args={[1.05, 0.08, 0.05]} />
        <meshBasicMaterial ref={brakeLightRef} color="#661122" transparent opacity={0.35} />
      </mesh>
      {/* Underglow */}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.6, 2.8]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.45} />
      </mesh>

      {/* Wheels */}
      {[
        [-0.55, 0.22, -0.8],
        [0.55, 0.22, -0.8],
        [-0.55, 0.22, 0.8],
        [0.55, 0.22, 0.8],
      ].map((p, i) => (
        <mesh key={i} position={p as [number, number, number]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.22, 0.22, 0.18, 14]} />
          <meshStandardMaterial color="#000" roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
}

function Cones({ count = 60 }: { count: number }) {
  const positions = useMemo(() => {
    const arr: { x: number; z: number; color: string; scale: number }[] = [];
    let seed = 12345;
    const rand = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    for (let i = 0; i < count; i++) {
      const angle = rand() * Math.PI * 2;
      const dist = 12 + rand() * 60;
      arr.push({
        x: Math.cos(angle) * dist,
        z: Math.sin(angle) * dist,
        color: NEON_COLORS[Math.floor(rand() * NEON_COLORS.length)],
        scale: 0.7 + rand() * 0.7,
      });
    }
    return arr;
  }, [count]);

  return (
    <group>
      {positions.map((p, i) => (
        <group key={i} position={[p.x, 0, p.z]} scale={[p.scale, p.scale, p.scale]}>
          <mesh position={[0, 0.55, 0]}>
            <coneGeometry args={[0.4, 1.1, 8]} />
            <meshStandardMaterial
              color="#0a0e1a"
              emissive={p.color}
              emissiveIntensity={1.2}
              metalness={0.8}
              roughness={0.3}
            />
          </mesh>
          <mesh position={[0, 0.05, 0]}>
            <boxGeometry args={[0.7, 0.08, 0.7]} />
            <meshBasicMaterial color={p.color} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Pylons() {
  // tall light pylons that frame the scene
  const items = useMemo(() => {
    const arr: { x: number; z: number; color: string }[] = [];
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      const r = 80;
      arr.push({
        x: Math.cos(a) * r,
        z: Math.sin(a) * r,
        color: NEON_COLORS[i % NEON_COLORS.length],
      });
    }
    return arr;
  }, []);
  return (
    <group>
      {items.map((p, i) => (
        <group key={i} position={[p.x, 0, p.z]}>
          <mesh position={[0, 6, 0]}>
            <boxGeometry args={[0.4, 12, 0.4]} />
            <meshStandardMaterial color="#0a0e1a" metalness={0.9} roughness={0.4} />
          </mesh>
          <mesh position={[0, 12, 0]}>
            <sphereGeometry args={[0.6, 16, 16]} />
            <meshBasicMaterial color={p.color} />
          </mesh>
          <pointLight position={[0, 12, 0]} intensity={1.2} color={p.color} distance={50} />
        </group>
      ))}
    </group>
  );
}

function Camera({ carRef }: { carRef: React.MutableRefObject<THREE.Group | null> }) {
  useFrame((state) => {
    if (!carRef.current) return;
    const car = carRef.current;
    const offset = new THREE.Vector3(0, 4.2, 8.5);
    offset.applyQuaternion(car.quaternion);
    const desired = car.position.clone().add(offset);
    state.camera.position.lerp(desired, 0.08);
    const lookTarget = car.position.clone().add(new THREE.Vector3(0, 1, 0));
    state.camera.lookAt(lookTarget);
  });
  return null;
}

function Scene({
  controls,
  onSpeed,
  resetSignal,
}: {
  controls: React.MutableRefObject<Controls>;
  onSpeed: (s: number) => void;
  resetSignal: number;
}) {
  const carRef = useRef<THREE.Group | null>(null);
  return (
    <>
      <color attach="background" args={["#03050d"]} />
      <fog attach="fog" args={["#03050d", 30, 140]} />
      <ambientLight intensity={0.25} />
      <directionalLight position={[10, 20, 5]} intensity={0.4} color="#a855f7" />
      <hemisphereLight args={["#22d3ee", "#0a0a18", 0.4]} />

      <Ground />
      <Cones count={70} />
      <Pylons />
      <Suspense fallback={null}>
        <Stars radius={120} depth={40} count={1500} factor={3} fade speed={0.4} />
      </Suspense>

      <Car carRef={carRef} controls={controls} onSpeed={onSpeed} resetSignal={resetSignal} />
      <Camera carRef={carRef} />
    </>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// Public component
// ───────────────────────────────────────────────────────────────────────────
export function CarGame() {
  const controls = useRef<Controls>({
    forward: false,
    back: false,
    left: false,
    right: false,
    brake: false,
  });
  const [speed, setSpeed] = useState(0);
  const [resetSignal, setResetSignal] = useState(0);
  const [touch, setTouch] = useState(false);

  useEffect(() => {
    const isTouch =
      typeof window !== "undefined" &&
      ("ontouchstart" in window || navigator.maxTouchPoints > 0);
    setTouch(isTouch);

    const onKey = (e: KeyboardEvent, down: boolean) => {
      const k = e.key.toLowerCase();
      const c = controls.current;
      let handled = true;
      if (k === "w" || k === "arrowup") c.forward = down;
      else if (k === "s" || k === "arrowdown") c.back = down;
      else if (k === "a" || k === "arrowleft") c.left = down;
      else if (k === "d" || k === "arrowright") c.right = down;
      else if (k === " ") c.brake = down;
      else handled = false;
      if (handled) e.preventDefault();
    };
    const kd = (e: KeyboardEvent) => onKey(e, true);
    const ku = (e: KeyboardEvent) => onKey(e, false);
    window.addEventListener("keydown", kd);
    window.addEventListener("keyup", ku);
    return () => {
      window.removeEventListener("keydown", kd);
      window.removeEventListener("keyup", ku);
    };
  }, []);

  const setBtn = (key: keyof Controls, val: boolean) => {
    controls.current[key] = val;
  };

  const speedPct = Math.min(100, Math.abs(speed));
  const pillBtn =
    "select-none touch-manipulation flex items-center justify-center rounded-xl border border-primary/40 bg-card/70 backdrop-blur-sm text-primary font-mono text-xs sm:text-sm font-semibold active:bg-primary/20 active:scale-95 transition-all";

  return (
    <div className="relative w-full h-[460px] sm:h-[560px] lg:h-[640px] rounded-2xl overflow-hidden border border-primary/30 shadow-2xl">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 5, 10], fov: 55 }}
        gl={{ antialias: true }}
      >
        <Scene controls={controls} onSpeed={setSpeed} resetSignal={resetSignal} />
      </Canvas>

      {/* HUD overlay */}
      <div className="pointer-events-none absolute inset-0">
        {/* HUD corners */}
        {[
          "top-3 left-3 border-l-2 border-t-2",
          "top-3 right-3 border-r-2 border-t-2",
          "bottom-3 left-3 border-l-2 border-b-2",
          "bottom-3 right-3 border-r-2 border-b-2",
        ].map((c, i) => (
          <div key={i} className={`absolute h-5 w-5 border-primary/60 ${c}`} />
        ))}

        {/* Top status bar */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-3 font-mono text-[10px] sm:text-xs tracking-widest text-primary/80">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          DRIVE_MODE.SANDBOX_v1
          <span className="text-muted-foreground">·</span>
          <span>NEON_GRID.LOCAL</span>
        </div>

        {/* Speedometer */}
        <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 pointer-events-none">
          <div className="rounded-xl border border-primary/40 bg-background/70 backdrop-blur-md px-4 py-3">
            <div className="font-mono text-[10px] tracking-widest text-primary/70 mb-1">
              VELOCITY
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-3xl sm:text-4xl font-bold text-primary tabular-nums">
                {Math.abs(speed).toString().padStart(3, "0")}
              </span>
              <span className="font-mono text-xs text-muted-foreground">km/h</span>
            </div>
            <div className="mt-2 h-1 w-32 sm:w-44 bg-muted/40 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary via-secondary to-accent transition-[width] duration-100"
                style={{ width: `${speedPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Controls hint + reset (desktop) */}
        <div className="hidden md:flex absolute bottom-6 right-6 flex-col items-end gap-2 pointer-events-auto">
          <button
            onClick={() => setResetSignal((r) => r + 1)}
            className="rounded-lg border border-primary/40 bg-background/70 backdrop-blur-md px-3 py-1.5 font-mono text-xs text-primary hover:bg-primary/10 transition-colors"
          >
            RESET POSITION
          </button>
          <div className="rounded-lg border border-border bg-background/70 backdrop-blur-md p-3 font-mono text-[10px] text-muted-foreground">
            <div className="grid grid-cols-3 gap-1 text-center mb-2">
              <div />
              <kbd className="rounded bg-muted/60 px-2 py-1 text-foreground">W</kbd>
              <div />
              <kbd className="rounded bg-muted/60 px-2 py-1 text-foreground">A</kbd>
              <kbd className="rounded bg-muted/60 px-2 py-1 text-foreground">S</kbd>
              <kbd className="rounded bg-muted/60 px-2 py-1 text-foreground">D</kbd>
            </div>
            <div className="text-center text-muted-foreground tracking-wider">
              SPACE = BRAKE
            </div>
          </div>
        </div>

        {/* Touch controls (mobile) */}
        {touch && (
          <>
            <div className="md:hidden absolute bottom-6 right-4 flex flex-col gap-2 pointer-events-auto">
              <button
                onTouchStart={() => setBtn("forward", true)}
                onTouchEnd={() => setBtn("forward", false)}
                onMouseDown={() => setBtn("forward", true)}
                onMouseUp={() => setBtn("forward", false)}
                className={`${pillBtn} h-14 w-14`}
              >
                ▲
              </button>
              <button
                onTouchStart={() => setBtn("back", true)}
                onTouchEnd={() => setBtn("back", false)}
                onMouseDown={() => setBtn("back", true)}
                onMouseUp={() => setBtn("back", false)}
                className={`${pillBtn} h-14 w-14`}
              >
                ▼
              </button>
            </div>
            <div className="md:hidden absolute bottom-6 left-4 flex gap-2 pointer-events-auto">
              <button
                onTouchStart={() => setBtn("left", true)}
                onTouchEnd={() => setBtn("left", false)}
                onMouseDown={() => setBtn("left", true)}
                onMouseUp={() => setBtn("left", false)}
                className={`${pillBtn} h-14 w-14`}
              >
                ◄
              </button>
              <button
                onTouchStart={() => setBtn("right", true)}
                onTouchEnd={() => setBtn("right", false)}
                onMouseDown={() => setBtn("right", true)}
                onMouseUp={() => setBtn("right", false)}
                className={`${pillBtn} h-14 w-14`}
              >
                ►
              </button>
            </div>
            <div className="md:hidden absolute top-16 right-4 pointer-events-auto">
              <button
                onClick={() => setResetSignal((r) => r + 1)}
                className={`${pillBtn} px-3 py-2`}
              >
                RESET
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
