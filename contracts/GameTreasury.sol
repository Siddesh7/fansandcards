// SPDX-License-Identifier: MIT
pragma solidity >=0.8.2 <0.9.0;

/**
 * @title GameTreasury - Multi-Game Escrow
 * @dev Minimal escrow for multiple games
 */
contract GameTreasury {
    address public owner;
    uint256 public constant DEPOSIT_AMOUNT = 1000000000; // 1 gwei in wei
    
    struct Game {
        uint256 pot;
        bool active;
        bool paidOut;
    }
    
    mapping(uint256 => Game) public games;
    
    constructor() {
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }
    
    /**
     * @dev Create a new game
     */
    function createGame(uint256 gameId) external onlyOwner {
        require(!games[gameId].active && !games[gameId].paidOut);
        
        games[gameId] = Game({
            pot: 0,
            active: true,
            paidOut: false
        });
    }
    
    /**
     * @dev Players deposit for specific game
     */
    function deposit(uint256 gameId) external payable {
        require(games[gameId].active);
        require(!games[gameId].paidOut);
        require(msg.value == DEPOSIT_AMOUNT);
        
        games[gameId].pot += msg.value;
    }
    
    /**
     * @dev Pay winner for specific game
     */
    function payWinner(uint256 gameId, address winner) external onlyOwner {
        require(games[gameId].active);
        require(!games[gameId].paidOut);
        require(games[gameId].pot > 0);
        require(winner != address(0));
        
        uint256 payout = games[gameId].pot;
        games[gameId].paidOut = true;
        games[gameId].active = false;
        games[gameId].pot = 0;
        
        payable(winner).transfer(payout);
    }
    
    /**
     * @dev Get game status
     */
    function getGame(uint256 gameId) external view returns (uint256 pot, bool active, bool paidOut) {
        Game memory game = games[gameId];
        return (game.pot, game.active, game.paidOut);
    }
} 