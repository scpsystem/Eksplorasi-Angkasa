import { LeaderboardEntry, GameProgress } from '../types/game';

const LEADERBOARD_STORAGE_KEY = 'galaksi_sains_leaderboard_records_v2';

export const getLeaderboard = (): LeaderboardEntry[] => {
  try {
    const raw = localStorage.getItem(LEADERBOARD_STORAGE_KEY);
    if (raw) {
      const parsed: LeaderboardEntry[] = JSON.parse(raw);
      return parsed.sort((a, b) => b.totalScore - a.totalScore);
    }
  } catch {
    // ignore
  }
  return [];
};

export const savePlayerToLeaderboard = (progress: GameProgress): LeaderboardEntry[] => {
  const currentRecords = getLeaderboard();
  const existingIdx = currentRecords.findIndex(r => r.id === progress.playerId);

  const starsCount =
    (progress.starsEarned.lunarRush ? 1 : 0) +
    (progress.starsEarned.starQuest ? 1 : 0) +
    (progress.starsEarned.galaxyExplorer ? 1 : 0);

  const updatedEntry: LeaderboardEntry = {
    id: progress.playerId,
    name: progress.userName || 'Angkasawan',
    avatarId: progress.avatarId || 'avatar_biru',
    lunarScore: progress.scores.lunarRush,
    starScore: progress.scores.starQuest,
    galaxyScore: progress.scores.galaxyExplorer,
    totalScore: progress.totalScore,
    starsCount,
    updatedAt: Date.now()
  };

  let newRecords: LeaderboardEntry[];
  if (existingIdx >= 0) {
    newRecords = [...currentRecords];
    newRecords[existingIdx] = updatedEntry;
  } else {
    newRecords = [...currentRecords, updatedEntry];
  }

  // Sort descending
  newRecords.sort((a, b) => b.totalScore - a.totalScore);

  try {
    localStorage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(newRecords));
  } catch {
    // ignore
  }

  return newRecords;
};
