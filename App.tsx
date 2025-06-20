import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { UserProfile, RecommendationItem, WatchPartySession, AppView, Content, Mood, Platform, ViewingHistoryItem, WatchPartyParticipant, GroupedFriendSuggestions, GroupedMySuggestions, MatcherSessionState, MatcherDecision, MatcherUserState, DiscoverableUser, GlobalSuggestionItem, OngoingPartyDisplayItem, VibeCircle, Snap, SnapReaction, SnapCreatorStoryInfo } from './types'; // VibeCircle import
import { MOCK_USER_PROFILE_HASSAN, MOCK_RECOMMENDATIONS, MOCK_WATCH_PARTY_SESSION_BASE, MOCK_CONTENTS, MOOD_OPTIONS, MOCK_POTENTIAL_FRIENDS, MOCK_FRIEND_MATCHER_DECISIONS, MOCK_WATCH_PARTY_SESSION_WITH_CONTENT, MOCK_DISCOVERABLE_USERS, MOCK_USER_ID, MOCK_USER_PROFILE_PRIYA, ALL_MOCK_SUGGESTIONS, MOCK_USER_ID_PRIYA, MATCHER_MOVIE_POOL_SIZE, PLATFORM_BADGE_STYLES, MOCK_ACTIVE_FRIEND_SESSIONS, MOCK_USER_ID_ANANYA, MOCK_VIBE_CIRCLES, MOCK_SNAPS, MOCK_TRENDING_SNAPS_INDIA, MOCK_TRENDING_CREATORS } from './constants'; // MOCK_VIBE_CIRCLES, MOCK_TRENDING_SNAPS_INDIA import
import Navigation from './components/Navigation.tsx';
import RecommendationCarousel from './components/RecommendationCarousel.tsx';
import WatchPartyPanel from './components/WatchPartyPanel.tsx';
import UserProfilePanel from './components/UserProfilePanel.tsx';
import LoadingSpinner from './components/LoadingSpinner.tsx';
import ContentDetailView from './components/ContentDetailView.tsx';
import HeroSection from './components/HeroSection.tsx';
import MoodSelector from './components/MoodSelector.tsx';
import AiSummaryModal from './components/AiSummaryModal.tsx';
import LoginView from './components/LoginView.tsx';
import SuggestionsPage from './components/SuggestionsPage.tsx';
import SuggestToFriendModal from './components/SuggestToFriendModal.tsx';
import MovieMatcherScreen from './components/MovieMatcherScreen.tsx';
import DiscoverUsersPage from './components/DiscoverUsersPage.tsx';
import StandaloneVideoPlayer from './components/StandaloneVideoPlayer.tsx';
import MatcherOptionsModal from './components/MatcherOptionsModal.tsx';
import JoinCodeInputModal from './components/JoinCodeInputModal.tsx';
import SearchResultsPage from './components/SearchResultsPage.tsx';
// import OngoingPartiesPage from './components/OngoingPartiesPage.tsx'; // Removed
import MomentzPage from './components/MomentzPage.tsx';
import VibeCircleViewPage from './components/VibeCircleViewPage.tsx'; // Renamed import
import CreateSnapModal from './components/CreateSnapModal.tsx'; // New import
import SnapStoryViewerModal from './components/SnapStoryViewerModal.tsx'; // New import


const apiKey = process.env.API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey || "MOCK_API_KEY_DO_NOT_USE_IN_PROD" });

export const OMDB_API_KEY = "5426c86e"; // Export for use in SearchResultsPage
export const OMDB_API_URL_BASE = `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}`;

const PLATFORM_URLS: Record<string, string> = {
  netflix: 'https://www.netflix.com/',
  primevideo: 'https://www.primevideo.com/',
  hotstar: 'https://www.hotstar.com/',
  zee5: 'https://www.zee5.com/',
  youtube: 'https://www.youtube.com/',
};

type TimeSlot = 'morning' | 'afternoon' | 'evening' | 'lateNight';

const getTimeSlot = (date: Date = new Date()): TimeSlot => {
  const hour = date.getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 22) return 'evening';
  return 'lateNight';
};

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const formatSecondsToHHMMSS = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);
    let timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    if (hours > 0) {
        timeString = `${hours.toString().padStart(2, '0')}:${timeString}`;
    }
    return timeString;
};

const generateJoinCode = () => Math.random().toString(36).substring(2, 8).toUpperCase();

const parseRuntimeToSeconds = (runtimeStr?: string): number | undefined => {
  if (!runtimeStr || runtimeStr === "N/A") return undefined;
  const minutes = parseInt(runtimeStr.replace(" min", ""));
  return isNaN(minutes) ? undefined : minutes * 60;
};

const NETFLIX_LOGO_SVG = `<svg viewBox="0 0 100 30" fill="none" xmlns="http://www.w3.org/2000/svg"><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="'Netflix Sans', Helvetica, Arial, sans-serif" font-size="17" fill="#E50914" font-weight="bold">NETFLIX</text></svg>`;
const PRIME_VIDEO_LOGO_SVG = `<svg viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg"><text x="50%" y="40%" dominant-baseline="middle" text-anchor="middle" font-family="'Amazon Ember', Arial, sans-serif" font-size="11" fill="white" font-weight="bold">prime video</text><path d="M38 28 Q60 36 82 28" stroke="white" stroke-width="3" fill="none"/><path d="M77 24 L82 28 L77 31" stroke="white" stroke-width="3" fill="none"/></svg>`;
const HOTSTAR_LOGO_SVG = `<svg viewBox="0 0 100 30" fill="none" xmlns="http://www.w3.org/2000/svg"><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="16" fill="white" font-weight="bold">Hotstar</text></svg>`;
const ZEE5_LOGO_SVG = `<svg viewBox="0 0 100 30" fill="none" xmlns="http://www.w3.org/2000/svg"><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="18" fill="white" font-weight="bold">ZEE5</text></svg>`;
const YOUTUBE_LOGO_SVG = `<svg viewBox="0 0 100 30" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="38" y="5" width="48" height="20" rx="4.5" fill="#FF0000"/><text x="21" y="15" dominant-baseline="middle" text-anchor="middle" font-family="'YouTube Sans', Roboto, Arial, sans-serif" font-size="11" fill="#282828" font-weight="bold">You</text><text x="62" y="15" dominant-baseline="middle" text-anchor="middle" font-family="'YouTube Sans', Roboto, Arial, sans-serif" font-size="11" fill="white" font-weight="bold">Tube</text></svg>`;

interface PlatformButtonUIData {
  platform: Platform;
  name: string;
  logoSvg: string;
  buttonBg: string;
  buttonHoverBg: string;
  selectedRing: string;
  selectedButtonBg?: string;
}

const platformButtonsData: PlatformButtonUIData[] = [
  { platform: Platform.Netflix, name: 'Netflix', logoSvg: NETFLIX_LOGO_SVG, buttonBg: 'bg-white', buttonHoverBg: 'hover:bg-slate-100', selectedRing: 'ring-red-500', selectedButtonBg: 'bg-slate-100' },
  { platform: Platform.PrimeVideo, name: 'Prime Video', logoSvg: PRIME_VIDEO_LOGO_SVG, buttonBg: 'bg-sky-500', buttonHoverBg: 'hover:bg-sky-600', selectedRing: 'ring-sky-300', selectedButtonBg: 'bg-sky-700' },
  { platform: Platform.Hotstar, name: 'Hotstar', logoSvg: HOTSTAR_LOGO_SVG, buttonBg: 'bg-blue-700', buttonHoverBg: 'hover:bg-blue-800', selectedRing: 'ring-blue-400', selectedButtonBg: 'bg-blue-900' },
  { platform: Platform.Zee5, name: 'Zee5', logoSvg: ZEE5_LOGO_SVG, buttonBg: 'bg-purple-600', buttonHoverBg: 'hover:bg-purple-700', selectedRing: 'ring-purple-300', selectedButtonBg: 'bg-purple-800' },
  { platform: Platform.Youtube, name: 'YouTube', logoSvg: YOUTUBE_LOGO_SVG, buttonBg: 'bg-white', buttonHoverBg: 'hover:bg-slate-100', selectedRing: 'ring-red-500', selectedButtonBg: 'bg-slate-100' },
];


const App: React.FC = () => {
  const [currentUserProfile, setCurrentUserProfile] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  const [masterContentList, setMasterContentList] = useState<Content[]>([]);
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);
  const [filteredRecommendations, setFilteredRecommendations] = useState<RecommendationItem[]>([]);
  const [groupedFriendSuggestions, setGroupedFriendSuggestions] = useState<GroupedFriendSuggestions>({});
  const [mySuggestionsMade, setMySuggestionsMade] = useState<GroupedMySuggestions>({});

  const [watchPartySession, setWatchPartySession] = useState<WatchPartySession | null>(null);
  const [currentView, setCurrentView] = useState<AppView>('login');
  const [isLoading, setIsLoading] = useState<boolean>(false); // General loading for app state changes
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [currentMood, setCurrentMood] = useState<Mood | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);
  const [initialAppLoadDone, setInitialAppLoadDone] = useState<boolean>(false);
  const [timeBasedRecommendationType, setTimeBasedRecommendationType] = useState<string | null>(null);

  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState<boolean>(false);
  const [summaryContentInfo, setSummaryContentInfo] = useState<{content: Content, lastPosition: number, totalDuration: number} | null>(null);
  const [summaryText, setSummaryText] = useState<string>('');
  const [isSummaryLoading, setIsSummaryLoading] = useState<boolean>(false);
  const [summaryError, setSummaryError] = useState<string>('');

  const [isSuggestModalOpen, setIsSuggestModalOpen] = useState<boolean>(false);
  const [contentToSuggestForModal, setContentToSuggestForModal] = useState<Content | null>(null);

  const [isMatcherLoading, setIsMatcherLoading] = useState<boolean>(false);

  const [discoverableUsers, setDiscoverableUsers] = useState<DiscoverableUser[]>([]);
  const [pendingFriendRequests, setPendingFriendRequests] = useState<string[]>([]);
  const [actualFriends, setActualFriends] = useState<string[]>([]); 

  const [playingStandaloneVideo, setPlayingStandaloneVideo] = useState<Content | null>(null);
  const [activeMatcherSessions, setActiveMatcherSessions] = useState<Record<string, WatchPartySession>>({});

  const [isMatcherOptionsModalOpen, setIsMatcherOptionsModalOpen] = useState<boolean>(false);
  const [isJoinCodeInputModalOpen, setIsJoinCodeInputModalOpen] = useState<boolean>(false);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [previousViewForContentDetail, setPreviousViewForContentDetail] = useState<AppView | null>(null);

  const [ongoingFriendParties, setOngoingFriendParties] = useState<OngoingPartyDisplayItem[]>([]);
  
  // Momentz State
  const [allVibeCircles, setAllVibeCircles] = useState<VibeCircle[]>([]);
  const [allSnaps, setAllSnaps] = useState<Snap[]>(MOCK_SNAPS); 
  const [allTrendingSnaps, setAllTrendingSnaps] = useState<Snap[]>(MOCK_TRENDING_SNAPS_INDIA);
  const [currentUserVibeCircles, setCurrentUserVibeCircles] = useState<VibeCircle[]>([]); 
  const [selectedVibeCircleId, setSelectedVibeCircleId] = useState<string | null>(null); 

  // Create Snap Modal State
  const [isCreateSnapModalOpen, setIsCreateSnapModalOpen] = useState<boolean>(false);
  const [contentForSnapCreation, setContentForSnapCreation] = useState<Content | null>(null);

  // Snap Story Viewer Modal State
  const [isSnapStoryViewerOpen, setIsSnapStoryViewerOpen] = useState<boolean>(false);
  const [snapsForStoryViewer, setSnapsForStoryViewer] = useState<Snap[]>([]); // Snaps for the currently viewed creator
  const [storyViewerInitialSnapIndex, setStoryViewerInitialSnapIndex] = useState<number>(0);
  const [orderedStoryCreatorIds, setOrderedStoryCreatorIds] = useState<string[]>([]); // For inter-creator navigation
  const [currentStoryCreatorIndex, setCurrentStoryCreatorIndex] = useState<number>(-1); // Index in orderedStoryCreatorIds
  const [activeStoryMode, setActiveStoryMode] = useState<'friends' | 'trending' | null>(null);

  const [platformAction, setPlatformAction] = useState<'filter' | 'goto'>('filter');


  const handleSearchInputChange = (query: string) => {
    setSearchQuery(query);
    if (query.trim() !== '' && currentView !== 'search' && isAuthenticated) {
      handleNavigation('search');
    } else if (query.trim() === '' && currentView === 'search') {
      handleNavigation('home');
    }
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim() !== '' && currentView !== 'search' && isAuthenticated) {
      handleNavigation('search');
    } else if (searchQuery.trim() === '' && currentView === 'search') {
       handleNavigation('home');
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    if (currentView === 'search') {
      handleNavigation('home');
    }
  };


  const fetchOMDBDetailsByTitle = async (title: string): Promise<any | null> => {
    try {
      const response = await fetch(`${OMDB_API_URL_BASE}&t=${encodeURIComponent(title)}`);
      if (!response.ok) {
        console.error(`OMDB API error for title "${title}": ${response.statusText}`);
        return null;
      }
      const data = await response.json();
      if (data.Response === "True") {
        return data;
      } else {
        console.warn(`OMDB: Movie "${title}" not found or error: ${data.Error}`);
        return null;
      }
    } catch (error) {
      console.error(`Error fetching OMDB data for "${title}":`, error);
      return null;
    }
  };
  const fetchMoodRecommendations = async (mood: Mood): Promise<RecommendationItem[]> => {
    try {
      const res = await fetch("http://127.0.0.1:5000/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood }),
      });
  
      const data = await res.json();
  
      const enriched = await Promise.all(
        data.map(async (item: any) => {
          const omdb = await fetchOMDBDetailsByTitle(item.title);
          return {
            contentId: item.title,
            title: item.title,
            genre: omdb?.Genre?.split(', ') || item.genres.split(' '),
            description: omdb?.Plot || item.overview,
            thumbnailUrl: omdb?.Poster || "",
            year: parseInt(omdb?.Year) || undefined,
            platform: Platform.Unknown,
            rating: parseFloat(omdb?.imdbRating) || undefined,
          };
        })
      );
  
      return enriched;
    } catch (err) {
      console.error("Recommendation fetch failed:", err);
      return [];
    }
  };
  
  const fetchOMDBDetailsByImdbID = async (imdbID: string): Promise<any | null> => {
    try {
      const response = await fetch(`${OMDB_API_URL_BASE}&i=${imdbID}`);
      if (!response.ok) {
        console.error(`OMDB API error for IMDb ID "${imdbID}": ${response.statusText}`);
        return null;
      }
      const data = await response.json();
      if (data.Response === "True") {
        return data;
      } else {
        console.warn(`OMDB: Movie with IMDb ID "${imdbID}" not found or error: ${data.Error}`);
        return null;
      }
    } catch (error) {
      console.error(`Error fetching OMDB data for IMDb ID "${imdbID}":`, error);
      return null;
    }
  };


  const enrichContentItems = async (contentItems: Content[]): Promise<Content[]> => {
    const enrichedItems = await Promise.all(
      contentItems.map(async (item) => {
        // Only fetch if it seems like it hasn't been fetched or is a placeholder
        const needsOMDBFetch = !item.imdbID || (item.description && item.description.startsWith("This is a captivating"));
        if (!needsOMDBFetch) return item;

        const omdbData = await fetchOMDBDetailsByTitle(item.title);
        if (omdbData) {
          return {
            ...item,
            title: omdbData.Title || item.title,
            year: parseInt(omdbData.Year) || item.year,
            description: omdbData.Plot && omdbData.Plot !== "N/A" ? omdbData.Plot : item.description,
            genre: omdbData.Genre && omdbData.Genre !== "N/A" ? omdbData.Genre.split(', ') : item.genre,
            director: omdbData.Director && omdbData.Director !== "N/A" ? omdbData.Director : item.director,
            cast: omdbData.Actors && omdbData.Actors !== "N/A" ? omdbData.Actors.split(', ') : item.cast,
            rating: parseFloat(omdbData.imdbRating) || item.rating,
            duration: parseRuntimeToSeconds(omdbData.Runtime) ?? item.duration,
            thumbnailUrl: omdbData.Poster && omdbData.Poster !== "N/A" ? omdbData.Poster : item.thumbnailUrl,
            bannerUrl: omdbData.Poster && omdbData.Poster !== "N/A" ? omdbData.Poster : item.bannerUrl, // Use poster for banner as well
            imdbID: omdbData.imdbID,
          };
        }
        return item;
      })
    );
    return enrichedItems;
  };

  const enrichProfileViewingHistory = (profile: UserProfile | null, enrichedContentList: Content[]): UserProfile | null => {
    if (!profile) return null;
    const updatedViewingHistory = profile.viewing_history.map(historyItem => {
        const relatedEnrichedContent = enrichedContentList.find(c => c.contentId === historyItem.contentId);
        if (relatedEnrichedContent) {
            return {
                ...historyItem,
                title: relatedEnrichedContent.title,
                thumbnailUrl: relatedEnrichedContent.thumbnailUrl,
                totalDuration: relatedEnrichedContent.duration,
            };
        }
        return historyItem;
    });
    return { ...profile, viewing_history: updatedViewingHistory };
  };


  const loadUserProfileData = useCallback(async (username: string) => {
    const lowerUsername = username.toLowerCase();
    let profileToSet: UserProfile | null = null;
    let friendsToSet: string[] = [];

    if (lowerUsername === MOCK_USER_PROFILE_HASSAN.displayName.toLowerCase()) {
      profileToSet = MOCK_USER_PROFILE_HASSAN;
      friendsToSet = [MOCK_USER_ID_PRIYA, MOCK_USER_ID_ANANYA];
    } else if (lowerUsername === MOCK_USER_PROFILE_PRIYA.displayName.toLowerCase()) {
      profileToSet = MOCK_USER_PROFILE_PRIYA;
      friendsToSet = [MOCK_USER_ID, MOCK_USER_ID_ANANYA];
    } else {
        const potentialFriendProfile = MOCK_POTENTIAL_FRIENDS.find(p => p.displayName.toLowerCase() === lowerUsername);
        if (potentialFriendProfile) {
            const isAnanya = potentialFriendProfile.userId === MOCK_USER_ID_ANANYA;
            profileToSet = {
                userId: potentialFriendProfile.userId,
                displayName: potentialFriendProfile.displayName,
                avatarUrl: potentialFriendProfile.avatarUrl,
                preferences: { genres: ["Comedy", "Action"], platforms: [Platform.Netflix], mood_history: [Mood.Happy] },
                viewing_history: [],
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                vibeCircleIds: isAnanya ? ["vc1_movie_lovers", "vc3_comedy_club"] : [], // Ananya is in Movie Lovers and Comedy Club
            };
             if (profileToSet.userId !== MOCK_USER_ID && profileToSet.userId !== MOCK_USER_ID_PRIYA) {
                 friendsToSet = [MOCK_USER_ID]; 
                 if (profileToSet.userId === MOCK_USER_ID_ANANYA) friendsToSet.push(MOCK_USER_ID_PRIYA); 
             }
        }
    }

    if (profileToSet) {
        setActualFriends(friendsToSet);
    }
    return profileToSet;
  }, [setActualFriends]);

  const loadRecommendations = useCallback((
    moodParam?: Mood | null,
    platformFilterParam?: Platform | null,
    currentMasterContentListToUse?: Content[],
    profileForRecs?: UserProfile | null
  ) => {
    const activeProfileToUse = profileForRecs || currentUserProfile;
    const contentSourceToUse = currentMasterContentListToUse && currentMasterContentListToUse.length > 0
        ? currentMasterContentListToUse
        : masterContentList;

    if (contentSourceToUse.length === 0 && !currentMasterContentListToUse) {
        setIsLoading(true);
        return;
    }
    setIsLoading(true);

    setTimeout(() => {
      let baseRecsFromContentSource: RecommendationItem[] = contentSourceToUse.map(content => ({
        ...content,
        confidence: parseFloat((Math.random() * 0.3 + 0.7).toFixed(2)),
        reason: `Based on general popularity.`
      }));

      let newRecs = [...baseRecsFromContentSource];
      let currentCarouselTitle = "Top Picks For You";
      setTimeBasedRecommendationType(null); 

      if (platformFilterParam) {
        newRecs = newRecs.filter(rec => rec.platform === platformFilterParam);
        newRecs.forEach(rec => {
            rec.reason = `Available on ${platformFilterParam}. ${rec.reason || ''}`.trim();
        });
        currentCarouselTitle = `Top Picks on ${platformFilterParam}`;
      } else if (moodParam) {
        newRecs = newRecs.filter(rec => rec.mood_tags?.includes(moodParam));
        newRecs.forEach(rec => {
          rec.reason = `Matches your current ${moodParam} preference. ${rec.reason || ''}`.trim();
        });
        currentCarouselTitle = `Recommendations for ${moodParam}`;
      } else if (activeProfileToUse) {
        const currentSlot = getTimeSlot();
        const historyPreferences: { genres: Record<string, number> } = { genres: {} };

        activeProfileToUse.viewing_history.forEach(historyItem => {
          const itemDate = new Date(historyItem.timestamp);
          if (getTimeSlot(itemDate) === currentSlot) {
            const contentDetails = contentSourceToUse.find(c => c.contentId === historyItem.contentId);
            contentDetails?.genre.forEach(g => {
              historyPreferences.genres[g] = (historyPreferences.genres[g] || 0) + 1;
            });
          }
        });

        const topGenres = Object.entries(historyPreferences.genres)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 2)
          .map(entry => entry[0]);

        if (topGenres.length > 0) {
          const prioritizedRecs: RecommendationItem[] = [];
          const otherRecs: RecommendationItem[] = [];
          const timeSlotName = currentSlot.charAt(0).toUpperCase() + currentSlot.slice(1);
          const timeSlotReasonPrefix = `${timeSlotName} Suggestion`;

          newRecs.forEach(rec => {
            const matchingGenre = rec.genre.find(g => topGenres.includes(g));
            if (matchingGenre) {
              prioritizedRecs.push({ ...rec, reason: `${timeSlotReasonPrefix}: you often watch ${matchingGenre}.` });
            } else {
              otherRecs.push(rec);
            }
          });
          newRecs = [...shuffleArray(prioritizedRecs), ...shuffleArray(otherRecs)];
          currentCarouselTitle = `${timeSlotName} Picks (Preferred: ${topGenres.join(', ')})`;
          setTimeBasedRecommendationType(currentCarouselTitle);
        } else {
          newRecs = shuffleArray(newRecs);
          const timeSlotName = currentSlot.charAt(0).toUpperCase() + currentSlot.slice(1);
          currentCarouselTitle = `General ${timeSlotName} Recommendations`;
          setTimeBasedRecommendationType(currentCarouselTitle);
        }
      } else {
        newRecs = shuffleArray(newRecs);
      }

      setFilteredRecommendations(newRecs);
      setRecommendations(newRecs);
      setIsLoading(false);
    }, 450);
  }, [currentUserProfile, masterContentList]);

  const loadFriendSuggestionsData = useCallback(async (currentUserId: string, currentMasterContentList: Content[]) => {
     setTimeout(() => {
        const grouped: GroupedFriendSuggestions = {};
        const suggestionsForCurrentUser = ALL_MOCK_SUGGESTIONS.filter(
            sugg => sugg.recipientId === currentUserId
        );

        suggestionsForCurrentUser.forEach(fs => {
            if (!grouped[fs.suggesterId]) {
                const suggesterInfo = MOCK_POTENTIAL_FRIENDS.find(p => p.userId === fs.suggesterId) ||
                                     { userId: fs.suggesterId, displayName: fs.suggesterDisplayName, avatarUrl: fs.suggesterAvatarUrl };
                grouped[fs.suggesterId] = { suggester: suggesterInfo, suggestions: [] };
            }

            const baseSuggestedContent = fs.content;
            const enrichedContentFromMaster = currentMasterContentList.find(c => c.contentId === baseSuggestedContent.contentId);

            const finalContentForSuggestion: RecommendationItem = enrichedContentFromMaster
                ? { ...enrichedContentFromMaster, confidence: baseSuggestedContent.confidence, reason: fs.message || `Recommended by ${fs.suggesterDisplayName}`, timestamp: fs.timestamp }
                : { ...baseSuggestedContent, reason: fs.message || `Recommended by ${fs.suggesterDisplayName}`, timestamp: fs.timestamp };

            grouped[fs.suggesterId].suggestions.push(finalContentForSuggestion);
        });

        Object.values(grouped).forEach(group => {
            group.suggestions.sort((a, b) => (b.timestamp ? new Date(b.timestamp).getTime() : 0) - (a.timestamp ? new Date(a.timestamp).getTime() : 0));
        });
        setGroupedFriendSuggestions(grouped);
      }, 250);
  }, []);

  const loadMySuggestionsData = useCallback(async (currentUserId: string, currentMasterContentList: Content[]) => {
    setTimeout(() => {
        const grouped: GroupedMySuggestions = {};
        const suggestionsByCurrentUser = ALL_MOCK_SUGGESTIONS.filter(
            sugg => sugg.suggesterId === currentUserId
        );

        suggestionsByCurrentUser.forEach(ms => {
            const recipientInfo = MOCK_POTENTIAL_FRIENDS.find(p => p.userId === ms.recipientId);
            if (!recipientInfo) return;

            if (!grouped[ms.recipientId]) {
                grouped[ms.recipientId] = { recipient: recipientInfo, suggestions: [] };
            }

            const baseSuggestedContent = ms.content;
            const enrichedContentFromMaster = currentMasterContentList.find(c => c.contentId === baseSuggestedContent.contentId);

            const finalContentForSuggestion: RecommendationItem = enrichedContentFromMaster
                ? { ...enrichedContentFromMaster, confidence: baseSuggestedContent.confidence, reason: ms.message || `You shared this with ${recipientInfo.displayName}`, timestamp: ms.timestamp }
                : { ...baseSuggestedContent, reason: ms.message || `You shared this with ${recipientInfo.displayName}`, timestamp: ms.timestamp };

            grouped[ms.recipientId].suggestions.push(finalContentForSuggestion);
        });

        Object.values(grouped).forEach(group => {
            group.suggestions.sort((a, b) => (b.timestamp ? new Date(b.timestamp).getTime() : 0) - (a.timestamp ? new Date(a.timestamp).getTime() : 0));
        });
        setMySuggestionsMade(grouped);
    }, 300);
  }, []);
  
  const loadDiscoverableUsersData = useCallback((currentUserIdParam?: string) => {
    const activeUserId = currentUserIdParam || currentUserProfile?.userId;
    setIsLoading(true);
    setTimeout(() => {
      const usersWithStatus: DiscoverableUser[] = MOCK_DISCOVERABLE_USERS.map((user): DiscoverableUser => {
        if (user.userId === activeUserId) {
          return { ...user, friendshipStatus: 'self' };
        }
        if (actualFriends.includes(user.userId)) {
          return { ...user, friendshipStatus: 'friends' };
        }
        if (pendingFriendRequests.includes(user.userId)) {
          return { ...user, friendshipStatus: 'request_sent' };
        }
        return { ...user, friendshipStatus: 'not_friends' };
      });
      MOCK_POTENTIAL_FRIENDS.forEach(potentialFriend => {
        if (!usersWithStatus.find(u => u.userId === potentialFriend.userId) && potentialFriend.userId !== activeUserId) {
           usersWithStatus.push({
             userId: potentialFriend.userId,
             displayName: potentialFriend.displayName,
             avatarUrl: potentialFriend.avatarUrl,
             commonInterests: [],
             friendshipStatus: actualFriends.includes(potentialFriend.userId) ? 'friends' : (pendingFriendRequests.includes(potentialFriend.userId) ? 'request_sent' : 'not_friends')
           });
        }
      });

      setDiscoverableUsers(usersWithStatus.filter(user => user.friendshipStatus !== 'self'));
      setIsLoading(false);
    }, 300);
  }, [actualFriends, pendingFriendRequests, currentUserProfile]);

  const loadOngoingFriendPartiesData = useCallback((currentUserId: string, friends: string[], allContent: Content[]) => {
    if (!currentUserId || friends.length === 0 || allContent.length === 0) {
        setOngoingFriendParties([]);
        return;
    }
    const parties: OngoingPartyDisplayItem[] = MOCK_ACTIVE_FRIEND_SESSIONS
        .filter(session => friends.includes(session.hostId) && session.hostId !== currentUserId && session.contentId && (session.status === 'playing' || session.status === 'paused'))
        .map(session => {
            const content = allContent.find(c => c.contentId === session.contentId);
            const hostInfo = MOCK_POTENTIAL_FRIENDS.find(p => p.userId === session.hostId);
            
            if (!content || !hostInfo) return null;

            let joinStatus: OngoingPartyDisplayItem['joinStatus'] = 'can_request';
            if (session.participants.some(p => p.userId === currentUserId)) {
                joinStatus = 'already_member';
            }
            return {
                sessionId: session.sessionId,
                host: hostInfo,
                content: content,
                participantCount: session.participants.length,
                joinStatus: joinStatus,
            };
        })
        .filter(item => item !== null) as OngoingPartyDisplayItem[];
    
    setOngoingFriendParties(parties);
  }, []);

  const handleRequestJoinOngoingParty = (sessionId: string) => {
    setOngoingFriendParties(prevParties =>
      prevParties.map(party =>
        party.sessionId === sessionId ? { ...party, joinStatus: 'request_sent' } : party
      )
    );
    const partyDetails = ongoingFriendParties.find(p=>p.sessionId === sessionId);
    if(partyDetails){
        alert(`Join request "sent" to ${partyDetails.host.displayName} for "${partyDetails.content.title}"! (Mock action)`);
    }
  };


  const loadAllDataForUser = useCallback(async (profile: UserProfile) => {
    setIsLoading(true);

    const enrichedList = await enrichContentItems(MOCK_CONTENTS);
    setMasterContentList(enrichedList);

    const enrichedProfile = enrichProfileViewingHistory(profile, enrichedList);
    setCurrentUserProfile(enrichedProfile);

    // Momentz data loading
    setAllVibeCircles(MOCK_VIBE_CIRCLES); 
    setAllSnaps(MOCK_SNAPS); 
    setAllTrendingSnaps(MOCK_TRENDING_SNAPS_INDIA); 

    if (enrichedProfile?.vibeCircleIds) { 
        const userVcs = MOCK_VIBE_CIRCLES.filter(vc => enrichedProfile.vibeCircleIds!.includes(vc.id)); 
        setCurrentUserVibeCircles(userVcs); 
    } else {
        setCurrentUserVibeCircles([]); 
    }


    if (enrichedProfile) {
        await Promise.all([
            loadRecommendations(undefined, undefined, enrichedList, enrichedProfile),
            loadFriendSuggestionsData(enrichedProfile.userId, enrichedList),
            loadMySuggestionsData(enrichedProfile.userId, enrichedList),
        ]);
        loadDiscoverableUsersData(enrichedProfile.userId);
        loadOngoingFriendPartiesData(enrichedProfile.userId, actualFriends, enrichedList);
    }

    setIsLoading(false);
    setInitialAppLoadDone(true);
  }, [loadRecommendations, loadFriendSuggestionsData, loadMySuggestionsData, loadDiscoverableUsersData, loadOngoingFriendPartiesData, actualFriends]);


  useEffect(() => {
    const viewsToSkipInitialLoad = ['movieMatcher', 'search', 'momentz', 'vibeCircleView']; 
    if (isAuthenticated && currentUserProfile && !initialAppLoadDone && !viewsToSkipInitialLoad.includes(currentView)) {
        loadAllDataForUser(currentUserProfile);
    }
  }, [isAuthenticated, currentUserProfile, initialAppLoadDone, loadAllDataForUser, currentView]);

  useEffect(() => {
    const viewsToSkipRecLoad = ['movieMatcher', 'search', 'momentz', 'vibeCircleView'];
    if (
      initialAppLoadDone &&
      currentUserProfile &&
      !viewsToSkipRecLoad.includes(currentView) &&
      masterContentList.length > 0
    ) {
      loadRecommendations(currentMood, selectedPlatform, masterContentList, currentUserProfile);
    }
  }, [selectedPlatform, initialAppLoadDone, currentUserProfile, loadRecommendations, masterContentList, currentView]);
  

  useEffect(() => {
    const authRequiredViews: AppView[] = ['home', 'profile', 'watchParty', 'contentDetail', 'suggestions', 'movieMatcher', 'discoverUsers', 'search', 'momentz', 'vibeCircleView']; 
    if (!isAuthenticated && authRequiredViews.includes(currentView)) {
      setCurrentView('login');
      setSearchQuery('');
    }
    if (isAuthenticated && currentView === 'login') {
        setCurrentView('home');
    }

    if (currentView === 'contentDetail' && !selectedContent && isAuthenticated && initialAppLoadDone) {
      console.warn('ContentDetailView attempted to render without selectedContent. Redirecting to home.');
      setCurrentView('home');
    }

    if (currentView === 'discoverUsers' && isAuthenticated && initialAppLoadDone) {
      loadDiscoverableUsersData();
    }

    if (currentView === 'watchParty' && isAuthenticated && initialAppLoadDone && currentUserProfile && masterContentList.length > 0) {
        loadOngoingFriendPartiesData(currentUserProfile.userId, actualFriends, masterContentList);
    }

    if (currentView === 'momentz' && isAuthenticated && initialAppLoadDone && currentUserProfile) {
        if (currentUserProfile.vibeCircleIds) { 
            const userVcs = allVibeCircles.filter(vc => currentUserProfile.vibeCircleIds!.includes(vc.id)); 
            setCurrentUserVibeCircles(userVcs); 
        }
    }

  }, [currentView, selectedContent, isAuthenticated, initialAppLoadDone, loadDiscoverableUsersData, currentUserProfile, actualFriends, masterContentList, loadOngoingFriendPartiesData, allVibeCircles]);


  const handleNavigation = useCallback((view: AppView, id?: string) => {
    if (view === 'login' && isAuthenticated) {
        setCurrentView('home');
        if (searchQuery) setSearchQuery('');
        return;
    }
    if (view !== 'login' && !isAuthenticated) {
        setCurrentView('login');
        if (searchQuery) setSearchQuery('');
        return;
    }

    const viewsToClearSelectedContent: AppView[] = ['home', 'profile', 'suggestions', 'discoverUsers', 'momentz', 'vibeCircleView'];

    if (currentView === 'search' && view !== 'search' && view !== 'contentDetail') {
        // No specific action here, clear search handled by its own button or onSearchInputChange
    }
    
    if (view === 'vibeCircleView' && id) { 
        setSelectedVibeCircleId(id); 
    } else if (view !== 'vibeCircleView') { 
        setSelectedVibeCircleId(null); 
    }

    setCurrentView(view);
    if (viewsToClearSelectedContent.includes(view)) {
      setSelectedContent(null);
    }
    if (view !== 'movieMatcher' && view !== 'watchParty') {
        if (watchPartySession && !watchPartySession.matcherSession) {
          setWatchPartySession(null);
        }
    }
    window.scrollTo(0, 0);
  }, [isAuthenticated, watchPartySession, currentView, searchQuery]);

  const handleLogin = async (username: string) => {
    setIsLoggingIn(true);
    setCurrentUserProfile(null);
    setMasterContentList([]);
    setRecommendations([]);
    setFilteredRecommendations([]);
    setGroupedFriendSuggestions({});
    setMySuggestionsMade({});
    setActualFriends([]);
    setPendingFriendRequests([]);
    setInitialAppLoadDone(false);
    setWatchPartySession(null);
    setSelectedContent(null);
    setCurrentMood(null);
    setSelectedPlatform(null);
    setSearchQuery('');
    setOngoingFriendParties([]);
    setAllVibeCircles([]); 
    setAllSnaps(MOCK_SNAPS); 
    setAllTrendingSnaps(MOCK_TRENDING_SNAPS_INDIA);
    setCurrentUserVibeCircles([]); 
    setSelectedVibeCircleId(null); 
    setIsCreateSnapModalOpen(false);
    setContentForSnapCreation(null);
    setIsSnapStoryViewerOpen(false);
    setSnapsForStoryViewer([]);
    setOrderedStoryCreatorIds([]);
    setCurrentStoryCreatorIndex(-1);
    setActiveStoryMode(null);


    try {
      const profile = await loadUserProfileData(username);
      if (profile) {
        setCurrentUserProfile(profile);
        setIsAuthenticated(true);
      } else {
        alert("Login failed: User not found or error loading profile.");
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please try again.");
      setIsAuthenticated(false);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUserProfile(null);
    setMasterContentList([]);
    setRecommendations([]);
    setFilteredRecommendations([]);
    setGroupedFriendSuggestions({});
    setMySuggestionsMade({});
    setWatchPartySession(null);
    setSelectedContent(null);
    setCurrentMood(null);
    setSelectedPlatform(null);
    setInitialAppLoadDone(false);
    setDiscoverableUsers([]);
    setPendingFriendRequests([]);
    setActualFriends([]);
    setPlayingStandaloneVideo(null);
    setOngoingFriendParties([]);
    setAllVibeCircles([]); 
    setAllSnaps(MOCK_SNAPS);
    setAllTrendingSnaps(MOCK_TRENDING_SNAPS_INDIA);
    setCurrentUserVibeCircles([]); 
    setSelectedVibeCircleId(null); 
    setCurrentView('login');
    setIsMatcherOptionsModalOpen(false);
    setIsJoinCodeInputModalOpen(false);
    setSearchQuery('');
    setIsCreateSnapModalOpen(false);
    setContentForSnapCreation(null);
    setIsSnapStoryViewerOpen(false);
    setSnapsForStoryViewer([]);
    setOrderedStoryCreatorIds([]);
    setCurrentStoryCreatorIndex(-1);
    setActiveStoryMode(null);
  };

  const handlePlayStandalone = (content: Content) => {
    const actualContent = masterContentList.find(c => c.contentId === content.contentId) || content;
    if (actualContent.videoUrl) {
      setPlayingStandaloneVideo(actualContent);
    } else {
      alert("This content does not have a direct video URL for standalone playback.");
    }
  };

  const handleContentSelect = async (content: Content, autoPlayLocal: boolean = false) => {
    setIsLoading(true); // Indicate loading while potentially enriching
    let contentToSelect = { ...content }; // Clone to avoid direct state mutation if it's already in state

    // Check if the content needs enrichment (e.g., from a raw OMDB search result)
    // A simple check could be if 'description' is missing or very short, and imdbID exists.
    const needsEnrichment = contentToSelect.imdbID && (!contentToSelect.description || contentToSelect.description.length < 50);

    if (needsEnrichment) {
        console.log(`Enriching content: ${contentToSelect.title} (IMDb ID: ${contentToSelect.imdbID})`);
        const omdbData = await fetchOMDBDetailsByImdbID(contentToSelect.imdbID!);
        if (omdbData) {
            contentToSelect = {
                ...contentToSelect, // Keep original fields like platform if they were better before
                title: omdbData.Title || contentToSelect.title,
                year: parseInt(omdbData.Year) || contentToSelect.year,
                description: omdbData.Plot && omdbData.Plot !== "N/A" ? omdbData.Plot : contentToSelect.description,
                genre: omdbData.Genre && omdbData.Genre !== "N/A" ? omdbData.Genre.split(', ') : contentToSelect.genre,
                director: omdbData.Director && omdbData.Director !== "N/A" ? omdbData.Director : contentToSelect.director,
                cast: omdbData.Actors && omdbData.Actors !== "N/A" ? omdbData.Actors.split(', ') : contentToSelect.cast,
                rating: parseFloat(omdbData.imdbRating) || contentToSelect.rating,
                duration: parseRuntimeToSeconds(omdbData.Runtime) ?? contentToSelect.duration,
                // Keep existing thumbnail/banner if OMDB poster is N/A, or if original item had a better one
                thumbnailUrl: (omdbData.Poster && omdbData.Poster !== "N/A") ? omdbData.Poster : contentToSelect.thumbnailUrl,
                bannerUrl: (omdbData.Poster && omdbData.Poster !== "N/A") ? omdbData.Poster : contentToSelect.bannerUrl,
                // platform might remain Unknown if not specified or retain original if already known
            };
        } else {
            console.warn(`Could not enrich content: ${contentToSelect.title}`);
        }
    }
    
    // Fallback if platform is unknown after potential enrichment
    if (!contentToSelect.platform || contentToSelect.platform === Platform.Unknown) {
        const masterListItem = masterContentList.find(c => c.imdbID === contentToSelect.imdbID || c.title === contentToSelect.title);
        if (masterListItem && masterListItem.platform !== Platform.Unknown) {
            contentToSelect.platform = masterListItem.platform;
        } else {
            contentToSelect.platform = Platform.Unknown; // Default if still unknown
        }
    }


    setSelectedContent(contentToSelect);
    setPreviousViewForContentDetail(currentView);
    setCurrentView('contentDetail');
    setIsLoading(false);

    if (autoPlayLocal && contentToSelect.videoUrl) {
      handlePlayStandalone(contentToSelect);
    }
    window.scrollTo(0, 0);
  };

  const handleOpenMatcherOptions = () => {
    if (!currentUserProfile) {
        alert("Please log in to start or join a Movie Matcher session.");
        handleNavigation('login');
        return;
    }
    setIsMatcherOptionsModalOpen(true);
  };
  const handleCloseMatcherOptions = () => setIsMatcherOptionsModalOpen(false);

  const handleOpenJoinCodeInput = () => {
    handleCloseMatcherOptions();
    setIsJoinCodeInputModalOpen(true);
  };
  const handleCloseJoinCodeInput = () => setIsJoinCodeInputModalOpen(false);

  const getMatcherMoviePool = (): Content[] => {
    if (masterContentList.length === 0) return [];
    const shuffled = [...masterContentList].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, MATCHER_MOVIE_POOL_SIZE);
  };


  const handleInitiateCreateMatcher = () => {
    if (!currentUserProfile || masterContentList.length === 0) return;

    setIsMatcherLoading(true);
    handleCloseMatcherOptions();

    const moviePool = getMatcherMoviePool();
    const newJoinCode = generateJoinCode();

    const initialUserStates: Record<string, MatcherUserState> = {
        [currentUserProfile.userId]: { userId: currentUserProfile.userId, decisions: {}, currentIndex: 0 },
    };

    const newMatcherSessionState: MatcherSessionState = {
        isActive: true,
        moviePool: moviePool,
        userStates: initialUserStates,
        matchedContentId: null,
        joinCode: newJoinCode,
    };

    const newSession: WatchPartySession = {
        sessionId: `wp_matcher_${Date.now()}_${newJoinCode}`,
        hostId: currentUserProfile.userId,
        participants: [{ userId: currentUserProfile.userId, displayName: currentUserProfile.displayName, avatarUrl: currentUserProfile.avatarUrl }],
        content: null,
        contentId: null,
        currentTime: 0,
        status: 'matching',
        chat_messages: [],
        joinCode: newJoinCode,
        guessingGame: { isActive: false, guesses: [], revealGuesses: false, scores: {} },
        matcherSession: newMatcherSessionState,
    };

    setActiveMatcherSessions(prev => ({ ...prev, [newJoinCode]: newSession }));
    setWatchPartySession(newSession);
    setCurrentView('movieMatcher');
    setIsMatcherLoading(false);
  };

  const handleConfirmJoinMatcherWithCode = (joinCode: string) => {
    if (!currentUserProfile) {
        alert("User profile not loaded. Please log in again.");
        handleCloseJoinCodeInput();
        handleNavigation('login');
        return;
    }

    const sessionToJoin = activeMatcherSessions[joinCode];
    if (sessionToJoin && sessionToJoin.matcherSession && sessionToJoin.status === 'matching') {
        const isAlreadyParticipant = sessionToJoin.participants.find(p => p.userId === currentUserProfile.userId);
        let updatedSessionToJoin: WatchPartySession = sessionToJoin;

        if (!isAlreadyParticipant) {
            const joiningParticipant: WatchPartyParticipant = {
                userId: currentUserProfile.userId,
                displayName: currentUserProfile.displayName,
                avatarUrl: currentUserProfile.avatarUrl
            };
            const updatedParticipants = [...sessionToJoin.participants, joiningParticipant];

            const updatedUserStates = {
                ...sessionToJoin.matcherSession.userStates,
                [currentUserProfile.userId]: sessionToJoin.matcherSession.userStates[currentUserProfile.userId] || { userId: currentUserProfile.userId, decisions: {}, currentIndex: 0 }
            };

            const updatedMatcherSession: MatcherSessionState = {
                ...sessionToJoin.matcherSession,
                userStates: updatedUserStates,
            };

            updatedSessionToJoin = {
                ...sessionToJoin,
                participants: updatedParticipants,
                matcherSession: updatedMatcherSession,
            };
            setActiveMatcherSessions(prev => ({ ...prev, [joinCode]: updatedSessionToJoin }));
        }

        setWatchPartySession(updatedSessionToJoin);
        setCurrentView('movieMatcher');
        setInitialAppLoadDone(true);
        handleCloseJoinCodeInput();
    } else {
        alert("Invalid Join Code or session is no longer active/matching. Please check the code and try again.");
    }
  };


  const handleStartWatchParty = (contentToPlay?: Content | null) => {
    if (!currentUserProfile) {
        alert("User profile not loaded. Please log in.");
        handleNavigation('login');
        return;
    }

    if (contentToPlay) {
        setIsLoading(true);
        const actualContentToPlay = masterContentList.find(c => c.contentId === contentToPlay.contentId) || contentToPlay;
        setTimeout(() => {
            const otherPotentialFriends = MOCK_POTENTIAL_FRIENDS.filter(p => p.userId !== currentUserProfile.userId);
            let defaultFriendToAdd: WatchPartyParticipant | undefined = undefined;
            if (otherPotentialFriends.length > 0) {
                defaultFriendToAdd = otherPotentialFriends.find(f => f.userId === MOCK_USER_ID_PRIYA) || 
                                     otherPotentialFriends.find(f => f.userId === MOCK_USER_ID_ANANYA) || 
                                     otherPotentialFriends[0]; 
            }
    
            const newSessionParticipants: WatchPartyParticipant[] = [
                { userId: currentUserProfile.userId, displayName: currentUserProfile.displayName, avatarUrl: currentUserProfile.avatarUrl }
            ];
            if (defaultFriendToAdd && actualFriends.includes(defaultFriendToAdd.userId)) { 
                newSessionParticipants.push(defaultFriendToAdd);
            }

            const newSession: WatchPartySession = {
              ...MOCK_WATCH_PARTY_SESSION_BASE,
              sessionId: `wp_direct_${Date.now()}`, 
              contentId: actualContentToPlay.contentId,
              content: actualContentToPlay,
              participants: newSessionParticipants,
              hostId: currentUserProfile.userId,
              status: 'paused',
              matcherSession: undefined,
              joinCode: generateJoinCode(), 
            };
            setWatchPartySession(newSession);
            setCurrentView('watchParty');
            setIsLoading(false);
            window.scrollTo(0,0);
        }, 300);
    } else {
      handleOpenMatcherOptions();
    }
  };

  const handleLeaveWatchParty = () => {
    if (watchPartySession?.joinCode && watchPartySession.matcherSession && watchPartySession.status === 'matching' && watchPartySession.hostId === currentUserProfile?.userId) {
        setActiveMatcherSessions(prev => {
            const newSessions = {...prev};
            delete newSessions[watchPartySession.joinCode!];
            return newSessions;
        });
    }
    setWatchPartySession(null);
    setCurrentView('home');
  };

  const handleMatcherDecision = (decision: MatcherDecision) => {
    if (!watchPartySession || !watchPartySession.matcherSession || !currentUserProfile) return;

    const currentMatcherState = watchPartySession.matcherSession;
    let currentUserMatcherState = currentMatcherState.userStates[currentUserProfile.userId];
     if (!currentUserMatcherState) {
        console.error("Critical: Current user not found in matcher state. Attempting recovery or redirect.");
        const sessionFromGlobalList = watchPartySession.joinCode ? activeMatcherSessions[watchPartySession.joinCode] : null;
        if (sessionFromGlobalList && sessionFromGlobalList.matcherSession?.userStates[currentUserProfile.userId]) {
            currentUserMatcherState = sessionFromGlobalList.matcherSession.userStates[currentUserProfile.userId];
        } else {
            handleLeaveWatchParty();
            return;
        }
     }

    const currentMovie = currentMatcherState.moviePool[currentUserMatcherState.currentIndex];
    if (!currentMovie) {
        console.error("Matcher: No current movie to decide on.");
        handleLeaveWatchParty();
        return;
    }

    const newCurrentUserDecisions = {
      ...currentUserMatcherState.decisions,
      [currentMovie.contentId]: decision,
    };

    let matchFoundMovie: Content | null = null;

    const otherParticipantUserIdsInSession = watchPartySession.participants
                                        .map(p => p.userId)
                                        .filter(uid => uid !== currentUserProfile.userId && currentMatcherState.userStates[uid]);


    if (decision === 'liked') {
      if (otherParticipantUserIdsInSession.length > 0) {
        const allOthersLiked = otherParticipantUserIdsInSession.every(friendId => {
          const friendState = currentMatcherState.userStates[friendId];
          return friendState && friendState.decisions[currentMovie.contentId] === 'liked';
        });
        if (allOthersLiked) {
          matchFoundMovie = currentMovie;
        }
      } else {
        if (Math.random() < 0.5) { 
             matchFoundMovie = currentMovie;
        }
      }
    }

    const nextIndex = currentUserMatcherState.currentIndex + 1;
    const updatedCurrentUserMatcherState: MatcherUserState = {
        ...currentUserMatcherState,
        decisions: newCurrentUserDecisions,
        currentIndex: nextIndex,
    };

    const updatedUserStates = {
        ...currentMatcherState.userStates,
        [currentUserProfile.userId]: updatedCurrentUserMatcherState,
    };

    const updatedMatcherSession: MatcherSessionState = {
        ...currentMatcherState,
        userStates: updatedUserStates,
        matchedContentId: matchFoundMovie ? matchFoundMovie.contentId : currentMatcherState.matchedContentId,
    };

    const newStatus: WatchPartySession['status'] = matchFoundMovie
        ? 'matched'
        : (watchPartySession.status === 'matching' ? 'matching' : watchPartySession.status);

    const newWPS: WatchPartySession = {
        ...watchPartySession,
        matcherSession: updatedMatcherSession,
        status: newStatus,
    };

    if (watchPartySession.joinCode && activeMatcherSessions[watchPartySession.joinCode]) {
        setActiveMatcherSessions(currentActiveSessions => ({
            ...currentActiveSessions,
            [watchPartySession.joinCode!]: newWPS
        }));
    }
    setWatchPartySession(newWPS);


    if (matchFoundMovie) {
        const matchedContent = masterContentList.find(c => c.contentId === matchFoundMovie!.contentId) || matchFoundMovie;
        setTimeout(() => {
            const potentiallyUpdatedSession = watchPartySession.joinCode ? activeMatcherSessions[watchPartySession.joinCode!] : newWPS;
            if (!potentiallyUpdatedSession || !potentiallyUpdatedSession.matcherSession || !currentUserProfile) {
                console.error("Session desync before finalizing match.");
                handleLeaveWatchParty();
                return;
            }
            
            let finalParticipants = [...potentiallyUpdatedSession.participants];
            if (finalParticipants.length === 1 && finalParticipants[0].userId === currentUserProfile.userId) {
                const otherPotentialFriends = MOCK_POTENTIAL_FRIENDS.filter(p => p.userId !== currentUserProfile.userId && actualFriends.includes(p.userId));
                if (otherPotentialFriends.length > 0) {
                    let friendToAdd = otherPotentialFriends.find(f => f.userId === MOCK_USER_ID_PRIYA); 
                    if (!friendToAdd) {
                        friendToAdd = otherPotentialFriends.find(f => f.userId === MOCK_USER_ID_ANANYA); 
                    }
                    if (!friendToAdd) { 
                        friendToAdd = otherPotentialFriends[0];
                    }
                    if (friendToAdd) { 
                       finalParticipants.push(friendToAdd);
                    }
                }
            }


            const finalSession: WatchPartySession = {
                ...potentiallyUpdatedSession,
                content: matchedContent,
                contentId: matchedContent.contentId,
                status: 'paused',
                participants: finalParticipants, 
                matcherSession: {
                    ...potentiallyUpdatedSession.matcherSession,
                    isActive: false,
                }
            };

            if (watchPartySession.joinCode && activeMatcherSessions[watchPartySession.joinCode]) {
                setActiveMatcherSessions(currentActiveSessions => ({
                    ...currentActiveSessions,
                    [watchPartySession.joinCode!]: finalSession
                }));
            }
            setWatchPartySession(finalSession);
            setCurrentView('watchParty');
        }, 2000);
    } else if (nextIndex >= currentMatcherState.moviePool.length) {
        const latestSessionState = watchPartySession.joinCode ? activeMatcherSessions[watchPartySession.joinCode!] : newWPS;

        if (!latestSessionState.matcherSession?.matchedContentId) {
             alert("No match found after swiping through all movies for this session!");
        }

        const finalSessionNoMatchForUser: WatchPartySession = {
            ...latestSessionState,
            status: latestSessionState.matcherSession?.matchedContentId ? 'matched' : 'paused', 
            matcherSession: {
                ...latestSessionState.matcherSession!,
                isActive: !latestSessionState.matcherSession?.matchedContentId,
            }
        };
        if (watchPartySession.joinCode && activeMatcherSessions[watchPartySession.joinCode]) {
                setActiveMatcherSessions(currentActiveSessions => ({
                ...currentActiveSessions,
                [watchPartySession.joinCode!]: finalSessionNoMatchForUser
            }));
        }
        setWatchPartySession(finalSessionNoMatchForUser);

        if (!latestSessionState.matcherSession?.matchedContentId) {
            setCurrentView('home');
        } else {
            const matchedContentFromSession = latestSessionState.matcherSession.moviePool.find(m => m.contentId === latestSessionState.matcherSession?.matchedContentId);
            if (matchedContentFromSession) {
                 const actualMatchedContent = masterContentList.find(c => c.contentId === matchedContentFromSession.contentId) || matchedContentFromSession;
                 
                 let finalParticipantsForMatchedSession = [...latestSessionState.participants];
                 if (finalParticipantsForMatchedSession.length === 1 && currentUserProfile && finalParticipantsForMatchedSession[0].userId === currentUserProfile.userId) {
                    const otherPotentialFriends = MOCK_POTENTIAL_FRIENDS.filter(p => p.userId !== currentUserProfile.userId && actualFriends.includes(p.userId));
                    if (otherPotentialFriends.length > 0) {
                        let friendToAdd = otherPotentialFriends.find(f => f.userId === MOCK_USER_ID_PRIYA) || 
                                          otherPotentialFriends.find(f => f.userId === MOCK_USER_ID_ANANYA) || 
                                          otherPotentialFriends[0];
                        if (friendToAdd) finalParticipantsForMatchedSession.push(friendToAdd);
                    }
                 }


                 const finalSessionMatched: WatchPartySession = {
                    ...latestSessionState,
                    content: actualMatchedContent,
                    contentId: actualMatchedContent.contentId,
                    status: 'paused',
                    participants: finalParticipantsForMatchedSession,
                    matcherSession: {
                        ...latestSessionState.matcherSession!,
                        isActive: false,
                    }
                };
                 if (watchPartySession.joinCode && activeMatcherSessions[watchPartySession.joinCode]) {
                    setActiveMatcherSessions(currentActiveSessions => ({
                        ...currentActiveSessions,
                        [watchPartySession.joinCode!]: finalSessionMatched
                    }));
                }
                setWatchPartySession(finalSessionMatched);
                setCurrentView('watchParty');
            } else {
                 setCurrentView('home');
            }
        }
    }
  };

  const handleMoodSelect = async (mood: Mood | null) => {
    setCurrentMood(mood);
    setSelectedPlatform(null); // Always clear platform to avoid stale filters
  
    if (mood) {
      setIsLoading(true);
      const moodRecs = await fetchMoodRecommendations(mood);
      setRecommendations(moodRecs);
      setFilteredRecommendations(moodRecs);
      setIsLoading(false);
    }
  };
  
  const handlePlatformSelect = (platform: Platform) => {
    if (selectedPlatform === platform) {
      setSelectedPlatform(null);
    } else {
      setSelectedPlatform(platform);
      setCurrentMood(null);
    }
  };

  const handleShowSummary = useCallback(async (historyItem: ViewingHistoryItem) => {
    const contentToSummarize = masterContentList.find(c => c.contentId === historyItem.contentId);
    if (!contentToSummarize) return;

    if (!historyItem.lastWatchPosition || !historyItem.totalDuration) {
      if (contentToSummarize.videoUrl) {
          handlePlayStandalone(contentToSummarize);
          return;
      }
      if (!contentToSummarize.videoUrl && contentToSummarize.deepLink) {
         alert(`Playing ${contentToSummarize.title} via ${contentToSummarize.deepLink}`);
         return;
      }
      handleContentSelect(contentToSummarize);
      return;
    }

    setSummaryContentInfo({content: contentToSummarize, lastPosition: historyItem.lastWatchPosition, totalDuration: historyItem.totalDuration});
    setIsSummaryModalOpen(true);
    setIsSummaryLoading(true);
    setSummaryText('');
    setSummaryError('');

    const currentApiKey = process.env.API_KEY || "MOCK_API_KEY_DO_NOT_USE_IN_PROD";
    if (currentApiKey === "MOCK_API_KEY_DO_NOT_USE_IN_PROD" || !currentApiKey) {
        console.warn("Using mock summary because API_KEY is not configured or is a mock key.");
        setTimeout(() => {
            setSummaryText(`This is a mock summary for "${contentToSummarize.title}" up to ${formatSecondsToHHMMSS(historyItem.lastWatchPosition!)}. Gemini API would provide this.`);
            setIsSummaryLoading(false);
        }, 1500);
        return;
    }

    const prompt = `The user was watching the movie or show titled "${contentToSummarize.title}".
    Its description is: "${contentToSummarize.description}".
    The total duration of the content is ${formatSecondsToHHMMSS(historyItem.totalDuration)}.
    The user stopped watching at the ${formatSecondsToHHMMSS(historyItem.lastWatchPosition)} mark.
    Please provide a concise summary (around 100-150 words) of the plot that has likely occurred up to this point.
    Do not reveal major spoilers beyond this point. Focus on setting the scene for resumption.`;

    try {
      const response: GenerateContentResponse = await ai.models.generateContent({
          model: 'gemini-2.5-flash-preview-04-17',
          contents: prompt,
      });
      setSummaryText(response.text);
    } catch (error) {
      console.error("Error generating summary with Gemini:", error);
      setSummaryError("Sorry, couldn't generate a summary at this time. Please try again later.");
    } finally {
      setIsSummaryLoading(false);
    }
  }, [masterContentList, handleContentSelect]); // Removed handlePlayStandalone from dependencies as it's not used in this specific path now

  const handleCloseSummaryModal = () => {
    setIsSummaryModalOpen(false);
    setSummaryContentInfo(null);
    setSummaryText('');
    setSummaryError('');
  };

  const handlePlayFromSummaryModal = () => {
    if (summaryContentInfo) {
      const contentToPlay = masterContentList.find(c => c.contentId === summaryContentInfo.content.contentId) || summaryContentInfo.content;
      if (contentToPlay.videoUrl) {
        handlePlayStandalone(contentToPlay);
      } else {
        handleStartWatchParty(contentToPlay);
      }
    }
    handleCloseSummaryModal();
  };

  const handleOpenSuggestModal = (content: Content) => {
    const actualContent = masterContentList.find(c => c.contentId === content.contentId) || content;
    setContentToSuggestForModal(actualContent);
    setIsSuggestModalOpen(true);
  };

  const handleCloseSuggestModal = () => {
    setIsSuggestModalOpen(false);
    setContentToSuggestForModal(null);
  };

  const handleConfirmSuggestionFromModal = (friend: WatchPartyParticipant, message: string) => {
    if (!contentToSuggestForModal || !currentUserProfile) return;

    const newGlobalSuggestion: GlobalSuggestionItem = {
        suggestionId: `globalsugg_${Date.now()}_${currentUserProfile.userId}_${friend.userId}`,
        suggesterId: currentUserProfile.userId,
        suggesterDisplayName: currentUserProfile.displayName,
        suggesterAvatarUrl: currentUserProfile.avatarUrl,
        recipientId: friend.userId,
        content: contentToSuggestForModal as RecommendationItem,
        message: message,
        timestamp: new Date().toISOString(),
    };
    ALL_MOCK_SUGGESTIONS.push(newGlobalSuggestion);
    if (masterContentList.length > 0 && currentUserProfile) {
        loadMySuggestionsData(currentUserProfile.userId, masterContentList);
    }
    alert(`Suggestion for "${contentToSuggestForModal.title}" sent to ${friend.displayName}!`);
    handleCloseSuggestModal();
  };

  const handleSendFriendRequest = (targetUserId: string) => {
    if (pendingFriendRequests.includes(targetUserId) || actualFriends.includes(targetUserId)) {
        alert("You've already sent a request or are already friends with this user.");
        return;
    }
    setPendingFriendRequests(prev => [...prev, targetUserId]);
    alert("Friend request sent!");
     setDiscoverableUsers(prevUsers =>
        prevUsers.map(user =>
            user.userId === targetUserId ? { ...user, friendshipStatus: 'request_sent' } : user
        )
    );
  };

  const handleOpenCreateSnapModal = (content: Content, currentTime: number) => {
    setContentForSnapCreation(content);
    setIsCreateSnapModalOpen(true);
  };

  const handleConfirmCreateSnap = (vibeCircleId: string) => {
    if (!currentUserProfile || !contentForSnapCreation) return;

    const newSnap: Snap = {
        id: `snap_${Date.now()}_${currentUserProfile.userId}`,
        creatorInfo: {
            userId: currentUserProfile.userId,
            displayName: currentUserProfile.displayName,
            avatarUrl: currentUserProfile.avatarUrl,
        },
        vibeCircleId: vibeCircleId,
        contentId: contentForSnapCreation.contentId,
        associatedContentTitle: contentForSnapCreation.title,
        timestamp: new Date().toISOString(),
        imageUrl: contentForSnapCreation.thumbnailUrl, 
        videoUrl: contentForSnapCreation.videoUrl, 
        caption: undefined,
        reactions: [],
        isPublic: false,
    };

    const updatedAllSnaps = [...allSnaps, newSnap];
    setAllSnaps(updatedAllSnaps);
    
    const updatedAllVibeCircles = allVibeCircles.map(vc => 
        vc.id === vibeCircleId 
        ? { ...vc, snapIds: [...vc.snapIds, newSnap.id].filter((id, index, self) => self.indexOf(id) === index), recentSnapImage: newSnap.imageUrl } 
        : vc
    );
    setAllVibeCircles(updatedAllVibeCircles);
    
    if (currentUserProfile.vibeCircleIds) {
        const userVcs = updatedAllVibeCircles.filter(vc => currentUserProfile.vibeCircleIds!.includes(vc.id));
        setCurrentUserVibeCircles(userVcs);
    }

    alert(`Snap posted to Vibe Circle!`);
    setIsCreateSnapModalOpen(false);
    setContentForSnapCreation(null);
  };
  
  const getSnapsForCreator = (creatorId: string, mode: 'friends' | 'trending'): Snap[] => {
    if (!currentUserProfile) return [];
    if (mode === 'friends') {
        const userVibeCircleIds = currentUserProfile.vibeCircleIds || [];
        return allSnaps
            .filter(snap => !snap.isPublic && snap.creatorInfo.userId === creatorId && userVibeCircleIds.includes(snap.vibeCircleId))
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } else { // trending
        return allTrendingSnaps
            .filter(snap => snap.isPublic && snap.creatorInfo.userId === creatorId)
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }
  };

  const handleOpenSnapStoryViewer = (creatorId: string, mode: 'friends' | 'trending') => {
    if (!currentUserProfile) return;
    
    let creatorsList: SnapCreatorStoryInfo[] = [];
    if (mode === 'friends') {
        const userVibeCircleIds = currentUserProfile.vibeCircleIds || [];
        const snapsFromUserVibeCircles = allSnaps.filter(snap => 
            !snap.isPublic && userVibeCircleIds.includes(snap.vibeCircleId)
        );
        const latestSnapByCreator = new Map<string, Snap>();
        snapsFromUserVibeCircles.forEach(snap => {
            const existingSnap = latestSnapByCreator.get(snap.creatorInfo.userId);
            if (!existingSnap || new Date(snap.timestamp) > new Date(existingSnap.timestamp)) {
                latestSnapByCreator.set(snap.creatorInfo.userId, snap);
            }
        });
        creatorsList = Array.from(latestSnapByCreator.values())
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .map(snap => ({
                userId: snap.creatorInfo.userId,
                displayName: snap.creatorInfo.displayName,
                avatarUrl: snap.creatorInfo.avatarUrl,
                latestSnapTimestamp: snap.timestamp,
            }));
    } else { // trending
        const latestSnapByCreator = new Map<string, Snap>();
        allTrendingSnaps.forEach(snap => {
            if (snap.isPublic) { 
                const existingSnap = latestSnapByCreator.get(snap.creatorInfo.userId);
                if (!existingSnap || new Date(snap.timestamp) > new Date(existingSnap.timestamp)) {
                    latestSnapByCreator.set(snap.creatorInfo.userId, snap);
                }
            }
        });
        creatorsList = Array.from(latestSnapByCreator.values())
            .sort((a, b) => (b.reactions.filter(r => r.emoji === "👍").length) - (a.reactions.filter(r => r.emoji === "👍").length))
            .map(snap => ({
                userId: snap.creatorInfo.userId,
                displayName: snap.creatorInfo.displayName,
                avatarUrl: snap.creatorInfo.avatarUrl,
                totalLikes: snap.reactions.filter(r => r.emoji === "👍").length,
                latestSnapTimestamp: snap.timestamp,
            }));
    }
    
    const orderedIds = creatorsList.map(c => c.userId);
    const initialCreatorIndex = orderedIds.indexOf(creatorId);

    if (initialCreatorIndex === -1) {
        alert("Could not find this creator's story.");
        return;
    }

    const initialSnaps = getSnapsForCreator(creatorId, mode);

    if (initialSnaps.length > 0) {
        setOrderedStoryCreatorIds(orderedIds);
        setCurrentStoryCreatorIndex(initialCreatorIndex);
        setActiveStoryMode(mode);
        setSnapsForStoryViewer(initialSnaps);
        setStoryViewerInitialSnapIndex(0);
        setIsSnapStoryViewerOpen(true);
    } else {
        alert("No snaps to display for this creator.");
    }
  };

  const navigateToCreatorStory = (direction: 'next' | 'prev') => {
    if (activeStoryMode === null || currentStoryCreatorIndex === -1) return;

    let nextCreatorIndex = currentStoryCreatorIndex + (direction === 'next' ? 1 : -1);

    if (nextCreatorIndex >= 0 && nextCreatorIndex < orderedStoryCreatorIds.length) {
        const nextCreatorId = orderedStoryCreatorIds[nextCreatorIndex];
        const nextSnaps = getSnapsForCreator(nextCreatorId, activeStoryMode);
        
        if (nextSnaps.length > 0) {
            setCurrentStoryCreatorIndex(nextCreatorIndex);
            setSnapsForStoryViewer(nextSnaps);
            setStoryViewerInitialSnapIndex(0); // Always start at the first snap of the new creator
        } else {
            // This case should ideally not happen if orderedStoryCreatorIds only contains creators with snaps.
            // If it does, we might skip this creator or close. For now, try to find next valid.
            console.warn(`Skipping creator ${nextCreatorId} with no snaps in ${activeStoryMode} mode.`);
             // Recursively try next/prev
            const tempIndex = currentStoryCreatorIndex; // Store before recursive call
            setCurrentStoryCreatorIndex(nextCreatorIndex); // Temporarily update for next recursive step
            navigateToCreatorStory(direction);
            // If recursive call doesn't change index (e.g. end of list), revert
            if(currentStoryCreatorIndex === nextCreatorIndex) setCurrentStoryCreatorIndex(tempIndex);

        }
    } else {
      // Reached the end or beginning of the list of creators
      setIsSnapStoryViewerOpen(false); // Close modal
    }
  };

  const hasNextCreator = activeStoryMode !== null && currentStoryCreatorIndex < orderedStoryCreatorIds.length - 1;
  const hasPrevCreator = activeStoryMode !== null && currentStoryCreatorIndex > 0;

  const handleAddSnapReaction = (snapId: string, emoji: string) => {
    if (!currentUserProfile) return;

    const updateSnapsList = (list: Snap[]) => list.map(snap => {
        if (snap.id === snapId) {
            const existingReactionIndex = snap.reactions.findIndex(r => r.userId === currentUserProfile.userId && r.emoji === emoji);
            let newReactions: SnapReaction[];

            if (existingReactionIndex > -1) { 
                newReactions = snap.reactions.filter((_, index) => index !== existingReactionIndex);
            } else { 
                const userOldReactionsFiltered = snap.reactions.filter(r => r.userId !== currentUserProfile.userId);
                newReactions = [...userOldReactionsFiltered, { userId: currentUserProfile.userId, emoji }];
            }
            return { ...snap, reactions: newReactions };
        }
        return snap;
    });

    setAllSnaps(prevSnaps => updateSnapsList(prevSnaps));
    setAllTrendingSnaps(prevTrendingSnaps => updateSnapsList(prevTrendingSnaps));

    if (isSnapStoryViewerOpen && activeStoryMode !== null && currentStoryCreatorIndex !== -1) {
        const currentCreatorId = orderedStoryCreatorIds[currentStoryCreatorIndex];
        const refreshedSnapsForCurrentCreator = getSnapsForCreator(currentCreatorId, activeStoryMode);
        
        if(refreshedSnapsForCurrentCreator.length > 0){
            setSnapsForStoryViewer(refreshedSnapsForCurrentCreator);
             // Ensure current snap index remains valid, or reset
            const currentDisplayedSnapId = snapsForStoryViewer[storyViewerInitialSnapIndex]?.id;
            const newIndexOfCurrentSnap = refreshedSnapsForCurrentCreator.findIndex(s => s.id === currentDisplayedSnapId);
            setStoryViewerInitialSnapIndex(newIndexOfCurrentSnap !== -1 ? newIndexOfCurrentSnap : 0);
        } else {
             // If all snaps of current creator are gone (e.g. by un-reacting if that was a filter criteria, though not current logic)
            setIsSnapStoryViewerOpen(false);
        }
    }
  };


  const getCarouselTitle = () => {
    if (selectedPlatform) return `Top Picks on ${selectedPlatform}`;
    if (currentMood) return `Filtered by: ${currentMood}`;
    if (timeBasedRecommendationType) return timeBasedRecommendationType;
    return "Top Picks For You";
  };

  const heroContent = filteredRecommendations.length > 0 ? filteredRecommendations[0] : (recommendations.length > 0 ? recommendations[0] : (masterContentList.length > 0 ? masterContentList[0] : null));

  const renderView = () => {
    if (!isAuthenticated && currentView !== 'login') {
        return <LoginView onLogin={handleLogin} isLoggingIn={isLoggingIn} />;
    }
    if (currentView === 'login') {
        return <LoginView onLogin={handleLogin} isLoggingIn={isLoggingIn} />;
    }

    if (isLoggingIn && watchPartySession && currentView === 'movieMatcher') {
        return <div className="flex justify-center items-center h-[calc(100vh-8rem)]"><LoadingSpinner /> <p className="ml-3">Joining session...</p></div>;
    }
    if (isLoggingIn && currentView !== 'movieMatcher'){
         return <div className="flex justify-center items-center h-[calc(100vh-8rem)]"><LoadingSpinner /> <p className="ml-3">Logging in...</p></div>;
    }
    
    const viewsToSkipFullLoadSpinner: AppView[] = ['movieMatcher', 'search', 'momentz', 'vibeCircleView', 'contentDetail']; 
    if (!initialAppLoadDone && isLoading && !viewsToSkipFullLoadSpinner.includes(currentView)) {
        return <div className="flex justify-center items-center h-[calc(100vh-8rem)]"><LoadingSpinner /> <p className="ml-3">Fetching movie data...</p></div>;
    }
     if (isLoading && currentView === 'contentDetail') { // Specific spinner for content detail enrichment
        return <div className="flex justify-center items-center h-[calc(100vh-8rem)]"><LoadingSpinner /> <p className="ml-3">Loading content details...</p></div>;
    }
    if (!currentUserProfile && initialAppLoadDone) {
        return <LoginView onLogin={handleLogin} isLoggingIn={isLoggingIn} />;
    }
    if (!currentUserProfile) {
        return <LoginView onLogin={handleLogin} isLoggingIn={isLoggingIn} />;
    }


    switch (currentView) {
      case 'home':
        const exploreAllContent = masterContentList.map(c => ({...c, reason: "Explore all available titles", confidence: Math.random()*0.1 + 0.7 }));
        
        let crossPlatformDiscoveries: RecommendationItem[] = [];
        if (masterContentList.length > 0) {
            const shuffledMasterList = shuffleArray([...masterContentList]);
            crossPlatformDiscoveries = shuffledMasterList.slice(0, 15).map(content => ({
                ...content,
                reason: currentUserProfile?.preferences.mood_history.length > 0
                    ? `AI found this for you across platforms. Matches your recent ${currentUserProfile.preferences.mood_history[0]} vibe!`
                    : `AI curated this from across the web. Matches your interest in ${content.genre[0]}.`,
                confidence: parseFloat((Math.random() * 0.25 + 0.65).toFixed(2)),
            }));
        }

        return (
          <>
            {heroContent && (
              <HeroSection
                content={heroContent}
                onPlay={() => {
                  if (heroContent?.videoUrl) {
                    handlePlayStandalone(heroContent);
                  } else if (heroContent) {
                    handleContentSelect(heroContent);
                  }
                }}
                onInfo={() => heroContent && handleContentSelect(heroContent)}
              />
            )}

            <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-4 my-6 sm:my-8 px-1">
                <button
                    onClick={() => handleStartWatchParty(null)}
                    className="flex-shrink-0 bg-gradient-to-r from-purple-600 to-sky-500 hover:from-purple-700 hover:to-sky-600 text-white font-semibold py-5 px-12 sm:px-16 rounded-xl shadow-2xl transition-all transform hover:scale-105 active:scale-95 text-xl sm:text-2xl whitespace-nowrap"
                    style={{ minWidth: '150px', minHeight: '40px' }}
                >
                    Start Movie Matcher
                </button>
                <div className="flex flex-wrap justify-center sm:justify-end gap-2 sm:gap-3 items-center">
                    {/* Bubble options */}
                    <div className="flex items-center gap-2 mr-2">
                        <button
                            className={`px-4 py-2 rounded-full text-sm font-semibold shadow-md transition-colors ${platformAction === 'filter' ? 'bg-purple-600 text-white' : 'bg-slate-700 text-slate-200 hover:bg-purple-700'}`}
                            onClick={() => setPlatformAction('filter')}
                        >
                            Filter by
                        </button>
                        <button
                            className={`px-4 py-2 rounded-full text-sm font-semibold shadow-md transition-colors ${platformAction === 'goto' ? 'bg-purple-600 text-white' : 'bg-slate-700 text-slate-200 hover:bg-purple-700'}`}
                            onClick={() => setPlatformAction('goto')}
                        >
                            Go to
                        </button>
                    </div>
                    {/* Platform buttons */}
                    {platformButtonsData.map((item, idx) => (
                        <React.Fragment key={item.platform}>
                            {/* Insert bubble options before the first platform icon (Netflix) */}
                            {/* Already rendered above, so just render platform buttons here */}
                            <button
                                onClick={() => {
                                    if (platformAction === 'goto') {
                                        // Normalize the name for lookup
                                        const normalized = item.name.toLowerCase().replace(/\s+/g, '');
                                        const url = PLATFORM_URLS[normalized];
                                        if (url) window.open(url, '_blank');
                                    } else {
                                        handlePlatformSelect(item.platform);
                                    }
                                }}
                                className={`w-32 h-16 sm:w-36 sm:h-20 flex items-center justify-center p-1 rounded-lg shadow-md transition-all transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900
                                    ${selectedPlatform === item.platform && platformAction === 'filter'
                                        ? `ring-2 ${item.selectedRing} ${item.selectedButtonBg || item.buttonBg}`
                                        : `${item.buttonBg} ${item.buttonHoverBg}`
                                    }`}
                                aria-label={platformAction === 'goto' ? `Go to ${item.name}` : `Filter by ${item.name}`}
                                title={platformAction === 'goto' ? `Go to ${item.name} official site` : `Filter by ${item.name}`}
                                type="button"
                            >
                                <img
                                    src={`data:image/svg+xml,${encodeURIComponent(item.logoSvg)}`}
                                    alt={`${item.name} logo`}
                                    className="max-h-full max-w-full object-contain p-1"
                                />
                            </button>
                        </React.Fragment>
                    ))}
                </div>
            </div>

            <MoodSelector currentMood={currentMood} onMoodSelect={handleMoodSelect} moods={MOOD_OPTIONS} />
            {isLoading && filteredRecommendations.length === 0 && <div className="my-4"><LoadingSpinner/></div>}
            {!isLoading && filteredRecommendations.length === 0 && (currentMood || selectedPlatform || timeBasedRecommendationType) && (
              <div className="text-center py-10 text-slate-400">
                <p className="text-xl mb-2">No recommendations found.</p>
                <p className="text-sm mb-4">
                    {selectedPlatform ? `For platform: "${selectedPlatform}"` : (currentMood ? `For mood: "${currentMood}"` : (timeBasedRecommendationType ? `For your current time preference` : ''))}
                </p>
                <button
                    onClick={() => {
                        if (selectedPlatform) setSelectedPlatform(null);
                        if (currentMood) setCurrentMood(null);
                    }}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md text-white text-sm">Clear Filter(s)</button>
              </div>
            )}
             {filteredRecommendations.length > 0 &&
                <RecommendationCarousel
                    title={getCarouselTitle()}
                    recommendations={filteredRecommendations}
                    onContentSelect={handleContentSelect}
                    onPlayWithPip={handlePlayStandalone}
                />}
            
            {crossPlatformDiscoveries.length > 0 &&
                <RecommendationCarousel
                    title="Cross-Platform Discoveries"
                    recommendations={crossPlatformDiscoveries}
                    onContentSelect={handleContentSelect}
                    onPlayWithPip={handlePlayStandalone}
                />
            }

            {exploreAllContent.length > 0 && (
                <RecommendationCarousel
                    title="All Content (Explore)"
                    recommendations={exploreAllContent}
                    onContentSelect={handleContentSelect}
                    onPlayWithPip={handlePlayStandalone}
                />
            )}
          </>
        );
      case 'search':
        return (
          <SearchResultsPage
            searchQuery={searchQuery}
            allContent={masterContentList} // Pass the curated list for local filtering
            onContentSelect={handleContentSelect} // App.tsx handles enrichment
            onPlayWithPip={handlePlayStandalone}
            onNavigate={handleNavigation}
            onClearSearch={handleClearSearch}
          />
        );
      case 'momentz':
        return (
            <MomentzPage
                currentUser={currentUserProfile}
                vibeCircles={currentUserVibeCircles} 
                allSnaps={allSnaps} 
                allTrendingSnaps={allTrendingSnaps} 
                onSelectVibeCircle={(vibeCircleId) => handleNavigation('vibeCircleView', vibeCircleId)} 
                onOpenSnapStoryViewer={handleOpenSnapStoryViewer} 
                isLoading={isLoading && (!initialAppLoadDone || (currentUserVibeCircles.length === 0 && (currentUserProfile.vibeCircleIds && currentUserProfile.vibeCircleIds.length > 0)))}
            />
        );
    case 'vibeCircleView': 
        const currentVibeCircle = allVibeCircles.find(vc => vc.id === selectedVibeCircleId); 
        const snapsForVibeCircle = currentVibeCircle ? allSnaps.filter(snap => snap.vibeCircleId === currentVibeCircle.id).sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()) : []; 
        const membersForVibeCircle = currentVibeCircle 
            ? MOCK_POTENTIAL_FRIENDS.filter(p => currentVibeCircle.memberIds.includes(p.userId)) 
            : [];
        return (
            <VibeCircleViewPage 
                vibeCircle={currentVibeCircle || null} 
                snaps={snapsForVibeCircle}
                members={membersForVibeCircle}
                currentUser={currentUserProfile}
                onBack={() => handleNavigation('momentz')}
                onAddReaction={handleAddSnapReaction}
            />
        );
      case 'movieMatcher':
        if (isMatcherLoading) {
             return <div className="flex flex-col items-center justify-center h-[calc(100vh-12rem)] p-4 text-center">
                <LoadingSpinner />
                <p className="text-xl text-slate-300 mt-3">Setting up Matcher...</p>
            </div>;
        }
        if (!watchPartySession || !watchPartySession.matcherSession || !currentUserProfile) {
            console.warn("MovieMatcher: Session, matcher data, or user profile missing. Attempting to redirect or recover.");
            const lastKnownJoinCode = localStorage.getItem("lastMatcherJoinCode");
            const potentialGlobalSession = lastKnownJoinCode ? activeMatcherSessions[lastKnownJoinCode] : null;

            if (potentialGlobalSession && potentialGlobalSession.matcherSession && currentUserProfile) {
                 setWatchPartySession(potentialGlobalSession);
            } else {
                handleNavigation('home');
                return <div className="text-center py-10 text-slate-400">Error: Matcher session not initialized or user data missing. Redirecting...</div>;
            }
        }

        const currentValidSession = watchPartySession;
        if (!currentValidSession || !currentValidSession.matcherSession || !currentUserProfile) {
             handleNavigation('home');
             return <div className="text-center py-10 text-slate-400">Error: Critical data missing. Redirecting...</div>;
        }

        const matcherState = currentValidSession.matcherSession;
        const userMatcherState = matcherState.userStates[currentUserProfile.userId];

        if (!userMatcherState) {
             console.warn("MovieMatcher: User state missing for current user in the session. Redirecting home.");
             handleNavigation('home');
             return <div className="text-center py-10 text-slate-400">Error: You are not part of this matcher session. Redirecting...</div>;
        }

        const currentMovieForMatcher = userMatcherState.currentIndex < matcherState.moviePool.length
            ? matcherState.moviePool[userMatcherState.currentIndex]
            : null;

        const matchedMovieObject = currentValidSession.status === 'matched' && matcherState.matchedContentId
            ? matcherState.moviePool.find(m => m.contentId === matcherState.matchedContentId)
            : null;

        return (
            <MovieMatcherScreen
                movie={currentMovieForMatcher}
                onLike={() => handleMatcherDecision('liked')}
                onPass={() => handleMatcherDecision('passed')}
                isLoading={false}
                moviesRemaining={matcherState.moviePool.length - userMatcherState.currentIndex}
                totalMoviesInPool={matcherState.moviePool.length}
                matchedMovie={matchedMovieObject || undefined}
                joinCode={matcherState.joinCode}
            />
        );
      case 'discoverUsers':
        return (
          <DiscoverUsersPage
            users={discoverableUsers}
            onSendFriendRequest={handleSendFriendRequest}
            isLoading={isLoading && discoverableUsers.length === 0 && initialAppLoadDone}
          />
        );
      case 'suggestions':
        return <SuggestionsPage
                    groupedFriendSuggestions={groupedFriendSuggestions}
                    mySuggestionsMade={mySuggestionsMade}
                    onContentSelect={handleContentSelect}
                    onPlayWithPip={handlePlayStandalone}
                />;
      case 'watchParty':
         return (
            <WatchPartyPanel 
                session={watchPartySession} 
                currentUser={currentUserProfile} 
                onLeaveParty={handleLeaveWatchParty} 
                ongoingFriendParties={ongoingFriendParties}
                onRequestJoinOngoingParty={handleRequestJoinOngoingParty}
                onViewPartyContentDetails={handleContentSelect}
                onStartNewParty={handleOpenMatcherOptions}
                masterContentList={masterContentList}
            />
        );
      case 'profile':
        return <UserProfilePanel profile={currentUserProfile} onResumeContent={handleShowSummary} />;
      case 'contentDetail':
        if (isLoading || !selectedContent) { // Show loading if enriching or selectedContent not set yet
          return (
            <div className="flex justify-center items-center h-[calc(100vh-8rem)]">
              <LoadingSpinner />
              <p className="ml-4 text-slate-300">Loading content details...</p>
            </div>
          );
        }
          return <ContentDetailView
                    content={selectedContent}
                    onStartWatchParty={() => handleStartWatchParty(selectedContent)}
                    onBack={() => {
                        const validPreviousViews: AppView[] = ['home', 'search', 'suggestions', 'discoverUsers', 'movieMatcher', 'watchParty', 'momentz', 'vibeCircleView']; 
                        if (previousViewForContentDetail && validPreviousViews.includes(previousViewForContentDetail)) {
                            handleNavigation(previousViewForContentDetail);
                        } else {
                            handleNavigation('home');
                        }
                    }}
                    onOpenSuggestModal={handleOpenSuggestModal}
                    onPlayStandalone={handlePlayStandalone}
                 />;
      default:
        return <div className="text-center py-10 text-slate-400">Loading...</div>;
    }
  };

  const friendsForModal = currentUserProfile
    ? MOCK_POTENTIAL_FRIENDS.filter(p => p.userId !== currentUserProfile.userId && actualFriends.includes(p.userId))
    : [];

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100">
      <Navigation
          currentView={currentView}
          onNavigate={handleNavigation}
          currentUserProfile={currentUserProfile}
          isAuthenticated={isAuthenticated}
          onLogout={handleLogout}
          searchQuery={searchQuery}
          onSearchInputChange={handleSearchInputChange}
          onSearchSubmit={handleSearchSubmit}
          onClearSearch={handleClearSearch}
      />
      <main className={`flex-grow container mx-auto px-2 sm:px-4 py-4 ${isAuthenticated ? 'pt-20 md:pt-24 lg:pt-20' : 'pt-4'}`}>
        {renderView()}
      </main>

      {playingStandaloneVideo && currentUserProfile && ( 
        <StandaloneVideoPlayer
          content={playingStandaloneVideo}
          onClose={() => {
            setPlayingStandaloneVideo(null);
            if(isCreateSnapModalOpen) setIsCreateSnapModalOpen(false); 
          }}
          onOpenCreateSnapModal={handleOpenCreateSnapModal}
          isCreateSnapModalOpen={isCreateSnapModalOpen} 
        />
      )}

      {summaryContentInfo && (
        <AiSummaryModal
            isOpen={isSummaryModalOpen}
            onClose={handleCloseSummaryModal}
            title={`Summary for ${summaryContentInfo.content.title}`}
            summaryText={summaryText}
            isLoading={isSummaryLoading}
            errorText={summaryError}
            lastPositionFormatted={formatSecondsToHHMMSS(summaryContentInfo.lastPosition)}
            onPlay={handlePlayFromSummaryModal}
        />
      )}
      {contentToSuggestForModal && currentUserProfile && (
        <SuggestToFriendModal
            isOpen={isSuggestModalOpen}
            onClose={handleCloseSuggestModal}
            contentToSuggest={contentToSuggestForModal}
            friends={friendsForModal}
            onConfirmSuggestion={handleConfirmSuggestionFromModal}
        />
      )}
      {currentUserProfile && (
        <>
            <MatcherOptionsModal
                isOpen={isMatcherOptionsModalOpen}
                onClose={handleCloseMatcherOptions}
                onCreateNewMatcher={handleInitiateCreateMatcher}
                onJoinWithCode={handleOpenJoinCodeInput}
            />
            <JoinCodeInputModal
                isOpen={isJoinCodeInputModalOpen}
                onClose={handleCloseJoinCodeInput}
                onConfirmJoin={handleConfirmJoinMatcherWithCode}
            />
            <CreateSnapModal
                isOpen={isCreateSnapModalOpen}
                onClose={() => setIsCreateSnapModalOpen(false)}
                contentToSnap={contentForSnapCreation}
                currentUserVibeCircles={currentUserVibeCircles}
                onConfirm={handleConfirmCreateSnap}
            />
             {isSnapStoryViewerOpen && snapsForStoryViewer.length > 0 && (
                <SnapStoryViewerModal
                    isOpen={isSnapStoryViewerOpen}
                    onClose={() => setIsSnapStoryViewerOpen(false)}
                    snaps={snapsForStoryViewer} 
                    initialSnapIndex={storyViewerInitialSnapIndex}
                    currentUser={currentUserProfile}
                    onAddReaction={handleAddSnapReaction}
                    masterContentList={masterContentList}
                    onNextCreator={() => navigateToCreatorStory('next')}
                    onPrevCreator={() => navigateToCreatorStory('prev')}
                    hasNextCreator={hasNextCreator}
                    hasPrevCreator={hasPrevCreator}
                />
            )}
        </>
      )}
      <footer className="text-center py-4 text-sm text-slate-500 border-t border-slate-700/50">
        FirePulse MVP &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default App;
