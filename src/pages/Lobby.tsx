
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Users, Trophy, Plus, Copy, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePrivy } from '@privy-io/react-auth';
import { useToast } from '@/hooks/use-toast';
import PaymentHandler from '@/components/PaymentHandler';
import { useRoom } from '@/contexts/RoomContext';

const Lobby = () => {
  const navigate = useNavigate();
  const { authenticated, user } = usePrivy();
  const { toast } = useToast();
  const { rooms, loading, error, createRoom, joinRoom, loadRooms } = useRoom();
  
  const [showCreateLobby, setShowCreateLobby] = useState(false);
  const [newLobbyName, setNewLobbyName] = useState("");
  const [playerName, setPlayerName] = useState(
    user?.email?.address ? user.email.address.split('@')[0] : 'Player'
  );
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);

  const roomList = Object.values(rooms);

  // Refresh rooms every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      loadRooms();
    }, 10000);

    return () => clearInterval(interval);
  }, [loadRooms]);

  const handleCreateLobby = async () => {
    if (!authenticated) {
      toast({
        title: "Authentication Required",
        description: "Please connect your wallet to create a room.",
        variant: "destructive",
      });
      return;
    }

    if (newLobbyName.trim() && playerName.trim()) {
      setIsCreatingRoom(true);
      try {
        const roomId = await createRoom(newLobbyName, playerName);
        setNewLobbyName("");
        setShowCreateLobby(false);
        toast({
          title: "Room Created! 🎉",
          description: "Your room is ready. Inviting players...",
        });
        navigate(`/game/${roomId}`);
      } catch (error) {
        toast({
          title: "Failed to Create Room",
          description: "Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsCreatingRoom(false);
      }
    }
  };

  const handleJoinLobby = async (roomId: string) => {
    console.log('Attempting to join room:', roomId, 'with player:', playerName);
    
    if (!authenticated) {
      toast({
        title: "Authentication Required",
        description: "Please connect your wallet first.",
        variant: "destructive",
      });
      return;
    }

    if (!playerName.trim()) {
      toast({
        title: "Player Name Required",
        description: "Please enter your player name.",
        variant: "destructive",
      });
      return;
    }

    try {
      const success = await joinRoom(roomId, playerName);
      if (success) {
        toast({
          title: "Joined Room! 🎮",
          description: "Welcome to the game!",
        });
        navigate(`/game/${roomId}`);
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
  };

  const copyRoomLink = (roomId: string) => {
    const link = `${window.location.origin}/game/${roomId}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Link Copied! 📋",
      description: "Share this link with friends to join the game.",
    });
  };

  if (loading && roomList.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-900 via-green-800 to-navy-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-white mx-auto mb-4" />
          <p className="text-white">Loading rooms...</p>
        </div>
      </div>
    );
  }

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
            <div className="mt-4 p-4 bg-yellow-900/30 border border-yellow-400 rounded-lg">
              <p className="text-yellow-400 font-bold">⚠️ Connect your wallet to create or join games</p>
              <p className="text-yellow-300 text-sm mt-1">Authentication required for all game activities</p>
            </div>
          )}
          {error && (
            <div className="mt-4 p-4 bg-red-900/30 border border-red-400 rounded-lg">
              <p className="text-red-400 font-bold">Error: {error}</p>
              <Button 
                onClick={loadRooms}
                variant="outline"
                size="sm"
                className="mt-2 border-red-400 text-red-400"
              >
                Retry
              </Button>
            </div>
          )}
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Player Name Input */}
          <div className="mb-6">
            <Card className="bg-black/30 border-green-400 p-4 backdrop-blur-sm">
              <div className="flex gap-4 items-center">
                <label htmlFor="playerName" className="text-white font-bold">Your Name:</label>
                <Input 
                  id="playerName"
                  placeholder="Enter your name"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="bg-black/50 border-green-400 text-white placeholder-gray-400 max-w-xs"
                  disabled={!authenticated}
                />
                {!authenticated && (
                  <span className="text-yellow-400 text-sm">Connect wallet first</span>
                )}
              </div>
            </Card>
          </div>

          {/* Create Lobby Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Users className="w-6 h-6 text-green-400" />
                Game Rooms
                {loading && <Loader2 className="w-4 h-4 animate-spin text-green-400" />}
              </h2>
              <Button 
                onClick={() => setShowCreateLobby(!showCreateLobby)}
                className="bg-red-600 hover:bg-red-700 text-white font-bold"
                disabled={!authenticated || isCreatingRoom}
              >
                {isCreatingRoom ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    CREATE ROOM
                  </>
                )}
              </Button>
            </div>

            {/* Create Lobby Form */}
            {showCreateLobby && (
              <Card className="bg-black/30 border-green-400 p-6 backdrop-blur-sm animate-slide-in-right mb-6">
                <h3 className="text-xl font-bold text-white mb-4">Create New Room</h3>
                <div className="space-y-4">
                  <Input 
                    placeholder="Room Name (e.g., 'Arsenal Army')"
                    value={newLobbyName}
                    onChange={(e) => setNewLobbyName(e.target.value)}
                    className="bg-black/50 border-green-400 text-white placeholder-gray-400"
                    disabled={!authenticated || isCreatingRoom}
                  />
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleCreateLobby}
                      className="bg-green-600 hover:bg-green-700 flex-1"
                      disabled={!authenticated || !newLobbyName.trim() || !playerName.trim() || isCreatingRoom}
                    >
                      {isCreatingRoom ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        '🌍 CREATE ROOM'
                      )}
                    </Button>
                    <Button 
                      onClick={() => setShowCreateLobby(false)}
                      variant="outline" 
                      className="border-gray-600 text-gray-400 flex-1"
                      disabled={isCreatingRoom}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Rooms List */}
          {roomList.length === 0 ? (
            <Card className="bg-black/30 border-green-400 p-8 backdrop-blur-sm text-center">
              <h3 className="text-xl font-bold text-white mb-2">No Active Rooms</h3>
              <p className="text-green-300 mb-4">Be the first to create a room and start the fun!</p>
              <Button 
                onClick={() => setShowCreateLobby(true)}
                className="bg-red-600 hover:bg-red-700 text-white font-bold"
                disabled={!authenticated}
              >
                <Plus className="w-4 h-4 mr-2" />
                CREATE FIRST ROOM
              </Button>
            </Card>
          ) : (
            <div className="space-y-3 mb-8">
              {roomList.map((room, index) => (
                <Card 
                  key={room.id} 
                  className="bg-black/30 border-green-400 p-4 backdrop-blur-sm transition-all duration-300 hover:scale-105 animate-slide-in-right"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold text-white">{room.name}</h3>
                        <Badge className="bg-green-600 text-white">⚽ Football</Badge>
                        <Badge 
                          className={`${
                            room.gameState === 'waiting' ? 'bg-yellow-600' : 'bg-red-600'
                          } text-white`}
                        >
                          {room.gameState === 'waiting' ? '⏳ WAITING' : '🎮 PLAYING'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-green-400 flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {room.players.length}/{room.maxPlayers} players
                        </span>
                        <span className="text-yellow-400">💰 0.1 CHZ entry</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        onClick={() => copyRoomLink(room.id)}
                        variant="outline"
                        size="sm"
                        className="border-green-400 text-green-400"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      
                      {room.players.length >= room.maxPlayers ? (
                        <Button disabled className="font-bold bg-gray-600 cursor-not-allowed">
                          FULL
                        </Button>
                      ) : (
                        <PaymentHandler 
                          onSuccess={() => handleJoinLobby(room.id)} 
                          disabled={!authenticated || !playerName.trim()}
                        >
                          PAY & JOIN
                        </PaymentHandler>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Lobby;
