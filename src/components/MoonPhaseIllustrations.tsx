import React from 'react';

export type MoonPhaseKey =
  | 'new_moon'
  | 'crescent'
  | 'half_moon'
  | 'gibbous'
  | 'full_moon'
  | 'waning_gibbous'
  | 'waning_half'
  | 'waning_crescent';

interface MoonPhaseIconProps {
  phase: MoonPhaseKey | string;
  size?: number;
  className?: string;
  showGlow?: boolean;
}

export const MoonPhaseIcon: React.FC<MoonPhaseIconProps> = ({
  phase,
  size = 56,
  className = '',
  showGlow = true
}) => {
  // Normalize string
  const p = phase.toLowerCase();

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          <filter id={`moonGlow-${p}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <radialGradient id="fullMoonGradient" cx="40%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="60%" stopColor="#FACC15" />
            <stop offset="100%" stopColor="#EAB308" />
          </radialGradient>
        </defs>

        {/* Glow if illuminated */}
        {showGlow && p !== 'new_moon' && p !== 'anak_bulan' && (
          <circle cx="50" cy="50" r="46" fill="#FACC15" fillOpacity="0.2" filter={`url(#moonGlow-${p})`} />
        )}

        {/* Base dark moon circle (night side) */}
        <circle cx="50" cy="50" r="40" fill="#0F172A" stroke="#334155" strokeWidth="2" />
        {/* Subtle craters on dark side */}
        <circle cx="42" cy="36" r="4" fill="#1E293B" />
        <circle cx="62" cy="58" r="5" fill="#1E293B" />
        <circle cx="38" cy="65" r="3" fill="#1E293B" />

        {/* Phase Overlays based on textbook illustrations */}
        {/* 1. Anak Bulan (New Moon): Gelap menghadap Bumi, faint halo */}
        {(p === 'new_moon' || p === 'anak_bulan' || p === 'anak bulan' || p === 'seq_1') && (
          <circle cx="50" cy="50" r="40" fill="#090D16" stroke="#38BDF8" strokeWidth="1.5" strokeDasharray="3 3" />
        )}

        {/* 2. Bulan Sabit (Waxing Crescent): Thin bright crescent on the right */}
        {(p === 'crescent' || p === 'bulan_sabit' || p === 'bulan sabit' || p === 'seq_2') && (
          <path
            d="M 50 10 A 40 40 0 0 1 50 90 A 30 40 0 0 0 50 10 Z"
            fill="url(#fullMoonGradient)"
          />
        )}

        {/* 3. Bulan Separa (First Quarter): Exact right half illuminated */}
        {(p === 'half_moon' || p === 'bulan_separa' || p === 'bulan separa' || p === 'seq_3') && (
          <path
            d="M 50 10 A 40 40 0 0 1 50 90 L 50 10 Z"
            fill="url(#fullMoonGradient)"
          />
        )}

        {/* 4. Bulan Hampir Purnama (Waxing Gibbous): Most of surface illuminated */}
        {(p === 'gibbous' || p === 'bulan_hampir_purnama' || p === 'bulan hampir purnama' || p === 'seq_4') && (
          <path
            d="M 50 10 A 40 40 0 0 1 50 90 A 30 40 0 0 1 50 10 Z"
            fill="url(#fullMoonGradient)"
          />
        )}

        {/* 5. Bulan Purnama (Full Moon): Completely illuminated disc */}
        {(p === 'full_moon' || p === 'bulan_purnama' || p === 'bulan purnama' || p === 'seq_5') && (
          <>
            <circle cx="50" cy="50" r="40" fill="url(#fullMoonGradient)" stroke="#FEF08A" strokeWidth="1" />
            {/* Soft crater details */}
            <circle cx="38" cy="35" r="5" fill="#CA8A04" fillOpacity="0.25" />
            <circle cx="58" cy="45" r="7" fill="#CA8A04" fillOpacity="0.2" />
            <circle cx="45" cy="62" r="6" fill="#CA8A04" fillOpacity="0.22" />
            <circle cx="68" cy="32" r="3.5" fill="#CA8A04" fillOpacity="0.25" />
          </>
        )}
      </svg>
    </div>
  );
};

export const MoonOrbitDiagram: React.FC<{ activeStep?: number }> = ({ activeStep = 1 }) => {
  return (
    <div className="w-full max-w-lg mx-auto bg-slate-900/90 border border-slate-700/60 rounded-xl p-4 text-center">
      <div className="flex items-center justify-between text-xs text-slate-300 font-medium mb-3">
        <span className="flex items-center gap-1.5 text-amber-300">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
          Cahaya Matahari (Kiri)
        </span>
        <span className="text-slate-400">Peredaran & Putaran: 27 1/3 Hari (Lawan Arah Jam)</span>
      </div>

      <div className="relative w-full aspect-square max-h-72 flex items-center justify-center">
        <svg viewBox="0 0 300 300" className="w-full h-full">
          {/* Sunlight beams from left */}
          <line x1="0" y1="60" x2="60" y2="60" stroke="#FBBF24" strokeWidth="2" strokeDasharray="4 4" />
          <line x1="0" y1="150" x2="60" y2="150" stroke="#FBBF24" strokeWidth="3" />
          <line x1="0" y1="240" x2="60" y2="240" stroke="#FBBF24" strokeWidth="2" strokeDasharray="4 4" />
          <text x="10" y="40" fill="#FBBF24" fontSize="11" fontWeight="bold">CAHAYA MATAHARI</text>

          {/* Moon Orbit Ellipse */}
          <ellipse cx="150" cy="150" rx="100" ry="85" fill="none" stroke="#38BDF8" strokeWidth="1.5" strokeDasharray="6 4" />

          {/* Counter-clockwise direction arrows on orbit */}
          <path d="M 150 65 L 142 62 L 146 70 Z" fill="#38BDF8" />
          <path d="M 50 150 L 53 142 L 45 146 Z" fill="#38BDF8" />
          <path d="M 150 235 L 158 238 L 154 230 Z" fill="#38BDF8" />
          <path d="M 250 150 L 247 158 L 255 154 Z" fill="#38BDF8" />

          {/* Earth in Center */}
          <circle cx="150" cy="150" r="30" fill="#0284C7" stroke="#38BDF8" strokeWidth="2" />
          {/* Earth Continents */}
          <path d="M140 135 Q155 130 160 142 Q150 155 138 148 Z" fill="#10B981" />
          <path d="M148 155 Q165 158 162 170 Q145 168 148 155 Z" fill="#10B981" />
          <text x="150" y="154" fill="#FFFFFF" fontSize="10" fontWeight="bold" textAnchor="middle">BUMI</text>

          {/* 1. Anak Bulan (Left, facing sun side) */}
          <g transform="translate(50, 150)">
            <circle cx="0" cy="0" r="14" fill="#0F172A" stroke="#64748B" strokeWidth="1.5" />
            <text x="0" y="24" fill="#CBD5E1" fontSize="9" textAnchor="middle" fontWeight="bold">1. Anak Bulan</text>
          </g>

          {/* 2. Bulan Sabit (Bottom-Left) */}
          <g transform="translate(80, 215)">
            <circle cx="0" cy="0" r="14" fill="#0F172A" />
            <path d="M 0 -14 A 14 14 0 0 1 0 14 A 10 14 0 0 0 0 -14 Z" fill="#FACC15" />
            <text x="0" y="24" fill="#CBD5E1" fontSize="9" textAnchor="middle" fontWeight="bold">2. Bulan Sabit</text>
          </g>

          {/* 3. Bulan Separa (Bottom) */}
          <g transform="translate(150, 235)">
            <circle cx="0" cy="0" r="14" fill="#0F172A" />
            <path d="M 0 -14 A 14 14 0 0 1 0 14 L 0 -14 Z" fill="#FACC15" />
            <text x="0" y="24" fill="#CBD5E1" fontSize="9" textAnchor="middle" fontWeight="bold">3. Bulan Separa</text>
          </g>

          {/* 4. Bulan Hampir Purnama (Bottom-Right) */}
          <g transform="translate(220, 215)">
            <circle cx="0" cy="0" r="14" fill="#0F172A" />
            <path d="M 0 -14 A 14 14 0 0 1 0 14 A 10 14 0 0 1 0 -14 Z" fill="#FACC15" />
            <text x="0" y="24" fill="#CBD5E1" fontSize="8" textAnchor="middle" fontWeight="bold">4. H. Purnama</text>
          </g>

          {/* 5. Bulan Purnama (Right, opposite sun) */}
          <g transform="translate(250, 150)">
            <circle cx="0" cy="0" r="15" fill="#FACC15" stroke="#FEF08A" strokeWidth="1.5" />
            <text x="0" y="24" fill="#FDE047" fontSize="9" textAnchor="middle" fontWeight="bold">5. B. Purnama</text>
          </g>
        </svg>
      </div>
      <p className="text-xs text-slate-400 mt-1">
        Bulan beredar mengelilingi Bumi mengikut arah lawan jam. Kedudukan yang berubah menyebabkan fasa bulan berbeza dilihat dari Bumi.
      </p>
    </div>
  );
};
