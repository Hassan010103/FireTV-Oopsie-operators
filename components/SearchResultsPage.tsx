
import React, { useState, useEffect } from 'react';
import { Content, AppView, RecommendationItem, Platform } from '../types';
import { RecommendationCard } from './RecommendationCard';
import RecommendationCarousel from './RecommendationCarousel';
import LoadingSpinner from './LoadingSpinner';
import { OMDB_API_KEY, OMDB_API_URL_BASE } from '../App'; // Import OMDB constants
import { assignablePlatforms } from '../constants'; // Import assignable platforms

interface SearchResultsPageProps {
  searchQuery: string;
  allContent: Content[]; // This is the masterContentList from App.tsx (curated/enriched)
  onContentSelect: (content: Content) => void;
  onPlayWithPip?: (content: Content) => void;
  onNavigate: (view: AppView) => void;
  onClearSearch: () => void;
}

const MAX_OMDB_DISPLAY_RESULTS = 5;

// Helper to transform OMDB search item (from s= query) to our Content type
const transformOmdbSearchItemToContent = (omdbItem: any): Content => {
  // Use a unique contentId for items coming directly from OMDB search
  // This helps differentiate them from MOCK_CONTENTS if there's overlap before enrichment
  const contentId = `omdb_${omdbItem.imdbID || Math.random().toString(36).substring(7)}`;
  const randomPlatform = assignablePlatforms[Math.floor(Math.random() * assignablePlatforms.length)];

  return {
    contentId: contentId,
    imdbID: omdbItem.imdbID,
    title: omdbItem.Title,
    year: parseInt(omdbItem.Year) || undefined,
    thumbnailUrl: (omdbItem.Poster && omdbItem.Poster !== "N/A") ? omdbItem.Poster : `https://picsum.photos/seed/${contentId}/400/225`, // Default placeholder
    bannerUrl: (omdbItem.Poster && omdbItem.Poster !== "N/A") ? omdbItem.Poster : `https://picsum.photos/seed/${contentId}_banner/1280/720`,
    platform: randomPlatform, // Assign a random known platform
    genre: [], // Not provided by 's=' endpoint
    description: `Details for ${omdbItem.Title} will be loaded upon selection.`, // Placeholder
    director: undefined,
    cast: [],
    rating: undefined,
    duration: undefined,
    mood_tags: [],
    videoUrl: undefined,
    peakWatchData: [],
    deepLink: undefined,
    timestamp: new Date().toISOString()
  };
};


const SearchResultsPage: React.FC<SearchResultsPageProps> = ({
  searchQuery,
  allContent, // Curated master list
  onContentSelect,
  onPlayWithPip,
  onNavigate,
  onClearSearch
}) => {
  const [localResults, setLocalResults] = useState<Content[]>([]);
  const [omdbApiResults, setOmdbApiResults] = useState<Content[]>([]);
  const [isLoadingApi, setIsLoadingApi] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const trimmedSearchQuery = searchQuery.trim().toLowerCase();

  useEffect(() => {
    // Filter local content (masterContentList)
    if (trimmedSearchQuery) {
      const filteredLocal = allContent.filter(content =>
        content.title.toLowerCase().includes(trimmedSearchQuery)
      );
      setLocalResults(filteredLocal);
    } else {
      setLocalResults([]);
    }

    // Fetch from OMDB API
    if (trimmedSearchQuery) {
      setIsLoadingApi(true);
      setApiError(null);
      setOmdbApiResults([]); // Clear previous API results

      fetch(`${OMDB_API_URL_BASE}&s=${trimmedSearchQuery}`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`OMDB API error: ${response.statusText}`);
          }
          return response.json();
        })
        .then(data => {
          if (data.Response === "True" && data.Search) {
            const transformedOmdbMovies = data.Search.map(transformOmdbSearchItemToContent);
            // Deduplicate: Don't show OMDB results if already present in localResults (based on imdbID)
            const localImdbIDs = new Set(localResults.map(c => c.imdbID).filter(id => id));
            const uniqueOmdbResults = transformedOmdbMovies.filter(omdbMovie =>
              !omdbMovie.imdbID || !localImdbIDs.has(omdbMovie.imdbID)
            );
            setOmdbApiResults(uniqueOmdbResults.slice(0, MAX_OMDB_DISPLAY_RESULTS)); // Display top N results
          } else if (data.Error && data.Error !== "Movie not found!") { // "Movie not found!" is a valid empty result
            setApiError(data.Error); // This will include "Too many results."
          } else {
            setOmdbApiResults([]); // No results or "Movie not found!"
          }
          setIsLoadingApi(false);
        })
        .catch(error => {
          console.error("Error fetching from OMDB:", error);
          setApiError(error.message || "Failed to fetch from OMDB.");
          setIsLoadingApi(false);
        });
    } else {
      setOmdbApiResults([]);
      setIsLoadingApi(false);
      setApiError(null);
    }
  }, [trimmedSearchQuery, allContent]); // localResults is derived, so no need to include it here

  const hasAnyResults = localResults.length > 0 || omdbApiResults.length > 0;

  if (trimmedSearchQuery === '' && !isLoadingApi) {
    return (
      <div className="text-center py-10 animate-fadeIn">
        <h1 className="text-3xl font-bold text-slate-100 mb-6">Search Movies</h1>
        <p className="text-slate-400 mb-6">
          Type in the search bar above to find movies. Results will appear live.
        </p>
        <button
          onClick={() => onNavigate('home')}
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-transform transform hover:scale-105"
        >
          Go to Home
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn py-4">
      <h1 className="text-3xl sm:text-4xl font-bold text-slate-100 mb-8 text-center sm:text-left">
        {`Search Results for "${searchQuery.trim()}"`}
      </h1>

      {isLoadingApi && <div className="my-6"><LoadingSpinner /> <p className="text-center text-slate-400">Searching OMDB...</p></div>}
      
      {/* Display API Error (including "Too many results") if present and not loading */}
      {apiError && !isLoadingApi && (
        <p className="text-red-400 text-center my-6 py-4 bg-red-900/30 rounded-md">Error: {apiError}</p>
      )}
      
      {/* Display "No movies found" only if there's no API error and no results */}
      {!isLoadingApi && !apiError && !hasAnyResults && (
        <div className="text-center py-10 bg-slate-800 rounded-lg shadow-md">
          <p className="text-xl text-slate-300 mb-4">No movies found for "{searchQuery.trim()}".</p>
          <p className="text-slate-400 mb-6">Try a different search term or explore our recommendations.</p>
          <button
            onClick={onClearSearch}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2.5 px-6 rounded-lg shadow-md transition-transform transform hover:scale-105"
          >
            Clear Search & Go Home
          </button>
        </div>
      )}

      {localResults.length > 0 && (
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-sky-400 mb-4 border-b-2 border-sky-800 pb-2">
            Matches in Your Library
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
            {localResults.map((content) => (
              <RecommendationCard
                key={`local-${content.contentId}`}
                content={content}
                onSelect={() => onContentSelect(content)}
                onPlayWithPip={onPlayWithPip}
              />
            ))}
          </div>
        </section>
      )}

      {omdbApiResults.length > 0 && !apiError && ( // Only show OMDB results if no API error
        <section className="mb-10">
           <h2 className="text-2xl font-semibold text-purple-400 mb-4 border-b-2 border-purple-800 pb-2">
            Found on OMDB (Top {MAX_OMDB_DISPLAY_RESULTS})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
            {omdbApiResults.map((content) => (
              <RecommendationCard
                key={`omdb-${content.imdbID || content.contentId}`}
                content={content}
                onSelect={() => onContentSelect(content)} // App.tsx will enrich this
                onPlayWithPip={onPlayWithPip}
              />
            ))}
          </div>
        </section>
      )}

      {/* Suggestion for similar movies based on first local result - could be refined */}
      {localResults.length > 0 && allContent.length > 0 && (() => {
          const firstResult = localResults[0];
          let similarRecommendationItems: RecommendationItem[] = [];
          if (firstResult.genre && firstResult.genre.length > 0) {
            const similarMovies = allContent.filter(content => {
              if (content.contentId === firstResult.contentId) return false;
              if (localResults.some(r => r.contentId === content.contentId)) return false;
              if (omdbApiResults.some(r => r.imdbID === content.imdbID && content.imdbID)) return false;
              if (!content.genre || content.genre.length === 0) return false;
              return content.genre.some(g => firstResult.genre.includes(g));
            }).slice(0, 10);

            similarRecommendationItems = similarMovies.map(movie => ({
              ...movie,
              reason: `Shares genre(s) with ${firstResult.title}`,
              confidence: Math.random() * 0.2 + 0.6
            }));
          }
          if (similarRecommendationItems.length > 0) {
            return (
                <div className="mt-12">
                   <RecommendationCarousel
                    title={`Similar to ${firstResult.title}`}
                    recommendations={similarRecommendationItems}
                    onContentSelect={onContentSelect}
                    onPlayWithPip={onPlayWithPip}
                  />
                </div>
            );
          }
          return null;
      })()}

    </div>
  );
};

export default SearchResultsPage;
