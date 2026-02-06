const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db'); // Import the DB connection

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json());
// backend/server.js

const corsOptions = {
  origin: [
    "http://localhost:5173", // Keep this for local development
    "https://instaclone-murex.vercel.app/" // 👈 PASTE YOUR VERCEL URL HERE
  ],
  credentials: true,
};

app.use(cors(corsOptions));

// Import Routes
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/users');
const notificationRoutes = require('./routes/notifications');
const messageRoutes = require('./routes/messages');
const storyRoutes = require('./routes/stories');

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/stories', storyRoutes);

// Test Route
app.get('/', (req, res) => {
  res.send('🚀 Instagram Clone Server is Running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
});