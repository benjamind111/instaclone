import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import API_URL from '../config';
import Sidebar from '../components/Sidebar';
import PostCard from '../components/PostCard';
import { Bookmark } from 'lucide-react';

const Saved = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchSavedPosts();
  }, []);

  const fetchSavedPosts = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(`${API_URL}/posts/saved`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPosts(data.posts);
    } catch (error) {
      console.error('Error fetching saved posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = (postId) => {
    setPosts(posts.filter((post) => post._id !== postId));
  };

  return (
    <div className="min-h-screen bg-black">
      <Sidebar />

      <div className="ml-64 min-h-screen">
        <div className="max-w-2xl mx-auto px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Saved Posts</h1>
            <p className="text-gray-400">Only you can see your saved posts</p>
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
                <Bookmark className="w-10 h-10 text-gray-600" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">No saved posts yet</h2>
              <p className="text-gray-400 mb-4">
                Save posts to easily find them later
              </p>
            </div>
          )}

          {/* Saved Posts */}
          {!loading && posts.length > 0 && (
            <div className="space-y-6">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} onUnsave={handleUnsave} initialSaved={true} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Saved;
