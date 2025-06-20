
import React, { useState, useEffect, useRef } from 'react';
import { WatchPartySession, UserProfile, ChatMessage, GuessingGame, GuessingGameGuess, Content, OngoingPartyDisplayItem, Platform } from '../types';
import PeakWatchGraph from './PeakWatchGraph.tsx';
import PeakMomentsList from './PeakMomentsList.tsx'; 
import { PLATFORM_BADGE_STYLES } from '../constants.ts';


interface LocalIconProps {
  className?: string;
  onClick?: () => void;
}

const PlayIcon: React.FC<LocalIconProps> = ({ className = "w-6 h-6", onClick }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} onClick={onClick}>
    <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
  </svg>
);
const PauseIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z" clipRule="evenodd" />
  </svg>
);
const SendIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path d="M3.105 3.105a.75.75 0 01.814-.102l14.25 8.25a.75.75 0 010 1.302l-14.25 8.25a.75.75 0 01-.814-.102A.75.75 0 013 20.25V4.75a.75.75 0 01.105-.645z" />
  </svg>
);

const RectangleStackIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path d="M3 3.5A1.5 1.5 0 014.5 2h11A1.5 1.5 0 0117 3.5v5a.5.5 0 01-1 0v-5A.5.5 0 0015.5 3H4.5A.5.5 0 004 3.5v10a.5.5 0 00.5.5h5a.5.5 0 010 1h-5A1.5 1.5 0 013 13.5v-10z" />
    <path d="M10.5 9A1.5 1.5 0 009 10.5v5A1.5 1.5 0 0010.5 17h5A1.5 1.5 0 0017 15.5v-5A1.5 1.5 0 0015.5 9h-5zm.5 1.5h4v4h-4v-4z" />
  </svg>
);

const GameIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M15.323 2.427a.75.75 0 01.636 1.028l-2.146 6.436a.75.75 0 01-1.35.242L9.88 5.038l-2.448 4.08a.75.75 0 01-1.298-.778l2.88-4.802a.75.75 0 011.298-.002L13 8.69l1.053-3.158a2.5 2.5 0 00-1.402-2.875.75.75 0 01.672-1.23zm-.612 4.975l.088-.028a.75.75 0 00-.228-1.462l-.088.028a.75.75 0 00.228 1.462z" clipRule="evenodd" />
        <path d="M4.18 9.962L2.75 7.528A2.5 2.5 0 002 9.254V15.5A2.5 2.5 0 004.5 18h11a2.5 2.5 0 002.5-2.5v-2.825a.75.75 0 01-1.5 0V15.5a1 1 0 01-1 1h-11a1 1 0 01-1-1V9.254a1 1 0 01.22-.626l.002-.003.002-.003z" />
        <path d="M6.75 11.25a.75.75 0 100-1.5.75.75 0 000 1.5zM9 10.5a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm2.25.75a.75.75 0 100-1.5.75.75 0 000 1.5zm2.25-1.5a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
    </svg>
);

const LightBulbIcon: React.FC<{ className?: string }> = ({ className="w-5 h-5" }) => ( // For Reveal
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2zM10 15a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 15zM10 7a3 3 0 100 6 3 3 0 000-6z" />
    <path fillRule="evenodd" d="M16.667 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5a.75.75 0 01.75.75zM5.083 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 015.083 10zM14.242 14.242a.75.75 0 010 1.06l-1.06 1.06a.75.75 0 01-1.06-1.06l1.06-1.06a.75.75 0 011.06 0zM6.879 6.879a.75.75 0 010 1.06l-1.06 1.06a.75.75 0 01-1.06-1.06l1.06-1.06a.75.75 0 011.06 0zM14.242 5.757a.75.75 0 01-1.06 0l-1.06-1.06a.75.75 0 011.06-1.06l1.06 1.06a.75.75 0 010 1.06zM5.757 14.242a.75.75 0 01-1.06 0l-1.06-1.06a.75.75 0 111.06-1.06l1.06 1.06a.75.75 0 010 1.06z" clipRule="evenodd" />
  </svg>
);
const CheckIcon: React.FC<{ className?: string }> = ({ className="w-4 h-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
  </svg>
);
const XMarkIconMini: React.FC<{ className?: string }> = ({ className="w-4 h-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
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

const UsersIconSolid: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path d="M10 9a3 3 0 100-6 3 3 0 000 6zM6 8a2 2 0 11-4 0 2 2 0 014 0zM1.49 15.326a.78.78 0 01-.358-.442 3 3 0 014.308-3.516 6.484 6.484 0 00-1.905 3.959c-.023.222-.014.442.025.654a4.97 4.97 0 01-2.07-.655zM16.44 15.98a4.97 4.97 0 002.071-.655A.78.78 0 0018.01 15c0-.212.009-.432.025-.654a6.483 6.483 0 00-1.905-3.96 3 3 0 014.308 3.516.78.78 0 01-.358.442zM13.5 8a2 2 0 11-4 0 2 2 0 014 0zM10 18a6 6 0 00-4.446-5.746C8.076 11.635 11.924 11.635 14.446 12.254A6 6 0 0010 18z" />
  </svg>
);


interface WatchPartyPanelProps {
  session: WatchPartySession | null; // Can be null if no active party
  currentUser: UserProfile;
  onLeaveParty: () => void;
  ongoingFriendParties: OngoingPartyDisplayItem[];
  onRequestJoinOngoingParty: (sessionId: string) => void;
  onViewPartyContentDetails: (content: Content) => void;
  onStartNewParty: () => void; // To open matcher options modal
  masterContentList: Content[]; // To enrich content in ongoing parties
}

const WatchPartyPanel: React.FC<WatchPartyPanelProps> = ({ 
    session: initialSession, 
    currentUser, 
    onLeaveParty,
    ongoingFriendParties,
    onRequestJoinOngoingParty,
    onViewPartyContentDetails,
    onStartNewParty,
    masterContentList
}) => {
  const [session, setSession] = useState<WatchPartySession | null>(initialSession);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(initialSession?.chat_messages || []);
  const [newMessage, setNewMessage] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playbackStatus, setPlaybackStatus] = useState<'playing' | 'paused'>(
    initialSession?.content?.videoUrl ? 'paused' : (initialSession?.status === 'playing' || initialSession?.status === 'paused' ? initialSession.status : 'paused')
  );
  const [currentTime, setCurrentTime] = useState(initialSession?.currentTime || 0);
  const [totalDuration, setTotalDuration] = useState<number>(initialSession?.content?.duration || 0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [activePeakLabel, setActivePeakLabel] = useState<string | null>(null);
  const peakLabelTimeoutRef = useRef<number | null>(null);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [selectedMcqOption, setSelectedMcqOption] = useState<number | null>(null);
  const [isHostSettingCorrectAnswer, setIsHostSettingCorrectAnswer] = useState<boolean>(false);
  const [hostSelectedCorrectOption, setHostSelectedCorrectOption] = useState<number | null>(null);
  

  useEffect(() => {
    setSession(initialSession);
    setChatMessages(initialSession?.chat_messages || []);
    setCurrentTime(initialSession?.currentTime || 0);
    setTotalDuration(initialSession?.content?.duration || 0);
    if (initialSession?.content?.videoUrl && videoRef.current) {
      setPlaybackStatus('paused'); 
      videoRef.current.currentTime = initialSession.currentTime;
    } else {
       setPlaybackStatus(initialSession?.status === 'playing' || initialSession?.status === 'paused' ? initialSession.status : 'paused');
    }
    if (initialSession?.guessingGame?.isActive && !initialSession.guessingGame.revealGuesses) {
        setSelectedMcqOption(null); 
    }
    setIsHostSettingCorrectAnswer(false); 
    setHostSelectedCorrectOption(null);
  }, [initialSession]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !session?.content?.videoUrl) return; 

    const handlePlay = () => setPlaybackStatus('playing');
    const handlePause = () => setPlaybackStatus('paused');
    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleLoadedMetadata = () => {
        if (video.duration && video.duration !== Infinity) {
             setTotalDuration(video.duration);
        } else if (session?.content?.duration) {
            setTotalDuration(session.content.duration);
        }
    }
    const handleVolumeChange = () => {
      setIsMuted(video.muted);
      setVolume(video.volume);
    };
    const handleError = () => {
      const error = video.error;
      let message = "An unknown video error occurred.";
      if (error) {
        switch (error.code) {
          case error.MEDIA_ERR_ABORTED: message = 'Video playback aborted.'; break;
          case error.MEDIA_ERR_NETWORK: message = 'A network error caused video download to fail.'; break;
          case error.MEDIA_ERR_DECODE: message = 'Video playback aborted due to a decoding error.'; break;
          case error.MEDIA_ERR_SRC_NOT_SUPPORTED: message = 'Video source not supported or found.'; break;
        }
      }
      setVideoError(message);
      setPlaybackStatus('paused');
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('durationchange', handleLoadedMetadata); 
    video.addEventListener('volumechange', handleVolumeChange);
    video.addEventListener('error', handleError);

    if (video.readyState >= 1 && video.duration && video.duration !== Infinity) {
        handleLoadedMetadata();
    } else if (session?.content?.duration) {
        setTotalDuration(session.content.duration);
    }

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('durationchange', handleLoadedMetadata);
      video.removeEventListener('volumechange', handleVolumeChange);
      video.removeEventListener('error', handleError);
      if (peakLabelTimeoutRef.current) clearTimeout(peakLabelTimeoutRef.current);
    };
  }, [session?.content?.videoUrl, session?.content?.duration]);
  
  useEffect(() => {
    if (!session?.content?.peakWatchData || totalDuration <= 0) {
      setActivePeakLabel(null);
      return;
    }

    const currentPeak = session.content.peakWatchData.find(peak => {
      if (peak.label) {
        const peakTime = peak.timestampPercent * totalDuration;
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
  }, [currentTime, totalDuration, session?.content?.peakWatchData]);


  useEffect(() => {
    if (session?.content?.videoUrl) return; 

    const interval = setInterval(() => {
      if (session && Math.random() < 0.1 && session.participants.length > 1) {
        const otherParticipants = session.participants.filter(p => p.userId !== currentUser.userId);
        if (otherParticipants.length > 0) {
          const randomParticipant = otherParticipants[Math.floor(Math.random() * otherParticipants.length)];
          const simulatedMessage: ChatMessage = {
            id: `msg-${Date.now()}-${Math.random()}`,
            userId: randomParticipant.userId,
            userName: randomParticipant.displayName,
            userAvatar: randomParticipant.avatarUrl,
            message: `Random thoughts... ${Math.random().toString(36).substring(7)}`,
            timestamp: new Date().toISOString(),
          };
          setChatMessages(prev => [...prev, simulatedMessage]);
        }
      }

      if (session && playbackStatus === 'playing' && !(session.guessingGame?.isActive)) {
        setCurrentTime(prevTime => {
            const newTime = prevTime + 1;
            if (totalDuration && newTime >= totalDuration) {
                setPlaybackStatus('paused'); 
                return totalDuration;
            }
            return newTime;
        });
      }
    }, 1000); 

    return () => clearInterval(interval);
  }, [playbackStatus, currentUser.userId, session, totalDuration]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !session) return;
    const message: ChatMessage = {
      id: `msg-${Date.now()}-${currentUser.userId}`,
      userId: currentUser.userId,
      userName: currentUser.displayName,
      userAvatar: currentUser.avatarUrl,
      message: newMessage,
      timestamp: new Date().toISOString(),
    };
    setChatMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const togglePlayback = () => {
    if (session?.guessingGame?.isActive && !session.guessingGame?.revealGuesses) {
        alert("Guessing game is active! Playback paused.");
        return;
    }
    const video = videoRef.current;
    if (video && session?.content?.videoUrl) {
      if (video.paused) video.play().catch(err => console.error("Play error:", err));
      else video.pause();
    } else {
      setPlaybackStatus(prev => prev === 'playing' ? 'paused' : 'playing');
    }
  };

  const handleSeek = (newTime: number) => {
    setCurrentTime(newTime);
    if (videoRef.current && session?.content?.videoUrl) {
      videoRef.current.currentTime = newTime;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(false);
    if (videoRef.current && session?.content?.videoUrl) {
      videoRef.current.volume = newVolume;
      videoRef.current.muted = false;
    }
  };

  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    if (videoRef.current && session?.content?.videoUrl) {
      videoRef.current.muted = newMutedState;
    }
  };

  const handleTogglePiP = async () => {
    const video = videoRef.current;
    if (!video || !session?.content?.videoUrl) {
        alert("Video element not found or not a real video for PiP.");
        return;
    }
    
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
        console.error("PiP Error:", error);
        alert(`Could not toggle PiP: ${ (error instanceof Error) ? error.message : 'Unknown error'}`);
    }
  };
  
  const handleStartGuessingGame = () => {
     if (!session) return;
     if (videoRef.current && session.content?.videoUrl && !videoRef.current.paused) {
        videoRef.current.pause();
    }
    setPlaybackStatus('paused');
    setIsHostSettingCorrectAnswer(false);
    setHostSelectedCorrectOption(null);
    setSelectedMcqOption(null);

    setSession(prevSession => ({
        ...prevSession!,
        guessingGame: {
            isActive: true,
            question: "Who is the main antagonist?",
            options: ["The shadowy figure", "The presumed ally", "The system itself", "There is no antagonist"],
            guesses: [],
            revealGuesses: false,
            correctOptionIndex: undefined,
            scores: {}
        }
    }));
  };

  const handleSetCorrectAnswerMode = () => {
    setIsHostSettingCorrectAnswer(true);
    setHostSelectedCorrectOption(null); // Reset selection
  };

  const handleConfirmCorrectAnswer = () => {
    if (hostSelectedCorrectOption === null || !session?.guessingGame) return;

    const newScores: Record<string, number> = {};
    session.guessingGame.guesses.forEach(guess => {
        newScores[guess.userId] = guess.selectedOptionIndex === hostSelectedCorrectOption ? 1 : 0;
    });

    setSession(prevSession => ({
        ...prevSession!,
        guessingGame: {
            ...prevSession!.guessingGame!,
            correctOptionIndex: hostSelectedCorrectOption,
            revealGuesses: true,
            scores: newScores,
        }
    }));
    setIsHostSettingCorrectAnswer(false);
  };

  const handleEndGuessingGame = () => { // This now fully resets/closes the game
    if (!session) return;
    setIsHostSettingCorrectAnswer(false);
    setHostSelectedCorrectOption(null);
    setSelectedMcqOption(null);
    setSession(prevSession => ({
        ...prevSession!,
        guessingGame: {
            isActive: false,
            question: undefined,
            options: undefined,
            guesses: [],
            revealGuesses: false,
            correctOptionIndex: undefined,
            scores: {}
        }
    }));
  };


  const handleMcqOptionSelect = (optionIndex: number) => {
    if (!session?.guessingGame?.isActive || session.guessingGame?.revealGuesses) return;
    setSelectedMcqOption(optionIndex); 

    const newGuess: GuessingGameGuess = {
        userId: currentUser.userId,
        userName: currentUser.displayName,
        userAvatar: currentUser.avatarUrl,
        selectedOptionIndex: optionIndex,
        timestamp: new Date().toISOString(),
    };
    setSession(prevSession => ({
        ...prevSession!,
        guessingGame: {
            ...prevSession!.guessingGame!,
            guesses: [...prevSession!.guessingGame!.guesses.filter(g => g.userId !== currentUser.userId), newGuess]
        }
    }));
  };


  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);
    let timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    if (hours > 0) {
        timeString = `${hours.toString().padStart(2, '0')}:${timeString}`;
    }
    return timeString;
  };

  const isHost = session ? currentUser.userId === session.hostId : false;
  const currentContent = session?.content as Content | null; 
  const game = session?.guessingGame;

  const renderGuessingGameUI = () => {
    if (!game || !game.isActive) return null;

    // UI for Host to set correct answer
    if (isHost && isHostSettingCorrectAnswer) {
        return (
            <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-30 p-4 rounded-md space-y-3">
                <h3 className="text-lg sm:text-xl font-bold text-purple-400 mb-1">Select the Correct Answer:</h3>
                <p className="text-sm text-slate-300 mb-2">{game.question}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md">
                    {game.options?.map((option, index) => (
                        <button
                            key={index}
                            onClick={() => setHostSelectedCorrectOption(index)}
                            className={`w-full py-2 px-3 rounded-md text-sm sm:text-base transition-colors
                                ${hostSelectedCorrectOption === index 
                                    ? 'bg-green-600 text-white ring-2 ring-green-300' 
                                    : 'bg-slate-600 hover:bg-slate-500 text-slate-100'
                                }`}
                        >
                            {option}
                        </button>
                    ))}
                </div>
                <div className="flex space-x-3 mt-3">
                    <button onClick={() => setIsHostSettingCorrectAnswer(false)} className="text-xs sm:text-sm text-slate-400 hover:text-slate-200 py-1 px-3 rounded-md bg-slate-700 hover:bg-slate-600">
                        Cancel
                    </button>
                    <button 
                        onClick={handleConfirmCorrectAnswer} 
                        disabled={hostSelectedCorrectOption === null}
                        className="text-xs sm:text-sm text-white py-1 px-3 rounded-md bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
                    >
                        Confirm & Reveal Results
                    </button>
                </div>
            </div>
        );
    }

    // UI for displaying results
    if (game.revealGuesses && typeof game.correctOptionIndex === 'number' && session) {
        const sortedParticipantGuesses = session.participants.map(p => {
            const participantGuess = game.guesses.find(g => g.userId === p.userId);
            return {
                ...p,
                guess: participantGuess,
                isCorrect: participantGuess ? participantGuess.selectedOptionIndex === game.correctOptionIndex : false,
                score: game.scores[p.userId] || 0
            };
        }).sort((a,b) => b.score - a.score);


        return (
            <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-30 p-2 sm:p-4 rounded-md overflow-y-auto scrollbar-thin">
                <h3 className="text-base sm:text-lg font-bold text-purple-400 mb-1">{game.question}</h3>
                <p className="text-xs sm:text-sm text-slate-300 mb-2">
                    Correct Answer: <span className="font-semibold text-green-400">{game.options?.[game.correctOptionIndex]}</span>
                </p>
                <div className="w-full max-w-md space-y-1.5 my-2">
                    {sortedParticipantGuesses.map(pg => (
                        <div key={pg.userId} className={`flex items-center justify-between p-1.5 rounded-md text-xs sm:text-sm
                            ${pg.isCorrect ? 'bg-green-800/70' : (pg.guess ? 'bg-red-800/60' : 'bg-slate-700/50')}`}>
                            <div className="flex items-center">
                                <img src={pg.avatarUrl || `https://picsum.photos/seed/${pg.userId}/30/30`} alt={pg.displayName} className="w-5 h-5 rounded-full mr-1.5 object-cover"/>
                                <span className="text-slate-200 mr-1 truncate max-w-[80px] sm:max-w-[120px]" title={pg.displayName}>{pg.displayName}:</span>
                                {pg.guess ? (
                                    <span className={`truncate ${pg.isCorrect ? 'text-green-300' : 'text-red-300'}`} title={game.options?.[pg.guess.selectedOptionIndex]}>
                                        "{game.options?.[pg.guess.selectedOptionIndex]}"
                                    </span>
                                ) : (
                                    <span className="text-slate-500 italic">No guess</span>
                                )}
                            </div>
                            <div className="flex items-center">
                                {pg.guess && (pg.isCorrect ? <CheckIcon className="text-green-300 w-3.5 h-3.5 mr-1"/> : <XMarkIconMini className="text-red-300 w-3.5 h-3.5 mr-1"/>) }
                                <span className={`${pg.isCorrect ? 'text-green-300' : (pg.guess ? 'text-red-300' : 'text-slate-500')} font-semibold`}>{pg.score} pt</span>
                            </div>
                        </div>
                    ))}
                </div>
                 {isHost && (
                    <button onClick={handleEndGuessingGame} className="mt-2 text-xs sm:text-sm text-sky-400 hover:text-sky-300 py-1 px-3 rounded bg-slate-700 hover:bg-slate-600">
                        End Game & Resume Playback
                    </button>
                )}
            </div>
        );
    }
    
    // UI for active guessing (participants making guesses)
    return (
        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-30 p-4 rounded-md">
            <h3 className="text-lg sm:text-xl font-bold text-purple-400 mb-2">{game.question}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md">
                {game.options?.map((option, index) => (
                    <button
                        key={index}
                        onClick={() => handleMcqOptionSelect(index)}
                        className={`w-full py-2 px-3 rounded-md text-sm sm:text-base transition-colors
                            ${selectedMcqOption === index 
                                ? 'bg-purple-700 text-white ring-2 ring-purple-300' 
                                : 'bg-slate-600 hover:bg-slate-500 text-slate-100'
                            }`}
                    >
                        {option}
                    </button>
                ))}
            </div>
            {isHost && (
                <button onClick={handleSetCorrectAnswerMode} className="mt-3 text-xs sm:text-sm text-sky-400 hover:text-sky-300 py-1 px-3 rounded bg-slate-700 hover:bg-slate-600">
                    Finalize & Set Correct Answer
                </button>
            )}
        </div>
    );
  };

  const renderOngoingPartyCard = (party: OngoingPartyDisplayItem) => {
    const platformStyle = PLATFORM_BADGE_STYLES[party.content.platform] || PLATFORM_BADGE_STYLES[Platform.Unknown];
    return (
      <div key={party.sessionId} className="bg-slate-800/70 border border-slate-700 rounded-lg shadow-lg overflow-hidden flex flex-col transition-all duration-300 hover:shadow-purple-500/20 hover:border-purple-600/40">
        <div 
            className="w-full h-28 bg-cover bg-center relative group cursor-pointer"
            style={{ backgroundImage: `url(${party.content.bannerUrl || party.content.thumbnailUrl})`}}
            onClick={() => onViewPartyContentDetails(party.content)}
            title={`View details for ${party.content.title}`}
        >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:from-black/60 transition-all"></div>
            <span className={`absolute top-1.5 right-1.5 px-1.5 py-0.5 text-xs font-semibold text-white rounded shadow-sm ${platformStyle}`}>
                {party.content.platform}
            </span>
            <div className="absolute bottom-1.5 left-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-white text-xs font-semibold text-center bg-black/40 py-0.5 rounded">View Details</p>
            </div>
        </div>
        <div className="p-3 flex flex-col flex-grow">
          <h3 className="text-sm font-semibold text-slate-200 truncate mb-1" title={party.content.title}>
            {party.content.title}
          </h3>
          <div className="flex items-center text-xs text-slate-400 mb-1.5">
            <img src={party.host.avatarUrl || `https://picsum.photos/seed/${party.host.userId}/20/20`} alt={party.host.displayName} className="w-5 h-5 rounded-full mr-1.5 object-cover border border-slate-600"/>
            <span>Hosted by <span className="font-medium text-slate-300">{party.host.displayName}</span></span>
          </div>
          <div className="flex items-center text-xs text-slate-400 mb-2.5">
            <UsersIconSolid className="mr-1 text-slate-500 w-4 h-4" /> {party.participantCount} watching
          </div>
          <div className="mt-auto">
            {party.joinStatus === 'can_request' && (
              <button
                onClick={() => onRequestJoinOngoingParty(party.sessionId)}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-1.5 px-3 rounded-md text-xs transition-colors shadow-sm hover:shadow-md"
              >
                 Join Party
              </button>
            )}
            {party.joinStatus === 'request_sent' && (
              <button disabled className="w-full bg-sky-800 text-sky-400 font-semibold py-1.5 px-3 rounded-md text-xs cursor-not-allowed opacity-70">
                Request Sent
              </button>
            )}
             {(party.joinStatus === 'already_member' || party.joinStatus === 'is_host') && (
              <button disabled className="w-full bg-slate-700 text-slate-400 font-semibold py-1.5 px-3 rounded-md text-xs cursor-not-allowed opacity-70">
                {party.joinStatus === 'is_host' ? "You are hosting" : "You're in this party"}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };


  if (!session) {
    // No active session, show "Start a Party" and ongoing friend parties
    return (
      <div className="animate-fadeIn py-4 space-y-8">
        <div className="flex flex-col items-center justify-center p-6 bg-slate-800 rounded-lg shadow-xl">
            <h2 className="text-2xl font-bold text-slate-100 mb-4">Ready to Watch Together?</h2>
            <p className="text-slate-400 mb-6 max-w-md text-center">
                Use Movie Matcher to find the perfect film with friends, or jump into an ongoing party!
            </p>
            <button
                onClick={onStartNewParty}
                className="bg-gradient-to-r from-purple-600 to-sky-500 hover:from-purple-700 hover:to-sky-600 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition-all transform hover:scale-105 active:scale-95 text-lg"
            >
                Start Movie Matcher
            </button>
        </div>

        {ongoingFriendParties.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold text-slate-200 mb-4">Join a Friend's Party</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {ongoingFriendParties.map(party => renderOngoingPartyCard(party))}
            </div>
          </div>
        )}
      </div>
    );
  }


  // Active session exists
  return (
    <div className="animate-fadeIn space-y-6">
        <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-14rem)] max-h-[800px]"> {/* Adjusted height for potential ongoing parties section */}
        <div className="lg:w-2/3 bg-slate-800 rounded-lg shadow-xl flex flex-col items-center justify-start p-4 relative overflow-hidden">
            <img 
                src={currentContent?.bannerUrl || currentContent?.thumbnailUrl} 
                alt="" 
                className="absolute inset-0 w-full h-full object-cover opacity-20 blur-sm pointer-events-none"
            />
            <div className="relative z-10 text-center w-full">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-0.5">{currentContent?.title}</h2>
                <p className="text-slate-300 mb-1 text-xs sm:text-sm">Watching with {session.participants.length} people</p>
                
                <div className="w-full max-w-2xl mx-auto p-1 sm:p-2 bg-slate-900/70 rounded-lg relative">
                    {renderGuessingGameUI()}

                    {currentContent?.videoUrl ? (
                        <div className="relative">
                            <video
                                ref={videoRef}
                                src={currentContent.videoUrl}
                                className="w-full aspect-video rounded-md bg-black"
                                controls={false} 
                            />
                            {activePeakLabel && (
                                <div className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-black/75 text-white text-xs sm:text-sm px-2.5 py-1 rounded-md shadow-lg z-20 animate-fadeIn transition-opacity">
                                    {activePeakLabel}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="aspect-video bg-black rounded-md flex items-center justify-center text-slate-400">
                            <img src={currentContent?.thumbnailUrl} alt={currentContent?.title} className="max-h-full max-w-full object-contain rounded" />
                            {playbackStatus === 'paused' && (!game || !game.isActive || game.revealGuesses) && <PlayIcon className="absolute w-12 h-12 sm:w-16 sm:h-16 text-white opacity-70 cursor-pointer hover:opacity-100" onClick={togglePlayback} />}
                            {playbackStatus === 'playing' && (!game || !game.isActive || game.revealGuesses) && <div className="absolute bottom-4 left-4 text-sm sm:text-lg bg-black/50 px-2 py-1 rounded">Playing... (Visual Mockup)</div>}
                        </div>
                    )}
                    {videoError && <p className="text-red-400 text-xs sm:text-sm mt-1">{videoError}</p>}
                    
                    <div className="mt-1 sm:mt-2">
                        {currentContent?.peakWatchData && (currentContent.videoUrl || totalDuration > 0) && (
                            <PeakWatchGraph
                            peakData={currentContent.peakWatchData}
                            duration={totalDuration}
                            currentTime={currentTime}
                            />
                        )}
                        <input 
                            type="range"
                            min="0"
                            max={totalDuration || 0}
                            value={currentTime}
                            onChange={(e) => handleSeek(parseFloat(e.target.value))}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
                            disabled={!totalDuration || (game?.isActive && !game?.revealGuesses)}
                        />
                        <div className="flex justify-between text-xs text-slate-400 mt-0.5 px-1">
                            <span>{formatTime(currentTime)}</span>
                            <span>{totalDuration ? formatTime(totalDuration) : '00:00'}</span>
                        </div>
                    </div>
                    <div className="mt-1 sm:mt-2 flex space-x-1 sm:space-x-2 justify-center items-center">
                        <button 
                            onClick={togglePlayback}
                            disabled={(game?.isActive && !game?.revealGuesses) || (!currentContent?.videoUrl && !totalDuration)}
                            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-1.5 px-2.5 sm:py-2 sm:px-4 rounded-lg shadow-md flex items-center justify-center transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {playbackStatus === 'playing' ? <PauseIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1" /> : <PlayIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1" />}
                            <span className="text-xs sm:text-sm">{playbackStatus === 'playing' ? 'Pause' : 'Play'}</span>
                        </button>
                        {currentContent?.videoUrl && (
                        <>
                            <button onClick={toggleMute} className="p-1.5 sm:p-2 bg-slate-700 hover:bg-slate-600 rounded-lg" title={isMuted ? "Unmute" : "Mute"}>
                                {isMuted ? <VolumeOffIcon className="text-slate-300 w-4 h-4 sm:w-5 sm:h-5" /> : <VolumeUpIcon className="text-slate-300 w-4 h-4 sm:w-5 sm:h-5" />}
                            </button>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.05"
                                value={isMuted ? 0 : volume}
                                onChange={handleVolumeChange}
                                className="w-16 sm:w-20 h-1.5 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-sky-500"
                                disabled={(game?.isActive && !game?.revealGuesses)}
                            />
                            <button
                                onClick={handleTogglePiP}
                                className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-1.5 px-2 sm:py-2 sm:px-3 rounded-lg shadow-md flex items-center justify-center transition-transform transform hover:scale-105"
                                title="Toggle Picture-in-Picture"
                                disabled={(game?.isActive && !game?.revealGuesses)}
                            >
                                <RectangleStackIcon className="w-4 h-4 sm:w-5 sm:h-5"/>
                            </button>
                        </>
                        )}
                        {isHost && (
                            <button
                                onClick={() => {
                                    if (game?.isActive) {
                                        if(game.revealGuesses) handleEndGuessingGame(); 
                                        else if (!isHostSettingCorrectAnswer) handleSetCorrectAnswerMode(); 
                                    } else {
                                        handleStartGuessingGame(); 
                                    }
                                }}
                                className={`${
                                    game?.isActive && game.revealGuesses ? 'bg-red-500 hover:bg-red-600' : 
                                    (game?.isActive && !isHostSettingCorrectAnswer ? 'bg-yellow-500 hover:bg-yellow-600' : 
                                    'bg-teal-500 hover:bg-teal-600')
                                } text-white font-semibold py-1.5 px-2 sm:py-2 sm:px-3 rounded-lg shadow-md flex items-center justify-center transition-colors`}
                                style={{ display: isHostSettingCorrectAnswer ? 'none' : 'flex' }}
                            >
                                {game?.isActive && game.revealGuesses ? <GameIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1"/> : 
                                (game?.isActive && !isHostSettingCorrectAnswer ? <LightBulbIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1"/> :
                                <GameIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1"/>)}
                            <span className="text-xs sm:text-sm">
                                    {game?.isActive && game.revealGuesses ? "End Game" : 
                                    (game?.isActive && !isHostSettingCorrectAnswer ? "Set Answer" : "Start Game")}
                            </span>
                            </button>
                        )}
                    </div>
                </div>
                {currentContent?.peakWatchData && (totalDuration > 0 || !currentContent.videoUrl) && (
                    <PeakMomentsList
                        peakData={currentContent.peakWatchData}
                        duration={totalDuration}
                        onSeek={handleSeek}
                        className="mt-2 w-full max-w-2xl mx-auto"
                    />
                )}
            </div>
        </div>

        {/* Sidebar: Participants & Chat */}
        <div className="lg:w-1/3 bg-slate-800 rounded-lg shadow-xl flex flex-col p-1 sm:p-2 md:p-4">
            <div className="mb-2 sm:mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-slate-100 mb-1.5 sm:mb-2 px-2">Participants ({session.participants.length})</h3>
            <div className="flex flex-wrap gap-1 sm:gap-2 p-1.5 sm:p-2 bg-slate-700/50 rounded-md max-h-24 sm:max-h-28 overflow-y-auto scrollbar-thin">
                {session.participants.map(p => (
                <div key={p.userId} title={p.displayName} className="flex flex-col items-center p-0.5 sm:p-1">
                    <img 
                    src={p.avatarUrl || `https://picsum.photos/seed/${p.userId}/40/40`} 
                    alt={p.displayName} 
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-purple-500"
                    />
                    <span className="text-xs text-slate-300 mt-0.5 sm:mt-1 truncate w-10 sm:w-12 text-center">{p.displayName.split(' ')[0]}</span>
                </div>
                ))}
            </div>
            </div>

            <div className="flex-grow flex flex-col min-h-0">
            <h3 className="text-base sm:text-lg font-semibold text-slate-100 mb-1.5 sm:mb-2 px-2">Chat</h3>
            <div ref={chatContainerRef} className="flex-grow overflow-y-auto bg-slate-700/50 p-2 sm:p-3 rounded-md space-y-2 sm:space-y-3 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-700/50">
                {chatMessages.map(msg => (
                <div key={msg.id} className={`flex ${msg.userId === currentUser.userId ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-2 sm:p-2.5 rounded-lg shadow ${msg.userId === currentUser.userId ? 'bg-purple-600 text-white rounded-br-none' : 'bg-slate-600 text-slate-100 rounded-bl-none'}`}>
                    {msg.userId !== currentUser.userId && (
                        <div className="flex items-center mb-0.5 sm:mb-1">
                        <img src={msg.userAvatar || `https://picsum.photos/seed/${msg.userId}/20/20`} alt={msg.userName} className="w-4 h-4 sm:w-5 sm:h-5 rounded-full mr-1 sm:mr-1.5 object-cover"/>
                        <span className="text-xs font-semibold opacity-80">{msg.userName}</span>
                        </div>
                    )}
                    <p className="text-sm break-words">{msg.message}</p>
                    <span className="text-xs opacity-70 block mt-0.5 sm:mt-1 text-right">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                </div>
                ))}
                {chatMessages.length === 0 && <p className="text-sm text-slate-400 text-center py-4">No messages yet. Say hi!</p>}
            </div>
            <form onSubmit={handleSendMessage} className="mt-2 sm:mt-3 flex gap-1 sm:gap-2">
                <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-grow bg-slate-700 text-slate-100 p-2 sm:p-2.5 rounded-md border border-slate-600 focus:ring-1 focus:ring-purple-500 focus:border-purple-500 outline-none"
                />
                <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white p-2 sm:p-2.5 rounded-md font-semibold transition-colors flex items-center justify-center">
                <SendIcon className="w-4 h-4 sm:w-5 sm:h-5"/>
                </button>
            </form>
            </div>
            <button onClick={onLeaveParty} className="mt-2 sm:mt-4 w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-1.5 sm:py-2 px-4 rounded-lg shadow-md transition-colors">
                Leave Watch Party
            </button>
        </div>
        </div>

        {/* Ongoing Friend Parties Section - only if active session exists */}
        {ongoingFriendParties.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold text-slate-200 mb-4">Join a Friend's Party</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {ongoingFriendParties.map(party => renderOngoingPartyCard(party))}
            </div>
          </div>
        )}
    </div>
  );
};

export default WatchPartyPanel;
