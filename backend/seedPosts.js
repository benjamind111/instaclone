const mongoose = require('mongoose');
const Post = require('./models/Post');
const User = require('./models/User');
require('dotenv').config();

// Sample post images from Unsplash
const sampleImages = [
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800',
  'https://images.unsplash.com/photo-1488161628813-04466f872be2?w=800',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800',
  'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=800',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800',
  'https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c?w=800',
];

const captions = [
  'Living my best life! ✨',
  'Good vibes only 🌟',
  'Making memories 📸',
  'Feeling grateful today 🙏',
  'Adventure awaits! 🌍',
  'Chasing dreams 💭',
  'Sunshine and smiles ☀️',
  'Stay positive! 💪',
  'New day, new opportunities 🌅',
  'Weekend mood 🎉',
  'Coffee and cozy vibes ☕',
  'Living in the moment ⏰',
  'Just another day in paradise 🏝️',
  'Smile more, worry less 😊',
  'Creating my own sunshine 🌞',
];

const seedPosts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');

    // Clear existing posts
    await Post.deleteMany({});
    console.log('🗑️  Cleared existing posts');

    // Get all users
    const users = await User.find({});
    
    if (users.length === 0) {
      console.log('❌ No users found. Please run seedUsers.js first!');
      process.exit(1);
    }

    console.log(`📝 Found ${users.length} users`);

    // Create posts for each user
    const posts = [];
    
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      // Create 3 posts per user
      for (let j = 0; j < 3; j++) {
        const imageIndex = (i * 3 + j) % sampleImages.length;
        const captionIndex = (i * 3 + j) % captions.length;
        
        posts.push({
          userId: user._id,
          image: sampleImages[imageIndex],
          caption: captions[captionIndex],
          likes: [], // Start with no likes
          comments: [],
          createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) // Random time in last 7 days
        });
      }
    }

    await Post.insertMany(posts);
    console.log(`✅ Created ${posts.length} posts!`);

    console.log('\n📊 Summary:');
    console.log(`- Users: ${users.length}`);
    console.log(`- Posts: ${posts.length}`);
    console.log(`- Images used: ${sampleImages.length} unique images`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding posts:', error);
    process.exit(1);
  }
};

seedPosts();
