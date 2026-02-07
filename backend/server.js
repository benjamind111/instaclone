require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import Routes
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/users');
const notificationRoutes = require('./routes/notifications');
const messageRoutes = require('./routes/messages');
const storyRoutes = require('./routes/stories');

const app = express();

// ====================================================================
// 1. DEBUGGING MIDDLEWARE (Logs the Origin of every request)
// ====================================================================
app.use((req, res, next) => {
  console.log(`[Incoming Request] Method: ${req.method} | Origin: ${req.headers.origin} | URL: ${req.url}`);
  next();
});

// ====================================================================
// 2. CORS CONFIGURATION (CRITICAL: MUST BE BEFORE ROUTES)
// ====================================================================
const allowedOrigins = [
  "https://instaclone-murex.vercel.app", // Your Vercel Frontend (Production)
  "http://localhost:5173",               // Vite Localhost (Development)
  "http://localhost:5000"                // Postman/Local Backend testing
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.error(`[CORS BLOCKED] Origin: ${origin} not allowed.`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow cookies/headers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
};

// Apply CORS Middleware
app.use(cors(corsOptions));

// Handle Preflight Requests explicitly
app.options(/.*/, cors(corsOptions));

// ====================================================================
// 3. STANDARD MIDDLEWARE
// ====================================================================
app.use(express.json({ limit: '50mb' })); // Increased limit for image uploads
app.use(express.urlencoded({ extended: true }));

// ====================================================================
// 4. DATABASE CONNECTION
// ====================================================================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// ====================================================================
// 5. ROUTES
// ====================================================================
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/stories', storyRoutes);

// Health Check Endpoint (Useful for Render to know app is alive)
app.get('/', (req, res) => {
  res.send('Instagram Clone API is running live 🚀');
});

// ====================================================================
// 6. SERVER START
// ====================================================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🛡️  CORS Enabled for: ${allowedOrigins.join(', ')}`);
});