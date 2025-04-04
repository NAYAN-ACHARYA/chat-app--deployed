import express from 'express';
import User2 from '../models/User2.js';

const router = express.Router();
router.get('/contacts', async (req, res) => {
    try {
        const contacts = await User2.find();
        res.status(200).json(contacts);
    } catch (error) {
        console.error('Error fetching contacts:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


export default router;