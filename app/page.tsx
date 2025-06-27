"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import { Button } from "@/components/ui/button";
import { useSocket } from "@/src/hooks/use-socket";
import { GameCard } from "@/src/components/game/game-card";
import { PokerTable } from "@/src/components/game/poker-table";
import { PokerLobby } from "@/src/components/game/poker-lobby";
import { Game } from "@/src/types/game";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Users,
  Play,
  Clock,
  Crown,
  Wifi,
  WifiOff,
  Share2,
  Copy,
  Check,
  Hash,
  Trophy,
  LogOut,
  Star,
} from "lucide-react";

// Random name generation
const adjectives = [
  "Swift",
  "Mighty",
  "Golden",
  "Thunder",
  "Lightning",
  "Shadow",
  "Blazing",
  "Epic",
  "Legendary",
  "Royal",
  "Divine",
  "Cosmic",
  "Fierce",
  "Wild",
  "Steel",
  "Fire",
  "Ice",
  "Storm",
];
const nouns = [
  "Striker",
  "Keeper",
  "Legend",
  "Champion",
  "Warrior",
  "Hero",
  "Master",
  "Ace",
  "Star",
  "Phoenix",
  "Eagle",
  "Lion",
  "Tiger",
  "Dragon",
  "Wolf",
  "Bear",
  "Falcon",
  "Hawk",
];

const generateRandomName = () => {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const num = Math.floor(Math.random() * 999) + 1;
  return `${adj}${noun}${num}`;
};

export default function Home() {
  const router = useRouter();
  const { ready, authenticated, login, user } = usePrivy();
  const {
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
  } = useSocket();

  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [playerName] = useState(generateRandomName());
  const [selectedCards, setSelectedCards] = useState<any[]>([]);
  const [copied, setCopied] = useState(false);

  // Sample cards for preview
  const sampleCards = [
    {
      id: "preview1",
      text: "Messi crying into his Champions League trophy",
      category: "Legends",
      rarity: "legendary" as const,
    },
    {
      id: "preview2",
      text: "Neymar's acting classes",
      category: "Skills",
      rarity: "epic" as const,
    },
    {
      id: "preview3",
      text: "VAR ruining the beautiful game",
      category: "Modern Football",
      rarity: "rare" as const,
    },
    {
      id: "preview4",
      text: "Arsenal's trophy cabinet collecting dust",
      category: "Club Banter",
      rarity: "common" as const,
    },
    {
      id: "preview5",
      text: "Ronaldo's ego getting its own ZIP code",
      category: "Legends",
      rarity: "epic" as const,
    },
  ];

  const handleCreateRoom = () => {
    if (roomName.trim() && playerName.trim()) {
      const settings = {
        maxRounds: 5,
        roundTimer: 90,
        maxPlayers: 8,
        minPlayers: 2,
      };
      createRoom(roomName.trim(), settings, playerName.trim());
      setRoomName("");
      setShowCreateRoom(false);
    }
  };

  const handleJoinRoom = (roomId: string) => {
    if (playerName.trim()) {
      joinRoom(roomId, playerName.trim());
    }
  };

  const handleLeaveRoom = () => {
    if (currentRoom) {
      leaveRoom(currentRoom.id);
    }
  };

  const handleCardSelect = (card: any) => {
    // Check if this specific card ID is already selected
    const isAlreadySelected = selectedCards.some((c) => c.id === card.id);

    if (isAlreadySelected) {
      // Remove this card from selection
      setSelectedCards(selectedCards.filter((c) => c.id !== card.id));
    } else if (
      selectedCards.length < (currentGame?.questionCard?.blanks || 1)
    ) {
      // Add card to selection
      setSelectedCards([...selectedCards, card]);
    }
  };

  const handleSubmitCards = () => {
    if (
      currentGame &&
      selectedCards.length === (currentGame.questionCard?.blanks || 1)
    ) {
      submitCards(currentGame.roomId, selectedCards);
      setSelectedCards([]);
    }
  };

  const handleJudgePick = (submissionIndex: number) => {
    if (currentGame) {
      judgePick(currentGame.roomId, submissionIndex);
    }
  };

  const shareRoomCode = async () => {
    if (!currentRoom) return;

    const roomCode = currentRoom.id.slice(-6).toUpperCase(); // Use last 6 chars as room code
    const text = `Join my Fan Zone Roast Fest game! Room Code: ${roomCode}`;

    if (navigator.share && navigator.canShare({ text })) {
      try {
        await navigator.share({
          title: `Join ${currentRoom.name}`,
          text: text,
        });
      } catch (err) {
        copyToClipboard(roomCode);
      }
    } else {
      copyToClipboard(roomCode);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const isPicker = currentGame?.currentJudge === playerId; // currentJudge field is actually the picker
  const currentPlayer = currentRoom?.players.find((p) => p.id === playerId);

  // Get the current player's hand from the room data
  const playerHand = currentPlayer?.hand || [];

  // Game Results Screen
  if (gameResults) {
    console.log("🎊 Game Results:", gameResults);
    console.log("🏠 Current Room:", currentRoom);

    // Use the enhanced finalScoresWithNames if available, otherwise fall back to finalScores
    const scoresData =
      gameResults.finalScoresWithNames || gameResults.finalScores;
    console.log("📊 Scores data:", scoresData);

    const winnerPlayer = currentRoom?.players.find(
      (p) => p.id === gameResults.winner
    );
    const winnerScore =
      typeof scoresData[gameResults.winner] === "object" &&
      scoresData[gameResults.winner] &&
      "score" in scoresData[gameResults.winner]
        ? (scoresData[gameResults.winner] as { score: number }).score
        : (scoresData[gameResults.winner] as number);

    const sortedScores = Object.entries(scoresData)
      .map(([playerId, scoreData]) => {
        const score =
          typeof scoreData === "object" && scoreData && "score" in scoreData
            ? (scoreData as { score: number }).score
            : (scoreData as number);
        const playerName =
          typeof scoreData === "object" && scoreData && "name" in scoreData
            ? (scoreData as { name: string }).name
            : currentRoom?.players.find((p) => p.id === playerId)?.name;

        return {
          playerId,
          score: score as number,
          playerName: playerName || "Unknown",
          player: currentRoom?.players.find((p) => p.id === playerId),
        };
      })
      .sort((a, b) => b.score - a.score);

    console.log("📊 Sorted scores:", sortedScores);

    return (
      <div className="min-h-screen bg-gradient-to-b from-green-900 via-green-800 to-green-900 relative overflow-hidden">
        {/* Stadium Background with Crowd */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1472396961693-142e6e269027')] bg-cover bg-center opacity-20"></div>
        <div className="relative z-10 p-4">
          <div className="max-w-4xl mx-auto">
            {/* Winner Announcement */}
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg p-8 mb-6 text-center">
              <h1 className="text-4xl font-bold text-black mb-4">
                🏆 GAME OVER 🏆
              </h1>
              <h2 className="text-3xl font-bold text-black mb-2">
                {gameResults.winnerName ||
                  winnerPlayer?.name ||
                  "Unknown Player"}{" "}
                WINS!
              </h2>
              <p className="text-xl text-black/80">
                With {winnerScore || 0} points!
              </p>
            </div>

            {/* Final Leaderboard */}
            <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 mb-6">
              <h3 className="text-2xl font-bold text-white mb-4 text-center">
                Final Leaderboard
              </h3>
              <div className="space-y-3">
                {sortedScores.map((entry, index) => (
                  <div
                    key={entry.playerId}
                    className={`flex justify-between items-center p-4 rounded-lg ${
                      index === 0
                        ? "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-2 border-yellow-400"
                        : index === 1
                        ? "bg-gray-300/10 border border-gray-400"
                        : index === 2
                        ? "bg-amber-600/10 border border-amber-600"
                        : "bg-gray-600/10 border border-gray-600"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">
                        {index === 0
                          ? "🥇"
                          : index === 1
                          ? "🥈"
                          : index === 2
                          ? "🥉"
                          : `${index + 1}.`}
                      </span>
                      <span className="text-white font-bold text-lg">
                        {entry.playerName}
                      </span>
                    </div>
                    <span className="text-2xl font-bold text-yellow-400">
                      {entry.score} pts
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 text-center">
              <div className="flex gap-4 justify-center">
                <Button
                  onClick={() => {
                    clearResults();
                    if (currentRoom) {
                      // Reset room to waiting state
                      currentRoom.gameState = "waiting";
                      currentRoom.players.forEach((p) => (p.isReady = false));
                    }
                  }}
                  className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold px-6 py-3"
                >
                  🎮 Play Again
                </Button>
                <Button
                  onClick={() => {
                    clearResults();
                    if (currentRoom) {
                      leaveRoom(currentRoom.id);
                    }
                  }}
                  variant="outline"
                  className="border-red-500 text-red-400 hover:bg-red-500/20 px-6 py-3"
                >
                  🚪 Leave Room
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-900 via-green-800 to-green-900 relative overflow-hidden">
        {/* Stadium Background with Crowd */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1472396961693-142e6e269027')] bg-cover bg-center opacity-20"></div>
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-white">Loading...</div>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-900 via-green-800 to-green-900 relative overflow-hidden">
        {/* Stadium Background with Crowd */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1472396961693-142e6e269027')] bg-cover bg-center opacity-20"></div>
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center text-white p-8">
            <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              Fan Zone Roast Fest
            </h1>
            <p className="text-xl mb-8 opacity-90">
              The Most Hilarious Football Cards Game 🏆⚽
            </p>

            <div className="mb-8 flex justify-center gap-4">
              {sampleCards.slice(0, 3).map((card) => (
                <GameCard key={card.id} card={card} size="sm" />
              ))}
            </div>

            <Button
              onClick={login}
              size="lg"
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold px-8 py-4 text-lg"
            >
              🎮 Enter the Game
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Game Screen
  if (currentGame) {
    return (
      <PokerTable
        players={currentRoom?.players || []}
        currentGame={currentGame}
        currentPlayerId={playerId || undefined}
        onCardSelect={handleCardSelect}
        selectedCards={selectedCards}
        onJudgePick={handleJudgePick}
        onSubmitCards={handleSubmitCards}
      />
    );
  }

  // Game Screen (Old - keeping for backup)
  if (false && currentGame) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-900 via-green-800 to-navy-900 relative overflow-hidden">
        {/* Stadium Background with Crowd */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1472396961693-142e6e269027')] bg-cover bg-center opacity-20"></div>
        <div className="relative z-10 p-4">
          <div className="max-w-6xl mx-auto">
            {/* Game Header */}
            <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-white">
                    {currentRoom?.name}
                  </h1>
                  <p className="text-white/70">
                    Round {currentGame.currentRound} of 5
                  </p>
                  <p className="text-white/50 text-sm">
                    Room Code: {currentRoom?.id.slice(-6).toUpperCase()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-white/80">
                    <Clock size={16} />
                    <span>{currentGame.timeLeft}s</span>
                  </div>
                  <Button
                    onClick={shareRoomCode}
                    variant="outline"
                    className="border-yellow-400 text-yellow-400 hover:bg-yellow-400/20"
                  >
                    {copied ? <Check size={16} /> : <Share2 size={16} />}
                    {copied ? "Copied!" : "Share"}
                  </Button>
                  <Button
                    onClick={handleLeaveRoom}
                    variant="outline"
                    className="border-red-500 text-red-400 hover:bg-red-500/20"
                  >
                    Leave Game
                  </Button>
                </div>
              </div>

              {isPicker && (
                <div className="bg-purple-500/20 border border-purple-400 rounded-lg p-3 mb-4">
                  <div className="flex items-center gap-2 text-purple-100">
                    <Star size={16} />
                    <span className="font-bold">
                      You are the PICKER this round! You judge the cards but
                      don't submit any.
                    </span>
                  </div>
                </div>
              )}

              {!isPicker && (
                <div className="bg-blue-500/20 border border-blue-400 rounded-lg p-3 mb-4">
                  <div className="flex items-center gap-2 text-blue-100">
                    <Trophy size={16} />
                    <span className="font-bold">
                      Submit your best card! The picker will judge all
                      submissions.
                    </span>
                  </div>
                </div>
              )}

              {/* Debug Info - Remove later */}
              <div className="bg-gray-900/50 text-xs text-white/60 p-2 rounded mb-4">
                <p>Debug: Picker ID: {currentGame.currentJudge}</p>
                <p>Debug: Your Player ID: {playerId}</p>
                <p>Debug: Round State: {currentGame.roundState}</p>
                <p>Debug: Round: {currentGame.currentRound}</p>
                <p>Debug: Cards in Hand: {playerHand.length}</p>
                <p>Debug: Game Scores: {JSON.stringify(currentGame.scores)}</p>
                <p>Debug: Game Scores Type: {typeof currentGame.scores}</p>
                <p>
                  Debug: Room Player Scores:{" "}
                  {JSON.stringify(
                    currentRoom?.players.map((p) => ({
                      id: p.id,
                      name: p.name,
                      score: p.score,
                    }))
                  )}
                </p>
              </div>
            </div>

            {/* Question Card */}
            <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 mb-6 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Question</h2>
              <div className="bg-gray-800 rounded-lg p-6">
                <p className="text-xl text-white font-medium">
                  {currentGame.questionCard?.text || "Loading question..."}
                </p>
              </div>
            </div>

            {/* Game State Display */}
            {currentGame.roundState === "submitting" && (
              <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 mb-6">
                <h3 className="text-xl font-bold text-white mb-4">Your Hand</h3>
                {playerHand.length === 0 ? (
                  <div className="text-center py-8 text-white/60">
                    <p>No cards left in your hand!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
                    {playerHand.map((card) => (
                      <GameCard
                        key={card.id}
                        card={card}
                        isSelected={selectedCards.some((c) => c.id === card.id)}
                        onClick={() => handleCardSelect(card)}
                      />
                    ))}
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <p className="text-white/70">
                    Select {currentGame.questionCard?.blanks || 1} card(s)
                  </p>
                  <Button
                    onClick={handleSubmitCards}
                    disabled={
                      selectedCards.length !==
                        (currentGame.questionCard?.blanks || 1) ||
                      playerHand.length === 0
                    }
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Submit Cards ({selectedCards.length}/
                    {currentGame.questionCard?.blanks || 1})
                  </Button>
                </div>
              </div>
            )}

            {currentGame.roundState === "judging" && isPicker && (
              <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 mb-6">
                <h3 className="text-xl font-bold text-white mb-4">
                  Judge the Submissions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentGame.submissions.map((submission, index) => (
                    <div
                      key={index}
                      className="bg-gray-800 p-4 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors"
                      onClick={() => handleJudgePick(index)}
                    >
                      <div className="flex gap-2">
                        {submission.cards.map((card, cardIndex) => (
                          <GameCard key={cardIndex} card={card} size="sm" />
                        ))}
                      </div>
                      <Button
                        className="w-full mt-2"
                        onClick={() => handleJudgePick(index)}
                      >
                        Choose This Answer
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentGame.roundState === "judging" && !isPicker && (
              <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 mb-6 text-center">
                <h3 className="text-xl font-bold text-white mb-2">
                  Waiting for picker to choose...
                </h3>
                <p className="text-white/70">
                  {
                    currentRoom?.players.find(
                      (p) => p.id === currentGame.currentJudge
                    )?.name
                  }{" "}
                  is picking the best answer.
                </p>
              </div>
            )}

            {/* Scores */}
            <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4">Scores</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {currentRoom?.players.map((player) => {
                  const gameScore = currentGame.scores?.[player.id];
                  const roomScore = player.score;
                  const finalScore =
                    gameScore !== undefined ? gameScore : roomScore || 0;

                  console.log(`Score for ${player.name} (${player.id}):`, {
                    gameScore,
                    roomScore,
                    finalScore,
                    currentGameScores: currentGame.scores,
                  });

                  return (
                    <div key={player.id} className="text-center">
                      <p className="text-white font-medium">{player.name}</p>
                      <p className="text-2xl font-bold text-yellow-400">
                        {finalScore}
                      </p>
                      <p className="text-xs text-white/40">
                        G:{gameScore} R:{roomScore}
                      </p>
                      {player.id === currentGame.currentJudge && (
                        <Star size={16} className="mx-auto text-purple-400" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Room Lobby
  if (currentRoom) {
    return (
      <PokerLobby
        room={currentRoom}
        currentPlayerId={playerId || undefined}
        isConnected={isConnected}
        onToggleReady={() =>
          toggleReady(currentRoom.id, !currentPlayer?.isReady)
        }
        onStartGame={() => startGame(currentRoom.id)}
        onLeaveRoom={handleLeaveRoom}
        sampleCards={sampleCards}
      />
    );
  }

  // Main Lobby
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-900 via-green-800 to-green-900 relative overflow-hidden">
      {/* Stadium Background with Crowd */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1472396961693-142e6e269027')] bg-cover bg-center opacity-20"></div>
      <div className="relative z-10 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              Fan Zone Roast Fest
            </h1>
            <p className="text-white/80 text-lg">
              Welcome back,{" "}
              {user?.google?.name || user?.email?.toString() || "Champion"}! 🏆
            </p>

            <div className="flex items-center justify-center gap-2 mt-4">
              {isConnected ? (
                <span className="flex items-center gap-2 text-green-400">
                  <Wifi size={16} />
                  Connected to server
                </span>
              ) : (
                <span className="flex items-center gap-2 text-red-400">
                  <WifiOff size={16} />
                  Connecting to server...
                </span>
              )}
            </div>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-100 px-4 py-3 rounded mb-6">
              <div className="flex justify-between items-center">
                <span>{error}</span>
                <Button onClick={clearError} variant="ghost" size="sm">
                  ✕
                </Button>
              </div>
            </div>
          )}

          {/* Player Info */}
          <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-white mb-2">
              Playing as: <span className="text-yellow-400">{playerName}</span>
            </h2>
            <p className="text-white/70 text-sm">
              Ready to dominate the football roast fest? 🏆
            </p>
          </div>

          <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Create New Game
            </h2>
            <p className="text-white/70 mb-4">
              Start a new room and get a room code!
            </p>

            {!showCreateRoom ? (
              <Button
                onClick={() => setShowCreateRoom(true)}
                disabled={!playerName.trim()}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold"
              >
                <Plus size={16} className="mr-2" />
                Create Room
              </Button>
            ) : (
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Room name (e.g., 'Legends vs Modern Era')..."
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  className="w-full p-3 rounded bg-black/30 text-white border border-gray-600 focus:border-yellow-400 focus:outline-none"
                  onKeyPress={(e) => e.key === "Enter" && handleCreateRoom()}
                  maxLength={30}
                />
                <div className="flex gap-2">
                  <Button
                    onClick={handleCreateRoom}
                    disabled={!roomName.trim() || !playerName.trim()}
                    className="flex-1"
                  >
                    Create
                  </Button>
                  <Button
                    onClick={() => setShowCreateRoom(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Available Rooms */}
          <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Available Rooms
            </h2>
            <p className="text-white/70 mb-4">
              Or browse and join public rooms
            </p>

            {rooms.length === 0 ? (
              <div className="text-center py-8 text-white/60">
                <Users size={48} className="mx-auto mb-4 opacity-50" />
                <p>No active rooms. Create one to get started!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {rooms.map((room) => (
                  <div
                    key={room.id}
                    className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-lg border border-gray-600 hover:border-yellow-400 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-white font-bold text-lg">
                        {room.name}
                      </h3>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          room.gameState === "waiting"
                            ? "bg-green-500/20 text-green-400"
                            : room.gameState === "playing"
                            ? "bg-blue-500/20 text-blue-400"
                            : "bg-gray-500/20 text-gray-400"
                        }`}
                      >
                        {room.gameState}
                      </span>
                    </div>

                    <div className="text-white/60 text-sm mb-3">
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-1">
                          <Users size={14} />
                          {room.players.length}/{room.maxPlayers}
                        </span>
                        <span className="text-xs font-mono">
                          {room.id.slice(-6).toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {room.players.length > 0 && (
                      <div className="mb-3">
                        <div className="text-xs text-white/50 mb-1">
                          Players:
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {room.players.slice(0, 3).map((player) => (
                            <span
                              key={player.id}
                              className="text-xs bg-white/10 px-2 py-1 rounded text-white/80"
                            >
                              {player.name}
                            </span>
                          ))}
                          {room.players.length > 3 && (
                            <span className="text-xs bg-white/10 px-2 py-1 rounded text-white/80">
                              +{room.players.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <Button
                      onClick={() => handleJoinRoom(room.id)}
                      disabled={
                        room.players.length >= room.maxPlayers ||
                        !playerName.trim()
                      }
                      className="w-full"
                    >
                      Join Game
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-8 text-center text-white/60">
            <p className="text-sm">
              💡 Tip: Share your room code with friends so they can join
              directly!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
