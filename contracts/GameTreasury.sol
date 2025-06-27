// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title GameTreasury
 * @dev Simple contract to manage deposits and payouts for card games
 */
contract GameTreasury {
    address public owner;
    uint256 public constant DEPOSIT_AMOUNT = 1 gwei; // 0.000000001 ETH
    
    struct Game {
        string gameId;
        uint256 totalPot;
        uint256 playerCount;
        bool isActive;
        bool isPaidOut;
        address winner;
        mapping(address => bool) hasDeposited;
        address[] players;
    }
    
    mapping(string => Game) public games;
    mapping(string => bool) public gameExists;
    
    event GameCreated(string indexed gameId);
    event DepositMade(string indexed gameId, address indexed player, uint256 amount);
    event WinnerPaid(string indexed gameId, address indexed winner, uint256 amount);
    event GameCancelled(string indexed gameId, uint256 refundAmount);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    modifier gameIsActive(string memory gameId) {
        require(gameExists[gameId], "Game does not exist");
        require(games[gameId].isActive, "Game is not active");
        require(!games[gameId].isPaidOut, "Game already paid out");
        _;
    }
    
    constructor() {
        owner = msg.sender;
    }
    
    /**
     * @dev Create a new game
     * @param gameId Unique identifier for the game
     */
    function createGame(string memory gameId) external onlyOwner {
        require(!gameExists[gameId], "Game already exists");
        
        Game storage newGame = games[gameId];
        newGame.gameId = gameId;
        newGame.totalPot = 0;
        newGame.playerCount = 0;
        newGame.isActive = true;
        newGame.isPaidOut = false;
        
        gameExists[gameId] = true;
        
        emit GameCreated(gameId);
    }
    
    /**
     * @dev Player deposits for a specific game
     * @param gameId The game to deposit for
     */
    function depositForGame(string memory gameId) external payable gameIsActive(gameId) {
        require(msg.value == DEPOSIT_AMOUNT, "Incorrect deposit amount");
        require(!games[gameId].hasDeposited[msg.sender], "Player already deposited");
        
        Game storage game = games[gameId];
        game.hasDeposited[msg.sender] = true;
        game.totalPot += msg.value;
        game.playerCount++;
        game.players.push(msg.sender);
        
        emit DepositMade(gameId, msg.sender, msg.value);
    }
    
    /**
     * @dev Pay out the winner (only owner can call)
     * @param gameId The game to pay out
     * @param winner Address of the winning player
     */
    function payoutWinner(string memory gameId, address winner) external onlyOwner gameIsActive(gameId) {
        Game storage game = games[gameId];
        require(game.totalPot > 0, "No funds to pay out");
        require(game.hasDeposited[winner], "Winner must have deposited");
        
        uint256 payout = game.totalPot;
        game.winner = winner;
        game.isPaidOut = true;
        game.isActive = false;
        game.totalPot = 0; // Reset pot after payout
        
        (bool success, ) = winner.call{value: payout}("");
        require(success, "Payout failed");
        
        emit WinnerPaid(gameId, winner, payout);
    }
    
    /**
     * @dev Cancel game and refund all players (only owner, emergency function)
     * @param gameId The game to cancel
     */
    function cancelGameAndRefund(string memory gameId) external onlyOwner gameIsActive(gameId) {
        Game storage game = games[gameId];
        require(game.totalPot > 0, "No funds to refund");
        
        uint256 refundAmount = DEPOSIT_AMOUNT;
        uint256 totalRefunded = 0;
        
        // Refund all players
        for (uint256 i = 0; i < game.players.length; i++) {
            address player = game.players[i];
            if (game.hasDeposited[player]) {
                (bool success, ) = player.call{value: refundAmount}("");
                require(success, "Refund failed");
                totalRefunded += refundAmount;
            }
        }
        
        game.isActive = false;
        game.totalPot = 0;
        
        emit GameCancelled(gameId, totalRefunded);
    }
    
    /**
     * @dev Get game information
     * @param gameId The game to query
     */
    function getGameInfo(string memory gameId) external view returns (
        uint256 totalPot,
        uint256 playerCount,
        bool isActive,
        bool isPaidOut,
        address winner
    ) {
        Game storage game = games[gameId];
        return (
            game.totalPot,
            game.playerCount,
            game.isActive,
            game.isPaidOut,
            game.winner
        );
    }
    
    /**
     * @dev Check if player has deposited for a game
     * @param gameId The game to check
     * @param player The player to check
     */
    function hasPlayerDeposited(string memory gameId, address player) external view returns (bool) {
        return games[gameId].hasDeposited[player];
    }
    
    /**
     * @dev Get all players in a game
     * @param gameId The game to query
     */
    function getGamePlayers(string memory gameId) external view returns (address[] memory) {
        return games[gameId].players;
    }
    
    /**
     * @dev Emergency withdrawal function (only owner)
     * Should only be used in extreme circumstances
     */
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        (bool success, ) = owner.call{value: balance}("");
        require(success, "Emergency withdrawal failed");
    }
    
    /**
     * @dev Transfer ownership
     * @param newOwner New owner address
     */
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "New owner cannot be zero address");
        owner = newOwner;
    }
    
    /**
     * @dev Get contract balance
     */
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
} 