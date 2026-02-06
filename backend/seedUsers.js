const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

const dummyUsers = [
  {
    username: 'kumar',
    email: 'kumar@test.com',
    password: 'password123',
    bio: '📸 Photography enthusiast | Travel lover',
    profilePic: '',
  },
  {
    username: 'alice',
    email: 'alice@test.com',
    password: 'password123',
    bio: '🎨 Digital artist | Creative mind',
    profilePic: '',
  },
  {
    username: 'bob',
    email: 'bob@test.com',
    password: 'password123',
    bio: '💻 Full-stack developer | Tech geek',
    profilePic: '',
  },
  {
    username: 'sara',
    email: 'sara@test.com',
    password: 'password123',
    bio: '✨ Lifestyle blogger | Fashionista',
    profilePic: '',
  },
  {
    username: 'john',
    email: 'john@test.com',
    password: 'password123',
    bio: '🏋️ Fitness coach | Healthy living',
    profilePic: '',
  },
];

const seedUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');

    // Check if users already exist
    const existingUsers = await User.find({
      username: { $in: dummyUsers.map((u) => u.username) },
    });

    if (existingUsers.length > 0) {
      console.log('⚠️  Some dummy users already exist. Skipping...');
      const existingUsernames = existingUsers.map((u) => u.username);
      console.log('Existing users:', existingUsernames.join(', '));
      process.exit(0);
    }

    // Hash passwords and create users
    const usersToCreate = await Promise.all(
      dummyUsers.map(async (user) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        return {
          ...user,
          password: hashedPassword,
        };
      })
    );

    // Insert users
    await User.insertMany(usersToCreate);

    console.log('✅ Dummy users created successfully!');
    console.log('\nYou can now login with:');
    dummyUsers.forEach((user) => {
      console.log(`  📧 ${user.email} / 🔑 ${user.password}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding users:', error.message);
    process.exit(1);
  }
};

seedUsers();
