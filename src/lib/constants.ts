// Game Configuration Constants
export const GAME_CONFIG = {
  // Entry fee for joining a game room (in CHZ)
  ENTRY_FEE: "0.1",

  // Entry fee in wei (0.1 CHZ = 100000000000000000 wei)
  ENTRY_FEE_WEI: "100000000000000000",

  // Treasury wallet address where payments are sent
  // Using a test address for now - replace with your actual treasury address
  TREASURY_ADDRESS: "0x742B6Db8A4c8AC7e2f54c8Bf4B8B0D8c9A67E0C1",

  // Chiliz Chain Configuration
  CHILIZ_CHAIN_ID: 88888,
  CHILIZ_TESTNET_ID: 88882,
} as const;

export const SUPPORTED_CHAINS = {
  CHILIZ_MAINNET: 88888,
  CHILIZ_TESTNET: 88882,
} as const;

// Chain configuration for Privy
export const CHAIN_CONFIG = {
  CHILIZ_MAINNET: {
    id: 88888,
    name: "Chiliz Chain",
    network: "chiliz",
    nativeCurrency: {
      decimals: 18,
      name: "Chiliz",
      symbol: "CHZ",
    },
    rpcUrls: {
      default: {
        http: ["https://rpc.ankr.com/chiliz"],
      },
      public: {
        http: ["https://rpc.ankr.com/chiliz"],
      },
    },
    blockExplorers: {
      default: {
        name: "ChilizScan",
        url: "https://scan.chiliz.com",
      },
    },
  },
  CHILIZ_TESTNET: {
    id: 88882,
    name: "Chiliz Spicy Testnet",
    network: "chiliz-testnet",
    nativeCurrency: {
      decimals: 18,
      name: "Chiliz",
      symbol: "CHZ",
    },
    rpcUrls: {
      default: {
        http: ["https://spicy-rpc.chiliz.com/"],
      },
      public: {
        http: ["https://spicy-rpc.chiliz.com/"],
      },
    },
    blockExplorers: {
      default: {
        name: "ChilizScan Testnet",
        url: "https://testnet.chiliscan.com",
      },
    },
  },
} as const;
