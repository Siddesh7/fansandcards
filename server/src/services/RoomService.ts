import { Server } from "socket.io";
import { v4 as uuidv4 } from "uuid";
import { Room } from "../models/Room";
import { Player, GameSettings, Room as RoomInterface } from "../types/game";
import { answerCards } from "../data/cards";
import { GameTreasuryContract } from "../contracts/game-treasury-owner";

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
    socketId: string,
    creatorName: string
  ): Promise<{ room: RoomInterface; player: Player }> {
    const roomId = uuidv4();
    const playerId = uuidv4();

    // Create room creator as first player
    const creator: Player = {
      id: playerId,
      name: creatorName,
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
      depositAmount: "1000000000", // 0.000000001 ETH in wei
      totalPot: "0",
      treasureWallet: "0x9bfeBd2E81725D7a3282cdB01cD1C3732178E954",
    };

    const room = new Room(roomData);
    await room.save();

    // Create game on contract
    try {
      console.log("Creating game on contract for room:", roomId);
      await GameTreasuryContract.createGame(roomId);
      console.log("Game successfully created on contract");
    } catch (error) {
      console.error("Failed to create game on contract:", error);
      // Don't fail room creation if contract fails - log and continue
    }

    // Track socket to player mapping
    this.socketToPlayer.set(socketId, { roomId, playerId });

    return { room: roomData, player: creator };
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

    return { room: room.toObject() as RoomInterface, player: newPlayer };
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

    return room.toObject() as RoomInterface;
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

    return room.toObject() as RoomInterface;
  }

  async getAllRooms(): Promise<RoomInterface[]> {
    const rooms = await Room.find({ gameState: "waiting" }).sort({
      createdAt: -1,
    });
    return rooms.map((room) => room.toObject() as RoomInterface);
  }

  getPlayerInfo(socketId: string): { roomId: string; playerId: string } | null {
    return this.socketToPlayer.get(socketId) || null;
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

  async recordDeposit(
    roomId: string,
    socketId: string,
    txHash: string,
    walletAddress: string
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

    // Update player deposit info
    room.players[playerIndex].hasDeposited = true;
    room.players[playerIndex].depositTxHash = txHash;
    room.players[playerIndex].walletAddress = walletAddress;

    // Update room pot
    const currentPot = BigInt(room.totalPot || "0");
    const depositAmount = BigInt(room.depositAmount);
    room.totalPot = (currentPot + depositAmount).toString();

    await room.save();
    return room.toObject() as RoomInterface;
  }

  async recordPayout(
    roomId: string,
    winnerPlayerId: string,
    txHash: string
  ): Promise<RoomInterface> {
    const room = await Room.findOne({ id: roomId });
    if (!room) {
      throw new Error("Room not found");
    }

    // Update room with payout info
    room.winner = winnerPlayerId;
    room.payoutTxHash = txHash;
    room.gameState = "finished";

    await room.save();
    return room.toObject() as RoomInterface;
  }

  async payoutWinner(
    roomId: string,
    winnerPlayerId: string
  ): Promise<{ room: RoomInterface; txHash: string }> {
    const room = await Room.findOne({ id: roomId });
    if (!room) {
      throw new Error("Room not found");
    }

    const winner = room.players.find((p) => p.id === winnerPlayerId);
    if (!winner || !winner.walletAddress) {
      throw new Error("Winner not found or no wallet address");
    }

    try {
      console.log("Paying out winner on contract:", {
        roomId,
        winnerPlayerId,
        walletAddress: winner.walletAddress,
      });

      const result = await GameTreasuryContract.payoutWinner(
        roomId,
        winner.walletAddress as `0x${string}`
      );

      // Update room with payout info
      room.winner = winnerPlayerId;
      room.payoutTxHash = result.txHash;
      room.gameState = "finished";

      await room.save();

      console.log("Winner payout successful:", result.txHash);
      return { room: room.toObject() as RoomInterface, txHash: result.txHash };
    } catch (error) {
      console.error("Failed to payout winner on contract:", error);
      throw new Error(`Failed to payout winner: ${error}`);
    }
  }

  async canStartGame(roomId: string): Promise<boolean> {
    const room = await Room.findOne({ id: roomId });
    if (!room) {
      return false;
    }

    // Check if all players have deposited
    const allDeposited = room.players.every(
      (player) => player.hasDeposited === true
    );
    const allReady = room.players.every((player) => player.isReady === true);
    const minPlayers = room.players.length >= room.settings.minPlayers;

    return allDeposited && allReady && minPlayers;
  }

  private dealCards(): Player["hand"] {
    // Shuffle answer cards and deal 10 cards (increased from 7 for more variety)
    const shuffled = [...answerCards].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 10);
  }
}
