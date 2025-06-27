import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Room, Game } from "../types/game";

const SERVER_URL = "https://fansadncard-backend.onrender.com";

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [currentGame, setCurrentGame] = useState<Game | null>(null);
  const [gameResults, setGameResults] = useState<any | null>(null);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    socketRef.current = io(SERVER_URL, {
      transports: ["websocket", "polling"],
    });

    const socket = socketRef.current;

    socket.on("connect", () => {
      console.log("🎮 Connected to server");
      setIsConnected(true);
      setError(null);
      fetchRooms();
    });

    socket.on("disconnect", () => {
      console.log("👋 Disconnected from server");
      setIsConnected(false);
    });

    socket.on("connect_error", (error: any) => {
      console.error("❌ Connection error:", error);
      setError("Failed to connect to server");
      setIsConnected(false);
    });

    // Room events
    socket.on("room:created", (data: { room: Room; playerId: string }) => {
      console.log("🏠 Room created and joined:", data);
      setCurrentRoom(data.room);
      setPlayerId(data.playerId);
      fetchRooms();
    });

    socket.on("room:joined", (data: { room: Room; playerId: string }) => {
      console.log("🚪 Joined room:", data);
      setCurrentRoom(data.room);
      setPlayerId(data.playerId);
    });

    socket.on("room:updated", (room: Room) => {
      console.log("🔄 Room updated:", room);
      setCurrentRoom(room);
    });

    socket.on("rooms:updated", () => {
      console.log("📋 Rooms list updated");
      fetchRooms();
    });

    socket.on("room:left", () => {
      console.log("🚪 Left room");
      setCurrentRoom(null);
      setCurrentGame(null);
      setPlayerId(null);
    });

    // Game events
    socket.on("game:started", (game: Game) => {
      console.log("🎯 Game started:", game);
      setCurrentGame(game);
    });

    socket.on("game:updated", (game: Game) => {
      console.log("🎮 Game updated:", game);
      console.log("🎮 Game scores received:", game.scores);
      console.log("🎮 Game scores type:", typeof game.scores);
      setCurrentGame(game);
    });

    socket.on("game:judging-phase", (game: Game) => {
      console.log("⚖️ Judging phase:", game);
      console.log("⚖️ Game scores at judging:", game.scores);
      setCurrentGame(game);
    });

    socket.on("game:round-result", (game: Game) => {
      console.log("🏆 Round result:", game);
      console.log("🏆 Game scores after round:", game.scores);
      setCurrentGame(game);
    });

    socket.on("game:next-round", (game: Game) => {
      console.log("➡️ Next round:", game);
      console.log("➡️ Game scores in next round:", game.scores);
      setCurrentGame(game);
    });

    socket.on("game:finished", (results: any) => {
      console.log("🎊 Game finished:", results);
      setCurrentGame(null);
      setGameResults(results);
    });

    socket.on("error", (error: { message: string; code: string }) => {
      console.error("🚨 Server error:", error);
      setError(error.message);
    });

    // Betting events
    socket.on("deposit:confirmed", (data: { txHash: string }) => {
      console.log("💰 Deposit confirmed:", data);
    });

    socket.on(
      "payout:completed",
      (data: { winnerPlayerId: string; amount: string; txHash: string }) => {
        console.log("🏆 Payout completed:", data);
      }
    );

    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/api/rooms`);
      if (response.ok) {
        const roomsData = await response.json();
        setRooms(roomsData);
      }
    } catch (error) {
      console.error("Failed to fetch rooms:", error);
    }
  };

  const createRoom = (name: string, settings: any, playerName: string) => {
    if (socketRef.current) {
      socketRef.current.emit("room:create-and-join", {
        name,
        settings,
        playerName: playerName.trim(),
      });
    }
  };

  const joinRoom = (roomId: string, playerName: string) => {
    if (socketRef.current) {
      socketRef.current.emit("room:join", {
        roomId,
        playerName: playerName.trim(),
      });
    }
  };

  const joinRoomByCode = (roomCode: string, playerName: string) => {
    if (socketRef.current) {
      socketRef.current.emit("room:join-by-code", {
        roomCode,
        playerName: playerName.trim(),
      });
    }
  };

  const leaveRoom = (roomId: string) => {
    if (socketRef.current) {
      socketRef.current.emit("room:leave", { roomId });
    }
  };

  const toggleReady = (roomId: string, isReady: boolean) => {
    if (socketRef.current) {
      socketRef.current.emit("room:ready", { roomId, isReady });
    }
  };

  const startGame = (roomId: string) => {
    if (socketRef.current) {
      socketRef.current.emit("game:start", { roomId });
    }
  };

  const submitCards = (roomId: string, cards: any[]) => {
    if (socketRef.current) {
      socketRef.current.emit("game:submit-cards", { roomId, cards });
    }
  };

  const judgePick = (roomId: string, submissionIndex: number) => {
    if (socketRef.current) {
      socketRef.current.emit("game:judge-pick", { roomId, submissionIndex });
    }
  };

  const recordDeposit = (
    roomId: string,
    txHash: string,
    walletAddress: string
  ) => {
    if (socketRef.current) {
      socketRef.current.emit("room:deposit", {
        roomId,
        txHash,
        walletAddress,
      });
    }
  };

  const recordPayout = (
    roomId: string,
    winnerPlayerId: string,
    txHash: string
  ) => {
    if (socketRef.current) {
      socketRef.current.emit("room:payout", {
        roomId,
        winnerPlayerId,
        txHash,
      });
    }
  };

  const clearError = () => setError(null);
  const clearResults = () => setGameResults(null);

  return {
    isConnected,
    rooms,
    currentRoom,
    currentGame,
    gameResults,
    playerId,
    error,
    createRoom,
    joinRoom,
    joinRoomByCode,
    leaveRoom,
    toggleReady,
    startGame,
    submitCards,
    judgePick,
    clearError,
    clearResults,
    fetchRooms,
    recordDeposit,
    recordPayout,
  };
};
