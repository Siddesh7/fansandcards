// Game Types - Frontend (matches backend types)
export interface AnswerCard {
  id: string;
  text: string;
  category: string;
  rarity: "common" | "rare" | "epic" | "legendary";
}

export interface QuestionCard {
  id: string;
  text: string;
  blanks: number;
  category: string;
}

export interface Player {
  id: string;
  name: string;
  avatar?: string;
  score: number;
  isReady: boolean;
  isConnected: boolean;
  hand: AnswerCard[];
}

export interface GameSettings {
  maxRounds: number;
  roundTimer: number;
  maxPlayers: number;
  minPlayers: number;
}

export interface Room {
  id: string;
  name: string;
  players: Player[];
  maxPlayers: number;
  isPrivate: boolean;
  gameState: "waiting" | "playing" | "finished";
  settings: GameSettings;
  createdAt: Date;
  createdBy: string;
}

export interface Submission {
  playerId: string;
  cards: AnswerCard[];
  isRevealed: boolean;
}

export interface Game {
  roomId: string;
  currentRound: number;
  currentJudge: string;
  questionCard: QuestionCard;
  submissions: Submission[];
  roundState: "submitting" | "judging" | "results";
  timeLeft: number;
  scores: Record<string, number>;
}
