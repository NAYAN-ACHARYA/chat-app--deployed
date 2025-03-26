import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import contacts from './routes/Contacts.js';
import recieveMessages from './routes/recieveMessages.js';
import sendMessages from './routes/sendMessages.js';
import setupSocket from './socket.js';
import http from 'http';
import path from 'path';
dotenv.config();
const app = express();
const __dirname=path.resolve();
const server = http.createServer(app);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api', authRoutes);
app.use('/api', contacts);
app.use('/api', recieveMessages);
app.use('/api',sendMessages);
// Setup WebSocket (Socket.io)
setupSocket(server);

app.use(express.static(path.join(__dirname,'/frontend/dist')));
app.get('*',(req,res)=>{
    res.sendFile(path.resolve(__dirname,"frontend",dist,"index.html"));
});
// ✅ FIXED: Use `server.listen` instead of `app.listen`
const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server running on http://localhost:${PORT}`));
