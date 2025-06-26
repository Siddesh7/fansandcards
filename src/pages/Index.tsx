
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Trophy, Users } from 'lucide-react';

const Index = () => {
  const [showRules, setShowRules] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-900 via-green-800 to-navy-900 relative overflow-hidden">
      {/* Stadium Background with Crowd */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1472396961693-142e6e269027')] bg-cover bg-center opacity-20"></div>
      
      {/* Animated Flares */}
      <div className="absolute top-10 left-10 w-4 h-4 bg-red-500 rounded-full animate-pulse opacity-60"></div>
      <div className="absolute top-20 right-20 w-3 h-3 bg-yellow-400 rounded-full animate-pulse opacity-70 animation-delay-1000"></div>
      <div className="absolute bottom-32 left-1/4 w-5 h-5 bg-red-600 rounded-full animate-pulse opacity-50 animation-delay-2000"></div>
      
      {/* Stadium Lights Effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white opacity-5"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-8 min-h-screen flex flex-col justify-center items-center text-center">
        {/* Main Headline */}
        <div className="animate-fade-in mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-wide">
            SPORTS AGAINST FANS
          </h1>
          <div className="flex items-center justify-center gap-2 mb-4">
            <Trophy className="w-8 h-8 text-green-400 animate-bounce" />
            <p className="text-xl md:text-2xl text-green-300 font-semibold">
              THE FUNNIEST FOOTBALL CARD GAME!
            </p>
            <Trophy className="w-8 h-8 text-green-400 animate-bounce animation-delay-500" />
          </div>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl">
            Match cards, roast rivals, win $CHZ and NFTs!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-12 animate-fade-in animation-delay-500">
          <Button 
            size="lg" 
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 text-lg font-bold animate-pulse hover:animate-none transition-all duration-300 hover:scale-105"
          >
            🔥 CONNECT WALLET
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-green-400 text-green-400 hover:bg-green-400 hover:text-black px-8 py-4 text-lg font-bold transition-all duration-300 hover:scale-105"
          >
            <Users className="w-5 h-5 mr-2" />
            JOIN GAME
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl animate-fade-in animation-delay-1000">
          <Card className="bg-black/30 border-green-400 p-6 text-center backdrop-blur-sm hover:scale-105 transition-all duration-300">
            <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-4 animate-bounce" />
            <h3 className="text-xl font-bold text-white mb-2">WIN $CHZ & NFTs</h3>
            <p className="text-green-300">
              50% prize pool + rare NFT cards + 100 Reward Points
            </p>
          </Card>
          
          <Card className="bg-black/30 border-red-400 p-6 text-center backdrop-blur-sm hover:scale-105 transition-all duration-300">
            <Trophy className="w-12 h-12 text-red-400 mx-auto mb-4 animate-spin" />
            <h3 className="text-xl font-bold text-white mb-2">ROAST RIVALS</h3>
            <p className="text-red-300">
              Hilarious football cards that'll make you laugh out loud
            </p>
          </Card>
          
          <Card className="bg-black/30 border-blue-400 p-6 text-center backdrop-blur-sm hover:scale-105 transition-all duration-300">
            <Users className="w-12 h-12 text-blue-400 mx-auto mb-4 animate-pulse" />
            <h3 className="text-xl font-bold text-white mb-2">3-8 PLAYERS</h3>
            <p className="text-blue-300">
              Quick 10-15 minute matches with your football crew
            </p>
          </Card>
        </div>

        {/* How to Play Button */}
        <div className="mt-8 animate-fade-in animation-delay-1500">
          <Dialog open={showRules} onOpenChange={setShowRules}>
            <DialogTrigger asChild>
              <Button variant="ghost" className="text-white hover:text-green-400 text-lg">
                📋 HOW TO PLAY
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-black/90 border-green-400 text-white max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-2xl text-green-400 flex items-center gap-2">
                  <Trophy className="w-6 h-6" />
                  Game Rules
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 text-white/90">
                <div>
                  <h4 className="font-bold text-green-400 mb-2">Setup:</h4>
                  <p>• Pay 0.1 $CHZ entry fee for premium matches</p>
                  <p>• Get 7 Answer Cards + 1 Action Card (all NFTs)</p>
                  <p>• Vote for Football theme (Basketball/American Football coming soon)</p>
                </div>
                
                <div>
                  <h4 className="font-bold text-red-400 mb-2">Gameplay:</h4>
                  <p>• Read the Prompt Card (e.g., "The worst transfer signing was ___")</p>
                  <p>• Submit your funniest Answer Card</p>
                  <p>• Fan Judge picks the winner (1-2 points)</p>
                  <p>• Use Action Cards for chaos (steal, double points, block players)</p>
                </div>
                
                <div>
                  <h4 className="font-bold text-yellow-400 mb-2">Victory:</h4>
                  <p>• Play 5 rounds, highest score wins</p>
                  <p>• Winner gets 50% $CHZ pot + rare NFT + 100 Reward Points</p>
                  <p>• Trade cards on Kayen Swap</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center animate-fade-in animation-delay-2000">
          <p className="text-white/70 text-sm">
            Built for Vibe Hacking Online Hackathon • Powered by Chiliz Chain
          </p>
          <div className="flex justify-center gap-4 mt-4">
            <span className="text-green-400 text-sm">⚽ Football Theme Active</span>
            <span className="text-white/50 text-sm">🏀 Basketball (Coming Soon)</span>
            <span className="text-white/50 text-sm">🏈 American Football (Coming Soon)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
