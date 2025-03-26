import { Server } from "socket.io";
import Message from "./models/messages.js";

const users = new Map(); // Stores socket.id of users

const setupSocket = (server) => {
  const io = new Server(server, {
    cors: { 
      origin: "*", 
      methods: ["GET", "POST"] 
    },
  });

  io.on("connection", (socket) => {
    // console.log(`🔥 User connected: ${socket.id}`);

    // Store user ID when they join
    socket.on("registerUser", (userId) => {
      users.set(userId, socket.id);
      // console.log(`✅ User ${userId} registered with Socket ID ${socket.id}`);
    });

    // Handle sending messages
    socket.on("sendMessage", async (data) => {
      try {
        const newMessage = new Message({
          sender: data.sender,
          recipient: data.recipient,
          text: data.text,
        });

        await newMessage.save();

        // Send only to the recipient if online
        const recipientSocketId = users.get(data.recipient);
        if (recipientSocketId) {
          io.to(recipientSocketId).emit("receiveMessage", newMessage);
        }

        // Also send a confirmation to sender
        io.to(socket.id).emit("messageSent", newMessage);
      } catch (error) {
        console.error("❌ Error saving message:", error);
        socket.emit("error", "Failed to send message.");
      }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      users.forEach((value, key) => {
        if (value === socket.id) {
          users.delete(key);
          // console.log(`🚪 User ${key} disconnected.`);
        }
      });
    });
  });

  return io;
};

export default setupSocket;
