import React from 'react';
import { LeaderboardEntry } from '../types/game';
import { CharacterAvatar } from './CharacterAvatars';
import { Trophy, Star, Moon, Compass, Rocket, X, Medal } from 'lucide-react';
import { soundEffects } from '../utils/audio';

interface LeaderboardModalProps {
  records: LeaderboardEntry[];
  currentPlayerId: string;
  onClose: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  records,
  currentPlayerId,
  onClose
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border-2 border-amber-500/50 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 px-6 py-4 flex items-center justify-between text-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-slate-950 shadow-inner">
              <Trophy className="w-6 h-6 fill-slate-950" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-wide">PAPAN SKOR ANGKASA</h2>
              <p className="text-xs font-bold opacity-90">Kedudukan Pencapaian Pelajar Terunggul</p>
            </div>
          </div>

          <button
            onClick={() => {
              soundEffects.playClick();
              onClose();
            }}
            className="w-9 h-9 rounded-full bg-slate-950/15 hover:bg-slate-950/30 flex items-center justify-center font-bold text-slate-950 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formula Explainer Strip */}
        <div className="bg-slate-950/80 px-6 py-2.5 border-b border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-300 gap-2">
          <span className="font-semibold text-amber-300">
            Formula: Jumlah Skor = Lunar Rush + Misi Bintang + Eksplorasi Angkasa
          </span>
          <span className="text-slate-400">
            {records.length} Angkasawan Berdaftar
          </span>
        </div>

        {/* Leaderboard Table List */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-2.5 flex-1">
          {records.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <Trophy className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-slate-300">Belum Ada Rekod Papan Skor</h3>
              <p className="text-xs text-slate-400">
                Selesaikan mana-mana misi untuk merekodkan skor pertama anda!
              </p>
            </div>
          ) : (
            records.map((entry, index) => {
              const isCurrent = entry.id === currentPlayerId;
              const rank = index + 1;

              return (
                <div
                  key={entry.id}
                  className={`p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isCurrent
                      ? 'bg-amber-950/60 border-amber-400 ring-2 ring-amber-400/50 shadow-lg'
                      : 'bg-slate-800/60 border-slate-700/80 hover:bg-slate-800'
                  }`}
                >
                  {/* Left: Rank, Avatar & Player Info */}
                  <div className="flex items-center gap-3">
                    {/* Rank Badge */}
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm shrink-0">
                      {rank === 1 ? (
                        <span className="text-amber-400 flex items-center gap-0.5">
                          <Medal className="w-5 h-5 fill-amber-400" />
                        </span>
                      ) : rank === 2 ? (
                        <span className="text-slate-300 flex items-center gap-0.5">
                          <Medal className="w-5 h-5 fill-slate-300" />
                        </span>
                      ) : rank === 3 ? (
                        <span className="text-amber-600 flex items-center gap-0.5">
                          <Medal className="w-5 h-5 fill-amber-600" />
                        </span>
                      ) : (
                        <span className="text-slate-400">#{rank}</span>
                      )}
                    </div>

                    <CharacterAvatar avatarId={entry.avatarId} size={42} />

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white tracking-wide">
                          {entry.name}
                        </h4>
                        {isCurrent && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase">
                            Anda
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                        <span className="flex items-center gap-1 text-sky-400">
                          <Moon className="w-3 h-3" /> {entry.lunarScore}
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1 text-purple-400">
                          <Compass className="w-3 h-3" /> {entry.starScore}
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1 text-emerald-400">
                          <Rocket className="w-3 h-3" /> {entry.galaxyScore}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Stars count & Total Score */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-700/60">
                    <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                      <Star className="w-4 h-4 fill-amber-400" />
                      <span>{entry.starsCount}/3 ⭐</span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-bold">
                        Jumlah Skor
                      </span>
                      <span className="text-lg font-black text-amber-300 tabular-nums">
                        {entry.totalScore}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-950 px-6 py-3.5 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Kedudukan dikemas kini secara automatik sepanjang permainan.
          </span>
          <button
            onClick={() => {
              soundEffects.playClick();
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
