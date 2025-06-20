

import React from 'react';
import { DiscoverableUser } from '../types';
import LoadingSpinner from './LoadingSpinner';

interface DiscoverUsersPageProps {
  users: DiscoverableUser[];
  onSendFriendRequest: (userId: string) => void;
  isLoading: boolean;
}

const UserPlusIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path d="M11 5a3 3 0 11-6 0 3 3 0 016 0zM2.044 14.236a.75.75 0 00-.198.697A6.501 6.501 0 008.5 18a6.5 6.5 0 006.654-3.067.75.75 0 00-.198-.697A4.501 4.501 0 008.5 12.5a4.5 4.5 0 00-6.456 1.736zM13.75 7.5a.75.75 0 000 1.5h1.5v1.5a.75.75 0 001.5 0v-1.5h1.5a.75.75 0 000-1.5h-1.5v-1.5a.75.75 0 00-1.5 0v1.5h-1.5z" />
  </svg>
);
const CheckCircleIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
  </svg>
);
const PaperAirplaneIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => ( // For "Request Sent"
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path d="M3.105 3.105a.75.75 0 01.814-.102l14.25 8.25a.75.75 0 010 1.302l-14.25 8.25a.75.75 0 01-.814-.102A.75.75 0 013 20.25V4.75a.75.75 0 01.105-.645zM4.5 10.875a.75.75 0 000 1.25l8.25 2.625V8.25L4.5 10.875z" />
  </svg>
);


const DiscoverUsersPage: React.FC<DiscoverUsersPageProps> = ({ users, onSendFriendRequest, isLoading }) => {
  if (isLoading) {
    return <div className="flex justify-center items-center h-[calc(100vh-12rem)]"><LoadingSpinner /></div>;
  }

  return (
    <div className="animate-fadeIn py-4">
      <h1 className="text-3xl sm:text-4xl font-bold text-slate-100 mb-10 text-center sm:text-left">
        Discover Other Users
      </h1>
      {users.length === 0 && !isLoading ? (
         <p className="text-slate-400 text-center py-6 bg-slate-800 rounded-md">
            No other users to discover at the moment.
          </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {users.map((user) => (
            <div key={user.userId} className="bg-slate-800 rounded-lg shadow-lg p-5 flex flex-col items-center text-center transition-all duration-300 hover:shadow-purple-500/30 hover:scale-105">
                <img
                src={user.avatarUrl || `https://picsum.photos/seed/${user.userId}/120/120`}
                alt={user.displayName}
                className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-slate-700 shadow-md"
                />
                <h2 className="text-xl font-semibold text-slate-100 mb-1 truncate w-full" title={user.displayName}>
                  {user.displayName}
                </h2>
                {user.commonInterests && user.commonInterests.length > 0 && (
                <p className="text-xs text-slate-400 mb-3 h-8 overflow-hidden line-clamp-2" title={user.commonInterests.join(', ')}>
                    Interests: {user.commonInterests.join(', ')}
                </p>
                )}
                 <div className="mt-auto w-full pt-3"> {/* Pushes button to bottom */}
                    {user.friendshipStatus === 'not_friends' && (
                    <button
                        onClick={() => onSendFriendRequest(user.userId)}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md text-sm flex items-center justify-center transition-colors"
                    >
                        <UserPlusIcon className="mr-2" /> Add Friend
                    </button>
                    )}
                    {user.friendshipStatus === 'request_sent' && (
                    <button
                        disabled
                        className="w-full bg-sky-700 text-sky-300 font-medium py-2 px-4 rounded-md text-sm flex items-center justify-center cursor-not-allowed"
                    >
                        <PaperAirplaneIcon className="mr-2" /> Request Sent
                    </button>
                    )}
                    {user.friendshipStatus === 'friends' && (
                    <button
                        disabled
                        className="w-full bg-green-700 text-green-300 font-medium py-2 px-4 rounded-md text-sm flex items-center justify-center cursor-not-allowed"
                    >
                        <CheckCircleIcon className="mr-2" /> Friends
                    </button>
                    )}
                </div>
            </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default DiscoverUsersPage;