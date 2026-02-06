const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const Post = require('../models/Post');
const User = require('../models/User');
const Notification = require('../models/Notification');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
});

// @route   POST /api/posts/upload-image
// @desc    Upload image to Cloudinary (reusable endpoint)
// @access  Private
router.post('/upload-image', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image',
      });
    }

    // Upload image to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'instagram-clone',
          resource_type: 'image',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });

    res.status(200).json({
      success: true,
      imageUrl: uploadResult.secure_url,
    });
  } catch (error) {
    console.error('❌ Image Upload Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error uploading image',
      error: error.message,
    });
  }
});

// @route   POST /api/posts/create
// @desc    Create a new post with image upload
// @access  Private
router.post('/create', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { caption } = req.body;

    // Check if image was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image',
      });
    }

    // Upload image to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'instagram-clone/posts',
          resource_type: 'image',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });

    // Create post
    const newPost = new Post({
      userId: req.user._id,
      image: uploadResult.secure_url,
      caption: caption || '',
    });

    await newPost.save();

    // Populate user info
    await newPost.populate('userId', 'username profilePic');

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      post: newPost,
    });
  } catch (error) {
    console.error('❌ Create Post Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error creating post',
      error: error.message,
    });
  }
});

// @route   GET /api/posts/feed
// @desc    Get all posts for feed
// @access  Private
router.get('/feed', authMiddleware, async (req, res) => {
  try {
    // Fetch all posts, sorted by newest first
    const posts = await Post.find()
      .populate('userId', 'username profilePic')
      .sort({ createdAt: -1 })
      .lean();

    // Add like and comment counts to each post
    const postsWithCounts = posts.map((post) => ({
      ...post,
      likesCount: post.likes?.length || 0,
      commentsCount: post.comments?.length || 0,
    }));

    res.status(200).json({
      success: true,
      posts: postsWithCounts,
    });
  } catch (error) {
    console.error('❌ Feed Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error fetching feed',
      error: error.message,
    });
  }
});

// @route   GET /api/posts/explore
// @desc    Get random posts for explore page
// @access  Private
router.get('/explore', authMiddleware, async (req, res) => {
  try {
    // Get random posts from all users
    const posts = await Post.aggregate([
      { $sample: { size: 30 } } // Get 30 random posts
    ]);

    // Populate user info and add counts
    const populatedPosts = await Post.populate(posts, {
      path: 'userId',
      select: 'username profilePic'
    });

    const postsWithCounts = populatedPosts.map((post) => ({
      ...post,
      likesCount: post.likes?.length || 0,
      commentsCount: post.comments?.length || 0,
    }));

    res.status(200).json({
      success: true,
      posts: postsWithCounts,
    });
  } catch (error) {
    console.error('❌ Explore Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error fetching explore posts',
      error: error.message,
    });
  }
});

// @route   GET /api/posts/user/:id
// @desc    Get all posts by a specific user
// @access  Private
router.get('/user/:id', authMiddleware, async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.params.id })
      .populate('userId', 'username profilePic')
      .sort({ createdAt: -1 })
      .lean();

    const postsWithCounts = posts.map((post) => ({
      ...post,
      likesCount: post.likes?.length || 0,
      commentsCount: post.comments?.length || 0,
    }));

    res.status(200).json({
      success: true,
      posts: postsWithCounts,
    });
  } catch (error) {
    console.error('❌ User Posts Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error fetching user posts',
      error: error.message,
    });
  }
});

// @route   PUT /api/posts/:id
// @desc    Update post caption
// @access  Private
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { caption } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Check ownership
    if (post.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only edit your own posts',
      });
    }

    post.caption = caption;
    await post.save();

    await post.populate('userId', 'username profilePic');

    res.status(200).json({
      success: true,
      message: 'Post updated successfully',
      post: {
        ...post.toObject(),
        likesCount: post.likes?.length || 0,
        commentsCount: post.comments?.length || 0,
      },
    });
  } catch (error) {
    console.error('❌ Update Post Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error updating post',
      error: error.message,
    });
  }
});

// @route   DELETE /api/posts/:id
// @desc    Delete post
// @access  Private
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Check ownership
    if (post.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own posts',
      });
    }

    await Post.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully',
    });
  } catch (error) {
    console.error('❌ Delete Post Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error deleting post',
      error: error.message,
    });
  }
});

// @route   POST /api/posts/:id/like
// @desc    Toggle like on a post
// @access  Private
router.post('/:id/like', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Check if user already liked the post
    const likeIndex = post.likes.indexOf(req.user._id);

    if (likeIndex > -1) {
      // Unlike: remove user from likes array
      post.likes.splice(likeIndex, 1);
    } else {
      // Like: add user to likes array
      post.likes.push(req.user._id);

      // Create notification (don't notify yourself)
      if (post.userId.toString() !== req.user._id.toString()) {
        await Notification.create({
          recipient: post.userId,
          sender: req.user._id,
          type: 'like',
          post: post._id,
          message: `${req.user.username} liked your post`,
        });
      }
    }

    await post.save();

    res.status(200).json({
      success: true,
      liked: likeIndex === -1,
      likesCount: post.likes.length,
    });
  } catch (error) {
    console.error('❌ Like Post Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error liking post',
      error: error.message,
    });
  }
});

// @route   POST /api/posts/:id/comment
// @desc    Add a comment to a post
// @access  Private
router.post('/:id/comment', authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Comment text is required',
      });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Create comment object
    const comment = {
      userId: req.user._id,
      text: text.trim(),
      createdAt: new Date(),
    };

    // Add comment to post
    post.comments.push(comment);
    await post.save();

    // Create notification (don't notify yourself)
    if (post.userId.toString() !== req.user._id.toString()) {
      await Notification.create({
        recipient: post.userId,
        sender: req.user._id,
        type: 'comment',
        post: post._id,
        message: `${req.user.username} commented on your post`,
      });
    }

    // Populate user info for the new comment
    await post.populate('comments.userId', 'username profilePic');

    // Get the newly added comment with user info
    const newComment = post.comments[post.comments.length - 1];

    res.status(201).json({
      success: true,
      comment: newComment,
      commentsCount: post.comments.length,
    });
  } catch (error) {
    console.error('❌ Comment Post Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error adding comment',
      error: error.message,
    });
  }
});

// @route   POST /api/posts/:id/save
// @desc    Toggle save/unsave on a post
// @access  Private
router.post('/:id/save', authMiddleware, async (req, res) => {
  try {
   const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    const user = await User.findById(req.user._id);
    const isSaved = user.savedPosts.includes(req.params.id);

    if (isSaved) {
      // Unsave: remove from array
      user.savedPosts = user.savedPosts.filter(
        (id) => id.toString() !== req.params.id
      );
    } else {
      // Save: add to array
      user.savedPosts.push(req.params.id);
    }

    await user.save();

    res.status(200).json({
      success: true,
      isSaved: !isSaved,
    });
  } catch (error) {
    console.error('❌ Save Post Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error saving post',
      error: error.message,
    });
  }
});

// @route   GET /api/posts/saved
// @desc    Get user's saved posts
// @access  Private
router.get('/saved', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'savedPosts',
      populate: {
        path: 'userId',
        select: 'username profilePic',
      },
      options: { sort: { createdAt: -1 } },
    });

    const postsWithCounts = user.savedPosts.map((post) => ({
      ...post.toObject(),
      likesCount: post.likes?.length || 0,
      commentsCount: post.comments?.length || 0,
    }));

    res.status(200).json({
      success: true,
      posts: postsWithCounts,
    });
  } catch (error) {
    console.error('❌ Get Saved Posts Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error fetching saved posts',
      error: error.message,
    });
  }
});

module.exports = router;
