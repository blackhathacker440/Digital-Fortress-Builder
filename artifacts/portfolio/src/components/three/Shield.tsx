import { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Icosahedron, Torus, Sparkles, Stars } from "@react-three/drei";
import * as THREE from "three";

function ShieldMesh() {
  const groupRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const ring1 = useRef<THREE.Mesh>(null);
  const ring2 = useRef<THREE.Mesh>(null);
  const ring3 = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      const mx = state.mouse.x;
      const my = state.mouse.y;
      groupRef.current.rotation.y = t * 0.25 + mx * 0.6;
      groupRef.current.rotation.x = my * 0.4 + Math.sin(t * 0.3) * 0.1;
    }
    if (innerRef.current) {
      innerRef.current.rotation.y = -t * 0.6;
      innerRef.current.rotation.x = t * 0.4;
    }
    if (ring1.current) ring1.current.rotation.x = t * 0.7;
    if (ring2.current) ring2.current.rotation.y = t * 0.9;
    if (ring3.current) {
      ring3.current.rotation.z = t * 0.5;
      ring3.current.rotation.x = t * 0.3;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Outer wireframe shell */}
      <Icosahedron args={[2.4, 1]}>
        <meshBasicMaterial
          color="#22d3ee"
          wireframe
          transparent
          opacity={0.45}
        />
      </Icosahedron>

      {/* Inner solid icosahedron with emissive */}
      <Icosahedron ref={innerRef} args={[1.55, 0]}>
        <meshStandardMaterial
          color="#0a0e1a"
          emissive="#a855f7"
          emissiveIntensity={1.2}
          metalness={0.9}
          roughness={0.2}
          flatShading
        />
      </Icosahedron>

      {/* Orbital rings */}
      <Torus ref={ring1} args={[2.9, 0.018, 16, 100]}>
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.7} />
      </Torus>
      <Torus ref={ring2} args={[3.2, 0.012, 16, 100]}>
        <meshBasicMaterial color="#a855f7" transparent opacity={0.6} />
      </Torus>
      <Torus ref={ring3} args={[3.5, 0.01, 16, 100]}>
        <meshBasicMaterial color="#ec4899" transparent opacity={0.5} />
      </Torus>

      {/* Glowing core */}
      <mesh>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.9} />
      </mesh>

      {/* Halo glow sprite */}
      <mesh>
        <sphereGeometry args={[0.55, 32, 32]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.18} />
      </mesh>

      <Sparkles count={60} scale={6} size={2.5} speed={0.4} color="#22d3ee" />
    </group>
  );
}

export function Shield3D() {
  return (
    <Canvas
      dpr={[1, 1.6]}
      camera={{ position: [0, 0, 7.5], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
    >
      <color attach="background" args={["#000000"]} />
      <fog attach="fog" args={["#05060d", 8, 18]} />

      <ambientLight intensity={0.25} />
      <pointLight position={[5, 5, 5]} intensity={2} color="#22d3ee" />
      <pointLight position={[-5, -3, 2]} intensity={1.8} color="#a855f7" />
      <pointLight position={[0, -5, -3]} intensity={1.2} color="#ec4899" />

      <Suspense fallback={null}>
        <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.6}>
          <ShieldMesh />
        </Float>
        <Stars radius={50} depth={30} count={800} factor={2} fade speed={0.5} />
      </Suspense>
    </Canvas>
  );
}
