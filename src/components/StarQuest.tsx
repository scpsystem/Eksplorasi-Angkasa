import React, { useState, useEffect, useCallback } from 'react';
import { GameProgress } from '../types/game';
import { STAR_QUEST_QUESTIONS } from '../data/learningContent';
import { CharacterAvatar } from './CharacterAvatars';
import { QuestionModal } from './QuestionModal';
import { ConstellationVisualizer } from './ConstellationIllustrations';
import { soundEffects } from '../utils/audio';
import { ArrowLeft, Star, Telescope, Sparkles, Award, RotateCcw, Target, CheckCircle2 } from 'lucide-react';

interface StarQuestProps {
  progress: GameProgress;
  onUpdateScore: (newScore: number) => void;
  onCompleteMission: (mission: 'starQuest') => void;
  onBackToMenu: () => void;
}

// 6 Space Tile Types for Match-3
type SpaceTileType = 'star' | 'crescent' | 'full_moon' | 'planet' | 'rocket' | 'comet';

const TILE_TYPES: SpaceTileType[] = ['star', 'crescent', 'full_moon', 'planet', 'rocket', 'comet'];

interface GridCell {
  id: number;
  type: SpaceTileType;
  isMatched?: boolean;
}

const GRID_SIZE = 5; // 5x5 Grid for clean, responsive display on mobile & desktop

// Mini-challenge target definitions for the 7 checkpoints
const CHECKPOINT_OBJECTIVES = [
  { step: 1, title: 'Kumpulkan 5 Bintang Kuning', targetType: 'star' as SpaceTileType, targetCount: 5, targetScore: 0, maxMoves: 20 },
  { step: 2, title: 'Padankan 4 Bulan Sabit', targetType: 'crescent' as SpaceTileType, targetCount: 4, targetScore: 0, maxMoves: 20 },
  { step: 3, title: 'Kumpulkan 4 Planet Bergelang', targetType: 'planet' as SpaceTileType, targetCount: 4, targetScore: 0, maxMoves: 20 },
  { step: 4, title: 'Capai 250 Skor Padanan', targetType: null, targetCount: 0, targetScore: 250, maxMoves: 22 },
  { step: 5, title: 'Padankan 4 Roket Kecil', targetType: 'rocket' as SpaceTileType, targetCount: 4, targetScore: 0, maxMoves: 20 },
  { step: 6, title: 'Padankan 4 Komet Berkilau', targetType: 'comet' as SpaceTileType, targetCount: 4, targetScore: 0, maxMoves: 20 },
  { step: 7, title: 'Capai 350 Skor Padanan', targetType: null, targetCount: 0, targetScore: 350, maxMoves: 18 }
];

export const StarQuest: React.FC<StarQuestProps> = ({
  progress,
  onUpdateScore,
  onCompleteMission,
  onBackToMenu
}) => {
  const [currentCheckpointIdx, setCurrentCheckpointIdx] = useState<number>(0);
  const [activeQuestion, setActiveQuestion] = useState<(typeof STAR_QUEST_QUESTIONS)[0] | null>(null);
  const [isMissionComplete, setIsMissionComplete] = useState<boolean>(false);
  const [showObservatory, setShowObservatory] = useState<boolean>(false);

  // Match-3 Mini Game State
  const [grid, setGrid] = useState<GridCell[][]>([]);
  const [selectedCoord, setSelectedCoord] = useState<{ r: number; c: number } | null>(null);
  const [matchScore, setMatchScore] = useState<number>(0);
  const [collectedCounts, setCollectedCounts] = useState<{ [key in SpaceTileType]?: number }>({});
  const [remainingMoves, setRemainingMoves] = useState<number>(20);
  const [objectiveCompleted, setObjectiveCompleted] = useState<boolean>(false);

  const totalCheckpoints = STAR_QUEST_QUESTIONS.length; // 7
  const safeCheckpointIdx = Math.min(Math.max(0, currentCheckpointIdx), totalCheckpoints - 1);
  const currentObjective = CHECKPOINT_OBJECTIVES[safeCheckpointIdx] || CHECKPOINT_OBJECTIVES[0];

  // Helper to generate a random space tile
  const getRandomTileType = (): SpaceTileType => {
    return TILE_TYPES[Math.floor(Math.random() * TILE_TYPES.length)];
  };

  // Initialize or reset a valid 5x5 board without pre-existing 3-matches
  const initBoard = useCallback(() => {
    let newGrid: GridCell[][] = [];
    let attempts = 0;

    while (attempts < 10) {
      newGrid = [];
      let cellId = 1;
      for (let r = 0; r < GRID_SIZE; r++) {
        const row: GridCell[] = [];
        for (let c = 0; c < GRID_SIZE; c++) {
          row.push({
            id: cellId++,
            type: getRandomTileType()
          });
        }
        newGrid.push(row);
      }

      // Check if grid has initial matches and resolve them
      let hasMatches = false;
      for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
          const type = newGrid[r][c].type;
          if (c >= 2 && newGrid[r][c - 1].type === type && newGrid[r][c - 2].type === type) {
            hasMatches = true;
          }
          if (r >= 2 && newGrid[r - 1][c].type === type && newGrid[r - 2][c].type === type) {
            hasMatches = true;
          }
        }
      }

      if (!hasMatches) break;
      attempts++;
    }

    setGrid(newGrid);
    setSelectedCoord(null);
    setCollectedCounts({});
    setMatchScore(0);
    setObjectiveCompleted(false);

    const safeIdx = Math.min(Math.max(0, currentCheckpointIdx), totalCheckpoints - 1);
    const objective = CHECKPOINT_OBJECTIVES[safeIdx] || CHECKPOINT_OBJECTIVES[0];
    setRemainingMoves(objective.maxMoves);
  }, [currentCheckpointIdx, totalCheckpoints]);

  // Re-init on checkpoint change
  useEffect(() => {
    initBoard();
  }, [currentCheckpointIdx, initBoard]);

  // Check board for matches (horizontal and vertical 3-or-more)
  const findMatches = (currentGrid: GridCell[][]): { r: number; c: number }[] => {
    const matchedCoords: Set<string> = new Set();

    // Check horizontal
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE - 2; c++) {
        const type = currentGrid[r][c].type;
        if (type && currentGrid[r][c + 1].type === type && currentGrid[r][c + 2].type === type) {
          matchedCoords.add(`${r},${c}`);
          matchedCoords.add(`${r},${c + 1}`);
          matchedCoords.add(`${r},${c + 2}`);
        }
      }
    }

    // Check vertical
    for (let c = 0; c < GRID_SIZE; c++) {
      for (let r = 0; r < GRID_SIZE - 2; r++) {
        const type = currentGrid[r][c].type;
        if (type && currentGrid[r + 1][c].type === type && currentGrid[r + 2][c].type === type) {
          matchedCoords.add(`${r},${c}`);
          matchedCoords.add(`${r + 1},${c}`);
          matchedCoords.add(`${r + 2},${c}`);
        }
      }
    }

    return Array.from(matchedCoords).map(str => {
      const [r, c] = str.split(',').map(Number);
      return { r, c };
    });
  };

  // Swap and resolve matches
  const handleTileClick = (r: number, c: number) => {
    if (objectiveCompleted || activeQuestion) return;

    if (!selectedCoord) {
      soundEffects.playClick();
      setSelectedCoord({ r, c });
      return;
    }

    const { r: sr, c: sc } = selectedCoord;

    // Check if clicked is adjacent
    const isAdjacent = Math.abs(r - sr) + Math.abs(c - sc) === 1;

    if (!isAdjacent) {
      soundEffects.playClick();
      setSelectedCoord({ r, c });
      return;
    }

    // Swap tiles in temp grid
    const tempGrid = grid.map(row => row.map(cell => ({ ...cell })));
    const tempTile = tempGrid[r][c].type;
    tempGrid[r][c].type = tempGrid[sr][sc].type;
    tempGrid[sr][sc].type = tempTile;

    const matches = findMatches(tempGrid);

    if (matches.length === 0) {
      // Invalid swap
      soundEffects.playWrong();
      setSelectedCoord(null);
      return;
    }

    // Valid swap: execute
    soundEffects.playCollect();
    setRemainingMoves(prev => Math.max(0, prev - 1));
    setSelectedCoord(null);

    // Count collected types
    const countsToAdd: { [key in SpaceTileType]?: number } = {};
    matches.forEach(m => {
      const type = tempGrid[m.r][m.c].type;
      countsToAdd[type] = (countsToAdd[type] || 0) + 1;
    });

    const pointsGained = matches.length * 20;
    const newTotalScore = matchScore + pointsGained;
    setMatchScore(newTotalScore);
    onUpdateScore(progress.totalScore + pointsGained);

    setCollectedCounts(prev => {
      const updated = { ...prev };
      Object.entries(countsToAdd).forEach(([t, count]) => {
        const key = t as SpaceTileType;
        updated[key] = (updated[key] || 0) + count;
      });
      return updated;
    });

    // Remove matched tiles and drop down new tiles
    for (const m of matches) {
      tempGrid[m.r][m.c].type = '' as unknown as SpaceTileType;
    }

    // Drop columns down
    for (let col = 0; col < GRID_SIZE; col++) {
      for (let row = GRID_SIZE - 1; row >= 0; row--) {
        if (!tempGrid[row][col].type) {
          // Find first tile above
          let swapRow = row - 1;
          while (swapRow >= 0 && !tempGrid[swapRow][col].type) {
            swapRow--;
          }
          if (swapRow >= 0) {
            tempGrid[row][col].type = tempGrid[swapRow][col].type;
            tempGrid[swapRow][col].type = '' as unknown as SpaceTileType;
          } else {
            // Fill with new random tile
            tempGrid[row][col].type = getRandomTileType();
          }
        }
      }
    }

    setGrid(tempGrid);

    // Check if current checkpoint mini-objective achieved!
    let reached = false;
    if (currentObjective.targetType) {
      const currentCount =
        (collectedCounts[currentObjective.targetType] || 0) +
        (countsToAdd[currentObjective.targetType] || 0);
      if (currentCount >= currentObjective.targetCount) {
        reached = true;
      }
    } else if (currentObjective.targetScore > 0) {
      if (newTotalScore >= currentObjective.targetScore) {
        reached = true;
      }
    }

    if (reached) {
      soundEffects.playLevelUp();
      setObjectiveCompleted(true);
      // Reveal the educational question for this checkpoint after short celebratory delay!
      setTimeout(() => {
        const qIdx = Math.min(Math.max(0, currentCheckpointIdx), totalCheckpoints - 1);
        setActiveQuestion(STAR_QUEST_QUESTIONS[qIdx]);
      }, 700);
    }
  };

  // Educational Question completion handler
  const handleQuestionSuccess = (pointsAwarded: number) => {
    onUpdateScore(progress.totalScore + pointsAwarded);
    setActiveQuestion(null);

    const nextIdx = currentCheckpointIdx + 1;

    if (nextIdx >= totalCheckpoints) {
      setCurrentCheckpointIdx(totalCheckpoints - 1);
      setIsMissionComplete(true);
      onCompleteMission('starQuest');
      soundEffects.playLevelUp();
    } else {
      setCurrentCheckpointIdx(nextIdx);
      soundEffects.playCorrect();
    }
  };

  // Render SVG icons for space tiles
  const renderTileIcon = (type: SpaceTileType) => {
    switch (type) {
      case 'star':
        return <Star className="w-8 h-8 fill-amber-400 text-yellow-200 drop-shadow-[0_0_8px_#facc15]" />;
      case 'crescent':
        return (
          <svg viewBox="0 0 40 40" className="w-8 h-8 drop-shadow-[0_0_8px_#38bdf8]">
            <path d="M 20 4 A 16 16 0 0 1 20 36 A 12 16 0 0 0 20 4 Z" fill="#38BDF8" />
          </svg>
        );
      case 'full_moon':
        return (
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-200 via-yellow-300 to-white shadow-[0_0_10px_#fef08a] border border-amber-300 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-amber-400/30" />
          </div>
        );
      case 'planet':
        return (
          <div className="relative w-8 h-8 flex items-center justify-center">
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-emerald-600 via-teal-400 to-cyan-300 shadow-[0_0_8px_#2dd4bf]" />
            <div className="absolute w-8 h-2.5 rounded-full border border-teal-200 rotate-12" />
          </div>
        );
      case 'rocket':
        return (
          <div className="w-8 h-8 flex items-center justify-center">
            <svg viewBox="0 0 32 32" className="w-7 h-7 drop-shadow-[0_0_8px_#f97316]">
              <path d="M 16 2 Q 22 8 22 20 L 10 20 Q 10 8 16 2 Z" fill="#EF4444" />
              <circle cx="16" cy="12" r="3" fill="#38BDF8" />
              <polygon points="10,20 6,26 12,24" fill="#F97316" />
              <polygon points="22,20 26,26 20,24" fill="#F97316" />
            </svg>
          </div>
        );
      case 'comet':
        return (
          <div className="w-8 h-8 flex items-center justify-center">
            <svg viewBox="0 0 32 32" className="w-7 h-7 drop-shadow-[0_0_8px_#d946ef]">
              <circle cx="10" cy="10" r="5" fill="#E879F9" />
              <path d="M 14 10 Q 24 16 28 26 Q 16 22 10 14 Z" fill="#C084FC" />
            </svg>
          </div>
        );
      default:
        return <Sparkles className="w-6 h-6 text-sky-400" />;
    }
  };

  const currentPercent = Math.min(100, Math.round((currentCheckpointIdx / totalCheckpoints) * 100));

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
              Misi Bintang – Star Quest
            </h2>
            <span className="text-[11px] text-purple-400 font-medium">
              Mini Padanan Angkasa & Rahsia Buruj
            </span>
          </div>
        </div>

        {/* Center Progress Bar */}
        <div className="flex-1 max-w-xs mx-4">
          <div className="flex items-center justify-between text-[11px] mb-1 font-semibold">
            <span className="text-slate-300">
              Checkpoint: {currentCheckpointIdx} / {totalCheckpoints}
            </span>
            <span className="text-purple-300">{currentPercent}% Lengkap</span>
          </div>
          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
            <div
              className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-amber-400 transition-all duration-300 rounded-full"
              style={{ width: `${currentPercent}%` }}
            />
          </div>
        </div>

        {/* Right Observatori Toggle & Score */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowObservatory(!showObservatory)}
            type="button"
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-700 text-xs text-purple-300 font-bold transition-colors cursor-pointer"
          >
            <Telescope className="w-4 h-4" />
            <span className="hidden sm:inline">Observatori Buruj</span>
          </button>

          <div className="text-right ml-2">
            <div className="text-[10px] text-slate-400 uppercase font-bold">Jumlah Skor</div>
            <div className="text-base font-black text-amber-300 tabular-nums">
              {progress.totalScore}
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="relative w-full max-w-4xl flex-1 flex flex-col items-center justify-between p-4 sm:p-6 bg-gradient-to-b from-[#090D16] via-[#1A102F] to-[#0A0D1B] border-x border-slate-800 shadow-2xl">
        {/* Checkpoint Objective Header Banner */}
        <div className="w-full max-w-md bg-slate-900/90 border-2 border-purple-500/50 rounded-2xl p-3.5 shadow-xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center font-black text-base border border-purple-400/40">
              #{currentObjective.step}
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-purple-400 block">
                Objektif Mini Permainan:
              </span>
              <h3 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-1.5">
                <Target className="w-4 h-4 text-amber-400" />
                <span>{currentObjective.title}</span>
              </h3>
            </div>
          </div>

          <div className="text-right">
            {currentObjective.targetType ? (
              <div className="text-xs font-bold text-sky-300">
                Terkumpul:{' '}
                <span className="text-base text-amber-300 font-black">
                  {collectedCounts[currentObjective.targetType] || 0}
                </span>{' '}
                / {currentObjective.targetCount}
              </div>
            ) : (
              <div className="text-xs font-bold text-sky-300">
                Skor Padanan:{' '}
                <span className="text-base text-amber-300 font-black">
                  {matchScore}
                </span>{' '}
                / {currentObjective.targetScore}
              </div>
            )}
            <span className="text-[10px] text-slate-400 block">
              Baki Langkah: {remainingMoves}
            </span>
          </div>
        </div>

        {/* 5x5 Match-3 Board Area */}
        <div className="my-auto py-4 flex flex-col items-center">
          {objectiveCompleted ? (
            <div className="p-6 bg-slate-900/95 border-2 border-emerald-400 rounded-3xl text-center space-y-3 shadow-2xl animate-bounce">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h4 className="text-lg font-black text-white">Objektif Berjaya Diselesaikan!</h4>
              <p className="text-xs text-slate-300">
                Memuatkan Soalan Pembelajaran Checkpoint #{currentCheckpointIdx + 1}...
              </p>
            </div>
          ) : (
            <div className="p-3 sm:p-4 rounded-3xl bg-slate-900/80 border-2 border-purple-500/40 shadow-2xl backdrop-blur-md">
              <div className="grid grid-cols-5 gap-2 sm:gap-2.5">
                {grid.map((row, r) =>
                  row.map((cell, c) => {
                    const isSelected = selectedCoord?.r === r && selectedCoord?.c === c;

                    return (
                      <button
                        key={cell.id}
                        type="button"
                        onClick={() => handleTileClick(r, c)}
                        className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center transition-all duration-150 cursor-pointer ${
                          isSelected
                            ? 'bg-purple-600/90 border-2 border-amber-400 ring-4 ring-amber-400/50 scale-105 shadow-xl'
                            : 'bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 active:scale-95'
                        }`}
                      >
                        {renderTileIcon(cell.type)}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* Reset Board Button */}
          {!objectiveCompleted && (
            <button
              onClick={() => {
                soundEffects.playClick();
                initBoard();
              }}
              type="button"
              className="mt-3 text-xs text-slate-400 hover:text-sky-300 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Susun Semula Papan Padanan</span>
            </button>
          )}
        </div>

        {/* Bottom Tip Strip */}
        <div className="w-full bg-slate-900/80 border border-slate-800 rounded-2xl p-3 flex items-center justify-between text-xs text-slate-300">
          <span className="font-semibold text-purple-300">
            💡 Petua: Klik 2 objek bersebelahan untuk menukar kedudukan & padankan 3 objek seiras!
          </span>
          <span className="text-amber-400 font-bold">
            +{matchScore} Mata Mini
          </span>
        </div>
      </div>

      {/* Constellation Observatory Modal */}
      {showObservatory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-slate-900 border-2 border-purple-500/50 rounded-3xl p-5 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <Telescope className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-extrabold text-white">
                  Observatori Buruj: Panduan 4 Corak Buruj Buku Teks
                </h3>
              </div>
              <button
                onClick={() => setShowObservatory(false)}
                className="text-slate-400 hover:text-white font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <ConstellationVisualizer type="biduk" size="sm" />
              <ConstellationVisualizer type="belantik" size="sm" />
              <ConstellationVisualizer type="pari" size="sm" />
              <ConstellationVisualizer type="skorpio" size="sm" />
            </div>

            <button
              onClick={() => setShowObservatory(false)}
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
            >
              Tutup Observatori & Sambung Main
            </button>
          </div>
        </div>
      )}

      {/* Checkpoint Question Modal Pop-up */}
      {activeQuestion && (
        <QuestionModal
          question={activeQuestion}
          checkpointNumber={currentCheckpointIdx + 1}
          totalCheckpoints={totalCheckpoints}
          onAnswerCorrect={handleQuestionSuccess}
        />
      )}

      {/* Mission Completion Modal */}
      {isMissionComplete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="w-full max-w-lg bg-slate-900 border-2 border-purple-500/60 rounded-3xl p-6 text-center space-y-5 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center mx-auto border border-purple-400/40">
              <Award className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <span className="text-xs uppercase tracking-widest text-purple-400 font-bold">
                Misi Selesai!
              </span>
              <h3 className="text-2xl font-black text-white">Misi Bintang Berjaya Diteroka!</h3>
              <p className="text-sm text-slate-300">
                Tahniah! Anda telah membongkar semua rahsia buruj: Biduk, Belantik, Pari, dan Skorpio serta fungsinya sebagai petunjuk arah dan musim.
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
                <span className="text-xs text-slate-400 block">Checkpoint</span>
                <span className="text-base font-bold text-purple-400 mt-1 block">
                  7 / 7 Selesai
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
                className="w-full py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-black text-sm transition-all shadow-lg shadow-purple-600/30 cursor-pointer"
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
