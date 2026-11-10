export type CharacterGender = 'lelaki' | 'perempuan';

export interface AstronautAvatarOption {
  id: string;
  name: string;
  title: string;
  suitColor: string;
  accentColor: string;
  visorColor: string;
  accessoryName: string;
  accessoryType: 'star_badge' | 'solar_ring' | 'nebula_crystal' | 'cosmic_wings' | 'radar_dish';
  description: string;
}

export type GameActivity = 'menu' | 'lunar_rush' | 'star_quest' | 'galaxy_explorer' | 'leaderboard';

export type QuestionType =
  | 'multiple_choice'
  | 'order_sequence'
  | 'match_pairs'
  | 'diagram_click'
  | 'fill_blank';

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect?: boolean;
}

export interface CheckpointQuestion {
  id: number;
  title: string;
  topic: 'fasa_bulan' | 'buruj' | 'gabungan';
  standardLearning: string; // e.g. "SP 9.1.1", "SP 9.2.2"
  questionText: string;
  type: QuestionType;
  options?: QuestionOption[];
  correctOptionId?: string; // for multiple choice
  sequenceItems?: { id: string; name: string; visualType?: string }[]; // for order_sequence
  correctSequenceIds?: string[];
  matchPairs?: { left: string; right: string; leftId: string; rightId: string }[]; // for match_pairs
  blankSentence?: {
    before: string;
    after: string;
    options: string[];
    correctAnswer: string;
  };
  diagramType?: 'moon_phases' | 'moon_orbit' | 'constellations' | 'seasons';
  explanation: string;
  factSource: string; // Reference to textbook page
  points: number;
}

export interface GameProgress {
  playerId: string;
  userName: string;
  avatarId: string;
  character: CharacterGender; // kept for backwards compatibility
  scores: {
    lunarRush: number;
    starQuest: number;
    galaxyExplorer: number;
  };
  totalScore: number;
  starsEarned: {
    lunarRush: boolean;
    starQuest: boolean;
    galaxyExplorer: boolean;
  };
  lunarRushCompletedCheckpoints: number[];
  starQuestCompletedCheckpoints: number[];
  galaxyExplorerCompletedCheckpoints: number[];
  lunarRushUnlockedCheckpoint: number;
  starQuestUnlockedCheckpoint: number;
  galaxyExplorerUnlockedCheckpoint: number;
  audioEnabled: boolean;
  lastPlayedAt?: number;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  avatarId: string;
  lunarScore: number;
  starScore: number;
  galaxyScore: number;
  totalScore: number;
  starsCount: number;
  updatedAt: number;
}
