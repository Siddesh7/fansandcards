import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { roomService } from '@/services/roomService';

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
  createdAt?: string;
  updatedAt?: string;
  creatorId?: string; // Add creator ID to interface
}

interface RoomContextType {
  rooms: Record<string, GameRoom>;
  currentRoom: GameRoom | null;
  loading: boolean;
  error: string | null;
  createRoom: (name: string, playerName: string) => Promise<string>;
  joinRoom: (roomId: string, playerName: string) => Promise<boolean>;
  leaveRoom: (roomId: string, playerId: string) => Promise<void>;
  updateRoom: (roomId: string, updates: Partial<GameRoom>) => Promise<void>;
  getRoom: (roomId: string) => Promise<GameRoom | null>;
  loadRooms: () => Promise<void>;
  isCreator: (roomId: string, playerId: string) => boolean;
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load rooms on mount
  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    setLoading(true);
    setError(null);
    try {
      const roomList = await roomService.getAllRooms();
      const roomsMap = roomList.reduce((acc, room) => {
        acc[room.id] = room;
        return acc;
      }, {} as Record<string, GameRoom>);
      setRooms(roomsMap);
    } catch (err) {
      console.error('Failed to load rooms:', err);
      setError('Failed to load rooms');
    } finally {
      setLoading(false);
    }
  };

  const createRoom = async (name: string, playerName: string): Promise<string> => {
    setLoading(true);
    setError(null);
    try {
      const playerId = Math.random().toString(36).substr(2, 9);
      const roomData = await roomService.createRoom(name, playerName, playerId);
      
      setRooms(prev => ({ ...prev, [roomData.id]: roomData }));
      setCurrentRoom(roomData);
      
      // Store current player ID for this room
      localStorage.setItem(`player_${roomData.id}`, playerId);
      
      return roomData.id;
    } catch (err) {
      console.error('Failed to create room:', err);
      setError('Failed to create room');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const joinRoom = async (roomId: string, playerName: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      // Check if player already exists for this room
      let playerId = localStorage.getItem(`player_${roomId}`);
      if (!playerId) {
        playerId = Math.random().toString(36).substr(2, 9);
      }
      
      const updatedRoom = await roomService.joinRoom(roomId, playerName, playerId);
      
      if (updatedRoom) {
        setRooms(prev => ({ ...prev, [roomId]: updatedRoom }));
        setCurrentRoom(updatedRoom);
        
        // Store current player ID for this room
        localStorage.setItem(`player_${roomId}`, playerId);
        
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to join room:', err);
      setError('Failed to join room');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const isCreator = (roomId: string, playerId: string): boolean => {
    const room = rooms[roomId];
    return room?.creatorId === playerId;
  };

  const leaveRoom = async (roomId: string, playerId: string) => {
    try {
      await roomService.leaveRoom(roomId, playerId);
      
      // Remove player ID from localStorage
      localStorage.removeItem(`player_${roomId}`);
      setCurrentRoom(null);
      
      // Reload rooms to get updated state
      await loadRooms();
    } catch (err) {
      console.error('Failed to leave room:', err);
      setError('Failed to leave room');
    }
  };

  const updateRoom = async (roomId: string, updates: Partial<GameRoom>) => {
    try {
      const updatedRoom = await roomService.updateRoom(roomId, updates);
      
      if (updatedRoom) {
        setRooms(prev => ({ ...prev, [roomId]: updatedRoom }));
        
        if (currentRoom?.id === roomId) {
          setCurrentRoom(updatedRoom);
        }
      }
    } catch (err) {
      console.error('Failed to update room:', err);
      setError('Failed to update room');
    }
  };

  const getRoom = async (roomId: string): Promise<GameRoom | null> => {
    try {
      const room = await roomService.getRoom(roomId);
      if (room) {
        setRooms(prev => ({ ...prev, [roomId]: room }));
      }
      return room;
    } catch (err) {
      console.error('Failed to get room:', err);
      setError('Failed to get room');
      return null;
    }
  };

  return (
    <RoomContext.Provider value={{
      rooms,
      currentRoom,
      loading,
      error,
      createRoom,
      joinRoom,
      leaveRoom,
      updateRoom,
      getRoom,
      loadRooms,
      isCreator,
    }}>
      {children}
    </RoomContext.Provider>
  );
};
