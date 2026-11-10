import React, { useState, useEffect, useCallback } from 'react';
import { GameActivity, GameProgress } from './types/game';
import { MainMenu } from './components/MainMenu';
import { LunarRush } from './components/LunarRush';
import { StarQuest } from './components/StarQuest';
import { GalaxyExplorer } from './components/GalaxyExplorer';
import { PlayerProfileModal } from './components/PlayerProfileModal';
import { soundEffects } from './utils/audio';
import { savePlayerToLeaderboard } from './utils/leaderboard';

const STORAGE_KEY = 'galaksi_sains_kssr_progress_v2';

const generatePlayerId = (): string => {
  return 'pilot_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
};

const INITIAL_PROGRESS: GameProgress = {
  playerId: generatePlayerId(),
  userName: '',
  avatarId: 'avatar_biru',
  character: 'lelaki',
  scores: {
    lunarRush: 0,
    starQuest: 0,
    galaxyExplorer: 0
  },
  totalScore: 0,
  starsEarned: {
    lunarRush: false,
    starQuest: false,
    galaxyExplorer: false
  },
  lunarRushCompletedCheckpoints: [],
  starQuestCompletedCheckpoints: [],
  galaxyExplorerCompletedCheckpoints: [],
  lunarRushUnlockedCheckpoint: 1,
  starQuestUnlockedCheckpoint: 1,
  galaxyExplorerUnlockedCheckpoint: 1,
  audioEnabled: true
};

export default function App() {
  const [currentActivity, setCurrentActivity] = useState<GameActivity>('menu');
  const [showFirstTimeModal, setShowFirstTimeModal] = useState<boolean>(false);

  // Load progress from localStorage
  const [progress, setProgress] = useState<GameProgress>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure scores structure exists
        if (!parsed.scores) {
          parsed.scores = { lunarRush: 0, starQuest: 0, galaxyExplorer: 0 };
        }
        if (!parsed.playerId) {
          parsed.playerId = generatePlayerId();
        }
        if (!parsed.avatarId) {
          parsed.avatarId = 'avatar_biru';
        }
        return parsed;
      }
    } catch {
      // Fallback
    }
    return INITIAL_PROGRESS;
  });

  // Prompt registration modal if first time and no name has been set
  useEffect(() => {
    if (!progress.userName) {
      setShowFirstTimeModal(true);
    }
  }, [progress.userName]);

  // Sync to localStorage and update leaderboard record
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
      if (progress.userName) {
        savePlayerToLeaderboard(progress);
      }
    } catch {
      // Ignore storage errors
    }
  }, [progress]);

  // Sync audio enabled state with sound manager
  useEffect(() => {
    soundEffects.isMuted = !progress.audioEnabled;
  }, [progress.audioEnabled]);

  // Update score based on the active activity
  const handleUpdateScore = useCallback((newScore: number, activity?: 'lunarRush' | 'starQuest' | 'galaxyExplorer') => {
    setProgress(prev => {
      const targetAct =
        activity ||
        (currentActivity === 'lunar_rush'
          ? 'lunarRush'
          : currentActivity === 'star_quest'
          ? 'starQuest'
          : 'galaxyExplorer');

      const updatedScores = {
        ...prev.scores,
        [targetAct]: Math.max(prev.scores[targetAct], newScore)
      };

      // Formula: Total Score = Lunar Rush + Star Quest + Galaxy Explorer
      const calculatedTotal =
        updatedScores.lunarRush + updatedScores.starQuest + updatedScores.galaxyExplorer;

      return {
        ...prev,
        scores: updatedScores,
        totalScore: calculatedTotal
      };
    });
  }, [currentActivity]);

  const handleCompleteMission = useCallback((mission: 'lunarRush' | 'starQuest' | 'galaxyExplorer') => {
    setProgress(prev => ({
      ...prev,
      starsEarned: {
        ...prev.starsEarned,
        [mission]: true
      }
    }));
  }, []);

  const handleUpdatePlayer = useCallback((name: string, avatarId: string) => {
    setProgress(prev => ({
      ...prev,
      userName: name,
      avatarId
    }));
    setShowFirstTimeModal(false);
  }, []);

  const handleToggleAudio = useCallback(() => {
    setProgress(prev => ({
      ...prev,
      audioEnabled: !prev.audioEnabled
    }));
  }, []);

  const handleResetGame = useCallback(() => {
    const newProgress: GameProgress = {
      ...INITIAL_PROGRESS,
      playerId: generatePlayerId(),
      userName: progress.userName, // preserve name
      avatarId: progress.avatarId // preserve avatar
    };
    setProgress(newProgress);
    setCurrentActivity('menu');
  }, [progress.userName, progress.avatarId]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-slate-950">
      {/* First-time Astronaut Registration Modal */}
      {showFirstTimeModal && (
        <PlayerProfileModal
          initialName={progress.userName}
          initialAvatarId={progress.avatarId}
          isFirstTime={true}
          onSave={handleUpdatePlayer}
        />
      )}

      {currentActivity === 'menu' && (
        <MainMenu
          progress={progress}
          onUpdatePlayer={handleUpdatePlayer}
          onStartActivity={act => setCurrentActivity(act)}
          onResetGame={handleResetGame}
          onToggleAudio={handleToggleAudio}
        />
      )}

      {currentActivity === 'lunar_rush' && (
        <LunarRush
          progress={progress}
          onUpdateScore={score => handleUpdateScore(score, 'lunarRush')}
          onCompleteMission={handleCompleteMission}
          onBackToMenu={() => setCurrentActivity('menu')}
        />
      )}

      {currentActivity === 'star_quest' && (
        <StarQuest
          progress={progress}
          onUpdateScore={score => handleUpdateScore(score, 'starQuest')}
          onCompleteMission={handleCompleteMission}
          onBackToMenu={() => setCurrentActivity('menu')}
        />
      )}

      {currentActivity === 'galaxy_explorer' && (
        <GalaxyExplorer
          progress={progress}
          onUpdateScore={score => handleUpdateScore(score, 'galaxyExplorer')}
          onCompleteMission={handleCompleteMission}
          onBackToMenu={() => setCurrentActivity('menu')}
        />
      )}
    </div>
  );
}
