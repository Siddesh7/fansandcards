"use client";
import { usePrivy } from "@privy-io/react-auth";
import { Button } from "@/components/ui/button";
import { useAccount } from "wagmi";
import { useSendTransaction } from "wagmi";
import { parseEther } from "viem";
export default function Home() {
  const { ready, login } = usePrivy();
  const { address } = useAccount();
  const { sendTransaction } = useSendTransaction();
  if (!ready) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-900 via-green-800 to-navy-900 relative overflow-hidden">
      {/* Stadium Background with Crowd */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1472396961693-142e6e269027')] bg-cover bg-center opacity-20"></div>

      <Button onClick={() => login()}>Login</Button>
      <div>{address}</div>
      <Button
        onClick={() =>
          sendTransaction({
            to: "0xd2135CfB216b74109775236E36d4b433F1DF507B",
            value: parseEther("0.00000000001"),
          })
        }
      >
        Send transaction
      </Button>
    </div>
  );
}
