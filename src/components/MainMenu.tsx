import React, { useState } from 'react';
import { GameProgress } from '../types/game';
import { ASTRONAUT_AVATARS } from '../data/learningContent';
import { CharacterAvatar } from './CharacterAvatars';
import { LeaderboardModal } from './LeaderboardModal';
import { PlayerProfileModal } from './PlayerProfileModal';
import { getLeaderboard } from '../utils/leaderboard';
import { soundEffects } from '../utils/audio';
import {
  Rocket,
  Moon,
  Sparkles,
  Star,
  Play,
  RotateCcw,
  BookOpen,
  Volume2,
  VolumeX,
  Info,
  CheckCircle2,
  ChevronRight,
  Telescope,
  Trophy,
  User,
  Edit3
} from 'lucide-react';

interface MainMenuProps {
  progress: GameProgress;
  onUpdatePlayer: (name: string, avatarId: string) => void;
  onStartActivity: (activity: 'lunar_rush' | 'star_quest' | 'galaxy_explorer') => void;
  onResetGame: () => void;
  onToggleAudio: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  progress,
  onUpdatePlayer,
  onStartActivity,
  onResetGame,
  onToggleAudio
}) => {
  const [showInstructions, setShowInstructions] = useState<boolean>(false);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);
  const [showLeaderboard, setShowLeaderboard] = useState<boolean>(false);
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);

  const totalStarsCount =
    (progress.starsEarned.lunarRush ? 1 : 0) +
    (progress.starsEarned.starQuest ? 1 : 0) +
    (progress.starsEarned.galaxyExplorer ? 1 : 0);

  const hasExistingProgress =
    progress.totalScore > 0 ||
    totalStarsCount > 0 ||
    progress.lunarRushCompletedCheckpoints.length > 0;

  const currentAvatar =
    ASTRONAUT_AVATARS.find(a => a.id === progress.avatarId) || ASTRONAUT_AVATARS[0];

  const handleLaunchFirstAvailable = () => {
    soundEffects.playClick();
    if (!progress.starsEarned.lunarRush) {
      onStartActivity('lunar_rush');
    } else if (!progress.starsEarned.starQuest) {
      onStartActivity('star_quest');
    } else {
      onStartActivity('galaxy_explorer');
    }
  };

  return (
    <div className="relative w-full min-h-[92vh] flex flex-col items-center justify-between p-3 sm:p-6 lg:p-8 bg-slate-950 text-white select-none overflow-hidden">
      {/* Background Cosmic Starfield & Cheerful Aurora Nebulas */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-1/4 w-96 h-96 rounded-full bg-sky-500/15 blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 rounded-full bg-purple-500/15 blur-3xl" />
        <div className="absolute top-1/2 right-10 w-80 h-80 rounded-full bg-amber-400/15 blur-3xl" />
        <div className="absolute -bottom-20 left-10 w-80 h-80 rounded-full bg-pink-500/15 blur-3xl" />
      </div>

      {/* Top Header Bar */}
      <header className="relative w-full max-w-5xl flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800/80 z-20">
        {/* Player Profile Badge (Clickable to change name & avatar) */}
        <button
          onClick={() => {
            soundEffects.playClick();
            setShowProfileModal(true);
          }}
          type="button"
          className="flex items-center gap-2.5 p-1.5 pr-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-700/80 shadow-md transition-all active:scale-95 cursor-pointer text-left"
          title="Klik untuk ubah nama atau avatar"
        >
          <CharacterAvatar avatarId={progress.avatarId} size={42} />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs sm:text-sm font-black text-white">
                {progress.userName || 'Angkasawan'}
              </span>
              <Edit3 className="w-3 h-3 text-sky-400" />
            </div>
            <span className="text-[10px] text-sky-300 font-semibold block">
              {currentAvatar.name} · {currentAvatar.title}
            </span>
          </div>
        </button>

        {/* Top Controls: Score, Stars, Leaderboard, Audio */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Total Score Badge */}
          <div className="flex items-center gap-2 bg-slate-900/90 px-3.5 py-1.5 rounded-2xl border border-slate-700 shadow-sm">
            <span className="text-xs text-slate-400 font-semibold">Skor:</span>
            <span className="text-sm sm:text-base font-black text-amber-300 tabular-nums">
              {progress.totalScore}
            </span>
          </div>

          {/* Stars Tally Badge */}
          <div className="flex items-center gap-1.5 bg-slate-900/90 px-3 py-1.5 rounded-2xl border border-slate-700 shadow-sm">
            <div className="flex items-center gap-0.5">
              {[0, 1, 2].map(idx => (
                <Star
                  key={idx}
                  className={`w-4 h-4 ${
                    idx < totalStarsCount
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-slate-600'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-black text-amber-300 ml-1">
              {totalStarsCount}/3
            </span>
          </div>

          {/* Leaderboard Button */}
          <button
            onClick={() => {
              soundEffects.playClick();
              setShowLeaderboard(true);
            }}
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-gradient-to-r from-amber-500/20 to-yellow-500/20 hover:from-amber-500/30 hover:to-yellow-500/30 text-amber-300 border border-amber-400/40 text-xs font-black transition-all cursor-pointer shadow-sm active:scale-95"
            title="Papan Skor Pemain"
          >
            <Trophy className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="hidden sm:inline">Papan Skor</span>
          </button>

          {/* DSKP Guide Button */}
          <button
            onClick={() => {
              soundEffects.playClick();
              setShowInstructions(true);
            }}
            type="button"
            className="p-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 transition-colors cursor-pointer"
            title="Panduan DSKP Sains Unit 9"
          >
            <BookOpen className="w-4 h-4" />
          </button>

          {/* Audio Toggle Button */}
          <button
            onClick={() => {
              soundEffects.playClick();
              onToggleAudio();
            }}
            type="button"
            className="p-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
            title={progress.audioEnabled ? 'Bisukan Bunyi' : 'Buka Bunyi'}
          >
            {progress.audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Hero Title Section */}
      <div className="relative text-center my-4 sm:my-6 z-10 max-w-3xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/15 border border-sky-400/30 text-xs font-bold text-sky-300">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>DSKP KSSR Sains Tahun 5 · Unit 9: Fasa Bulan dan Buruj</span>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-indigo-200 to-amber-300 drop-shadow-sm">
          GALAKSI SAINS
        </h1>
        <h2 className="text-base sm:text-2xl font-black tracking-widest text-sky-400 uppercase">
          PENGEMBARAAN ANGKASA
        </h2>
        <p className="text-xs sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
          Kembara larian 3 lorong di permukaan Bulan, pecahkan misteri mini padanan buruj, dan takluki peta pengembaraan planet!
        </p>

        {/* Action Buttons: "Sambung Permainan" & "MULA PERMAINAN" */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={handleLaunchFirstAvailable}
            type="button"
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 via-indigo-500 to-amber-400 hover:from-sky-400 hover:to-amber-300 text-slate-950 font-black text-sm sm:text-base tracking-wide shadow-xl shadow-sky-500/25 active:scale-95 transition-all cursor-pointer flex items-center gap-2.5"
          >
            <Play className="w-5 h-5 fill-slate-950" />
            <span>{hasExistingProgress ? 'Sambung Permainan' : 'MULA PERMAINAN'}</span>
          </button>

          {hasExistingProgress && (
            <button
              onClick={() => setShowResetConfirm(true)}
              type="button"
              className="px-5 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 cursor-pointer shadow"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Permainan Baharu</span>
            </button>
          )}
        </div>
      </div>

      {/* 3 Main Game Activity Cards */}
      <div className="relative w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-4 my-4 sm:my-6 z-10">
        {/* Card 1: Lunar Rush (3-Lane Runner) */}
        <div
          onClick={() => {
            soundEffects.playClick();
            onStartActivity('lunar_rush');
          }}
          className={`group relative p-5 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
            progress.starsEarned.lunarRush
              ? 'bg-gradient-to-b from-sky-950/70 to-slate-900/90 border-emerald-500/60 shadow-lg'
              : 'bg-gradient-to-b from-slate-900/90 to-slate-950/90 hover:from-sky-950/50 hover:to-slate-900 border-slate-800 hover:border-sky-500/60'
          }`}
        >
          {progress.starsEarned.lunarRush && (
            <div className="absolute top-3.5 right-3.5 flex items-center gap-1 text-xs font-black text-emerald-400 bg-emerald-950/90 px-2.5 py-0.5 rounded-full border border-emerald-500/40">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Selesai (+1 ⭐)</span>
            </div>
          )}

          <div>
            <div className="w-12 h-12 rounded-2xl bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-400/40 mb-3 group-hover:scale-110 transition-transform">
              <Moon className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black text-sky-400 uppercase tracking-widest block">
              Aktiviti 1 · Fasa Bulan
            </span>
            <h3 className="text-lg font-black text-white mt-1 group-hover:text-sky-300 transition-colors">
              Misi Bulan – Lunar Rush
            </h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Larian 3 lorong pandangan belakang seperti Subway Surfers! Elak batu bulan, kumpul bintang, dan selesaikan 7 stesen soalan Fasa Bulan.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              Skor: <strong className="text-amber-300">{progress.scores.lunarRush}</strong>
            </span>
            <span className="text-xs font-black text-sky-400 group-hover:translate-x-1 transition-transform flex items-center">
              Main Misi <ChevronRight className="w-4 h-4 ml-0.5" />
            </span>
          </div>
        </div>

        {/* Card 2: Star Quest (Match 3 Mini-Game) */}
        <div
          onClick={() => {
            soundEffects.playClick();
            onStartActivity('star_quest');
          }}
          className={`group relative p-5 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
            progress.starsEarned.starQuest
              ? 'bg-gradient-to-b from-purple-950/70 to-slate-900/90 border-emerald-500/60 shadow-lg'
              : 'bg-gradient-to-b from-slate-900/90 to-slate-950/90 hover:from-purple-950/50 hover:to-slate-900 border-slate-800 hover:border-purple-500/60'
          }`}
        >
          {progress.starsEarned.starQuest && (
            <div className="absolute top-3.5 right-3.5 flex items-center gap-1 text-xs font-black text-emerald-400 bg-emerald-950/90 px-2.5 py-0.5 rounded-full border border-emerald-500/40">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Selesai (+1 ⭐)</span>
            </div>
          )}

          <div>
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-400/40 mb-3 group-hover:scale-110 transition-transform">
              <Telescope className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest block">
              Aktiviti 2 · Buruj
            </span>
            <h3 className="text-lg font-black text-white mt-1 group-hover:text-purple-300 transition-colors">
              Misi Bintang – Star Quest
            </h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Permainan mini padanan 3 objek angkasa seperti Candy Crush! Selesaikan objektif setiap checkpoint sebelum menjawab soalan 4 buruj.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              Skor: <strong className="text-amber-300">{progress.scores.starQuest}</strong>
            </span>
            <span className="text-xs font-black text-purple-400 group-hover:translate-x-1 transition-transform flex items-center">
              Main Misi <ChevronRight className="w-4 h-4 ml-0.5" />
            </span>
          </div>
        </div>

        {/* Card 3: Galaxy Explorer (Planet Adventure Map) */}
        <div
          onClick={() => {
            soundEffects.playClick();
            onStartActivity('galaxy_explorer');
          }}
          className={`group relative p-5 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
            progress.starsEarned.galaxyExplorer
              ? 'bg-gradient-to-b from-amber-950/70 to-slate-900/90 border-emerald-500/60 shadow-lg'
              : 'bg-gradient-to-b from-slate-900/90 to-slate-950/90 hover:from-amber-950/50 hover:to-slate-900 border-slate-800 hover:border-amber-500/60'
          }`}
        >
          {progress.starsEarned.galaxyExplorer && (
            <div className="absolute top-3.5 right-3.5 flex items-center gap-1 text-xs font-black text-emerald-400 bg-emerald-950/90 px-2.5 py-0.5 rounded-full border border-emerald-500/40">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Selesai (+1 ⭐)</span>
            </div>
          )}

          <div>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-400/40 mb-3 group-hover:scale-110 transition-transform">
              <Rocket className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest block">
              Aktiviti 3 · Peta Pengembaraan Planet
            </span>
            <h3 className="text-lg font-black text-white mt-1 group-hover:text-amber-300 transition-colors">
              Eksplorasi Angkasa – Galaxy Explorer
            </h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Peta interaktif 7 planet bercahaya menggabungkan Fasa Bulan dan Buruj! Jalankan mini-misi angkasa dan aktifkan Teras Galaksi.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              Skor: <strong className="text-amber-300">{progress.scores.galaxyExplorer}</strong>
            </span>
            <span className="text-xs font-black text-amber-400 group-hover:translate-x-1 transition-transform flex items-center">
              Main Misi <ChevronRight className="w-4 h-4 ml-0.5" />
            </span>
          </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <footer className="relative w-full max-w-5xl flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 pt-3 border-t border-slate-900 z-10">
        <div className="flex items-center gap-1.5">
          <Info className="w-4 h-4 text-sky-400" />
          <span>Berdasarkan DSKP KSSR Sains Tahun 5 Unit 9 (Fasa Bulan & Buruj).</span>
        </div>

        <button
          onClick={() => setShowResetConfirm(true)}
          type="button"
          className="flex items-center gap-1 text-rose-400/80 hover:text-rose-400 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Set Semula Kemajuan</span>
        </button>
      </footer>

      {/* Instructions / Panduan Modal */}
      {showInstructions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-md">
          <div className="w-full max-w-xl bg-slate-900 border-2 border-sky-500/50 rounded-3xl p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-5 h-5 text-sky-400" />
                <h3 className="text-base sm:text-lg font-black text-white">
                  Panduan Permainan & DSKP Sains
                </h3>
              </div>
              <button
                onClick={() => setShowInstructions(false)}
                className="text-slate-400 hover:text-white font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                <h4 className="font-black text-sky-300">1. Objektif Pembelajaran (DSKP Sains Tahun 5)</h4>
                <ul className="list-disc list-inside space-y-1 text-slate-300 text-xs">
                  <li><strong>9.1 Fasa Bulan:</strong> Bulan tidak mengeluarkan cahaya tetapi memantulkan cahaya Matahari. Bulan berputar pada paksinya dan beredar mengelilingi Bumi (27 1/3 hari, lawan arah jam). Menyusun fasa-fasa Bulan dalam Takwim Qamari.</li>
                  <li><strong>9.2 Buruj:</strong> Mengenal pasti maksud buruj, corak 4 buruj (Biduk, Belantik, Pari, Skorpio), serta kegunaannya sebagai petunjuk arah dan petunjuk musim.</li>
                </ul>
              </div>

              <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                <h4 className="font-black text-amber-300">2. Cara Bermain Tiga Aktiviti</h4>
                <ul className="list-disc list-inside space-y-1 text-slate-300 text-xs">
                  <li><strong>Lunar Rush:</strong> Larian 3 lorong Subway Surfers! Leret/kekunci Kiri, Kanan, Lompat dan Gelongsor. Berhenti di stesen untuk menjawab soalan Fasa Bulan.</li>
                  <li><strong>Misi Bintang:</strong> Padankan 3 objek angkasa seiras mengikut objektif sasaran, kemudian selesaikan cabaran rahsia 4 buruj.</li>
                  <li><strong>Eksplorasi Angkasa:</strong> Ikuti peta pengembaraan 7 planet untuk mengaktifkan teras galaksi. Planet boleh diulang semula!</li>
                </ul>
              </div>
            </div>

            <button
              onClick={() => setShowInstructions(false)}
              className="w-full py-3 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-sm"
            >
              Faham, Mari Mula Bermain!
            </button>
          </div>
        </div>
      )}

      {/* Leaderboard Modal */}
      {showLeaderboard && (
        <LeaderboardModal
          records={getLeaderboard()}
          currentPlayerId={progress.playerId}
          onClose={() => setShowLeaderboard(false)}
        />
      )}

      {/* Player Profile / Change Name Modal */}
      {showProfileModal && (
        <PlayerProfileModal
          initialName={progress.userName}
          initialAvatarId={progress.avatarId}
          onSave={(name, avatarId) => {
            onUpdatePlayer(name, avatarId);
            setShowProfileModal(false);
          }}
          onClose={() => setShowProfileModal(false)}
        />
      )}

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="w-full max-w-md bg-slate-900 border-2 border-rose-500/50 rounded-3xl p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-white">Mulakan Permainan Baharu?</h3>
            <p className="text-xs text-slate-300">
              Pengesahan: Semua markah terkumpul dan kemajuan checkpoint akan diset semula ke sifar bagi membolehkan sesi baharu bermula.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                type="button"
                className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  soundEffects.playClick();
                  onResetGame();
                  setShowResetConfirm(false);
                }}
                type="button"
                className="py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black cursor-pointer"
              >
                Ya, Set Semula
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
