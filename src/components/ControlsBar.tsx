import { translations } from '../data';

type Language = 'en' | 'zh' | 'es' | 'ja';

interface ControlsBarProps {
  isPlaying: boolean;
  setIsPlaying: (v: boolean) => void;
  speed: number;
  setSpeed: (v: number) => void;
  timeOffset: number;
  setTimeOffset: (v: number) => void;
  cameraDistance: number;
  setCameraDistance: (v: number) => void;
  language: Language;
  theme: 'dark' | 'light';
  showTimeTravel: boolean;
  setShowTimeTravel: (v: boolean) => void;
}

export default function ControlsBar({
  isPlaying, setIsPlaying, speed, setSpeed,
  timeOffset, setTimeOffset, cameraDistance, setCameraDistance,
  language, theme, showTimeTravel, setShowTimeTravel,
}: ControlsBarProps) {
  const t = (key: string) => translations[language]?.[key] || translations.en[key] || key;
  const bgClass = theme === 'dark' ? 'bg-gray-950/95' : 'bg-white/95';
  const borderClass = theme === 'dark' ? 'border-gray-700/40' : 'border-gray-200';
  const textClass = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const subtextClass = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-40 ${bgClass} backdrop-blur-lg border-t ${borderClass}`}>
      {/* Time Travel Panel */}
      {showTimeTravel && (
        <div className={`${bgClass} border-b ${borderClass} px-4 py-3 animate-slideUp`}>
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm font-medium ${textClass}`}>⏳ {t('timeTravel')}</span>
              <button
                onClick={() => { setTimeOffset(0); setShowTimeTravel(false); }}
                className={`text-xs ${subtextClass} hover:text-white transition-all`}
              >
                Reset to Now
              </button>
            </div>
            <input
              type="range"
              min={-10000}
              max={10000}
              value={timeOffset}
              onChange={(e) => setTimeOffset(Number(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-purple-500"
              style={{ background: `linear-gradient(to right, #7c3aed ${((timeOffset + 10000) / 20000) * 100}%, #374151 ${((timeOffset + 10000) / 20000) * 100}%)` }}
            />
            <div className="flex justify-between mt-1">
              <span className={`text-xs ${subtextClass}`}>-27 years</span>
              <span className={`text-xs font-medium ${textClass}`}>
                {timeOffset === 0 ? 'Now' : timeOffset > 0 ? `+${(timeOffset / 365.25).toFixed(1)} years` : `${(timeOffset / 365.25).toFixed(1)} years ago`}
              </span>
              <span className={`text-xs ${subtextClass}`}>+27 years</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Controls */}
      <div className="max-w-5xl mx-auto px-3 sm:px-6 py-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-4">
          {/* Left: Play/Pause + Status */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full font-medium text-xs sm:text-sm transition-all shadow-lg ${
                isPlaying
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-500/20'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-500/20'
              }`}
            >
              {isPlaying ? (
                <>
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <rect x="6" y="4" width="4" height="16" rx="1" />
                    <rect x="14" y="4" width="4" height="16" rx="1" />
                  </svg>
                  <span className="hidden sm:inline">{t('pause')}</span>
                </>
              ) : (
                <>
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <polygon points="6,3 20,12 6,21" />
                  </svg>
                  <span className="hidden sm:inline">{t('play')}</span>
                </>
              )}
            </button>

            <div className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-400 animate-pulse' : 'bg-amber-400'}`} />
              <span className={`text-xs ${subtextClass} hidden sm:inline`}>
                {isPlaying ? 'Running' : 'Paused'}
              </span>
            </div>
          </div>

          {/* Center: Speed */}
          <div className="flex items-center gap-1.5">
            <span className={`text-xs ${subtextClass} hidden sm:inline`}>{t('speed')}:</span>
            <div className={`flex items-center gap-0.5 rounded-lg p-0.5 ${theme === 'dark' ? 'bg-gray-800/80' : 'bg-gray-100'}`}>
              {[0.25, 0.5, 1, 2, 5, 10, 50].map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={`px-1.5 sm:px-2 py-1 rounded-md text-xs font-medium transition-all ${
                    speed === s
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                      : `${subtextClass} hover:text-white hover:bg-gray-700/50`
                  }`}
                >
                  {s}×
                </button>
              ))}
            </div>
          </div>

          {/* Right: Zoom + Time Travel */}
          <div className="flex items-center gap-1.5">
            {/* Zoom */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCameraDistance(Math.max(10, cameraDistance - 10))}
                className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm transition-all ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
              >
                +
              </button>
              <span className={`text-xs ${subtextClass} w-8 text-center`}>{Math.round(cameraDistance)}</span>
              <button
                onClick={() => setCameraDistance(Math.min(150, cameraDistance + 10))}
                className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm transition-all ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
              >
                −
              </button>
            </div>

            {/* Time Travel Toggle */}
            <button
              onClick={() => setShowTimeTravel(!showTimeTravel)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                showTimeTravel
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
                  : `${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`
              }`}
            >
              ⏳
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
