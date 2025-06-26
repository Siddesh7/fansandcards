
import { supabase } from '@/lib/supabase';
import type { GameRoom, Player } from '@/contexts/RoomContext';

class RoomService {
  async getAllRooms(): Promise<GameRoom[]> {
    const { data, error } = await supabase
      .from('game_rooms')
      .select('*')
      .eq('game_state', 'waiting')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching rooms:', error);
      throw error;
    }

    return data || [];
  }

  async getRoom(roomId: string): Promise<GameRoom | null> {
    const { data, error } = await supabase
      .from('game_rooms')
      .select('*')
      .eq('id', roomId)
      .single();

    if (error) {
      console.error('Error fetching room:', error);
      return null;
    }

    return data;
  }

  async createRoom(name: string, playerName: string, playerId: string): Promise<GameRoom> {
    const newRoom: Omit<GameRoom, 'createdAt' | 'updatedAt'> = {
      id: Math.random().toString(36).substr(2, 9),
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

    const { data, error } = await supabase
      .from('game_rooms')
      .insert([{
        id: newRoom.id,
        name: newRoom.name,
        players: newRoom.players,
        max_players: newRoom.maxPlayers,
        current_round: newRoom.currentRound,
        total_rounds: newRoom.totalRounds,
        game_state: newRoom.gameState,
        prompt_card: newRoom.promptCard,
        submitted_cards: newRoom.submittedCards,
        chat_messages: newRoom.chatMessages,
        time_left: newRoom.timeLeft,
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating room:', error);
      throw error;
    }

    return this.mapSupabaseToRoom(data);
  }

  async joinRoom(roomId: string, playerName: string, playerId: string): Promise<GameRoom | null> {
    // First get the current room
    const room = await this.getRoom(roomId);
    if (!room || room.players.length >= room.maxPlayers) {
      return null;
    }

    const updatedPlayers = [...room.players, {
      id: playerId,
      name: playerName,
      points: 0,
      isConnected: true,
    }];

    const { data, error } = await supabase
      .from('game_rooms')
      .update({ players: updatedPlayers })
      .eq('id', roomId)
      .select()
      .single();

    if (error) {
      console.error('Error joining room:', error);
      return null;
    }

    return this.mapSupabaseToRoom(data);
  }

  async leaveRoom(roomId: string, playerId: string): Promise<void> {
    const room = await this.getRoom(roomId);
    if (!room) return;

    const updatedPlayers = room.players.filter(p => p.id !== playerId);

    if (updatedPlayers.length === 0) {
      // Delete empty room
      await supabase
        .from('game_rooms')
        .delete()
        .eq('id', roomId);
    } else {
      // Update room with remaining players
      await supabase
        .from('game_rooms')
        .update({ players: updatedPlayers })
        .eq('id', roomId);
    }
  }

  async updateRoom(roomId: string, updates: Partial<GameRoom>): Promise<GameRoom | null> {
    const supabaseUpdates: any = {};
    
    if (updates.players) supabaseUpdates.players = updates.players;
    if (updates.gameState) supabaseUpdates.game_state = updates.gameState;
    if (updates.currentRound) supabaseUpdates.current_round = updates.currentRound;
    if (updates.promptCard) supabaseUpdates.prompt_card = updates.promptCard;
    if (updates.submittedCards) supabaseUpdates.submitted_cards = updates.submittedCards;
    if (updates.chatMessages) supabaseUpdates.chat_messages = updates.chatMessages;
    if (updates.timeLeft !== undefined) supabaseUpdates.time_left = updates.timeLeft;

    const { data, error } = await supabase
      .from('game_rooms')
      .update(supabaseUpdates)
      .eq('id', roomId)
      .select()
      .single();

    if (error) {
      console.error('Error updating room:', error);
      return null;
    }

    return this.mapSupabaseToRoom(data);
  }

  private mapSupabaseToRoom(data: any): GameRoom {
    return {
      id: data.id,
      name: data.name,
      players: data.players || [],
      maxPlayers: data.max_players,
      currentRound: data.current_round,
      totalRounds: data.total_rounds,
      gameState: data.game_state,
      promptCard: data.prompt_card || '',
      submittedCards: data.submitted_cards || [],
      chatMessages: data.chat_messages || [],
      timeLeft: data.time_left,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  // Set up real-time subscription for a room
  subscribeToRoom(roomId: string, callback: (room: GameRoom) => void) {
    return supabase
      .channel(`room-${roomId}`)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'game_rooms',
          filter: `id=eq.${roomId}`
        }, 
        (payload) => {
          if (payload.new) {
            callback(this.mapSupabaseToRoom(payload.new));
          }
        })
      .subscribe();
  }
}

export const roomService = new RoomService();
