import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { Heart, MessageCircle, Compass } from 'lucide-react';

const Explore = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchExplorePosts();
  }, []);

  const fetchExplorePosts = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('http://localhost:5000/api/posts/explore', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPosts(data.posts);
    } catch (error) {
      console.error('Error fetching explore posts:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <Sidebar />

      <div className="ml-64 min-h-screen">
        <div className="max-w-6xl mx-auto px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Explore</h1>
            <p className="text-gray-400">Discover amazing content from the community</p>
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
              <div className="w-20 h-20 bg-gray-800 border-2 border-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Compass className="w-10 h-10 text-gray-600" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">No posts to explore</h2>
              <p className="text-gray-400">
                Check back later for new content
              </p>
            </div>
          )}

          {/* Posts Grid */}
          {!loading && posts.length > 0 && (
            <div className="grid grid-cols-3 gap-1">
              {posts.map((post) => (
                <div
                  key={post._id}
                  className="relative aspect-square bg-gray-900 overflow-hidden group cursor-pointer"
                >
                  {/* Post Image */}
                  <img
                    src={post.image}
                    alt="Post"
                    className="w-full h-full object-cover"
                  />

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-6">
                    <div className="flex items-center gap-2 text-white">
                      <Heart className="w-6 h-6 fill-white" />
                      <span className="font-semibold text-lg">{post.likesCount}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white">
                      <MessageCircle className="w-6 h-6 fill-white" />
                      <span className="font-semibold text-lg">{post.commentsCount}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Explore;
