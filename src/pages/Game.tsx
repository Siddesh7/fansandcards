
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Trophy, Clock, Users, MessageSquare, Football } from 'lucide-react';

const Game = () => {
  const [gameState, setGameState] = useState('playing'); // 'playing', 'judging', 'results'
  const [selectedCard, setSelectedCard] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [currentRound, setCurrentRound] = useState(1);
  const [isJudge, setIsJudge] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  
  const [promptCard] = useState({
    text: "The worst transfer signing was ___",
    type: "prompt"
  });
  
  const [playerHand] = useState([
    { id: 1, text: "A drunk ultra with a megaphone", type: "answer" },
    { id: 2, text: "Neymar's diving masterclass", type: "answer" },
    { id: 3, text: "Messi's tax returns", type: "answer" },
    { id: 4, text: "VAR officials watching Netflix", type: "answer" },
    { id: 5, text: "Ronaldo's hair gel budget", type: "answer" },
    { id: 6, text: "A referee's WhatsApp group", type: "answer" },
    { id: 7, text: "Mourinho's parking instructions", type: "answer" },
  ]);
  
  const [actionCard] = useState({
    id: 8, 
    text: "Fan Frenzy: Double points this round!", 
    type: "action"
  });
  
  const [submittedCards] = useState([
    { id: 1, text: "A drunk ultra with a megaphone", votes: 0 },
    { id: 2, text: "Neymar's diving masterclass", votes: 0 },
    { id: 3, text: "Mourinho's parking instructions", votes: 0 },
    { id: 4, text: "VAR officials watching Netflix", votes: 0 },
  ]);
  
  const [players] = useState([
    { id: 1, name: "CRFan007", points: 3, isJudge: false },
    { id: 2, name: "MessiGoat", points: 2, isJudge: true },
    { id: 3, name: "You", points: 1, isJudge: false },
    { id: 4, name: "PepGuard", points: 2, isJudge: false },
  ]);
  
  const [chatMessages, setChatMessages] = useState([
    { id: 1, player: "CRFan007", message: "That card's trash! 😂", timestamp: "now" },
    { id: 2, player: "MessiGoat", message: "Easy points right here! 🔥", timestamp: "now" },
  ]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0 && !hasSubmitted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, hasSubmitted]);

  const selectCard = (card) => {
    if (!hasSubmitted) {
      setSelectedCard(card);
    }
  };

  const submitCard = () => {
    if (selectedCard && !hasSubmitted) {
      setHasSubmitted(true);
      setTimeLeft(0);
      // Simulate card flip animation
      setTimeout(() => {
        setGameState('judging');
      }, 1000);
    }
  };

  const judgeCard = (card) => {
    if (isJudge) {
      // Simulate confetti animation
      setGameState('results');
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const message = {
        id: Date.now(),
        player: "You",
        message: newMessage,
        timestamp: "now"
      };
      setChatMessages(prev => [...prev, message]);
      setNewMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-900 via-green-800 to-navy-900 relative">
      {/* Stadium Background */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1493962853295-0fd70327578a')] bg-cover bg-center opacity-10"></div>
      
      {/* Floodlight Effects */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-4">
        {/* Game Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
          <div className="flex items-center gap-4">
            <Badge className="bg-red-600 text-white px-4 py-2 text-lg">
              ROUND {currentRound}/5
            </Badge>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-400" />
              <span className="text-white font-bold">{timeLeft}s</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Football className="w-5 h-5 text-green-400 animate-spin" />
            <span className="text-green-400 font-bold">FAN ZONE ACTIVE</span>
          </div>
        </div>

        {/* Timer Progress Bar */}
        <div className="mb-6">
          <Progress 
            value={(timeLeft / 30) * 100} 
            className="h-3 bg-gray-800"
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Main Game Area */}
          <div className="xl:col-span-3 space-y-6">
            {/* Prompt Card */}
            <div className="text-center">
              <Card className="bg-black border-red-400 border-4 p-8 max-w-2xl mx-auto animate-fade-in">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Football className="w-6 h-6 text-red-400" />
                  <span className="text-red-400 font-bold">PROMPT CARD</span>
                  <Football className="w-6 h-6 text-red-400" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white text-center">
                  {promptCard.text}
                </h2>
              </Card>
            </div>

            {/* Game State Content */}
            {gameState === 'playing' && (
              <div className="space-y-6">
                {/* Player's Hand */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-green-400" />
                    Your Cards
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {playerHand.map((card, index) => (
                      <Card
                        key={card.id}
                        className={`bg-white border-green-400 border-2 p-4 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg animate-fade-in ${
                          selectedCard?.id === card.id ? 'border-yellow-400 bg-yellow-50 scale-105' : ''
                        }`}
                        style={{ animationDelay: `${index * 100}ms` }}
                        onClick={() => selectCard(card)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <Badge className="bg-green-600 text-white">ANSWER</Badge>
                          <Football className="w-4 h-4 text-green-600" />
                        </div>
                        <p className="text-black font-semibold text-sm md:text-base">
                          {card.text}
                        </p>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Action Card */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-400 animate-pulse" />
                    Action Card
                  </h3>
                  <Card className="bg-gradient-to-r from-yellow-400 to-yellow-600 border-yellow-400 border-4 p-4 max-w-md cursor-pointer hover:scale-105 transition-all duration-300 animate-pulse">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className="bg-black text-yellow-400">ACTION</Badge>
                      <Trophy className="w-4 h-4 text-black" />
                    </div>
                    <p className="text-black font-bold">
                      {actionCard.text}
                    </p>
                  </Card>
                </div>

                {/* Submit Button */}
                <div className="text-center">
                  <Button 
                    onClick={submitCard}
                    disabled={!selectedCard || hasSubmitted}
                    className={`px-8 py-4 text-lg font-bold transition-all duration-300 ${
                      hasSubmitted 
                        ? 'bg-gray-600 cursor-not-allowed' 
                        : 'bg-red-600 hover:bg-red-700 animate-pulse hover:scale-105'
                    }`}
                  >
                    {hasSubmitted ? '✅ SUBMITTED!' : '🚀 SUBMIT CARD'}
                  </Button>
                </div>
              </div>
            )}

            {gameState === 'judging' && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white mb-4 flex items-center justify-center gap-2">
                    <Trophy className="w-6 h-6 text-yellow-400 animate-bounce" />
                    JUDGING TIME!
                    <Trophy className="w-6 h-6 text-yellow-400 animate-bounce" />
                  </h3>
                  <p className="text-green-400 text-lg">MessiGoat is picking the funniest combo!</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {submittedCards.map((card, index) => (
                    <Card
                      key={card.id}
                      className="bg-white border-green-400 border-2 p-6 cursor-pointer hover:scale-105 transition-all duration-300 animate-slide-in-right"
                      style={{ animationDelay: `${index * 200}ms` }}
                      onClick={() => judgeCard(card)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <Badge className="bg-green-600 text-white">SUBMISSION</Badge>
                        <Football className="w-4 h-4 text-green-600" />
                      </div>
                      <p className="text-black font-semibold text-lg">
                        {card.text}
                      </p>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Scoreboard */}
            <Card className="bg-black/30 border-yellow-400 backdrop-blur-sm">
              <div className="p-4 border-b border-yellow-400">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  Scoreboard
                </h3>
              </div>
              <div className="p-4 space-y-3">
                {players.map((player, index) => (
                  <div key={player.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                        player.isJudge ? 'bg-yellow-600' : 'bg-red-600'
                      }`}>
                        {player.name[0]}
                      </div>
                      <span className={`font-semibold ${player.isJudge ? 'text-yellow-400' : 'text-white'}`}>
                        {player.name}
                        {player.isJudge && ' 👨‍⚖️'}
                      </span>
                    </div>
                    <Badge className="bg-green-600 text-white">
                      {player.points} pts
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>

            {/* Chat */}
            <Card className="bg-black/30 border-green-400 backdrop-blur-sm">
              <div className="p-4 border-b border-green-400">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-green-400" />
                  Live Banter
                </h3>
              </div>
              
              <ScrollArea className="h-48 p-4">
                <div className="space-y-3">
                  {chatMessages.map((msg, index) => (
                    <div 
                      key={msg.id} 
                      className="animate-fade-in"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-start gap-2">
                        <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                          {msg.player[0]}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-green-400 text-sm">{msg.player}</span>
                            <span className="text-xs text-gray-400">{msg.timestamp}</span>
                          </div>
                          <p className="text-white/90 text-sm">{msg.message}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              
              <form onSubmit={sendMessage} className="p-4 border-t border-green-400">
                <div className="flex gap-2">
                  <Input 
                    placeholder="Roast away... ⚽🔥"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="bg-black/50 border-green-400 text-white placeholder-gray-400 text-sm"
                  />
                  <Button type="submit" size="sm" className="bg-red-600 hover:bg-red-700">
                    Send
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game;
