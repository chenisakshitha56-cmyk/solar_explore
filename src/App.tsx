import { useState, Suspense } from 'react';
import SolarSystem3D from './components/SolarSystem3D';
import UIPanels from './components/UIPanels';
import ControlsBar from './components/ControlsBar';
import { PlanetData, translations, planets } from './data';

type Language = 'en' | 'zh' | 'es' | 'ja';

export default function App() {
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetData | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [timeOffset, setTimeOffset] = useState(0);
  const [focusPlanet, setFocusPlanet] = useState<string | null>(null);
  const [showOrbits, setShowOrbits] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [showAsteroidBelt, setShowAsteroidBelt] = useState(true);
  const [kidMode, setKidMode] = useState(false);
  const [language, setLanguage] = useState<Language>('en');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [cameraDistance, setCameraDistance] = useState(60);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showTimeTravel, setShowTimeTravel] = useState(false);
  const [showPanel, setShowPanel] = useState(true);

  const t = (key: string) => translations[language]?.[key] || translations.en[key] || key;

  const bgMain = theme === 'dark'
    ? 'bg-gradient-to-b from-[#0a0a1a] via-[#0d1025] to-[#050510]'
    : 'bg-gradient-to-b from-[#e8eaf6] via-[#c5cae9] to-[#9fa8da]';

  return (
    <div className={`h-screen w-screen overflow-hidden ${bgMain} relative`}>
      {/* 3D Scene */}
      <div className={`absolute inset-0 transition-all duration-300 ${showPanel ? 'sm:right-[384px]' : ''}`}>
        <Suspense fallback={
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Loading Solar System...</p>
            </div>
          </div>
        }>
          <SolarSystem3D
            selectedPlanet={selectedPlanet}
            onSelectPlanet={setSelectedPlanet}
            isPlaying={isPlaying}
            speed={speed}
            timeOffset={timeOffset}
            focusPlanet={focusPlanet}
            showOrbits={showOrbits}
            showLabels={showLabels}
            showAsteroidBelt={showAsteroidBelt}
            kidMode={kidMode}
            cameraDistance={cameraDistance}
          />
        </Suspense>
      </div>

      {/* Header overlay */}
      <div className="absolute top-0 left-0 right-0 z-10 pointer-events-none">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="pointer-events-auto">
            <h1 className={`text-xl sm:text-2xl font-bold ${
              theme === 'dark'
                ? 'bg-gradient-to-r from-yellow-200 via-amber-400 to-orange-500 bg-clip-text text-transparent'
                : 'bg-gradient-to-r from-indigo-700 via-purple-700 to-blue-700 bg-clip-text text-transparent'
            }`}>
              {kidMode ? '🚀 ' : '✦ '}{t('title')}{kidMode ? ' 🌟' : ' ✦'}
            </h1>
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
              {t('subtitle')}
            </p>
          </div>

          {/* Panel toggle */}
          <button
            onClick={() => setShowPanel(!showPanel)}
            className={`pointer-events-auto px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              theme === 'dark'
                ? 'bg-gray-800/80 hover:bg-gray-700 text-gray-300'
                : 'bg-white/80 hover:bg-white text-gray-700 shadow-sm'
            }`}
          >
            {showPanel ? '→' : '☰'}
          </button>
        </div>
      </div>

      {/* Quick planet selector (left side) */}
      <div className="absolute left-3 top-16 z-10 hidden lg:flex flex-col gap-1.5">
        {['mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'].map((id) => {
          const planet = planets.find((p) => p.id === id);
          if (!planet) return null;
          const isSelected = selectedPlanet?.id === id;
          return (
            <button
              key={id}
              onClick={() => {
                setSelectedPlanet(isSelected ? null : planet);
                if (!isSelected) setFocusPlanet(id);
              }}
              className={`group flex items-center gap-2 px-2 py-1.5 rounded-lg transition-all ${
                isSelected
                  ? 'bg-blue-600/30 ring-1 ring-blue-500/50'
                  : theme === 'dark'
                  ? 'bg-gray-800/60 hover:bg-gray-700/80'
                  : 'bg-white/60 hover:bg-white/80 shadow-sm'
              }`}
              title={planet.name}
            >
              <div
                className="w-4 h-4 rounded-full flex-shrink-0 transition-transform group-hover:scale-125"
                style={{
                  backgroundColor: planet.color,
                  boxShadow: isSelected ? `0 0 8px ${planet.color}` : 'none',
                }}
              />
              <span className={`text-xs font-medium hidden xl:inline ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {kidMode ? getEmoji(id) + ' ' : ''}{planet.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Side Panel */}
      {showPanel && (
        <UIPanels
          selectedPlanet={selectedPlanet}
          onSelectPlanet={setSelectedPlanet}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          speed={speed}
          setSpeed={setSpeed}
          timeOffset={timeOffset}
          setTimeOffset={setTimeOffset}
          focusPlanet={focusPlanet}
          setFocusPlanet={setFocusPlanet}
          showOrbits={showOrbits}
          setShowOrbits={setShowOrbits}
          showLabels={showLabels}
          setShowLabels={setShowLabels}
          showAsteroidBelt={showAsteroidBelt}
          setShowAsteroidBelt={setShowAsteroidBelt}
          kidMode={kidMode}
          setKidMode={setKidMode}
          language={language}
          setLanguage={setLanguage}
          theme={theme}
          setTheme={setTheme}
          cameraDistance={cameraDistance}
          setCameraDistance={setCameraDistance}
          favorites={favorites}
          setFavorites={setFavorites}
        />
      )}

      {/* Bottom Controls */}
      <ControlsBar
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        speed={speed}
        setSpeed={setSpeed}
        timeOffset={timeOffset}
        setTimeOffset={setTimeOffset}
        cameraDistance={cameraDistance}
        setCameraDistance={setCameraDistance}
        language={language}
        theme={theme}
        showTimeTravel={showTimeTravel}
        setShowTimeTravel={setShowTimeTravel}
      />
    </div>
  );
}

function getEmoji(id: string): string {
  const emojis: Record<string, string> = {
    mercury: '⚫', venus: '🟡', earth: '🌍', mars: '🔴',
    jupiter: '🟤', saturn: '🪐', uranus: '🔵', neptune: '💙', pluto: '⚪',
  };
  return emojis[id] || '🪐';
}
