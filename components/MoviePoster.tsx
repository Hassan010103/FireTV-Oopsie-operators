
import React from 'react';

interface MoviePosterProps {
  title: string;
  imageUrl: string;
}

const MoviePoster: React.FC<MoviePosterProps> = ({ title, imageUrl }) => {
  return (
    <div className="w-48 h-72 rounded-lg overflow-hidden shadow-lg flex-shrink-0">
      <img 
        src={imageUrl} 
        alt={title} 
        className="w-full h-full object-cover" 
        loading="lazy" // Added lazy loading for potentially many images
      />
    </div>
  );
};

export default MoviePoster;
