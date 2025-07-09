import express from 'express';
import WatchParty from '../models/WatchParty.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { Server as SocketIOServer } from 'socket.io';
import http from 'http';

const router = express.Router();

function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'No token' });
  const token = header.split(' ')[1];
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// Get io instance from main server
let io;
try {
  const server = require('../index.js').server;
  io = require('../index.js').io;
} catch (e) {
  // fallback: will be undefined in test or if not exported
}

// Create party
router.post('/', auth, async (req, res) => {
  console.log('POST /api/party called');
  console.log('Request user:', req.user);
  console.log('Request body:', req.body);
  const { contentId, content } = req.body;
  const sessionId = Math.random().toString(36).substring(2, 10);
  const joinCode = Math.random().toString(36).substring(2, 8);
  const user = await User.findOne({ userId: req.user.userId });
  const party = new WatchParty({
    sessionId,
    hostId: user.userId,
    participants: [{ userId: user.userId, displayName: user.displayName, avatarUrl: user.avatarUrl }],
    contentId,
    content,
    currentTime: 0,
    status: 'paused',
    chat_messages: [],
    joinCode,
  });
  await party.save();
  console.log('Party created:', party);
  res.status(201).json(party);
});

// Join party by join code
router.post('/join/:joinCode', auth, async (req, res) => {
  console.log('POST /api/party/join/:joinCode called');
  console.log('Join code:', req.params.joinCode);
  console.log('Request user:', req.user);
  // Use case-insensitive join code lookup
  const party = await WatchParty.findOne({ joinCode: new RegExp('^' + req.params.joinCode + '$', 'i') });
  if (!party) {
    console.log('No party found for join code:', req.params.joinCode);
    return res.status(404).json({ error: 'Party not found' });
  }
  const user = await User.findOne({ userId: req.user.userId });
  if (!party.participants.find(p => p.userId === user.userId)) {
    party.participants.push({ userId: user.userId, displayName: user.displayName, avatarUrl: user.avatarUrl });
    await party.save();
  }
  console.log('User joined party:', party);
  res.json(party);
});

// Leave party
router.post('/leave/:sessionId', auth, async (req, res) => {
  const party = await WatchParty.findOne({ sessionId: req.params.sessionId });
  if (!party) return res.status(404).json({ error: 'Party not found' });
  party.participants = party.participants.filter(p => p.userId !== req.user.userId);
  await party.save();
  res.json({ message: 'Left party' });
});

// Get party by id
router.get('/:sessionId', auth, async (req, res) => {
  const party = await WatchParty.findOne({ sessionId: req.params.sessionId });
  if (!party) return res.status(404).json({ error: 'Not found' });
  res.json(party);
});

// List all parties for user
router.get('/', auth, async (req, res) => {
  const parties = await WatchParty.find({ 'participants.userId': req.user.userId });
  res.json(parties);
});

// Add chat message via REST and emit via socket.io
router.post('/:sessionId/chat', auth, async (req, res) => {
  const { message } = req.body;
  const party = await WatchParty.findOne({ sessionId: req.params.sessionId });
  if (!party) return res.status(404).json({ error: 'Party not found' });
  const user = await User.findOne({ userId: req.user.userId });
  const chatMsg = {
    id: Math.random().toString(36).substring(2, 10),
    userId: user.userId,
    userName: user.displayName,
    userAvatar: user.avatarUrl,
    message,
    timestamp: new Date().toISOString(),
  };
  party.chat_messages.push(chatMsg);
  await party.save();
  if (io) io.to(req.params.sessionId).emit('chatMessage', chatMsg);
  res.status(201).json(chatMsg);
});

// Add playback update via REST and emit via socket.io
router.post('/:sessionId/playback', auth, async (req, res) => {
  const { currentTime, status } = req.body;
  const party = await WatchParty.findOne({ sessionId: req.params.sessionId });
  if (!party) return res.status(404).json({ error: 'Party not found' });
  party.currentTime = currentTime;
  party.status = status;
  await party.save();
  if (io) io.to(req.params.sessionId).emit('playbackUpdate', { currentTime, status });
  res.status(200).json({ currentTime, status });
});

export default router; 