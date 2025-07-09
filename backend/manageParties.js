import mongoose from 'mongoose';
import dotenv from 'dotenv';
import WatchParty from './src/models/WatchParty.js';

dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/firepulse';

async function main() {
  await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  const parties = await WatchParty.find({});
  console.log('All Watch Parties:');
  parties.forEach(party => {
    console.log({
      sessionId: party.sessionId,
      joinCode: party.joinCode,
      hostId: party.hostId,
      status: party.status,
      participants: party.participants.map(p => p.userId),
    });
  });
  await mongoose.disconnect();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
}); 