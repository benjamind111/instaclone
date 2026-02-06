const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const Story = require('../models/Story');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Configure Multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
});

// @route   POST /api/stories/create
// @desc    Create a new story
// @access  Private
router.post('/create', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Image is required',
      });
    }

    // Upload to Cloudinary
    const uploadPromise = new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'instagram-stories' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });

    const cloudinaryResult = await uploadPromise;

    // Create story with 24-hour expiration
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    
    const newStory = await Story.create({
      userId: req.user._id,
      image: cloudinaryResult.secure_url,
      expiresAt,
    });

    const populatedStory = await newStory.populate('userId', 'username profilePic');

    res.status(201).json({
      success: true,
      story: populatedStory,
    });
  } catch (error) {
    console.error('❌ Create Story Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error creating story',
      error: error.message,
    });
  }
});

// @route   GET /api/stories
// @desc    Get active stories from users you follow (including your own)
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);
    
    // Get stories from following + self
    const userIds = [...currentUser.following, req.user._id];

    const stories = await Story.find({
      userId: { $in: userIds },
      expiresAt: { $gt: new Date() }, // Only active stories
    })
      .populate('userId', 'username profilePic')
      .sort({ createdAt: -1 });

    // Group by user
    const groupedStories = {};
    stories.forEach((story) => {
      const userId = story.userId._id.toString();
      if (!groupedStories[userId]) {
        groupedStories[userId] = {
          user: story.userId,
          stories: [],
        };
      }
      groupedStories[userId].stories.push(story);
    });

    res.status(200).json({
      success: true,
      stories: Object.values(groupedStories),
    });
  } catch (error) {
    console.error('❌ Get Stories Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error fetching stories',
      error: error.message,
    });
  }
});

// @route   GET /api/stories/user/:id
// @desc    Get specific user's active stories
// @access  Private
router.get('/user/:id', authMiddleware, async (req, res) => {
  try {
    const stories = await Story.find({
      userId: req.params.id,
      expiresAt: { $gt: new Date() },
    })
      .populate('userId', 'username profilePic')
      .sort({ createdAt: 1 }); // Oldest first for viewing

    res.status(200).json({
      success: true,
      stories,
    });
  } catch (error) {
    console.error('❌ Get User Stories Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error fetching user stories',
      error: error.message,
    });
  }
});

module.exports = router;
