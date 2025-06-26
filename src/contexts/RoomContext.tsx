
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Player {
  id: string;
  name: string;
  points: number;
  isConnected: boolean;
}

export interface GameRoom {
  id: string;
  name: string;
  players: Player[];
  maxPlayers: number;
  currentRound: number;
  totalRounds: number;
  gameState: 'waiting' | 'playing' | 'voting' | 'results' | 'finished';
  promptCard: string;
  submittedCards: Array<{
    id: string;
    playerId: string;
    text: string;
    votes: Array<{ playerId: string; score: number }>;
  }>;
  chatMessages: Array<{
    id: string;
    playerId: string;
    playerName: string;
    message: string;
    timestamp: string;
  }>;
  timeLeft: number;
}

interface RoomContextType {
  rooms: Record<string, GameRoom>;
  currentRoom: GameRoom | null;
  createRoom: (name: string, playerName: string) => string;
  joinRoom: (roomId: string, playerName: string) => boolean;
  leaveRoom: (roomId: string, playerId: string) => void;
  updateRoom: (roomId: string, updates: Partial<GameRoom>) => void;
  getRoom: (roomId: string) => GameRoom | null;
}

const RoomContext = createContext<RoomContextType | null>(null);

export const useRoom = () => {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error('useRoom must be used within a RoomProvider');
  }
  return context;
};

export const RoomProvider = ({ children }: { children: ReactNode }) => {
  const [rooms, setRooms] = useState<Record<string, GameRoom>>({});
  const [currentRoom, setCurrentRoom] = useState<GameRoom | null>(null);

  // Load rooms from localStorage on mount
  useEffect(() => {
    const savedRooms = localStorage.getItem('gameRooms');
    if (savedRooms) {
      setRooms(JSON.parse(savedRooms));
    }
  }, []);

  // Save rooms to localStorage whenever rooms change
  useEffect(() => {
    localStorage.setItem('gameRooms', JSON.stringify(rooms));
  }, [rooms]);

  const generateRoomId = () => {
    return Math.random().toString(36).substr(2, 9);
  };

  const createRoom = (name: string, playerName: string): string => {
    const roomId = generateRoomId();
    const playerId = Math.random().toString(36).substr(2, 9);
    
    const newRoom: GameRoom = {
      id: roomId,
      name,
      players: [{
        id: playerId,
        name: playerName,
        points: 0,
        isConnected: true,
      }],
      maxPlayers: 8,
      currentRound: 1,
      totalRounds: 5,
      gameState: 'waiting',
      promptCard: '',
      submittedCards: [],
      chatMessages: [],
      timeLeft: 30,
    };

    setRooms(prev => ({ ...prev, [roomId]: newRoom }));
    setCurrentRoom(newRoom);
    
    // Store current player ID in localStorage for this room
    localStorage.setItem(`player_${roomId}`, playerId);
    
    return roomId;
  };

  const joinRoom = (roomId: string, playerName: string): boolean => {
    const room = rooms[roomId];
    if (!room || room.players.length >= room.maxPlayers) {
      return false;
    }

    const playerId = Math.random().toString(36).substr(2, 9);
    const updatedRoom = {
      ...room,
      players: [...room.players, {
        id: playerId,
        name: playerName,
        points: 0,
        isConnected: true,
      }],
    };

    setRooms(prev => ({ ...prev, [roomId]: updatedRoom }));
    setCurrentRoom(updatedRoom);
    
    // Store current player ID in localStorage for this room
    localStorage.setItem(`player_${roomId}`, playerId);
    
    return true;
  };

  const leaveRoom = (roomId: string, playerId: string) => {
    const room = rooms[roomId];
    if (!room) return;

    const updatedRoom = {
      ...room,
      players: room.players.filter(p => p.id !== playerId),
    };

    if (updatedRoom.players.length === 0) {
      // Remove empty room
      setRooms(prev => {
        const newRooms = { ...prev };
        delete newRooms[roomId];
        return newRooms;
      });
    } else {
      setRooms(prev => ({ ...prev, [roomId]: updatedRoom }));
    }

    // Remove player ID from localStorage
    localStorage.removeItem(`player_${roomId}`);
    setCurrentRoom(null);
  };

  const updateRoom = (roomId: string, updates: Partial<GameRoom>) => {
    const room = rooms[roomId];
    if (!room) return;

    const updatedRoom = { ...room, ...updates };
    setRooms(prev => ({ ...prev, [roomId]: updatedRoom }));
    
    if (currentRoom?.id === roomId) {
      setCurrentRoom(updatedRoom);
    }
  };

  const getRoom = (roomId: string): GameRoom | null => {
    return rooms[roomId] || null;
  };

  return (
    <RoomContext.Provider value={{
      rooms,
      currentRoom,
      createRoom,
      joinRoom,
      leaveRoom,
      updateRoom,
      getRoom,
    }}>
      {children}
    </RoomContext.Provider>
  );
};
