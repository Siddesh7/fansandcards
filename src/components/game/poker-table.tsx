"use client";

import { Player, Game } from "../../types/game";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Crown, Clock, Users } from "lucide-react";
import { PokerCard } from "./poker-card";
import { PokerSubmissionArea } from "./poker-submission-area";
import { RoundWinnerCelebration } from "./round-winner-celebration";

interface PokerTableProps {
  players: Player[];
  currentGame?: Game;
  currentPlayerId?: string;
  onCardSelect?: (card: any) => void;
  selectedCards?: any[];
  onJudgePick?: (submissionIndex: number) => void;
  onSubmitCards?: () => void;
}

// Calculate player positions around the table (poker table style)
const getPlayerPosition = (
  playerIndex: number,
  totalPlayers: number,
  isCurrentPlayer: boolean
) => {
  if (isCurrentPlayer) {
    // Current player always sits at the bottom
    return { x: 50, y: 85, angle: 0 };
  }

  // Position other players around the table (excluding current player's bottom position)
  const otherPlayersCount = totalPlayers - 1;
  const positions = [];

  // Define specific positions around the table (clockwise from left)
  if (otherPlayersCount === 1) {
    positions.push({ x: 50, y: 15 }); // Opposite player
  } else if (otherPlayersCount === 2) {
    positions.push({ x: 25, y: 35 }); // Left side
    positions.push({ x: 75, y: 35 }); // Right side
  } else if (otherPlayersCount === 3) {
    positions.push({ x: 20, y: 50 }); // Left
    positions.push({ x: 50, y: 15 }); // Top
    positions.push({ x: 80, y: 50 }); // Right
  } else if (otherPlayersCount === 4) {
    positions.push({ x: 15, y: 60 }); // Left
    positions.push({ x: 35, y: 20 }); // Top left
    positions.push({ x: 65, y: 20 }); // Top right
    positions.push({ x: 85, y: 60 }); // Right
  } else if (otherPlayersCount === 5) {
    positions.push({ x: 15, y: 65 }); // Left
    positions.push({ x: 25, y: 30 }); // Top left
    positions.push({ x: 50, y: 15 }); // Top
    positions.push({ x: 75, y: 30 }); // Top right
    positions.push({ x: 85, y: 65 }); // Right
  } else {
    // For more players, distribute around the table
    for (let i = 0; i < otherPlayersCount; i++) {
      const angle = (i * 180) / (otherPlayersCount - 1) - 90; // Spread across top half
      const radius = 40;
      const x = 50 + radius * Math.cos((angle * Math.PI) / 180);
      const y = 25 + radius * Math.sin((angle * Math.PI) / 180);
      positions.push({ x, y });
    }
  }

  return {
    x: positions[playerIndex]?.x || 50,
    y: positions[playerIndex]?.y || 50,
    angle: 0,
  };
};

export const PokerTable = ({
  players,
  currentGame,
  currentPlayerId,
  onCardSelect,
  selectedCards = [],
  onJudgePick,
  onSubmitCards,
}: PokerTableProps) => {
  const isCurrentPlayerJudge = currentGame?.currentJudge === currentPlayerId;

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-green-800 via-green-700 to-green-900 overflow-hidden">
      {/* Stadium Background with Crowd */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1472396961693-142e6e269027')] bg-cover bg-center opacity-20"></div>

      {/* Poker table felt background */}
      <div className="absolute inset-4 md:inset-8 rounded-full bg-gradient-to-br from-green-600 to-green-800 shadow-2xl border-8 border-amber-600 poker-felt">
        {/* Table edge highlight */}
        <div className="absolute inset-2 rounded-full border-4 border-amber-500/50" />

        {/* Table texture pattern */}
        <div className="absolute inset-4 rounded-full opacity-10">
          <div
            className="w-full h-full rounded-full"
            style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px),
                             radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: "20px 20px",
            }}
          />
        </div>

        {/* Center area for question card */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-32 md:w-64 md:h-40">
          {currentGame?.questionCard && (
            <motion.div
              initial={{ scale: 0, rotate: 180 }}
              animate={{ scale: 1, rotate: 0 }}
              className="w-full h-full bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl border-2 border-purple-400 shadow-lg flex items-center justify-center p-4"
            >
              <div className="text-center">
                <div className="text-white font-bold text-sm md:text-lg mb-2">
                  {currentGame.questionCard.text}
                </div>
                <div className="flex items-center justify-center gap-2 text-purple-200 text-xs">
                  <Clock size={12} />
                  <span>Round {currentGame.currentRound}</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Game info display */}
        {currentGame && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/30 backdrop-blur-sm rounded-lg px-4 py-2 text-white">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Users size={14} />
                <span>{players.length} players</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Other players around the table */}
      {players
        .filter((p) => p.id !== currentPlayerId)
        .map((player, index) => {
          const position = getPlayerPosition(index, players.length, false);
          const isJudge = currentGame?.currentJudge === player.id;

          return (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${position.x}%`,
                top: `${position.y}%`,
              }}
            >
              {/* Player seat */}
              <div
                className={cn(
                  "relative w-20 h-20 md:w-24 md:h-24 rounded-full border-4 flex flex-col items-center justify-center",
                  "bg-gradient-to-br from-gray-600 to-gray-800 border-gray-400",
                  isJudge && "ring-4 ring-amber-400 ring-opacity-75"
                )}
              >
                {/* Judge crown */}
                {isJudge && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Crown className="text-amber-400" size={20} />
                  </div>
                )}

                {/* Player avatar/name */}
                <div className="text-center">
                  <div className="w-6 h-6 md:w-8 md:h-8 rounded-full mx-auto mb-1 flex items-center justify-center text-sm font-bold bg-gray-200 text-gray-800">
                    {player.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-white text-xs font-medium truncate max-w-12 md:max-w-16">
                    {player.name}
                  </div>
                  <div className="text-amber-400 text-xs font-bold">
                    {player.score} pts
                  </div>
                </div>

                {/* Ready indicator */}
                {player.isReady && !currentGame && (
                  <div className="absolute -bottom-2 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                )}
              </div>

              {/* Other players' card backs */}
              {player.hand && player.hand.length > 0 && (
                <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2">
                  <div className="flex justify-center">
                    {Array.from({
                      length: Math.min(player.hand.length, 5),
                    }).map((_, cardIndex) => (
                      <div
                        key={cardIndex}
                        className="w-6 h-8 md:w-8 md:h-12 bg-gradient-to-br from-red-800 to-red-900 rounded border border-red-600 shadow-sm"
                        style={{
                          marginLeft: cardIndex > 0 ? "-4px" : "0",
                          zIndex: cardIndex,
                        }}
                      />
                    ))}
                    {player.hand.length > 5 && (
                      <div className="ml-1 text-white text-xs self-end">
                        +{player.hand.length - 5}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}

      {/* Current Player's Hand at Bottom */}
      {(() => {
        const currentPlayer = players.find((p) => p.id === currentPlayerId);
        if (!currentPlayer?.hand || currentPlayer.hand.length === 0)
          return null;

        return (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30">
            <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-2xl p-4 border-2 border-blue-500/50 shadow-2xl">
              {/* Current player info */}
              <div className="text-center mb-3">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                    {currentPlayer.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-white font-bold">
                    {currentPlayer.name}
                  </span>
                  <span className="text-amber-400 font-bold">
                    {currentPlayer.score} pts
                  </span>
                </div>
              </div>

              {/* Cards in hand */}
              <div className="flex gap-1 justify-center max-w-4xl overflow-x-auto pb-2">
                {currentPlayer.hand.map((card, cardIndex) => {
                  const isSelected = selectedCards.some(
                    (c) => c.id === card.id
                  );
                  return (
                    <motion.div
                      key={card.id}
                      initial={{ y: 50, opacity: 0, rotateY: 180 }}
                      animate={{ y: 0, opacity: 1, rotateY: 0 }}
                      transition={{ delay: cardIndex * 0.1, duration: 0.6 }}
                      className="transform hover:scale-105 transition-all duration-200"
                      style={{
                        zIndex: isSelected ? 20 : cardIndex,
                        marginLeft: cardIndex > 0 ? "-12px" : "0",
                      }}
                    >
                      <PokerCard
                        card={card}
                        isSelected={isSelected}
                        onClick={() => onCardSelect?.(card)}
                        size="md"
                        className={cn(
                          "cursor-pointer poker-card-shadow",
                          isSelected && "transform -translate-y-4 poker-glow"
                        )}
                      />
                    </motion.div>
                  );
                })}
              </div>

              {/* Selection info */}
              {currentGame && (
                <div className="text-center mt-2">
                  <p className="text-gray-300 text-sm">
                    {selectedCards.length}/
                    {currentGame.questionCard?.blanks || 1} cards selected
                  </p>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* Submission Area Overlay */}
      {currentGame &&
        onJudgePick &&
        onSubmitCards &&
        currentGame.roundState !== "results" && (
          <PokerSubmissionArea
            currentGame={currentGame}
            currentPlayerId={currentPlayerId}
            players={players}
            onJudgePick={onJudgePick}
            onSubmitCards={onSubmitCards}
            selectedCards={selectedCards}
            canSubmit={
              selectedCards.length === (currentGame.questionCard?.blanks || 1)
            }
          />
        )}

      {/* Round Winner Celebration */}
      {currentGame && currentGame.roundState === "results" && (
        <RoundWinnerCelebration
          currentGame={currentGame}
          players={players}
          winningSubmission={
            currentGame.submissions.find((s) => s.isRevealed === false) ||
            currentGame.submissions[0]
          }
          onComplete={() => {
            // This will be handled by the server automatically moving to next round
            console.log("Round winner celebration completed");
          }}
        />
      )}
    </div>
  );
};
