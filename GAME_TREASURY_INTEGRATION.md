# GameTreasury Contract Integration

## Overview

The GameTreasury contract has been successfully integrated into the FansAndCards application. This integration enables on-chain betting with automatic deposits and payouts using Base Sepolia testnet.

## Contract Details

- **Address**: `0xD0484Fbfb4D52f2217664481B4D7eaBF9e97Af00`
- **Network**: Base Sepolia (Chain ID: 84532)
- **Deposit Amount**: 1 gwei (0.000000001 ETH)

## Integration Architecture

### Frontend Components

#### 1. Contract Utilities (`lib/contracts/game-treasury.ts`)

- Contains the contract ABI and address
- Exports constants for deposit amount and contract address
- Type-safe contract interaction setup

#### 2. Custom Hook (`src/hooks/use-game-treasury.ts`)

- Wagmi-based hook for contract interactions
- Handles deposits, balance checks, and error states
- Provides real-time contract data reading
- Integrates with wallet connection via Privy

#### 3. Updated Betting Panel (`src/components/game/betting-panel.tsx`)

- Now uses the actual GameTreasury contract instead of direct transfers
- Shows real-time deposit status and transaction links
- Handles contract deposit workflow with user feedback

### Backend Integration

#### 1. Contract Owner Operations (`server/src/contracts/game-treasury-owner.ts`)

- Server-side contract interaction using owner private key
- Handles game creation, winner payouts, and cancellations
- Uses viem for robust contract communication

#### 2. Updated Room Service (`server/src/services/RoomService.ts`)

- Creates games on contract when rooms are created
- Handles automatic winner payouts when games complete
- Manages contract state synchronization

#### 3. Enhanced Game Service (`server/src/services/GameService.ts`)

- Automatically triggers contract payout when game finishes
- Handles payout errors gracefully without failing game completion

## Setup Instructions

### 1. Environment Configuration

Run the setup script to create environment files:

```bash
./scripts/setup-env.sh
```

### 2. Add Private Key

Replace `your_private_key_here` in both:

- `.env.local` (client)
- `server/.env` (server)

### 3. Install Dependencies

```bash
# Client dependencies (already installed)
pnpm install

# Server dependencies
cd server && pnpm install
```

### 4. Start the Application

```bash
pnpm run dev:with-server
```

## User Flow

### 1. Room Creation

- When a player creates a room, a game is automatically created on the contract
- The contract tracks the game state and player deposits

### 2. Player Deposits

- Players connect their wallet via Privy
- Click "Deposit" to send 1 gwei to the contract
- Transaction is recorded both on-chain and in the database
- UI shows real-time deposit status with transaction links

### 3. Game Progression

- Game starts only when all players have deposited and are ready
- Normal game flow continues with card submissions and judging

### 4. Winner Payout

- When the game ends, the winner is automatically paid out via smart contract
- The entire pot (sum of all deposits) is transferred to the winner
- Payout transaction is recorded and displayed to all players

## Smart Contract Functions Used

### Player Functions

- `depositForGame(string gameId)` - Players deposit for a specific game
- `getGameInfo(string gameId)` - View game status and pot size
- `hasPlayerDeposited(string gameId, address player)` - Check deposit status

### Owner Functions (Server Only)

- `createGame(string gameId)` - Create a new game on contract
- `payoutWinner(string gameId, address winner)` - Pay the winner
- `cancelGameAndRefund(string gameId)` - Emergency cancel with refunds

## Security Features

### Frontend

- Type-safe contract interactions
- Balance validation before deposits
- Transaction confirmation handling
- Error boundary for contract failures

### Backend

- Private key secured in environment variables
- Contract owner validation
- Graceful error handling for contract failures
- Database/contract state synchronization

## Development Notes

### Testnet Configuration

- Uses Base Sepolia for testing (free ETH available from faucets)
- Low gas costs for development and testing
- Easy block explorer integration for transaction verification

### Error Handling

- Frontend shows user-friendly error messages
- Backend logs all contract interactions
- Game completion doesn't fail if payout fails (logged for manual resolution)

### Transaction Tracking

- All transactions are stored in database
- Links to block explorer for verification
- Real-time status updates during processing

## Future Enhancements

1. **Multi-token Support**: Add support for different token deposits
2. **Tournament Mode**: Handle multi-game tournaments with larger pots
3. **Staking Rewards**: Implement additional rewards for active players
4. **Admin Dashboard**: UI for contract owner operations
5. **Mainnet Deployment**: Production deployment with higher stakes

## Troubleshooting

### Common Issues

1. **"Insufficient Balance"**

   - Ensure wallet has at least 1 gwei + gas fees
   - Get testnet ETH from Base Sepolia faucet

2. **"Player already deposited"**

   - Each player can only deposit once per game
   - Check transaction history on block explorer

3. **"Game does not exist"**

   - Ensure room was created properly
   - Check server logs for contract creation errors

4. **Transaction Pending**
   - Base Sepolia can have variable block times
   - Wait for confirmation or check block explorer

### Debug Tools

- Console logging for all contract interactions
- Transaction hashes logged for verification
- Block explorer links in UI for transparency

## Contract Verification

The contract is deployed and verified on Base Sepolia. You can view it at:
`https://sepolia.basescan.org/address/0xD0484Fbfb4D52f2217664481B4D7eaBF9e97Af00`

All transactions can be verified on the block explorer for complete transparency.
