import { Router } from "express";
import { Room } from "../models/Room";

const router = Router();

// Get all available rooms
router.get("/", async (req, res) => {
  try {
    const rooms = await Room.find({ gameState: "waiting" }).sort({
      createdAt: -1,
    });
    res.json(rooms.map((room) => room.toObject()));
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch rooms" });
  }
});

// Get specific room
router.get("/:roomId", async (req, res) => {
  try {
    const room = await Room.findOne({ id: req.params.roomId });
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }
    res.json(room.toObject());
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch room" });
  }
});

export default router;
