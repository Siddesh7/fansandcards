"use client";

import React from "react";
import { Game, Player, Submission } from "../../types/game";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, Trophy, Star, Sparkles, HelpCircle } from "lucide-react";
import { PokerCard } from "./poker-card";

interface RoundWinnerCelebrationProps {
  currentGame: Game;
  players: Player[];
  winningSubmission?: Submission;
  onComplete?: () => void;
  currentRoom?: any; // Add room prop to access pot info
}

export const RoundWinnerCelebration = ({
  currentGame,
  players,
  winningSubmission,
  onComplete,
  currentRoom,
}: RoundWinnerCelebrationProps) => {
  // Find the winning player
  const winningPlayer = players.find(
    (p) => p.id === winningSubmission?.playerId
  );

  if (!winningSubmission || !winningPlayer) {
    return null;
  }

  // Auto-hide after 5 seconds (increased to give more time to read question)
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  const playerColor = `hsl(${
    (winningSubmission.playerId.charCodeAt(0) * 137.5) % 360
  }, 70%, 50%)`;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.3, opacity: 0, rotateY: 180 }}
          animate={{ scale: 1, opacity: 1, rotateY: 0 }}
          exit={{ scale: 1.1, opacity: 0 }}
          transition={{
            type: "spring",
            damping: 20,
            stiffness: 300,
            duration: 0.8,
          }}
          className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 border-4 border-amber-500 shadow-2xl max-w-4xl w-full mx-4 relative overflow-hidden"
        >
          {/* Celebration particles background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0, x: "50%", y: "50%" }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  x: `${Math.random() * 100}%`,
                  y: `${Math.random() * 100}%`,
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.1,
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
                className="absolute w-2 h-2 bg-amber-400 rounded-full"
              />
            ))}
          </div>

          {/* Trophy icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, type: "spring", damping: 15 }}
            className="text-center mb-6"
          >
            <Trophy className="text-amber-400 mx-auto mb-4" size={64} />
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-500 mb-2"
            >
              🏆 Round {currentGame.currentRound} Winner! 🏆
            </motion.h1>
          </motion.div>

          {/* Winner player info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-center mb-6"
          >
            <div className="flex flex-col items-center gap-4">
              {/* Player avatar with celebration effect */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8, type: "spring", damping: 12 }}
                className="relative"
              >
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-2xl border-4 border-amber-400 relative"
                  style={{ background: playerColor }}
                >
                  {winningPlayer.name.charAt(0).toUpperCase()}

                  {/* Glowing ring effect */}
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.8, 0.3, 0.8] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 rounded-full border-4 border-amber-400"
                  />

                  {/* Crown on top */}
                  <motion.div
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: -25, opacity: 1 }}
                    transition={{ delay: 1, type: "spring" }}
                    className="absolute top-0 left-1/2 transform -translate-x-1/2"
                  >
                    <Crown className="text-amber-400" size={24} />
                  </motion.div>
                </div>
              </motion.div>

              <div>
                <motion.h2
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  className="text-3xl font-bold text-white mb-2"
                >
                  {winningPlayer.name}
                </motion.h2>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="text-amber-400 font-bold text-lg"
                >
                  +5 Points! • Total: {winningPlayer.score} pts
                </motion.div>

                {/* Current Pot Information */}
                {currentRoom && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.1, type: "spring" }}
                    className="mt-3 p-3 bg-green-600/20 border border-green-400/30 rounded-lg"
                  >
                    <div className="text-green-400 font-bold text-sm">
                      💰 Current Prize Pool
                    </div>
                    <div className="text-white font-bold text-lg">
                      {(Number(currentRoom.totalPot) / 1000000000).toFixed(9)}{" "}
                      CHZ
                    </div>
                    <div className="text-green-300 text-xs">
                      Winner takes all at game end!
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Question Card Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="text-center mb-6"
          >
            <h3 className="text-white font-bold text-xl mb-4 flex items-center justify-center gap-2">
              <HelpCircle className="text-purple-400" size={20} />
              The Question
              <HelpCircle className="text-purple-400" size={20} />
            </h3>

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1.2, type: "spring", damping: 15 }}
              className="max-w-2xl mx-auto"
            >
              <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl border-2 border-purple-400 shadow-lg p-6">
                <div className="text-white font-bold text-lg md:text-xl leading-relaxed">
                  {currentGame.questionCard.text}
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Winning cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
            className="text-center"
          >
            <h3 className="text-white font-bold text-xl mb-4 flex items-center justify-center gap-2">
              <Sparkles className="text-amber-400" size={20} />
              Winning Answer
              <Sparkles className="text-amber-400" size={20} />
            </h3>

            <div className="flex justify-center gap-4 flex-wrap px-6 py-4">
              {winningSubmission.cards.map((card, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0, rotateY: 180 }}
                  animate={{ scale: 1, rotateY: 0 }}
                  transition={{
                    delay: 1.5 + index * 0.2,
                    type: "spring",
                    damping: 15,
                  }}
                >
                  <PokerCard card={card} size="sm" className="poker-glow" />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Progress indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5 }}
            className="mt-6 text-center"
          >
            <div className="text-gray-400 text-sm mb-2">
              Next round starting...
            </div>
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 5, ease: "linear" }}
              className="h-2 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full mx-auto max-w-xs"
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
