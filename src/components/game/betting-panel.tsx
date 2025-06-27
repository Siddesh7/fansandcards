"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Room, Player } from "../../types/game";
import { useGameTreasury } from "../../hooks/use-game-treasury";
import { usePrivy } from "@privy-io/react-auth";
import { useSocket } from "../../hooks/use-socket";
import { cn } from "@/lib/utils";
import {
  Coins,
  Wallet,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Crown,
  TrendingUp,
} from "lucide-react";

interface BettingPanelProps {
  room: Room;
  currentPlayer?: Player;
  onDeposit?: (txHash: string) => void;
  className?: string;
}

export const BettingPanel = ({
  room,
  currentPlayer,
  onDeposit,
  className,
}: BettingPanelProps) => {
  const { login, authenticated } = usePrivy();
  const { recordDeposit } = useSocket();
  const {
    address,
    balance,
    depositForGame,
    hasEnoughBalance,
    formatDepositAmount,
    formatPotAmount,
    isProcessing,
    error,
  } = useGameTreasury((roomId, txHash, walletAddress) => {
    console.log("🔗 Calling recordDeposit from useGameTreasury callback:", {
      roomId,
      txHash,
      walletAddress,
    });
    recordDeposit(roomId, txHash, walletAddress);
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const hasDeposited = currentPlayer?.hasDeposited || false;
  const allPlayersDeposited = room.players.every((p) => p.hasDeposited);
  const depositedPlayersCount = room.players.filter(
    (p) => p.hasDeposited
  ).length;
  const totalPlayers = room.players.length;
  const potInEth = formatPotAmount(room.totalPot);

  const handleDeposit = async () => {
    if (!authenticated) {
      login();
      return;
    }

    try {
      const txHash = await depositForGame(room, (hash) => {
        setShowSuccess(true);
        onDeposit?.(hash);
        // Show toast for shorter duration
        setTimeout(() => setShowSuccess(false), 2000);
      });

      console.log("Deposit transaction:", txHash);
    } catch (err) {
      console.error("Deposit failed:", err);
    }
  };

  const getDepositStatus = () => {
    if (hasDeposited) {
      return {
        status: "deposited",
        color: "text-green-400",
        bgColor: "bg-green-500/20",
        borderColor: "border-green-500/30",
        icon: CheckCircle,
        message: "✅ Deposit Confirmed",
      };
    } else if (isProcessing) {
      return {
        status: "processing",
        color: "text-yellow-400",
        bgColor: "bg-yellow-500/20",
        borderColor: "border-yellow-500/30",
        icon: TrendingUp,
        message: "🔄 Processing Deposit...",
      };
    } else {
      return {
        status: "pending",
        color: "text-amber-400",
        bgColor: "bg-amber-500/20",
        borderColor: "border-amber-500/30",
        icon: Coins,
        message: "💰 Deposit Required",
      };
    }
  };

  const depositStatus = getDepositStatus();
  const StatusIcon = depositStatus.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border-2 shadow-xl",
        depositStatus.borderColor,
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Crown className="text-amber-400" size={24} />
          <h3 className="text-amber-400 font-bold text-xl">Game Pot</h3>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-white">{potInEth} ETH</div>
          <div className="text-gray-400 text-sm">Prize Pool</div>
        </div>
      </div>

      {/* Pot Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>Players Deposited</span>
          <span>
            {depositedPlayersCount}/{totalPlayers}
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3">
          <motion.div
            initial={{ width: 0 }}
            animate={{
              width: `${(depositedPlayersCount / totalPlayers) * 100}%`,
            }}
            className="h-3 bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-500"
          />
        </div>
      </div>

      {/* Deposit Status */}
      <div
        className={cn(
          "rounded-xl p-4 border-2 mb-4",
          depositStatus.bgColor,
          depositStatus.borderColor
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <StatusIcon className={depositStatus.color} size={20} />
            <span className={cn("font-medium", depositStatus.color)}>
              {depositStatus.message}
            </span>
          </div>
          {hasDeposited && currentPlayer?.depositTxHash && (
            <a
              href={`https://sepolia.basescan.org/tx/${currentPlayer.depositTxHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm"
            >
              View TX <ExternalLink size={14} />
            </a>
          )}
        </div>
      </div>

      {/* Deposit Info */}
      <div className="bg-gray-700/50 rounded-lg p-4 mb-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-400">Entry Fee:</span>
            <div className="font-bold text-white">{formatDepositAmount()}</div>
          </div>
          <div>
            <span className="text-gray-400">Your Balance:</span>
            <div className="font-bold text-white">
              {balance
                ? `${parseFloat(balance.formatted).toFixed(6)} ETH`
                : "..."}
            </div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      {!hasDeposited && (
        <motion.div layout>
          <Button
            onClick={handleDeposit}
            disabled={
              isProcessing ||
              (!authenticated && !address) ||
              !hasEnoughBalance()
            }
            className={cn(
              "w-full py-3 font-bold text-lg transition-all duration-200",
              hasEnoughBalance()
                ? "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
                : "bg-gray-600 text-gray-300 cursor-not-allowed"
            )}
          >
            {!authenticated ? (
              <>
                <Wallet className="mr-2" size={20} />
                Connect Wallet to Deposit
              </>
            ) : isProcessing ? (
              <>
                <TrendingUp className="mr-2 animate-spin" size={20} />
                Processing Deposit...
              </>
            ) : !hasEnoughBalance() ? (
              <>
                <AlertCircle className="mr-2" size={20} />
                Insufficient Balance
              </>
            ) : (
              <>
                <Coins className="mr-2" size={20} />
                Deposit {formatDepositAmount()}
              </>
            )}
          </Button>
        </motion.div>
      )}

      {/* Success Toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-4 right-4 z-50 flex items-center gap-3 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg border border-green-500"
          >
            <CheckCircle size={20} />
            <div>
              <div className="font-medium text-sm">Deposit Successful!</div>
              <div className="text-green-100 text-xs">
                Transaction confirmed
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg"
        >
          <div className="flex items-center gap-2 text-red-400">
            <AlertCircle size={16} />
            <span className="text-sm">
              {error.message || "Transaction failed"}
            </span>
          </div>
        </motion.div>
      )}

      {/* Game Rules */}
      <div className="mt-4 pt-4 border-t border-gray-600">
        <div className="text-gray-400 text-xs space-y-1">
          <div>• All players must deposit to start the game</div>
          <div>• Winner takes the entire pot</div>
          <div>• Deposits are non-refundable once game starts</div>
        </div>
      </div>
    </motion.div>
  );
};
