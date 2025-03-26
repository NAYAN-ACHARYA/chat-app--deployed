import express from 'express';
import Message from '../models/messages.js';

const router = express.Router();

router.post('/sendMessages', async (req, res) => {
    try {
        const { sender, recipient, text } = req.body;

        if (!sender || !recipient || !text) {
            return res.status(400).json({ error: "All fields (sender, recipient, text) are required." });
        }

        const newMessage = new Message({ sender, recipient, text });
        await newMessage.save();

        res.status(201).json({ message: "Message sent successfully!", data: newMessage });
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

export default router;
