import React, { useState } from 'react';
import { GameProgress } from '../types/game';
import { GALAXY_EXPLORER_CHECKPOINTS } from '../data/learningContent';
import { CharacterAvatar } from './CharacterAvatars';
import { QuestionModal } from './QuestionModal';
import { soundEffects } from '../utils/audio';
import {
  ArrowLeft,
  Rocket,
  Moon,
  Sparkles,
  Star,
  Award,
  Compass,
  Lock,
  CheckCircle2,
  RotateCcw,
  Play,
  Check
} from 'lucide-react';

interface GalaxyExplorerProps {
  progress: GameProgress;
  onUpdateScore: (newScore: number) => void;
  onCompleteMission: (mission: 'galaxyExplorer') => void;
  onBackToMenu: () => void;
}

// 7 Planet destinations on the galaxy map
const PLANET_DESTINATIONS = [
  { step: 1, name: 'Stesen Angkasa Alpha', color: 'from-sky-400 to-blue-600', x: 12, y: 75, miniTask: 'Kumpul 3 Bintang Tenaga Stesen' },
  { step: 2, name: 'Planet Luna', color: 'from-amber-300 to-yellow-500', x: 25, y: 40, miniTask: 'Seimbangkan Orbit Putaran Bulan' },
  { step: 3, name: 'Nebula Qamari', color: 'from-teal-300 to-emerald-500', x: 42, y: 68, miniTask: 'Susun Kitaran Fasa Qamari' },
  { step: 4, name: 'Sektor 4 Buruj', color: 'from-purple-400 to-indigo-600', x: 58, y: 32, miniTask: 'Sambungkan 3 Gugusan Bintang' },
  { step: 5, name: 'Pulsar Navigasi', color: 'from-rose-400 to-pink-600', x: 72, y: 65, miniTask: 'Kalibrasi Kompas Utara & Selatan' },
  { step: 6, name: 'Planet Musim Pertanian', color: 'from-orange-400 to-amber-600', x: 82, y: 35, miniTask: 'Hantar Benih Mengikut Musim' },
  { step: 7, name: 'Teras Galaksi', color: 'from-yellow-300 via-rose-500 to-purple-600', x: 92, y: 62, miniTask: 'Aktifkan 3 Kristal Teras Galaksi' }
];

export const GalaxyExplorer: React.FC<GalaxyExplorerProps> = ({
  progress,
  onUpdateScore,
  onCompleteMission,
  onBackToMenu
}) => {
  // Checkpoint progress: 0 to 6
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(() => {
    return Math.min(progress.galaxyExplorerCompletedCheckpoints.length, 6);
  });
  const [selectedPlanetIdx, setSelectedPlanetIdx] = useState<number | null>(null);
  const [activeMiniTaskIdx, setActiveMiniTaskIdx] = useState<number | null>(null);
  const [activeChallenge, setActiveChallenge] = useState<(typeof GALAXY_EXPLORER_CHECKPOINTS)[0] | null>(null);
  const [isGalaxyComplete, setIsGalaxyComplete] = useState<boolean>(progress.starsEarned.galaxyExplorer);

  // Mini-Task Interactive State (collecting 3 cosmic energy spheres)
  const [miniTaskStarsCollected, setMiniTaskStarsCollected] = useState<number>(0);

  const totalSteps = GALAXY_EXPLORER_CHECKPOINTS.length; // 7

  const handlePlanetSelect = (idx: number) => {
    // Only allow if unlocked (idx <= completed length or already completed)
    const isUnlocked = idx <= currentStepIdx || progress.galaxyExplorerCompletedCheckpoints.includes(idx + 1);

    if (!isUnlocked) {
      soundEffects.playWrong();
      return;
    }

    soundEffects.playThruster();
    setSelectedPlanetIdx(idx);
    setMiniTaskStarsCollected(0);
    setActiveMiniTaskIdx(idx);
  };

  // Mini Task Completion -> triggers educational question
  const handleCollectMiniTaskStar = () => {
    soundEffects.playCollect();
    const nextCount = miniTaskStarsCollected + 1;
    setMiniTaskStarsCollected(nextCount);

    if (nextCount >= 3) {
      soundEffects.playLevelUp();
      setTimeout(() => {
        if (selectedPlanetIdx !== null) {
          setActiveChallenge(GALAXY_EXPLORER_CHECKPOINTS[selectedPlanetIdx]);
          setActiveMiniTaskIdx(null);
        }
      }, 500);
    }
  };

  // Educational question completion
  const handleChallengeSuccess = (pointsAwarded: number) => {
    const isAlreadyCompleted = progress.galaxyExplorerCompletedCheckpoints.includes(
      (selectedPlanetIdx ?? 0) + 1
    );

    // Only award points on first clear to prevent infinite score grinding
    if (!isAlreadyCompleted) {
      onUpdateScore(progress.totalScore + pointsAwarded);
    }

    setActiveChallenge(null);
    setSelectedPlanetIdx(null);

    const nextStep = Math.max(currentStepIdx, (selectedPlanetIdx ?? 0) + 1);
    setCurrentStepIdx(nextStep);

    if (nextStep >= totalSteps) {
      setIsGalaxyComplete(true);
      onCompleteMission('galaxyExplorer');
      soundEffects.playLevelUp();
    } else {
      soundEffects.playCorrect();
    }
  };

  const completedCount = progress.galaxyExplorerCompletedCheckpoints.length;
  const currentPercent = Math.min(100, Math.round((completedCount / totalSteps) * 100));

  return (
    <div className="relative w-full min-h-[92vh] flex flex-col items-center bg-slate-950 text-white select-none overflow-hidden">
      {/* Top HUD */}
      <div className="w-full max-w-5xl px-4 py-3 flex items-center justify-between border-b border-slate-800 bg-slate-900/90 backdrop-blur z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              soundEffects.playClick();
              onBackToMenu();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-sky-300 border border-slate-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Menu Utama
          </button>
          <div className="hidden sm:block">
            <h2 className="text-sm font-bold text-white tracking-wide">
              Eksplorasi Angkasa – Galaxy Explorer
            </h2>
            <span className="text-[11px] text-amber-400 font-medium">
              Peta Pengembaraan Planet · Fasa Bulan & Buruj
            </span>
          </div>
        </div>

        {/* Center Progress Bar */}
        <div className="flex-1 max-w-xs mx-4">
          <div className="flex items-center justify-between text-[11px] mb-1 font-semibold">
            <span className="text-slate-300">
              Planet Selesai: {completedCount} / {totalSteps}
            </span>
            <span className="text-amber-400">{currentPercent}% Lengkap</span>
          </div>
          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
            <div
              className="h-full bg-gradient-to-r from-teal-400 via-indigo-400 to-amber-400 transition-all duration-300 rounded-full"
              style={{ width: `${currentPercent}%` }}
            />
          </div>
        </div>

        {/* Right Score */}
        <div className="text-right">
          <div className="text-[10px] text-slate-400 uppercase font-bold">Jumlah Skor</div>
          <div className="text-base font-black text-amber-300 tabular-nums">
            {progress.totalScore}
          </div>
        </div>
      </div>

      {/* Main Interactive Planet Map Area */}
      <div className="relative w-full max-w-5xl flex-1 flex flex-col justify-between p-4 sm:p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1B1947] via-[#090D1A] to-[#030611] border-x border-slate-800 shadow-2xl min-h-[500px]">
        {/* Ambient Space Elements & Cheerful Nebulas */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-75">
          <div className="absolute top-10 right-20 w-80 h-80 rounded-full bg-purple-500/15 blur-3xl" />
          <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-sky-500/15 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-amber-400/10 blur-2xl" />
        </div>

        {/* SVG Hyperspace Cosmic Connecting Route */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <linearGradient id="galaxyTrail" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="35%" stopColor="#818CF8" />
              <stop offset="70%" stopColor="#EC4899" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
          </defs>

          {/* Dotted connecting trail */}
          <path
            d="M 12% 75% Q 18% 50% 25% 40% T 42% 68% T 58% 32% T 72% 65% T 82% 35% T 92% 62%"
            fill="none"
            stroke="#334155"
            strokeWidth="4"
            strokeDasharray="8 6"
          />

          {/* Glowing unlocked route */}
          <path
            d="M 12% 75% Q 18% 50% 25% 40% T 42% 68% T 58% 32% T 72% 65% T 82% 35% T 92% 62%"
            fill="none"
            stroke="url(#galaxyTrail)"
            strokeWidth="5"
            strokeLinecap="round"
            opacity="0.85"
          />
        </svg>

        {/* Interactive Planets on Map */}
        <div className="relative w-full h-[360px] sm:h-[400px]">
          {PLANET_DESTINATIONS.map((planet, idx) => {
            const isCompleted = progress.galaxyExplorerCompletedCheckpoints.includes(idx + 1);
            const isCurrent = idx === currentStepIdx && !isCompleted;
            const isLocked = idx > currentStepIdx && !isCompleted;

            return (
              <div
                key={planet.step}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group"
                style={{ left: `${planet.x}%`, top: `${planet.y}%` }}
                onClick={() => handlePlanetSelect(idx)}
              >
                {/* Active Pulsing Ring */}
                {isCurrent && (
                  <div className="absolute inset-0 w-16 h-16 -left-2 -top-2 rounded-full bg-amber-400/30 animate-ping pointer-events-none" />
                )}

                {/* Planet Sphere */}
                <div
                  className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-125 shadow-xl ${
                    isCompleted
                      ? 'bg-gradient-to-tr from-emerald-600 to-teal-400 border-2 border-emerald-300 ring-4 ring-emerald-500/30 shadow-[0_0_20px_#10b981]'
                      : isCurrent
                      ? `bg-gradient-to-tr ${planet.color} border-2 border-white ring-4 ring-amber-400/50 shadow-[0_0_25px_#f59e0b] animate-bounce`
                      : 'bg-slate-800/80 border-2 border-slate-700 opacity-60'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-6 h-6 text-white stroke-[3]" />
                  ) : isLocked ? (
                    <Lock className="w-5 h-5 text-slate-400" />
                  ) : (
                    <Sparkles className="w-6 h-6 text-white animate-pulse" />
                  )}

                  {/* Step Badge */}
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-slate-950 border border-slate-600 text-[10px] font-black flex items-center justify-center text-white">
                    {planet.step}
                  </span>
                </div>

                {/* Planet Label Card */}
                <div
                  className={`absolute top-14 sm:top-16 left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-1 rounded-xl border text-center transition-all z-20 shadow-lg ${
                    isCurrent
                      ? 'bg-amber-950/95 border-amber-400 text-amber-200 ring-1 ring-amber-400 scale-105'
                      : isCompleted
                      ? 'bg-slate-900/90 border-emerald-500/60 text-emerald-300'
                      : 'bg-slate-950/80 border-slate-800 text-slate-400'
                  }`}
                >
                  <span className="text-[11px] sm:text-xs font-black block">{planet.name}</span>
                  <span className="text-[9px] text-slate-300 block">
                    {isCompleted ? '✓ Boleh Diulang' : isLocked ? 'Terkunci' : 'Destinasi Semasa'}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Astronaut Position Marker on Current Planet */}
          {currentStepIdx < totalSteps && (
            <div
              className="absolute z-30 transition-all duration-700 pointer-events-none"
              style={{
                left: `calc(${PLANET_DESTINATIONS[currentStepIdx].x}% - 35px)`,
                top: `calc(${PLANET_DESTINATIONS[currentStepIdx].y}% - 65px)`
              }}
            >
              <CharacterAvatar
                avatarId={progress.avatarId}
                size={54}
                isAnimated={true}
                action="celebrate"
              />
            </div>
          )}
        </div>

        {/* Bottom Legend & Guidance Strip */}
        <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 z-20 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-400/30">
              <Rocket className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-amber-400 font-extrabold uppercase tracking-wider block">
                Pengembaraan Galaksi
              </span>
              <h4 className="text-xs sm:text-sm font-extrabold text-white">
                Pilih mana-mana planet yang telah dibuka untuk menjalankan misi angkasa!
              </h4>
              <p className="text-[11px] text-slate-400">
                Setiap planet mempunyai mini-misi pengumpulan sebelum menjawab soalan pembelajaran. Anda boleh mengulang planet selesai bila-bila masa.
              </p>
            </div>
          </div>

          <button
            onClick={() => handlePlanetSelect(Math.min(currentStepIdx, 6))}
            type="button"
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-500/25 active:scale-95 cursor-pointer shrink-0"
          >
            Teroka Planet #{Math.min(currentStepIdx + 1, 7)}
          </button>
        </div>
      </div>

      {/* Mini-Mission Pre-Question Modal */}
      {activeMiniTaskIdx !== null && selectedPlanetIdx !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-slate-900 border-2 border-amber-500/60 rounded-3xl p-6 text-center space-y-5 shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto border border-amber-400/40">
              <Sparkles className="w-8 h-8 animate-spin" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-amber-400 font-extrabold">
                Mini Misi Planet #{selectedPlanetIdx + 1}
              </span>
              <h3 className="text-xl font-black text-white">
                {PLANET_DESTINATIONS[selectedPlanetIdx].name}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Tugasan: {PLANET_DESTINATIONS[selectedPlanetIdx].miniTask}.
                Klik bintang kosmik di bawah untuk mengumpulkan tenaga sebelum memulakan soalan pembelajaran!
              </p>
            </div>

            {/* Interactive Stars to Click */}
            <div className="flex items-center justify-center gap-4 py-3">
              {[0, 1, 2].map(starIndex => {
                const isCollected = starIndex < miniTaskStarsCollected;
                return (
                  <button
                    key={starIndex}
                    type="button"
                    onClick={handleCollectMiniTaskStar}
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
                      isCollected
                        ? 'bg-amber-500 text-slate-950 shadow-[0_0_15px_#f59e0b] scale-110'
                        : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 animate-pulse'
                    }`}
                  >
                    <Star className={`w-8 h-8 ${isCollected ? 'fill-slate-950' : 'fill-amber-400'}`} />
                  </button>
                );
              })}
            </div>

            <span className="text-xs font-bold text-amber-300 block">
              Terkumpul: {miniTaskStarsCollected} / 3 Bintang Tenaga
            </span>
          </div>
        </div>
      )}

      {/* Checkpoint Challenge Question Modal */}
      {activeChallenge && (
        <QuestionModal
          question={{
            id: activeChallenge.step,
            title: `${activeChallenge.name}: ${activeChallenge.challengeTitle}`,
            topic: 'gabungan',
            standardLearning: activeChallenge.standardLearning,
            questionText: activeChallenge.questionText,
            type: activeChallenge.type,
            options: activeChallenge.options,
            correctOptionId: activeChallenge.correctOptionId,
            sequenceItems: activeChallenge.sequenceItems,
            correctSequenceIds: activeChallenge.correctSequenceIds,
            matchPairs: activeChallenge.matchPairs,
            explanation: activeChallenge.explanation,
            factSource: 'DSKP KSSR Sains Tahun 5 Unit 9',
            points: activeChallenge.points
          }}
          checkpointNumber={activeChallenge.step}
          totalCheckpoints={totalSteps}
          onAnswerCorrect={handleChallengeSuccess}
        />
      )}

      {/* Galaxy Victory Modal */}
      {isGalaxyComplete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="w-full max-w-lg bg-slate-900 border-2 border-amber-500/60 rounded-3xl p-6 text-center space-y-5 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto border border-amber-400/40">
              <Award className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">
                Galaksi Berjaya Diteroka!
              </span>
              <h3 className="text-2xl font-black text-white">Teras Galaksi Berjaya Diaktifkan!</h3>
              <p className="text-sm text-slate-300">
                Syabas dan tahniah! Anda telah membuktikan penguasaan ilmu Sains yang cemerlang mengenai Fasa Bulan dan Buruj merentasi seluruh Galaksi Sains!
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-around">
              <div>
                <span className="text-xs text-slate-400 block">Bintang Misi</span>
                <div className="flex items-center gap-1 text-amber-400 font-bold mt-1">
                  <Star className="w-5 h-5 fill-amber-400" />
                  <span>+1 Bintang</span>
                </div>
              </div>
              <div className="h-8 w-px bg-slate-800" />
              <div>
                <span className="text-xs text-slate-400 block">Status Perjalanan</span>
                <span className="text-base font-bold text-emerald-400 mt-1 block">
                  100% Selesai
                </span>
              </div>
              <div className="h-8 w-px bg-slate-800" />
              <div>
                <span className="text-xs text-slate-400 block">Jumlah Skor</span>
                <span className="text-base font-bold text-amber-300 mt-1 block">
                  {progress.totalScore}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  soundEffects.playClick();
                  onBackToMenu();
                }}
                className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm transition-all shadow-lg shadow-amber-500/30 cursor-pointer"
              >
                Kembali ke Menu Utama
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
