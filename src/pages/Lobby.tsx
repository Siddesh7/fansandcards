
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Users, Trophy, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePrivy } from '@privy-io/react-auth';
import PaymentHandler from '@/components/PaymentHandler';

const Lobby = () => {
  const navigate = useNavigate();
  const { authenticated } = usePrivy();
  
  const [lobbies, setLobbies] = useState([]);
  const [currentLobby, setCurrentLobby] = useState(null);
  const [showCreateLobby, setShowCreateLobby] = useState(false);
  const [newLobbyName, setNewLobbyName] = useState("");

  const handleJoinLobby = (lobby) => {
    setCurrentLobby(lobby);
    setLobbies(prev => prev.map(l => 
      l.id === lobby.id ? { ...l, players: l.players + 1 } : l
    ));
  };

  const handleStartGame = () => {
    navigate('/game');
  };

  const handleCreateLobby = () => {
    if (newLobbyName.trim()) {
      const newLobby = {
        id: Date.now(),
        name: newLobbyName,
        players: 1,
        maxPlayers: 8,
        isPrivate: false,
        theme: "Football"
      };
      setLobbies(prev => [...prev, newLobby]);
      setNewLobbyName("");
      setShowCreateLobby(false);
      setCurrentLobby(newLobby);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-900 via-green-800 to-navy-900 relative">
      {/* Stadium Background */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1466721591366-2d5fba72006d')] bg-cover bg-center opacity-15"></div>
      
      {/* Animated Stadium Lights */}
      <div className="absolute top-0 left-1/4 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-20 right-1/4 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">FAN ZONE LOBBIES</h1>
          <p className="text-green-300 text-lg flex items-center justify-center gap-2">
            <Trophy className="w-5 h-5 animate-spin" />
            Find your crew and start roasting!
            <Trophy className="w-5 h-5 animate-spin" />
          </p>
          {!authenticated && (
            <p className="text-yellow-400 mt-2">⚠️ Connect your wallet to join games</p>
          )}
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Create Lobby Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Users className="w-6 h-6 text-green-400" />
                Game Lobbies
              </h2>
              <Button 
                onClick={() => setShowCreateLobby(!showCreateLobby)}
                className="bg-red-600 hover:bg-red-700 text-white font-bold"
              >
                <Plus className="w-4 h-4 mr-2" />
                CREATE LOBBY
              </Button>
            </div>

            {/* Create Lobby Form */}
            {showCreateLobby && (
              <Card className="bg-black/30 border-green-400 p-6 backdrop-blur-sm animate-slide-in-right mb-6">
                <h3 className="text-xl font-bold text-white mb-4">Create New Lobby</h3>
                <div className="space-y-4">
                  <Input 
                    placeholder="Lobby Name (e.g., 'Arsenal Army')"
                    value={newLobbyName}
                    onChange={(e) => setNewLobbyName(e.target.value)}
                    className="bg-black/50 border-green-400 text-white placeholder-gray-400"
                  />
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleCreateLobby}
                      className="bg-green-600 hover:bg-green-700 flex-1"
                      disabled={!newLobbyName.trim()}
                    >
                      🌍 CREATE PUBLIC LOBBY
                    </Button>
                    <Button 
                      onClick={() => setShowCreateLobby(false)}
                      variant="outline" 
                      className="border-gray-600 text-gray-400 flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Lobbies List */}
          {lobbies.length === 0 ? (
            <Card className="bg-black/30 border-green-400 p-8 backdrop-blur-sm text-center">
              <h3 className="text-xl font-bold text-white mb-2">No Active Lobbies</h3>
              <p className="text-green-300 mb-4">Be the first to create a lobby and start the fun!</p>
              <Button 
                onClick={() => setShowCreateLobby(true)}
                className="bg-red-600 hover:bg-red-700 text-white font-bold"
              >
                <Plus className="w-4 h-4 mr-2" />
                CREATE FIRST LOBBY
              </Button>
            </Card>
          ) : (
            <div className="space-y-3 mb-8">
              {lobbies.map((lobby, index) => (
                <Card 
                  key={lobby.id} 
                  className={`bg-black/30 border-green-400 p-4 backdrop-blur-sm transition-all duration-300 hover:scale-105 animate-slide-in-right ${
                    currentLobby?.id === lobby.id ? 'border-yellow-400 bg-yellow-400/10' : ''
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold text-white">{lobby.name}</h3>
                        {lobby.isPrivate && <Badge variant="outline" className="border-yellow-400 text-yellow-400">🔒 PRIVATE</Badge>}
                        <Badge className="bg-green-600 text-white">⚽ {lobby.theme}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-green-400 flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {lobby.players}/{lobby.maxPlayers} players
                        </span>
                        <span className="text-yellow-400">💰 0.1 CHZ entry</span>
                      </div>
                    </div>
                    {lobby.players >= lobby.maxPlayers ? (
                      <Button disabled className="ml-4 font-bold bg-gray-600 cursor-not-allowed">
                        FULL
                      </Button>
                    ) : (
                      <PaymentHandler onSuccess={() => handleJoinLobby(lobby)} disabled={!authenticated}>
                        PAY & JOIN
                      </PaymentHandler>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Start Game Button */}
          {currentLobby && (
            <div className="text-center">
              <Card className="bg-black/30 border-yellow-400 p-6 backdrop-blur-sm mb-4">
                <h3 className="text-xl font-bold text-white mb-2">Current Lobby: {currentLobby.name}</h3>
                <p className="text-green-300 mb-4">
                  {currentLobby.players}/{currentLobby.maxPlayers} players joined
                </p>
                <PaymentHandler 
                  onSuccess={handleStartGame} 
                  disabled={currentLobby.players < 2}
                >
                  {currentLobby.players < 2 ? '⏳ WAITING FOR MORE PLAYERS' : '🚀 PAY & START GAME!'}
                </PaymentHandler>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Lobby;
