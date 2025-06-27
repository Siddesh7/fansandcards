# FansAndCards 🏆⚽

**The Most Hilarious Football Cards Game**

## 🚀 **LIVE ON CHILIZ MAINNET** 🚀

> **✅ DEPLOYED & READY TO PLAY**  
> **Contract Address**: `0x8202f7875f0417593CC4a8391dA08874A1eb0EAF`  
> **Network**: Chiliz Mainnet (Chain ID: 88888)  
> **View Contract**: [ChilizScan](https://chiliscan.com/address/0x8202f7875f0417593CC4a8391dA08874A1eb0EAF)  
> **Entry Fee**: 1 CHZ per player 💰

---

FansAndCards is a blockchain-powered football card game inspired by Cards Against Humanity. Players compete in hilarious rounds of filling in the blanks with the most outrageous football-themed answers. Built on Chiliz mainnet with real CHZ betting and automatic smart contract payouts.

## 🎮 Game Overview

Inspired by the legendary Cards Against Humanity, FansAndCards brings the same irreverent humor to the world of football. Players use their hand of answer cards to complete ridiculous football scenarios, creating laugh-out-loud combinations that would make even the most serious football pundits blush.

### How to Play

1. **Join or Create a Room** - Share room codes with friends
2. **Place Your Bet** - Each player deposits 1 CHZ to enter
3. **Fill in the Blanks** - Complete hilarious football scenarios with your cards
4. **Judge & Laugh** - Take turns picking the funniest combinations
5. **Winner Takes All** - Highest scorer gets the entire pot automatically!

## ✨ Product Features

### 🎲 Core Gameplay

- **Cards Against Humanity Style** - Fill-in-the-blank humor with football themes
- **Dynamic Round System** - Rotating judges, multiple rounds per game
- **Real-time Scoring** - 5 points per round win, live leaderboards
- **Hand Management** - Strategic card selection and submission
- **Answer Revelation** - Dramatic card reveals and winner celebrations

### 🌐 Multiplayer Experience

- **Real-time Synchronization** - Instant updates across all players
- **Room-based Games** - Private lobbies with shareable codes
- **Player Status Tracking** - Ready states, connection status, deposit tracking
- **Live Chat Integration** - Built-in communication during games
- **Spectator Mode** - Watch ongoing games before joining

### 💰 Blockchain Integration

- **CHZ Betting** - 1 CHZ entry fee per player per game
- **Smart Contract Escrow** - Trustless fund management
- **Automatic Payouts** - Winner receives entire pot instantly
- **Transparent Transactions** - All bets and payouts on Chiliz blockchain
- **Zero House Edge** - 100% of deposits go to winners

### 🎨 User Interface

- **Modern Design** - Clean, responsive interface with football theming
- **Smooth Animations** - Framer Motion powered transitions
- **Mobile Optimized** - Perfect experience on all devices
- **Dark Mode** - Eye-friendly gaming experience
- **Accessibility** - Keyboard navigation and screen reader support

### 🔐 Security & Authentication

- **Web3 Wallet Integration** - Privy authentication with multiple wallet support
- **Private Key Management** - Secure server-side contract operations
- **Transaction Verification** - ChilizScan integration for transparency
- **Error Handling** - Graceful recovery from network issues
- **Anti-cheat Measures** - Server-side game state validation

## 🏗️ Technical Specifications

### Frontend Architecture

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS v4 with custom components
- **Animations**: Framer Motion for smooth interactions
- **State Management**: React hooks with Socket.io real-time updates
- **Build Tool**: Turbopack for fast development

### Backend Architecture

- **Runtime**: Node.js with Express framework
- **Real-time**: Socket.io for multiplayer synchronization
- **Database**: MongoDB with Mongoose ODM
- **Blockchain**: Viem for Chiliz mainnet interactions
- **Authentication**: Privy SDK integration
- **API Design**: RESTful endpoints with WebSocket events

### Blockchain Infrastructure

- **Network**: Chiliz Mainnet (Chain ID: 88888)
- **Smart Contract**: Custom GameTreasury escrow system
- **Token**: CHZ (Chiliz native token)
- **Gas Optimization**: Minimal contract interactions
- **Explorer Integration**: ChilizScan transaction verification

### Game Engine

- **Card System**: 500+ unique football-themed cards
- **Randomization**: Secure server-side card dealing
- **Scoring Algorithm**: Points-based with tie-breaking
- **Game States**: Waiting → Playing → Judging → Results
- **Round Management**: Automatic progression and cleanup

## 🎯 Game Specifications

### Player Requirements

- **Minimum Players**: 2
- **Maximum Players**: 8
- **Entry Fee**: 1 CHZ per player
- **Wallet**: Chiliz-compatible Web3 wallet
- **Network**: Stable internet connection

### Game Rules

- **Rounds**: Variable (until target score or elimination)
- **Cards per Hand**: 7 answer cards
- **Scoring**: 5 points per round win
- **Judge Rotation**: Every player takes turns
- **Winner Determination**: Highest total score
- **Payout**: 100% of pot to winner

### Card Categories

- **Player Actions**: Ridiculous things players do
- **Manager Quotes**: Outrageous coaching statements
- **Transfer Drama**: Transfer window madness
- **Match Events**: Crazy game situations
- **Fan Reactions**: Supporter shenanigans
- **Media Headlines**: Tabloid-worthy news

## 🔗 Smart Contract Details

- **Contract Address**: `0x8202f7875f0417593CC4a8391dA08874A1eb0EAF`
- **Network**: Chiliz Mainnet (Chain ID: 88888)
- **Deposit Amount**: 1 CHZ (1,000,000,000,000,000,000 wei)
- **Gas Optimization**: Minimal transaction overhead
- **Security**: Owner-controlled payouts, deposit verification
- **Explorer**: [View on ChilizScan](https://chiliscan.com/address/0x8202f7875f0417593CC4a8391dA08874A1eb0EAF)

## 🛠️ Development Setup

```bash
# Clone repository
git clone https://github.com/your-org/fansandcards.git
cd fansandcards

# Install dependencies
pnpm install

# Setup environment variables
cp .env.example .env.local
# Add your NEXT_PUBLIC_PRIVY_APP_ID

# Start development servers
pnpm run dev:with-server

# Frontend only
pnpm dev

# Backend only
cd server && pnpm dev
```

### Environment Variables

```bash
# Frontend (.env.local)
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id

# Backend (server/.env)
MONGODB_URI=mongodb://localhost:27017/fansandcards
GAME_TREASURY_PRIVATE_KEY=your_private_key_here
PORT=3001
```

## 🚀 Deployment

### Frontend (Vercel)

```bash
# Build production
pnpm build

# Deploy to Vercel
vercel --prod
```

### Backend (Railway/Render)

```bash
# Set environment variables
# Deploy via Git integration
```

### Smart Contract Verification

The contract is deployed and verified on Chiliz mainnet for full transparency.

## 🎮 Sample Cards

**Question Cards:**

- "During the World Cup final, **\_\_\_** caused the entire stadium to erupt in chaos."
- "The manager's post-match interview was ruined when he accidentally mentioned **\_\_\_**."
- "VAR was called to review **\_\_\_**, leading to a 20-minute delay."

**Answer Cards:**

- "Messi doing the griddy celebration"
- "A rogue pigeon with anger management issues"
- "Cristiano's secret skincare routine"
- "The referee's questionable eyesight"

## 🏆 Roadmap

### Phase 1: Core Game ✅

- [x] Basic gameplay mechanics
- [x] Multiplayer rooms
- [x] CHZ betting integration
- [x] Smart contract deployment

### Phase 2: Enhanced Features 🚧

- [ ] Tournament mode
- [ ] Custom card creation
- [ ] Leaderboards
- [ ] Achievement system

### Phase 3: Community 📅

- [ ] User-generated content
- [ ] Community voting on cards
- [ ] Professional tournament support
- [ ] Mobile app release

---

Built with ❤️ for football fans who love to laugh and win big! 🎉

_Inspired by Cards Against Humanity - bringing irreverent humor to the beautiful game._
