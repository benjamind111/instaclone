import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import API_URL from '../config';
import Sidebar from '../components/Sidebar';
import EditProfile from '../components/EditProfile';
import PostCard from '../components/PostCard';
import { Heart, MessageCircle, X, Grid3X3 } from 'lucide-react';

const Profile = () => {
  const { id } = useParams();
  const { user: currentUser, login } = useAuth();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    fetchProfile();
    fetchUserPosts();
  }, [id]);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(`${API_URL}/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(data.user);
      
      // Check if current user is following this profile
      setIsFollowing(data.user.followers?.includes(currentUser?._id) || false);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPosts = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(`${API_URL}/posts/user/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(data.posts);
    } catch (error) {
      console.error('Error fetching user posts:', error);
    }
  };

  const handleFollow = async () => {
    if (isFollowLoading) return;

    const previousFollowing = isFollowing;
    const previousFollowersCount = user.followersCount;

    // Optimistic update
    setIsFollowing(!isFollowing);
    setUser({
      ...user,
      followersCount: isFollowing ? user.followersCount - 1 : user.followersCount + 1,
    });
    setIsFollowLoading(true);

    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post(
        `${API_URL}/users/${id}/follow`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update with server response
      setUser({
        ...user,
        followersCount: data.followersCount,
      });
      setIsFollowing(data.isFollowing);
    } catch (error) {
      console.error('Error following user:', error);
      // Revert on error
      setIsFollowing(previousFollowing);
      setUser({
        ...user,
        followersCount: previousFollowersCount,
      });
    } finally {
      setIsFollowLoading(false);
    }
  };

  const handleProfileUpdate = (updatedUser) => {
    setUser({
      ...user,
      bio: updatedUser.bio,
      profilePic: updatedUser.profilePic,
    });
    
    // Update AuthContext with new user data
    const token = localStorage.getItem('token');
    login(updatedUser, token);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex">
        <Sidebar />
        <div className="flex-1 ml-64 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  const isOwnProfile = currentUser?._id === id;

  return (
    <div className="min-h-screen bg-black">
      <Sidebar />

      <div className="ml-64 min-h-screen">
        <div className="max-w-4xl mx-auto px-8 py-12">
          {/* Profile Header */}
          <div className="flex items-start gap-12 mb-12">
            {/* Profile Picture */}
            <div className="w-40 h-40 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center overflow-hidden flex-shrink-0">
              {user?.profilePic ? (
                <img
                  src={user.profilePic}
                  alt={user.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white font-bold text-5xl">
                  {user?.username?.[0]?.toUpperCase() || 'U'}
                </span>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-center gap-6 mb-6">
                <h1 className="text-white text-3xl font-light">{user?.username}</h1>
                
                {isOwnProfile ? (
                  <button 
                    onClick={() => setShowEditModal(true)}
                    className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Edit profile
                  </button>
                ) : (
                  <button
                    onClick={handleFollow}
                    disabled={isFollowLoading}
                    className={`px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 ${
                      isFollowing
                        ? 'bg-gray-800 hover:bg-gray-700 text-white'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                  >
                    {isFollowLoading ? 'Loading...' : isFollowing ? 'Following' : 'Follow'}
                  </button>
                )}
              </div>

              {/* Stats */}
              <div className="flex gap-10 mb-6">
                <div className="text-white">
                  <span className="font-semibold">{user?.postsCount || 0}</span>{' '}
                  <span className="text-gray-400">posts</span>
                </div>
                <div className="text-white">
                  <span className="font-semibold">{user?.followersCount || 0}</span>{' '}
                  <span className="text-gray-400">followers</span>
                </div>
                <div className="text-white">
                  <span className="font-semibold">{user?.followingCount || 0}</span>{' '}
                  <span className="text-gray-400">following</span>
                </div>
              </div>

              {/* Bio */}
              {user?.bio && (
                <div className="text-white">
                  <p className="whitespace-pre-wrap">{user.bio}</p>
                </div>
              )}
            </div>
          </div>

          {/* Posts Grid Header */}
          <div className="border-t border-gray-800 pt-8">
            <div className="flex items-center justify-center gap-2 text-white font-medium mb-8">
              <Grid3X3 className="w-4 h-4" />
              <span className="text-xs tracking-widest">POSTS</span>
            </div>

            {/* Posts Grid */}
            {posts.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 border-4 border-gray-800 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-4xl">📸</span>
                </div>
                <h2 className="text-3xl font-light text-white mb-2">No Posts Yet</h2>
                <p className="text-gray-500">
                  {isOwnProfile ? 'Share your first photo' : 'No posts to show'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-1">
                {posts.map((post) => (
                  <div
                    key={post._id}
                    onClick={() => setSelectedPost(post)}
                    className="relative aspect-square bg-gray-900 overflow-hidden group cursor-pointer"
                  >
                    <img
                      src={post.image}
                      alt="Post"
                      className="w-full h-full object-cover"
                    />
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6">
                      <div className="flex items-center gap-2 text-white">
                        <Heart className="w-6 h-6 fill-white" />
                        <span className="font-semibold">{post.likesCount}</span>
                      </div>
                      <div className="flex items-center gap-2 text-white">
                        <MessageCircle className="w-6 h-6 fill-white" />
                        <span className="font-semibold">{post.commentsCount}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Post Modal */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedPost(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-gray-900 hover:bg-gray-800 rounded-full flex items-center justify-center transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
            <PostCard 
              post={selectedPost} 
              onDelete={(postId) => {
                setPosts(posts.filter(p => p._id !== postId));
                setSelectedPost(null);
              }}
            />
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditModal && (
        <EditProfile
          user={user}
          onClose={() => setShowEditModal(false)}
          onUpdate={handleProfileUpdate}
        />
      )}
    </div>
  );
};

export default Profile;
