import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Trophy, Clock, Users, MessageSquare, Star, Copy, Loader2 } from 'lucide-react';
import { useRoom } from '@/contexts/RoomContext';
import { useToast } from '@/hooks/use-toast';
import { usePrivy } from '@privy-io/react-auth';
import PaymentHandler from '@/components/PaymentHandler';

const Game = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { authenticated } = usePrivy();
  const { getRoom, updateRoom, joinRoom, isCreator } = useRoom();
  
  const [room, setRoom] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentPlayerId, setCurrentPlayerId] = useState<string>('');
  const [selectedCard, setSelectedCard] = useState<string>('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [votingScores, setVotingScores] = useState<Record<string, number>>({});
  const [needsPayment, setNeedsPayment] = useState(false);

  // Sample cards for demo
  const playerHand = [
    "A drunk ultra with a megaphone",
    "Neymar's diving masterclass", 
    "Messi's tax returns",
    "VAR officials watching Netflix",
    "Ronaldo's hair gel budget",
    "A referee's WhatsApp group",
    "Mourinho's parking instructions"
  ];

  const promptCards = [
    "The worst transfer signing was ___",
    "What really caused that red card: ___",
    "The secret to Pep's success: ___",
    "What players do during VAR checks: ___",
    "The real reason for that penalty: ___"
  ];

  useEffect(() => {
    if (!roomId) {
      navigate('/lobby');
      return;
    }

    loadRoom();
  }, [roomId, navigate]);

  const loadRoom = async () => {
    if (!roomId) return;
    
    setLoading(true);
    try {
      const currentRoom = await getRoom(roomId);
      if (!currentRoom) {
        toast({
          title: "Room Not Found",
          description: "This room doesn't exist or has been deleted.",
          variant: "destructive",
        });
        navigate('/lobby');
        return;
      }

      setRoom(currentRoom);
      
      // Get current player ID from localStorage
      const playerId = localStorage.getItem(`player_${roomId}`);
      if (playerId) {
        setCurrentPlayerId(playerId);
        // Check if player is already in the room
        const playerInRoom = currentRoom.players.find(p => p.id === playerId);
        if (playerInRoom) {
          setNeedsPayment(false);
        } else {
          setNeedsPayment(true);
        }
      } else {
        setNeedsPayment(true);
        setPlayerName('Guest_' + Math.random().toString(36).substr(2, 4));
      }
    } catch (error) {
      console.error('Failed to load room:', error);
      toast({
        title: "Failed to Load Room",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!room?.promptCard && room?.gameState === 'playing') {
      // Set initial prompt card for the round
      const promptCard = promptCards[room.currentRound - 1] || promptCards[0];
      updateRoom(roomId!, { promptCard });
    }
  }, [room, roomId, updateRoom]);

  // Timer countdown
  useEffect(() => {
    if (room?.timeLeft > 0 && room?.gameState === 'playing' && !hasSubmitted) {
      const timer = setTimeout(() => {
        updateRoom(roomId!, { timeLeft: room.timeLeft - 1 });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [room?.timeLeft, room?.gameState, hasSubmitted, roomId, updateRoom]);

  const handleJoinRoom = async () => {
    if (playerName.trim() && roomId) {
      try {
        const success = await joinRoom(roomId, playerName);
        if (success) {
          const newPlayerId = localStorage.getItem(`player_${roomId}`);
          setCurrentPlayerId(newPlayerId!);
          setNeedsPayment(false);
          await loadRoom();
        } else {
          toast({
            title: "Cannot Join Room",
            description: "Room is full or doesn't exist.",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Failed to Join Room",
          description: "Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const startGame = () => {
    if (room && room.players.length >= 2 && isCreator(roomId!, currentPlayerId)) {
      updateRoom(roomId!, { 
        gameState: 'playing',
        timeLeft: 30,
        promptCard: promptCards[0]
      });
    }
  };

  const submitCard = () => {
    if (selectedCard && !hasSubmitted && room) {
      const newSubmission = {
        id: Date.now().toString(),
        playerId: currentPlayerId,
        text: selectedCard,
        votes: []
      };

      const updatedSubmissions = [...room.submittedCards, newSubmission];
      updateRoom(roomId!, { submittedCards: updatedSubmissions });
      setHasSubmitted(true);

      // Check if all players have submitted
      if (updatedSubmissions.length === room.players.length) {
        updateRoom(roomId!, { gameState: 'voting', timeLeft: 45 });
      }
    }
  };

  const submitVote = (cardId: string, score: number) => {
    if (!room || !currentPlayerId) return;

    const updatedSubmissions = room.submittedCards.map(card => {
      if (card.id === cardId) {
        const existingVoteIndex = card.votes.findIndex(v => v.playerId === currentPlayerId);
        const newVotes = [...card.votes];
        
        if (existingVoteIndex >= 0) {
          newVotes[existingVoteIndex] = { playerId: currentPlayerId, score };
        } else {
          newVotes.push({ playerId: currentPlayerId, score });
        }
        
        return { ...card, votes: newVotes };
      }
      return card;
    });

    updateRoom(roomId!, { submittedCards: updatedSubmissions });
    setVotingScores(prev => ({ ...prev, [cardId]: score }));
  };

  const finishVoting = () => {
    if (!room) return;

    // Calculate scores and update player points
    const updatedPlayers = room.players.map(player => {
      const playerCard = room.submittedCards.find(card => card.playerId === player.id);
      if (playerCard) {
        const totalScore = playerCard.votes.reduce((sum, vote) => sum + vote.score, 0);
        const averageScore = playerCard.votes.length > 0 ? totalScore / playerCard.votes.length : 0;
        return { ...player, points: player.points + Math.round(averageScore) };
      }
      return player;
    });

    updateRoom(roomId!, { 
      players: updatedPlayers,
      gameState: 'results',
      timeLeft: 10
    });

    setTimeout(() => {
      if (room.currentRound >= room.totalRounds) {
        updateRoom(roomId!, { gameState: 'finished' });
      } else {
        // Next round
        updateRoom(roomId!, {
          currentRound: room.currentRound + 1,
          gameState: 'playing',
          timeLeft: 30,
          submittedCards: [],
          promptCard: promptCards[room.currentRound] || promptCards[0]
        });
        setHasSubmitted(false);
        setSelectedCard('');
        setVotingScores({});
      }
    }, 5000);
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && room && currentPlayerId) {
      const currentPlayer = room.players.find(p => p.id === currentPlayerId);
      const message = {
        id: Date.now().toString(),
        playerId: currentPlayerId,
        playerName: currentPlayer?.name || 'Unknown',
        message: newMessage,
        timestamp: 'now'
      };
      
      updateRoom(roomId!, { 
        chatMessages: [...room.chatMessages, message] 
      });
      setNewMessage("");
    }
  };

  const copyRoomLink = () => {
    const link = `${window.location.origin}/game/${roomId}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Room Link Copied! 📋",
      description: "Share this link with friends to join the game.",
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-900 via-green-800 to-navy-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-white mx-auto mb-4" />
          <p className="text-white">Loading game room...</p>
        </div>
      </div>
    );
  }

  // Direct link access - needs payment first
  if (!room || needsPayment) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-900 via-green-800 to-navy-900 flex items-center justify-center">
        <Card className="bg-black/30 border-green-400 p-8 backdrop-blur-sm max-w-md w-full mx-4">
          <h2 className="text-2xl font-bold text-white mb-4 text-center">Join Game Room</h2>
          {room && (
            <div className="mb-4 text-center">
              <h3 className="text-lg text-green-400 font-bold">{room.name}</h3>
              <p className="text-gray-300">{room.players.length}/{room.maxPlayers} players</p>
            </div>
          )}
          <div className="space-y-4">
            <Input 
              placeholder="Enter your name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="bg-black/50 border-green-400 text-white placeholder-gray-400"
            />
            
            {authenticated ? (
              <PaymentHandler 
                onSuccess={handleJoinRoom}
                disabled={!playerName.trim()}
              >
                PAY 0.1 CHZ & JOIN
              </PaymentHandler>
            ) : (
              <div className="text-center">
                <p className="text-yellow-400 mb-2">Connect your wallet to join</p>
                <Button 
                  onClick={() => navigate('/lobby')}
                  variant="outline"
                  className="w-full border-gray-600 text-gray-400"
                >
                  Back to Lobby
                </Button>
              </div>
            )}
            
            <Button 
              onClick={() => navigate('/lobby')}
              variant="outline"
              className="w-full border-gray-600 text-gray-400"
            >
              Back to Lobby
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-900 via-green-800 to-navy-900 relative">
      {/* Stadium Background */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1493962853295-0fd70327578a')] bg-cover bg-center opacity-10"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-4">
        {/* Game Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
          <div className="flex items-center gap-4">
            <Badge className="bg-red-600 text-white px-4 py-2 text-lg">
              ROUND {room.currentRound}/{room.totalRounds}
            </Badge>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-400" />
              <span className="text-white font-bold">{room.timeLeft}s</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              onClick={copyRoomLink}
              variant="outline"
              size="sm"
              className="border-green-400 text-green-400"
            >
              <Copy className="w-4 h-4 mr-2" />
              Share Room
            </Button>
            <Badge className="bg-green-600 text-white">
              {room.name}
            </Badge>
          </div>
        </div>

        {/* Timer Progress Bar */}
        <div className="mb-6">
          <Progress 
            value={(room.timeLeft / (room.gameState === 'voting' ? 45 : 30)) * 100} 
            className="h-3 bg-gray-800"
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Main Game Area */}
          <div className="xl:col-span-3 space-y-6">
            {/* Game State Content */}
            {room.gameState === 'waiting' && (
              <div className="text-center space-y-6">
                <Card className="bg-black/30 border-yellow-400 p-8 backdrop-blur-sm">
                  <h2 className="text-2xl font-bold text-white mb-4">Waiting for Players</h2>
                  <p className="text-green-300 mb-4">
                    {room.players.length}/{room.maxPlayers} players joined
                  </p>
                  {room.players.length >= 2 && isCreator(roomId!, currentPlayerId) && (
                    <Button 
                      onClick={startGame}
                      className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-4 text-lg"
                    >
                      🚀 START GAME
                    </Button>
                  )}
                  {room.players.length >= 2 && !isCreator(roomId!, currentPlayerId) && (
                    <p className="text-yellow-400 text-lg">Waiting for the room creator to start the game...</p>
                  )}
                  {room.players.length < 2 && (
                    <p className="text-gray-400">Need at least 2 players to start</p>
                  )}
                </Card>
              </div>
            )}

            {room.gameState === 'playing' && (
              <div className="space-y-6">
                {/* Prompt Card */}
                <div className="text-center">
                  <Card className="bg-black border-red-400 border-4 p-8 max-w-2xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-bold text-white text-center">
                      {room.promptCard}
                    </h2>
                  </Card>
                </div>

                {/* Player's Hand */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Your Cards</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {playerHand.map((card, index) => (
                      <Card
                        key={index}
                        className={`bg-white border-green-400 border-2 p-4 cursor-pointer transition-all duration-300 hover:scale-105 ${
                          selectedCard === card ? 'border-yellow-400 bg-yellow-50 scale-105' : ''
                        }`}
                        onClick={() => !hasSubmitted && setSelectedCard(card)}
                      >
                        <p className="text-black font-semibold text-sm md:text-base">
                          {card}
                        </p>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="text-center">
                  <Button 
                    onClick={submitCard}
                    disabled={!selectedCard || hasSubmitted}
                    className={`px-8 py-4 text-lg font-bold ${
                      hasSubmitted 
                        ? 'bg-gray-600 cursor-not-allowed' 
                        : 'bg-red-600 hover:bg-red-700'
                    }`}
                  >
                    {hasSubmitted ? '✅ SUBMITTED!' : '🚀 SUBMIT CARD'}
                  </Button>
                </div>
              </div>
            )}

            {room.gameState === 'voting' && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white mb-4">Vote on the Best Answers!</h3>
                  <p className="text-green-400 text-lg">Rate each answer from 1-5 stars</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {room.submittedCards
                    .filter(card => card.playerId !== currentPlayerId)
                    .map((card) => (
                    <Card
                      key={card.id}
                      className="bg-white border-green-400 border-2 p-6"
                    >
                      <p className="text-black font-semibold text-lg mb-4">
                        {card.text}
                      </p>
                      <div className="flex gap-1 justify-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Button
                            key={star}
                            variant="ghost"
                            size="sm"
                            onClick={() => submitVote(card.id, star)}
                            className={`p-1 ${
                              votingScores[card.id] >= star 
                                ? 'text-yellow-400' 
                                : 'text-gray-400'
                            }`}
                          >
                            <Star className="w-6 h-6 fill-current" />
                          </Button>
                        ))}
                      </div>
                    </Card>
                  ))}
                </div>

                <div className="text-center">
                  <Button 
                    onClick={finishVoting}
                    className="bg-green-600 hover:bg-green-700 px-8 py-4 text-lg font-bold"
                  >
                    ✅ FINISH VOTING
                  </Button>
                </div>
              </div>
            )}

            {room.gameState === 'results' && (
              <div className="text-center">
                <Card className="bg-black/30 border-yellow-400 p-8 backdrop-blur-sm">
                  <h2 className="text-3xl font-bold text-white mb-4">Round Results! 🎉</h2>
                  <div className="space-y-2">
                    {room.players
                      .sort((a, b) => b.points - a.points)
                      .map((player, index) => (
                      <div key={player.id} className="flex justify-between items-center text-white">
                        <span>{index + 1}. {player.name}</span>
                        <span className="font-bold">{player.points} pts</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {room.gameState === 'finished' && (
              <div className="text-center">
                <Card className="bg-black/30 border-yellow-400 p-8 backdrop-blur-sm">
                  <h2 className="text-4xl font-bold text-white mb-6">🏆 GAME OVER! 🏆</h2>
                  <div className="space-y-4">
                    <h3 className="text-2xl text-yellow-400 font-bold">
                      Winner: {room.players.sort((a, b) => b.points - a.points)[0]?.name}
                    </h3>
                    <div className="space-y-2">
                      {room.players
                        .sort((a, b) => b.points - a.points)
                        .map((player, index) => (
                        <div key={player.id} className="flex justify-between items-center text-white text-lg">
                          <span>{index + 1}. {player.name}</span>
                          <span className="font-bold">{player.points} pts</span>
                        </div>
                      ))}
                    </div>
                    <Button 
                      onClick={() => navigate('/lobby')}
                      className="bg-green-600 hover:bg-green-700 mt-6"
                    >
                      Back to Lobby
                    </Button>
                  </div>
                </Card>
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
                  Players ({room.players.length})
                </h3>
              </div>
              <div className="p-4 space-y-3">
                {room.players.map((player) => (
                  <div key={player.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-sm">
                        {player.name[0].toUpperCase()}
                      </div>
                      <span className="font-semibold text-white">
                        {player.name}
                        {player.id === currentPlayerId && ' (You)'}
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
                  Live Chat
                </h3>
              </div>
              
              <ScrollArea className="h-48 p-4">
                <div className="space-y-3">
                  {room.chatMessages.map((msg) => (
                    <div key={msg.id} className="animate-fade-in">
                      <div className="flex items-start gap-2">
                        <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                          {msg.playerName[0].toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-green-400 text-sm">{msg.playerName}</span>
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
                    placeholder="Type a message..."
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
