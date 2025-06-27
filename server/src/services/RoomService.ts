import { Server } from "socket.io";
import { v4 as uuidv4 } from "uuid";
import { Room } from "../models/Room";
import { Player, GameSettings, Room as RoomInterface } from "../types/game";
import { answerCards } from "../data/cards";

export class RoomService {
  private io: Server;
  private socketToPlayer: Map<string, { roomId: string; playerId: string }> =
    new Map();

  constructor(io: Server) {
    this.io = io;
  }

  async createRoom(
    name: string,
    settings: GameSettings,
    socketId: string
  ): Promise<RoomInterface> {
    const roomId = uuidv4();
    const playerId = uuidv4();

    // Create room creator as first player
    const creator: Player = {
      id: playerId,
      name: "Host",
      score: 0,
      isReady: false,
      isConnected: true,
      hand: this.dealCards(),
    };

    const roomData = {
      id: roomId,
      name,
      players: [creator],
      maxPlayers: settings.maxPlayers,
      isPrivate: false,
      gameState: "waiting" as const,
      settings,
      createdAt: new Date(),
      createdBy: playerId,
    };

    const room = new Room(roomData);
    await room.save();

    // Track socket to player mapping
    this.socketToPlayer.set(socketId, { roomId, playerId });

    return roomData;
  }

  async joinRoom(
    roomId: string,
    playerName: string,
    socketId: string
  ): Promise<{ room: RoomInterface; player: Player }> {
    const room = await Room.findOne({ id: roomId });
    if (!room) {
      throw new Error("Room not found");
    }

    if (room.players.length >= room.maxPlayers) {
      throw new Error("Room is full");
    }

    if (room.gameState !== "waiting") {
      throw new Error("Game already in progress");
    }

    const playerId = uuidv4();
    const newPlayer: Player = {
      id: playerId,
      name: playerName,
      score: 0,
      isReady: false,
      isConnected: true,
      hand: this.dealCards(),
    };

    room.players.push(newPlayer);
    await room.save();

    // Track socket to player mapping
    this.socketToPlayer.set(socketId, { roomId, playerId });

    return { room: room.toObject(), player: newPlayer };
  }

  async leaveRoom(
    roomId: string,
    socketId: string
  ): Promise<RoomInterface | null> {
    const playerInfo = this.socketToPlayer.get(socketId);
    if (!playerInfo || playerInfo.roomId !== roomId) {
      return null;
    }

    const room = await Room.findOne({ id: roomId });
    if (!room) {
      return null;
    }

    // Remove player from room
    room.players = room.players.filter((p) => p.id !== playerInfo.playerId);

    // If room is empty, delete it
    if (room.players.length === 0) {
      await Room.deleteOne({ id: roomId });
      this.socketToPlayer.delete(socketId);
      return null;
    }

    await room.save();
    this.socketToPlayer.delete(socketId);

    return room.toObject();
  }

  async toggleReady(
    roomId: string,
    socketId: string,
    isReady: boolean
  ): Promise<RoomInterface> {
    const playerInfo = this.socketToPlayer.get(socketId);
    if (!playerInfo || playerInfo.roomId !== roomId) {
      throw new Error("Player not in room");
    }

    const room = await Room.findOne({ id: roomId });
    if (!room) {
      throw new Error("Room not found");
    }

    const playerIndex = room.players.findIndex(
      (p) => p.id === playerInfo.playerId
    );
    if (playerIndex === -1) {
      throw new Error("Player not found in room");
    }

    room.players[playerIndex].isReady = isReady;
    await room.save();

    return room.toObject();
  }

  async getAllRooms(): Promise<RoomInterface[]> {
    const rooms = await Room.find({ gameState: "waiting" }).sort({
      createdAt: -1,
    });
    return rooms.map((room) => room.toObject());
  }

  async handleDisconnect(socketId: string): Promise<void> {
    const playerInfo = this.socketToPlayer.get(socketId);
    if (!playerInfo) {
      return;
    }

    const room = await Room.findOne({ id: playerInfo.roomId });
    if (!room) {
      this.socketToPlayer.delete(socketId);
      return;
    }

    const playerIndex = room.players.findIndex(
      (p) => p.id === playerInfo.playerId
    );
    if (playerIndex !== -1) {
      room.players[playerIndex].isConnected = false;
      await room.save();

      // Emit updated room to other players
      this.io.to(playerInfo.roomId).emit("room:updated", room.toObject());
    }

    this.socketToPlayer.delete(socketId);
  }

  private dealCards(): Player["hand"] {
    // Shuffle answer cards and deal 7 cards
    const shuffled = [...answerCards].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 7);
  }
}
