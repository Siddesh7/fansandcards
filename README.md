
# Sports Against Fans 🏆⚽

The funniest football card game where you roast rivals, win $CHZ and NFTs! Built for the Vibe Hacking Online Hackathon on Chiliz Chain.

## 🎮 Game Overview

Sports Against Fans is a hilarious, Cards Against Humanity-style card game designed for football fans. Players compete to create the funniest card combinations using football-themed prompts and answers, with strategic Action Cards adding chaos to the mix.

### Key Features:
- **3-8 Players**: Quick 10-15 minute matches
- **Pay-to-Play**: 0.1 $CHZ entry fees for premium matches
- **NFT Cards**: All cards are NFTs with AR effects
- **Rewards**: Win $CHZ, Reward Points, and rare NFT cards
- **Fan Tokens**: Special perks for Socios.com token holders
- **Stadium Atmosphere**: Immersive UI with flares, crowds, and animations

## 🚀 Quick Start

### Project URL
**Live App**: https://0edebcef-81aa-4200-a221-65ed618bc00e.lovableproject.com

### Local Development
1. Clone the repository
2. Install dependencies: `npm install`
3. Start dev server: `npm run dev`
4. Open http://localhost:8080

## 🏗️ Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: Supabase (for non-blockchain data)
- **Blockchain**: Chiliz Chain (handled by Cursor)
- **Icons**: Lucide React
- **State Management**: Tanstack Query

## 🎯 Game Screens

### 1. Landing Page (`/`)
- Welcome screen with game explanation
- Wallet connection (placeholder for Cursor)
- Stadium atmosphere with animated flares and crowd

### 2. Lobby Screen (`/lobby`)
- Create/join game lobbies
- Theme voting (Football, Basketball, American Football)
- Pre-game chat with football emojis
- Real-time player status updates

### 3. Game Screen (`/game`)
- Main gameplay with Prompt/Answer/Action cards
- 30-second timer with progress bar
- Live chat for banter
- Judge selection and voting
- Animated card interactions

### 4. Results Screen (`/results`)
- Victory celebration with confetti
- Rewards breakdown ($CHZ, Reward Points, NFT cards)
- Match statistics and leaderboard
- Play again options

### 5. Card Collection (`/collection`)
- View owned NFT cards by category
- AR preview for rare cards
- Buy card packs (placeholder)
- Trade on Kayen Swap (placeholder)

## 🎨 Design System

### Colors
- **Pitch Green**: Primary football theme color
- **Flare Red**: Accent color for actions and highlights  
- **Navy Blue**: Secondary color for backgrounds
- **Trophy Gold**: Rewards and achievements

### Animations
- **Card Flip**: Trading card-style interactions
- **Stadium Effects**: Flares, lights, and crowd movement
- **Confetti**: Victory celebrations
- **Pulse Effects**: Action cards and important buttons

### Typography
- **Headlines**: Bold, uppercase stadium scoreboard style
- **Body Text**: Clean, readable on mobile devices
- **Tone**: Cheeky, irreverent football fan humor

## 🔗 Integrations

### Supabase (Database)
- **Lobbies**: Game room management
- **Players**: User profiles and session data
- **Game State**: Real-time game progress
- **Chat**: Live messaging system
- **Card Inventory**: UI display (not blockchain ownership)
- **Match History**: Game results and statistics

### Cursor (Blockchain) - Placeholder
- Wallet connections (Socios Wallet/MetaMask)
- $CHZ payments and rewards
- NFT card ownership and trading
- Fan Token integration
- Kayen Swap marketplace

## 📱 Mobile-First Design

The app is optimized for mobile devices since most sports fans use phones:
- Touch-friendly card interactions
- Responsive grid layouts
- Readable text sizes
- Optimized animations for performance
- PWA-ready meta tags

## 🃏 Sample Card Content

### Prompt Cards (Black background, red border)
- "___ is why we got relegated"
- "The worst transfer signing was ___"
- "The ultimate fan chant is about ___"

### Answer Cards (White background, green border)
- "A drunk ultra with a megaphone"
- "Neymar's diving masterclass"
- "Messi's tax returns"
- "VAR officials watching Netflix"

### Action Cards (Gold background, special effects)
- "Fan Frenzy: Double points this round!"
- "Red Card: Block a player's submission"
- "Steal a Card: Take opponent's card"

## 🎯 Game Flow

1. **Setup**: Players join lobby, pay 0.1 $CHZ entry fee
2. **Dealing**: Each player gets 7 Answer Cards + 1 Action Card
3. **Rounds**: 5 rounds total, ~10-15 minutes per match
4. **Gameplay**: Read Prompt → Submit Answer → Judge picks winner
5. **Scoring**: 1-2 points per round, Action Cards add strategy
6. **Victory**: Highest score wins 50% $CHZ pot + NFT + 100 Reward Points

## 🔧 Development Notes

### Placeholder Features (for Cursor integration)
- Wallet connection buttons
- $CHZ payment processing
- NFT card trading
- Blockchain ownership verification
- Fan Token staking

### Supabase Schema
See `src/lib/supabase.ts` for complete database schema and API functions.

### Real-time Features
- Lobby updates (players joining/leaving)
- Game state synchronization
- Live chat messages
- Timer countdown

## 🚀 Deployment

The app is deployed on Lovable and ready for the hackathon. To deploy your own version:
1. Connect to Supabase for database
2. Set up Cursor for blockchain features
3. Configure environment variables
4. Deploy to your preferred platform

## 🏆 Hackathon Goals

Built for the **Vibe Hacking Online Hackathon** on Chiliz Chain, this project showcases:
- Innovative use of Fan Tokens and NFTs
- Engaging sports fan community features
- Chiliz Chain integration for payments
- Mobile-first design for accessibility
- Real-time multiplayer gameplay

## 🤝 Contributing

This is a hackathon project built in record time! Areas for future development:
- Complete Cursor blockchain integration
- Advanced AR effects for NFT cards
- Additional sports themes (Basketball, American Football)
- Tournament mode with larger prizes
- Social features and friend systems

---

**Made with ⚽ and 🔥 for football fans everywhere!**

*Sports Against Fans - Where the beautiful game meets beautiful comedy.*
