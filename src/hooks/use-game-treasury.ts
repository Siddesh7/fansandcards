"use client";

import {
  useWriteContract,
  useReadContract,
  useAccount,
  useBalance,
  useWaitForTransactionReceipt,
} from "wagmi";
import { formatEther } from "viem";
import { useState } from "react";
import { Room } from "../types/game";
import {
  GAME_TREASURY_ADDRESS,
  GAME_TREASURY_ABI,
  DEPOSIT_AMOUNT,
} from "../../lib/contracts/game-treasury";

export function useGameTreasury(
  onSocketDeposit?: (
    roomId: string,
    txHash: string,
    walletAddress: string
  ) => void
) {
  const { address } = useAccount();
  const { data: balance } = useBalance({ address });
  const { writeContractAsync, isPending, error } = useWriteContract();
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastTxHash, setLastTxHash] = useState<`0x${string}` | undefined>();

  // Wait for transaction receipt
  const { data: receipt, isLoading: isWaitingForReceipt } =
    useWaitForTransactionReceipt({
      hash: lastTxHash,
    });

  // Read contract deposit amount
  const { data: contractDepositAmount } = useReadContract({
    address: GAME_TREASURY_ADDRESS,
    abi: GAME_TREASURY_ABI,
    functionName: "DEPOSIT_AMOUNT",
  });

  // Check if player has deposited for a game
  const useHasPlayerDeposited = (
    gameId: string,
    playerAddress?: `0x${string}`
  ) => {
    return useReadContract({
      address: GAME_TREASURY_ADDRESS,
      abi: GAME_TREASURY_ABI,
      functionName: "hasPlayerDeposited",
      args: [gameId, playerAddress || "0x0"],
      query: {
        enabled: !!gameId && !!playerAddress,
      },
    });
  };

  // Get game info from contract
  const useGameInfo = (gameId: string) => {
    return useReadContract({
      address: GAME_TREASURY_ADDRESS,
      abi: GAME_TREASURY_ABI,
      functionName: "getGameInfo",
      args: [gameId],
      query: {
        enabled: !!gameId,
      },
    });
  };

  const depositForGame = async (
    room: Room,
    onSuccess?: (txHash: string) => void
  ) => {
    if (!address) {
      throw new Error("Please connect your wallet first");
    }

    const depositAmount = contractDepositAmount || DEPOSIT_AMOUNT;

    if (!balance || balance.value < depositAmount) {
      throw new Error(
        `Insufficient balance. You need at least ${formatEther(
          depositAmount
        )} ETH`
      );
    }

    try {
      setIsProcessing(true);
      console.log(
        "🎯 Starting contract deposit for room:",
        room.id,
        "wallet:",
        address
      );

      const txHash = await writeContractAsync({
        address: GAME_TREASURY_ADDRESS,
        abi: GAME_TREASURY_ABI,
        functionName: "depositForGame",
        args: [room.id],
        value: depositAmount,
      });

      console.log("✅ Deposit transaction sent! TxHash:", txHash);
      setLastTxHash(txHash);

      // Call socket immediately after transaction is sent
      if (address && txHash) {
        console.log("📡 Sending deposit to backend...", {
          roomId: room.id,
          txHash,
          address,
        });
        onSocketDeposit?.(room.id, txHash, address);
      }

      if (onSuccess) {
        onSuccess(txHash);
      }

      return txHash;
    } catch (err) {
      console.error("❌ Deposit failed:", err);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  };

  const hasEnoughBalance = () => {
    if (!balance) return false;
    const depositAmount = contractDepositAmount || DEPOSIT_AMOUNT;
    return balance.value >= depositAmount;
  };

  const formatDepositAmount = () => {
    const depositAmount = contractDepositAmount || DEPOSIT_AMOUNT;
    return `${formatEther(depositAmount)} ETH`;
  };

  const formatPotAmount = (potWei: string) => {
    return formatEther(BigInt(potWei));
  };

  return {
    address,
    balance,
    depositForGame,
    hasEnoughBalance,
    formatDepositAmount,
    formatPotAmount,
    isProcessing: isProcessing || isPending || isWaitingForReceipt,
    error,
    txHash: lastTxHash,
    receipt,
    contractDepositAmount,
    useHasPlayerDeposited,
    useGameInfo,
    GAME_TREASURY_ADDRESS,
  };
}
