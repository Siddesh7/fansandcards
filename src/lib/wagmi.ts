
import { createConfig, http } from 'wagmi';
import { defineChain } from 'viem';

// Spicy Testnet (Chiliz) configuration
export const spicyTestnet = defineChain({
  id: 88882,
  name: 'Spicy Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'CHZ',
    symbol: 'CHZ',
  },
  rpcUrls: {
    default: {
      http: ['https://spicy-rpc.chiliz.com'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Spicy Explorer',
      url: 'https://spicy-explorer.chiliz.com',
    },
  },
  testnet: true,
});

export const wagmiConfig = createConfig({
  chains: [spicyTestnet],
  transports: {
    [spicyTestnet.id]: http(),
  },
});

export const ADMIN_WALLET = '0x4e6D595987572f20847a0bF739FC0d9bE32a98a2';
export const GAME_ENTRY_FEE = '0.1';
