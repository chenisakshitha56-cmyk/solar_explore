import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Html, Ring } from '@react-three/drei';
import * as THREE from 'three';
import { planets, PlanetData } from '../data';

interface SolarSystem3DProps {
  selectedPlanet: PlanetData | null;
  onSelectPlanet: (planet: PlanetData | null) => void;
  isPlaying: boolean;
  speed: number;
  timeOffset: number;
  focusPlanet: string | null;
  showOrbits: boolean;
  showLabels: boolean;
  showAsteroidBelt: boolean;
  kidMode: boolean;
  cameraDistance: number;
}

function Sun() {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
    }
    if (glowRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
      glowRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group>
      {/* Sun glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[3.5, 32, 32]} />
        <meshBasicMaterial color="#ffaa00" transparent opacity={0.15} />
      </mesh>
      <mesh>
        <sphereGeometry args={[3, 32, 32]} />
        <meshBasicMaterial color="#ff8800" transparent opacity={0.2} />
      </mesh>
      {/* Sun core */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[2.5, 64, 64]} />
        <meshStandardMaterial
          color="#ffcc00"
          emissive="#ff8800"
          emissiveIntensity={2}
          toneMapped={false}
        />
      </mesh>
      {/* Sun light */}
      <pointLight color="#ffffff" intensity={3} distance={200} decay={0.5} />
      <pointLight color="#ffaa44" intensity={1.5} distance={100} decay={1} />
    </group>
  );
}

function Planet({
  planet,
  angle,
  isSelected,
  isHovered,
  onSelect,
  onHover,
  showLabel,
  kidMode,
}: {
  planet: PlanetData;
  angle: number;
  isSelected: boolean;
  isHovered: boolean;
  onSelect: () => void;
  onHover: (hovered: boolean) => void;
  showLabel: boolean;
  kidMode: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const x = Math.cos(angle) * planet.orbitRadius3D;
  const z = Math.sin(angle) * planet.orbitRadius3D;

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += planet.rotationPeriod > 0 ? 0.01 : -0.01;
    }
  });

  const planetColor = useMemo(() => new THREE.Color(planet.color), [planet.color]);

  return (
    <group position={[x, 0, z]}>
      {/* Planet selection ring */}
      {(isSelected || isHovered) && (
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[planet.size3D + 0.3, planet.size3D + 0.5, 32]} />
          <meshBasicMaterial color={planet.color} transparent opacity={0.6} side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Saturn's rings */}
      {planet.hasRings && (
        <group rotation={[0.4, 0, 0.1]}>
          <Ring args={[planet.size3D + 0.8, planet.size3D + 2.5, 64]}>
            <meshStandardMaterial
              color="#f0d68a"
              transparent
              opacity={0.6}
              side={THREE.DoubleSide}
            />
          </Ring>
          <Ring args={[planet.size3D + 0.4, planet.size3D + 0.7, 64]}>
            <meshStandardMaterial
              color="#d4b86a"
              transparent
              opacity={0.4}
              side={THREE.DoubleSide}
            />
          </Ring>
        </group>
      )}

      {/* Planet body */}
      <mesh
        ref={meshRef}
        onClick={(e) => { e.stopPropagation(); onSelect(); }}
        onPointerEnter={(e) => { e.stopPropagation(); onHover(true); }}
        onPointerLeave={(e) => { e.stopPropagation(); onHover(false); }}
        scale={isHovered ? 1.15 : 1}
      >
        <sphereGeometry args={[planet.size3D, 32, 32]} />
        <meshStandardMaterial
          color={planetColor}
          roughness={0.7}
          metalness={0.1}
          emissive={planetColor}
          emissiveIntensity={isSelected ? 0.3 : 0.05}
        />
      </mesh>

      {/* Earth's moon */}
      {planet.id === 'earth' && (
        <mesh position={[1.5, 0.5, 0.5]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial color="#cccccc" roughness={0.9} />
        </mesh>
      )}

      {/* Jupiter's bands effect */}
      {planet.id === 'jupiter' && (
        <mesh>
          <sphereGeometry args={[planet.size3D + 0.01, 32, 32]} />
          <meshStandardMaterial
            color="#c49060"
            transparent
            opacity={0.3}
            wireframe
          />
        </mesh>
      )}

      {/* Label */}
      {showLabel && (
        <Html
          position={[0, planet.size3D + 1, 0]}
          center
          style={{ pointerEvents: 'none' }}
        >
          <div
            className={`whitespace-nowrap px-2 py-0.5 rounded text-xs font-medium ${
              kidMode ? 'text-base bg-white/90 text-gray-800' : 'bg-black/70 text-white'
            } ${isSelected ? 'ring-1 ring-white/50' : ''}`}
          >
            {kidMode ? getEmoji(planet.id) + ' ' : ''}{planet.name}
          </div>
        </Html>
      )}
    </group>
  );
}

function getEmoji(id: string): string {
  const emojis: Record<string, string> = {
    mercury: '⚫', venus: '🟡', earth: '🌍', mars: '🔴',
    jupiter: '🟤', saturn: '🪐', uranus: '🔵', neptune: '💙', pluto: '⚪',
  };
  return emojis[id] || '🪐';
}

function OrbitPath({ radius, color, isHighlighted }: { radius: number; color: string; isHighlighted: boolean }) {
  const lineObj = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 128; i++) {
      const angle = (i / 128) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
    }
    const geometry = new THREE.BufferGeometry().setFromPoints(pts);
    const material = new THREE.LineBasicMaterial({
      color: isHighlighted ? color : '#ffffff',
      transparent: true,
      opacity: isHighlighted ? 0.4 : 0.1,
    });
    return new THREE.Line(geometry, material);
  }, [radius, color, isHighlighted]);

  return <primitive object={lineObj} />;
}

function AsteroidBelt({ show }: { show: boolean }) {
  const asteroidsRef = useRef<THREE.Points>(null);
  
  const positions = useMemo(() => {
    const pos = new Float32Array(3000 * 3);
    for (let i = 0; i < 3000; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 26 + Math.random() * 4;
      const y = (Math.random() - 0.5) * 1.5;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = Math.sin(angle) * radius;
    }
    return pos;
  }, []);

  useFrame(() => {
    if (asteroidsRef.current) {
      asteroidsRef.current.rotation.y += 0.0003;
    }
  });

  if (!show) return null;

  return (
    <points ref={asteroidsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={3000}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial color="#888888" size={0.08} transparent opacity={0.6} />
    </points>
  );
}

function CameraController({ focusPlanet, cameraDistance }: { focusPlanet: string | null; cameraDistance: number }) {
  const { camera } = useThree();
  const targetRef = useRef(new THREE.Vector3(0, 0, 0));

  useFrame(() => {
    if (focusPlanet) {
      const planet = planets.find(p => p.id === focusPlanet);
      if (planet) {
        // Camera will be controlled by OrbitControls, we just set the target
        targetRef.current.set(0, 0, 0);
      }
    }
  });

  return null;
}

function Scene({
  selectedPlanet,
  onSelectPlanet,
  isPlaying,
  speed,
  timeOffset,
  showOrbits,
  showLabels,
  showAsteroidBelt,
  kidMode,
  focusPlanet,
  cameraDistance,
}: SolarSystem3DProps) {
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);
  const anglesRef = useRef<number[]>(planets.map((_, i) => (i * Math.PI * 2) / planets.length));
  const [angles, setAngles] = useState<number[]>(anglesRef.current);
  const controlsRef = useRef<any>(null);

  useFrame((state, delta) => {
    if (isPlaying) {
      anglesRef.current = anglesRef.current.map((angle, i) => {
        const baseSpeed = (2 * Math.PI) / (planets[i].orbitalPeriod * 0.5);
        return angle + baseSpeed * delta * speed * 10 + timeOffset * 0.001;
      });
      setAngles([...anglesRef.current]);
    }

    // Focus camera on selected planet
    if (focusPlanet && controlsRef.current) {
      const planet = planets.find(p => p.id === focusPlanet);
      if (planet) {
        const idx = planets.indexOf(planet);
        const x = Math.cos(anglesRef.current[idx]) * planet.orbitRadius3D;
        const z = Math.sin(anglesRef.current[idx]) * planet.orbitRadius3D;
        controlsRef.current.target.lerp(new THREE.Vector3(x, 0, z), 0.05);
      }
    }
  });

  return (
    <>
      <ambientLight intensity={0.08} />
      <Stars radius={200} depth={100} count={8000} factor={4} saturation={0} fade speed={0.5} />
      
      <Sun />

      {/* Orbit paths */}
      {showOrbits && planets.map((planet) => (
        <OrbitPath
          key={`orbit-${planet.id}`}
          radius={planet.orbitRadius3D}
          color={planet.color}
          isHighlighted={selectedPlanet?.id === planet.id || hoveredPlanet === planet.id}
        />
      ))}

      {/* Asteroid belt */}
      <AsteroidBelt show={showAsteroidBelt} />

      {/* Planets */}
      {planets.map((planet, i) => (
        <Planet
          key={planet.id}
          planet={planet}
          angle={angles[i]}
          isSelected={selectedPlanet?.id === planet.id}
          isHovered={hoveredPlanet === planet.id}
          onSelect={() => onSelectPlanet(selectedPlanet?.id === planet.id ? null : planet)}
          onHover={(h) => setHoveredPlanet(h ? planet.id : null)}
          showLabel={showLabels}
          kidMode={kidMode}
        />
      ))}

      <OrbitControls
        ref={controlsRef}
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={150}
        autoRotate={!focusPlanet}
        autoRotateSpeed={0.2}
        makeDefault
      />
      <CameraController focusPlanet={focusPlanet} cameraDistance={cameraDistance} />
    </>
  );
}

export default function SolarSystem3D(props: SolarSystem3DProps) {
  return (
    <Canvas
      camera={{ position: [0, 40, 60], fov: 60, near: 0.1, far: 500 }}
      style={{ background: 'transparent' }}
      gl={{ antialias: true, alpha: true }}
    >
      <Scene {...props} />
    </Canvas>
  );
}
