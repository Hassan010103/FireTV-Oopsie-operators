

import React from 'react';
import { UserProfile, ViewingHistoryItem, Platform } from '../types';
import { PLATFORM_BADGE_STYLES } from '../constants';

interface UserProfilePanelProps {
  profile: UserProfile;
  onResumeContent: (historyItem: ViewingHistoryItem) => void;
}

const PlayIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
  </svg>
);

const RefreshCwIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => ( // Icon for "Watch Again"
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/>
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/>
  </svg>
);


const UserProfilePanel: React.FC<UserProfilePanelProps> = ({ profile, onResumeContent }) => {
  
  const formatTime = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m ${seconds}s`;
  };

  return (
    <div className="bg-slate-800 p-6 rounded-lg shadow-xl animate-fadeIn">
      <div className="flex flex-col sm:flex-row items-center sm:items-start mb-8">
        <img 
          src={profile.avatarUrl || `https://picsum.photos/seed/${profile.userId}/150/150`} 
          alt={profile.displayName} 
          className="w-32 h-32 rounded-full object-cover border-4 border-purple-500 shadow-lg mb-4 sm:mb-0 sm:mr-8"
        />
        <div>
          <h1 className="text-3xl font-bold text-white text-center sm:text-left">{profile.displayName}</h1>
          <p className="text-slate-400 text-center sm:text-left">Member since: {new Date(profile.created_at).toLocaleDateString()}</p>
          <p className="text-slate-400 text-center sm:text-left">User ID: <span className="text-xs">{profile.userId}</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Preferences */}
        <div className="bg-slate-700/50 p-4 rounded-md">
          <h2 className="text-xl font-semibold text-slate-100 mb-3">Preferences</h2>
          <div>
            <h3 className="text-md font-medium text-purple-400 mb-1">Favorite Genres:</h3>
            <div className="flex flex-wrap gap-2">
              {profile.preferences.genres.map(genre => (
                <span key={genre} className="bg-purple-600 text-white px-3 py-1 text-xs rounded-full">{genre}</span>
              ))}
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-md font-medium text-sky-400 mb-1">Preferred Platforms:</h3>
            <div className="flex flex-wrap gap-2">
              {profile.preferences.platforms.map(platform => (
                <span key={platform} className={`${PLATFORM_BADGE_STYLES[platform] || PLATFORM_BADGE_STYLES[Platform.Unknown]} text-white px-3 py-1 text-xs rounded-full`}>{platform}</span>
              ))}
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-md font-medium text-emerald-400 mb-1">Recent Moods:</h3>
            <div className="flex flex-wrap gap-2">
              {profile.preferences.mood_history.slice(0,5).map(mood => ( // Show last 5 moods
                <span key={mood} className="bg-emerald-600 text-white px-3 py-1 text-xs rounded-full">{mood}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Viewing History */}
        <div className="bg-slate-700/50 p-4 rounded-md">
          <h2 className="text-xl font-semibold text-slate-100 mb-3">Viewing History</h2>
          {profile.viewing_history.length > 0 ? (
            <ul className="space-y-3 max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-700/50">
              {profile.viewing_history.slice(0, 10).map((item: ViewingHistoryItem) => {
                const isPartiallyWatched = item.lastWatchPosition && item.totalDuration && item.lastWatchPosition > 0 && item.lastWatchPosition < item.totalDuration;
                const progressPercent = isPartiallyWatched ? (item.lastWatchPosition! / item.totalDuration!) * 100 : (item.lastWatchPosition === item.totalDuration ? 100 : 0);
                
                return (
                <li key={`${item.contentId}-${item.timestamp}`} className="flex flex-col space-y-2 p-2 bg-slate-800 rounded hover:bg-slate-700/70 transition-colors">
                  <div className="flex items-center space-x-3">
                    <img src={item.thumbnailUrl} alt={item.title} className="w-16 h-24 object-cover rounded-sm flex-shrink-0"/>
                    <div className="flex-grow min-w-0"> {/* min-w-0 for proper truncation */}
                      <p className="text-sm font-medium text-slate-200 truncate" title={item.title}>{item.title}</p>
                      <p className="text-xs text-slate-400">{item.platform} &bull; Watched on {new Date(item.timestamp).toLocaleDateString()}</p>
                      {item.rating && <p className="text-xs text-yellow-400">Rated: {item.rating}/5</p>}
                       {item.totalDuration && (
                        <p className="text-xs text-slate-500">
                          {isPartiallyWatched ? `Paused at ${formatTime(item.lastWatchPosition!)}` : (progressPercent === 100 ? 'Completed' : `Duration: ${formatTime(item.totalDuration)}`)}
                        </p>
                       )}
                    </div>
                     <button 
                        onClick={() => onResumeContent(item)} // Always pass the item, App.tsx will decide if it's a resume or full play
                        className={`ml-auto flex-shrink-0 px-2.5 py-1.5 text-xs rounded-md font-medium flex items-center transition-all
                                    ${isPartiallyWatched 
                                      ? 'bg-green-600 hover:bg-green-500 text-white' 
                                      : 'bg-sky-600 hover:bg-sky-500 text-white'}`}
                        title={isPartiallyWatched ? `Resume ${item.title}` : `Watch ${item.title} again`}
                      >
                        {isPartiallyWatched ? <PlayIcon className="mr-1 w-3 h-3"/> : <RefreshCwIcon className="mr-1 w-3 h-3"/>}
                        {isPartiallyWatched ? 'Resume' : 'Watch Again'}
                      </button>
                  </div>
                  {item.totalDuration && progressPercent > 0 && (
                    <div className="w-full bg-slate-600 rounded-full h-1.5 mt-1">
                      <div 
                        className={`${isPartiallyWatched ? 'bg-green-500' : 'bg-sky-500'} h-1.5 rounded-full`}
                        style={{ width: `${progressPercent}%`}}
                        title={`${Math.round(progressPercent)}% watched`}
                      ></div>
                    </div>
                  )}
                </li>
              )})}
            </ul>
          ) : (
            <p className="text-slate-400">No viewing history yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfilePanel;
