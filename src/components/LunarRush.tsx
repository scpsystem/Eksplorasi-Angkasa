import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameProgress } from '../types/game';
import { LUNAR_RUSH_QUESTIONS } from '../data/learningContent';
import { CharacterAvatar } from './CharacterAvatars';
import { QuestionModal } from './QuestionModal';
import { soundEffects } from '../utils/audio';
import { ArrowLeft, Star, Sparkles, Award, ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from 'lucide-react';

interface LunarRushProps {
  progress: GameProgress;
  onUpdateScore: (newScore: number) => void;
  onCompleteMission: (mission: 'lunarRush') => void;
  onBackToMenu: () => void;
}

// 3 Lanes: 0 = Kiri, 1 = Tengah, 2 = Kanan
type LaneIndex = 0 | 1 | 2;

interface TrackItem {
  id: number;
  lane: LaneIndex;
  z: number; // 0 (horizon/far) to 100 (player near)
  type: 'star' | 'superStar';
  collected?: boolean;
}

export const LunarRush: React.FC<LunarRushProps> = ({
  progress,
  onUpdateScore,
  onCompleteMission,
  onBackToMenu
}) => {
  // Game running state
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentCheckpointIdx, setCurrentCheckpointIdx] = useState<number>(0);
  const [activeQuestion, setActiveQuestion] = useState<(typeof LUNAR_RUSH_QUESTIONS)[0] | null>(null);
  const [isMissionComplete, setIsMissionComplete] = useState<boolean>(false);
  const [isStationDocked, setIsStationDocked] = useState<boolean>(false);

  // Astronaut Runner State
  const [currentLane, setCurrentLane] = useState<LaneIndex>(1); // starts middle
  const [isJumping, setIsJumping] = useState<boolean>(false);
  const [isSliding, setIsSliding] = useState<boolean>(false);
  const [jumpHeight, setJumpHeight] = useState<number>(0); // 0 to 100
  const [starsCollected, setStarsCollected] = useState<number>(0);
  const [distance, setDistance] = useState<number>(0);

  // Checkpoint thresholds in meters (~35 saat bagi setiap checkpoint pada kelajuan 30 m/s)
  const CHECKPOINT_DISTANCE = 1050;
  const targetCheckpoints = LUNAR_RUSH_QUESTIONS.length; // 7

  // Track items (hanya bintang bercahaya merentasi 3 lorong tanpa sebarang halangan)
  const [trackItems, setTrackItems] = useState<TrackItem[]>([]);

  // Refs for smooth animation loop & physics without setState-in-render issues
  const requestRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());
  const currentLaneRef = useRef<LaneIndex>(1);
  const isJumpingRef = useRef<boolean>(false);
  const isSlidingRef = useRef<boolean>(false);
  const distanceRef = useRef<number>(0);
  const trackItemsRef = useRef<TrackItem[]>([]);
  const currentCheckpointIdxRef = useRef<number>(0);
  const activeQuestionRef = useRef<(typeof LUNAR_RUSH_QUESTIONS)[0] | null>(null);
  const isPlayingRef = useRef<boolean>(true);
  const isStationDockedRef = useRef<boolean>(false);
  const gameSpeedRef = useRef<number>(36); // z units per second

  // Touch Swipe coordinates
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  // Sync refs
  useEffect(() => {
    currentLaneRef.current = currentLane;
  }, [currentLane]);

  useEffect(() => {
    isJumpingRef.current = isJumping;
  }, [isJumping]);

  useEffect(() => {
    isSlidingRef.current = isSliding;
  }, [isSliding]);

  useEffect(() => {
    currentCheckpointIdxRef.current = currentCheckpointIdx;
  }, [currentCheckpointIdx]);

  useEffect(() => {
    activeQuestionRef.current = activeQuestion;
  }, [activeQuestion]);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // Lane movement handlers
  const moveLeft = useCallback(() => {
    if (!isPlayingRef.current || activeQuestionRef.current || isStationDockedRef.current) return;
    soundEffects.playClick();
    setCurrentLane(prev => {
      const next = prev > 0 ? ((prev - 1) as LaneIndex) : prev;
      currentLaneRef.current = next;
      return next;
    });
  }, []);

  const moveRight = useCallback(() => {
    if (!isPlayingRef.current || activeQuestionRef.current || isStationDockedRef.current) return;
    soundEffects.playClick();
    setCurrentLane(prev => {
      const next = prev < 2 ? ((prev + 1) as LaneIndex) : prev;
      currentLaneRef.current = next;
      return next;
    });
  }, []);

  const handleJump = useCallback(() => {
    if (isJumpingRef.current || isSlidingRef.current || !isPlayingRef.current || activeQuestionRef.current || isStationDockedRef.current) return;
    soundEffects.playJump();
    setIsJumping(true);
    isJumpingRef.current = true;

    let h = 0;
    let velocity = 15;
    const interval = setInterval(() => {
      h += velocity;
      velocity -= 1.1;
      if (h <= 0) {
        h = 0;
        setJumpHeight(0);
        setIsJumping(false);
        isJumpingRef.current = false;
        clearInterval(interval);
      } else {
        setJumpHeight(h);
      }
    }, 20);
  }, []);

  const handleSlide = useCallback(() => {
    if (isJumpingRef.current || isSlidingRef.current || !isPlayingRef.current || activeQuestionRef.current || isStationDockedRef.current) return;
    soundEffects.playClick();
    setIsSliding(true);
    isSlidingRef.current = true;
    setTimeout(() => {
      setIsSliding(false);
      isSlidingRef.current = false;
    }, 650);
  }, []);

  // Keyboard controls listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeQuestionRef.current) return;
      if (e.code === 'ArrowLeft' || e.key === 'a') {
        e.preventDefault();
        moveLeft();
      } else if (e.code === 'ArrowRight' || e.key === 'd') {
        e.preventDefault();
        moveRight();
      } else if (e.code === 'Space' || e.code === 'ArrowUp' || e.key === 'w') {
        e.preventDefault();
        handleJump();
      } else if (e.code === 'ArrowDown' || e.key === 's') {
        e.preventDefault();
        handleSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [moveLeft, moveRight, handleJump, handleSlide]);

  // Touch Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    if (Math.max(absX, absY) > 30) {
      if (absX > absY) {
        if (dx > 0) moveRight();
        else moveLeft();
      } else {
        if (dy < 0) handleJump();
        else handleSlide();
      }
    }
    touchStartRef.current = null;
  };

  // Main 3-Lane Perspective Runner Animation Loop
  useEffect(() => {
    if (!isPlaying || activeQuestion || isMissionComplete) return;

    let spawnTimer = 0;

    const gameLoop = (time: number) => {
      const delta = Math.min((time - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = time;

      // 1. Advance distance (~35 saat bagi setiap checkpoint pada kelajuan 30 unit/s)
      const nextDist = distanceRef.current + 30 * delta;
      const targetDist = (currentCheckpointIdxRef.current + 1) * CHECKPOINT_DISTANCE;

      // Checkpoint docking sequence
      if (nextDist >= targetDist && currentCheckpointIdxRef.current < targetCheckpoints) {
        distanceRef.current = targetDist;
        setDistance(targetDist);
        setIsStationDocked(true);
        isStationDockedRef.current = true;
        soundEffects.playLevelUp();

        // Smooth deceleration into station pod
        setTimeout(() => {
          setActiveQuestion(LUNAR_RUSH_QUESTIONS[currentCheckpointIdxRef.current]);
        }, 600);
        return; // stop until question solved
      } else {
        distanceRef.current = nextDist;
        setDistance(nextDist);
      }

      // 2. Spawn stars along the 3 lanes (No obstacles / barriers)
      spawnTimer += delta;
      if (spawnTimer > 0.6) {
        spawnTimer = 0;
        const randomLane = Math.floor(Math.random() * 3) as LaneIndex;
        const isSuper = Math.random() < 0.25; // 25% chance of super cosmic star

        const newItem: TrackItem = {
          id: Date.now() + Math.random(),
          lane: randomLane,
          z: 0, // starts at horizon
          type: isSuper ? 'superStar' : 'star',
          collected: false
        };
        trackItemsRef.current = [...trackItemsRef.current, newItem];
      }

      // 3. Move items towards player (z: 0 -> 100)
      const currentLaneNow = currentLaneRef.current;
      let starsAwarded = 0;
      let scoreGained = 0;

      const updatedItems: TrackItem[] = [];

      for (const item of trackItemsRef.current) {
        const nextZ = item.z + gameSpeedRef.current * delta;

        // Player collection zone (z around 84 - 96) across the 3 lanes
        if (nextZ >= 84 && nextZ <= 96 && item.lane === currentLaneNow && !item.collected) {
          const points = item.type === 'superStar' ? 25 : 10;
          scoreGained += points;
          starsAwarded++;
          item.collected = true;
          continue;
        }

        if (nextZ < 105 && !item.collected) {
          updatedItems.push({ ...item, z: nextZ });
        }
      }

      trackItemsRef.current = updatedItems;
      setTrackItems(updatedItems);

      if (starsAwarded > 0) {
        soundEffects.playCollect();
        setStarsCollected(prev => prev + starsAwarded);
        onUpdateScore(progress.totalScore + scoreGained);
      }

      requestRef.current = requestAnimationFrame(gameLoop);
    };

    lastTimeRef.current = performance.now();
    requestRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [
    isPlaying,
    activeQuestion,
    isMissionComplete,
    targetCheckpoints,
    onUpdateScore,
    progress.totalScore
  ]);

  // When question is answered correctly
  const handleQuestionSuccess = (pointsAwarded: number) => {
    onUpdateScore(progress.totalScore + pointsAwarded);
    setActiveQuestion(null);
    setIsStationDocked(false);
    isStationDockedRef.current = false;

    const nextIdx = currentCheckpointIdx + 1;

    if (nextIdx >= targetCheckpoints) {
      setCurrentCheckpointIdx(targetCheckpoints);
      setIsMissionComplete(true);
      onCompleteMission('lunarRush');
      soundEffects.playLevelUp();
    } else {
      setCurrentCheckpointIdx(nextIdx);
      setIsPlaying(true);
    }
  };

  const currentPercent = Math.min(100, Math.round((currentCheckpointIdx / targetCheckpoints) * 100));

  // Compute 3D perspective position for track items
  // Lane offsets at near: -140px, 0px, +140px; at horizon: -30px, 0px, +30px
  const getPerspectiveStyle = (lane: LaneIndex, z: number) => {
    const depthRatio = Math.max(0, Math.min(1, z / 100)); // 0 to 1
    const scale = 0.25 + 0.95 * depthRatio; // smaller at horizon, larger near
    const yPos = 120 + 240 * Math.pow(depthRatio, 1.4); // perspective ground curve

    const laneOffsetNear = (lane - 1) * 125;
    const laneOffsetFar = (lane - 1) * 28;
    const xPos = laneOffsetFar + (laneOffsetNear - laneOffsetFar) * depthRatio;

    return {
      transform: `translate3d(calc(-50% + ${xPos}px), ${yPos}px, 0) scale(${scale})`,
      opacity: Math.min(1, 0.3 + depthRatio * 0.9),
      zIndex: Math.floor(depthRatio * 50)
    };
  };

  return (
    <div
      className="relative w-full min-h-[92vh] flex flex-col items-center bg-slate-950 text-white select-none overflow-hidden touch-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top HUD Bar */}
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
              Misi Bulan – Lunar Rush
            </h2>
            <span className="text-[11px] text-sky-400 font-medium">
              Larian 3 Lorong · Pandangan Belakang
            </span>
          </div>
        </div>

        {/* Center Progress Bar */}
        <div className="flex-1 max-w-xs mx-4">
          <div className="flex items-center justify-between text-[11px] mb-1 font-semibold">
            <span className="text-slate-300">
              Checkpoint: {currentCheckpointIdx} / {targetCheckpoints}
            </span>
            <span className="text-amber-400">{currentPercent}% Lengkap</span>
          </div>
          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
            <div
              className="h-full bg-gradient-to-r from-sky-400 via-indigo-400 to-amber-400 transition-all duration-300 rounded-full"
              style={{ width: `${currentPercent}%` }}
            />
          </div>
        </div>

        {/* Right Score & Stars */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-amber-500/20 px-2.5 py-1 rounded-xl border border-amber-500/40 text-xs text-amber-300 font-bold">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{starsCollected} Bintang</span>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-slate-400 uppercase font-bold">Jumlah Skor</div>
            <div className="text-base font-black text-amber-300 tabular-nums">
              {progress.totalScore}
            </div>
          </div>
        </div>
      </div>

      {/* Main 3D Track Viewport (Subway Surfers Behind-the-Back Perspective) */}
      <div className="relative w-full max-w-4xl flex-1 overflow-hidden bg-gradient-to-b from-[#090D16] via-[#101935] to-[#1E293B] border-x border-slate-800 shadow-2xl flex flex-col justify-end min-h-[480px]">
        {/* Colorful Space Horizon & Nebulae */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Earth floating beautifully above */}
          <div className="absolute top-6 right-12 w-20 h-20 rounded-full bg-sky-500 shadow-[0_0_40px_rgba(56,189,248,0.5)] border border-sky-300/60 overflow-hidden flex items-center justify-center">
            <div className="w-full h-full bg-[radial-gradient(circle_at_30%_30%,_#38bdf8,#0284c7,#0f172a)]" />
            <span className="absolute text-[8px] font-black text-white/80 tracking-widest uppercase">
              BUMI
            </span>
          </div>

          {/* Twinkling ambient stars */}
          <div className="absolute top-12 left-10 w-2 h-2 rounded-full bg-white animate-ping" />
          <div className="absolute top-20 left-1/3 w-1.5 h-1.5 rounded-full bg-amber-300 animate-pulse" />
          <div className="absolute top-8 left-2/3 w-2 h-2 rounded-full bg-purple-300 animate-pulse" />

          {/* Cosmic Nebula Glow at Horizon */}
          <div className="absolute top-24 left-1/2 -translate-x-1/2 w-96 h-36 rounded-full bg-purple-500/20 blur-2xl" />
          <div className="absolute top-28 left-1/2 -translate-x-1/2 w-64 h-24 rounded-full bg-sky-400/25 blur-xl" />
        </div>

        {/* 3D Runway Surface (Converging to Center Horizon) */}
        <div className="absolute inset-x-0 bottom-0 h-80 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 600 320" preserveAspectRatio="none">
            <defs>
              <linearGradient id="groundGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1E293B" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#334155" />
                <stop offset="100%" stopColor="#475569" />
              </linearGradient>
              <linearGradient id="laneGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0.9" />
              </linearGradient>
            </defs>

            {/* Main Ground Polygon converging to horizon point (300, 20) */}
            <polygon points="260,20 340,20 580,320 20,320" fill="url(#groundGrad)" />

            {/* Lane Dividing Lines */}
            {/* Left Lane Separator */}
            <line x1="287" y1="20" x2="207" y2="320" stroke="url(#laneGlow)" strokeWidth="3" strokeDasharray="8 6" />
            {/* Right Lane Separator */}
            <line x1="313" y1="20" x2="393" y2="320" stroke="url(#laneGlow)" strokeWidth="3" strokeDasharray="8 6" />

            {/* Outer Boundary Glow Stripes */}
            <line x1="260" y1="20" x2="20" y2="320" stroke="#FBBF24" strokeWidth="4" />
            <line x1="340" y1="20" x2="580" y2="320" stroke="#FBBF24" strokeWidth="4" />

            {/* Animated Speed Lines / Road Marks on Ground */}
            <line x1="300" y1="30" x2="300" y2="60" stroke="#60A5FA" strokeWidth="2" opacity="0.4" />
            <line x1="300" y1="110" x2="300" y2="160" stroke="#60A5FA" strokeWidth="3" opacity="0.6" />
            <line x1="300" y1="220" x2="300" y2="290" stroke="#60A5FA" strokeWidth="4" opacity="0.8" />
          </svg>
        </div>

        {/* Station Arrival Visual Banner when approaching checkpoint */}
        {isStationDocked && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-40 bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500 px-6 py-2 rounded-2xl text-slate-950 font-black text-sm tracking-wider shadow-2xl animate-bounce flex items-center gap-2">
            <Sparkles className="w-5 h-5 fill-slate-950" />
            <span>TIBA DI STESEN CHECKPOINT {currentCheckpointIdx + 1}!</span>
          </div>
        )}

        {/* 3D Track Items (Stars, Rocks, Barriers, Meteors) */}
        <div className="absolute inset-0 pointer-events-none">
          {trackItems.map(item => {
            const style = getPerspectiveStyle(item.lane, item.z);

            return (
              <div
                key={item.id}
                className="absolute left-1/2 top-0 transition-transform duration-75"
                style={style}
              >
                {/* 1. Golden Glowing Star (Collectible +10 Pts) */}
                {item.type === 'star' && (
                  <div className="w-10 h-10 -ml-5 -mt-5 rounded-full flex items-center justify-center animate-spin">
                    <Star className="w-8 h-8 fill-amber-400 text-yellow-200 drop-shadow-[0_0_14px_#facc15]" />
                  </div>
                )}

                {/* 2. Super Cosmic Star (Collectible +25 Pts) */}
                {item.type === 'superStar' && (
                  <div className="w-12 h-12 -ml-6 -mt-6 rounded-full flex flex-col items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-400 via-teal-300 to-amber-300 shadow-[0_0_20px_#38bdf8] flex items-center justify-center animate-pulse border-2 border-white">
                      <Sparkles className="w-6 h-6 text-slate-950" />
                    </div>
                    <span className="text-[8px] font-black text-sky-200 uppercase tracking-widest mt-0.5 drop-shadow">
                      +25
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* The Running Astronaut (Viewed from Behind) */}
        {/* Lane X: Left = -125px, Center = 0px, Right = +125px */}
        <div
          className="absolute left-1/2 bottom-8 z-30 transition-all duration-200"
          style={{
            transform: `translate3d(calc(-50% + ${(currentLane - 1) * 125}px), ${-jumpHeight * 1.3}px, 0)`
          }}
        >
          <CharacterAvatar
            avatarId={progress.avatarId}
            gender={progress.character}
            size={88}
            isAnimated={true}
            action={isJumping ? 'jumping' : isSliding ? 'sliding' : 'running'}
            view="back"
          />

          {/* Dynamic Ground Shadow */}
          <div
            className="w-16 h-4 bg-black/50 rounded-full mx-auto blur-xs mt-1 transition-transform"
            style={{
              transform: `scale(${Math.max(0.3, 1 - jumpHeight / 100)})`,
              opacity: Math.max(0.2, 1 - jumpHeight / 80)
            }}
          />
        </div>

        {/* On-Screen Touch / D-Pad Controls for Phones and Tablets */}
        <div className="w-full p-3 sm:p-4 z-40 bg-slate-950/80 border-t border-slate-800/90 backdrop-blur-md flex items-center justify-between gap-2">
          {/* Left / Right Lane Change Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={moveLeft}
              type="button"
              className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 active:bg-sky-600 border border-slate-700 text-sky-300 font-black text-sm flex items-center gap-1 active:scale-95 transition-all shadow-md cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Kiri</span>
            </button>
            <button
              onClick={moveRight}
              type="button"
              className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 active:bg-sky-600 border border-slate-700 text-sky-300 font-black text-sm flex items-center gap-1 active:scale-95 transition-all shadow-md cursor-pointer"
            >
              <span>Kanan</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Desktop Instruction Hint */}
          <div className="hidden md:block text-center text-xs text-slate-400">
            Kekunci: <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-sky-300 font-mono">◄</kbd> <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-sky-300 font-mono">►</kbd> Lorong · <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-sky-300 font-mono">▲/Space</kbd> Lompat · <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-sky-300 font-mono">▼</kbd> Gelongsor
          </div>

          {/* Jump / Slide Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleSlide}
              type="button"
              className="px-4 py-3 rounded-2xl bg-indigo-900/80 hover:bg-indigo-800 active:bg-indigo-600 border border-indigo-700 text-indigo-200 font-black text-sm flex items-center gap-1 active:scale-95 transition-all shadow-md cursor-pointer"
            >
              <ArrowDown className="w-5 h-5" />
              <span>Gelongsor</span>
            </button>
            <button
              onClick={handleJump}
              type="button"
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-amber-400 hover:from-sky-400 hover:to-amber-300 text-slate-950 font-black text-sm flex items-center gap-1 active:scale-95 transition-all shadow-lg shadow-sky-500/25 cursor-pointer"
            >
              <ArrowUp className="w-5 h-5 stroke-[3]" />
              <span>LOMPAT</span>
            </button>
          </div>
        </div>
      </div>

      {/* Checkpoint Question Modal Pop-up */}
      {activeQuestion && (
        <QuestionModal
          question={activeQuestion}
          checkpointNumber={currentCheckpointIdx + 1}
          totalCheckpoints={targetCheckpoints}
          onAnswerCorrect={handleQuestionSuccess}
        />
      )}

      {/* Mission Completion Modal */}
      {isMissionComplete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="w-full max-w-lg bg-slate-900 border-2 border-emerald-500/60 rounded-3xl p-6 text-center space-y-5 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-400/40">
              <Award className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold">
                Misi Selesai!
              </span>
              <h3 className="text-2xl font-black text-white">Misi Bulan Berjaya Ditawan!</h3>
              <p className="text-sm text-slate-300">
                Tahniah! Anda telah berjaya menyelesaikan semua 7 checkpoint Fasa Bulan dengan pemahaman saintifik yang mantap.
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
                <span className="text-xs text-slate-400 block">Bintang Dikumpul</span>
                <span className="text-base font-bold text-amber-400 mt-1 block">
                  {starsCollected} ⭐
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
                className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm transition-all shadow-lg shadow-emerald-500/30 cursor-pointer"
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
