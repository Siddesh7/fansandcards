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
  hasDeposited?: boolean;
  depositTxHash?: string;
  walletAddress?: string;
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
  depositAmount: string; // in wei (1 CHZ = 1000000000000000000 wei)
  totalPot: string; // total amount in pot in wei
  treasureWallet: string; // 0x8202f7875f0417593CC4a8391dA08874A1eb0EAF
  winner?: string; // player id of winner
  payoutTxHash?: string; // transaction hash for winner payout
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
