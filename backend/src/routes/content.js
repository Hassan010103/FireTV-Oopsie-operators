import express from 'express';
import Content from '../models/Content.js';

const router = express.Router();

// Get all content
router.get('/', async (req, res) => {
  const items = await Content.find();
  res.json(items);
});

// Get content by id
router.get('/:id', async (req, res) => {
  const item = await Content.findOne({ contentId: req.params.id });
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json(item);
});

// Create content
router.post('/', async (req, res) => {
  try {
    const content = new Content(req.body);
    await content.save();
    res.status(201).json(content);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update content
router.put('/:id', async (req, res) => {
  try {
    const updated = await Content.findOneAndUpdate(
      { contentId: req.params.id },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete content
router.delete('/:id', async (req, res) => {
  const deleted = await Content.findOneAndDelete({ contentId: req.params.id });
  if (!deleted) return res.status(404).json({ error: 'Not found' });
  res.json({ message: 'Deleted' });
});

export default router; 