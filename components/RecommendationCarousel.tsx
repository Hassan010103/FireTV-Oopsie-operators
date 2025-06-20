

import React, { useRef, useState, useEffect } from 'react';
import { RecommendationItem, Content } from '../types';
import { RecommendationCard } from './RecommendationCard';

interface RecommendationCarouselProps {
  recommendations: RecommendationItem[];
  title: string;
  onContentSelect: (content: Content) => void;
  onPlayWithPip?: (content: Content) => void; // New optional prop
}

const ChevronLeftIcon: React.FC<{className?: string}> = ({className="w-6 h-6"}) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
  </svg>
);

const ChevronRightIcon: React.FC<{className?: string}> = ({className="w-6 h-6"}) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
  </svg>
);


const RecommendationCarousel: React.FC<RecommendationCarouselProps> = ({ recommendations, title, onContentSelect, onPlayWithPip }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 5); // Add small threshold
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5); // Add small threshold
    }
  };

  useEffect(() => {
    const currentRef = scrollContainerRef.current;
    if (currentRef) {
        checkScrollButtons(); // Initial check
        currentRef.addEventListener('scroll', checkScrollButtons, { passive: true });
    }
    window.addEventListener('resize', checkScrollButtons);

    // Re-check when recommendations change as this affects scrollWidth
    checkScrollButtons();


    return () => {
      if (currentRef) {
        currentRef.removeEventListener('scroll', checkScrollButtons);
      }
      window.removeEventListener('resize', checkScrollButtons);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recommendations]); 

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };
  
  if (!recommendations || recommendations.length === 0) {
    return null; 
  }

  return (
    <div className="my-8">
      <h2 className="text-2xl font-semibold text-slate-100 mb-4 px-2">{title}</h2>
      <div className="relative group">
        {showLeftArrow && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-2 bg-slate-800 bg-opacity-70 hover:bg-opacity-100 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 ml-2"
            aria-label="Scroll left"
          >
            <ChevronLeftIcon />
          </button>
        )}
        <div 
          ref={scrollContainerRef} 
          className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide pl-2" 
        >
          {recommendations.map((item, index) => (
            <RecommendationCard 
              key={`${item.contentId}-${index}-${title}`} // Add title to key for potential duplicate content in different carousels
              content={item} 
              onSelect={() => onContentSelect(item)} 
              onPlayWithPip={onPlayWithPip} // Pass down the new prop
            />
          ))}
           <div className="flex-shrink-0 w-px"></div> {/* Use w-px for minimal impact, pl-2 on container gives initial spacing */}
        </div>
        {showRightArrow && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-2 bg-slate-800 bg-opacity-70 hover:bg-opacity-100 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 mr-2"
            aria-label="Scroll right"
          >
            <ChevronRightIcon />
          </button>
        )}
      </div>
    </div>
  );
};

export default RecommendationCarousel;