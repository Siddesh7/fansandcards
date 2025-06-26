
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
  const { authenticated } = usePrivy();

  const handlePayment = async () => {
    if (!authenticated) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first to make a payment.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      console.log('Starting payment process for authenticated user');
      
      // Simulate CHZ payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log('0.1 CHZ payment completed successfully');

      toast({
        title: "Payment Successful! 🎉",
        description: "0.1 CHZ entry fee processed. Joining room...",
      });

      // Only call onSuccess after payment is confirmed
      onSuccess();
    } catch (error) {
      console.error('Payment failed:', error);
      toast({
        title: "Payment Failed",
        description: "CHZ transaction was cancelled or failed. Please try again.",
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
