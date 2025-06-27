import { Server } from "socket.io";
import { Game } from "../models/Game";
import { Room } from "../models/Room";
import { Game as GameInterface, AnswerCard, Player } from "../types/game";
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

    // Create game instance - NO JUDGE, everyone plays
    const firstQuestionCard = this.getRandomQuestionCard();
    const randomPicker = this.getRandomPlayer(room.players);

    const gameData = {
      roomId,
      currentRound: 1,
      currentJudge: randomPicker.id, // Actually the "picker" not judge
      questionCard: firstQuestionCard,
      submissions: [],
      roundState: "submitting" as const,
      timeLeft: room.settings.roundTimer,
      scores: room.players.reduce((acc, player) => {
        acc[player.id] = player.score || 0;
        return acc;
      }, {} as Record<string, number>),
      gameHistory: [],
    };

    const game = new Game(gameData);
    await game.save();

    // Convert to plain object and ensure scores are properly serialized
    const gameObject = game.toObject();
    if (gameObject.scores instanceof Map) {
      gameObject.scores = Object.fromEntries(gameObject.scores);
    }

    return gameObject;
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

    // ONLY NON-PICKERS can submit cards
    // Check if this player is the current picker/judge
    if (playerId === game.currentJudge) {
      throw new Error(
        "The picker/judge cannot submit cards in their own round"
      );
    }

    // Check if player already submitted
    const existingSubmission = game.submissions.find(
      (s) => s.playerId === playerId
    );
    if (existingSubmission) {
      throw new Error("Player already submitted");
    }

    // Remove submitted cards from player's hand
    const room = await Room.findOne({ id: roomId });
    if (room) {
      const playerIndex = room.players.findIndex((p) => p.id === playerId);
      if (playerIndex !== -1) {
        const submittedCardIds = cards.map((c) => c.id);
        room.players[playerIndex].hand = room.players[playerIndex].hand.filter(
          (card) => !submittedCardIds.includes(card.id)
        );
        await room.save();
      }
    }

    // Add submission
    game.submissions.push({
      playerId,
      cards,
      isRevealed: false,
    });

    await game.save();

    // Check if ALL NON-PICKER players have submitted
    if (room) {
      const nonPickerPlayersCount = room.players.length - 1; // Exclude the picker
      if (game.submissions.length >= nonPickerPlayersCount) {
        game.roundState = "judging";
        await game.save();
      }
    }

    // Convert to plain object and ensure scores are properly serialized
    const gameObject = game.toObject();
    if (gameObject.scores instanceof Map) {
      gameObject.scores = Object.fromEntries(gameObject.scores);
    }

    return gameObject;
  }

  async allPlayersSubmitted(game: GameInterface): Promise<boolean> {
    const room = await Room.findOne({ id: game.roomId });
    if (!room) return false;

    // Only NON-PICKER players need to submit (picker is the judge)
    const nonPickerPlayersCount = room.players.length - 1;
    return game.submissions.length >= nonPickerPlayersCount;
  }

  async judgePickWinner(
    roomId: string,
    pickerId: string,
    submissionIndex: number
  ): Promise<GameInterface> {
    const game = await Game.findOne({ roomId });
    if (!game) {
      throw new Error("Game not found");
    }

    if (game.currentJudge !== pickerId) {
      throw new Error("Only the designated picker can choose winner");
    }

    if (game.roundState !== "judging") {
      throw new Error("Not in judging phase");
    }

    if (submissionIndex >= game.submissions.length) {
      throw new Error("Invalid submission index");
    }

    const winningSubmission = game.submissions[submissionIndex];
    console.log("🏆 Winning submission:", winningSubmission);
    console.log("🏆 Current picker (judge):", pickerId);
    console.log("🏆 Winning player:", winningSubmission.playerId);
    console.log("🏆 Scores before update:", game.scores);

    // Note: In this game, the picker can participate and potentially win
    // This is different from traditional Cards Against Humanity where judge doesn't play

    // Update scores - winner gets 5 points
    // Handle both Map and Object formats for MongoDB compatibility
    const currentScore =
      game.scores instanceof Map
        ? game.scores.get(winningSubmission.playerId)
        : game.scores[winningSubmission.playerId];
    const newScore = (currentScore || 0) + 5;

    if (game.scores instanceof Map) {
      // If it's a Map, use set method
      game.scores.set(winningSubmission.playerId, newScore);
    } else {
      // If it's an object, use bracket notation
      game.scores[winningSubmission.playerId] = newScore;
    }

    console.log("🏆 Scores after update:", game.scores);
    console.log(
      `🎯 Round ${game.currentRound}: ${winningSubmission.playerId} wins 5 points!`
    );

    // Update the room players' scores to match game scores
    const room = await Room.findOne({ id: roomId });
    if (room) {
      room.players.forEach((player) => {
        if (game.scores instanceof Map) {
          player.score = game.scores.get(player.id) || 0;
        } else {
          player.score = game.scores[player.id] || 0;
        }
      });
      await room.save();
      console.log(
        "🏆 Room player scores updated:",
        room.players.map((p) => ({ id: p.id, name: p.name, score: p.score }))
      );
    }

    // Add to game history with enhanced logging
    game.gameHistory.push({
      round: game.currentRound,
      questionCard: game.questionCard,
      submissions: game.submissions,
      winner: winningSubmission.playerId,
      winningCards: winningSubmission.cards,
    });

    game.roundState = "results";
    await game.save();

    // Convert to plain object and ensure scores are properly serialized
    const gameObject = game.toObject();
    if (gameObject.scores instanceof Map) {
      gameObject.scores = Object.fromEntries(gameObject.scores);
    }

    console.log("🏆 Final game object with scores:", gameObject.scores);

    return gameObject;
  }

  async nextRound(roomId: string): Promise<GameInterface> {
    const game = await Game.findOne({ roomId });
    const room = await Room.findOne({ id: roomId });

    if (!game || !room) {
      throw new Error("Game or room not found");
    }

    console.log(
      "🔄 Next round - Current game scores before update:",
      game.scores
    );
    console.log(
      "🔄 Next round - Current room scores:",
      room.players.map((p) => ({ id: p.id, name: p.name, score: p.score }))
    );

    // CRITICAL FIX: Sync game scores with room scores before moving to next round
    // This ensures scores persist across rounds
    room.players.forEach((player) => {
      if (game.scores instanceof Map) {
        game.scores.set(player.id, player.score || 0);
      } else {
        game.scores[player.id] = player.score || 0;
      }
    });

    console.log(
      "🔄 Next round - Game scores after syncing with room:",
      game.scores
    );

    // Move to next round
    game.currentRound += 1;

    // Select random picker for next round
    const randomPicker = this.getRandomPlayer(room.players);
    game.currentJudge = randomPicker.id; // Using currentJudge field for picker

    console.log(
      `🎲 Round ${game.currentRound} Picker: ${randomPicker.name} (${randomPicker.id})`
    );
    console.log(
      `🎯 Non-picker players who will submit cards: ${room.players
        .filter((p) => p.id !== randomPicker.id)
        .map((p) => p.name)
        .join(", ")}`
    );

    // New question card
    game.questionCard = this.getRandomQuestionCard();

    // Reset for new round
    game.submissions = [];
    game.roundState = "submitting";
    game.timeLeft = room.settings.roundTimer;

    // DO NOT RESET SCORES - they should persist across rounds
    console.log(
      "🔄 Next round - Game scores after round setup (should be same):",
      game.scores
    );

    await game.save();

    // Convert to plain object and ensure scores are properly serialized
    const gameObject = game.toObject();
    if (gameObject.scores instanceof Map) {
      gameObject.scores = Object.fromEntries(gameObject.scores);
    }

    console.log(
      "🔄 Next round - Final game object scores being sent:",
      gameObject.scores
    );

    console.log(`🔄 Starting Round ${game.currentRound + 1} of 5`);
    console.log("🔄 Score Summary Before Round:");
    room.players.forEach((player) => {
      const gameScore =
        game.scores instanceof Map
          ? game.scores.get(player.id)
          : game.scores[player.id];
      console.log(
        `   ${player.name}: Game=${gameScore || 0} Room=${player.score || 0}`
      );
    });

    return gameObject;
  }

  async finishGame(roomId: string): Promise<any> {
    const game = await Game.findOne({ roomId });
    const room = await Room.findOne({ id: roomId });

    if (!game || !room) {
      throw new Error("Game or room not found");
    }

    console.log("🏁 Game finishing. Raw scores:", game.scores);
    console.log("🏁 Game scores type:", typeof game.scores);
    console.log("🏁 Game scores entries:", Object.entries(game.scores));

    // Enhanced score debugging
    console.log("🏁 FINAL GAME SUMMARY:");
    console.log(`   Total Rounds Played: ${game.gameHistory.length}`);
    game.gameHistory.forEach((round, index) => {
      const winnerName =
        room.players.find((p) => p.id === round.winner)?.name || "Unknown";
      console.log(
        `   Round ${index + 1}: Winner = ${winnerName} (${round.winner})`
      );
    });

    // Calculate final results - ensure scores are properly converted
    const finalScores: Record<string, number> = {};
    if (game.scores instanceof Map) {
      // If it's a Map, convert to object
      for (const [playerId, score] of game.scores) {
        finalScores[playerId] = score;
      }
    } else {
      // If it's already an object, use it directly
      Object.assign(finalScores, game.scores);
    }

    console.log("🏁 Final scores object:", finalScores);

    // Find winner
    const winner = Object.entries(finalScores).reduce((a, b) =>
      finalScores[a[0]] > finalScores[b[0]] ? a : b
    );

    console.log("🏁 Winner:", winner);

    // Include player names in final scores for frontend
    const finalScoresWithNames = Object.entries(finalScores).reduce(
      (acc, [playerId, score]) => {
        const player = room.players.find((p) => p.id === playerId);
        acc[playerId] = {
          score,
          name: player?.name || "Unknown",
        };
        return acc;
      },
      {} as Record<string, { score: number; name: string }>
    );

    // Reset room state for potential replay
    room.gameState = "waiting";
    room.players.forEach((player) => {
      player.isReady = false;
      // Reset their hand with new cards for potential replay
      player.hand = this.dealCards();
    });
    await room.save();

    // Clean up game
    await Game.deleteOne({ roomId });

    const results = {
      finalScores,
      finalScoresWithNames,
      winner: winner[0],
      winnerName:
        room.players.find((p) => p.id === winner[0])?.name || "Unknown",
      gameHistory: game.gameHistory,
    };

    console.log("🏁 Final results being sent:", results);

    return results;
  }

  private getRandomQuestionCard() {
    const randomIndex = Math.floor(Math.random() * questionCards.length);
    return questionCards[randomIndex];
  }

  private getRandomPlayer(players: any[]) {
    const randomIndex = Math.floor(Math.random() * players.length);
    return players[randomIndex];
  }

  private dealCards(): Player["hand"] {
    // Shuffle answer cards and deal 10 cards (increased from 7 for more variety)
    const shuffled = [...answerCards].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 10);
  }
}
