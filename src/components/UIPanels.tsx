import { useState, useEffect, useCallback } from 'react';
import { planets, translations, quizQuestions, astronomicalEvents, cometData, PlanetData } from '../data';

type Tab = 'info' | 'quiz' | 'compare' | 'realtime' | 'settings';
type Language = 'en' | 'zh' | 'es' | 'ja';

interface UIPanelsProps {
  selectedPlanet: PlanetData | null;
  onSelectPlanet: (planet: PlanetData | null) => void;
  isPlaying: boolean;
  setIsPlaying: (v: boolean) => void;
  speed: number;
  setSpeed: (v: number) => void;
  timeOffset: number;
  setTimeOffset: (v: number) => void;
  focusPlanet: string | null;
  setFocusPlanet: (v: string | null) => void;
  showOrbits: boolean;
  setShowOrbits: (v: boolean) => void;
  showLabels: boolean;
  setShowLabels: (v: boolean) => void;
  showAsteroidBelt: boolean;
  setShowAsteroidBelt: (v: boolean) => void;
  kidMode: boolean;
  setKidMode: (v: boolean) => void;
  language: Language;
  setLanguage: (v: Language) => void;
  theme: 'dark' | 'light';
  setTheme: (v: 'dark' | 'light') => void;
  cameraDistance: number;
  setCameraDistance: (v: number) => void;
  favorites: string[];
  setFavorites: (v: string[]) => void;
}

export default function UIPanels(props: UIPanelsProps) {
  const {
    selectedPlanet, onSelectPlanet, isPlaying, setIsPlaying, speed, setSpeed,
    timeOffset, setTimeOffset, focusPlanet, setFocusPlanet,
    showOrbits, setShowOrbits, showLabels, setShowLabels, showAsteroidBelt, setShowAsteroidBelt,
    kidMode, setKidMode, language, setLanguage, theme, setTheme,
    cameraDistance, setCameraDistance, favorites, setFavorites,
  } = props;

  const [activeTab, setActiveTab] = useState<Tab>('info');
  const [comparePlanet, setComparePlanet] = useState<string>('earth');
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [moonPhase] = useState(() => {
    const phases = ['🌑 New Moon', '🌒 Waxing Crescent', '🌓 First Quarter', '🌔 Waxing Gibbous', '🌕 Full Moon', '🌖 Waning Gibbous', '🌗 Last Quarter', '🌘 Waning Crescent'];
    const day = new Date().getDate() % 30;
    return phases[Math.floor((day / 30) * 8)];
  });

  const t = useCallback((key: string) => translations[language]?.[key] || translations.en[key] || key, [language]);
  const questions = quizQuestions[language] || quizQuestions.en;

  const toggleFavorite = (id: string) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(f => f !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  const handleQuizAnswer = (idx: number) => {
    if (quizAnswer !== null) return;
    setQuizAnswer(idx);
    if (idx === questions[quizIndex].correct) {
      setQuizScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    if (quizIndex + 1 >= questions.length) {
      setQuizFinished(true);
    } else {
      setQuizIndex(i => i + 1);
      setQuizAnswer(null);
    }
  };

  const resetQuiz = () => {
    setQuizIndex(0);
    setQuizAnswer(null);
    setQuizScore(0);
    setQuizFinished(false);
  };

  const bgClass = theme === 'dark' ? 'bg-gray-900/95' : 'bg-white/95';
  const textClass = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const borderClass = theme === 'dark' ? 'border-gray-700/50' : 'border-gray-200';
  const subtextClass = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const cardBg = theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-100';

  return (
    <div className={`absolute top-0 right-0 h-full w-full sm:w-96 ${bgClass} backdrop-blur-xl sm:border-l ${borderClass} overflow-y-auto z-20 transition-all shadow-2xl`}>
      {/* Tabs */}
      <div className={`sticky top-0 ${bgClass} backdrop-blur-xl border-b ${borderClass} z-30`}>
        <div className="flex overflow-x-auto">
          {(['info', 'quiz', 'compare', 'realtime', 'settings'] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 min-w-[60px] px-2 py-3 text-xs font-medium transition-all whitespace-nowrap ${
                activeTab === tab
                  ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-500/10'
                  : `${subtextClass} hover:text-white`
              }`}
            >
              {tab === 'info' && '🪐'}
              {tab === 'quiz' && '🧠'}
              {tab === 'compare' && '⚖️'}
              {tab === 'realtime' && '📡'}
              {tab === 'settings' && '⚙️'}
              <span className="hidden sm:inline ml-1">{t(tab)}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* INFO TAB */}
        {activeTab === 'info' && (
          <>
            {selectedPlanet ? (
              <div className="space-y-4 animate-fadeIn">
                {/* Planet header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-full shadow-lg"
                      style={{
                        background: `radial-gradient(circle at 30% 30%, ${selectedPlanet.color}ee, ${selectedPlanet.color}66)`,
                        boxShadow: `0 0 20px ${selectedPlanet.color}44`,
                      }}
                    />
                    <div>
                      <h2 className={`text-xl font-bold ${textClass}`}>{selectedPlanet.name}</h2>
                      <span className={`text-xs ${subtextClass} capitalize`}>
                        {selectedPlanet.type === 'dwarf' ? t('dwarfPlanets') : t('planets')}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => toggleFavorite(selectedPlanet.id)}
                      className={`p-2 rounded-lg transition-all ${favorites.includes(selectedPlanet.id) ? 'text-yellow-400 bg-yellow-400/10' : `${subtextClass} hover:text-yellow-400`}`}
                    >
                      {favorites.includes(selectedPlanet.id) ? '★' : '☆'}
                    </button>
                    <button
                      onClick={() => setFocusPlanet(focusPlanet === selectedPlanet.id ? null : selectedPlanet.id)}
                      className={`p-2 rounded-lg transition-all ${focusPlanet === selectedPlanet.id ? 'text-blue-400 bg-blue-400/10' : `${subtextClass} hover:text-blue-400`}`}
                    >
                      🎯
                    </button>
                    <button
                      onClick={() => onSelectPlanet(null)}
                      className={`p-2 rounded-lg ${subtextClass} hover:text-red-400 transition-all`}
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {/* Description */}
                <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  {selectedPlanet.description[language] || selectedPlanet.description.en}
                </p>

                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-2">
                  <StatCard label={t('diameter')} value={`${selectedPlanet.diameter.toLocaleString()} ${t('km')}`} theme={theme} />
                  <StatCard label={t('distance')} value={`${selectedPlanet.distanceFromSun.toLocaleString()} ${t('million')}`} theme={theme} />
                  <StatCard label={t('orbitalPeriod')} value={`${selectedPlanet.orbitalPeriod.toLocaleString()} ${t('days')}`} theme={theme} />
                  <StatCard label={t('rotation')} value={`${Math.abs(selectedPlanet.rotationPeriod)} ${t('days')}${selectedPlanet.rotationPeriod < 0 ? ' ↺' : ''}`} theme={theme} />
                  <StatCard label={t('temperature')} value={`${selectedPlanet.temperature.min}°C to ${selectedPlanet.temperature.max}°C`} theme={theme} />
                  <StatCard label={t('moons')} value={selectedPlanet.moons.toString()} theme={theme} />
                  <StatCard label={t('gravity')} value={`${selectedPlanet.gravity} m/s²`} theme={theme} />
                  <StatCard label={t('magneticField')} value={selectedPlanet.magneticField ? `✓ ${t('yes')}` : `✗ ${t('no')}`} theme={theme} />
                </div>

                {/* Atmosphere */}
                <div className={`${cardBg} rounded-xl p-3`}>
                  <h4 className={`text-xs font-semibold ${subtextClass} mb-1`}>{t('atmosphere')}</h4>
                  <p className={`text-sm ${textClass}`}>{selectedPlanet.atmosphere}</p>
                </div>

                {/* Composition */}
                <div className={`${cardBg} rounded-xl p-3`}>
                  <h4 className={`text-xs font-semibold ${subtextClass} mb-1`}>{t('composition')}</h4>
                  <p className={`text-sm ${textClass}`}>{selectedPlanet.composition}</p>
                </div>

                {/* Fun Facts */}
                <div className={`${cardBg} rounded-xl p-3`}>
                  <h4 className={`text-xs font-semibold ${subtextClass} mb-2`}>💡 {t('funFacts')}</h4>
                  <ul className="space-y-1.5">
                    {(selectedPlanet.funFacts[language] || selectedPlanet.funFacts.en).map((fact, i) => (
                      <li key={i} className={`text-sm ${textClass} flex items-start gap-2`}>
                        <span className="text-yellow-400 mt-0.5">•</span>
                        {fact}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Discovery info */}
                {selectedPlanet.discoveredBy && (
                  <div className={`${cardBg} rounded-xl p-3`}>
                    <p className={`text-sm ${textClass}`}>
                      🔭 Discovered by <strong>{selectedPlanet.discoveredBy}</strong> in {selectedPlanet.discoveryYear}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <p className={`${subtextClass} text-sm text-center py-4`}>{t('clickPlanet')}</p>
                <div className="grid grid-cols-2 gap-2">
                  {planets.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => onSelectPlanet(p)}
                      className={`flex items-center gap-2 p-3 rounded-xl transition-all border ${borderClass} ${cardBg} hover:scale-[1.02] hover:border-blue-500/50`}
                    >
                      <div
                        className="w-6 h-6 rounded-full flex-shrink-0"
                        style={{ backgroundColor: p.color, boxShadow: `0 0 6px ${p.color}44` }}
                      />
                      <span className={`text-sm font-medium ${textClass} truncate`}>{p.name}</span>
                      {favorites.includes(p.id) && <span className="text-yellow-400 text-xs ml-auto">★</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* QUIZ TAB */}
        {activeTab === 'quiz' && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className={`text-lg font-bold ${textClass}`}>🧠 {t('quiz')}</h3>
            
            {quizFinished ? (
              <div className="text-center py-8 space-y-4">
                <div className="text-5xl">
                  {quizScore >= questions.length * 0.8 ? '🏆' : quizScore >= questions.length * 0.5 ? '👍' : '📚'}
                </div>
                <h4 className={`text-xl font-bold ${textClass}`}>
                  {t('score')}: {quizScore}/{questions.length}
                </h4>
                <p className={subtextClass}>
                  {quizScore >= questions.length * 0.8 ? 'Excellent! You\'re a space expert!' :
                   quizScore >= questions.length * 0.5 ? 'Good job! Keep learning!' :
                   'Keep studying, you\'ll get better!'}
                </p>
                <button
                  onClick={resetQuiz}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-medium transition-all"
                >
                  {t('next')} →
                </button>
              </div>
            ) : (
              <>
                {/* Progress */}
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${subtextClass}`}>
                    {quizIndex + 1} / {questions.length}
                  </span>
                  <span className={`text-sm font-medium ${textClass}`}>
                    {t('score')}: {quizScore}
                  </span>
                </div>
                <div className={`h-1.5 rounded-full ${cardBg} overflow-hidden`}>
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                    style={{ width: `${((quizIndex + 1) / questions.length) * 100}%` }}
                  />
                </div>

                {/* Question */}
                <div className={`${cardBg} rounded-xl p-4`}>
                  <p className={`text-base font-medium ${textClass} mb-4`}>
                    {questions[quizIndex].question}
                  </p>
                  <div className="space-y-2">
                    {questions[quizIndex].options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => handleQuizAnswer(i)}
                        disabled={quizAnswer !== null}
                        className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-all border ${
                          quizAnswer === null
                            ? `${borderClass} ${cardBg} hover:border-blue-500/50 hover:bg-blue-500/10 ${textClass}`
                            : i === questions[quizIndex].correct
                            ? 'border-green-500 bg-green-500/20 text-green-300'
                            : quizAnswer === i
                            ? 'border-red-500 bg-red-500/20 text-red-300'
                            : `${borderClass} ${cardBg} ${subtextClass} opacity-50`
                        }`}
                      >
                        <span className="font-medium mr-2">{String.fromCharCode(65 + i)}.</span>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Explanation */}
                {quizAnswer !== null && (
                  <div className={`rounded-xl p-4 border ${quizAnswer === questions[quizIndex].correct ? 'border-green-500/50 bg-green-500/10' : 'border-red-500/50 bg-red-500/10'} animate-fadeIn`}>
                    <p className={`text-sm font-medium mb-1 ${quizAnswer === questions[quizIndex].correct ? 'text-green-400' : 'text-red-400'}`}>
                      {quizAnswer === questions[quizIndex].correct ? `✓ ${t('correct')}` : `✗ ${t('wrong')}`}
                    </p>
                    <p className={`text-sm ${subtextClass}`}>{questions[quizIndex].explanation}</p>
                    <button
                      onClick={nextQuestion}
                      className="mt-3 px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-all"
                    >
                      {t('next')} →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* COMPARE TAB */}
        {activeTab === 'compare' && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className={`text-lg font-bold ${textClass}`}>⚖️ {t('compare')}</h3>
            
            <div className="grid grid-cols-2 gap-3">
              {/* Planet 1 selector */}
              <div>
                <label className={`text-xs ${subtextClass} mb-1 block`}>{selectedPlanet?.name || 'Select'}</label>
                <select
                  value={selectedPlanet?.id || 'earth'}
                  onChange={(e) => {
                    const p = planets.find(p => p.id === e.target.value);
                    if (p) onSelectPlanet(p);
                  }}
                  className={`w-full px-3 py-2 rounded-lg text-sm ${cardBg} ${textClass} border ${borderClass}`}
                >
                  {planets.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              {/* Planet 2 selector */}
              <div>
                <label className={`text-xs ${subtextClass} mb-1 block`}>{t('vs')}</label>
                <select
                  value={comparePlanet}
                  onChange={(e) => setComparePlanet(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg text-sm ${cardBg} ${textClass} border ${borderClass}`}
                >
                  {planets.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Comparison cards */}
            {selectedPlanet && (() => {
              const p2 = planets.find(p => p.id === comparePlanet);
              if (!p2) return null;
              return (
                <div className="space-y-3">
                  {/* Visual size comparison */}
                  <div className={`${cardBg} rounded-xl p-4 flex items-center justify-center gap-6`}>
                    <div className="text-center">
                      <div
                        className="rounded-full mx-auto mb-2"
                        style={{
                          width: `${Math.max(20, p2.size3D * 15)}px`,
                          height: `${Math.max(20, p2.size3D * 15)}px`,
                          backgroundColor: p2.color,
                          boxShadow: `0 0 10px ${p2.color}44`,
                        }}
                      />
                      <span className={`text-xs ${textClass}`}>{p2.name}</span>
                    </div>
                    <span className={`text-lg font-bold ${subtextClass}`}>{t('vs')}</span>
                    <div className="text-center">
                      <div
                        className="rounded-full mx-auto mb-2"
                        style={{
                          width: `${Math.max(20, selectedPlanet.size3D * 15)}px`,
                          height: `${Math.max(20, selectedPlanet.size3D * 15)}px`,
                          backgroundColor: selectedPlanet.color,
                          boxShadow: `0 0 10px ${selectedPlanet.color}44`,
                        }}
                      />
                      <span className={`text-xs ${textClass}`}>{selectedPlanet.name}</span>
                    </div>
                  </div>

                  {/* Stat comparisons */}
                  <CompareRow label={t('diameter')} v1={p2.diameter} v2={selectedPlanet.diameter} unit={t('km')} p1Color={p2.color} p2Color={selectedPlanet.color} theme={theme} />
                  <CompareRow label={t('distance')} v1={p2.distanceFromSun} v2={selectedPlanet.distanceFromSun} unit={t('million')} p1Color={p2.color} p2Color={selectedPlanet.color} theme={theme} />
                  <CompareRow label={t('moons')} v1={p2.moons} v2={selectedPlanet.moons} unit="" p1Color={p2.color} p2Color={selectedPlanet.color} theme={theme} />
                  <CompareRow label={t('gravity')} v1={p2.gravity} v2={selectedPlanet.gravity} unit="m/s²" p1Color={p2.color} p2Color={selectedPlanet.color} theme={theme} />
                  <CompareRow label={t('orbitalPeriod')} v1={p2.orbitalPeriod} v2={selectedPlanet.orbitalPeriod} unit={t('days')} p1Color={p2.color} p2Color={selectedPlanet.color} theme={theme} />
                </div>
              );
            })()}
          </div>
        )}

        {/* REAL-TIME TAB */}
        {activeTab === 'realtime' && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className={`text-lg font-bold ${textClass}`}>📡 {t('realtime')}</h3>
            
            {/* Moon Phase */}
            <div className={`${cardBg} rounded-xl p-4`}>
              <h4 className={`text-xs font-semibold ${subtextClass} mb-2`}>🌙 {t('moonPhase')}</h4>
              <p className={`text-lg ${textClass}`}>{moonPhase}</p>
              <p className={`text-xs ${subtextClass} mt-1`}>
                {new Date().toLocaleDateString(language === 'zh' ? 'zh-CN' : language === 'ja' ? 'ja-JP' : language === 'es' ? 'es-ES' : 'en-US')}
              </p>
            </div>

            {/* Upcoming Events */}
            <div className={`${cardBg} rounded-xl p-4`}>
              <h4 className={`text-xs font-semibold ${subtextClass} mb-3`}>📅 {t('nextEclipse')}</h4>
              <div className="space-y-2">
                {astronomicalEvents.map((event, i) => (
                  <div key={i} className={`flex items-center justify-between py-2 border-b ${borderClass} last:border-0`}>
                    <div>
                      <p className={`text-sm font-medium ${textClass}`}>
                        {event.event[language] || event.event.en}
                      </p>
                      <p className={`text-xs ${subtextClass}`}>{event.visibility}</p>
                    </div>
                    <span className={`text-xs font-mono ${subtextClass}`}>{event.date}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Comets */}
            <div className={`${cardBg} rounded-xl p-4`}>
              <h4 className={`text-xs font-semibold ${subtextClass} mb-3`}>☄️ {t('comets')}</h4>
              <div className="space-y-2">
                {cometData.map((comet, i) => (
                  <div key={i} className={`py-2 border-b ${borderClass} last:border-0`}>
                    <p className={`text-sm font-medium ${textClass}`}>{comet.name}</p>
                    <p className={`text-xs ${subtextClass}`}>
                      Period: {comet.period} • Next: {comet.nextPerihelion}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* ISS Position (simulated) */}
            <div className={`${cardBg} rounded-xl p-4`}>
              <h4 className={`text-xs font-semibold ${subtextClass} mb-2`}>🛰️ {t('issPosition')}</h4>
              <ISSPosition />
            </div>
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className={`text-lg font-bold ${textClass}`}>⚙️ {t('settings')}</h3>
            
            {/* Language */}
            <div className={`${cardBg} rounded-xl p-4`}>
              <h4 className={`text-xs font-semibold ${subtextClass} mb-2`}>🌐 {t('language')}</h4>
              <div className="grid grid-cols-4 gap-1">
                {(['en', 'zh', 'es', 'ja'] as Language[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`px-2 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      language === lang
                        ? 'bg-blue-600 text-white'
                        : `${subtextClass} hover:text-white hover:bg-gray-700/50`
                    }`}
                  >
                    {lang === 'en' ? 'EN' : lang === 'zh' ? '中文' : lang === 'es' ? 'ES' : '日本語'}
                  </button>
                ))}
              </div>
            </div>

            {/* Theme */}
            <div className={`${cardBg} rounded-xl p-4`}>
              <h4 className={`text-xs font-semibold ${subtextClass} mb-2`}>🎨 {t('theme')}</h4>
              <div className="flex gap-2">
                <button
                  onClick={() => setTheme('dark')}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    theme === 'dark' ? 'bg-blue-600 text-white' : `${subtextClass} hover:text-white`
                  }`}
                >
                  🌙 {t('dark')}
                </button>
                <button
                  onClick={() => setTheme('light')}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    theme === 'light' ? 'bg-blue-600 text-white' : `${subtextClass} hover:text-white`
                  }`}
                >
                  ☀️ {t('light')}
                </button>
              </div>
            </div>

            {/* Kid Mode */}
            <div className={`${cardBg} rounded-xl p-4`}>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className={`text-sm font-medium ${textClass}`}>👶 {t('kidMode')}</h4>
                  <p className={`text-xs ${subtextClass}`}>Larger labels, emojis, simpler info</p>
                </div>
                <button
                  onClick={() => setKidMode(!kidMode)}
                  className={`w-12 h-6 rounded-full transition-all relative ${
                    kidMode ? 'bg-blue-600' : 'bg-gray-600'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${
                      kidMode ? 'left-6' : 'left-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Visual options */}
            <div className={`${cardBg} rounded-xl p-4 space-y-3`}>
              <h4 className={`text-xs font-semibold ${subtextClass}`}>👁️ Visual Options</h4>
              <ToggleOption label={t('showOrbits') || 'Show Orbits'} value={showOrbits} onChange={setShowOrbits} theme={theme} />
              <ToggleOption label={t('showLabels') || 'Show Labels'} value={showLabels} onChange={setShowLabels} theme={theme} />
              <ToggleOption label={t('asteroidBelt') || 'Asteroid Belt'} value={showAsteroidBelt} onChange={setShowAsteroidBelt} theme={theme} />
            </div>

            {/* Favorites */}
            {favorites.length > 0 && (
              <div className={`${cardBg} rounded-xl p-4`}>
                <h4 className={`text-xs font-semibold ${subtextClass} mb-2`}>★ {t('favorite')}</h4>
                <div className="flex flex-wrap gap-1">
                  {favorites.map(id => {
                    const p = planets.find(p => p.id === id);
                    return p ? (
                      <button
                        key={id}
                        onClick={() => onSelectPlanet(p)}
                        className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs bg-gray-700/50 hover:bg-gray-700 text-white transition-all"
                      >
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                        {p.name}
                      </button>
                    ) : null;
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, theme }: { label: string; value: string; theme: string }) {
  return (
    <div className={`rounded-lg px-3 py-2 ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-100'} border ${theme === 'dark' ? 'border-gray-700/30' : 'border-gray-200'}`}>
      <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{label}</span>
      <p className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{value}</p>
    </div>
  );
}

function CompareRow({ label, v1, v2, unit, p1Color, p2Color, theme }: {
  label: string; v1: number; v2: number; unit: string; p1Color: string; p2Color: string; theme: string;
}) {
  const max = Math.max(v1, v2);
  const pct1 = (v1 / max) * 100;
  const pct2 = (v2 / max) * 100;
  const bg = theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-100';
  const text = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const sub = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';

  return (
    <div className={`${bg} rounded-lg p-3`}>
      <span className={`text-xs ${sub} block mb-2`}>{label}</span>
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p1Color }} />
          <div className="flex-1 h-2 rounded-full bg-gray-700/30 overflow-hidden">
            <div className="h-full rounded-full transition-all" style={{ width: `${pct1}%`, backgroundColor: p1Color }} />
          </div>
          <span className={`text-xs font-mono ${text} w-20 text-right`}>{v1.toLocaleString()} {unit}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p2Color }} />
          <div className="flex-1 h-2 rounded-full bg-gray-700/30 overflow-hidden">
            <div className="h-full rounded-full transition-all" style={{ width: `${pct2}%`, backgroundColor: p2Color }} />
          </div>
          <span className={`text-xs font-mono ${text} w-20 text-right`}>{v2.toLocaleString()} {unit}</span>
        </div>
      </div>
    </div>
  );
}

function ToggleOption({ label, value, onChange, theme }: { label: string; value: boolean; onChange: (v: boolean) => void; theme: string }) {
  const text = theme === 'dark' ? 'text-white' : 'text-gray-900';
  return (
    <div className="flex items-center justify-between">
      <span className={`text-sm ${text}`}>{label}</span>
      <button
        onClick={() => onChange(!value)}
        className={`w-10 h-5 rounded-full transition-all relative ${value ? 'bg-blue-600' : 'bg-gray-600'}`}
      >
        <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all ${value ? 'left-5' : 'left-0.5'}`} />
      </button>
    </div>
  );
}

function ISSPosition() {
  const [pos, setPos] = useState({ lat: 0, lon: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      setPos({
        lat: Math.sin(Date.now() / 10000) * 51.6,
        lon: ((Date.now() / 50000) % 360) - 180,
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-1">
      <p className="text-sm text-white">
        Lat: <span className="font-mono">{pos.lat.toFixed(2)}°</span>
      </p>
      <p className="text-sm text-white">
        Lon: <span className="font-mono">{pos.lon.toFixed(2)}°</span>
      </p>
      <p className="text-xs text-gray-400 mt-1">
        Altitude: ~408 km • Speed: ~27,600 km/h
      </p>
      <p className="text-xs text-gray-500">(Simulated position)</p>
    </div>
  );
}
