import express from 'express';
import WatchParty from '../models/WatchParty.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

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

// Create party
router.post('/', auth, async (req, res) => {
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
  res.status(201).json(party);
});

// Join party by join code
router.post('/join/:joinCode', auth, async (req, res) => {
  const party = await WatchParty.findOne({ joinCode: req.params.joinCode });
  if (!party) return res.status(404).json({ error: 'Party not found' });
  const user = await User.findOne({ userId: req.user.userId });
  if (!party.participants.find(p => p.userId === user.userId)) {
    party.participants.push({ userId: user.userId, displayName: user.displayName, avatarUrl: user.avatarUrl });
    await party.save();
  }
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

export default router; 