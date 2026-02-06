import { useEffect, useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import API_URL from '../config';
import Sidebar from '../components/Sidebar';
import { Send, User as UserIcon, Search } from 'lucide-react';

const Chat = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    let interval;
    if (activeChat) {
      fetchMessages(activeChat._id);
      interval = setInterval(() => fetchMessages(activeChat._id), 3000); // Poll every 3s
    }
    return () => clearInterval(interval);
  }, [activeChat]);

  useEffect(() => {
    if (searchQuery.trim()) {
      searchUsers();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(`${API_URL}/messages/conversations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setConversations(data.conversations);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setLoading(false);
    }
  };

  const searchUsers = async () => {
    try {
      setSearching(true);
      const token = localStorage.getItem('token');
      const { data } = await axios.get(`${API_URL}/users/search?q=${searchQuery}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSearchResults(data.users);
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setSearching(false);
    }
  };

  const fetchMessages = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(`${API_URL}/messages/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(data.messages);
      scrollToBottom();
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;

    try {
      const token = localStorage.getItem('token');
      const text = newMessage;
      setNewMessage(''); // Clear input immediately (optimistic)

      await axios.post(
        `${API_URL}/messages/send`,
        { recipientId: activeChat._id, text },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Refresh messages and conversations
      fetchMessages(activeChat._id);
      fetchConversations();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectUser = (selectedUser) => {
    setActiveChat(selectedUser);
    setSearchQuery('');
    setSearchResults([]);
  };

  const displayedList = searchQuery.trim() ? searchResults : conversations;

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />

      <div className="ml-64 flex-1 flex h-screen">
        {/* Conversations List */}
        <div className="w-1/3 border-r border-gray-800 flex flex-col">
          <div className="p-4 border-b border-gray-800">
            <h2 className="text-xl font-bold text-white mb-4">Messages</h2>
            
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search users..."
                className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">{displayedList.map((convo) => (
              <div
                key={convo._id}
                onClick={() => handleSelectUser(convo)}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                  activeChat?._id === convo._id ? 'bg-gray-800' : 'hover:bg-gray-900'
                }`}
              >
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-700 flex-shrink-0">
                  {convo.profilePic ? (
                    <img src={convo.profilePic} alt={convo.username} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white">
                      <UserIcon />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-white font-semibold">{convo.username}</h3>
                  <p className="text-gray-500 text-sm">
                    {searchQuery.trim() ? 'Start chatting' : 'Tap to chat'}
                  </p>
                </div>
              </div>
            ))}
            
            {displayedList.length === 0 && !loading && !searching && (
              <p className="text-gray-500 text-center mt-10">
                {searchQuery.trim() ? 'No users found' : 'No conversations yet. Search for a user to start chatting!'}
              </p>
            )}
            </div>
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col bg-black">
          {activeChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-700">
                   {activeChat.profilePic ? (
                    <img src={activeChat.profilePic} alt={activeChat.username} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white">
                       <UserIcon size={20} />
                    </div>
                  )}
                </div>
                <h3 className="text-white font-bold">{activeChat.username}</h3>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, index) => {
                   const isOwn = msg.sender._id === user._id; // Only check ID
                   return (
                    <div
                      key={index}
                      className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] px-4 py-2 rounded-2xl text-white ${
                          isOwn ? 'bg-blue-600 rounded-br-none' : 'bg-gray-800 rounded-bl-none'
                        }`}
                      >
                        <p>{msg.text}</p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-800 flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Message..."
                  className="flex-1 bg-gray-900 border border-gray-700 rounded-full px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-gray-500"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="p-2 text-blue-500 hover:text-blue-400 disabled:opacity-50 transition-colors"
                >
                  <Send size={24} />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <div className="w-24 h-24 border-2 border-white rounded-full flex items-center justify-center mb-4">
                 <Send size={48} className="text-white ml-2" />
              </div>
              <h2 className="text-2xl font-light text-white mb-2">Your Messages</h2>
              <p className="text-gray-400">Send private photos and messages to a friend or group.</p>
              <p className="text-gray-500 text-sm mt-4">Search/Click a user from the left to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
