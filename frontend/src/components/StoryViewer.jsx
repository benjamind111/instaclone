import { X } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';

const StoryViewer = ({ stories, onClose, initialIndex = 0 }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const progressInterval = useRef(null);

  useEffect(() => {
    // Auto-advance every 5 seconds
    startProgress();
    return () => clearProgress();
  }, [currentIndex]);

  const startProgress = () => {
    setProgress(0);
    clearProgress();
    
    let currentProgress = 0;
    progressInterval.current = setInterval(() => {
      currentProgress += 2; // 2% every 100ms = 5 seconds total
      setProgress(currentProgress);
      
      if (currentProgress >= 100) {
        handleNext();
      }
    }, 100);
  };

  const clearProgress = () => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }
  };

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const midpoint = rect.width / 2;

    if (clickX < midpoint) {
      handlePrevious();
    } else {
      handleNext();
    }
  };

  const currentStory = stories[currentIndex];

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      {/* Header with progress bars */}
      <div className="absolute top-0 left-0 right-0 p-4 z-10">
        <div className="flex gap-1 mb-4">
          {stories.map((_, index) => (
            <div key={index} className="flex-1 h-1 bg-gray-600 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-100"
                style={{
                  width: index < currentIndex ? '100%' : index === currentIndex ? `${progress}%` : '0%',
                }}
              />
            </div>
          ))}
        </div>

        {/* User info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-700">
              {currentStory.userId.profilePic ? (
                <img
                  src={currentStory.userId.profilePic}
                  alt={currentStory.userId.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white text-xs">
                  {currentStory.userId.username[0].toUpperCase()}
                </div>
              )}
            </div>
            <span className="text-white font-semibold text-sm">{currentStory.userId.username}</span>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300 transition"
          >
            <X size={28} />
          </button>
        </div>
      </div>

      {/* Story image with tap zones */}
      <div
        onClick={handleClick}
        className="relative w-full h-full flex items-center justify-center cursor-pointer"
      >
        <img
          src={currentStory.image}
          alt="Story"
          className="max-w-full max-h-full object-contain"
        />
      </div>
    </div>
  );
};

export default StoryViewer;
