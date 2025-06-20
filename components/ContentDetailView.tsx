import React from 'react';
import { Content, Platform, AppView } from '../types'; // Added AppView
import { PLATFORM_BADGE_STYLES } from '../constants';

interface ContentDetailViewProps {
  content: Content;
  onStartWatchParty: () => void;
  onBack: () => void; // This will be called, App.tsx decides where to go
  onOpenSuggestModal: (content: Content) => void;
  onPlayStandalone: (content: Content) => void;
  onLike?: (content: Content, liked: boolean) => void; // New prop for like functionality
  liked?: boolean; // Add liked prop
}

const ArrowLeftIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
  </svg>
);
const PlayIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
  </svg>
);
const UsersIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.533 1.403 12.067 12.067 0 01-2.163.93c1.063.49 2.206.848 3.386.965a.75.75 0 00.866-.756l.001-.144a7.125 7.125 0 00-1.556-4.695z" />
  </svg>
);
const StarIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.39-3.423 3.322.805 4.728 4.237-2.23.002.001 4.237 2.23.805-4.728-3.423-3.322-4.752-.39-1.831-4.401z" clipRule="evenodd" />
  </svg>
);
const ShareIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path d="M13 4.5a2.5 2.5 0 11.702 4.235A3.492 3.492 0 0015.5 9.5c1.072 0 2.037.44 2.734 1.152A3.49 3.49 0 0019.5 9c0-.043-.003-.086-.008-.128A5.004 5.004 0 0015.5 3c-1.09 0-2.096.365-2.898.986Q12.11 4.5 13 4.5z" />
    <path d="M4.5 9a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM13 15.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
    <path d="M13.202 5.235A3.492 3.492 0 0011.5 4.5a3.5 3.5 0 100 7A3.492 3.492 0 0013.202 10.765a.5.5 0 000-.53l-2.904-4.356a.5.5 0 00-.854-.146L6.53 9.392a.5.5 0 00-.146.854l4.356 2.904a.5.5 0 00.53 0l.808-.538a3.502 3.502 0 002.122 5.388.5.5 0 00.53-.854l-2.608-3.912a.5.5 0 00-.854-.146L8.608 16.07a.5.5 0 00-.146.854l3.912 2.608A3.503 3.503 0 0013 5.5c0-.043.003-.086.008-.128L13.202 5.235z" />
  </svg>
);
const HeartIcon: React.FC<{ filled?: boolean; className?: string }> = ({ filled = false, className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill={filled ? "#ef4444" : "none"} viewBox="0 0 24 24" stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21C12 21 4 13.5 4 8.5C4 5.42 6.42 3 9.5 3C11.24 3 12.91 3.81 14 5.08C15.09 3.81 16.76 3 18.5 3C21.58 3 24 5.42 24 8.5C24 13.5 16 21 16 21H12Z" />
  </svg>
);


const InfoItem: React.FC<{label: string, value?: string | string[]}> = ({label, value}) => {
  if (!value || (Array.isArray(value) && value.length === 0)) return null;
  return (
    <div className="mb-2">
      <span className="font-semibold text-slate-200">{label}: </span>
      <span className="text-slate-400">{Array.isArray(value) ? value.join(', ') : value}</span>
    </div>
  );
};


const ContentDetailView: React.FC<ContentDetailViewProps> = ({ content, onStartWatchParty, onBack, onOpenSuggestModal, onPlayStandalone, onLike, liked = false }) => {
  const platformColor = PLATFORM_BADGE_STYLES[content.platform] || PLATFORM_BADGE_STYLES[Platform.Unknown];
  const durationHours = content.duration ? Math.floor(content.duration / 3600) : 0;
  const durationMinutes = content.duration ? Math.floor((content.duration % 3600) / 60) : 0;

  const handlePlayNow = () => {
    if (content.videoUrl) {
      onPlayStandalone(content);
    } else if (content.deepLink) {
      // In a real app, this would attempt to open the deeplink
      alert(`Playing ${content.title} via ${content.deepLink}`);
    } else {
      alert(`No direct way to play ${content.title}. Try Watch Party or check availability on ${content.platform}.`);
    }
  };

  const handleLike = () => {
    if (onLike) onLike(content, !liked);
  };

  return (
    <div className="animate-fadeIn">
      <button onClick={onBack} className="mb-6 flex items-center text-sm text-purple-400 hover:text-purple-300 transition-colors">
        <ArrowLeftIcon className="w-5 h-5 mr-2" />
        Back
      </button>

      <div className="md:flex md:space-x-8">
        <div className="md:w-1/3 lg:w-1/4 flex-shrink-0 mb-6 md:mb-0">
          <img
            src={content.thumbnailUrl} // This should be OMDB poster if available
            alt={content.title}
            className="w-full rounded-lg shadow-xl object-cover aspect-[2/3]"
          />
          <button
            onClick={handleLike}
            className={`mt-4 flex items-center justify-center w-full py-2 rounded-lg border transition-colors ${liked ? 'bg-red-100 border-red-400' : 'bg-slate-800 border-slate-600 hover:bg-slate-700'}`}
            aria-label={liked ? 'Unlike this movie' : 'Like this movie'}
          >
            <HeartIcon filled={liked} className="w-6 h-6 mr-2" />
            <span className={`font-semibold ${liked ? 'text-red-500' : 'text-slate-200'}`}>{liked ? 'Liked' : 'Like'}</span>
          </button>
        </div>
        <div className="md:w-2/3 lg:w-3/4">
          <span className={`${platformColor} text-white px-3 py-1 text-xs font-semibold rounded-full inline-block mb-2`}>
            {content.platform}
          </span>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-3">{content.title}</h1>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-slate-400 mb-4 text-sm">
            {content.year && <span>{content.year}</span>}
            {content.duration && <span>{`${durationHours > 0 ? `${durationHours}h ` : ''}${durationMinutes}m`}</span>}
            {content.genre && content.genre.length > 0 && content.genre.map(g => <span key={g} className="px-2 py-0.5 bg-slate-700 rounded-full text-xs">{g}</span>)}
            {content.rating && content.rating > 0 && (
              <div className="flex items-center">
                <StarIcon className="w-4 h-4 text-yellow-400 mr-1" />
                <span>{content.rating.toFixed(1)}/10 {content.imdbID ? '(IMDb)' : ''}</span>
              </div>
            )}
          </div>

          <p className="text-slate-300 leading-relaxed mb-6">{content.description || 'No description available.'}</p>

          <InfoItem label="Director" value={content.director} />
          <InfoItem label="Cast" value={content.cast} />
          {content.mood_tags && content.mood_tags.length > 0 && <InfoItem label="Moods" value={content.mood_tags} />}
          {content.imdbID && <InfoItem label="IMDb ID" value={content.imdbID} />}


          <div className="mt-8 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <button
              onClick={handlePlayNow}
              className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md flex items-center justify-center transition-transform transform hover:scale-105"
            >
              <PlayIcon className="w-6 h-6 mr-2" />
              Play Now
            </button>
            <button
              onClick={onStartWatchParty} 
              className="w-full sm:w-auto bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md flex items-center justify-center transition-transform transform hover:scale-105"
            >
              <UsersIcon className="w-6 h-6 mr-2" />
              Start Watch Party
            </button>
             <button
              onClick={() => onOpenSuggestModal(content)}
              className="w-full sm:w-auto bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md flex items-center justify-center transition-transform transform hover:scale-105"
              title="Suggest this to a friend"
            >
              <ShareIcon className="w-5 h-5 mr-2" />
              Suggest
            </button>
          </div>
           {content.deepLink && !content.videoUrl && <p className="text-xs text-slate-500 mt-4">Deeplink: {content.deepLink}</p>}
        </div>
      </div>
    </div>
  );
};

export default ContentDetailView;