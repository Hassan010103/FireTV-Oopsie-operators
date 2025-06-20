import React, { useRef, useState, useEffect } from 'react';
import { SnapCreatorStoryInfo } from '../types'; 

interface SnapStoryCirclesProps {
  creatorsWithSnaps: SnapCreatorStoryInfo[];
  onSelectCreator: (userId: string) => void;
  showLikes?: boolean; 
}

const ThumbsUpIconMini: React.FC<{ className?: string }> = ({ className = "w-3 h-3" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path d="M11.026 2.564C10.704 1.83 9.92 1.83 9.598 2.564L8.13 5.456a1.504 1.504 0 01-1.077.818l-3.087.448c-.838.121-1.173 1.143-.574 1.728l2.234 2.178a1.503 1.503 0 01-.435 1.609l-.526 3.033c-.144.829.728 1.477 1.48.995l2.763-1.452a1.502 1.502 0 011.396 0l2.763 1.452c.752.482 1.624-.166 1.48-.995l-.526-3.033a1.503 1.503 0 01-.435-1.609l2.234-2.178c.599-.585.263-1.607-.574-1.728l-3.087-.448a1.504 1.504 0 01-1.077-.818L11.026 2.564z" />
    </svg>
);

const ChevronLeftIcon: React.FC<{className?: string}> = ({className="w-6 h-6"}) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
  </svg>
);

const ChevronRightIcon: React.FC<{className?: string}> = ({className="w-6 h-6"}) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
  </svg>
);


const SnapStoryCircles: React.FC<SnapStoryCirclesProps> = ({ creatorsWithSnaps, onSelectCreator, showLikes = false }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 5);
      setShowRightArrow(scrollWidth > clientWidth && scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  useEffect(() => {
    const currentRef = scrollContainerRef.current;
    if (currentRef) {
        checkScrollButtons(); 
        currentRef.addEventListener('scroll', checkScrollButtons, { passive: true });
    }
    window.addEventListener('resize', checkScrollButtons);
    checkScrollButtons(); // Re-check on creators change

    return () => {
      if (currentRef) {
        currentRef.removeEventListener('scroll', checkScrollButtons);
      }
      window.removeEventListener('resize', checkScrollButtons);
    };
  }, [creatorsWithSnaps]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.7; // Scroll by 70% of visible width
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (!creatorsWithSnaps || creatorsWithSnaps.length === 0) {
    return null;
  }

  return (
    <div className="w-full flex flex-row justify-start items-center gap-6 py-2">
      {creatorsWithSnaps.map((creator) => (
        <button
          key={creator.userId}
          onClick={() => onSelectCreator(creator.userId)}
          className="flex flex-col items-center w-20 flex-shrink-0 focus:outline-none group/item"
          aria-label={`View snaps from ${creator.displayName}`}
        >
          <div 
            className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full p-0.5 sm:p-1 overflow-hidden transition-transform duration-200 group-hover/item:scale-105"
            style={{
              background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
            }}
          >
            <div className="w-full h-full bg-slate-800 rounded-full p-0.5 sm:p-1 flex items-center justify-center">
              <img
                src={creator.avatarUrl || `https://picsum.photos/seed/${creator.userId}/80/80`}
                alt={creator.displayName}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
          </div>
          <span className="mt-1.5 text-xs text-slate-300 group-hover/item:text-purple-300 transition-colors truncate w-full text-center">
            {creator.displayName}
          </span>
          {showLikes && typeof creator.totalLikes === 'number' && (
            <span className="text-xs text-slate-400 flex items-center justify-center mt-0.5">
              <ThumbsUpIconMini className="text-sky-400 mr-0.5" /> {creator.totalLikes > 1000 ? `${(creator.totalLikes/1000).toFixed(1)}k` : creator.totalLikes}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};

export default SnapStoryCircles;
