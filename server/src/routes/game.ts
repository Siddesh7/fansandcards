import { Router } from "express";
import { Game } from "../models/Game";
import { questionCards, answerCards, actionCards } from "../data/cards";

const router = Router();

// Get game state
router.get("/:roomId", async (req, res) => {
  try {
    const game = await Game.findOne({ roomId: req.params.roomId });
    if (!game) {
      return res.status(404).json({ error: "Game not found" });
    }
    res.json(game.toObject());
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch game" });
  }
});

// Get cards data
router.get("/cards/all", (req, res) => {
  res.json({
    questions: questionCards,
    answers: answerCards,
    actions: actionCards,
  });
});

export default router;
