const express = require('express');
const Message = require('../models/Message');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// @route   POST /api/messages/send
// @desc    Send a message
// @access  Private
router.post('/send', authMiddleware, async (req, res) => {
  try {
    const { recipientId, text } = req.body;

    if (!recipientId || !text) {
      return res.status(400).json({
        success: false,
        message: 'Recipient and text are required',
      });
    }

    const newMessage = await Message.create({
      sender: req.user._id,
      recipient: recipientId,
      text,
    });

    const populatedMessage = await newMessage.populate('sender', 'username profilePic');

    res.status(201).json({
      success: true,
      message: populatedMessage,
    });
  } catch (error) {
    console.error('❌ Send Message Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error sending message',
      error: error.message,
    });
  }
});

// @route   GET /api/messages/conversations
// @desc    Get list of users you have chatted with
// @access  Private
router.get('/conversations', authMiddleware, async (req, res) => {
  try {
    // Find all messages where user is sender or recipient
    const messages = await Message.find({
      $or: [{ sender: req.user._id }, { recipient: req.user._id }],
    }).sort({ createdAt: -1 });

    // Extract unique user IDs
    const userIds = new Set();
    messages.forEach((msg) => {
      const otherUserId =
        msg.sender.toString() === req.user._id.toString()
          ? msg.recipient.toString()
          : msg.sender.toString();
      userIds.add(otherUserId);
    });

    // Fetch user details for these IDs
    const users = await User.find({ _id: { $in: Array.from(userIds) } }).select(
      'username profilePic'
    );

    // Map users to latest message (optional but good for UI)
    const conversations = users.map(user => {
      return {
        ...user.toObject(),
        // You could add last message logic here if needed
      };
    });

    res.status(200).json({
      success: true,
      conversations,
    });
  } catch (error) {
    console.error('❌ Get Conversations Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error fetching conversations',
      error: error.message,
    });
  }
});

// @route   GET /api/messages/:userId
// @desc    Get chat history with a specific user
// @access  Private
router.get('/:userId', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;

    const messages = await Message.find({
      $or: [
        { sender: req.user._id, recipient: userId },
        { sender: userId, recipient: req.user._id },
      ],
    })
      .sort({ createdAt: 1 }) // Oldest first
      .populate('sender', 'username profilePic');

    res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error('❌ Get Chat History Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error fetching chat history',
      error: error.message,
    });
  }
});

module.exports = router;
