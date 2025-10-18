import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import connectDB from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import workspaceRoutes from './routes/workspaceRoutes.js';
import cardRoutes from './routes/cardRoutes.js';
import commentRoutes from './routes/commentRoutes.js'

dotenv.config();
connectDB();

const app = express();
const httpServer = createServer(app);

// Socket.io 
const io = new Server(httpServer, {
  cors: {
    origin: "*", // have to change this later to MY URL
    methods: ["GET", "POST", "PUT", "DELETE"]
  },
});

// io.on("connection", (socket) => {
//   console.log("A New Client Connected:", socket.id);

//   // //join workspace room
//   // socket.on("joinWorkspace", (workspaceId)=>{
//   //   socket.join(workspaceId);
//   //   console.log(`User joined workspace: ${workspaceId}`);
//   // });

//   // //card updates
//   // socket.on("cardUpdated", (data)=>{
//   //   io.to(data.workspaceId).emit("cardUpdated", data);
//   // });

//   socket.on("disconnect", () => console.log("Client disconnected:", socket.id));
// });

app.use(cors());
app.use(express.json());

//mounting routes with /api
app.use("/api/auth", authRoutes);
app.use("/api/workspaces", workspaceRoutes);
app.use("/api/cards", cardRoutes);
app.use("/api/cards", commentRoutes);


app.get("/", (req, res) => res.send("CollabBoard API Running"));

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export {io};