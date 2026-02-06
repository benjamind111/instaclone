import { useState } from 'react';
import { X } from 'lucide-react';

const EditPostModal = ({ post, onClose, onUpdate }) => {
  const [caption, setCaption] = useState(post?.caption || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    onUpdate(caption);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl max-w-md w-full border border-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-white text-xl font-semibold">Edit Post</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Post Image Preview */}
          {post?.image && (
            <img
              src={post.image}
              alt="Post"
              className="w-full h-48 object-cover rounded-lg"
            />
          )}

          {/* Caption Input */}
          <div>
            <label className="text-white font-medium mb-2 block">Caption</label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write a caption..."
              rows={4}
              maxLength={2200}
              className="w-full bg-gray-800 text-white rounded-lg p-3 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
            <p className="text-gray-500 text-xs mt-1 text-right">
              {caption.length}/2200
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-gray-800">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPostModal;
