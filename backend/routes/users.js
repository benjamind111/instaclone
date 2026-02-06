const express = require('express');
const User = require('../models/User');
const Notification = require('../models/Notification');
const Post = require('../models/Post');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');

const router = express.Router();

// @route   GET /api/users/search?q=query
// @desc    Search users by username
// @access  Private
router.get('/search', authMiddleware, async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim() === '') {
      return res.status(200).json({
        success: true,
        users: [],
      });
    }

    // Search users with case-insensitive regex
    const users = await User.find({
      username: { $regex: q, $options: 'i' },
    })
      .select('username profilePic bio')
      .limit(20);

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error('❌ Search Users Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error searching users',
      error: error.message,
    });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { bio, profilePic } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Update fields
    if (bio !== undefined) user.bio = bio;
    if (profilePic !== undefined) user.profilePic = profilePic;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        profilePic: user.profilePic,
        bio: user.bio,
      },
    });
  } catch (error) {
    console.error('❌ Update Profile Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error updating profile',
      error: error.message,
    });
  }
});

// @route   GET /api/users/:id
// @desc    Get user profile by ID
// @access  Private
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Get user's post count
    const postsCount = await Post.countDocuments({ userId: req.params.id });

    res.status(200).json({
      success: true,
      user: {
        ...user.toObject(),
        postsCount,
        followersCount: user.followers?.length || 0,
        followingCount: user.following?.length || 0,
      },
    });
  } catch (error) {
    console.error('❌ Get User Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error fetching user',
      error: error.message,
    });
  }
});

// @route   POST /api/users/:id/follow
// @desc    Toggle follow/unfollow on a user
// @access  Private
router.post('/:id/follow', authMiddleware, async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const currentUserId = req.user._id;

    // Can't follow yourself
    if (targetUserId === currentUserId.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot follow yourself',
      });
    }

    const targetUser = await User.findById(targetUserId);
    const currentUser = await User.findById(currentUserId);

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if already following
    const isFollowing = currentUser.following.includes(targetUserId);

    if (isFollowing) {
      // Unfollow: remove from arrays
      currentUser.following = currentUser.following.filter(
        (id) => id.toString() !== targetUserId
      );
      targetUser.followers = targetUser.followers.filter(
        (id) => id.toString() !== currentUserId.toString()
      );
    } else {
      // Follow: add to arrays
      currentUser.following.push(targetUserId);
      targetUser.followers.push(currentUserId);

      // Create notification
      await Notification.create({
        recipient: targetUserId,
        sender: currentUserId,
        type: 'follow',
        message: `${currentUser.username} started following you`,
      });
    }

    await currentUser.save();
    await targetUser.save();

    res.status(200).json({
      success: true,
      isFollowing: !isFollowing,
      followersCount: targetUser.followers.length,
      followingCount: targetUser.following.length,
    });
  } catch (error) {
    console.error('❌ Follow User Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error following user',
      error: error.message,
    });
  }
});

module.exports = router;
