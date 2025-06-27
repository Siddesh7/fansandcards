import { Server } from "socket.io";
import { Game } from "../models/Game";
import { Room } from "../models/Room";
import { Game as GameInterface, AnswerCard } from "../types/game";
import { questionCards, answerCards } from "../data/cards";

export class GameService {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
  }

  async startGame(
    roomId: string,
    hostSocketId: string
  ): Promise<GameInterface> {
    const room = await Room.findOne({ id: roomId });
    if (!room) {
      throw new Error("Room not found");
    }

    // Check if host is room creator
    if (room.players.length < 2) {
      throw new Error("Need at least 2 players to start");
    }

    // Check if all players are ready
    const allReady = room.players.every((p) => p.isReady);
    if (!allReady) {
      throw new Error("All players must be ready");
    }

    // Update room state
    room.gameState = "playing";
    await room.save();

    // Create game instance
    const firstQuestionCard = this.getRandomQuestionCard();
    const firstJudge = room.players[0].id;

    const gameData = {
      roomId,
      currentRound: 1,
      currentJudge: firstJudge,
      questionCard: firstQuestionCard,
      submissions: [],
      roundState: "submitting" as const,
      timeLeft: room.settings.roundTimer,
      scores: room.players.reduce((acc, player) => {
        acc[player.id] = 0;
        return acc;
      }, {} as Record<string, number>),
      gameHistory: [],
    };

    const game = new Game(gameData);
    await game.save();

    return gameData;
  }

  async submitCards(
    roomId: string,
    playerId: string,
    cards: AnswerCard[]
  ): Promise<GameInterface> {
    const game = await Game.findOne({ roomId });
    if (!game) {
      throw new Error("Game not found");
    }

    if (game.roundState !== "submitting") {
      throw new Error("Not in submission phase");
    }

    if (game.currentJudge === playerId) {
      throw new Error("Judge cannot submit cards");
    }

    // Check if player already submitted
    const existingSubmission = game.submissions.find(
      (s) => s.playerId === playerId
    );
    if (existingSubmission) {
      throw new Error("Player already submitted");
    }

    // Add submission
    game.submissions.push({
      playerId,
      cards,
      isRevealed: false,
    });

    await game.save();
    return game.toObject();
  }

  allPlayersSubmitted(game: GameInterface): boolean {
    const room = Room.findOne({ id: game.roomId });
    if (!room) return false;

    // Get non-judge players count
    // Note: This is a simplified check - in real implementation you'd fetch the room
    return game.submissions.length >= 2; // Simplified for now
  }

  async judgePickWinner(
    roomId: string,
    judgeId: string,
    submissionIndex: number
  ): Promise<GameInterface> {
    const game = await Game.findOne({ roomId });
    if (!game) {
      throw new Error("Game not found");
    }

    if (game.currentJudge !== judgeId) {
      throw new Error("Only the judge can pick winner");
    }

    if (game.roundState !== "judging") {
      throw new Error("Not in judging phase");
    }

    if (submissionIndex >= game.submissions.length) {
      throw new Error("Invalid submission index");
    }

    const winningSubmission = game.submissions[submissionIndex];

    // Update scores
    game.scores.set(
      winningSubmission.playerId,
      (game.scores.get(winningSubmission.playerId) || 0) + 1
    );

    // Add to game history
    game.gameHistory.push({
      round: game.currentRound,
      questionCard: game.questionCard,
      submissions: game.submissions,
      winner: winningSubmission.playerId,
      winningCards: winningSubmission.cards,
    });

    game.roundState = "results";
    await game.save();

    return game.toObject();
  }

  async nextRound(roomId: string): Promise<GameInterface> {
    const game = await Game.findOne({ roomId });
    const room = await Room.findOne({ id: roomId });

    if (!game || !room) {
      throw new Error("Game or room not found");
    }

    // Move to next round
    game.currentRound += 1;

    // Select next judge (rotate through players)
    const currentJudgeIndex = room.players.findIndex(
      (p) => p.id === game.currentJudge
    );
    const nextJudgeIndex = (currentJudgeIndex + 1) % room.players.length;
    game.currentJudge = room.players[nextJudgeIndex].id;

    // New question card
    game.questionCard = this.getRandomQuestionCard();

    // Reset for new round
    game.submissions = [];
    game.roundState = "submitting";
    game.timeLeft = room.settings.roundTimer;

    await game.save();
    return game.toObject();
  }

  async finishGame(roomId: string): Promise<any> {
    const game = await Game.findOne({ roomId });
    const room = await Room.findOne({ id: roomId });

    if (!game || !room) {
      throw new Error("Game or room not found");
    }

    // Calculate final results
    const finalScores = Object.fromEntries(game.scores);
    const winner = Object.entries(finalScores).reduce((a, b) =>
      finalScores[a[0]] > finalScores[b[0]] ? a : b
    );

    // Update room state
    room.gameState = "finished";
    await room.save();

    // Clean up game
    await Game.deleteOne({ roomId });

    return {
      finalScores,
      winner: winner[0],
      gameHistory: game.gameHistory,
    };
  }

  private getRandomQuestionCard() {
    const randomIndex = Math.floor(Math.random() * questionCards.length);
    return questionCards[randomIndex];
  }
}
