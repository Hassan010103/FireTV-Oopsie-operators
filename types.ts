
export interface UserProfile {
  userId: string;
  displayName: string;
  avatarUrl?: string;
  preferences: {
    genres: string[];
    platforms: Platform[];
    mood_history: Mood[];
  };
  viewing_history: ViewingHistoryItem[];
  created_at: string;
  updated_at: string;
  vibeCircleIds?: string[]; // User's Vibe Circles
}

export interface ViewingHistoryItem {
  contentId: string;
  title: string;
  platform: Platform;
  watchTime: number;
  rating?: number;
  timestamp: string;
  thumbnailUrl: string;
  lastWatchPosition?: number;
  totalDuration?: number;
}

export interface PeakWatchDataPoint {
  timestampPercent: number; // 0.0 to 1.0
  intensity: number; // 0.0 (low) to 1.0 (high)
  label?: string; // Optional label for key moments
}

export interface Content {
  contentId: string;
  title: string;
  genre: string[];
  platform: Platform;
  rating?: number;
  duration?: number;
  thumbnailUrl: string;
  bannerUrl?: string;
  deepLink?: string;
  description?: string;
  mood_tags?: Mood[];
  cast?: string[];
  director?: string;
  year?: number;
  timestamp?: string; // Added for potential sorting of content if used in suggestions
  videoUrl?: string; // Added for actual video playback
  peakWatchData?: PeakWatchDataPoint[]; // Data for the "most-watched" graph
  imdbID?: string; // For OMDB integration
}

export interface RecommendationItem extends Content {
  confidence?: number;
  reason?: string;
}

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  message: string;
  timestamp: string;
}

export interface WatchPartyParticipant {
  userId: string;
  displayName: string;
  avatarUrl?: string;
}

export interface GuessingGameGuess {
  userId: string;
  userName: string;
  userAvatar?: string; // Added userAvatar for easier display in results
  selectedOptionIndex: number;
  timestamp: string;
}
export interface GuessingGame {
  isActive: boolean;
  question?: string;
  options?: string[];
  guesses: GuessingGameGuess[];
  revealGuesses: boolean;
  correctOptionIndex?: number; // Index of the correct answer
  scores: Record<string, number>; // userId -> score for this game round
}

export type MatcherDecision = 'liked' | 'passed' | 'undecided';

export interface MatcherUserState {
  userId: string;
  decisions: Record<string, MatcherDecision>; // contentId -> decision
  currentIndex: number; // Current movie index they are looking at from the pool
}

export interface MatcherSessionState {
  isActive: boolean;
  moviePool: Content[]; // Pool of movies for this matching session
  userStates: Record<string, MatcherUserState>; // userId -> MatcherUserState
  matchedContentId?: string | null; // If a match is found
  joinCode?: string; // Code for friend to join this matcher session
}


export interface WatchPartySession {
  sessionId: string;
  hostId: string;
  participants: WatchPartyParticipant[];
  contentId: string | null; // Can be null initially if using matcher
  content: Content | null; // Can be null initially
  currentTime: number;
  status: 'playing' | 'paused' | 'ended' | 'loading' | 'buffering' | 'matching' | 'matched';
  chat_messages: ChatMessage[];
  joinCode?: string; // Main watch party join code (distinct from matcher session join code if needed, but often the same)
  guessingGame?: GuessingGame;
  matcherSession?: MatcherSessionState; // Optional state for the movie matching feature
}

export enum Mood {
  Relaxed = "Relaxed",
  Excited = "Excited",
  Focused = "Focused",
  Adventurous = "Adventurous",
  Curious = "Curious",
  Happy = "Happy",
  Nostalgic = "Nostalgic",
  Inspired = "Inspired"
}

export enum Platform {
  PrimeVideo = "Prime Video",
  Netflix = "Netflix",
  Hotstar = "Hotstar",
  Zee5 = "Zee5",
  Youtube = "YouTube",
  Local = "My Library",
  Unknown = "Prime Video"
}

export type AppView = 'home' | 'watchParty' | 'profile' | 'contentDetail' | 'login' | 'suggestions' | 'movieMatcher' | 'discoverUsers' | 'search' | 'momentz' | 'vibeCircleView';

// This will be the new central type for all suggestions
export interface GlobalSuggestionItem {
  suggestionId: string;
  suggesterId: string;
  suggesterDisplayName: string;
  suggesterAvatarUrl?: string;
  recipientId: string;
  content: RecommendationItem; // The content item that was suggested
  message?: string;
  timestamp: string; // Timestamp of when the suggestion was made
}


// These types are for how suggestions are grouped and displayed on the SuggestionsPage
export type GroupedFriendSuggestions = Record<string, { // Keyed by suggester.userId
  suggester: WatchPartyParticipant; // Full participant info for the suggester
  suggestions: RecommendationItem[]; // Array of content items suggested by this person
}>;

export type GroupedMySuggestions = Record<string, { // Keyed by recipient.userId
  recipient: WatchPartyParticipant; // Full participant info for the recipient
  suggestions: RecommendationItem[]; // Array of content items suggested to this person by current user
}>;


export interface DiscoverableUser {
  userId: string;
  displayName: string;
  avatarUrl?: string;
  commonInterests?: string[]; // Example: ['Sci-Fi', 'Documentaries']
  friendshipStatus: 'not_friends' | 'request_sent' | 'friends' | 'self';
}

export interface OngoingPartyDisplayItem {
  sessionId: string;
  host: WatchPartyParticipant;
  content: Content;
  participantCount: number;
  joinStatus: 'can_request' | 'request_sent' | 'already_member' | 'is_host';
}

// Momentz Feature Types (Vibe Circle related types updated)
export interface SnapReaction {
  userId: string; // User who reacted
  emoji: string; // The emoji character
}

export interface SnapCreatorInfo { // Basic info stored within a Snap
  userId:string;
  displayName: string;
  avatarUrl?: string;
}

export interface SnapCreatorStoryInfo { // Used for displaying story circles, can include aggregated data
    userId: string;
    displayName: string;
    avatarUrl?: string;
    latestSnapTimestamp?: string; // For sorting friend snaps
    totalLikes?: number; // For displaying on trending snaps
}


export interface Snap {
  id: string;
  creatorInfo: SnapCreatorInfo; // Nested creator info
  vibeCircleId: string; // Renamed from campfireId // For friend snaps, might be null/empty for trending/public
  contentId?: string; // Optional: if Snap is tied to specific Content in the app
  associatedContentTitle?: string; // Optional: denormalized title for quick display
  timestamp: string; // ISO date string
  imageUrl: string; // URL of the captured image/moment
  videoUrl?: string; // Optional: URL for a short video snap
  caption?: string;
  reactions: SnapReaction[];
  isPublic?: boolean; // To distinguish trending snaps that are not tied to user's vibe circles
}

export interface VibeCircle { // Renamed from Campfire
  id: string;
  name: string;
  description?: string;
  memberIds: string[]; // IDs of users who are members
  snapIds: string[]; // IDs of snaps in this Vibe Circle
  memberAvatars?: string[]; // Optional: for quick display on VibeCircleCard
  recentSnapImage?: string; // Optional: for VibeCircleCard display
}
