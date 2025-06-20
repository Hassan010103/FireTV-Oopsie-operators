
import React, { useState, useEffect, useRef } from 'react';
import { Snap, UserProfile, Content } from '../types'; // Added Content
import { MOCK_CONTENTS } from '../constants'; // For finding video URLs

interface SnapStoryViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  snaps: Snap[];
  initialSnapIndex?: number;
  currentUser: UserProfile;
  onAddReaction: (snapId: string, emoji: string) => void;
  masterContentList: Content[]; 
  onNextCreator: () => void;
  onPrevCreator: () => void;
  hasNextCreator: boolean;
  hasPrevCreator: boolean;
}

const PREDEFINED_REACTIONS = ["🔥", "😂", "😱", "❤", "👍", "🤯"];

const ChevronLeftIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
  </svg>
);
const ChevronRightIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
  </svg>
);
const PauseIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}><path fillRule="evenodd" d="M5.75 4.5a.75.75 0 00-.75.75v9.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V5.25a.75.75 0 00-.75-.75H5.75zm8 0a.75.75 0 00-.75.75v9.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V5.25a.75.75 0 00-.75-.75h-1.5z" clipRule="evenodd" /></svg>
);
const PlayIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}><path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" /></svg>
);
const XMarkIconModal: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => ( 
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);


const SnapStoryViewerModal: React.FC<SnapStoryViewerModalProps> = ({
  isOpen,
  onClose,
  snaps,
  initialSnapIndex = 0,
  currentUser,
  onAddReaction,
  masterContentList,
  onNextCreator,
  onPrevCreator,
  hasNextCreator,
  hasPrevCreator
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialSnapIndex);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const progressIntervalRef = useRef<number | null>(null);
  const autoAdvanceTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    setCurrentIndex(initialSnapIndex);
  }, [initialSnapIndex, snaps]); 

  const currentSnap = snaps[currentIndex]; 

  useEffect(() => {
    if (!isOpen || !currentSnap) return;

    setProgress(0);
    setIsVideoPlaying(true); 
    
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    if (autoAdvanceTimeoutRef.current) clearTimeout(autoAdvanceTimeoutRef.current);

    const videoElement = videoRef.current;
    const snapVideoUrl = currentSnap.contentId 
        ? masterContentList.find(c => c.contentId === currentSnap.contentId)?.videoUrl 
        : currentSnap.videoUrl;

    let duration = 10000; 
    
    if (videoElement && snapVideoUrl) {
        videoElement.src = snapVideoUrl;
        videoElement.currentTime = 0; 
        videoElement.muted = true; 
        const playPromise = videoElement.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                setIsVideoPlaying(true);
                if(videoElement.duration && videoElement.duration !== Infinity) {
                    duration = Math.min(videoElement.duration * 1000, 10000); 
                }
            }).catch(() => setIsVideoPlaying(false)); 
        }
    } else if (videoElement) {
        videoElement.src = ''; 
    }


    const startTime = Date.now();
    progressIntervalRef.current = window.setInterval(() => {
      if(videoElement && videoElement.paused && isVideoPlaying) { 
          // Handled by setIsVideoPlaying(false) in handleVideoPlayPause.
      } else if (!isVideoPlaying) {
          return;
      }

      const elapsedTime = Date.now() - startTime;
      const currentProgress = Math.min((elapsedTime / duration) * 100, 100);
      setProgress(currentProgress);

      if (currentProgress >= 100) {
        if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
        handleNextSnapOrCreator();
      }
    }, 100); 

    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      if (autoAdvanceTimeoutRef.current) clearTimeout(autoAdvanceTimeoutRef.current);
      if (videoElement) {
        videoElement.pause();
        videoElement.src = ''; 
      }
    };
  }, [currentIndex, isOpen, snaps, currentSnap, masterContentList, isVideoPlaying]);


  if (!isOpen || !currentSnap) return null;

  const handleNextSnapOrCreator = () => {
    if (currentIndex < snaps.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else if (hasNextCreator) {
      onNextCreator();
    } else {
      onClose(); 
    }
  };

  const handlePrevSnapOrCreator = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    } else if (hasPrevCreator) {
      onPrevCreator();
    }
  };
  
  const handleVideoPlayPause = () => {
    const video = videoRef.current;
    if (video) {
        if (video.paused) {
            video.play().then(() => setIsVideoPlaying(true)).catch(()=>{ setIsVideoPlaying(false); });
        } else {
            video.pause();
            setIsVideoPlaying(false);
        }
    }
  };

  const userHasReactedWith = (emoji: string): boolean => {
    return currentSnap?.reactions?.some(r => r.userId === currentUser.userId && r.emoji === emoji) || false;
  };

  const getReactionCount = (emoji: string): number => {
    return currentSnap?.reactions?.filter(r => r.emoji === emoji).length || 0;
  };

  const snapVideoUrl = currentSnap.contentId 
    ? masterContentList.find(c => c.contentId === currentSnap.contentId)?.videoUrl 
    : currentSnap.videoUrl;
  
  const displayImageUrl = !snapVideoUrl ? currentSnap.imageUrl : '';

  const canGoNext = (currentIndex < snaps.length - 1) || hasNextCreator;
  const canGoPrev = (currentIndex > 0) || hasPrevCreator;

  return (
    <div 
        className="fixed inset-0 bg-black flex flex-col items-center justify-center z-[1000] p-0 animate-fadeIn"
        role="dialog"
        aria-modal="true"
        aria-labelledby="snap-creator-name" 
    >
        {/* Progress Bars container */}
        {snaps.length > 1 && ( // Only show progress for multiple snaps OF THE CURRENT CREATOR
          <div className="absolute top-3 left-2 right-2 flex space-x-1.5 px-1 z-[1002]">
            {snaps.map((_, index) => (
              <div key={index} className="flex-1 h-1 bg-white/40 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white transition-all duration-100 ease-linear" 
                  style={{ width: `${index < currentIndex ? 100 : (index === currentIndex ? progress : 0)}%` }}
                />
              </div>
            ))}
          </div>
        )}

        <div className="relative w-full h-[calc(100%-160px)] sm:h-[calc(100%-200px)] flex items-center justify-center overflow-hidden my-auto"> 
          {snapVideoUrl ? (
             <video ref={videoRef} className="max-w-full max-h-full object-contain" loop playsInline autoPlay muted />
          ) : displayImageUrl ? (
            <img src={displayImageUrl} alt={currentSnap.caption || "Snap"} className="max-w-full max-h-full object-contain" />
          ) : (
            <div className="w-full h-full bg-slate-900 flex items-center justify-center text-slate-500">No media to display</div>
          )}
        </div>

        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-[1001] pointer-events-auto">
            <div className="flex items-center">
              <img 
                src={currentSnap.creatorInfo.avatarUrl || `https://picsum.photos/seed/${currentSnap.creatorInfo.userId}/40/40`} 
                alt={currentSnap.creatorInfo.displayName}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full mr-2.5 border-2 border-white/60 object-cover shadow-md"
              />
              <div>
                <p id="snap-creator-name" className="text-white font-semibold text-sm sm:text-base drop-shadow-md">{currentSnap.creatorInfo.displayName}</p>
                <p className="text-gray-200 text-xs drop-shadow-sm">{new Date(currentSnap.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
              </div>
            </div>
            <button 
                onClick={onClose} 
                className="text-white/80 hover:text-white p-1.5 bg-black/30 rounded-full hover:bg-black/50 transition-colors"
                aria-label="Close story viewer"
            >
                <XMarkIconModal />
            </button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 z-[1001] pointer-events-auto flex flex-col items-center">
            {currentSnap.caption && (
              <p className="text-white text-sm sm:text-base bg-black/40 backdrop-blur-sm p-2.5 rounded-lg mb-3 shadow-md max-w-md w-full text-center">{currentSnap.caption}</p>
            )}
            {snapVideoUrl && (
                <button 
                    onClick={handleVideoPlayPause} 
                    className="mb-2 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                    aria-label={isVideoPlaying ? "Pause video" : "Play video"}
                >
                    {isVideoPlaying ? <PauseIcon className="w-5 h-5 sm:w-6 sm:h-6"/> : <PlayIcon className="w-5 h-5 sm:w-6 sm:h-6"/>}
                </button>
            )}
            <div className="flex items-center justify-center space-x-1.5 sm:space-x-2 overflow-x-auto pb-1 scrollbar-hide w-full max-w-md">
              {PREDEFINED_REACTIONS.map(emoji => {
                const count = getReactionCount(emoji);
                const reactedByCurrentUser = userHasReactedWith(emoji);
                return (
                  <button
                    key={emoji}
                    onClick={() => onAddReaction(currentSnap.id, emoji)}
                    className={"px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-full text-xs sm:text-sm flex items-center transition-all duration-150 " + 
                                (reactedByCurrentUser 
                                  ? 'bg-purple-600/90 text-white shadow-md ring-1 ring-purple-300/70 hover:bg-purple-500/90' 
                                  : 'bg-black/50 hover:bg-black/70 text-white/90 hover:text-white'
                                )}
                     aria-pressed={reactedByCurrentUser}
                     aria-label={"React with " + emoji + ", current count " + count}
                  >
                    <span className="text-lg sm:text-xl mr-1 sm:mr-1.5 transform group-hover:scale-110">{emoji}</span>
                    {count > 0 && <span className="font-semibold">{count}</span>}
                  </button>
                );
              })}
            </div>
        </div>

        {canGoPrev && (
          <button
            onClick={handlePrevSnapOrCreator} 
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-[1003] p-2 bg-black/30 hover:bg-black/50 rounded-full text-white transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Previous story or snap"
          >
            <ChevronLeftIcon className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>
        )}
        {canGoNext && (
          <button
            onClick={handleNextSnapOrCreator} 
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-[1003] p-2 bg-black/30 hover:bg-black/50 rounded-full text-white transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Next story or snap"
          >
            <ChevronRightIcon className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>
        )}
    </div>
  );
};

export default SnapStoryViewerModal;
