
-- Drop the existing game_rooms table and recreate it for our card game
DROP TABLE IF EXISTS public.game_rooms CASCADE;

-- Create the new game_rooms table for card game functionality
CREATE TABLE public.game_rooms (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  players JSONB NOT NULL DEFAULT '[]'::jsonb,
  max_players INTEGER NOT NULL DEFAULT 8,
  current_round INTEGER NOT NULL DEFAULT 1,
  total_rounds INTEGER NOT NULL DEFAULT 5,
  game_state TEXT NOT NULL DEFAULT 'waiting',
  prompt_card TEXT NOT NULL DEFAULT '',
  submitted_cards JSONB NOT NULL DEFAULT '[]'::jsonb,
  chat_messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  time_left INTEGER NOT NULL DEFAULT 30,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.game_rooms ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is a multiplayer game)
CREATE POLICY "Anyone can view game rooms" ON public.game_rooms FOR SELECT USING (true);
CREATE POLICY "Anyone can create game rooms" ON public.game_rooms FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update game rooms" ON public.game_rooms FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete game rooms" ON public.game_rooms FOR DELETE USING (true);

-- Enable realtime for the table
ALTER TABLE public.game_rooms REPLICA IDENTITY FULL;
