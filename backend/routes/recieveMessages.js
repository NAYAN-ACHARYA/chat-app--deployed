import express from "express";
import Message from "../models/messages.js";

const router = express.Router();

// Get messages between two users
router.get("/recieveMessages/:sender/:recipient", async (req, res) => {
  try {
    const { sender, recipient } = req.params;

    const messages = await Message.find({
      $or: [
        { sender:sender, recipient:recipient },
        { sender: recipient, recipient: sender },
      ],
    }).sort({ timestamp: 1 }); // Sort messages in ascending order

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
