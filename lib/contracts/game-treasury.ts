import { Address } from "viem";

export const GAME_TREASURY_ADDRESS =
  "0xD0484Fbfb4D52f2217664481B4D7eaBF9e97Af00";

export const GAME_TREASURY_ABI = [
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
    ],
    name: "depositForGame",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "string",
        name: "gameId",
        type: "string",
      },
      {
        indexed: true,
        internalType: "address",
        name: "player",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "DepositMade",
    type: "event",
  },
  {
    inputs: [],
    name: "emergencyWithdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "string",
        name: "gameId",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "refundAmount",
        type: "uint256",
      },
    ],
    name: "GameCancelled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "string",
        name: "gameId",
        type: "string",
      },
    ],
    name: "GameCreated",
    type: "event",
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
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "string",
        name: "gameId",
        type: "string",
      },
      {
        indexed: true,
        internalType: "address",
        name: "winner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "WinnerPaid",
    type: "event",
  },
  {
    inputs: [],
    name: "DEPOSIT_AMOUNT",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    name: "gameExists",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    name: "games",
    outputs: [
      {
        internalType: "string",
        name: "gameId",
        type: "string",
      },
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
  {
    inputs: [],
    name: "getContractBalance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
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
  {
    inputs: [
      {
        internalType: "string",
        name: "gameId",
        type: "string",
      },
    ],
    name: "getGamePlayers",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
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
        name: "player",
        type: "address",
      },
    ],
    name: "hasPlayerDeposited",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

export const DEPOSIT_AMOUNT = BigInt("1000000000"); // 1 gwei in wei
