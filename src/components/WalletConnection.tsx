
import { usePrivy } from '@privy-io/react-auth';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Wallet, LogOut } from 'lucide-react';

const WalletConnection = () => {
  const { login, logout, ready, authenticated, user } = usePrivy();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleConnect = async () => {
    try {
      await login();
      toast({
        title: "Wallet Connected! 🎉",
        description: "Welcome to Sports Against Fans!",
      });
      // Navigate to lobby after successful connection
      setTimeout(() => navigate('/lobby'), 1000);
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Please try again or use a different wallet.",
        variant: "destructive",
      });
    }
  };

  const handleDisconnect = async () => {
    try {
      await logout();
      toast({
        title: "Wallet Disconnected",
        description: "Thanks for playing!",
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!ready) {
    return (
      <Button 
        size="lg" 
        disabled
        className="bg-red-600/50 text-white px-8 py-4 text-lg font-bold cursor-not-allowed"
      >
        🔄 Loading...
      </Button>
    );
  }

  if (authenticated && user) {
    return (
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="text-center sm:text-left">
          <p className="text-green-400 font-bold">Connected</p>
          <p className="text-white/80 text-sm">
            {user.wallet?.address ? 
              `${user.wallet.address.slice(0, 6)}...${user.wallet.address.slice(-4)}` :
              user.email?.address || 'User'
            }
          </p>
        </div>
        <Button 
          onClick={handleDisconnect}
          variant="outline"
          className="border-red-400 text-red-400 hover:bg-red-400 hover:text-black px-6 py-2"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <Button 
      onClick={handleConnect}
      size="lg" 
      className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 text-lg font-bold animate-pulse hover:animate-none transition-all duration-300 hover:scale-105"
    >
      <Wallet className="w-5 h-5 mr-2" />
      🔥 CONNECT WALLET
    </Button>
  );
};

export default WalletConnection;
