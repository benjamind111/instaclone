# 📸 InstaClone - Full Stack Instagram Clone

A fully-featured social media application built with the MERN stack that replicates core Instagram functionalities including posts, stories, messaging, and real-time interactions.

![MERN Stack](https://img.shields.io/badge/Stack-MERN-green?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Production%20Ready-success?style=for-the-badge)

---

## 🌟 Key Features

### Core Functionality
- 🔐 **User Authentication** - Secure JWT-based registration and login
- 📸 **Create Posts** - Upload images with captions using Cloudinary
- 📱 **Feed System** - Personalized feed showing posts from followed users
- ❤️ **Like & Comment** - Engage with posts through likes and comments
- 👤 **User Profiles** - View and edit profile with bio and profile picture
- 👥 **Follow/Unfollow** - Build your network and curate your feed

### Advanced Features
- 🔍 **User Search** - Find and connect with other users
- 🌟 **Explore Page** - Discover posts from users you don't follow
- 🔖 **Save Posts** - Bookmark posts for later viewing
- ✏️ **Edit/Delete Posts** - Full control over your content
- 🔔 **Notifications** - Get notified about likes, comments, and new followers
- 💬 **Direct Messaging** - Real-time chat with other users (polling-based)
- 📖 **Stories** - Share temporary content that expires after 24 hours
- 🎬 **Story Viewer** - Full-screen story viewer with progress bars and tap navigation

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library with hooks
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **date-fns** - Date formatting and manipulation

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **Cloudinary** - Image hosting and management
- **multer** - File upload handling
- **CORS** - Cross-origin resource sharing

### Deployment
- **Vercel** - Frontend hosting
- **Render** - Backend hosting
- **MongoDB Atlas** - Cloud database

---

## 📦 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas account)
- Cloudinary account (for image uploads)
- npm or yarn package manager

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/instaclone.git
cd instaclone
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:
```env
# MongoDB Connection
MONGO_URI=your_mongodb_connection_string

# JWT Secret (use a strong random string)
JWT_SECRET=your_jwt_secret_key_here

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Server Port
PORT=5000
```

Start the backend server:
```bash
npm start
```

The backend should now be running on `http://localhost:5000`

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

Update `frontend/src/config.js` if needed (already configured for dev/prod):
```javascript
const API_URL = import.meta.env.MODE === "production" 
  ? "https://your-backend-url.onrender.com/api" 
  : "http://localhost:5000/api";
```

Start the frontend development server:
```bash
npm run dev
```

The frontend should now be running on `http://localhost:5173`

---

## ⚙️ Configuration (Environment Variables)

### Backend Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/instaclone` |
| `JWT_SECRET` | Secret key for JWT tokens | `your_super_secret_key_12345` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | `your_cloud_name` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `123456789012345` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `abcdefghijklmnopqrstuvwxyz` |
| `PORT` | Server port number | `5000` |

### Frontend Configuration

The frontend uses a dynamic API URL configuration in `frontend/src/config.js`:
- **Development**: `http://localhost:5000/api`
- **Production**: Your Render backend URL

⚠️ **IMPORTANT**: Never commit real credentials to version control. Use the `.env` file for all sensitive data.

---

## ✅ How to Verify the Project is Working

Follow these steps to ensure everything is set up correctly:

### Backend Verification
1. **Check Server Status**
   - Navigate to `http://localhost:5000` in your browser
   - You should see: "🚀 Instagram Clone Server is Running!"

2. **Verify Database Connection**
   - Check your terminal for: "✅ MongoDB connected successfully"
   - If you see an error, verify your `MONGO_URI` in the `.env` file

3. **Test API Endpoints**
   - Use Postman or curl to test: `GET http://localhost:5000/`
   - Should receive a valid response

### Frontend Verification
1. **Access the Application**
   - Open `http://localhost:5173` in your browser
   - You should see the login/register page

2. **Register a New User**
   - Click "Sign up" or navigate to `/register`
   - Fill in username, email, and password
   - Click "Sign Up"
   - You should be redirected to the home feed

3. **Test Core Features**
   - **Create a Post**: Click "Create" → Upload image → Add caption → Post
   - **Like a Post**: Click the heart icon on any post
   - **Comment**: Click comment icon → Type message → Send
   - **Follow Users**: Search for users → Visit their profile → Click "Follow"
   - **Create Story**: Click the "+" on your story circle → Upload image
   - **Send Message**: Navigate to Messages → Search user → Send message
   - **Check Notifications**: Click the bell icon to view notifications

4. **Verify Responsive Design**
   - Resize browser window or use dev tools mobile view
   - All pages should adapt to different screen sizes

### Production Verification
1. **Frontend (Vercel)**
   - Visit your Vercel URL
   - Ensure all API calls work correctly
   - Check browser console for errors

2. **Backend (Render)**
   - Check Render dashboard logs
   - Look for origin logs: `📨 Request from origin: https://your-vercel-url`
   - Verify no CORS errors in browser console

---

## 🔐 Default Login Credentials

**(For testing purposes only - do not use in production)**

### Test Users
- **User 1**: `benjamin@gmail.com` / `123456`
- **User 2**: `selva@gmail.com` / `123456`

**Note**: Create your own users through the registration page for a personalized experience.

---

## 📁 Project Structure

```
instaclone/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT authentication
│   ├── models/
│   │   ├── User.js               # User schema
│   │   ├── Post.js               # Post schema
│   │   ├── Story.js              # Story schema (with TTL)
│   │   ├── Notification.js       # Notification schema
│   │   └── Message.js            # Message schema
│   ├── routes/
│   │   ├── auth.js               # Authentication routes
│   │   ├── posts.js              # Post CRUD operations
│   │   ├── users.js              # User operations
│   │   ├── notifications.js      # Notification management
│   │   ├── messages.js           # Messaging endpoints
│   │   └── stories.js            # Story operations
│   ├── .env.example              # Environment variables template
│   ├── server.js                 # Express app entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx       # Navigation sidebar
│   │   │   ├── PostCard.jsx      # Post display component
│   │   │   ├── StoryViewer.jsx   # Full-screen story viewer
│   │   │   ├── EditProfile.jsx   # Profile editor
│   │   │   └── ...
│   │   ├── pages/
│   │   │   ├── Home.jsx          # Main feed
│   │   │   ├── Profile.jsx       # User profile
│   │   │   ├── Login.jsx         # Login page
│   │   │   ├── Register.jsx      # Registration page
│   │   │   ├── Explore.jsx       # Explore page
│   │   │   ├── Chat.jsx          # Direct messages
│   │   │   ├── Notifications.jsx # Notifications
│   │   │   └── ...
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Authentication context
│   │   ├── config.js             # API URL configuration
│   │   ├── App.jsx               # Main app component
│   │   └── main.jsx              # Entry point
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## 🚀 Deployment

### Deploying Backend to Render

1. **Create a new Web Service** on Render
2. **Connect your GitHub repository**
3. **Configure build settings**:
   - Build Command: `npm install`
   - Start Command: `npm start`
4. **Add environment variables** in Render dashboard (all variables from `.env`)
5. **Deploy** and copy your backend URL

### Deploying Frontend to Vercel

1. **Install Vercel CLI**: `npm i -g vercel`
2. **Navigate to frontend directory**: `cd frontend`
3. **Update `config.js`** with your Render backend URL
4. **Deploy**: `vercel --prod`
5. **Add your Vercel URL** to backend CORS configuration

### Important Post-Deployment Steps

1. **Update CORS** in `backend/server.js`:
   ```javascript
   const corsOptions = {
     origin: [
       "http://localhost:5173",
       "https://your-vercel-url.vercel.app" // No trailing slash!
     ],
     credentials: true
   };
   ```

2. **Verify MongoDB connection** from Render dashboard
3. **Test all features** in production environment
4. **Monitor logs** for any errors

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] User registration and login
- [ ] Create post with image upload
- [ ] Like and unlike posts
- [ ] Add comments to posts
- [ ] Follow/unfollow users
- [ ] Edit profile (bio, profile picture)
- [ ] Search for users
- [ ] Save/unsave posts
- [ ] Create and view stories
- [ ] Send and receive direct messages
- [ ] View notifications
- [ ] Edit and delete own posts
- [ ] Explore page with all posts

---

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Posts
- `GET /api/posts/feed` - Get feed posts
- `GET /api/posts/explore` - Get explore posts
- `GET /api/posts/saved` - Get saved posts
- `GET /api/posts/user/:id` - Get user's posts
- `POST /api/posts/create` - Create new post
- `PUT /api/posts/:id` - Edit post
- `DELETE /api/posts/:id` - Delete post
- `POST /api/posts/:id/like` - Like/unlike post
- `POST /api/posts/:id/comment` - Add comment
- `POST /api/posts/:id/save` - Save/unsave post

### Users
- `GET /api/users/:id` - Get user profile
- `GET /api/users/search` - Search users
- `PUT /api/users/profile` - Update profile
- `POST /api/users/:id/follow` - Follow/unfollow user

### Notifications
- `GET /api/notifications` - Get all notifications
- `GET /api/notifications/unread-count` - Get unread count
- `PUT /api/notifications/mark-all-read` - Mark all as read

### Messages
- `GET /api/messages/conversations` - Get all conversations
- `GET /api/messages/:userId` - Get chat with user
- `POST /api/messages/send` - Send message

### Stories
- `GET /api/stories` - Get active stories
- `POST /api/stories/create` - Create story
- `POST /api/stories/:id/view` - Mark story as viewed

---

## 🎨 Features in Detail

### Stories System
- 24-hour auto-expiration using MongoDB TTL indexes
- Full-screen viewer with progress bars
- Tap navigation (left/right to navigate)
- Auto-advance every 5 seconds
- View tracking to show who viewed your story

### Notification System
- Real-time notifications for:
  - New followers
  - Likes on posts
  - Comments on posts
- Unread badge counter
- Mark all as read functionality

### Direct Messaging
- One-on-one conversations
- User search to start new chats
- Message history
- Polling-based updates (3-second intervals)
- Conversation list with last message preview

### Profile Management
- Edit bio
- Upload profile picture
- View followers/following count
- Posts grid layout
- Click posts to view in modal

---

## 🔧 Troubleshooting

### Common Issues

**1. CORS Errors in Production**
- Ensure Vercel URL in CORS config has NO trailing slash
- Verify both URLs are added to corsOptions array
- Check Render logs for origin verification

**2. MongoDB Connection Failed**
- Verify MONGO_URI is correct
- Check MongoDB Atlas network access settings
- Ensure IP whitelist includes `0.0.0.0/0` for Render

**3. Images Not Uploading**
- Verify Cloudinary credentials in `.env`
- Check Cloudinary upload preset is set to unsigned
- Ensure multer middleware is configured correctly

**4. JWT Token Errors**
- Clear localStorage and login again
- Verify JWT_SECRET matches on backend
- Check token expiration settings

**5. Stories Not Expiring**
- Verify MongoDB TTL index is created on Story collection
- Check server time zone settings
- Ensure `expiresAt` field is correctly set

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@benjamind111](https://github.com/benjamind111)
- Email: benjamindanieljr11@gmail.com

---

## 🙏 Acknowledgments

- Instagram for the design inspiration
- The MERN stack community for excellent documentation
- Cloudinary for image hosting services
- MongoDB Atlas for cloud database hosting

---

## 📸 Screenshots

*(Add screenshots of your application here)*

---

## 🔮 Future Enhancements

- [ ] WebSocket integration for real-time messaging
- [ ] Video post support
- [ ] Hashtag system
- [ ] Reels/IGTV functionality
- [ ] User mentions in comments
- [ ] Advanced search filters
- [ ] Email notifications
- [ ] Two-factor authentication
- [ ] Dark/Light theme toggle
- [ ] Multiple image carousel posts

---

## 📞 Support

If you have any questions or run into issues, please:
1. Check the troubleshooting section above
2. Search existing GitHub issues
3. Create a new issue with detailed information

---

**Built with ❤️ using the MERN Stack**
