"use client";

import { Game, Player, Submission } from "../../types/game";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { PokerCard } from "./poker-card";
import { Clock, Crown } from "lucide-react";

interface PokerSubmissionAreaProps {
  currentGame: Game;
  currentPlayerId?: string;
  players: Player[];
  onJudgePick: (submissionIndex: number) => void;
  onSubmitCards: () => void;
  selectedCards: any[];
  canSubmit: boolean;
}

export const PokerSubmissionArea = ({
  currentGame,
  currentPlayerId,
  players,
  onJudgePick,
  onSubmitCards,
  selectedCards,
  canSubmit,
}: PokerSubmissionAreaProps) => {
  const isJudge = currentGame.currentJudge === currentPlayerId;
  const hasSubmitted = currentGame.submissions.some(
    (s) => s.playerId === currentPlayerId
  );
  const currentPlayer = players.find((p) => p.id === currentPlayerId);

  // Submission phase
  if (currentGame.roundState === "submitting") {
    return (
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-50">
        {!isJudge && !hasSubmitted && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border-2 border-amber-500/50 shadow-2xl backdrop-blur-sm"
          >
            <div className="text-center mb-4">
              <h3 className="text-white font-bold text-lg mb-2">
                Select your cards!
              </h3>
              <p className="text-gray-300 text-sm">
                Choose {currentGame.questionCard?.blanks || 1} card
                {(currentGame.questionCard?.blanks || 1) > 1 ? "s" : ""}
              </p>
            </div>

            <div className="flex justify-center gap-2 mb-4">
              {selectedCards.map((card, index) => (
                <div
                  key={card.id}
                  style={{ transform: `rotate(${(index - 1) * 5}deg)` }}
                >
                  <PokerCard card={card} size="xs" />
                </div>
              ))}
              {Array.from({
                length:
                  (currentGame.questionCard?.blanks || 1) -
                  selectedCards.length,
              }).map((_, index) => (
                <div
                  key={`empty-${index}`}
                  className="w-16 h-24 border-2 border-dashed border-gray-500 rounded-lg flex items-center justify-center text-gray-500 text-xs"
                >
                  ?
                </div>
              ))}
            </div>

            <Button
              onClick={onSubmitCards}
              disabled={!canSubmit}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Cards
            </Button>
          </motion.div>
        )}

        {isJudge && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-gradient-to-br from-purple-800 to-purple-900 rounded-2xl p-6 border-2 border-amber-500/50 shadow-2xl backdrop-blur-sm"
          >
            <div className="text-center">
              <Crown className="text-amber-400 mx-auto mb-2" size={24} />
              <h3 className="text-white font-bold text-lg mb-2">
                You're the Judge!
              </h3>
              <p className="text-purple-200 text-sm">
                Wait for others to submit their cards...
              </p>
              <div className="mt-3">
                <div className="text-amber-400 font-bold">
                  {currentGame.submissions.length}/{players.length - 1}{" "}
                  submitted
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {hasSubmitted && !isJudge && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-gradient-to-br from-blue-800 to-blue-900 rounded-2xl p-6 border-2 border-blue-500/50 shadow-2xl backdrop-blur-sm"
          >
            <div className="text-center">
              <h3 className="text-white font-bold text-lg mb-2">
                Cards Submitted!
              </h3>
              <p className="text-blue-200 text-sm">Waiting for others...</p>
              <div className="mt-3">
                <div className="text-blue-400 font-bold">
                  {currentGame.submissions.length}/{players.length - 1}{" "}
                  submitted
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    );
  }

  // Judging phase
  if (currentGame.roundState === "judging") {
    return (
      <div className="absolute inset-4 flex items-center justify-center z-50">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border-2 border-amber-500/50 shadow-2xl backdrop-blur-sm max-w-4xl w-full max-h-[80vh] overflow-y-auto">
          <div className="text-center mb-6">
            <h3 className="text-amber-400 font-bold text-2xl mb-2">
              🎭 Time to Judge!
            </h3>
            <p className="text-white text-lg">Pick the funniest response:</p>
            <div className="mt-4 p-4 bg-purple-800/30 rounded-lg border border-purple-500/30">
              <p className="text-white font-bold text-lg">
                {currentGame.questionCard?.text}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {currentGame.submissions.map((submission, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8, rotateY: 180 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className={cn(
                    "p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 relative overflow-hidden",
                    isJudge
                      ? "hover:border-amber-400 hover:shadow-lg hover:shadow-amber-400/20 hover:bg-gray-600/50 border-gray-600 bg-gray-700/50"
                      : "border-gray-600 bg-gray-700/50"
                  )}
                  onClick={() => isJudge && onJudgePick(index)}
                >
                  {/* Player background stripe */}
                  <div
                    className="absolute top-0 left-0 right-0 h-1 opacity-60"
                    style={{
                      background: `hsl(${
                        (submission.playerId.charCodeAt(0) * 137.5) % 360
                      }, 70%, 50%)`,
                    }}
                  />

                  <div className="text-center mb-3">
                    {(() => {
                      const submittingPlayer = players.find(
                        (p) => p.id === submission.playerId
                      );
                      const playerColor = `hsl(${
                        (submission.playerId.charCodeAt(0) * 137.5) % 360
                      }, 70%, 50%)`;
                      return (
                        <div className="flex flex-col items-center gap-2">
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg border-2 border-white/20"
                            style={{ background: playerColor }}
                          >
                            {submittingPlayer?.name.charAt(0).toUpperCase() ||
                              "?"}
                          </div>
                          <div className="text-white font-bold text-sm">
                            {submittingPlayer?.name || "Unknown Player"}
                          </div>
                          <div className="text-amber-400 text-xs font-medium">
                            {submittingPlayer?.score || 0} pts
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  <div className="flex flex-col gap-2">
                    {submission.cards.map((card, cardIndex) => (
                      <PokerCard
                        key={cardIndex}
                        card={card}
                        size="sm"
                        className="mx-auto"
                      />
                    ))}
                  </div>

                  {isJudge && (
                    <div className="mt-4 text-center">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          onJudgePick(index);
                        }}
                        className="bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-black font-bold"
                      >
                        Pick This!
                      </Button>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {!isJudge && (
            <div className="text-center mt-6">
              <p className="text-gray-300">
                Waiting for{" "}
                <span className="text-amber-400 font-bold">
                  {players.find((p) => p.id === currentGame.currentJudge)?.name}
                </span>{" "}
                to pick the winner...
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
};
