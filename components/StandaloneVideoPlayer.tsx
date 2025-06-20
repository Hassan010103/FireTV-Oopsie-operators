
import React, { useState, useEffect, useRef } from 'react';
import { Content } from '../types';
import PeakWatchGraph from './PeakWatchGraph.tsx';
import PeakMomentsList from './PeakMomentsList.tsx'; 

interface StandaloneVideoPlayerProps {
  content: Content;
  onClose: () => void;
  onOpenCreateSnapModal: (content: Content, currentTime: number) => void;
  isCreateSnapModalOpen?: boolean; // New prop to know if the snap modal is active
}

// Icons
const PlayIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
  </svg>
);
const PauseIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z" clipRule="evenodd" />
  </svg>
);
const RectangleStackIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path d="M3 3.5A1.5 1.5 0 014.5 2h11A1.5 1.5 0 0117 3.5v5a.5.5 0 01-1 0v-5A.5.5 0 0015.5 3H4.5A.5.5 0 004 3.5v10a.5.5 0 00.5.5h5a.5.5 0 010 1h-5A1.5 1.5 0 013 13.5v-10z" />
    <path d="M10.5 9A1.5 1.5 0 009 10.5v5A1.5 1.5 0 0010.5 17h5A1.5 1.5 0 0017 15.5v-5A1.5 1.5 0 0015.5 9h-5zm.5 1.5h4v4h-4v-4z" />
  </svg>
);
const VolumeUpIcon: React.FC<{ className?: string }> = ({ className="w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path d="M7.788 3.05A1.5 1.5 0 006 4.308v11.384a1.5 1.5 0 001.788 1.258l6.197-2.448a1.5 1.5 0 00.962-1.258V6.756a1.5 1.5 0 00-.962-1.258L7.787 3.05zM14.5 6.5a.5.5 0 00-.5.5v6a.5.5 0 00.5.5c.276 0 .5-.224.5-.5V7a.5.5 0 00-.5-.5z" />
    <path d="M16 5.5a.5.5 0 01.5-.5c.276 0 .5.224.5.5v9a.5.5 0 01-.5.5c-.276 0-.5-.224-.5-.5v-9z" />
  </svg>
);
const VolumeOffIcon: React.FC<{ className?: string }> = ({ className="w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path d="M7.788 3.05A1.5 1.5 0 006 4.308v11.384a1.5 1.5 0 001.788 1.258l6.197-2.448a1.5 1.5 0 00.962-1.258V6.756a1.5 1.5 0 00-.962-1.258L7.787 3.05z" />
    <path fillRule="evenodd" d="M14.605 3.733a.75.75 0 00-1.06 1.06L14.586 5.8H14.5a.75.75 0 000 1.5h.086l-1.978 1.978A.75.75 0 0013.672 10.5l2.697-2.697a.75.75 0 00-1.06-1.06l-2.698 2.697a.75.75 0 101.061 1.061L16.328 7.87a.75.75 0 00-1.06-1.06l-2.635 2.634a.75.75 0 101.06 1.06l2.636-2.635a.75.75 0 000-1.06L14.605 3.733zM15.5 13.586V12.5a.75.75 0 00-1.5 0v1.086l-1.978-1.978A.75.75 0 0011.086 12.7L12.5 14.114l-1.414 1.414a.75.75 0 001.06 1.06L13.56 15.172l1.415 1.414a.75.75 0 001.06-1.06l-1.414-1.414 1.414-1.414a.75.75 0 00-1.06-1.06L15.5 13.586z" clipRule="evenodd" />
  </svg>
);
const XMarkIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);
const CameraIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M1.5 6.375c0-1.036.84-1.875 1.875-1.875h13.25c1.035 0 1.875.84 1.875 1.875v7.25c0 1.035-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 13.625v-7.25zM3 13.625c0 .207.168.375.375.375h13.25a.375.375 0 00.375-.375v-7.25A.375.375 0 0016.625 6H3.375a.375.375 0 00-.375.375v7.25z" clipRule="evenodd" />
      <path fillRule="evenodd" d="M10 8a2.5 2.5 0 100 5 2.5 2.5 0 000-5zM4.625 7.5a.625.625 0 100-1.25.625.625 0 000 1.25zM10 12a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" clipRule="evenodd" />
      <path d="M14.25 7.875a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25z" />
    </svg>
);


const StandaloneVideoPlayer: React.FC<StandaloneVideoPlayerProps> = ({ content, onClose, onOpenCreateSnapModal, isCreateSnapModalOpen }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true); 
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(content.duration || 0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<number | null>(null);
  const [activePeakLabel, setActivePeakLabel] = useState<string | null>(null);
  const peakLabelTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video && content.videoUrl && !isCreateSnapModalOpen) { // Only play if snap modal is not open
      video.play().catch(error => {
        console.warn("Autoplay prevented for new content:", error);
        setIsPlaying(false); // Update state if autoplay fails
      });
    } else if (video && isCreateSnapModalOpen && !video.paused) {
        video.pause(); // Pause if snap modal opens
    }
  }, [content.videoUrl, isCreateSnapModalOpen]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // If snap modal opens, pause the video
    if (isCreateSnapModalOpen && !video.paused) {
      video.pause();
    }
    // If snap modal closes and video was playing (or meant to be), resume
    // This part is tricky, might need to store pre-modal state or just leave it paused for user to resume.
    // For now, let's keep it simple: player pauses when snap modal opens. User can manually resume.

  }, [isCreateSnapModalOpen]);


  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => {
        if (video.duration && video.duration !== Infinity) {
            setDuration(video.duration);
        } else if (content.duration) { 
            setDuration(content.duration);
        }
    }
    const updatePlaying = () => setIsPlaying(!video.paused);
    const updateVolume = () => {
      setVolume(video.volume);
      setIsMuted(video.muted);
    };

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('durationchange', updateDuration);
    video.addEventListener('play', updatePlaying);
    video.addEventListener('pause', updatePlaying);
    video.addEventListener('volumechange', updateVolume);
    
    if (video.readyState >= 1 && video.duration && video.duration !== Infinity) {
        updateDuration();
    } else if (content.duration) {
        setDuration(content.duration);
    }
    
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    if (isPlaying && !isCreateSnapModalOpen) { // Only hide controls if playing AND snap modal is not open
      controlsTimeoutRef.current = window.setTimeout(() => setShowControls(false), 3000);
    } else {
      setShowControls(true); 
    }

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
      video.removeEventListener('durationchange', updateDuration);
      video.removeEventListener('play', updatePlaying);
      video.removeEventListener('pause', updatePlaying);
      video.removeEventListener('volumechange', updateVolume);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
      if (peakLabelTimeoutRef.current) clearTimeout(peakLabelTimeoutRef.current);
    };
  }, [isPlaying, content.duration, isCreateSnapModalOpen]); 


  useEffect(() => {
    if (!content.peakWatchData || duration <= 0) {
      setActivePeakLabel(null);
      return;
    }

    const currentPeak = content.peakWatchData.find(peak => {
      if (peak.label) {
        const peakTime = peak.timestampPercent * duration;
        return currentTime >= peakTime - 1.5 && currentTime <= peakTime + 1.5;
      }
      return false;
    });

    if (peakLabelTimeoutRef.current) {
        clearTimeout(peakLabelTimeoutRef.current);
    }

    if (currentPeak && currentPeak.label) {
      setActivePeakLabel(currentPeak.label);
      peakLabelTimeoutRef.current = window.setTimeout(() => {
        setActivePeakLabel(null);
      }, 4000); 
    }
  }, [currentTime, duration, content.peakWatchData]);


  const togglePlayPause = () => {
    const video = videoRef.current;
    if (video) {
      if (video.paused) video.play().catch(err => console.error("Play error:", err));
      else video.pause();
    }
  };

  const handleSeek = (time: number) => {
    setCurrentTime(time);
    if (videoRef.current) videoRef.current.currentTime = time;
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    setIsMuted(false);
    if (videoRef.current) {
      videoRef.current.volume = vol;
      videoRef.current.muted = false;
    }
  };

  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    if (videoRef.current) videoRef.current.muted = newMutedState;
  };

  const togglePiP = async () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.readyState === video.HAVE_NOTHING) { 
        alert("Video metadata has not loaded. Picture-in-Picture cannot be initiated yet. Please wait for the video to start loading.");
        return;
    }

    if (!document.pictureInPictureEnabled) {
      alert("Picture-in-Picture is not supported by your browser.");
      return;
    }
    try {
      if (document.pictureInPictureElement === video) {
        await document.exitPictureInPicture();
      } else {
        await video.requestPictureInPicture();
      }
    } catch (error) {
      console.error("PiP error:", error);
      alert(`Could not toggle Picture-in-Picture: ${ (error instanceof Error) ? error.message : 'Unknown error'}`);
    }
  };
  
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    if (isPlaying && !isCreateSnapModalOpen) {
         controlsTimeoutRef.current = window.setTimeout(() => setShowControls(false), 3000);
    }
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleTriggerCreateSnap = () => {
    // Player should pause before opening snap modal
    if (videoRef.current && !videoRef.current.paused) {
        videoRef.current.pause();
    }
    onOpenCreateSnapModal(content, currentTime);
  };

  if (!content.videoUrl) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
        <div className="bg-slate-800 p-6 rounded-lg text-white text-center">
          <p>Error: Video URL is missing.</p>
          <button onClick={onClose} className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded">Close</button>
        </div>
      </div>
    );
  }

  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-[100] animate-fadeIn"
        onMouseMove={handleMouseMove}
        onClick={() => { if(!showControls) setShowControls(true);}}
    >
      <div className="absolute top-4 right-4 z-[101]">
        <button
          onClick={onClose}
          className="p-2 bg-slate-700/70 hover:bg-slate-600/90 rounded-full text-white transition-colors"
          aria-label="Close player"
        >
          <XMarkIcon />
        </button>
      </div>

      <div className="w-full max-w-4xl aspect-video relative">
        <video
          ref={videoRef}
          src={content.videoUrl}
          className="w-full h-full rounded-lg"
          onClick={!isCreateSnapModalOpen ? togglePlayPause : undefined} // Only allow click to toggle play/pause if snap modal is not open
        />
        
        {activePeakLabel && showControls && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-black/75 text-white text-sm px-3 py-1.5 rounded-md shadow-lg z-20 animate-fadeIn transition-opacity">
            {activePeakLabel}
          </div>
        )}

        <div 
            className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-3 sm:p-4 text-white transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
          {content.peakWatchData && duration > 0 && (
            <PeakWatchGraph
              peakData={content.peakWatchData}
              duration={duration}
              currentTime={currentTime}
            />
          )}
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={(e) => handleSeek(parseFloat(e.target.value))}
            className="w-full h-2 mb-2 bg-slate-600/50 rounded-lg appearance-none cursor-pointer accent-purple-500"
            style={{ position: 'relative', zIndex: 10 }}
            disabled={isCreateSnapModalOpen} // Disable seek if snap modal is open
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <button onClick={togglePlayPause} className="p-1.5 sm:p-2 hover:bg-slate-700/50 rounded-full" disabled={isCreateSnapModalOpen}>
                {isPlaying ? <PauseIcon className="w-5 h-5 sm:w-6 sm:h-6" /> : <PlayIcon className="w-5 h-5 sm:w-6 sm:h-6" />}
              </button>
              <button onClick={toggleMute} className="p-1.5 sm:p-2 hover:bg-slate-700/50 rounded-full" disabled={isCreateSnapModalOpen}>
                {isMuted || volume === 0 ? <VolumeOffIcon className="w-4 h-4 sm:w-5 sm:h-5" /> : <VolumeUpIcon className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-16 sm:w-24 h-1.5 bg-slate-500/50 rounded-lg appearance-none cursor-pointer accent-sky-400"
                disabled={isCreateSnapModalOpen}
              />
            </div>
            <div className="text-xs sm:text-sm">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <button 
                onClick={handleTriggerCreateSnap} 
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md flex items-center justify-center transition-transform transform hover:scale-105 disabled:opacity-70"
                title="Create Snap"
                disabled={isCreateSnapModalOpen}
              >
                  <CameraIcon className="w-5 h-5 mr-2" />
                  Create Snap
              </button>
              {document.pictureInPictureEnabled && (
                 <button onClick={togglePiP} className="p-1.5 sm:p-2 hover:bg-slate-700/50 rounded-full" title="Toggle Picture-in-Picture" disabled={isCreateSnapModalOpen}>
                    <RectangleStackIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                 </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="w-full max-w-4xl px-4">
        <p className="mt-3 text-center text-slate-300 text-lg font-semibold truncate">{content.title}</p>
        {content.peakWatchData && duration > 0 && (
          <PeakMomentsList
            peakData={content.peakWatchData}
            duration={duration}
            onSeek={handleSeek}
            className="mt-2"
          />
        )}
      </div>
    </div>
  );
};

export default StandaloneVideoPlayer;
