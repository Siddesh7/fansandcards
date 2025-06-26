
-- Add creator_id column to game_rooms table to track room creators
ALTER TABLE public.game_rooms 
ADD COLUMN creator_id TEXT;
