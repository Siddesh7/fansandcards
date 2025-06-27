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
  depositAmount: string; // in wei (0.000000001 ETH = 1000000000 wei)
  totalPot: string; // total amount in pot in wei
  treasureWallet: string; // 0xD655243258a621337088179E043843346bD392d2
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
