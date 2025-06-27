import mongoose, { Schema, Document } from "mongoose";
import { Game as GameInterface, Submission, RoundResult } from "../types/game";

interface GameDocument extends Document, Omit<GameInterface, "roomId"> {
  roomId: string;
}

const submissionSchema = new Schema({
  playerId: { type: String, required: true },
  cards: [
    {
      id: String,
      text: String,
      category: String,
      rarity: String,
    },
  ],
  isRevealed: { type: Boolean, default: false },
});

const roundResultSchema = new Schema({
  round: { type: Number, required: true },
  questionCard: {
    id: String,
    text: String,
    blanks: Number,
    category: String,
  },
  submissions: [submissionSchema],
  winner: { type: String, required: true },
  winningCards: [
    {
      id: String,
      text: String,
      category: String,
      rarity: String,
    },
  ],
});

const gameSchema = new Schema({
  roomId: { type: String, required: true, unique: true },
  currentRound: { type: Number, default: 1 },
  currentJudge: { type: String, required: true },
  questionCard: {
    id: String,
    text: String,
    blanks: Number,
    category: String,
  },
  submissions: [submissionSchema],
  roundState: {
    type: String,
    enum: ["submitting", "judging", "results"],
    default: "submitting",
  },
  timeLeft: { type: Number, default: 90 },
  scores: { type: Map, of: Number, default: {} },
  gameHistory: [roundResultSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

gameSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

export const Game = mongoose.model<GameDocument>("Game", gameSchema);
