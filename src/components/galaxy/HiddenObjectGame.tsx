import React, { useState } from 'react';
import { soundEffects } from '../../utils/audio';
import { Sparkles, CheckCircle2, Search, ArrowRight, Eye } from 'lucide-react';

interface HiddenItem {
  id: string;
  name: string;
  desc: string;
  x: number; // percentage 5-90
  y: number; // percentage 10-85
  iconType: 'telescope' | 'satellite' | 'spacesuit' | 'mirror' | 'globe' | 'antenna';
}

interface HiddenObjectGameProps {
  stepIndex: number; // 0 (Stesen 1) or 1 (Stesen 2)
  onComplete: () => void;
  onCancel: () => void;
}

export const HiddenObjectGame: React.FC<HiddenObjectGameProps> = ({
  stepIndex,
  onComplete,
  onCancel
}) => {
  // Definition of hidden objects based on checkpoint topic
  const items: HiddenItem[] = stepIndex === 0
    ? [
        {
          id: 'telescope',
          name: 'Teleskop Angkasa',
          desc: 'Alat mencerap fasa Bulan dari stesen',
          x: 22,
          y: 48,
          iconType: 'telescope'
        },
        {
          id: 'satellite',
          name: 'Satelit Qamari',
          desc: 'Memantau edaran Bulan mengelilingi Bumi',
          x: 78,
          y: 28,
          iconType: 'satellite'
        },
        {
          id: 'spacesuit',
          name: 'Sut Penyelidik',
          desc: 'Pakaian keselamatan angkasawan',
          x: 52,
          y: 72,
          iconType: 'spacesuit'
        }
      ]
    : [
        {
          id: 'mirror',
          name: 'Cermin Pemantul',
          desc: 'Membuktikan Bulan memantulkan cahaya Matahari',
          x: 28,
          y: 35,
          iconType: 'mirror'
        },
        {
          id: 'globe',
          name: 'Glob Orbit Bumi-Bulan',
          desc: 'Simulasi tempoh putaran 27 1/3 hari',
          x: 74,
          y: 65,
          iconType: 'globe'
        },
        {
          id: 'antenna',
          name: 'Antena Isyarat Radio',
          desc: 'Penerima telemetri putaran lawan jam',
          x: 48,
          y: 22,
          iconType: 'antenna'
        }
      ];

  const [foundIds, setFoundIds] = useState<string[]>([]);
  const [lastFoundItem, setLastFoundItem] = useState<HiddenItem | null>(null);
  const [hintActive, setHintActive] = useState<boolean>(false);

  const handleItemClick = (item: HiddenItem) => {
    if (foundIds.includes(item.id)) return;

    soundEffects.playCollect();
    const nextFound = [...foundIds, item.id];
    setFoundIds(nextFound);
    setLastFoundItem(item);

    if (nextFound.length >= items.length) {
      soundEffects.playLevelUp();
    }
  };

  const isAllFound = foundIds.length >= items.length;

  const renderItemGraphic = (item: HiddenItem, isFound: boolean) => {
    const isTarget = !isFound;
    return (
      <button
        key={item.id}
        onClick={() => handleItemClick(item)}
        type="button"
        title={item.name}
        style={{ left: `${item.x}%`, top: `${item.y}%` }}
        className={`absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-2xl transition-all duration-300 cursor-pointer ${
          isFound
            ? 'scale-110 ring-4 ring-emerald-400 bg-emerald-500/30'
            : hintActive
            ? 'animate-bounce ring-4 ring-amber-400 bg-amber-400/20'
            : 'hover:scale-125 hover:ring-2 hover:ring-sky-300/80 active:scale-95'
        }`}
      >
        {item.iconType === 'telescope' && (
          <div className="w-12 h-12 flex items-center justify-center bg-slate-800/80 rounded-xl border border-sky-400/50 shadow-[0_0_15px_rgba(56,189,248,0.4)]">
            <svg viewBox="0 0 40 40" className="w-9 h-9">
              <path d="M8 28 L24 12 L30 18 L14 34 Z" fill="#38BDF8" />
              <circle cx="28" cy="14" r="5" fill="#FACC15" />
              <line x1="16" y1="32" x2="8" y2="38" stroke="#94A3B8" strokeWidth="3" />
              <line x1="20" y1="32" x2="24" y2="38" stroke="#94A3B8" strokeWidth="3" />
            </svg>
          </div>
        )}

        {item.iconType === 'satellite' && (
          <div className="w-12 h-12 flex items-center justify-center bg-slate-800/80 rounded-xl border border-teal-400/50 shadow-[0_0_15px_rgba(45,212,191,0.4)]">
            <svg viewBox="0 0 40 40" className="w-9 h-9">
              <rect x="15" y="15" width="10" height="10" rx="2" fill="#2DD4BF" />
              <rect x="4" y="17" width="8" height="6" fill="#38BDF8" stroke="#0284C7" strokeWidth="1" />
              <rect x="28" y="17" width="8" height="6" fill="#38BDF8" stroke="#0284C7" strokeWidth="1" />
              <circle cx="20" cy="20" r="2" fill="#FDE047" />
            </svg>
          </div>
        )}

        {item.iconType === 'spacesuit' && (
          <div className="w-12 h-12 flex items-center justify-center bg-slate-800/80 rounded-xl border border-indigo-400/50 shadow-[0_0_15px_rgba(129,140,248,0.4)]">
            <svg viewBox="0 0 40 40" className="w-9 h-9">
              <circle cx="20" cy="14" r="8" fill="#E2E8F0" />
              <ellipse cx="20" cy="14" rx="5" ry="4" fill="#0284C7" />
              <rect x="14" y="22" width="12" height="12" rx="3" fill="#CBD5E1" />
              <rect x="18" y="24" width="4" height="6" fill="#64748B" />
            </svg>
          </div>
        )}

        {item.iconType === 'mirror' && (
          <div className="w-12 h-12 flex items-center justify-center bg-slate-800/80 rounded-xl border border-amber-400/50 shadow-[0_0_15px_rgba(251,191,36,0.4)]">
            <svg viewBox="0 0 40 40" className="w-9 h-9">
              <circle cx="20" cy="20" r="12" fill="#FEF08A" stroke="#F59E0B" strokeWidth="2" />
              <path d="M12 16 L28 24" stroke="#FFF" strokeWidth="2" strokeDasharray="2 2" />
              <circle cx="20" cy="20" r="4" fill="#F59E0B" />
            </svg>
          </div>
        )}

        {item.iconType === 'globe' && (
          <div className="w-12 h-12 flex items-center justify-center bg-slate-800/80 rounded-xl border border-emerald-400/50 shadow-[0_0_15px_rgba(52,211,153,0.4)]">
            <svg viewBox="0 0 40 40" className="w-9 h-9">
              <circle cx="20" cy="20" r="11" fill="#10B981" />
              <path d="M14 14 Q20 18 24 14" stroke="#065F46" strokeWidth="2" fill="none" />
              <path d="M12 24 Q20 20 28 26" stroke="#065F46" strokeWidth="2" fill="none" />
              <circle cx="31" cy="12" r="3" fill="#E2E8F0" />
            </svg>
          </div>
        )}

        {item.iconType === 'antenna' && (
          <div className="w-12 h-12 flex items-center justify-center bg-slate-800/80 rounded-xl border border-rose-400/50 shadow-[0_0_15px_rgba(251,113,133,0.4)]">
            <svg viewBox="0 0 40 40" className="w-9 h-9">
              <path d="M12 28 C12 18, 28 18, 28 28" stroke="#FB7185" strokeWidth="3" fill="none" />
              <line x1="20" y1="20" x2="20" y2="34" stroke="#CBD5E1" strokeWidth="3" />
              <circle cx="20" cy="16" r="3" fill="#F43F5E" />
            </svg>
          </div>
        )}

        {isFound && (
          <div className="absolute -top-1 -right-1 bg-emerald-500 text-white rounded-full p-0.5">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        )}
      </button>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-3 sm:p-5">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-sky-950 via-slate-900 to-indigo-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-300">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
                Misi Objek Tersembunyi: {stepIndex === 0 ? 'Stesen Angkasa Alpha' : 'Kawah Planet Luna'}
              </h3>
              <p className="text-xs text-sky-300">
                Cari dan klik 3 alatan sains angkasa yang tersembunyi dalam pemandangan!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3 py-1 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-amber-300">
              Dijumpai: {foundIds.length} / {items.length}
            </div>
            <button
              onClick={onCancel}
              className="text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              Batal
            </button>
          </div>
        </div>

        {/* Space Scene Canvas Area */}
        <div className="relative flex-1 min-h-[340px] sm:min-h-[420px] bg-gradient-to-b from-[#070b19] via-[#0d1630] to-[#080d1d] overflow-hidden select-none">
          {/* Cosmic Scene Artwork Background */}
          <div className="absolute inset-0 opacity-40 pointer-events-none">
            <div className="absolute top-8 left-12 w-28 h-28 rounded-full bg-indigo-500/20 blur-2xl" />
            <div className="absolute bottom-10 right-20 w-44 h-44 rounded-full bg-sky-500/20 blur-3xl" />
            {/* Distant stars */}
            <div className="absolute top-1/4 left-1/3 w-1 h-1 bg-white rounded-full shadow-[0_0_8px_#fff]" />
            <div className="absolute top-1/2 left-2/3 w-1.5 h-1.5 bg-yellow-200 rounded-full shadow-[0_0_8px_#fde047]" />
            <div className="absolute top-3/4 left-1/4 w-1 h-1 bg-sky-300 rounded-full" />
            <div className="absolute top-1/6 right-1/4 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_#fff]" />
          </div>

          {/* Space Module / Moon Landscape Elements */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30" preserveAspectRatio="none">
            {/* Moon craters / station domes */}
            <ellipse cx="20%" cy="85%" rx="30%" ry="20%" fill="#1E293B" />
            <ellipse cx="80%" cy="90%" rx="35%" ry="22%" fill="#334155" />
            <path d="M 0,260 Q 250,220 500,260 T 1000,250 L 1000,450 L 0,450 Z" fill="#0F172A" />
            {/* Station girders */}
            <line x1="10%" y1="0" x2="30%" y2="50%" stroke="#475569" strokeWidth="2" strokeDasharray="6 4" />
            <line x1="90%" y1="0" x2="70%" y2="50%" stroke="#475569" strokeWidth="2" strokeDasharray="6 4" />
          </svg>

          {/* Interactive Hidden Items */}
          {items.map(item => renderItemGraphic(item, foundIds.includes(item.id)))}

          {/* Last Found Item Popup Feedback */}
          {lastFoundItem && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-slate-900/90 border border-emerald-500/50 rounded-2xl shadow-xl flex items-center gap-2 animate-bounce">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span className="text-xs font-bold text-white">{lastFoundItem.name} dijumpai!</span>
              <span className="text-[11px] text-slate-300">({lastFoundItem.desc})</span>
            </div>
          )}

          {/* Victory Modal Overlay once 3/3 found */}
          {isAllFound && (
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center animate-fadeIn z-30">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 shadow-[0_0_30px_#10B981] mb-4">
                <Sparkles className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-extrabold text-white mb-2">
                Semua 3 Alatan Sains Berjaya Ditemui!
              </h4>
              <p className="text-sm text-slate-300 max-w-md mb-6">
                Tahniah Angkasawan! Maklumat alatan telah dimuat turun. Sekarang, buka soalan cabaran DSKP.
              </p>
              <button
                onClick={() => {
                  soundEffects.playClick();
                  onComplete();
                }}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-400 hover:to-sky-400 text-slate-950 font-black text-sm flex items-center gap-2 shadow-xl shadow-emerald-500/30 cursor-pointer active:scale-95 transition-all"
              >
                <span>Buka Cabaran Soalan Sains</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Footer Checklist / Target Items */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
              <Eye className="w-4 h-4 text-sky-400" /> Cari Senarai Ini:
            </span>
            {items.map(item => {
              const found = foundIds.includes(item.id);
              return (
                <div
                  key={item.id}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
                    found
                      ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
                      : 'bg-slate-900 border-slate-800 text-slate-300'
                  }`}
                >
                  {found ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <div className="w-2 h-2 rounded-full bg-amber-400" />}
                  <span>{item.name}</span>
                </div>
              );
            })}
          </div>

          {!isAllFound && (
            <button
              onClick={() => {
                soundEffects.playClick();
                setHintActive(true);
                setTimeout(() => setHintActive(false), 2500);
              }}
              className="text-xs font-bold text-amber-400 hover:text-amber-300 underline underline-offset-4 cursor-pointer"
            >
              Perlukan Petunjuk?
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
