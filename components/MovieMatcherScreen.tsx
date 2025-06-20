

import React from 'react';
import { Content } from '../types';

interface MovieMatcherScreenProps {
  movie: Content | null;
  onLike: () => void;
  onPass: () => void;
  isLoading?: boolean;
  moviesRemaining: number;
  totalMoviesInPool: number;
  matchedMovie?: Content | null; // If a match has just occurred
  joinCode?: string; // Code for friend to join
}

const ThumbsUpIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8 sm:w-10 sm:h-10" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M7.493 18.75c-.425 0-.82-.236-.975-.632A7.48 7.48 0 016 15.375c0-1.75.561-3.4.156-4.991a27.548 27.548 0 00-1.182-3.95A1.5 1.5 0 016.721 4.5h4.554c.304 0 .597.068.86.192l2.16 1.284A2.25 2.25 0 0116.5 8.25V15a2.25 2.25 0 01-2.25 2.25h-1.508a2.25 2.25 0 01-2.028-1.425L9.11 12.862c-.023-.06-.033-.124-.033-.188v-.382c0-.345.226-.645.536-.733l2.7-.759A2.25 2.25 0 0015 8.25V7.5a.75.75 0 00-.75-.75h-4.554a.75.75 0 00-.722.51L7.41 9.953V15.375A9.003 9.003 0 0010.05 18h3.678a.75.75 0 00.722-.51l.502-1.675a.75.75 0 00-.315-.898l-.79-.439c-.367-.203-.508-.666-.339-1.036l.013-.028c.18-.38.57-.617.995-.617h.645a.75.75 0 00.75-.75V10.5a.75.75 0 00-.75-.75h-.645a2.25 2.25 0 00-2.218 1.713l-.06.202c-.164.557-.697.888-1.25.888h-.381a.75.75 0 00-.68.42l-.454 1.212A.75.75 0 007.493 18.75z" />
  </svg>
);

const ThumbsDownIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8 sm:w-10 sm:h-10" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M16.507 5.25c.425 0 .82.236.975.632A7.48 7.48 0 0118 8.625c0 1.75-.561 3.4-.156 4.991a27.548 27.548 0 011.182 3.95A1.5 1.5 0 0117.279 19.5h-4.554a.75.75 0 00-.86-.192L9.704 18a2.25 2.25 0 01-2.25-2.25V9a2.25 2.25 0 012.25-2.25h1.508a2.25 2.25 0 012.028 1.425l.787 2.638c.023.06.033.124.033.188v.382c0 .345-.226.645-.536.733l-2.7.759A2.25 2.25 0 009 15.75v.75a.75.75 0 00.75.75h4.554a.75.75 0 00.722-.51l.067-.222V8.625A9.003 9.003 0 0013.95 6H10.272a.75.75 0 00-.722.51l-.502 1.675a.75.75 0 00.315.898l.79.439c.367.203.508.666.339 1.036l-.013.028c-.18.38-.57.617-.995-.617h-.645a.75.75 0 00-.75.75v.75a.75.75 0 00.75.75h.645a2.25 2.25 0 002.218-1.713l.06-.202c.164.557-.697.888-1.25-.888h-.381a.75.75 0 00-.68-.42l.454-1.212A.75.75 0 0016.507 5.25z" />
  </svg>
);

const CheckCircleIcon: React.FC<{ className?: string }> = ({ className = "w-16 h-16" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
  </svg>
);


const MovieMatcherScreen: React.FC<MovieMatcherScreenProps> = ({
  movie,
  onLike,
  onPass,
  isLoading,
  moviesRemaining,
  totalMoviesInPool,
  matchedMovie,
  joinCode
}) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-12rem)] p-4 text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500 mb-4"></div>
        <p className="text-xl text-slate-300">Loading Movies for Matching...</p>
      </div>
    );
  }

  if (matchedMovie) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-12rem)] p-4 text-center animate-fadeIn">
        <CheckCircleIcon className="text-green-400 mb-6 w-24 h-24" />
        <h2 className="text-4xl font-bold text-white mb-3">It's a Match!</h2>
        <p className="text-2xl text-slate-200 mb-2">{matchedMovie.title}</p>
        <img src={matchedMovie.thumbnailUrl} alt={matchedMovie.title} className="w-52 sm:w-64 h-auto rounded-lg shadow-xl mb-6" />
        <p className="text-lg text-slate-300">Preparing your Watch Party...</p>
      </div>
    );
  }


  if (!movie) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-12rem)] p-4 text-center">
        <h2 className="text-3xl font-bold text-slate-100 mb-4">No More Movies to Match!</h2>
        <p className="text-slate-400">
          {moviesRemaining === 0 && totalMoviesInPool > 0 ? "You've gone through all available movies for this session." : "Couldn't load movies for matching."}
        </p>
         {/* This message is shown if no match after all movies. App.tsx handles navigation. */}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full py-4 animate-fadeIn">
       <h2 className="text-2xl sm:text-3xl font-bold text-purple-400 mb-1 text-center">Find Your Next Watch Together!</h2>
       <p className="text-slate-400 mb-2 text-sm text-center">
         Movie {Math.min(totalMoviesInPool - moviesRemaining + 1, totalMoviesInPool)} of {totalMoviesInPool}. Like or Pass.
       </p>
      
      {joinCode && !matchedMovie && (
        <div className="my-3 sm:my-4 p-3 bg-slate-700/60 rounded-lg text-center max-w-xs sm:max-w-sm md:max-w-md mx-auto shadow">
            <p className="text-xs text-slate-300 mb-1">Share with your friend to sync choices:</p>
            <p className="text-2xl font-bold text-sky-300 tracking-widest bg-slate-800/70 py-1.5 px-3 rounded-md inline-block shadow-inner">
            {joinCode}
            </p>
        </div>
      )}

      <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md bg-slate-800 rounded-xl shadow-2xl overflow-hidden aspect-[2/3] transform transition-all duration-300 ease-in-out hover:shadow-purple-500/30">
        {/* Applying a subtle animation if the movie prop changes */}
        <div key={movie.contentId} className="animate-fadeIn">
            <img
            src={movie.bannerUrl || movie.thumbnailUrl}
            alt={movie.title}
            className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-3 sm:p-4 flex flex-col justify-end">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-1 drop-shadow-lg">{movie.title}</h3>
            <p className="text-xs text-slate-300 mb-1 line-clamp-1">
                {movie.genre.join(', ')} {movie.year ? `(${movie.year})` : ''}
            </p>
            <p className="text-xs sm:text-sm text-slate-200 line-clamp-2 sm:line-clamp-3 drop-shadow">
                {movie.description}
            </p>
            </div>
        </div>
      </div>

      <div className="flex justify-around w-full max-w-xs sm:max-w-sm md:max-w-md mt-5 sm:mt-6">
        <button
          onClick={onPass}
          className="bg-red-600 hover:bg-red-500 text-white p-3 sm:p-4 rounded-full shadow-xl transform transition-all hover:scale-110 focus:outline-none focus-visible:ring-4 focus-visible:ring-red-400 active:scale-95"
          aria-label="Pass on this movie"
        >
          <ThumbsDownIcon />
        </button>
        <button
          onClick={onLike}
          className="bg-green-600 hover:bg-green-500 text-white p-3 sm:p-4 rounded-full shadow-xl transform transition-all hover:scale-110 focus:outline-none focus-visible:ring-4 focus-visible:ring-green-400 active:scale-95"
          aria-label="Like this movie"
        >
          <ThumbsUpIcon />
        </button>
      </div>
    </div>
  );
};

export default MovieMatcherScreen;