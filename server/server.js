import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";

dotenv.config();

const app = express();
const httpServer = createServer(app);

// Socket.io 
const io = new Server(httpServer, {
  cors: {
    origin: "*", // have to change this later to MY URL
  },
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
  socket.on("disconnect", () => console.log("User disconnected:", socket.id));
});

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("CollabBoard API Running"));

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
