
import React from 'react';
import { Snap, UserProfile, SnapReaction } from '../types';

interface SnapCardComponentProps {
  snap: Snap;
  currentUser: UserProfile;
  onAddReaction: (snapId: string, emoji: string) => void;
  // onContentSelect?: (contentId: string) => void; // If snap is linked to content
}

const PREDEFINED_REACTIONS = ["🔥", "😂", "😱", "❤", "👍", "🤯"];

const ClockIcon: React.FC<{ className?: string }> = ({ className = "w-3 h-3" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
    </svg>
);


const SnapCardComponent: React.FC<SnapCardComponentProps> = ({
  snap,
  currentUser,
  onAddReaction,
  // onContentSelect
}) => {

  const handleReactionClick = (emoji: string) => {
    onAddReaction(snap.id, emoji);
  };
  
  const userHasReactedWith = (emoji: string): boolean => {
    return snap.reactions.some(r => r.userId === currentUser.userId && r.emoji === emoji);
  };

  const getReactionCount = (emoji: string): number => {
    return snap.reactions.filter(r => r.emoji === emoji).length;
  };

  return (
    <div className="bg-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col border border-slate-700/80 hover:border-purple-600/70 transition-all duration-300 ease-in-out transform hover:shadow-purple-500/20 hover:-translate-y-1">
      <div className="w-full aspect-[16/9] bg-black overflow-hidden relative group">
        <img 
          src={snap.imageUrl || 'https://picsum.photos/seed/placeholder_snap/640/360'} 
          alt={snap.caption || `Snap by ${snap.creatorInfo.displayName}`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {snap.associatedContentTitle && (
            <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded">
                From: {snap.associatedContentTitle}
            </div>
        )}
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex items-start mb-3">
          <img 
            src={snap.creatorInfo.avatarUrl || `https://picsum.photos/seed/${snap.creatorInfo.userId}/80/80`} 
            alt={snap.creatorInfo.displayName}
            className="w-10 h-10 rounded-full mr-3 object-cover border-2 border-slate-600 shadow-sm"
          />
          <div className="flex-grow">
            <p className="text-md font-semibold text-slate-100 leading-tight">{snap.creatorInfo.displayName}</p>
            <div className="flex items-center text-xs text-slate-400 mt-0.5">
                <ClockIcon className="mr-1 text-slate-500" />
                {new Date(snap.timestamp).toLocaleString([], { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' })}
            </div>
          </div>
        </div>

        {snap.caption && (
          <p className="text-sm text-slate-300 mb-4 flex-grow min-h-[40px] leading-relaxed">{snap.caption}</p>
        )}
        {!snap.caption && <div className="flex-grow min-h-[40px]"></div>}


        <div className="pt-3 border-t border-slate-700/80">
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            {PREDEFINED_REACTIONS.map(emoji => {
              const count = getReactionCount(emoji);
              const reacted = userHasReactedWith(emoji);
              return (
                <button
                  key={emoji}
                  onClick={() => handleReactionClick(emoji)}
                  className={`px-2.5 py-1.5 rounded-full text-xs flex items-center transition-all duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-800
                              ${reacted 
                                ? 'bg-purple-600 text-white shadow-md ring-1 ring-purple-400 hover:bg-purple-500' 
                                : 'bg-slate-700 hover:bg-slate-600/70 text-slate-300 hover:text-slate-100 focus-visible:ring-purple-500'
                              }`}
                  title={`React with ${emoji}${count > 0 ? ` (${count})` : ''}`}
                  aria-pressed={reacted}
                  aria-label={`React with ${emoji}, current count ${count}`}
                >
                  <span className="text-lg mr-1 transform group-hover:scale-110">{emoji}</span>
                  {count > 0 && <span className="font-semibold text-xs">{count}</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SnapCardComponent;
