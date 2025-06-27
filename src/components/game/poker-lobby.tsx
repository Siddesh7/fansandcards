"use client";

import { Room, Player, AnswerCard } from "../../types/game";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Crown,
  Play,
  Clock,
  Copy,
  Check,
  Wifi,
  WifiOff,
  LogOut,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PokerCard } from "./poker-card";
import { useState } from "react";

interface PokerLobbyProps {
  room: Room;
  currentPlayerId?: string;
  isConnected: boolean;
  onToggleReady: () => void;
  onStartGame: () => void;
  onLeaveRoom: () => void;
  sampleCards?: AnswerCard[];
}

export const PokerLobby = ({
  room,
  currentPlayerId,
  isConnected,
  onToggleReady,
  onStartGame,
  onLeaveRoom,
  sampleCards = [],
}: PokerLobbyProps) => {
  const [copied, setCopied] = useState(false);
  const currentPlayer = room.players.find((p) => p.id === currentPlayerId);
  const isHost = room.createdBy === currentPlayerId;
  const readyCount = room.players.filter((p) => p.isReady).length;
  const canStart = readyCount >= room.settings.minPlayers && isHost;

  const roomCode = room.id.slice(-6).toUpperCase();

  const copyRoomCode = async () => {
    try {
      await navigator.clipboard.writeText(roomCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy room code:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-900 p-4 relative">
      {/* Stadium Background with Crowd */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1472396961693-142e6e269027')] bg-cover bg-center opacity-20"></div>

      {/* Casino-style header */}
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 mb-4"
          >
            <span className="relative">
              <span className="text-amber-300">⚽</span>{" "}
              <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent font-black">
                fans
              </span>
              <span className="text-white/70 font-light mx-2">&</span>
              <span className="bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-500 bg-clip-text text-transparent font-black">
                cards
              </span>{" "}
              <span className="text-amber-300">⚽</span>
            </span>
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-amber-500 to-yellow-500 text-black px-8 py-3 rounded-full text-xl font-bold inline-block shadow-lg"
          >
            {room.name}
          </motion.div>
        </div>

        {/* Room info and controls */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Room details card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border-2 border-amber-500/30 shadow-xl"
          >
            <h3 className="text-amber-400 font-bold text-xl mb-4 flex items-center gap-2">
              <Settings size={20} />
              Room Details
            </h3>
            <div className="space-y-3 text-white">
              <div className="flex justify-between">
                <span>Room Code:</span>
                <button
                  onClick={copyRoomCode}
                  className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 px-3 py-1 rounded-md transition-colors font-bold"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  {roomCode}
                </button>
              </div>
              <div className="flex justify-between">
                <span>Max Players:</span>
                <span className="text-amber-400">
                  {room.settings.maxPlayers}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Round Timer:</span>
                <span className="text-amber-400">
                  {room.settings.roundTimer}s
                </span>
              </div>
              <div className="flex justify-between">
                <span>Max Rounds:</span>
                <span className="text-amber-400">
                  {room.settings.maxRounds}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Connection:</span>
                <div className="flex items-center gap-2">
                  {isConnected ? (
                    <Wifi className="text-green-400" size={16} />
                  ) : (
                    <WifiOff className="text-red-400" size={16} />
                  )}
                  <span
                    className={isConnected ? "text-green-400" : "text-red-400"}
                  >
                    {isConnected ? "Connected" : "Disconnected"}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Players card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border-2 border-amber-500/30 shadow-xl"
          >
            <h3 className="text-amber-400 font-bold text-xl mb-4 flex items-center gap-2">
              <Users size={20} />
              Players ({room.players.length}/{room.settings.maxPlayers})
            </h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {room.players.map((player, index) => (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-lg border-2",
                    player.id === currentPlayerId
                      ? "bg-blue-600/20 border-blue-400"
                      : "bg-gray-700/50 border-gray-600",
                    !player.isConnected && "opacity-50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg",
                        player.id === currentPlayerId
                          ? "bg-blue-500 text-white"
                          : "bg-gray-600 text-gray-200"
                      )}
                    >
                      {player.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-white font-medium flex items-center gap-2">
                        {player.name}
                        {room.createdBy === player.id && (
                          <Crown className="text-amber-400" size={16} />
                        )}
                      </div>
                      <div className="text-sm text-gray-400">
                        {player.score} points
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {player.isReady ? (
                      <div className="bg-green-500 text-white px-2 py-1 rounded text-sm font-medium">
                        Ready
                      </div>
                    ) : (
                      <div className="bg-gray-600 text-gray-300 px-2 py-1 rounded text-sm">
                        Waiting
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Controls card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border-2 border-amber-500/30 shadow-xl"
          >
            <h3 className="text-amber-400 font-bold text-xl mb-4">
              Game Controls
            </h3>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-white mb-2">
                  Ready: {readyCount}/{room.players.length}
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
                  <div
                    className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${(readyCount / room.players.length) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <Button
                onClick={onToggleReady}
                disabled={!isConnected}
                className={cn(
                  "w-full py-3 font-bold text-lg transition-all duration-200",
                  currentPlayer?.isReady
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-green-600 hover:bg-green-700 text-white"
                )}
              >
                {currentPlayer?.isReady ? "Not Ready" : "Ready Up!"}
              </Button>

              {isHost && (
                <Button
                  onClick={onStartGame}
                  disabled={!canStart || !isConnected}
                  className="w-full bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-black font-bold py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Play className="mr-2" size={20} />
                  Start Game
                </Button>
              )}

              <Button
                onClick={onLeaveRoom}
                variant="outline"
                className="w-full border-red-500 text-red-400 hover:bg-red-500 hover:text-white py-3"
              >
                <LogOut className="mr-2" size={16} />
                Leave Room
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Sample cards preview */}
        {sampleCards.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border-2 border-amber-500/30 shadow-xl"
          >
            <h3 className="text-amber-400 font-bold text-xl mb-4 text-center">
              Sample Cards - Get Ready to Roast! 🔥
            </h3>
            <div className="flex justify-center gap-4 overflow-x-auto pb-4">
              {sampleCards.slice(0, 5).map((card, index) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 20, rotateY: 180 }}
                  animate={{ opacity: 1, y: 0, rotateY: 0 }}
                  transition={{
                    delay: 0.7 + index * 0.1,
                    duration: 0.6,
                  }}
                >
                  <PokerCard
                    card={card}
                    size="sm"
                    className="hover:transform hover:scale-110 transition-transform duration-200"
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
