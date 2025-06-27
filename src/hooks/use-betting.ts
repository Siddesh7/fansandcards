"use client";

import { useSendTransaction, useAccount, useBalance } from "wagmi";
import { parseEther, formatEther } from "viem";
import { useState } from "react";
import { Room } from "../types/game";
import { baseSepolia } from "viem/chains";

const TREASURE_WALLET =
  "0x9bfeBd2E81725D7a3282cdB01cD1C3732178E954" as `0x${string}`;
const DEPOSIT_AMOUNT_ETH = "0.000000001"; // 1 Gwei

export function useBetting(
  onSocketDeposit?: (
    roomId: string,
    txHash: string,
    walletAddress: string
  ) => void
) {
  const { address } = useAccount();
  const { data: balance } = useBalance({ address });
  const {
    sendTransactionAsync,
    isPending,
    error,
    data: txHash,
  } = useSendTransaction();
  const [isProcessing, setIsProcessing] = useState(false);

  const depositForRoom = async (
    room: Room,
    onSuccess?: (txHash: string) => void
  ) => {
    if (!address) {
      throw new Error("Please connect your wallet first");
    }

    if (!balance || balance.value < parseEther(DEPOSIT_AMOUNT_ETH)) {
      throw new Error(
        `Insufficient balance. You need at least ${DEPOSIT_AMOUNT_ETH} ETH`
      );
    }

    try {
      setIsProcessing(true);
      console.log("🎯 Starting deposit for room:", room.id, "wallet:", address);

      // sendTransactionAsync returns a Promise that resolves when user approves
      // and rejects if user declines or there's an error
      const txHash = await sendTransactionAsync({
        to: TREASURE_WALLET,
        value: parseEther(DEPOSIT_AMOUNT_ETH),
        chainId: baseSepolia.id,
      });

      console.log("✅ Transaction approved by user! TxHash:", txHash);

      // Only call socket after user approval
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
      console.error("❌ Deposit failed or user rejected:", err);
      // Re-throw the error so the UI can handle it appropriately
      throw err;
    } finally {
      setIsProcessing(false);
    }
  };

  const payoutWinner = async (
    room: Room,
    winnerAddress: string,
    onSuccess?: (txHash: string) => void
  ) => {
    if (!address) {
      throw new Error("Please connect your wallet first");
    }

    // Note: This would typically be called by a backend service or admin
    // since only the treasure wallet can send the payout
    try {
      setIsProcessing(true);

      const payoutAmount = room.totalPot;

      const result = await sendTransactionAsync({
        to: winnerAddress as `0x${string}`,
        value: BigInt(payoutAmount),
        chainId: baseSepolia.id,
        // Note: payout info tracked via backend API
      });

      if (onSuccess && result) {
        onSuccess(result);
      }

      return result;
    } catch (err) {
      console.error("Payout failed:", err);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  };

  const hasEnoughBalance = () => {
    if (!balance) return false;
    return balance.value >= parseEther(DEPOSIT_AMOUNT_ETH);
  };

  const formatDepositAmount = () => {
    return `${DEPOSIT_AMOUNT_ETH} ETH`;
  };

  const formatPotAmount = (potWei: string) => {
    return formatEther(BigInt(potWei));
  };

  return {
    address,
    balance,
    depositForRoom,
    payoutWinner,
    hasEnoughBalance,
    formatDepositAmount,
    formatPotAmount,
    isProcessing: isProcessing || isPending,
    error,
    txHash,
    DEPOSIT_AMOUNT_ETH,
    TREASURE_WALLET,
  };
}
