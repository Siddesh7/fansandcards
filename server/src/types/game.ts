export interface Player {
  id: string;
  name: string;
  avatar?: string;
  score: number;
  isReady: boolean;
  isConnected: boolean;
  hand: AnswerCard[];
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

export interface GameSettings {
  maxRounds: number;
  roundTimer: number; // seconds
  maxPlayers: number;
  minPlayers: number;
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
  gameHistory: RoundResult[];
}

export interface QuestionCard {
  id: string;
  text: string;
  blanks: number; // number of _ in the text
  category: "football" | "sports" | "general";
}

export interface AnswerCard {
  id: string;
  text: string;
  category: "football" | "sports" | "general";
  rarity: "common" | "rare" | "legendary";
}

export interface ActionCard {
  id: string;
  name: string;
  description: string;
  effect: string;
  category: "game" | "scoring" | "chaos";
}

export interface Submission {
  playerId: string;
  cards: AnswerCard[];
  isRevealed: boolean;
}

export interface RoundResult {
  round: number;
  questionCard: QuestionCard;
  submissions: Submission[];
  winner: string;
  winningCards: AnswerCard[];
}

export interface SocketEvents {
  // Room events
  "room:create": (data: { name: string; settings: GameSettings }) => void;
  "room:join": (data: { roomId: string; playerName: string }) => void;
  "room:leave": (data: { roomId: string }) => void;
  "room:ready": (data: { roomId: string; isReady: boolean }) => void;

  // Game events
  "game:start": (data: { roomId: string }) => void;
  "game:submit-cards": (data: { roomId: string; cards: AnswerCard[] }) => void;
  "game:judge-pick": (data: {
    roomId: string;
    submissionIndex: number;
  }) => void;
  "game:next-round": (data: { roomId: string }) => void;

  // Response events
  "room:updated": (room: Room) => void;
  "game:updated": (game: Game) => void;
  error: (error: { message: string; code: string }) => void;
}
