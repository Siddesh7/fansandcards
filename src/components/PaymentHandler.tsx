
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { usePrivy } from '@privy-io/react-auth';
import { Wallet, Loader2 } from 'lucide-react';

interface PaymentHandlerProps {
  onSuccess: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}

const PaymentHandler = ({ onSuccess, children, disabled = false }: PaymentHandlerProps) => {
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

    setIsProcessing(true);
    
    try {
      console.log('Starting CHZ payment process for authenticated user:', user.id);
      
      // Get the user's wallet
      const wallet = user.linkedAccounts.find(account => account.type === 'wallet');
      if (!wallet) {
        throw new Error('No wallet found');
      }

      // Prepare CHZ transaction (0.1 CHZ = 100000000000000000 wei)
      const transactionRequest = {
        to: '0x0000000000000000000000000000000000000000', // Replace with your treasury address
        value: '0x16345785d8a0000', // 0.1 CHZ in hex
        data: '0x',
      };

      console.log('Sending CHZ transaction:', transactionRequest);

      // Send the transaction using Privy
      const txHash = await sendTransaction(transactionRequest);
      
      console.log('CHZ transaction successful:', txHash);

      toast({
        title: "Payment Successful! 🎉",
        description: "0.1 CHZ entry fee processed. Joining room...",
      });

      // Call onSuccess after payment is confirmed
      onSuccess();
    } catch (error) {
      console.error('CHZ payment failed:', error);
      toast({
        title: "Payment Failed",
        description: error.message || "CHZ transaction was cancelled or failed. Please try again.",
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
