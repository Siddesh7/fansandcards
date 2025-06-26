
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Users, Trophy, Football, Plus, MessageSquare } from 'lucide-react';

const Lobby = () => {
  const [lobbies, setLobbies] = useState([
    { id: 1, name: "PSG Fan Zone", players: 4, maxPlayers: 8, isPrivate: false, theme: "Football" },
    { id: 2, name: "Messi Maniacs", players: 6, maxPlayers: 8, isPrivate: false, theme: "Football" },
    { id: 3, name: "Real Madrid Roasters", players: 3, maxPlayers: 6, isPrivate: true, theme: "Football" },
  ]);
  
  const [chatMessages, setChatMessages] = useState([
    { id: 1, player: "CRFan007", message: "Ready to roast some Barca fans! 🔥", timestamp: "2m ago" },
    { id: 2, player: "MessiGoat", message: "Bring it on! 🐐⚽", timestamp: "1m ago" },
  ]);
  
  const [currentLobby, setCurrentLobby] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [showCreateLobby, setShowCreateLobby] = useState(false);
  const [newLobbyName, setNewLobbyName] = useState("");

  const joinLobby = (lobby) => {
    setCurrentLobby(lobby);
    // Simulate joining animation
    setTimeout(() => {
      setLobbies(prev => prev.map(l => 
        l.id === lobby.id ? { ...l, players: l.players + 1 } : l
      ));
    }, 500);
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
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1466721591366-2d5fba72006d')] bg-cover bg-center opacity-15"></div>
      
      {/* Animated Stadium Lights */}
      <div className="absolute top-0 left-1/4 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-20 right-1/4 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">FAN ZONE LOBBIES</h1>
          <p className="text-green-300 text-lg flex items-center justify-center gap-2">
            <Football className="w-5 h-5 animate-spin" />
            Find your crew and start roasting!
            <Football className="w-5 h-5 animate-spin" />
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lobbies List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Users className="w-6 h-6 text-green-400" />
                Open Lobbies
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
              <Card className="bg-black/30 border-green-400 p-6 backdrop-blur-sm animate-slide-in-right">
                <h3 className="text-xl font-bold text-white mb-4">Create New Lobby</h3>
                <div className="space-y-4">
                  <Input 
                    placeholder="Lobby Name (e.g., 'Arsenal Army')"
                    value={newLobbyName}
                    onChange={(e) => setNewLobbyName(e.target.value)}
                    className="bg-black/50 border-green-400 text-white placeholder-gray-400"
                  />
                  <div className="flex gap-2">
                    <Button className="bg-green-600 hover:bg-green-700 flex-1">
                      🌍 PUBLIC
                    </Button>
                    <Button variant="outline" className="border-yellow-400 text-yellow-400 flex-1">
                      🔒 PRIVATE
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Lobby Cards */}
            <div className="space-y-3">
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
                        <span className="text-yellow-400">💰 0.1 $CHZ entry</span>
                      </div>
                    </div>
                    <Button 
                      onClick={() => joinLobby(lobby)}
                      disabled={lobby.players >= lobby.maxPlayers}
                      className={`ml-4 font-bold ${
                        lobby.players >= lobby.maxPlayers 
                          ? 'bg-gray-600 cursor-not-allowed' 
                          : 'bg-red-600 hover:bg-red-700 animate-pulse'
                      }`}
                    >
                      {lobby.players >= lobby.maxPlayers ? 'FULL' : 'JOIN'}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Chat & Current Lobby */}
          <div className="space-y-4">
            {/* Theme Voting */}
            <Card className="bg-black/30 border-green-400 p-4 backdrop-blur-sm">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                Vote Theme
              </h3>
              <div className="space-y-2">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold">
                  ⚽ FOOTBALL (Active)
                </Button>
                <Button variant="outline" className="w-full border-gray-600 text-gray-400" disabled>
                  🏀 Basketball (Coming Soon)
                </Button>
                <Button variant="outline" className="w-full border-gray-600 text-gray-400" disabled>
                  🏈 American Football (Coming Soon)
                </Button>
              </div>
            </Card>

            {/* Chat */}
            <Card className="bg-black/30 border-green-400 backdrop-blur-sm">
              <div className="p-4 border-b border-green-400">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-green-400" />
                  Fan Banter
                </h3>
              </div>
              
              <ScrollArea className="h-64 p-4">
                <div className="space-y-3">
                  {chatMessages.map((msg, index) => (
                    <div 
                      key={msg.id} 
                      className="animate-fade-in"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-start gap-2">
                        <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {msg.player[0]}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-green-400">{msg.player}</span>
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
                    placeholder="Type your message... ⚽🔥🏆"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="bg-black/50 border-green-400 text-white placeholder-gray-400"
                  />
                  <Button type="submit" className="bg-red-600 hover:bg-red-700">
                    Send
                  </Button>
                </div>
              </form>
            </Card>

            {/* Start Game */}
            {currentLobby && (
              <Button 
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-black font-bold text-lg py-4 animate-pulse"
                disabled={currentLobby.players < 3}
              >
                {currentLobby.players < 3 ? '⏳ WAITING FOR PLAYERS' : '🚀 START GAME!'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lobby;
