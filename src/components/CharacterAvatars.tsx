import React from 'react';
import { CharacterGender } from '../types/game';
import { ASTRONAUT_AVATARS } from '../data/learningContent';

interface CharacterAvatarProps {
  gender?: CharacterGender;
  avatarId?: string;
  size?: number;
  className?: string;
  isAnimated?: boolean;
  action?: 'idle' | 'running' | 'jumping' | 'sliding' | 'celebrate';
  view?: 'front' | 'back';
}

export const CharacterAvatar: React.FC<CharacterAvatarProps> = ({
  gender = 'lelaki',
  avatarId,
  size = 64,
  className = '',
  isAnimated = false,
  action = 'idle',
  view = 'front'
}) => {
  // Find avatar config or fallback
  const avatarConfig =
    ASTRONAUT_AVATARS.find(a => a.id === avatarId) ||
    (gender === 'perempuan' ? ASTRONAUT_AVATARS[2] : ASTRONAUT_AVATARS[0]);

  const suitColor = avatarConfig.suitColor;
  const accentColor = avatarConfig.accentColor;
  const visorColor = avatarConfig.visorColor;
  const accessoryType = avatarConfig.accessoryType;

  // Animation classes
  let animClass = '';
  if (isAnimated) {
    if (action === 'running') animClass = 'animate-bounce';
    else if (action === 'jumping') animClass = '-translate-y-4 transition-transform duration-200';
    else if (action === 'sliding') animClass = 'scale-y-75 translate-y-2 transition-transform duration-200';
    else if (action === 'celebrate') animClass = 'scale-110 rotate-3 transition-transform duration-300';
    else animClass = 'animate-pulse';
  }

  // ---------------- VIEW FROM BEHIND (SUBWAY SURFERS STYLE) ----------------
  if (view === 'back') {
    return (
      <div
        className={`relative inline-flex items-center justify-center shrink-0 ${animClass} ${className}`}
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-lg"
        >
          {/* Subtle glow */}
          <circle cx="50" cy="50" r="45" fill={suitColor} fillOpacity="0.2" />

          {/* Jetpack Thruster flames when running/jumping */}
          {(action === 'running' || action === 'jumping') && (
            <>
              <polygon points="32,82 40,82 36,94" fill="#38BDF8" className="animate-ping" />
              <polygon points="60,82 68,82 64,94" fill="#38BDF8" className="animate-ping" />
              <polygon points="34,82 38,82 36,90" fill="#FDE047" />
              <polygon points="62,82 66,82 64,90" fill="#FDE047" />
            </>
          )}

          {/* Legs seen from behind */}
          {action === 'sliding' ? (
            // Sliding posture: legs bent forward
            <>
              <path d="M 32 75 L 20 86" stroke="#E2E8F0" strokeWidth="8" strokeLinecap="round" />
              <path d="M 68 75 L 80 86" stroke="#E2E8F0" strokeWidth="8" strokeLinecap="round" />
              <rect x="14" y="82" width="14" height="7" rx="3" fill="#1E293B" />
              <rect x="72" y="82" width="14" height="7" rx="3" fill="#1E293B" />
            </>
          ) : (
            // Running posture legs
            <>
              <path
                d={action === 'running' ? 'M 38 72 L 35 88' : 'M 38 72 L 38 88'}
                stroke="#E2E8F0"
                strokeWidth="8"
                strokeLinecap="round"
              />
              <path
                d={action === 'running' ? 'M 62 72 L 65 88' : 'M 62 72 L 62 88'}
                stroke="#E2E8F0"
                strokeWidth="8"
                strokeLinecap="round"
              />
              <rect x="30" y="85" width="14" height="7" rx="3.5" fill="#1E293B" />
              <rect x="56" y="85" width="14" height="7" rx="3.5" fill="#1E293B" />
            </>
          )}

          {/* Arms seen from behind */}
          <path
            d={action === 'sliding' ? 'M 28 48 L 18 60' : 'M 26 48 Q 16 56 20 68'}
            stroke="#F8FAFC"
            strokeWidth="7"
            strokeLinecap="round"
          />
          <path
            d={action === 'sliding' ? 'M 72 48 L 82 60' : 'M 74 48 Q 84 56 80 68'}
            stroke="#F8FAFC"
            strokeWidth="7"
            strokeLinecap="round"
          />
          <circle cx="20" cy="68" r="4.5" fill={accentColor} />
          <circle cx="80" cy="68" r="4.5" fill={accentColor} />

          {/* Suit Torso (Back View) */}
          <rect x="28" y="38" width="44" height="36" rx="10" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="2.5" />

          {/* Big High-Tech Jetpack / Oxygen Backpack */}
          <rect x="30" y="42" width="40" height="28" rx="7" fill={suitColor} stroke="#FFFFFF" strokeWidth="2" />
          <rect x="35" y="46" width="30" height="12" rx="4" fill="#0F172A" />
          {/* Energy core in jetpack */}
          <circle cx="50" cy="52" r="4" fill={accentColor} className="animate-pulse" />
          {/* Jetpack Nozzles */}
          <rect x="33" y="70" width="8" height="10" rx="3" fill="#475569" />
          <rect x="59" y="70" width="8" height="10" rx="3" fill="#475569" />

          {/* Helmet Dome from Behind */}
          <circle cx="50" cy="25" r="21" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="3" />
          {/* Helmet Back Shell Accent */}
          <path
            d="M 33 26 C 33 16 41 9 50 9 C 59 9 67 16 67 26"
            stroke={suitColor}
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* Helmet Accessory (Back View) */}
          {accessoryType === 'radar_dish' && (
            <g transform="translate(50, 4)">
              <ellipse cx="0" cy="0" rx="6" ry="2" fill="#E2E8F0" />
              <line x1="0" y1="0" x2="0" y2="-5" stroke="#94A3B8" strokeWidth="2" />
              <circle cx="0" cy="-5" r="2" fill={accentColor} />
            </g>
          )}
          {accessoryType === 'cosmic_wings' && (
            <>
              <path d="M 22 46 L 8 40 L 14 54 Z" fill={accentColor} />
              <path d="M 78 46 L 92 40 L 86 54 Z" fill={accentColor} />
            </>
          )}
          {accessoryType === 'solar_ring' && (
            <ellipse cx="50" cy="24" rx="25" ry="7" fill="none" stroke="#FDE047" strokeWidth="2" strokeDasharray="3 2" />
          )}
          {accessoryType === 'star_badge' && (
            <polygon points="50,14 52,19 57,19 53,22 55,27 50,24 45,27 47,22 43,19 48,19" fill="#FDE047" />
          )}
          {accessoryType === 'nebula_crystal' && (
            <polygon points="50,6 54,12 50,18 46,12" fill="#C084FC" />
          )}
        </svg>
      </div>
    );
  }

  // ---------------- VIEW FROM FRONT (STANDARD AVATAR) ----------------
  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${animClass} ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md"
      >
        {/* Glow behind character */}
        <circle cx="50" cy="50" r="44" fill={suitColor} fillOpacity="0.2" />

        {/* Jetpack side tanks */}
        <rect x="22" y="44" width="11" height="26" rx="4" fill="#334155" />
        <rect x="67" y="44" width="11" height="26" rx="4" fill="#334155" />
        <path d="M24 70 L22 77 L31 77 L29 70 Z" fill="#64748B" />
        <path d="M71 70 L69 77 L78 77 L76 70 Z" fill="#64748B" />

        {/* Space Suit Body */}
        <rect x="31" y="41" width="38" height="35" rx="9" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="2.5" />

        {/* Chest Plate with Suit Color */}
        <rect x="36" y="46" width="28" height="15" rx="4" fill={suitColor} />
        <circle cx="43" cy="53" r="3" fill="#FFFFFF" />
        <line x1="49" y1="53" x2="58" y2="53" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />

        {/* Arms */}
        <path
          d={
            action === 'celebrate'
              ? 'M31 46 Q18 28 20 22'
              : action === 'running'
              ? 'M31 49 Q20 54 22 64'
              : 'M31 47 Q22 55 24 64'
          }
          stroke="#F8FAFC"
          strokeWidth="6.5"
          strokeLinecap="round"
        />
        <path
          d={
            action === 'celebrate'
              ? 'M69 46 Q82 28 80 22'
              : action === 'running'
              ? 'M69 49 Q80 44 78 36'
              : 'M69 47 Q78 55 76 64'
          }
          stroke="#F8FAFC"
          strokeWidth="6.5"
          strokeLinecap="round"
        />

        {/* Gloves */}
        <circle cx={action === 'celebrate' ? 20 : 24} cy={action === 'celebrate' ? 22 : 64} r="4.5" fill={accentColor} />
        <circle cx={action === 'celebrate' ? 80 : (action === 'running' ? 78 : 76)} cy={action === 'celebrate' ? 22 : (action === 'running' ? 36 : 64)} r="4.5" fill={accentColor} />

        {/* Legs & Boots */}
        <path d="M40 76 L38 88" stroke="#CBD5E1" strokeWidth="7" strokeLinecap="round" />
        <path d="M60 76 L62 88" stroke="#CBD5E1" strokeWidth="7" strokeLinecap="round" />
        <rect x="32" y="85" width="13" height="7" rx="3.5" fill="#1E293B" />
        <rect x="56" y="85" width="13" height="7" rx="3.5" fill="#1E293B" />

        {/* Space Helmet Dome */}
        <circle cx="50" cy="26" r="21" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="3" />

        {/* Helmet Visor with Visor Color */}
        <path
          d="M33 26 C33 16 40 10 50 10 C60 10 67 16 67 26 C67 35 60 40 50 40 C40 40 33 35 33 26 Z"
          fill="#0F172A"
        />
        <path
          d="M35 25 C35 17 41 12 50 12 C59 12 65 17 65 25 C65 33 59 38 50 38 C41 38 35 33 35 25 Z"
          fill={visorColor}
          fillOpacity="0.9"
        />
        {/* Specular Glint */}
        <path
          d="M38 18 C42 15 47 14 52 14 C55 14 58 15 60 17"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeOpacity="0.8"
        />

        {/* Cute Face Behind Visor */}
        <circle cx="44" cy="26" r="2.2" fill="#FFFFFF" />
        <circle cx="56" cy="26" r="2.2" fill="#FFFFFF" />
        <path d="M47 31 Q50 34 53 31" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" fill="none" />

        {/* Helmet Accessories on Top */}
        {accessoryType === 'radar_dish' && (
          <g transform="translate(50, 6)">
            <line x1="0" y1="4" x2="0" y2="-4" stroke="#94A3B8" strokeWidth="2" />
            <circle cx="0" cy="-4" r="3" fill={accentColor} />
          </g>
        )}
        {accessoryType === 'star_badge' && (
          <polygon points="50,4 52,9 57,9 53,12 55,17 50,14 45,17 47,12 43,9 48,9" fill="#FDE047" />
        )}
        {accessoryType === 'solar_ring' && (
          <ellipse cx="50" cy="8" rx="14" ry="4" fill="none" stroke="#FDE047" strokeWidth="2" />
        )}
        {accessoryType === 'nebula_crystal' && (
          <polygon points="50,0 54,6 50,12 46,6" fill="#C084FC" />
        )}
        {accessoryType === 'cosmic_wings' && (
          <>
            <polygon points="26,38 14,32 18,46" fill={accentColor} />
            <polygon points="74,38 86,32 82,46" fill={accentColor} />
          </>
        )}
      </svg>
    </div>
  );
};
