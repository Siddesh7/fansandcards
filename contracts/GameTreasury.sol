// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title GameTreasury - Multi-Game Escrow
 * @dev Minimal escrow for multiple games
 */
contract GameTreasury {
    address public owner;
    
    // Changed from 1 gwei to 1 CHZ
    uint256 public constant DEPOSIT_AMOUNT = 1000000000000000000; // 1 CHZ in wei
    
    struct Game {
        uint256 totalDeposits;
        mapping(address => bool) hasDeposited;
        bool isActive;
        bool isPaidOut;
    }
    
    mapping(uint256 => Game) public games;
    
    event GameCreated(uint256 indexed gameId);
    event DepositMade(uint256 indexed gameId, address indexed player, uint256 amount);
    event WinnerPaid(uint256 indexed gameId, address indexed winner, uint256 amount);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    constructor() {
        owner = msg.sender;
    }
    
    /**
     * @dev Create a new game
     */
    function createGame(uint256 gameId) external onlyOwner {
        require(!games[gameId].isActive, "Game already exists");
        games[gameId].isActive = true;
        emit GameCreated(gameId);
    }
    
    /**
     * @dev Players deposit for specific game
     */
    function deposit(uint256 gameId) external payable {
        require(games[gameId].isActive, "Game not active");
        require(!games[gameId].hasDeposited[msg.sender], "Already deposited");
        require(msg.value == DEPOSIT_AMOUNT, "Incorrect deposit amount");
        
        games[gameId].hasDeposited[msg.sender] = true;
        games[gameId].totalDeposits += msg.value;
        
        emit DepositMade(gameId, msg.sender, msg.value);
    }
    
    /**
     * @dev Pay winner for specific game
     */
    function payWinner(uint256 gameId, address winner) external onlyOwner {
        require(games[gameId].isActive, "Game not active");
        require(!games[gameId].isPaidOut, "Already paid out");
        require(games[gameId].totalDeposits > 0, "No deposits");
        
        uint256 winnings = games[gameId].totalDeposits;
        games[gameId].isPaidOut = true;
        games[gameId].isActive = false;
        
        payable(winner).transfer(winnings);
        emit WinnerPaid(gameId, winner, winnings);
    }
    
    /**
     * @dev Get game status
     */
    function getGame(uint256 gameId) external view returns (uint256 pot, bool active, bool paidOut) {
        Game memory game = games[gameId];
        return (game.totalDeposits, game.isActive, game.isPaidOut);
    }
} 