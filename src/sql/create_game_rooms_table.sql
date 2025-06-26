
-- Create the game_rooms table
CREATE TABLE IF NOT EXISTS game_rooms (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  players JSONB DEFAULT '[]',
  max_players INTEGER DEFAULT 8,
  current_round INTEGER DEFAULT 1,
  total_rounds INTEGER DEFAULT 5,
  game_state TEXT DEFAULT 'waiting',
  prompt_card TEXT DEFAULT '',
  submitted_cards JSONB DEFAULT '[]',
  chat_messages JSONB DEFAULT '[]',
  time_left INTEGER DEFAULT 30,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on game_state for faster queries
CREATE INDEX IF NOT EXISTS idx_game_rooms_state ON game_rooms(game_state);

-- Create an index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_game_rooms_created_at ON game_rooms(created_at);

-- Enable Row Level Security
ALTER TABLE game_rooms ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anyone to read and write to game rooms
-- (For a production app, you'd want more restrictive policies)
CREATE POLICY "Anyone can access game rooms" ON game_rooms
  FOR ALL USING (true);

-- Create a trigger to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_game_rooms_updated_at 
  BEFORE UPDATE ON game_rooms 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();
