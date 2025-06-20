

import React from 'react';
import { Content, GroupedFriendSuggestions, GroupedMySuggestions, RecommendationItem } from '../types';
import RecommendationCarousel from './RecommendationCarousel';

interface SuggestionsPageProps {
  groupedFriendSuggestions: GroupedFriendSuggestions;
  mySuggestionsMade: GroupedMySuggestions;
  onContentSelect: (content: Content) => void;
  onPlayWithPip?: (content: Content) => void; // New optional prop
}

const SuggestionsPage: React.FC<SuggestionsPageProps> = ({ 
    groupedFriendSuggestions, 
    mySuggestionsMade, 
    onContentSelect,
    onPlayWithPip
}) => {
  const hasFriendSuggestions = Object.keys(groupedFriendSuggestions).length > 0;
  const hasMySuggestions = Object.keys(mySuggestionsMade).length > 0;

  return (
    <div className="animate-fadeIn py-4">
      <h1 className="text-3xl sm:text-4xl font-bold text-slate-100 mb-10 text-center sm:text-left">
        Your Suggestions Hub
      </h1>

      {/* Section: Content Suggested To You */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-sky-400 mb-6 border-b-2 border-sky-800 pb-2">
          From Your Friends
        </h2>
        {hasFriendSuggestions ? (
          Object.entries(groupedFriendSuggestions).map(([suggesterId, data]) => {
            // App.tsx now sets the reason in RecommendationItem directly using message or a default.
            // So, data.suggestions should already have appropriate reasons.
            return (
              <RecommendationCarousel
                key={`sugg-from-${suggesterId}`}
                title={`Suggested by ${data.suggester.displayName}`}
                recommendations={data.suggestions} // These items should have their 'reason' field correctly populated by App.tsx
                onContentSelect={onContentSelect}
                onPlayWithPip={onPlayWithPip} // Pass down the prop
              />
            );
          })
        ) : (
          <p className="text-slate-400 text-center py-6 bg-slate-800 rounded-md">
            No content has been suggested to you yet.
          </p>
        )}
      </section>

      {/* Section: Content You've Suggested */}
      <section>
        <h2 className="text-2xl font-semibold text-purple-400 mb-6 border-b-2 border-purple-800 pb-2">
          Shared by You
        </h2>
        {hasMySuggestions ? (
          Object.entries(mySuggestionsMade).map(([recipientId, data]) => {
            // App.tsx now sets the reason in RecommendationItem directly.
            return (
              <RecommendationCarousel
                key={`sugg-to-${recipientId}`}
                title={`Sent to ${data.recipient.displayName}`}
                recommendations={data.suggestions} // These items should have their 'reason' field correctly populated
                onContentSelect={onContentSelect}
                onPlayWithPip={onPlayWithPip} // Pass down the prop
              />
            );
          })
        ) : (
          <p className="text-slate-400 text-center py-6 bg-slate-800 rounded-md">
            You haven't suggested any content to your friends yet.
          </p>
        )}
      </section>
    </div>
  );
};

export default SuggestionsPage;