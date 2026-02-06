import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import PostCard from '../components/PostCard';
import StoryViewer from '../components/StoryViewer';
import { Plus } from 'lucide-react';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [stories, setStories] = useState([]);
  const [viewingStories, setViewingStories] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
    fetchStories();
  }, []);

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('http://localhost:5000/api/posts/feed', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPosts(data.posts);
    } catch (error) {
      console.error('Error fetching feed:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStories = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('http://localhost:5000/api/stories', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStories(data.stories);
    } catch (error) {
      console.error('Error fetching stories:', error);
    }
  };

  const handleDeletePost = (postId) => {
    setPosts(posts.filter(post => post._id !== postId));
  };

  const handleStoryClick = async (userStories) => {
    setViewingStories(userStories.stories);
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="ml-64 min-h-screen">
        {/* Feed Section */}
        <div className="max-w-2xl mx-auto px-8 py-8">
          {/* Stories Row */}
          <div className="mb-8 overflow-x-auto">
            <div className="flex gap-4 pb-2">
              {/* Your Story / Add Story */}
              <div
                onClick={() => navigate('/create-story')}
                className="flex flex-col items-center cursor-pointer flex-shrink-0"
              >
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Plus className="w-8 h-8 text-white" />
                  </div>
                </div>
                <span className="text-xs text-white mt-1">Your Story</span>
              </div>

              {/* Other Users' Stories */}
              {stories.map((userStory, index) => (
                <div
                  key={index}
                  onClick={() => handleStoryClick(userStory)}
                  className="flex flex-col items-center cursor-pointer flex-shrink-0"
                >
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600">
                      <div className="w-full h-full bg-black rounded-full p-0.5">
                        {userStory.user.profilePic ? (
                          <img
                            src={userStory.user.profilePic}
                            alt={userStory.user.username}
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-700 rounded-full flex items-center justify-center text-white font-semibold">
                            {userStory.user.username[0].toUpperCase()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-white mt-1 max-w-[64px] truncate">
                    {userStory.user.username}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Welcome Message */}
          <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-lg p-6 mb-8 shadow-lg">
            <h1 className="text-3xl font-bold text-white mb-1">
              Welcome, {user?.username || 'User'}! 👋
            </h1>
            <p className="text-white text-opacity-90 text-sm">
              Share your moments and explore what others are posting
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {/* Empty State */}
          {!loading && posts.length === 0 && (
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-12 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-4xl">📸</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">No posts yet</h2>
              <p className="text-gray-400 mb-4">
                Be the first to share something amazing!
              </p>
              <a
                href="/create"
                className="inline-block px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Create Post
              </a>
            </div>
          )}

          {/* Posts Feed */}
          {!loading && posts.length > 0 && (
            <div className="space-y-6">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} onDelete={handleDeletePost} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Story Viewer */}
      {viewingStories && (
        <StoryViewer
          stories={viewingStories}
          onClose={() => setViewingStories(null)}
        />
      )}
    </div>
  );
};

export default Home;
