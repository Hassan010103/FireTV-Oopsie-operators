import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import contentRoutes from './routes/content.js';
import partyRoutes from './routes/party.js';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import WatchParty from './models/WatchParty.js';
import User from './models/User.js';

// Load env vars
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Socket.io logic
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Join a watch party room
  socket.on('joinParty', async ({ sessionId, userId }) => {
    socket.join(sessionId);
    console.log(`Socket ${socket.id} joined party ${sessionId}`);
    // Emit updated party info to all in the room
    const party = await WatchParty.findOne({ sessionId });
    if (party) {
      io.to(sessionId).emit('partyUpdated', party);
    }
  });

  // Leave a watch party room
  socket.on('leaveParty', ({ sessionId }) => {
    socket.leave(sessionId);
    console.log(`Socket ${socket.id} left party ${sessionId}`);
  });

  // Relay chat messages to party (with sender info)
  socket.on('chatMessage', async ({ sessionId, message }) => {
    // If message is missing user info, fetch it
    if (!message.userName || !message.userAvatar) {
      const user = await User.findOne({ userId: message.userId });
      if (user) {
        message.userName = user.displayName;
        message.userAvatar = user.avatarUrl;
      }
    }
    io.to(sessionId).emit('chatMessage', message);
  });

  // Relay playback state changes
  socket.on('playbackUpdate', ({ sessionId, state }) => {
    io.to(sessionId).emit('playbackUpdate', state);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/firepulse';

// Connect to MongoDB
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// TODO: Import and use routes here
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/party', partyRoutes);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 