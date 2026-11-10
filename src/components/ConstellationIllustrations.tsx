import React, { useState } from 'react';

export type ConstellationType = 'biduk' | 'belantik' | 'pari' | 'skorpio';

interface ConstellationCardProps {
  type: ConstellationType;
  showOverlay?: boolean;
  interactive?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ConstellationVisualizer: React.FC<ConstellationCardProps> = ({
  type,
  showOverlay: defaultShowOverlay = true,
  interactive = true,
  className = '',
  size = 'md'
}) => {
  const [showOverlay, setShowOverlay] = useState(defaultShowOverlay);

  const meta = {
    biduk: {
      name: 'Buruj Biduk',
      starsCount: '7 Bintang',
      shapeDesc: 'Gayung atau Senduk',
      direction: 'Arah UTARA',
      season: 'Petunjuk Musim Menanam',
      hemisphere: 'Hemisfera Utara',
      infoSains: 'Sebahagian daripada buruj Ursa Major (Beruang Besar).'
    },
    belantik: {
      name: 'Buruj Belantik',
      starsCount: 'Gugusan Bintang Pemburu',
      shapeDesc: 'Pemburu memakai tali pinggang & memegang senjata',
      direction: 'Di antara hemisfera utara & selatan',
      season: 'Petunjuk Musim Sejuk',
      hemisphere: 'Antara Hemisfera Utara & Selatan',
      infoSains: 'Mempunyai 3 bintang sebaris yang membentuk tali pinggang pemburu.'
    },
    pari: {
      name: 'Buruj Pari',
      starsCount: '4 Bintang (Buruj paling kecil)',
      shapeDesc: 'Layang-layang',
      direction: 'Arah SELATAN',
      season: 'Petunjuk Arah Navigasi Pelayar',
      hemisphere: 'Hemisfera Selatan',
      infoSains: 'Buruj yang paling kecil di langit malam, menyerupai salib/layang-layang.'
    },
    skorpio: {
      name: 'Buruj Skorpio',
      starsCount: 'Gugusan Bintang Ekor Melengkung',
      shapeDesc: 'Kala Jengking',
      direction: 'Dilihat di hemisfera selatan',
      season: 'Petunjuk Musim Menuai',
      hemisphere: 'Hemisfera Selatan',
      infoSains: 'Gugusan bintang yang membentuk badan dan ekor melengkung kala jengking.'
    }
  }[type];

  const heightClass = size === 'sm' ? 'h-40' : size === 'lg' ? 'h-80' : 'h-60';

  return (
    <div className={`relative bg-slate-950/80 border border-indigo-900/50 rounded-xl overflow-hidden p-3 flex flex-col justify-between ${className}`}>
      {/* Top Header */}
      <div className="flex items-center justify-between z-10">
        <div>
          <h4 className="text-sm md:text-base font-bold text-sky-300">{meta.name}</h4>
          <span className="text-xs text-slate-400">
            {meta.shapeDesc} · {meta.starsCount}
          </span>
        </div>
        {interactive && (
          <button
            onClick={() => setShowOverlay(!showOverlay)}
            type="button"
            className="text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-sky-200 border border-slate-700 transition-colors"
          >
            {showOverlay ? 'Sembunyikan Lakaran' : 'Tunjukkan Lakaran'}
          </button>
        )}
      </div>

      {/* SVG Sky Box */}
      <div className={`relative w-full ${heightClass} my-2 flex items-center justify-center`}>
        <svg viewBox="0 0 240 180" className="w-full h-full">
          {/* Subtle starfield particles */}
          <circle cx="20" cy="30" r="0.8" fill="#FFFFFF" opacity="0.4" />
          <circle cx="220" cy="40" r="1" fill="#FFFFFF" opacity="0.5" />
          <circle cx="35" cy="150" r="0.7" fill="#FFFFFF" opacity="0.3" />
          <circle cx="200" cy="140" r="0.9" fill="#FFFFFF" opacity="0.4" />
          <circle cx="120" cy="20" r="1.1" fill="#FFFFFF" opacity="0.6" />

          {/* 1. BURUJ BIDUK (7 Stars: Dipper scoop + handle) */}
          {type === 'biduk' && (
            <g>
              {/* Optional Artistic Dipper/Bear silhouette overlay */}
              {showOverlay && (
                <path
                  d="M 50 110 Q 90 130 110 100 Q 150 90 200 40 L 210 50 Q 155 105 105 115 Q 85 145 45 125 Z"
                  fill="#0284C7"
                  fillOpacity="0.18"
                  stroke="#38BDF8"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
              )}

              {/* Constellation lines */}
              <polyline
                points="40,85 75,90 105,115 80,145 40,135 40,85"
                fill="none"
                stroke="#60A5FA"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <polyline
                points="105,115 145,100 175,75 205,45"
                fill="none"
                stroke="#60A5FA"
                strokeWidth="2"
                strokeLinecap="round"
              />

              {/* Direction Indicator pointing to North */}
              <line x1="40" y1="85" x2="40" y2="30" stroke="#38BDF8" strokeWidth="2" strokeDasharray="3 3" />
              <polygon points="40,25 36,35 44,35" fill="#38BDF8" />
              <text x="50" y="32" fill="#38BDF8" fontSize="10" fontWeight="bold">Ke Arah UTARA</text>

              {/* 7 Glowing Stars */}
              {[
                { x: 40, y: 85 },
                { x: 75, y: 90 },
                { x: 105, y: 115 },
                { x: 80, y: 145 },
                { x: 40, y: 135 },
                { x: 145, y: 100 },
                { x: 175, y: 75 },
                { x: 205, y: 45 }
              ].map((s, idx) => (
                <g key={idx} transform={`translate(${s.x}, ${s.y})`}>
                  <circle cx="0" cy="0" r="5" fill="#93C5FD" fillOpacity="0.4" className="animate-ping" />
                  <circle cx="0" cy="0" r="3.5" fill="#FFFFFF" stroke="#60A5FA" strokeWidth="1" />
                </g>
              ))}
            </g>
          )}

          {/* 2. BURUJ BELANTIK (Orion the Hunter) */}
          {type === 'belantik' && (
            <g>
              {/* Artistic Hunter overlay */}
              {showOverlay && (
                <path
                  d="M 120 20 Q 140 40 135 60 Q 165 40 180 30 Q 150 90 145 100 Q 165 140 170 160 Q 120 140 70 160 Q 90 120 85 95 Q 60 70 50 60 Q 90 50 105 60 Z"
                  fill="#818CF8"
                  fillOpacity="0.15"
                  stroke="#A5B4FC"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
              )}

              {/* Shoulders & Betelgeuse / Bellatrix */}
              <line x1="85" y1="50" x2="155" y2="50" stroke="#818CF8" strokeWidth="2" />
              {/* Torso & 3-Star Belt */}
              <line x1="85" y1="50" x2="105" y2="95" stroke="#818CF8" strokeWidth="1.5" />
              <line x1="155" y1="50" x2="135" y2="95" stroke="#818CF8" strokeWidth="1.5" />
              {/* Belt line */}
              <line x1="105" y1="95" x2="135" y2="95" stroke="#FBBF24" strokeWidth="2.5" />
              {/* Legs to Rigel & Saiph */}
              <line x1="105" y1="95" x2="80" y2="150" stroke="#818CF8" strokeWidth="1.5" />
              <line x1="135" y1="95" x2="160" y2="150" stroke="#818CF8" strokeWidth="1.5" />
              <line x1="80" y1="150" x2="160" y2="150" stroke="#818CF8" strokeWidth="1.5" />
              {/* Raised Weapon Arm */}
              <line x1="155" y1="50" x2="190" y2="30" stroke="#818CF8" strokeWidth="1.5" />
              <line x1="190" y1="30" x2="185" y2="15" stroke="#818CF8" strokeWidth="1.5" />

              {/* Stars */}
              {[
                { x: 85, y: 50, color: '#FB923C' }, // Betelgeuse (reddish)
                { x: 155, y: 50, color: '#FFFFFF' }, // Bellatrix
                { x: 110, y: 95, color: '#FDE047' }, // Belt 1
                { x: 120, y: 95, color: '#FDE047' }, // Belt 2
                { x: 130, y: 95, color: '#FDE047' }, // Belt 3
                { x: 80, y: 150, color: '#FFFFFF' }, // Saiph
                { x: 160, y: 150, color: '#93C5FD' }, // Rigel
                { x: 190, y: 30, color: '#FFFFFF' }, // Weapon
                { x: 120, y: 30, color: '#E2E8F0' } // Head
              ].map((s, idx) => (
                <g key={idx} transform={`translate(${s.x}, ${s.y})`}>
                  <circle cx="0" cy="0" r="4.5" fill={s.color} fillOpacity="0.4" />
                  <circle cx="0" cy="0" r="3" fill={s.color} stroke="#1E293B" strokeWidth="0.8" />
                </g>
              ))}
              <text x="120" y="112" fill="#FDE047" fontSize="9" textAnchor="middle" fontWeight="bold">Tali Pinggang Pemburu</text>
            </g>
          )}

          {/* 3. BURUJ PARI (Southern Cross / Kite) */}
          {type === 'pari' && (
            <g>
              {/* Kite silhouette overlay */}
              {showOverlay && (
                <polygon
                  points="120,30 165,85 120,150 75,85"
                  fill="#06B6D4"
                  fillOpacity="0.18"
                  stroke="#22D3EE"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />
              )}

              {/* Cross connection lines */}
              <line x1="120" y1="30" x2="120" y2="150" stroke="#38BDF8" strokeWidth="2.5" />
              <line x1="75" y1="85" x2="165" y2="85" stroke="#38BDF8" strokeWidth="2" />

              {/* Pointer to South */}
              <line x1="120" y1="150" x2="120" y2="175" stroke="#F43F5E" strokeWidth="2" strokeDasharray="3 3" />
              <polygon points="120,178 116,168 124,168" fill="#F43F5E" />
              <text x="135" y="172" fill="#F43F5E" fontSize="10" fontWeight="bold">Ke Arah SELATAN</text>

              {/* 4 Stars (Southern Cross) */}
              {[
                { x: 120, y: 30 },
                { x: 165, y: 85 },
                { x: 120, y: 150 },
                { x: 75, y: 85 }
              ].map((s, idx) => (
                <g key={idx} transform={`translate(${s.x}, ${s.y})`}>
                  <circle cx="0" cy="0" r="6" fill="#38BDF8" fillOpacity="0.4" className="animate-ping" />
                  <circle cx="0" cy="0" r="4" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1" />
                </g>
              ))}
              <text x="120" y="20" fill="#67E8F9" fontSize="9" textAnchor="middle" fontWeight="bold">4 Bintang (Paling Kecil)</text>
            </g>
          )}

          {/* 4. BURUJ SKORPIO (Scorpius) */}
          {type === 'skorpio' && (
            <g>
              {/* Scorpion silhouette */}
              {showOverlay && (
                <path
                  d="M 50 40 Q 90 20 110 50 Q 150 70 170 110 Q 185 145 160 160 Q 135 155 145 130 Q 130 90 100 65 Q 70 65 50 40 Z"
                  fill="#F59E0B"
                  fillOpacity="0.16"
                  stroke="#FBBF24"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
              )}

              {/* Claws & Head */}
              <line x1="45" y1="35" x2="70" y2="45" stroke="#FBBF24" strokeWidth="2" />
              <line x1="45" y1="65" x2="70" y2="55" stroke="#FBBF24" strokeWidth="2" />
              <line x1="70" y1="50" x2="100" y2="55" stroke="#FBBF24" strokeWidth="2.5" />

              {/* Antares & Curved Body */}
              <polyline
                points="100,55 125,75 145,100 165,125 170,145 155,160 140,150 145,135"
                fill="none"
                stroke="#FBBF24"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Stars */}
              {[
                { x: 45, y: 35 },
                { x: 45, y: 65 },
                { x: 70, y: 50 },
                { x: 100, y: 55, isAntares: true }, // Antares (Bright Orange heart)
                { x: 125, y: 75 },
                { x: 145, y: 100 },
                { x: 165, y: 125 },
                { x: 170, y: 145 },
                { x: 155, y: 160 },
                { x: 140, y: 150 },
                { x: 145, y: 135 } // Stinger
              ].map((s, idx) => (
                <g key={idx} transform={`translate(${s.x}, ${s.y})`}>
                  {s.isAntares ? (
                    <>
                      <circle cx="0" cy="0" r="7" fill="#EF4444" fillOpacity="0.4" className="animate-pulse" />
                      <circle cx="0" cy="0" r="4.5" fill="#F97316" stroke="#FFFFFF" strokeWidth="1" />
                    </>
                  ) : (
                    <>
                      <circle cx="0" cy="0" r="4" fill="#FDE047" fillOpacity="0.3" />
                      <circle cx="0" cy="0" r="3" fill="#FFFFFF" stroke="#F59E0B" strokeWidth="1" />
                    </>
                  )}
                </g>
              ))}
              <text x="160" y="172" fill="#FBBF24" fontSize="9" textAnchor="middle" fontWeight="bold">Sengat Melengkung</text>
            </g>
          )}
        </svg>
      </div>

      {/* Bottom Features Strip */}
      <div className="grid grid-cols-2 gap-1.5 text-[11px] pt-2 border-t border-slate-800/80">
        <div className="bg-slate-900/60 rounded px-2 py-1 text-slate-300">
          <span className="text-sky-400 font-semibold block">Arah / Lokasi:</span>
          {meta.direction}
        </div>
        <div className="bg-slate-900/60 rounded px-2 py-1 text-slate-300">
          <span className="text-amber-400 font-semibold block">Musim:</span>
          {meta.season}
        </div>
      </div>
    </div>
  );
};
