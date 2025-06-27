import mongoose, { Schema, Document } from "mongoose";
import { Room as RoomInterface, Player, GameSettings } from "../types/game";

interface RoomDocument extends Document, Omit<RoomInterface, "id"> {}

const playerSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  avatar: { type: String },
  score: { type: Number, default: 0 },
  isReady: { type: Boolean, default: false },
  isConnected: { type: Boolean, default: true },
  hasDeposited: { type: Boolean, default: false },
  depositTxHash: { type: String },
  walletAddress: { type: String },
  hand: [
    {
      id: String,
      text: String,
      category: String,
      rarity: String,
    },
  ],
});

const gameSettingsSchema = new Schema({
  maxRounds: { type: Number, default: 5 },
  roundTimer: { type: Number, default: 90 }, // 90 seconds
  maxPlayers: { type: Number, default: 8 },
  minPlayers: { type: Number, default: 2 },
});

const roomSchema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  players: [playerSchema],
  maxPlayers: { type: Number, default: 8 },
  isPrivate: { type: Boolean, default: false },
  gameState: {
    type: String,
    enum: ["waiting", "playing", "finished"],
    default: "waiting",
  },
  settings: gameSettingsSchema,
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: String, required: true },
  depositAmount: { type: String, default: "1000000000000000000" }, // 1 CHZ in wei
  totalPot: { type: String, default: "0" },
  treasureWallet: {
    type: String,
    default: "0x8202f7875f0417593CC4a8391dA08874A1eb0EAF",
  },
  winner: { type: String },
  payoutTxHash: { type: String },
});

export const Room = mongoose.model<RoomDocument>("Room", roomSchema);
