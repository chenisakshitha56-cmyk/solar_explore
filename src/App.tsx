import { useState, useEffect, useRef, useCallback } from 'react';

interface PlanetData {
  name: string;
  diameter: number;
  distanceFromSun: number;
  orbitalPeriod: number;
  color: string;
  size: number;
  orbitRadius: number;
  description: string;
  funFact: string;
}

const planets: PlanetData[] = [
  {
    name: 'Mercury',
    diameter: 4879,
    distanceFromSun: 57.9,
    orbitalPeriod: 88,
    color: '#b5b5b5',
    size: 7,
    orbitRadius: 60,
    description: 'The smallest planet and closest to the Sun. Mercury has virtually no atmosphere and experiences extreme temperature swings from -180°C to 430°C.',
    funFact: 'A year on Mercury is just 88 Earth days!',
  },
  {
    name: 'Venus',
    diameter: 12104,
    distanceFromSun: 108.2,
    orbitalPeriod: 225,
    color: '#e8cda0',
    size: 13,
    orbitRadius: 95,
    description: 'Often called Earth\'s twin due to similar size. Venus has a thick toxic atmosphere of CO₂ and is the hottest planet at 465°C surface temperature.',
    funFact: 'Venus rotates backwards compared to most planets!',
  },
  {
    name: 'Earth',
    diameter: 12756,
    distanceFromSun: 149.6,
    orbitalPeriod: 365.25,
    color: '#4da6ff',
    size: 14,
    orbitRadius: 130,
    description: 'Our home planet and the only known world to harbor life. Earth has liquid water on its surface and a protective magnetic field.',
    funFact: 'Earth is the only planet not named after a god!',
  },
  {
    name: 'Mars',
    diameter: 6792,
    distanceFromSun: 227.9,
    orbitalPeriod: 687,
    color: '#e07050',
    size: 10,
    orbitRadius: 170,
    description: 'The Red Planet, named for its iron oxide surface. Mars has the largest volcano (Olympus Mons) and deepest canyon in the solar system.',
    funFact: 'Olympus Mons is 3x taller than Mount Everest!',
  },
  {
    name: 'Jupiter',
    diameter: 142984,
    distanceFromSun: 778.6,
    orbitalPeriod: 4331,
    color: '#d4a574',
    size: 30,
    orbitRadius: 225,
    description: 'The largest planet — more massive than all other planets combined. Its Great Red Spot is a centuries-old storm larger than Earth.',
    funFact: 'Jupiter has at least 95 known moons!',
  },
  {
    name: 'Saturn',
    diameter: 120536,
    distanceFromSun: 1433.5,
    orbitalPeriod: 10747,
    color: '#f0d68a',
    size: 26,
    orbitRadius: 285,
    description: 'Famous for its spectacular ring system made of billions of ice and rock particles. Saturn is less dense than water.',
    funFact: 'Saturn could float in a bathtub big enough!',
  },
  {
    name: 'Uranus',
    diameter: 51118,
    distanceFromSun: 2872.5,
    orbitalPeriod: 30589,
    color: '#7ec8e3',
    size: 19,
    orbitRadius: 340,
    description: 'An ice giant that rotates on its side with an axial tilt of 98°. Its blue-green color comes from methane in the atmosphere.',
    funFact: 'Uranus was the first planet found with a telescope!',
  },
  {
    name: 'Neptune',
    diameter: 49528,
    distanceFromSun: 4495.1,
    orbitalPeriod: 59800,
    color: '#4169e1',
    size: 18,
    orbitRadius: 390,
    description: 'The windiest planet with gusts up to 2,100 km/h. Neptune is the farthest planet from the Sun and takes 165 years to orbit it.',
    funFact: 'Neptune was predicted mathematically before it was seen!',
  },
];

export default function App() {
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetData | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [angles, setAngles] = useState<number[]>(
    planets.map((_, i) => (i * Math.PI * 2) / planets.length + Math.random() * 0.5)
  );
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);
  const animationRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  const animate = useCallback(
    (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const delta = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      if (isPlaying) {
        setAngles((prevAngles) =>
          prevAngles.map((angle, i) => {
            const baseSpeed = (2 * Math.PI) / (planets[i].orbitalPeriod * 1.5);
            return angle + baseSpeed * delta * speed * 0.01;
          })
        );
      }

      animationRef.current = requestAnimationFrame(animate);
    },
    [isPlaying, speed]
  );

  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [animate]);

  const centerX = 420;
  const centerY = 420;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#0d1025] to-[#050510] text-white overflow-hidden relative">
      {/* Stars background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 150 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 2 + 0.5 + 'px',
              height: Math.random() * 2 + 0.5 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              opacity: Math.random() * 0.6 + 0.2,
              animation: `twinkle ${Math.random() * 4 + 2}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 text-center pt-4 pb-2 px-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-yellow-200 via-amber-400 to-orange-500 bg-clip-text text-transparent drop-shadow-lg">
          ✦ Solar System Explorer ✦
        </h1>
        <p className="text-gray-400 text-xs sm:text-sm mt-1">
          Click any planet to explore • Use controls below to adjust simulation
        </p>
      </header>

      {/* Main content area */}
      <div className="relative flex flex-col lg:flex-row items-center justify-center px-2 sm:px-4 pb-24">
        {/* Solar System SVG */}
        <div className="relative w-full max-w-[840px] aspect-square">
          <svg
            viewBox="0 0 840 840"
            className="w-full h-full"
          >
            <defs>
              <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fff7a0" stopOpacity="1" />
                <stop offset="40%" stopColor="#ffcc00" stopOpacity="0.8" />
                <stop offset="70%" stopColor="#ff8800" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#ff4400" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="sunCore" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="40%" stopColor="#fff4a3" />
                <stop offset="100%" stopColor="#ffaa00" />
              </radialGradient>
              <filter id="sunBlur">
                <feGaussianBlur stdDeviation="3" />
              </filter>
              <filter id="planetGlow">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Orbit paths */}
            {planets.map((planet, i) => (
              <circle
                key={`orbit-${i}`}
                cx={centerX}
                cy={centerY}
                r={planet.orbitRadius}
                fill="none"
                stroke={
                  hoveredPlanet === planet.name || selectedPlanet?.name === planet.name
                    ? `${planet.color}44`
                    : 'rgba(255,255,255,0.07)'
                }
                strokeWidth={
                  hoveredPlanet === planet.name || selectedPlanet?.name === planet.name ? '1.5' : '0.8'
                }
                strokeDasharray="3 6"
                className="transition-all duration-300"
              />
            ))}

            {/* Sun outer glow */}
            <circle cx={centerX} cy={centerY} r="50" fill="url(#sunGlow)" filter="url(#sunBlur)" />
            {/* Sun core */}
            <circle cx={centerX} cy={centerY} r="28" fill="url(#sunCore)" />
            {/* Sun label */}
            <text
              x={centerX}
              y={centerY + 42}
              textAnchor="middle"
              fill="#ffcc00"
              fontSize="11"
              fontWeight="bold"
              fontFamily="sans-serif"
            >
              ☀ Sun
            </text>

            {/* Planets */}
            {planets.map((planet, i) => {
              const x = centerX + Math.cos(angles[i]) * planet.orbitRadius;
              const y = centerY + Math.sin(angles[i]) * planet.orbitRadius;
              const isHovered = hoveredPlanet === planet.name;
              const isSelected = selectedPlanet?.name === planet.name;
              const isActive = isHovered || isSelected;

              return (
                <g key={planet.name}>
                  {/* Selection/hover ring */}
                  {isActive && (
                    <circle
                      cx={x}
                      cy={y}
                      r={planet.size + 8}
                      fill="none"
                      stroke={planet.color}
                      strokeWidth="1.5"
                      opacity="0.7"
                      strokeDasharray="4 3"
                    >
                      <animateTransform
                        attributeName="transform"
                        type="rotate"
                        from={`0 ${x} ${y}`}
                        to={`360 ${x} ${y}`}
                        dur="4s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  )}

                  {/* Saturn's rings */}
                  {planet.name === 'Saturn' && (
                    <>
                      <ellipse
                        cx={x}
                        cy={y}
                        rx={planet.size + 14}
                        ry={5}
                        fill="none"
                        stroke="#f0d68a66"
                        strokeWidth="4"
                        transform={`rotate(-20, ${x}, ${y})`}
                      />
                      <ellipse
                        cx={x}
                        cy={y}
                        rx={planet.size + 10}
                        ry={3.5}
                        fill="none"
                        stroke="#f0d68a44"
                        strokeWidth="2"
                        transform={`rotate(-20, ${x}, ${y})`}
                      />
                    </>
                  )}

                  {/* Planet shadow/gradient effect */}
                  <circle
                    cx={x}
                    cy={y}
                    r={planet.size}
                    fill={planet.color}
                    opacity="0.3"
                    filter="url(#planetGlow)"
                  />

                  {/* Planet body */}
                  <circle
                    cx={x}
                    cy={y}
                    r={isActive ? planet.size + 2 : planet.size}
                    fill={planet.color}
                    className="cursor-pointer"
                    style={{ transition: 'r 0.2s ease' }}
                    onClick={() => setSelectedPlanet(isSelected ? null : planet)}
                    onMouseEnter={() => setHoveredPlanet(planet.name)}
                    onMouseLeave={() => setHoveredPlanet(null)}
                  />

                  {/* Planet highlight */}
                  <circle
                    cx={x - planet.size * 0.25}
                    cy={y - planet.size * 0.25}
                    r={planet.size * 0.35}
                    fill="rgba(255,255,255,0.25)"
                    className="pointer-events-none"
                  />

                  {/* Earth's moon */}
                  {planet.name === 'Earth' && (
                    <circle
                      cx={x + 18}
                      cy={y - 10}
                      r={3}
                      fill="#cccccc"
                      className="pointer-events-none"
                    />
                  )}

                  {/* Jupiter bands */}
                  {planet.name === 'Jupiter' && (
                    <>
                      <line
                        x1={x - planet.size * 0.7}
                        y1={y - 4}
                        x2={x + planet.size * 0.7}
                        y2={y - 4}
                        stroke="#c49060"
                        strokeWidth="2"
                        opacity="0.5"
                        className="pointer-events-none"
                      />
                      <line
                        x1={x - planet.size * 0.6}
                        y1={y + 5}
                        x2={x + planet.size * 0.6}
                        y2={y + 5}
                        stroke="#a06830"
                        strokeWidth="1.5"
                        opacity="0.4"
                        className="pointer-events-none"
                      />
                    </>
                  )}

                  {/* Planet label */}
                  <text
                    x={x}
                    y={y - planet.size - (isActive ? 14 : 10)}
                    textAnchor="middle"
                    fill={isActive ? '#ffffff' : '#999999'}
                    fontSize={isActive ? '12' : '10'}
                    fontWeight={isActive ? 'bold' : 'normal'}
                    fontFamily="sans-serif"
                    className="pointer-events-none select-none"
                  >
                    {planet.name}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Info Panel - positioned on the side on large screens */}
        <div className="lg:absolute lg:right-4 lg:top-16 w-full max-w-sm lg:max-w-xs z-20 px-4 lg:px-0">
          {selectedPlanet ? (
            <div className="bg-gray-900/95 backdrop-blur-lg border border-gray-600/50 rounded-2xl p-5 shadow-2xl shadow-black/50 animate-fadeIn">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex-shrink-0"
                    style={{
                      background: `radial-gradient(circle at 30% 30%, ${selectedPlanet.color}ee, ${selectedPlanet.color}88)`,
                      boxShadow: `0 0 20px ${selectedPlanet.color}44`,
                    }}
                  />
                  <h2 className="text-xl font-bold text-white">{selectedPlanet.name}</h2>
                </div>
                <button
                  onClick={() => setSelectedPlanet(null)}
                  className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-all text-sm"
                >
                  ✕
                </button>
              </div>

              <p className="text-gray-300 text-sm mb-3 leading-relaxed">
                {selectedPlanet.description}
              </p>

              <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-800/30 rounded-lg px-3 py-2 mb-3">
                <p className="text-xs text-blue-300">
                  💡 <span className="font-medium">Fun Fact:</span> {selectedPlanet.funFact}
                </p>
              </div>

              <div className="space-y-2">
                <InfoRow label="Diameter" value={`${selectedPlanet.diameter.toLocaleString()} km`} />
                <InfoRow label="Distance from Sun" value={`${selectedPlanet.distanceFromSun.toLocaleString()} M km`} />
                <InfoRow label="Orbital Period" value={`${selectedPlanet.orbitalPeriod.toLocaleString()} days`} />
                <InfoRow
                  label="In Earth Years"
                  value={`${(selectedPlanet.orbitalPeriod / 365.25).toFixed(2)} years`}
                />
              </div>
            </div>
          ) : (
            <div className="bg-gray-900/80 backdrop-blur-lg border border-gray-700/40 rounded-2xl p-4 shadow-xl">
              <h3 className="text-base font-semibold text-gray-200 mb-2 flex items-center gap-2">
                <span>🪐</span> Planets
              </h3>
              <div className="grid grid-cols-2 gap-1.5">
                {planets.map((p) => (
                  <button
                    key={p.name}
                    onClick={() => setSelectedPlanet(p)}
                    className="flex items-center gap-2 text-left text-xs text-gray-300 hover:text-white bg-gray-800/50 hover:bg-gray-700/60 rounded-lg px-2.5 py-2 transition-all border border-transparent hover:border-gray-600/50"
                  >
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: p.color, boxShadow: `0 0 4px ${p.color}66` }}
                    />
                    <span className="truncate">{p.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Controls Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-gray-950/95 backdrop-blur-lg border-t border-gray-700/40">
        <div className="max-w-3xl mx-auto px-3 sm:px-6 py-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Play/Pause + Speed */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-all shadow-lg ${
                  isPlaying
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-500/20'
                    : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-500/20'
                }`}
              >
                {isPlaying ? (
                  <>
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <rect x="6" y="4" width="4" height="16" rx="1" />
                      <rect x="14" y="4" width="4" height="16" rx="1" />
                    </svg>
                    Pause
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <polygon points="6,3 20,12 6,21" />
                    </svg>
                    Play
                  </>
                )}
              </button>

              {/* Status */}
              <div className="flex items-center gap-1.5">
                <div
                  className={`w-2 h-2 rounded-full ${
                    isPlaying ? 'bg-green-400 animate-pulse' : 'bg-amber-400'
                  }`}
                />
                <span className="text-gray-500 text-xs hidden sm:inline">
                  {isPlaying ? 'Running' : 'Paused'}
                </span>
              </div>
            </div>

            {/* Speed Controls */}
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-xs font-medium">Speed:</span>
              <div className="flex items-center gap-0.5 bg-gray-800/80 rounded-lg p-0.5">
                {[0.25, 0.5, 1, 2, 5, 10].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSpeed(s)}
                    className={`px-2 py-1 rounded-md text-xs font-medium transition-all ${
                      speed === s
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                        : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                    }`}
                  >
                    {s}×
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center bg-gray-800/40 rounded-lg px-3 py-2 border border-gray-700/30">
      <span className="text-gray-400 text-xs">{label}</span>
      <span className="text-white text-sm font-semibold">{value}</span>
    </div>
  );
}
