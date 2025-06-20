
import React from 'react';
import { Content, Platform } from '../types';
import { PLATFORM_BADGE_STYLES } from '../constants';

interface HeroSectionProps {
  content: Content;
  onPlay: () => void;
  onInfo: () => void;
}

const PlayIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
  </svg>
);

const InformationCircleIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.042.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
  </svg>
);

const StarIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.39-3.423 3.322.805 4.728 4.237-2.23.002.001 4.237 2.23.805-4.728-3.423-3.322-4.752-.39-1.831-4.401z" clipRule="evenodd" />
  </svg>
);


const HeroSection: React.FC<HeroSectionProps> = ({ content, onPlay, onInfo }) => {
  const platformColor = PLATFORM_BADGE_STYLES[content.platform] || PLATFORM_BADGE_STYLES[Platform.Unknown];

  return (
    <div 
      className="relative rounded-xl overflow-hidden shadow-2xl mb-6 md:mb-8 min-h-[300px] md:min-h-[400px] lg:min-h-[500px] flex items-end p-4 sm:p-6 md:p-8 bg-cover bg-center animate-fadeIn"
      style={{ backgroundImage: `linear-gradient(to top, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.8) 25%, rgba(15, 23, 42, 0.1) 60%), url(${content.bannerUrl || content.thumbnailUrl})` }}
      role="region"
      aria-labelledby="hero-title"
    >
      <div className="relative z-10 text-white max-w-xl lg:max-w-2xl">
        <span className={`absolute -top-10 left-0 ${platformColor} text-white px-3 py-1 text-xs font-semibold rounded-t-md shadow-sm`}>
          {content.platform}
        </span>
        <h1 id="hero-title" className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 md:mb-3 drop-shadow-lg">{content.title}</h1>
        <div className="flex items-center space-x-3 mb-3 md:mb-4 text-sm text-slate-200">
          {content.year && <span>{content.year}</span>}
          {content.year && content.genre.length > 0 && <span className="opacity-60">|</span>}
          {content.genre.slice(0, 2).map(g => <span key={g} className="font-medium">{g}</span>)}
          {content.rating && <span className="opacity-60">|</span>}
          {content.rating && (
            <div className="flex items-center">
              <StarIcon className="w-4 h-4 text-yellow-400 mr-1" />
              <span className="font-semibold">{content.rating.toFixed(1)}</span>
            </div>
          )}
        </div>
        <p className="text-sm md:text-base text-slate-200 mb-4 md:mb-6 line-clamp-2 md:line-clamp-3 drop-shadow-sm">
          {content.description}
        </p>
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          <button 
            onClick={onPlay}
            className="bg-purple-600 hover:bg-purple-500 text-white font-semibold py-2.5 px-5 md:py-3 md:px-6 rounded-lg shadow-md flex items-center justify-center transition-all transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
            aria-label={`Play ${content.title}`}
          >
            <PlayIcon className="w-5 h-5 md:w-6 md:h-6 mr-2" />
            Play
          </button>
          <button 
            onClick={onInfo}
            className="bg-slate-700 hover:bg-slate-600 text-slate-100 font-semibold py-2.5 px-5 md:py-3 md:px-6 rounded-lg shadow-md flex items-center justify-center transition-all transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
             aria-label={`More information about ${content.title}`}
          >
            <InformationCircleIcon className="w-5 h-5 md:w-6 md:h-6 mr-2" />
            More Info
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
