
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useSendTransaction, useAccount } from 'wagmi';
import { parseEther } from 'viem';
import { ADMIN_WALLET, GAME_ENTRY_FEE } from '@/lib/wagmi';
import { Wallet, Loader2 } from 'lucide-react';

interface PaymentHandlerProps {
  onSuccess: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}

const PaymentHandler = ({ onSuccess, children, disabled = false }: PaymentHandlerProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { isConnected } = useAccount();
  const { sendTransaction } = useSendTransaction();

  const handlePayment = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      const txHash = await sendTransaction({
        to: ADMIN_WALLET as `0x${string}`,
        value: parseEther(GAME_ENTRY_FEE),
      });

      console.log('Transaction sent:', txHash);

      toast({
        title: "Payment Successful! 🎉",
        description: `Paid ${GAME_ENTRY_FEE} CHZ entry fee.`,
      });

      onSuccess();
    } catch (error) {
      console.error('Payment failed:', error);
      toast({
        title: "Payment Failed",
        description: "Transaction was cancelled or failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Button 
      onClick={handlePayment}
      disabled={disabled || isProcessing || !isConnected}
      className="font-bold"
    >
      {isProcessing ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Processing...
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
