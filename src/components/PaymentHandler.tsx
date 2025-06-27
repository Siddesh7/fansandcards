import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { usePrivy } from "@privy-io/react-auth";
import { Wallet, Loader2 } from "lucide-react";
import { GAME_CONFIG } from "@/lib/constants";

interface PaymentHandlerProps {
  onSuccess: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}

const PaymentHandler = ({
  onSuccess,
  children,
  disabled = false,
}: PaymentHandlerProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { authenticated, user, sendTransaction } = usePrivy();

  const handlePayment = async () => {
    if (!authenticated || !user) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first to make a payment.",
        variant: "destructive",
      });
      return;
    }

    if (!sendTransaction) {
      toast({
        title: "Transaction Not Available",
        description:
          "Send transaction method is not available. Please try reconnecting your wallet.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      console.log(
        "Starting CHZ payment process for authenticated user:",
        user.id
      );

      // Send the CHZ transaction using Privy's sendTransaction
      const txResponse = await sendTransaction({
        to: GAME_CONFIG.TREASURY_ADDRESS,
        value: GAME_CONFIG.ENTRY_FEE_WEI,
      });

      console.log("CHZ transaction successful:", txResponse);

      toast({
        title: "Payment Successful! 🎉",
        description: `${GAME_CONFIG.ENTRY_FEE} CHZ entry fee processed. Joining room...`,
      });

      // Call onSuccess after payment is confirmed
      onSuccess();
    } catch (error: any) {
      console.error("CHZ payment failed:", error);

      let errorMessage =
        "CHZ transaction was cancelled or failed. Please try again.";
      if (error.message?.includes("insufficient funds")) {
        errorMessage =
          "Insufficient CHZ balance. Please add funds to your wallet.";
      } else if (error.message?.includes("user rejected")) {
        errorMessage = "Transaction was cancelled by user.";
      } else if (error.message?.includes("denied")) {
        errorMessage = "Transaction was denied. Please try again.";
      }

      toast({
        title: "Payment Failed",
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
          Processing 0.1 CHZ...
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

export default PaymentHandler;
