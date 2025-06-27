import { Server, Socket } from "socket.io";
import { v4 as uuidv4 } from "uuid";
import { Room } from "../models/Room";
import { Game } from "../models/Game";
import { GameService } from "../services/GameService";
import { RoomService } from "../services/RoomService";

export const setupSocketHandlers = (io: Server) => {
  const roomService = new RoomService(io);
  const gameService = new GameService(io);

  io.on("connection", (socket: Socket) => {
    console.log(`🎮 Player connected: ${socket.id}`);

    // Room management
    socket.on("room:create", async (data) => {
      try {
        const room = await roomService.createRoom(
          data.name,
          data.settings,
          socket.id
        );
        socket.join(room.id);
        socket.emit("room:created", room);
        io.emit("rooms:updated");
      } catch (error) {
        socket.emit("error", {
          message: "Failed to create room",
          code: "ROOM_CREATE_ERROR",
        });
      }
    });

    socket.on("room:join", async (data) => {
      try {
        const { room, player } = await roomService.joinRoom(
          data.roomId,
          data.playerName,
          socket.id
        );
        socket.join(data.roomId);
        socket.emit("room:joined", { room, playerId: player.id });
        io.to(data.roomId).emit("room:updated", room);
        io.emit("rooms:updated");
      } catch (error) {
        socket.emit("error", {
          message: "Failed to join room",
          code: "ROOM_JOIN_ERROR",
        });
      }
    });

    socket.on("room:leave", async (data) => {
      try {
        const room = await roomService.leaveRoom(data.roomId, socket.id);
        socket.leave(data.roomId);
        if (room) {
          io.to(data.roomId).emit("room:updated", room);
        }
        io.emit("rooms:updated");
      } catch (error) {
        socket.emit("error", {
          message: "Failed to leave room",
          code: "ROOM_LEAVE_ERROR",
        });
      }
    });

    socket.on("room:ready", async (data) => {
      try {
        const room = await roomService.toggleReady(
          data.roomId,
          socket.id,
          data.isReady
        );
        io.to(data.roomId).emit("room:updated", room);
      } catch (error) {
        socket.emit("error", {
          message: "Failed to update ready state",
          code: "READY_ERROR",
        });
      }
    });

    // Game management
    socket.on("game:start", async (data) => {
      try {
        const game = await gameService.startGame(data.roomId, socket.id);
        io.to(data.roomId).emit("game:started", game);
        io.emit("rooms:updated");
      } catch (error) {
        socket.emit("error", {
          message: "Failed to start game",
          code: "GAME_START_ERROR",
        });
      }
    });

    socket.on("game:submit-cards", async (data) => {
      try {
        const game = await gameService.submitCards(
          data.roomId,
          socket.id,
          data.cards
        );
        io.to(data.roomId).emit("game:updated", game);

        // Check if all players have submitted
        if (gameService.allPlayersSubmitted(game)) {
          io.to(data.roomId).emit("game:judging-phase", game);
        }
      } catch (error) {
        socket.emit("error", {
          message: "Failed to submit cards",
          code: "SUBMIT_ERROR",
        });
      }
    });

    socket.on("game:judge-pick", async (data) => {
      try {
        const game = await gameService.judgePickWinner(
          data.roomId,
          socket.id,
          data.submissionIndex
        );
        io.to(data.roomId).emit("game:round-result", game);

        // Check if game is finished
        if (game.currentRound >= 5) {
          const finalResults = await gameService.finishGame(data.roomId);
          io.to(data.roomId).emit("game:finished", finalResults);
          io.emit("rooms:updated");
        } else {
          // Auto-start next round after delay
          setTimeout(async () => {
            try {
              const nextRoundGame = await gameService.nextRound(data.roomId);
              io.to(data.roomId).emit("game:next-round", nextRoundGame);
            } catch (error) {
              console.error("Failed to start next round:", error);
            }
          }, 5000); // 5 second delay
        }
      } catch (error) {
        socket.emit("error", {
          message: "Failed to pick winner",
          code: "JUDGE_ERROR",
        });
      }
    });

    // Disconnect handling
    socket.on("disconnect", () => {
      console.log(`👋 Player disconnected: ${socket.id}`);
      roomService.handleDisconnect(socket.id);
    });
  });
};
