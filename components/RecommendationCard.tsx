import React from 'react';
import { RecommendationItem, Platform, Content } from '../types';
import { PLATFORM_BADGE_STYLES, MOCK_POTENTIAL_FRIENDS } from '../constants';

interface RecommendationCardProps {
  content: RecommendationItem;
  onSelect: () => void;
  onPlayWithPip?: (content: Content) => void; // New optional prop
}

const StarIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.39-3.423 3.322.805 4.728 4.237-2.23.002.001 4.237 2.23.805-4.728-3.423-3.322-4.752-.39-1.831-4.401z" clipRule="evenodd" />
  </svg>
);

const RectangleStackIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path d="M3 3.5A1.5 1.5 0 014.5 2h11A1.5 1.5 0 0117 3.5v5a.5.5 0 01-1 0v-5A.5.5 0 0015.5 3H4.5A.5.5 0 004 3.5v10a.5.5 0 00.5.5h5a.5.5 0 010 1h-5A1.5 1.5 0 013 13.5v-10z" />
    <path d="M10.5 9A1.5 1.5 0 009 10.5v5A1.5 1.5 0 0010.5 17h5A1.5 1.5 0 0017 15.5v-5A1.5 1.5 0 0015.5 9h-5zm.5 1.5h4v4h-4v-4z" />
  </svg>
);

export const RecommendationCard: React.FC<RecommendationCardProps> = ({ content, onSelect, onPlayWithPip }) => {
  const platformColor = PLATFORM_BADGE_STYLES[content.platform] || PLATFORM_BADGE_STYLES[Platform.Unknown];
  
  // Pick a random friend for the 'Liked by' feature
  const randomFriend = React.useMemo(() => {
    const idx = Math.floor(Math.random() * MOCK_POTENTIAL_FRIENDS.length);
    return MOCK_POTENTIAL_FRIENDS[idx];
  }, []);

  const handlePipClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card's onSelect from firing
    if (onPlayWithPip && content.videoUrl) {
      onPlayWithPip(content);
    }
  };

  return (
    <div 
      onClick={onSelect}
      className="group relative flex-shrink-0 w-56 sm:w-64 md:w-72 bg-slate-800 rounded-lg shadow-lg overflow-hidden cursor-pointer 
                 transform transition-all duration-200 ease-in-out 
                 hover:scale-105 hover:shadow-purple-500/40 
                 focus:outline-none 
                 focus-visible:scale-105 focus-visible:z-10 focus-visible:shadow-xl focus-visible:shadow-purple-600/50
                 focus-visible:ring-4 focus-visible:ring-purple-500 focus-visible:ring-opacity-75"
      tabIndex={0} 
      onKeyPress={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelect(); }}
      aria-label={`View details for ${content.title}`}
    >
      <div className="w-full aspect-[16/9] overflow-hidden"> {/* Enforce 16:9 aspect ratio for the image container */}
        <img 
          src={content.thumbnailUrl} 
          alt={content.title} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 group-focus-visible:scale-110" 
          loading="lazy"
        />
      </div>
      <div 
        className={`absolute top-2 right-2 px-2.5 py-1 text-xs font-semibold text-white rounded shadow-md ${platformColor}`}
      >
        {content.platform}
      </div>
      
      <div className="p-3">
        <h3 className="text-base sm:text-lg font-semibold text-slate-100 truncate group-hover:text-purple-300 transition-colors duration-200">
          {content.title}
        </h3>
        <div className="flex items-center text-xs text-slate-400 mt-1">
          {content.genre[0] && <span>{content.genre[0]}</span>}
          {content.year && <span className="mx-1.5">&bull;</span>}
          {content.year && <span>{content.year}</span>}
        </div>
         {content.rating && (
          <div className="flex items-center mt-1 text-xs space-x-2">
            <span className="flex items-center">
              <StarIcon className="w-3.5 h-3.5 text-yellow-400 mr-1"/>
              <span className="text-slate-300 font-medium">{content.rating.toFixed(1)}</span>
            </span>
            {/* Liked by friend */}
            <span className="flex items-center ml-2 bg-slate-700/60 rounded-full px-2 py-0.5">
              <span className="text-slate-300 mr-1">Liked by</span>
              <img src={randomFriend.avatarUrl} alt={randomFriend.displayName} className="w-5 h-5 rounded-full object-cover mr-1 border border-slate-500" />
              <span className="text-slate-200 font-medium">{randomFriend.displayName}</span>
            </span>
          </div>
        )}
      </div>
      
      {/* Overlay for more info on hover/focus - adjusted for better visibility with focus ring */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 
                      transition-opacity duration-300 flex flex-col justify-end p-3">
        <h3 className="text-lg font-semibold text-white mb-1 drop-shadow-md">{content.title}</h3>
        <p className="text-xs text-slate-200 line-clamp-2 mb-2 drop-shadow-sm">{content.description || 'No description available.'}</p>
        <div className="flex justify-between items-center">
            <span className="text-xs bg-purple-600 text-white py-1 px-2 rounded self-start shadow-md">More Info</span>
            {content.videoUrl && onPlayWithPip && (
                <button
                    onClick={handlePipClick}
                    className="p-1.5 bg-slate-700/70 hover:bg-slate-600/90 rounded-full text-white transition-colors"
                    aria-label={`Play ${content.title} in Picture-in-Picture`}
                    title="Play in Picture-in-Picture"
                >
                    <RectangleStackIcon className="w-4 h-4" />
                </button>
            )}
        </div>
      </div>
    </div>
  );
};