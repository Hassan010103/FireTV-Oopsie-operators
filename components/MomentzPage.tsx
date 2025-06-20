import React, { useMemo } from 'react';
import { VibeCircle, UserProfile, Snap, SnapCreatorStoryInfo } from '../types';
import LoadingSpinner from './LoadingSpinner';
import SnapStoryCircles from './SnapStoryCircles'; 

interface MomentzPageProps {
  currentUser: UserProfile | null;
  vibeCircles: VibeCircle[]; 
  allSnaps: Snap[]; 
  allTrendingSnaps: Snap[]; 
  onSelectVibeCircle: (vibeCircleId: string) => void; 
  onOpenSnapStoryViewer: (creatorId: string, mode: 'friends' | 'trending') => void; 
  isLoading: boolean;
}

const SparklesIconSolid: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
  </svg>
);

const PlusCircleIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="..." clipRule="evenodd" />
  </svg>
);

const FireIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => ( 
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="..." clipRule="evenodd" />
  </svg>
);

const MomentzPage: React.FC<MomentzPageProps> = ({ 
  currentUser, 
  vibeCircles, 
  allSnaps, 
  allTrendingSnaps,
  onSelectVibeCircle, 
  onOpenSnapStoryViewer, 
  isLoading 
}) => {

  const usersVibeCircles = useMemo(() => {
    if (!currentUser?.vibeCircleIds) return [];
    return vibeCircles.filter(vc => currentUser.vibeCircleIds!.includes(vc.id));
  }, [currentUser, vibeCircles]);

  const friendStoryCreators = useMemo(() => {
    if (!currentUser?.vibeCircleIds || allSnaps.length === 0) return [];

    const snapsFromUserVibeCircles = allSnaps.filter(snap => 
      !snap.isPublic && currentUser.vibeCircleIds!.includes(snap.vibeCircleId)
    );

    const latestSnapByCreator = new Map<string, Snap>();
    snapsFromUserVibeCircles.forEach(snap => {
      const existing = latestSnapByCreator.get(snap.creatorInfo.userId);
      if (!existing || new Date(snap.timestamp) > new Date(existing.timestamp)) {
        latestSnapByCreator.set(snap.creatorInfo.userId, snap);
      }
    });

    return Array.from(latestSnapByCreator.values())
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .map(snap => ({
        userId: snap.creatorInfo.userId,
        displayName: snap.creatorInfo.displayName,
        avatarUrl: snap.creatorInfo.avatarUrl,
        latestSnapTimestamp: snap.timestamp,
      }));
  }, [allSnaps, currentUser]);

  const trendingStoryCreators = useMemo(() => {
    if (allTrendingSnaps.length === 0) return [];

    const latestSnapByCreator = new Map<string, Snap>();
    allTrendingSnaps.forEach(snap => {
      if (snap.isPublic) {
        const existing = latestSnapByCreator.get(snap.creatorInfo.userId);
        if (!existing || new Date(snap.timestamp) > new Date(existing.timestamp)) {
          latestSnapByCreator.set(snap.creatorInfo.userId, snap);
        }
      }
    });

    return Array.from(latestSnapByCreator.values())
      .sort((a, b) =>
        b.reactions.filter(r => r.emoji === "👍").length -
        a.reactions.filter(r => r.emoji === "👍").length
      )
      .map(snap => ({
        userId: snap.creatorInfo.userId,
        displayName: snap.creatorInfo.displayName,
        avatarUrl: snap.creatorInfo.avatarUrl,
        totalLikes: snap.reactions.filter(r => r.emoji === "👍").length,
        latestSnapTimestamp: snap.timestamp,
      }));
  }, [allTrendingSnaps]);

  if (isLoading && (!currentUser || (friendStoryCreators.length === 0 && usersVibeCircles.some(vc => vc.snapIds.length > 0)))) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-12rem)]">
        <LoadingSpinner />
        <p className="mt-3 text-slate-300">Loading your Momentz...</p>
      </div>
    );
  }

  if (!currentUser) {
    return <div className="text-center py-10 text-slate-400">Please log in to see your Momentz.</div>;
  }

  return (
    <div className="animate-fadeIn py-4 space-y-12">
      <div className="flex items-center">
        <SparklesIconSolid className="w-10 h-10 text-purple-400 mr-3" />
        <h1 className="text-3xl sm:text-4xl font-bold text-purple-400">Momentz</h1>
      </div>

      {/* Friend's Snaps */}
      <section>
        <h2 className="text-2xl font-semibold text-slate-200 mb-6">Friend's Snaps</h2>
        {isLoading && friendStoryCreators.length === 0 ? (
          <div className="py-8"><LoadingSpinner /></div>
        ) : friendStoryCreators.length === 0 ? (
          <div className="bg-slate-800 p-8 rounded-lg shadow-md text-center">
            <p className="text-xl text-slate-300">No recent snaps from friends.</p>
            <p className="text-slate-400 mt-2">Their latest snaps will appear here!</p>
          </div>
        ) : (
          <SnapStoryCircles
            creatorsWithSnaps={[
              ...friendStoryCreators,
              ...friendStoryCreators.slice(0, 3), // Duplicates
            ]}
            onSelectCreator={(creatorId) => onOpenSnapStoryViewer(creatorId, 'friends')}
          />
        )}
      </section>

      {/* Trending Snaps */}
      <section>
        <h2 className="text-2xl font-semibold text-slate-200 mb-6">Trending Snaps in India 🔥</h2>
        {isLoading && trendingStoryCreators.length === 0 && allTrendingSnaps.length > 0 ? (
          <div className="py-8"><LoadingSpinner /></div>
        ) : trendingStoryCreators.length === 0 ? (
          <div className="bg-slate-800 p-8 rounded-lg shadow-md text-center">
            <p className="text-xl text-slate-300">No trending snaps right now.</p>
            <p className="text-slate-400 mt-2">Check back later for the latest buzz!</p>
          </div>
        ) : (
          <SnapStoryCircles
            creatorsWithSnaps={trendingStoryCreators}
            onSelectCreator={(creatorId) => onOpenSnapStoryViewer(creatorId, 'trending')}
            showLikes={true}
          />
        )}
      </section>

      {/* Your Vibe Circles */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-slate-200">Your Vibe Circles</h2>
          <button
            onClick={() => alert("Mock: Create New Vibe Circle!")}
            className="flex items-center bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors text-sm"
            title="Create a new Vibe Circle"
          >
            <PlusCircleIcon className="w-5 h-5 mr-2" />
            New Vibe Circle
          </button>
        </div>
        {usersVibeCircles.length === 0 && !isLoading ? (
          <div className="bg-slate-800 p-8 rounded-lg shadow-md text-center">
            <p className="text-xl text-slate-300 mb-4">No Vibe Circles Joined Yet</p>
            <p className="text-slate-400">Create or join a Vibe Circle to start sharing Momentz!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {usersVibeCircles.map((vibeCircle) => (
              <button
                key={vibeCircle.id}
                onClick={() => onSelectVibeCircle(vibeCircle.id)}
                className="bg-slate-800 p-5 rounded-xl shadow-lg hover:shadow-purple-500/30 border border-slate-700 hover:border-purple-600/60 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900 text-left flex flex-col items-start"
              >
                <div className="flex items-center mb-3 w-full">
                  <div className="p-2 bg-purple-500/20 rounded-full mr-3">
                    <FireIcon className="w-6 h-6 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-100 truncate flex-grow" title={vibeCircle.name}>{vibeCircle.name}</h3>
                </div>
                {vibeCircle.recentSnapImage && (
                  <img src={vibeCircle.recentSnapImage} alt={`${vibeCircle.name} latest snap`} className="w-full h-32 object-cover rounded-md mb-3 opacity-70 group-hover:opacity-100 transition-opacity" />
                )}
                <p className="text-sm text-slate-400 mb-2 line-clamp-2 flex-grow min-h-[40px]">
                  {vibeCircle.description || 'No description.'}
                </p>
                <div className="flex items-center justify-between w-full mt-2 text-xs text-slate-500">
                  <span>{vibeCircle.memberIds.length} Member(s)</span>
                  <span>{vibeCircle.snapIds.length} Snap(s)</span>
                </div>
              </button>
            ))}
          </div>
        )}
        {isLoading && usersVibeCircles.length === 0 && <LoadingSpinner />}
      </section>
    </div>
  );
};

export default MomentzPage;
