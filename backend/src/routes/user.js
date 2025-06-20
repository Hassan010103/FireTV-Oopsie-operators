import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Auth middleware
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

// Get current user profile
router.get('/me', auth, async (req, res) => {
  const user = await User.findOne({ userId: req.user.userId });
  if (!user) return res.status(404).json({ error: 'Not found' });
  res.json(user);
});

// Update profile
router.put('/me', auth, async (req, res) => {
  const updated = await User.findOneAndUpdate(
    { userId: req.user.userId },
    req.body,
    { new: true }
  );
  if (!updated) return res.status(404).json({ error: 'Not found' });
  res.json(updated);
});

// Send friend request
router.post('/friend-request/:toUserId', auth, async (req, res) => {
  const toUser = await User.findOne({ userId: req.params.toUserId });
  if (!toUser) return res.status(404).json({ error: 'User not found' });
  if (toUser.friendRequests.includes(req.user.userId)) return res.status(409).json({ error: 'Already requested' });
  toUser.friendRequests.push(req.user.userId);
  await toUser.save();
  res.json({ message: 'Request sent' });
});

// Accept friend request
router.post('/accept-friend/:fromUserId', auth, async (req, res) => {
  const user = await User.findOne({ userId: req.user.userId });
  const fromUser = await User.findOne({ userId: req.params.fromUserId });
  if (!user || !fromUser) return res.status(404).json({ error: 'User not found' });
  if (!user.friendRequests.includes(fromUser.userId)) return res.status(400).json({ error: 'No request' });
  user.friendRequests = user.friendRequests.filter(id => id !== fromUser.userId);
  user.friends.push(fromUser.userId);
  fromUser.friends.push(user.userId);
  await user.save();
  await fromUser.save();
  res.json({ message: 'Friend added' });
});

// List friends
router.get('/friends', auth, async (req, res) => {
  const user = await User.findOne({ userId: req.user.userId });
  if (!user) return res.status(404).json({ error: 'Not found' });
  const friends = await User.find({ userId: { $in: user.friends } });
  res.json(friends);
});

export default router; 