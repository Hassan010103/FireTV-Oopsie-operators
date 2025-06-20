
import React from 'react';
import { VibeCircle, Snap, UserProfile, WatchPartyParticipant } from '../types';
import LoadingSpinner from './LoadingSpinner';
import SnapCardComponent from './SnapCardComponent';

interface VibeCircleViewPageProps {
  vibeCircle: VibeCircle | null;
  snaps: Snap[];
  members: WatchPartyParticipant[];
  currentUser: UserProfile | null;
  onBack: () => void;
  onAddReaction: (snapId: string, emoji: string) => void;
}

const ArrowLeftIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
  </svg>
);

const CameraIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M10 5a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 5zM3 5.75A2.75 2.75 0 015.75 3h8.5A2.75 2.75 0 0117 5.75v8.5A2.75 2.75 0 0114.25 17h-8.5A2.75 2.75 0 013 14.25v-8.5zM5.75 4.5a1.25 1.25 0 00-1.25 1.25v8.5c0 .69.56 1.25 1.25 1.25h8.5c.69 0 1.25-.56 1.25-1.25v-8.5c0-.69-.56-1.25-1.25-1.25h-8.5zM10 7a.75.75 0 00-1.02.727l.165 1.321a3.75 3.75 0 006.71 0l.165-1.321A.75.75 0 0015 7h-5z" clipRule="evenodd" />
      <path d="M8.75 9.75a2.25 2.25 0 104.5 0 2.25 2.25 0 00-4.5 0z" />
    </svg>
  );

const FireIconSolid: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M12.963 2.286a.75.75 0 00-1.071 1.056 9.765 9.765 0 00-1.222 3.84L9.5 7.558V7.5a2.25 2.25 0 00-2.25-2.25H6.375a.75.75 0 00-.75.75V15c0 .988.626 1.813 1.506 2.117L7.5 17.25v.08A2.625 2.625 0 0010.125 20h3.75A2.625 2.625 0 0016.5 17.33v-.08l.369-.116A2.25 2.25 0 0018.375 15V5.625a.75.75 0 00-.75-.75h-.875A2.25 2.25 0 0014.5 7.5v.058l-1.19-.33a9.765 9.765 0 00-1.222-3.84.75.75 0 00-1.056-1.057zM12 10.875a1.875 1.875 0 100-3.75 1.875 1.875 0 000 3.75z" clipRule="evenodd" />
    </svg>
);

const VibeCircleViewPage: React.FC<VibeCircleViewPageProps> = ({
  vibeCircle,
  snaps,
  members,
  currentUser,
  onBack,
  onAddReaction,
}) => {
  if (!vibeCircle || !currentUser) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-12rem)]">
        <LoadingSpinner />
        <p className="mt-3 text-slate-300">Loading Vibe Circle...</p>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn py-4">
      <button onClick={onBack} className="mb-6 flex items-center text-sm text-purple-400 hover:text-purple-300 transition-colors">
        <ArrowLeftIcon className="w-5 h-5 mr-2" />
        Back to Momentz
      </button>

      {/* Vibe Circle Header */}
      <div className="mb-8 p-6 bg-slate-800 rounded-xl shadow-xl border border-slate-700">
        <div className="flex items-start md:items-center justify-between mb-4 flex-col md:flex-row">
            <div className="flex items-center mb-3 md:mb-0">
                <FireIconSolid className="w-10 h-10 text-purple-400 mr-4"/>
                <div>
                    <h1 className="text-3xl font-bold text-purple-300">{vibeCircle.name}</h1>
                    <p className="text-sm text-slate-400 mt-1">{vibeCircle.description || "No description provided for this Vibe Circle."}</p>
                </div>
            </div>
            <button
                onClick={() => alert(`Mock: Add Snap to ${vibeCircle.name}`)}
                className="flex items-center bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors text-sm"
            >
                <CameraIcon className="w-5 h-5 mr-2"/>
                Post a Snap
            </button>
        </div>

        <div className="border-t border-slate-700 pt-4">
            <h3 className="text-sm font-semibold text-slate-300 mb-2">Members ({members.length}):</h3>
            <div className="flex flex-wrap -space-x-2 overflow-hidden">
            {members.slice(0, 10).map(member => (
                <img
                key={member.userId}
                src={member.avatarUrl || `https://picsum.photos/seed/${member.userId}/40/40`}
                alt={member.displayName}
                title={member.displayName}
                className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-800 object-cover"
                />
            ))}
            {members.length > 10 && (
                <span className="flex items-center justify-center h-8 w-8 rounded-full bg-slate-600 text-xs text-slate-300 ring-2 ring-slate-800">
                +{members.length - 10}
                </span>
            )}
            </div>
        </div>
      </div>

      {/* Snaps Grid */}
      <h2 className="text-2xl font-semibold text-slate-200 mb-6">Snaps in this Vibe Circle</h2>
      {snaps.length === 0 ? (
        <div className="bg-slate-800 p-8 rounded-lg shadow-md text-center">
          <p className="text-xl text-slate-300 mb-4">No Snaps Yet!</p>
          <p className="text-slate-400">
            Be the first to share a Moment in this Vibe Circle! Use the button above.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {snaps.map(snap => (
            <SnapCardComponent
              key={snap.id}
              snap={snap}
              currentUser={currentUser}
              onAddReaction={onAddReaction}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default VibeCircleViewPage;
