import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { usePrivy } from "@privy-io/react-auth";
import { Wallet, Loader2, CheckCircle } from "lucide-react";
import { GAME_CONFIG } from "@/lib/constants";

const PaymentTest = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastTxHash, setLastTxHash] = useState<string>("");
  const { toast } = useToast();
  const { authenticated, user, sendTransaction, ready } = usePrivy();

  const testPayment = async () => {
    if (!authenticated || !user) {
      toast({
        title: "Not Connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      console.log("🧪 Testing Privy sendTransaction...");
      console.log("User:", user.id);
      console.log("User wallet:", user.wallet?.address);
      console.log("Linked accounts:", user.linkedAccounts);

      // Test small amount (0.001 CHZ)
      const testAmount = (0.001 * 1e18).toString(16);

      const txHash = await sendTransaction({
        to: GAME_CONFIG.TREASURY_ADDRESS,
        value: `0x${testAmount}`, // 0.001 CHZ for testing
        data: "0x",
      });

      console.log("✅ Test transaction successful:", txHash);
      setLastTxHash(String(txHash));

      toast({
        title: "Test Payment Successful! 🎉",
        description: "Privy sendTransaction is working correctly!",
      });
    } catch (error: any) {
      console.error("❌ Test payment failed:", error);
      console.error("Error details:", {
        message: error.message,
        code: error.code,
        stack: error.stack,
      });

      toast({
        title: "Test Payment Failed",
        description: `Error: ${error.message || "Unknown error"}`,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!ready) {
    return (
      <Card className="bg-black/30 border-yellow-400 p-4 backdrop-blur-sm">
        <p className="text-yellow-400">Initializing Privy...</p>
      </Card>
    );
  }

  return (
    <Card className="bg-black/30 border-green-400 p-6 backdrop-blur-sm">
      <h3 className="text-green-400 font-bold mb-4">Privy Payment Test</h3>

      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-white text-sm">
            <strong>Status:</strong>{" "}
            {authenticated ? "✅ Connected" : "❌ Not Connected"}
          </p>
          {user?.wallet?.address && (
            <p className="text-white text-sm">
              <strong>Wallet:</strong> {user.wallet.address.slice(0, 6)}...
              {user.wallet.address.slice(-4)}
            </p>
          )}
          <p className="text-white text-sm">
            <strong>Treasury:</strong>{" "}
            {GAME_CONFIG.TREASURY_ADDRESS.slice(0, 6)}...
            {GAME_CONFIG.TREASURY_ADDRESS.slice(-4)}
          </p>
        </div>

        <Button
          onClick={testPayment}
          disabled={!authenticated || isProcessing}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Testing Payment...
            </>
          ) : !authenticated ? (
            <>
              <Wallet className="w-4 h-4 mr-2" />
              Connect Wallet First
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              Test 0.001 CHZ Payment
            </>
          )}
        </Button>

        {lastTxHash && (
          <div className="mt-4 p-3 bg-green-900/30 rounded border border-green-400">
            <p className="text-green-300 text-sm">
              <strong>Last Transaction:</strong>
            </p>
            <p className="text-green-200 text-xs font-mono break-all">
              {lastTxHash}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default PaymentTest;
