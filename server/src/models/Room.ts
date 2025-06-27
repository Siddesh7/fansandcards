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
});

export const Room = mongoose.model<RoomDocument>("Room", roomSchema);
