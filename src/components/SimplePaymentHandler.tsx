import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { Wallet, Loader2 } from "lucide-react";
import { GAME_CONFIG } from "@/lib/constants";

interface SimplePaymentHandlerProps {
  onSuccess: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}

const SimplePaymentHandler = ({
  onSuccess,
  children,
  disabled = false,
}: SimplePaymentHandlerProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { authenticated, user, sendTransaction } = usePrivy();
  const { wallets } = useWallets();
  console.log(wallets);
  const handlePayment = async () => {
    if (!authenticated || !user) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first to make a payment.",
        variant: "destructive",
      });
      return;
    }

    // Check if user has a wallet connected
    const wallet = user.linkedAccounts?.find(
      (account) => account.type === "wallet"
    );
    if (!wallet && !user.wallet) {
      toast({
        title: "No Wallet Found",
        description:
          "Please connect a wallet or create an embedded wallet to continue.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      console.log("Starting CHZ payment process for user:", user.id);
      console.log("Treasury address:", GAME_CONFIG.TREASURY_ADDRESS);
      console.log("Amount:", `${GAME_CONFIG.ENTRY_FEE} CHZ`);

      // Convert 0.1 CHZ to wei (18 decimals)
      const amountInWei = (parseFloat(GAME_CONFIG.ENTRY_FEE) * 1e18).toString(
        16
      );

      console.log("Sending transaction with Privy...");

      // Use Privy's sendTransaction
      console.log(user, wallets);
      const txHash = await sendTransaction({
        to: GAME_CONFIG.TREASURY_ADDRESS,
        value: `0x${amountInWei}`, // 0.1 CHZ in hex
      });

      console.log("✅ CHZ transaction successful! Hash:", txHash);

      toast({
        title: "Payment Successful! 🎉",
        description: `${GAME_CONFIG.ENTRY_FEE} CHZ entry fee processed successfully!`,
      });

      // Small delay for better UX
      setTimeout(() => {
        onSuccess();
      }, 1000);
    } catch (error: any) {
      console.error("❌ CHZ payment failed:", error);

      let errorMessage = "Transaction failed. Please try again.";
      let errorTitle = "Payment Failed";

      if (error.message?.includes("insufficient")) {
        errorMessage = `You need at least ${GAME_CONFIG.ENTRY_FEE} CHZ to play. Please add funds to your wallet.`;
        errorTitle = "Insufficient Balance";
      } else if (
        error.message?.includes("user rejected") ||
        error.message?.includes("denied")
      ) {
        errorMessage =
          "Transaction was cancelled. Please try again when ready.";
        errorTitle = "Transaction Cancelled";
      } else if (error.message?.includes("network")) {
        errorMessage =
          "Network error. Please check your connection and try again.";
        errorTitle = "Network Error";
      }

      toast({
        title: errorTitle,
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={disabled || isProcessing || !authenticated}
      className="font-bold bg-red-600 hover:bg-red-700"
    >
      {isProcessing ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Processing {GAME_CONFIG.ENTRY_FEE} CHZ...
        </>
      ) : !authenticated ? (
        <>
          <Wallet className="w-4 h-4 mr-2" />
          Connect Wallet First
        </>
      ) : (
        <>
          <Wallet className="w-4 h-4 mr-2" />
          {children}
        </>
      )}
    </Button>
  );
};

export default SimplePaymentHandler;
