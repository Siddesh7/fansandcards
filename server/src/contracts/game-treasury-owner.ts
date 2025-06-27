import { createWalletClient, http, publicActions } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia } from "viem/chains";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const GAME_TREASURY_ADDRESS = "0xD0484Fbfb4D52f2217664481B4D7eaBF9e97Af00";
const PRIVATE_KEY = process.env.GAME_TREASURY_PRIVATE_KEY as `0x${string}`;

// Debug logging for environment variables
if (!PRIVATE_KEY || (PRIVATE_KEY as string) === "your_private_key_here") {
  console.error(
    "❌ GAME_TREASURY_PRIVATE_KEY not set or still has placeholder value"
  );
  console.error(
    "Please update your server/.env file with your actual private key"
  );
}

console.log("🔑 Contract configuration loaded:");
console.log("   Address:", GAME_TREASURY_ADDRESS);
console.log("   Private key configured:", PRIVATE_KEY ? "Yes" : "No");
console.log(
  "   Environment file loaded:",
  process.env.NODE_ENV || "development"
);

const GAME_TREASURY_ABI = [
  {
    inputs: [
      {
        internalType: "string",
        name: "gameId",
        type: "string",
      },
    ],
    name: "createGame",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "gameId",
        type: "string",
      },
      {
        internalType: "address",
        name: "winner",
        type: "address",
      },
    ],
    name: "payoutWinner",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "gameId",
        type: "string",
      },
    ],
    name: "cancelGameAndRefund",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "gameId",
        type: "string",
      },
    ],
    name: "getGameInfo",
    outputs: [
      {
        internalType: "uint256",
        name: "totalPot",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "playerCount",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "isActive",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "isPaidOut",
        type: "bool",
      },
      {
        internalType: "address",
        name: "winner",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

// Create wallet client for owner operations (only if we have a valid private key)
let walletClient: any = null;

if (PRIVATE_KEY && (PRIVATE_KEY as string) !== "your_private_key_here") {
  try {
    const account = privateKeyToAccount(PRIVATE_KEY);
    walletClient = createWalletClient({
      account,
      chain: baseSepolia,
      transport: http(),
    }).extend(publicActions);
    console.log("✅ Wallet client initialized successfully");
  } catch (error) {
    console.error("❌ Failed to initialize wallet client:", error);
  }
} else {
  console.warn("⚠️ Wallet client not initialized - private key not configured");
}

export class GameTreasuryContract {
  static async createGame(gameId: string) {
    if (!walletClient) {
      throw new Error(
        "Wallet client not initialized - check private key configuration"
      );
    }

    try {
      console.log("Creating game on contract:", gameId);

      const txHash = await walletClient.writeContract({
        address: GAME_TREASURY_ADDRESS,
        abi: GAME_TREASURY_ABI,
        functionName: "createGame",
        args: [gameId],
      });

      console.log("Game created, tx:", txHash);

      // Wait for transaction receipt
      const receipt = await walletClient.waitForTransactionReceipt({
        hash: txHash,
      });
      console.log("Game creation confirmed:", receipt.status);

      return { txHash, receipt };
    } catch (error) {
      console.error("Error creating game:", error);
      throw new Error(`Failed to create game: ${error}`);
    }
  }

  static async payoutWinner(gameId: string, winnerAddress: `0x${string}`) {
    if (!walletClient) {
      throw new Error(
        "Wallet client not initialized - check private key configuration"
      );
    }

    try {
      console.log("Paying out winner:", { gameId, winnerAddress });

      const txHash = await walletClient.writeContract({
        address: GAME_TREASURY_ADDRESS,
        abi: GAME_TREASURY_ABI,
        functionName: "payoutWinner",
        args: [gameId, winnerAddress],
      });

      console.log("Payout transaction sent:", txHash);

      // Wait for transaction receipt
      const receipt = await walletClient.waitForTransactionReceipt({
        hash: txHash,
      });
      console.log("Payout confirmed:", receipt.status);

      return { txHash, receipt };
    } catch (error) {
      console.error("Error paying out winner:", error);
      throw new Error(`Failed to payout winner: ${error}`);
    }
  }

  static async cancelGame(gameId: string) {
    if (!walletClient) {
      throw new Error(
        "Wallet client not initialized - check private key configuration"
      );
    }

    try {
      console.log("Cancelling game:", gameId);

      const txHash = await walletClient.writeContract({
        address: GAME_TREASURY_ADDRESS,
        abi: GAME_TREASURY_ABI,
        functionName: "cancelGameAndRefund",
        args: [gameId],
      });

      console.log("Cancel transaction sent:", txHash);

      // Wait for transaction receipt
      const receipt = await walletClient.waitForTransactionReceipt({
        hash: txHash,
      });
      console.log("Cancellation confirmed:", receipt.status);

      return { txHash, receipt };
    } catch (error) {
      console.error("Error cancelling game:", error);
      throw new Error(`Failed to cancel game: ${error}`);
    }
  }

  static async getGameInfo(gameId: string) {
    if (!walletClient) {
      throw new Error(
        "Wallet client not initialized - check private key configuration"
      );
    }

    try {
      const result = await walletClient.readContract({
        address: GAME_TREASURY_ADDRESS,
        abi: GAME_TREASURY_ABI,
        functionName: "getGameInfo",
        args: [gameId],
      });

      const [totalPot, playerCount, isActive, isPaidOut, winner] = result;

      return {
        totalPot: totalPot.toString(),
        playerCount: Number(playerCount),
        isActive,
        isPaidOut,
        winner,
      };
    } catch (error) {
      console.error("Error getting game info:", error);
      throw new Error(`Failed to get game info: ${error}`);
    }
  }
}
