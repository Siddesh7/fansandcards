"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { PrivyProvider } from "@privy-io/react-auth";
// Make sure to import these from `@privy-io/wagmi`, not `wagmi`
import { WagmiProvider, createConfig } from "@privy-io/wagmi";
import { baseSepolia } from "wagmi/chains";
import { http } from "wagmi";

const queryClient = new QueryClient();
const config = createConfig({
  chains: [baseSepolia],
  transports: {
    [baseSepolia.id]: http(),
  },
});
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId="cmbys4tbe00j4ld0nnspaqhgq"
      config={{
        embeddedWallets: {
          ethereum: {
            createOnLogin: "users-without-wallets",
          },
        },
        defaultChain: baseSepolia,
        supportedChains: [baseSepolia],
      }}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={config}>{children}</WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}
