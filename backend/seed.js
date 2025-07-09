// Seed script for MongoDB using backend models
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';
import Content from './src/models/Content.js';
import WatchParty from './src/models/WatchParty.js';

// --- MOCK DATA (copy from frontend/constants.ts or export as JSON) ---
// For this script, you should copy the relevant mock data from your frontend/constants.ts
// Example structure below (replace with your actual mock data):

const mockUsers = [
  {
    userId: 'user123_hassan',
    displayName: 'Hassan',
    avatarUrl: 'https://picsum.photos/seed/user123_hassan/100/100',
    passwordHash: '$2a$10$mockpasswordhash', // Use bcrypt hash for 'password' or set a default
    preferences: {
      genres: ['Action', 'Sci-Fi', 'Thriller', 'Comedy', 'Documentary', 'Sports'],
      platforms: ['Netflix', 'PrimeVideo', 'Hotstar', 'Youtube'],
      mood_history: ['Excited', 'Focused', 'Adventurous', 'Relaxed', 'Curious'],
    },
    viewing_history: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    friends: ['user456_priya', 'user789_ananya'],
    friendRequests: [],
  },
  // ...add other mock users (Priya, Ananya, etc.)
];

const mockContent = [
  {
    contentId: 'c001',
    title: 'The Lion King',
    platform: 'Hotstar',
    genre: ['Animation', 'Drama', 'Adventure'],
    rating: 8.5,
    duration: 88 * 60,
    thumbnailUrl: 'https://picsum.photos/seed/c001/400/225',
    bannerUrl: 'https://picsum.photos/seed/c001_banner/1280/720',
    description: 'This is a captivating Animation, Drama, Adventure about the lion king.',
    mood_tags: ['Nostalgic', 'Inspired'],
    cast: ['Famous Actor', 'Rising Star', 'Veteran Performer'],
    director: 'Acclaimed Director',
    year: 2019,
    deepLink: 'firetv://hotstar/content/c001',
    timestamp: new Date().toISOString(),
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
  },
  // ...add other mock content
];

const mockParties = [
  {
    sessionId: 'wp_xyz789',
    hostId: 'user123_hassan',
    participants: [
      { userId: 'user123_hassan', displayName: 'Hassan', avatarUrl: 'https://picsum.photos/seed/user123_hassan/100/100' },
      { userId: 'user456_priya', displayName: 'Priya', avatarUrl: 'https://picsum.photos/seed/user456_priya/100/100' },
    ],
    contentId: 'c001',
    content: null, // Will be populated after content insert
    currentTime: 0,
    status: 'paused',
    chat_messages: [],
    joinCode: 'MOVIE123',
    guessingGame: {
      isActive: false,
      guesses: [],
      revealGuesses: false,
      correctOptionIndex: undefined,
      scores: {},
    },
  },
  // ...add other mock parties
];

// --- END MOCK DATA ---

dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/firepulse';

async function seed() {
  await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to MongoDB');

  // Clear existing data
  await User.deleteMany({});
  await Content.deleteMany({});
  await WatchParty.deleteMany({});

  // Insert users
  await User.insertMany(mockUsers);
  console.log('Inserted users');

  // Insert content
  await Content.insertMany(mockContent);
  console.log('Inserted content');

  // Insert parties (populate content field)
  for (const party of mockParties) {
    const content = await Content.findOne({ contentId: party.contentId });
    party.content = content;
    await WatchParty.create(party);
  }
  console.log('Inserted watch parties');

  await mongoose.disconnect();
  console.log('Seeding complete!');
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
}); 