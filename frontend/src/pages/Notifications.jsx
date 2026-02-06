import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { Heart, MessageCircle, UserPlus, Bell } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
    markAllAsRead();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('http://localhost:5000/api/notifications', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNotifications(data.notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        'http://localhost:5000/api/notifications/mark-all-read',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  const handleNotificationClick = (notification) => {
    if (notification.type === 'follow') {
      navigate(`/profile/${notification.sender._id}`);
    } else if (notification.type === 'like' || notification.type === 'comment') {
      // Navigate to home, the post will be visible there
      navigate('/');
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'follow':
        return <UserPlus className="w-8 h-8 text-blue-500" />;
      case 'like':
        return <Heart className="w-8 h-8 text-red-500" />;
      case 'comment':
        return <MessageCircle className="w-8 h-8 text-green-500" />;
      default:
        return <Bell className="w-8 h-8 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <Sidebar />

      <div className="ml-64 min-h-screen">
        <div className="max-w-2xl mx-auto px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Notifications</h1>
            <p className="text-gray-400">Stay updated with your activity</p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {/* Empty State */}
          {!loading && notifications.length === 0 && (
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-12 text-center">
              <div className="w-20 h-20 bg-gray-800 border-2 border-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Bell className="w-10 h-10 text-gray-600" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">No notifications yet</h2>
              <p className="text-gray-400">
                When someone follows you, likes or comments on your posts, you'll see it here
              </p>
            </div>
          )}

          {/* Notifications List */}
          {!loading && notifications.length > 0 && (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification._id}
                  onClick={() => handleNotificationClick(notification)}
                  className="bg-gray-900 border border-gray-800 rounded-lg p-4 hover:bg-gray-800 transition-colors cursor-pointer flex items-center gap-4"
                >
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Sender Avatar */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center overflow-hidden">
                      {notification.sender?.profilePic ? (
                        <img
                          src={notification.sender.profilePic}
                          alt={notification.sender.username}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-white font-semibold text-lg">
                          {notification.sender?.username?.[0]?.toUpperCase() || 'U'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm">
                      <span className="font-semibold">{notification.sender?.username}</span>
                      {' '}
                      {notification.type === 'follow' && 'started following you'}
                      {notification.type === 'like' && 'liked your post'}
                      {notification.type === 'comment' && 'commented on your post'}
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </p>
                  </div>

                  {/* Post Thumbnail (for like/comment) */}
                  {notification.post?.image && (
                    <div className="flex-shrink-0">
                      <img
                        src={notification.post.image}
                        alt="Post"
                        className="w-12 h-12 object-cover rounded"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
