import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './src/models/User.js';

// Usage:
// node manageUsers.js list
// node manageUsers.js delete <userId>
// node manageUsers.js add <userId> <displayName> <password>

dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/firepulse';

async function main() {
  await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  const [,, cmd, ...args] = process.argv;

  if (cmd === 'list') {
    const users = await User.find({});
    console.log('All users:');
    users.forEach(u => console.log({ userId: u.userId, displayName: u.displayName }));
  } else if (cmd === 'delete') {
    const userId = args[0];
    if (!userId) return console.log('Usage: node manageUsers.js delete <userId>');
    const res = await User.deleteOne({ userId });
    console.log(`Deleted user ${userId}:`, res);
  } else if (cmd === 'add') {
    const [userId, displayName, password] = args;
    if (!userId || !displayName || !password) return console.log('Usage: node manageUsers.js add <userId> <displayName> <password>');
    const passwordHash = await bcrypt.hash(password, 10);
    const now = new Date().toISOString();
    const user = new User({
      userId,
      displayName,
      passwordHash,
      preferences: { genres: [], platforms: [], mood_history: [] },
      viewing_history: [],
      created_at: now,
      updated_at: now,
      friends: [],
      friendRequests: [],
    });
    await user.save();
    console.log(`Added user ${userId} with password ${password}`);
  } else {
    console.log('Usage:');
    console.log('  node manageUsers.js list');
    console.log('  node manageUsers.js delete <userId>');
    console.log('  node manageUsers.js add <userId> <displayName> <password>');
  }
  await mongoose.disconnect();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
}); 