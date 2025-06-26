
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Users, Football, Plus, Repeat } from 'lucide-react';

const Results = () => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [showRewards, setShowRewards] = useState(false);
  
  const [matchResults] = useState({
    winner: { name: "CRFan007", points: 5, avatar: "C" },
    players: [
      { name: "CRFan007", points: 5, position: 1, avatar: "C" },
      { name: "MessiGoat", points: 4, position: 2, avatar: "M" },
      { name: "You", points: 3, position: 3, avatar: "Y" },
      { name: "PepGuard", points: 2, position: 4, avatar: "P" },
    ],
    rewards: {
      chz: "0.2",
      rewardPoints: 100,
      nftCard: {
        name: "Legendary Ronaldo Rage Card",
        rarity: "Epic",
        description: "Cristiano's legendary celebration after scoring the winner"
      }
    },
    matchStats: {
      duration: "12 minutes",
      funniest: "A drunk ultra with a megaphone",
      totalLaughs: 47
    }
  });

  useEffect(() => {
    // Trigger confetti animation
    setShowConfetti(true);
    setTimeout(() => setShowRewards(true), 1000);
    setTimeout(() => setShowConfetti(false), 3000);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-900 via-green-800 to-navy-900 relative overflow-hidden">
      {/* Stadium Background */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1469041797191-50ace28483c3')] bg-cover bg-center opacity-15"></div>
      
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random()}s`
              }}
            />
          ))}
          {[...Array(30)].map((_, i) => (
            <div
              key={i + 50}
              className="absolute w-2 h-2 bg-red-500 rounded-full animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random()}s`
              }}
            />
          ))}
        </div>
      )}
      
      {/* Victory Lights */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-yellow-400/20 rounded-full blur-3xl animate-pulse"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Victory Announcement */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Trophy className="w-16 h-16 text-yellow-400 animate-bounce" />
            <div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-2">
                🏆 VICTORY! 🏆
              </h1>
              <p className="text-2xl md:text-3xl text-yellow-400 font-bold">
                {matchResults.winner.name} WINS WITH {matchResults.winner.points} POINTS!
              </p>
            </div>
            <Trophy className="w-16 h-16 text-yellow-400 animate-bounce animation-delay-500" />
          </div>
          <div className="flex items-center justify-center gap-2 text-green-400 text-lg">
            <Football className="w-5 h-5 animate-spin" />
            <span>What a match! The crowd goes wild!</span>
            <Football className="w-5 h-5 animate-spin" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Final Scoreboard */}
          <div className="space-y-6">
            <Card className="bg-black/30 border-yellow-400 backdrop-blur-sm">
              <div className="p-6 border-b border-yellow-400">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Users className="w-6 h-6 text-yellow-400" />
                  Final Scoreboard
                </h2>
              </div>
              <div className="p-6 space-y-4">
                {matchResults.players.map((player, index) => (
                  <div 
                    key={player.name}
                    className={`flex items-center justify-between p-4 rounded-lg transition-all duration-300 animate-fade-in ${
                      player.position === 1 
                        ? 'bg-yellow-400/20 border border-yellow-400' 
                        : 'bg-white/5'
                    }`}
                    style={{ animationDelay: `${index * 200}ms` }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">
                          {player.position === 1 ? '🥇' : player.position === 2 ? '🥈' : player.position === 3 ? '🥉' : '4️⃣'}
                        </span>
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                          player.position === 1 ? 'bg-yellow-600' : 'bg-red-600'
                        }`}>
                          {player.avatar}
                        </div>
                      </div>
                      <div>
                        <h3 className={`font-bold ${player.position === 1 ? 'text-yellow-400' : 'text-white'}`}>
                          {player.name}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {player.position === 1 ? 'Champion!' : `${player.position}${player.position === 2 ? 'nd' : player.position === 3 ? 'rd' : 'th'} Place`}
                        </p>
                      </div>
                    </div>
                    <Badge className={`text-lg px-4 py-2 ${
                      player.position === 1 ? 'bg-yellow-600' : 'bg-green-600'
                    } text-white`}>
                      {player.points} pts
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>

            {/* Match Stats */}
            <Card className="bg-black/30 border-green-400 backdrop-blur-sm">
              <div className="p-6 border-b border-green-400">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Football className="w-6 h-6 text-green-400" />
                  Match Stats
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Duration:</span>
                  <span className="text-green-400 font-bold">{matchResults.matchStats.duration}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Funniest Card:</span>
                  <span className="text-yellow-400 font-bold text-sm">"{matchResults.matchStats.funniest}"</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Total Laughs:</span>
                  <span className="text-red-400 font-bold">{matchResults.matchStats.totalLaughs} 😂</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Rewards */}
          <div className="space-y-6">
            {showRewards && (
              <Card className="bg-black/30 border-yellow-400 backdrop-blur-sm animate-scale-in">
                <div className="p-6 border-b border-yellow-400">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Trophy className="w-6 h-6 text-yellow-400 animate-pulse" />
                    Victory Rewards
                  </h2>
                </div>
                <div className="p-6 space-y-6">
                  {/* $CHZ Reward */}
                  <div className="text-center p-4 bg-green-600/20 rounded-lg border border-green-400 animate-fade-in">
                    <div className="text-3xl mb-2">💰</div>
                    <h3 className="text-xl font-bold text-green-400 mb-2">$CHZ Winnings</h3>
                    <div className="text-3xl font-bold text-white">{matchResults.rewards.chz} $CHZ</div>
                    <p className="text-sm text-green-300 mt-2">50% of the prize pool!</p>
                  </div>

                  {/* Reward Points */}
                  <div className="text-center p-4 bg-blue-600/20 rounded-lg border border-blue-400 animate-fade-in animation-delay-500">
                    <div className="text-3xl mb-2">⭐</div>
                    <h3 className="text-xl font-bold text-blue-400 mb-2">Reward Points</h3>
                    <div className="text-3xl font-bold text-white">{matchResults.rewards.rewardPoints}</div>
                    <p className="text-sm text-blue-300 mt-2">Spend on Socios.com goodies!</p>
                  </div>

                  {/* NFT Card */}
                  <div className="text-center p-4 bg-purple-600/20 rounded-lg border border-purple-400 animate-fade-in animation-delay-1000">
                    <div className="text-3xl mb-2">🎴</div>
                    <h3 className="text-xl font-bold text-purple-400 mb-2">Rare NFT Card</h3>
                    <div className="text-lg font-bold text-white mb-2">
                      {matchResults.rewards.nftCard.name}
                    </div>
                    <Badge className="bg-purple-600 text-white mb-2">
                      {matchResults.rewards.nftCard.rarity}
                    </Badge>
                    <p className="text-sm text-purple-300">
                      {matchResults.rewards.nftCard.description}
                    </p>
                    <div className="mt-4 p-3 bg-purple-900/30 rounded-lg">
                      <div className="text-6xl animate-bounce">🏆</div>
                      <p className="text-xs text-purple-200 mt-2">AR Preview: Victory Celebration</p>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="space-y-4">
              <Button className="w-full bg-yellow-600 hover:bg-yellow-700 text-black font-bold text-lg py-4 animate-pulse">
                <Plus className="w-5 h-5 mr-2" />
                🎴 TRADE CARDS ON KAYEN SWAP
              </Button>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button className="bg-green-600 hover:bg-green-700 text-white font-bold py-3">
                  <Repeat className="w-4 h-4 mr-2" />
                  PLAY AGAIN
                </Button>
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-black font-bold py-3">
                  <Users className="w-4 h-4 mr-2" />
                  NEW LOBBY
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Fun Footer */}
        <div className="mt-12 text-center animate-fade-in animation-delay-2000">
          <p className="text-white/70 text-lg mb-2">
            🎉 Another epic match in the books! 🎉
          </p>
          <p className="text-green-400 text-sm">
            Share your victory on social media and challenge your friends!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Results;
