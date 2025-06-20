
import React from 'react';
import { Mood } from '../types';

interface MoodSelectorProps {
  moods: Mood[];
  currentMood: Mood | null;
  onMoodSelect: (mood: Mood | null) => void;
}

const XCircleIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => ( // Made icon slightly smaller
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L10 8.586 7.707 6.293a1 1 0 00-1.414 1.414L8.586 10l-2.293 2.293a1 1 0 101.414 1.414L10 11.414l2.293 2.293a1 1 0 001.414-1.414L11.414 10l2.293-2.293z" clipRule="evenodd" />
  </svg>
);

const MoodSelector: React.FC<MoodSelectorProps> = ({ moods, currentMood, onMoodSelect }) => {
  return (
    <div className="my-6 sm:my-8 px-1">
      <div className="flex items-center mb-3">
        <h2 className="text-lg sm:text-xl font-semibold text-slate-300 mr-4 whitespace-nowrap">Filter by Mood:</h2>
        <div className="flex-grow overflow-x-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800 pb-2">
          <div className="flex space-x-2 items-center">
            {moods.map((mood) => (
              <button
                key={mood}
                onClick={() => onMoodSelect(mood === currentMood ? null : mood)}
                className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all duration-150 ease-in-out whitespace-nowrap
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900
                  ${currentMood === mood 
                    ? 'bg-purple-600 text-white shadow-md ring-1 ring-purple-400' 
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-slate-100'
                  }`}
              >
                {mood}
              </button>
            ))}
            {currentMood && (
              <button
                onClick={() => onMoodSelect(null)}
                className="ml-2 px-2.5 py-1.5 rounded-md text-xs sm:text-sm font-medium text-slate-400 hover:text-sky-400 hover:bg-slate-700 transition-colors flex items-center whitespace-nowrap
                           focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                title="Clear mood filter"
              >
                <XCircleIcon className="w-4 h-4 inline-block mr-1" /> Clear
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoodSelector;