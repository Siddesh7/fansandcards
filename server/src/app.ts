import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import { setupSocketHandlers } from "./socket/socketHandler";
import roomRoutes from "./routes/rooms";
import gameRoutes from "./routes/game";

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
  })
);
app.use(express.json());

// Routes
app.use("/api/rooms", roomRoutes);
app.use("/api/game", gameRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Socket.io setup
setupSocketHandlers(io);

// MongoDB connection
const connectDB = async () => {
  try {
    const mongoUri =
      process.env.MONGODB_URI || "mongodb://localhost:27017/fan-zone-cards";
    await mongoose.connect(mongoUri);
    console.log("🎮 Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

const PORT = process.env.PORT || 3001;

// Start server
const startServer = async () => {
  await connectDB();

  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🎯 Socket.io ready for connections`);
  });
};

startServer().catch(console.error);

export { io };
