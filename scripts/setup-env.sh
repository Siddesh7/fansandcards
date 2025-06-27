#!/bin/bash

echo "Setting up environment files for GameTreasury contract integration..."

# Create client .env.local if it doesn't exist
if [ ! -f ".env.local" ]; then
    echo "Creating .env.local..."
    cat > .env.local << EOF
# GameTreasury Contract Configuration
NEXT_PUBLIC_GAME_TREASURY_ADDRESS=0xD0484Fbfb4D52f2217664481B4D7eaBF9e97Af00
NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
NEXT_PUBLIC_CHAIN_ID=84532

# Private key for contract owner operations (replace with your private key)
GAME_TREASURY_PRIVATE_KEY=your_private_key_here
EOF
else
    echo ".env.local already exists"
fi

# Create server .env if it doesn't exist
if [ ! -f "server/.env" ]; then
    echo "Creating server/.env..."
    cat > server/.env << EOF
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/fan-zone-cards

# Client URL
CLIENT_URL=http://localhost:3000

# Contract Configuration
GAME_TREASURY_ADDRESS=0xD0484Fbfb4D52f2217664481B4D7eaBF9e97Af00
GAME_TREASURY_PRIVATE_KEY=your_private_key_here

# Server Configuration
PORT=3001
EOF
else
    echo "server/.env already exists"
fi

echo ""
echo "Environment files created!"
echo ""
echo "⚠️  IMPORTANT: Replace 'your_private_key_here' with your actual private key in both files:"
echo "   - .env.local"
echo "   - server/.env"
echo ""
echo "Contract Address: 0xD0484Fbfb4D52f2217664481B4D7eaBF9e97Af00"
echo "Network: Base Sepolia (Chain ID: 84532)"
echo ""
echo "To run the application:"
echo "  1. Add your private key to both .env files"
echo "  2. Run: pnpm run dev:with-server"
echo "" 