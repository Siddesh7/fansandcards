import { createWalletClient, http, publicActions, defineChain } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Define Chiliz mainnet chain
const chiliz = defineChain({
  id: 88888,
  name: "Chiliz",
  nativeCurrency: {
    decimals: 18,
    name: "Chiliz",
    symbol: "CHZ",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.ankr.com/chiliz"],
    },
  },
  blockExplorers: {
    default: {
      name: "ChilizScan",
      url: "https://chiliscan.com",
    },
  },
});

const GAME_TREASURY_ADDRESS = "0x8202f7875f0417593CC4a8391dA08874A1eb0EAF";
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
console.log("   Chain:", chiliz.name, "(ID:", chiliz.id, ")");
console.log("   Private key configured:", !!PRIVATE_KEY);
console.log(
  "   Environment file loaded:",
  process.env.NODE_ENV || "development"
);

const GAME_TREASURY_ABI = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "gameId",
        type: "uint256",
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
        internalType: "uint256",
        name: "gameId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "winner",
        type: "address",
      },
    ],
    name: "payWinner",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "gameId",
        type: "uint256",
      },
    ],
    name: "getGame",
    outputs: [
      {
        internalType: "uint256",
        name: "pot",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "active",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "paidOut",
        type: "bool",
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
      chain: chiliz,
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

      // Convert string gameId to number for contract
      const gameIdNum = parseInt(gameId.replace(/\D/g, "")) || 0;

      const txHash = await walletClient.writeContract({
        address: GAME_TREASURY_ADDRESS,
        abi: GAME_TREASURY_ABI,
        functionName: "createGame",
        args: [BigInt(gameIdNum)],
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

      // Convert string gameId to number for contract
      const gameIdNum = parseInt(gameId.replace(/\D/g, "")) || 0;

      const txHash = await walletClient.writeContract({
        address: GAME_TREASURY_ADDRESS,
        abi: GAME_TREASURY_ABI,
        functionName: "payWinner",
        args: [BigInt(gameIdNum), winnerAddress],
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

  static async getGameInfo(gameId: string) {
    if (!walletClient) {
      throw new Error(
        "Wallet client not initialized - check private key configuration"
      );
    }

    try {
      // Convert string gameId to number for contract
      const gameIdNum = parseInt(gameId.replace(/\D/g, "")) || 0;

      const result = await walletClient.readContract({
        address: GAME_TREASURY_ADDRESS,
        abi: GAME_TREASURY_ABI,
        functionName: "getGame",
        args: [BigInt(gameIdNum)],
      });

      const [pot, active, paidOut] = result;

      return {
        totalPot: pot.toString(),
        isActive: active,
        isPaidOut: paidOut,
      };
    } catch (error) {
      console.error("Error getting game info:", error);
      throw new Error(`Failed to get game info: ${error}`);
    }
  }
}
