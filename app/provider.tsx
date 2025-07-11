"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { WagmiProvider } from "@privy-io/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http, defineChain } from "viem";
import { createConfig } from "wagmi";
import { ReactNode } from "react";

const queryClient = new QueryClient();

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

const wagmiConfig = createConfig({
  chains: [chiliz],
  transports: {
    [chiliz.id]: http(),
  },
});

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <PrivyProvider
      appId={"cmbys4tbe00j4ld0nnspaqhgq"}
      config={{
        loginMethods: ["email", "wallet"],
        appearance: {
          theme: "dark",
          accentColor: "#676FFF",
        },
        defaultChain: chiliz,
        supportedChains: [chiliz],
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}
