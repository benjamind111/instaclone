import { useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from '../config';
import { Home, Search, PlusSquare, Heart, Bookmark, Compass, User, LogOut, Send } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, [location.pathname]); // Refresh on navigation too

  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const { data } = await axios.get(`${API_URL}/notifications/unread-count`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUnreadCount(data.count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Search, label: 'Search', path: '/search' },
    { icon: Compass, label: 'Explore', path: '/explore' },
    { icon: Send, label: 'Messages', path: '/messages' },
    { icon: PlusSquare, label: 'Create', path: '/create' },
    { icon: Heart, label: 'Notifications', path: '/notifications', badge: unreadCount },
    { icon: Bookmark, label: 'Saved', path: '/saved' },
    { icon: User, label: 'Profile', path: `/profile/${user?._id}` },
  ];

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-black border-r border-gray-800 flex flex-col px-6 py-8">
      {/* Instagram Logo */}
      <div className="mb-10">
        <h1 className="text-white text-2xl font-serif tracking-wide">Instagram</h1>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.label}
              to={item.path}
              className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-colors duration-200 group relative ${
                isActive ? 'text-white font-bold' : 'text-white hover:bg-gray-900'
              }`}
            >
              <div className="relative">
                <Icon className={`w-6 h-6 ${isActive ? 'fill-current' : ''}`} />
                {item.label === 'Notifications' && unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center border-2 border-black">
                    <span className="text-[10px] font-bold text-white">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  </div>
                )}
              </div>
              <span className="text-base">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-4 px-4 py-3 text-white hover:bg-gray-900 rounded-lg transition-colors duration-200 mt-auto"
      >
        <LogOut className="w-6 h-6" />
        <span className="text-base font-normal">Log Out</span>
      </button>
    </div>
  );
};

export default Sidebar;
