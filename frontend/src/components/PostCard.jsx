import { useState } from 'react';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import API_URL from '../config';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import EditPostModal from './EditPostModal';
import DeleteConfirmModal from './DeleteConfirmModal';

const PostCard = ({ post: initialPost, onDelete, onUnsave, initialSaved = false }) => {
  const [post, setPost] = useState(initialPost);
  const { userId, image, createdAt } = post;
  const { user } = useAuth();
  
  // State for likes
  const [liked, setLiked] = useState(post.likes?.includes(user?._id) || false);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [isLiking, setIsLiking] = useState(false);

  // State for comments
  const [comments, setComments] = useState(post.comments || []);
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);

  // State for edit/delete
  const [showDropdown, setShowDropdown] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // State for bookmark
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [isSaving, setIsSaving] = useState(false);

  const isOwnPost = userId?._id === user?._id;

  // Format timestamp
  const timeAgo = formatDistanceToNow(new Date(createdAt), { addSuffix: true });

  const handleLike = async () => {
    if (isLiking) return;

    const previousLiked = liked;
    const previousCount = likesCount;
    
    setLiked(!liked);
    setLikesCount(liked ? likesCount - 1 : likesCount + 1);
    setIsLiking(true);

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/posts/${post._id}/like`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (error) {
      console.error('Error liking post:', error);
      setLiked(previousLiked);
      setLikesCount(previousCount);
    } finally {
      setIsLiking(false);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || isCommenting) return;

    setIsCommenting(true);

    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post(
        `${API_URL}/posts/${post._id}/comment`,
        { text: commentText },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Add new comment to list
      setComments([...comments, data.comment]);
      setCommentText('');
      setShowComments(true);
    } catch (error) {
      console.error('Error posting comment:', error);
      alert(error.response?.data?.message || 'Failed to post comment');
    } finally {
      setIsCommenting(false);
    }
  };

  const handleEdit = async (newCaption) => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.put(
        `${API_URL}/posts/${post._id}`,
        { caption: newCaption },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setPost({ ...post, caption: newCaption });
      setShowEditModal(false);
    } catch (error) {
      console.error('Error editing post:', error);
      alert(error.response?.data?.message || 'Failed to edit post');
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/posts/${post._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setShowDeleteModal(false);
      if (onDelete) onDelete(post._id);
    } catch (error) {
      console.error('Error deleting post:', error);
      alert(error.response?.data?.message || 'Failed to delete post');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSave = async () => {
    if (isSaving) return;

    const previousSaved = isSaved;
    setIsSaved(!isSaved);
    setIsSaving(true);

    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post(
        `${API_URL}/posts/${post._id}/save`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setIsSaved(data.isSaved);
      
      // If unsaving from Saved page, remove from list
      if (!data.isSaved && onUnsave) {
        onUnsave(post._id);
      }
    } catch (error) {
      console.error('Error saving post:', error);
      setIsSaved(previousSaved);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-black border border-gray-800 rounded-lg mb-6 overflow-hidden">
      {/* Post Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center overflow-hidden">
            {userId?.profilePic ? (
              <img
                src={userId.profilePic}
                alt={userId.username}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-white font-semibold text-sm">
                {userId?.username?.[0]?.toUpperCase() || 'U'}
              </span>
            )}
          </div>

          <div>
            <p className="text-white font-semibold text-sm">{userId?.username || 'Unknown'}</p>
            <p className="text-gray-500 text-xs">{timeAgo}</p>
          </div>
        </div>

        {/* Three-dot menu (only on own posts) */}
        {isOwnPost && (
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="text-gray-400 hover:text-white transition"
            >
              <MoreHorizontal className="w-6 h-6" />
            </button>

            {showDropdown && (
              <div className="absolute right-0 top-8 bg-gray-800 border border-gray-700 rounded-lg overflow-hidden z-10 w-40">
                <button
                  onClick={() => {
                    setShowEditModal(true);
                    setShowDropdown(false);
                  }}
                  className="w-full px-4 py-3 text-left text-white hover:bg-gray-700 transition flex items-center gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => {
                    setShowDeleteModal(true);
                    setShowDropdown(false);
                  }}
                  className="w-full px-4 py-3 text-left text-red-500 hover:bg-gray-700 transition flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Post Image */}
      <div className="w-full bg-black">
        <img
          src={image}
          alt="Post"
          className="w-full object-contain max-h-[600px]"
        />
      </div>

      {/* Action Buttons */}
      <div className="p-4">
        <div className="flex items-center gap-4 mb-3">
          <button 
            onClick={handleLike}
            disabled={isLiking}
            className="hover:text-gray-300 transition group disabled:opacity-50"
          >
            <Heart 
              className={`w-7 h-7 group-hover:scale-110 transition-transform ${
                liked ? 'fill-red-500 text-red-500' : 'text-white'
              }`}
            />
          </button>
          <button 
            onClick={() => setShowComments(!showComments)}
            className="hover:text-gray-300 transition group"
          >
            <MessageCircle className="w-7 h-7 text-white group-hover:scale-110 transition-transform" />
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="ml-auto hover:text-gray-300 transition group"
          >
            <Bookmark className={`w-6 h-6 group-hover:scale-110 transition-transform ${
              isSaved ? 'fill-white text-white' : 'text-white'
            }`} />
          </button>
        </div>

        {/* Likes Count */}
        <p className="text-white font-semibold text-sm mb-2">
          {likesCount} {likesCount === 1 ? 'like' : 'likes'}
        </p>

        {/* Caption */}
        {post.caption && (
          <div className="text-white text-sm mb-2">
            <span className="font-semibold mr-2">{userId?.username}</span>
            <span className="text-gray-300">{post.caption}</span>
          </div>
        )}

        {/* Comments Count */}
        {comments.length > 0 && !showComments && (
          <button 
            onClick={() => setShowComments(true)}
            className="text-gray-500 text-sm hover:text-gray-400 transition"
          >
            View all {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
          </button>
        )}

        {/* Comments Display */}
        {showComments && comments.length > 0 && (
          <div className="mt-3 space-y-2 max-h-60 overflow-y-auto">
            {comments.map((comment, index) => (
              <div key={index} className="text-sm">
                <span className="text-white font-semibold mr-2">
                  {comment.userId?.username || 'Unknown'}
                </span>
                <span className="text-gray-300">{comment.text}</span>
              </div>
            ))}
          </div>
        )}

        {/* Comment Input */}
        <form onSubmit={handleComment} className="mt-3 flex items-center gap-2">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 bg-transparent text-white text-sm placeholder-gray-500 outline-none"
            disabled={isCommenting}
          />
          {commentText.trim() && (
            <button
              type="submit"
              disabled={isCommenting}
              className="text-blue-500 font-semibold text-sm hover:text-blue-400 transition disabled:opacity-50"
            >
              {isCommenting ? 'Posting...' : 'Post'}
            </button>
          )}
        </form>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <EditPostModal
          post={post}
          onClose={() => setShowEditModal(false)}
          onUpdate={handleEdit}
        />
      )}

      {/* Delete Confirm Modal */}
      {showDeleteModal && (
        <DeleteConfirmModal
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
};

export default PostCard;

