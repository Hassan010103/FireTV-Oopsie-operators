import { UserProfile, RecommendationItem, WatchPartySession, Content, Platform, Mood, ViewingHistoryItem, ChatMessage, WatchPartyParticipant, MatcherDecision, DiscoverableUser, GlobalSuggestionItem, GroupedFriendSuggestions, PeakWatchDataPoint, VibeCircle, Snap, SnapReaction, SnapCreatorInfo } from './types'; // VibeCircle import

export const MOCK_USER_ID = "user123_hassan";
export const MOCK_USER_ID_PRIYA = "user789_priya"; // New User ID
export const MOCK_USER_ID_ANANYA = "user456_ananya"; // Ananya's ID
export const MOCK_USER_ID_SAM = "user_sam_trends";

// New Mock User IDs for Trending Creators
export const MOCK_USER_ID_RAHUL = "user_rahul_trends";
export const MOCK_USER_ID_AISHA = "user_aisha_trends";
export const MOCK_USER_ID_VIKRAM = "user_vikram_trends";

const VIDEO_URL_POOL = [
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", // Approx 10s, good for generic use
];
let videoUrlPoolAssignIndex = 0; // Index for assigning to items that DON'T have a videoUrl

export const assignablePlatforms: Platform[] = [Platform.PrimeVideo, Platform.Netflix, Platform.Hotstar, Platform.Zee5, Platform.Youtube];

const mockContentBase = (
    id: string, 
    title: string, 
    platform: Platform, 
    genres: string[], 
    mood_tags: Mood[], 
    durationMinutes?: number, 
    videoUrlParam?: string, // Renamed to avoid clash with the property name 'videoUrl'
    extras?: Partial<Content> 
): Content => {
  let finalPlatform = platform;
  if (platform === Platform.Unknown) {
    finalPlatform = assignablePlatforms[Math.floor(Math.random() * assignablePlatforms.length)];
  }

  // Ensure a videoUrl is always assigned
  const finalVideoUrl = videoUrlParam !== undefined
    ? videoUrlParam
    : VIDEO_URL_POOL[videoUrlPoolAssignIndex++ % VIDEO_URL_POOL.length]; // Assign from pool and increment index
  
  return {
    contentId: id,
    title: title,
    platform: finalPlatform,
    genre: genres,
    rating: parseFloat((Math.random() * 3 + 7).toFixed(1)), // 7.0-10.0
    duration: (durationMinutes || Math.floor(Math.random() * 60 + 90)) * 60, // 90-150 minutes in seconds, or specified
    thumbnailUrl: `https://picsum.photos/seed/${id}/400/225`, // Default mock, will be overridden by OMDB
    bannerUrl: `https://picsum.photos/seed/${id}_banner/1280/720`, // Default mock, will be overridden by OMDB
    description: `This is a captivating ${genres.join(', ')} about ${title.toLowerCase()}. Perfect for when you're feeling ${mood_tags.join(' or ')}. Available on ${finalPlatform}.`, // Will be overridden
    mood_tags: mood_tags,
    cast: ["Famous Actor", "Rising Star", "Veteran Performer"], // Will be overridden
    director: "Acclaimed Director", // Will be overridden
    year: Math.floor(Math.random() * 24) + 2000, // 2000-2023 // Will be overridden
    deepLink: `firetv://${finalPlatform.toLowerCase().replace(' ','')}/content/${id}`,
    timestamp: new Date(2020 + Math.floor(Math.random()*4), Math.floor(Math.random()*12), Math.floor(Math.random()*28)).toISOString(),
    videoUrl: finalVideoUrl, // Use the determined finalVideoUrl
    ...extras, 
  };
};

const DEMO_PEAK_WATCH_DATA_C001: PeakWatchDataPoint[] = [ // For "The Lion King"
  { timestampPercent: 0.05, intensity: 0.3 },
  { timestampPercent: 0.15, intensity: 0.7 },
  { timestampPercent: 0.25, intensity: 0.5 },
  { timestampPercent: 0.40, intensity: 0.9, label: "Circle of Life Opening" }, 
  { timestampPercent: 0.50, intensity: 0.6 },
  { timestampPercent: 0.65, intensity: 0.8 },
  { timestampPercent: 0.75, intensity: 0.4 },
  { timestampPercent: 0.85, intensity: 0.7 },
  { timestampPercent: 0.95, intensity: 0.3 },
].sort((a,b) => a.timestampPercent - b.timestampPercent);

const DEMO_PEAK_WATCH_DATA_C014: PeakWatchDataPoint[] = [ // For "Avatar"
  { timestampPercent: 0.1, intensity: 0.4 },
  { timestampPercent: 0.2, intensity: 0.6 },
  { timestampPercent: 0.3, intensity: 0.3 },
  { timestampPercent: 0.5, intensity: 1.0, label: "Toruk Makto Flight" }, 
  { timestampPercent: 0.6, intensity: 0.7 },
  { timestampPercent: 0.7, intensity: 0.5 },
  { timestampPercent: 0.8, intensity: 0.8 },
  { timestampPercent: 0.9, intensity: 0.4 },
].sort((a,b) => a.timestampPercent - b.timestampPercent);


export const MOCK_CONTENTS: Content[] = [
  mockContentBase("c001", "The Lion King", Platform.Hotstar, ["Animation", "Drama", "Adventure"], [Mood.Nostalgic, Mood.Inspired], 88, VIDEO_URL_POOL[0], { peakWatchData: DEMO_PEAK_WATCH_DATA_C001 }),
  mockContentBase("c002", "The Matrix", Platform.PrimeVideo, ["Sci-Fi", "Action"], [Mood.Excited, Mood.Focused], 136, VIDEO_URL_POOL[1]),
  mockContentBase("c003", "Toy Story", Platform.Hotstar, ["Animation", "Comedy", "Family"], [Mood.Happy, Mood.Nostalgic], 81, VIDEO_URL_POOL[2]),
  mockContentBase("c004", "The Shawshank Redemption", Platform.Netflix, ["Drama"], [Mood.Inspired, Mood.Focused], 142), // videoUrl will be assigned by mockContentBase
  mockContentBase("c005", "Jurassic Park", Platform.Zee5, ["Adventure", "Sci-Fi", "Thriller"], [Mood.Excited, Mood.Adventurous], 127), // videoUrl will be assigned by mockContentBase
  mockContentBase("c006", "Spirited Away", Platform.Youtube, ["Animation", "Adventure", "Family"], [Mood.Adventurous, Mood.Inspired], 125), // videoUrl will be assigned by mockContentBase
  mockContentBase("c007", "The Dark Knight", Platform.PrimeVideo, ["Action", "Crime", "Drama"], [Mood.Excited, Mood.Focused], 152), // videoUrl will be assigned by mockContentBase
  mockContentBase("c008", "Forrest Gump", Platform.Netflix, ["Drama", "Romance"], [Mood.Happy, Mood.Nostalgic], 142), // videoUrl will be assigned by mockContentBase
  mockContentBase("c009", "Inception", Platform.Hotstar, ["Action", "Sci-Fi", "Thriller"], [Mood.Curious, Mood.Focused], 148), // videoUrl will be assigned by mockContentBase
  mockContentBase("c010", "Finding Nemo", Platform.Zee5, ["Animation", "Adventure", "Comedy"], [Mood.Happy, Mood.Adventurous], 100), // videoUrl will be assigned by mockContentBase
  mockContentBase("c011", "Pulp Fiction", Platform.Local, ["Crime", "Drama"], [Mood.Curious, Mood.Excited], 154), // videoUrl will be assigned by mockContentBase
  mockContentBase("c012", "Interstellar", Platform.Youtube, ["Sci-Fi", "Drama", "Adventure"], [Mood.Curious, Mood.Inspired], 169), // videoUrl will be assigned by mockContentBase
  mockContentBase("c013", "Gladiator", Platform.Youtube, ["Action", "Adventure", "Drama"], [Mood.Excited, Mood.Inspired], 155, VIDEO_URL_POOL[3]),
  mockContentBase("c014", "Avatar", Platform.Youtube, ["Sci-Fi", "Action", "Adventure"], [Mood.Adventurous, Mood.Excited], 162, VIDEO_URL_POOL[4], { peakWatchData: DEMO_PEAK_WATCH_DATA_C014 }),
  mockContentBase("generic_snap_video_1", "Titanic", Platform.Unknown, ["Drama", "Romance"], [Mood.Nostalgic, Mood.Relaxed], 195, VIDEO_URL_POOL[5]), 
];


// For Movie Matcher - can be a subset or all of MOCK_CONTENTS
export const MATCHER_MOVIE_POOL_SIZE = 10; // Show 10 movies for matching
// getMatcherMoviePool function is removed from here and handled in App.tsx

// Simulate a friend's decisions for the matcher - this might need adjustment if pool changes dynamically
export const MOCK_FRIEND_MATCHER_DECISIONS: Record<string, MatcherDecision> = 
    MOCK_CONTENTS.slice(0, MATCHER_MOVIE_POOL_SIZE).reduce((acc, content, index) => {
        if (index % 2 === 0 || content.contentId === "c001" || content.contentId === "c003" ) { 
            acc[content.contentId] = 'liked';
        } else {
            acc[content.contentId] = 'passed';
        }
        return acc;
    }, {} as Record<string, MatcherDecision>);


const createHistoryItem = (content: Content, timestamp: string, partial?: Partial<ViewingHistoryItem>): ViewingHistoryItem => ({
  contentId: content.contentId,
  title: content.title,
  platform: content.platform,
  watchTime: content.duration ? content.duration - (Math.random() > 0.5 ? Math.floor(Math.random() * (content.duration/2)) : 0) : Math.floor(Math.random() * 3000 + 1800), // Simulate some full watches, some partial
  rating: Math.random() > 0.3 ? parseFloat((Math.random() * 2 + 3).toFixed(1)) as 3|3.5|4|4.5|5 : undefined, // Optional rating
  timestamp,
  thumbnailUrl: content.thumbnailUrl, // This will be updated after OMDB fetch
  totalDuration: content.duration,
  lastWatchPosition: (content.duration && Math.random() > 0.4) ? Math.floor(Math.random() * (content.duration * 0.8) + (content.duration * 0.1)) : (content.duration && Math.random() > 0.7 ? content.duration : undefined), // Some fully watched, some partially
  ...partial,
});

export const MOCK_USER_PROFILE_HASSAN: UserProfile = { 
  userId: MOCK_USER_ID,
  displayName: "Hassan",
  avatarUrl: `https://picsum.photos/seed/${MOCK_USER_ID}/100/100`,
  preferences: {
    genres: ["Action", "Sci-Fi", "Thriller", "Comedy", "Documentary", "Sports"],
    platforms: [Platform.Netflix, Platform.PrimeVideo, Platform.Hotstar, Platform.Youtube],
    mood_history: [Mood.Excited, Mood.Focused, Mood.Adventurous, Mood.Relaxed, Mood.Curious],
  },
  viewing_history: [ // These will be enriched in App.tsx
    createHistoryItem(MOCK_CONTENTS.find(c=>c.contentId==="c001")!, "2024-07-15T20:00:00Z", { lastWatchPosition: 150, totalDuration: MOCK_CONTENTS.find(c=>c.contentId==="c001")!.duration }),
    createHistoryItem(MOCK_CONTENTS.find(c=>c.contentId==="c003")!, "2024-07-15T09:30:00Z", { lastWatchPosition: MOCK_CONTENTS.find(c=>c.contentId==="c003")!.duration, totalDuration: MOCK_CONTENTS.find(c=>c.contentId==="c003")!.duration }),
    createHistoryItem(MOCK_CONTENTS.find(c=>c.contentId==="c005")!, "2024-07-14T14:00:00Z", { lastWatchPosition: 1200, totalDuration: MOCK_CONTENTS.find(c=>c.contentId==="c005")!.duration }),
    createHistoryItem(MOCK_CONTENTS.find(c=>c.contentId==="c002")!, "2024-07-13T22:30:00Z", { lastWatchPosition: MOCK_CONTENTS.find(c=>c.contentId==="c002")!.duration ? MOCK_CONTENTS.find(c=>c.contentId==="c002")!.duration! * 0.5 : 3000, totalDuration: MOCK_CONTENTS.find(c=>c.contentId==="c002")!.duration}),
    createHistoryItem(MOCK_CONTENTS.find(c=>c.contentId==="c004")!, "2024-07-12T08:00:00Z", {rating: 4, lastWatchPosition: MOCK_CONTENTS.find(c=>c.contentId==="c004")!.duration, totalDuration: MOCK_CONTENTS.find(c=>c.contentId==="c004")!.duration}),
    createHistoryItem(MOCK_CONTENTS.find(c=>c.contentId==="c006")!, "2024-07-10T19:00:00Z"),
    createHistoryItem(MOCK_CONTENTS.find(c=>c.contentId==="c007")!, "2024-07-09T23:00:00Z", {rating: 3, lastWatchPosition: 600, totalDuration: MOCK_CONTENTS.find(c=>c.contentId==="c007")!.duration}),
    createHistoryItem(MOCK_CONTENTS.find(c=>c.contentId==="c009")!, "2024-07-09T10:00:00Z", { lastWatchPosition: MOCK_CONTENTS.find(c=>c.contentId==="c009")!.duration ? MOCK_CONTENTS.find(c=>c.contentId==="c009")!.duration! * 0.9 : 5000, totalDuration: MOCK_CONTENTS.find(c=>c.contentId==="c009")!.duration}),
    createHistoryItem(MOCK_CONTENTS.find(c=>c.contentId==="c013")!, "2024-07-17T18:00:00Z", { lastWatchPosition: 200, totalDuration: MOCK_CONTENTS.find(c=>c.contentId==="c013")!.duration }),
  ].sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
  created_at: "2024-01-01T10:00:00Z",
  updated_at: "2024-07-15T20:00:00Z",
  vibeCircleIds: ["vc1_movie_lovers", "vc2_general_hangout"], // Renamed from campfireIds
};

export const MOCK_USER_PROFILE_PRIYA: UserProfile = {
  userId: MOCK_USER_ID_PRIYA,
  displayName: "Priya",
  avatarUrl: `https://picsum.photos/seed/${MOCK_USER_ID_PRIYA}/100/100`,
  preferences: {
    genres: ["Comedy", "Romance", "Documentary", "Drama", "Sports"],
    platforms: [Platform.Netflix, Platform.Zee5, Platform.Hotstar, Platform.Youtube],
    mood_history: [Mood.Happy, Mood.Relaxed, Mood.Inspired, Mood.Curious],
  },
  viewing_history: [
    createHistoryItem(MOCK_CONTENTS.find(c=>c.contentId==="c001")!, "2024-07-16T10:00:00Z", { lastWatchPosition: 100, totalDuration: MOCK_CONTENTS.find(c=>c.contentId==="c001")!.duration }),
    createHistoryItem(MOCK_CONTENTS.find(c=>c.contentId==="c003")!, "2024-07-14T11:00:00Z", { lastWatchPosition: MOCK_CONTENTS.find(c=>c.contentId==="c003")!.duration, totalDuration: MOCK_CONTENTS.find(c=>c.contentId==="c003")!.duration, rating: 5 }),
    createHistoryItem(MOCK_CONTENTS.find(c=>c.contentId==="c005")!, "2024-07-13T15:30:00Z", { lastWatchPosition: 500, totalDuration: MOCK_CONTENTS.find(c=>c.contentId==="c005")!.duration }),
    createHistoryItem(MOCK_CONTENTS.find(c=>c.contentId==="c008")!, "2024-07-12T19:00:00Z", {rating: 4, lastWatchPosition: MOCK_CONTENTS.find(c=>c.contentId==="c008")!.duration, totalDuration: MOCK_CONTENTS.find(c=>c.contentId==="c008")!.duration}),
    createHistoryItem(MOCK_CONTENTS.find(c=>c.contentId==="c010")!, "2024-07-10T08:00:00Z"),
    createHistoryItem(MOCK_CONTENTS.find(c=>c.contentId==="c013")!, "2024-07-18T10:00:00Z", {rating: 5, lastWatchPosition: MOCK_CONTENTS.find(c=>c.contentId==="c013")!.duration, totalDuration: MOCK_CONTENTS.find(c=>c.contentId==="c013")!.duration }),
  ].sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
  created_at: "2024-02-10T12:00:00Z",
  updated_at: "2024-07-16T10:00:00Z",
  vibeCircleIds: ["vc1_movie_lovers", "vc3_comedy_club"], // Renamed from campfireIds
};

export const MOCK_POTENTIAL_FRIENDS: WatchPartyParticipant[] = [
  { userId: MOCK_USER_PROFILE_HASSAN.userId, displayName: MOCK_USER_PROFILE_HASSAN.displayName, avatarUrl: MOCK_USER_PROFILE_HASSAN.avatarUrl },
  { userId: MOCK_USER_PROFILE_PRIYA.userId, displayName: MOCK_USER_PROFILE_PRIYA.displayName, avatarUrl: MOCK_USER_PROFILE_PRIYA.avatarUrl },
  { userId: MOCK_USER_ID_ANANYA, displayName: "Ananya", avatarUrl: "https://picsum.photos/seed/user456_ananya/100/100" },
  { userId: "user789_hassan_friend", displayName: "Hassan (Friend)", avatarUrl: "https://picsum.photos/seed/user789_hassan_friend/100/100" },
  { userId: "user101_ananya_friend", displayName: "Ananya (Friend)", avatarUrl: "https://picsum.photos/seed/user101_ananya_friend/100/100" },
];
export const MOCK_FRIEND_PARTICIPANT_FOR_MATCHER = MOCK_POTENTIAL_FRIENDS[2]; // Ananya


export const MOCK_CHAT_MESSAGES: ChatMessage[] = [
    { id: "msg1", userId: MOCK_POTENTIAL_FRIENDS[2].userId, userName: MOCK_POTENTIAL_FRIENDS[2].displayName, message: "This movie is amazing! 🤩", timestamp: new Date(Date.now() - 5 * 60000).toISOString(), userAvatar: MOCK_POTENTIAL_FRIENDS[2].avatarUrl }, // Ananya
    { id: "msg2", userId: MOCK_USER_PROFILE_HASSAN.userId, userName: MOCK_USER_PROFILE_HASSAN.displayName, message: "Totally agree! That scene was epic.", timestamp: new Date(Date.now() - 3 * 60000).toISOString(), userAvatar: MOCK_USER_PROFILE_HASSAN.avatarUrl }, // Hassan
    { id: "msg3", userId: MOCK_POTENTIAL_FRIENDS[3].userId, userName: MOCK_POTENTIAL_FRIENDS[3].displayName, message: "🍿🥤", timestamp: new Date(Date.now() - 1 * 60000).toISOString(), userAvatar: MOCK_POTENTIAL_FRIENDS[3].avatarUrl }, // Hassan (Friend)
];

export const MOCK_WATCH_PARTY_SESSION_BASE: Omit<WatchPartySession, 'content' | 'contentId' | 'matcherSession'> = {
  sessionId: "wp_xyz789",
  hostId: MOCK_USER_PROFILE_HASSAN.userId, 
  participants: [MOCK_POTENTIAL_FRIENDS[0], MOCK_POTENTIAL_FRIENDS[2]], 
  currentTime: 0,
  status: 'paused', 
  chat_messages: [],
  joinCode: "MOVIE123",
  guessingGame: {
    isActive: false,
    guesses: [],
    revealGuesses: false,
    correctOptionIndex: undefined,
    scores: {},
  }
};

export const MOCK_WATCH_PARTY_SESSION_WITH_CONTENT: WatchPartySession = {
  ...MOCK_WATCH_PARTY_SESSION_BASE,
  content: MOCK_CONTENTS[0], 
  contentId: MOCK_CONTENTS[0].contentId,
  currentTime: MOCK_CONTENTS[0].videoUrl ? 30 : (MOCK_CONTENTS[0].duration ? MOCK_CONTENTS[0].duration / 2 : 1830),
  status: 'paused',
  participants: [MOCK_POTENTIAL_FRIENDS[0], MOCK_POTENTIAL_FRIENDS[2], MOCK_POTENTIAL_FRIENDS[3]], 
  guessingGame: { // Ensure guessingGame is fully defined here too
    isActive: false,
    question: undefined,
    options: undefined,
    guesses: [],
    revealGuesses: false,
    correctOptionIndex: undefined,
    scores: {},
  },
};


export const MOCK_ACTIVE_FRIEND_SESSIONS: WatchPartySession[] = [
  // Party hosted by Priya (friend of Hassan)
  {
    sessionId: "wp_priya_active_1",
    hostId: MOCK_USER_ID_PRIYA,
    participants: [
      MOCK_POTENTIAL_FRIENDS.find(p => p.userId === MOCK_USER_ID_PRIYA)!,
      MOCK_POTENTIAL_FRIENDS.find(p => p.userId === MOCK_USER_ID_ANANYA)! 
    ],
    contentId: MOCK_CONTENTS[4].contentId, // Jurassic Park
    content: MOCK_CONTENTS[4],
    currentTime: 1200, // 20 minutes in
    status: 'playing',
    chat_messages: [],
    joinCode: "PRIYA123",
    guessingGame: { isActive: false, guesses: [], revealGuesses: false, scores: {} }
  },
  // Party hosted by Ananya (friend of Hassan and Priya)
  {
    sessionId: "wp_ananya_active_1",
    hostId: MOCK_USER_ID_ANANYA,
    participants: [
      MOCK_POTENTIAL_FRIENDS.find(p => p.userId === MOCK_USER_ID_ANANYA)!,
      MOCK_POTENTIAL_FRIENDS.find(p => p.userId === "user789_hassan_friend")! // Hassan (Friend)
    ],
    contentId: MOCK_CONTENTS[7].contentId, // Forrest Gump
    content: MOCK_CONTENTS[7],
    currentTime: 300, // 5 minutes in
    status: 'paused',
    chat_messages: [],
    joinCode: "ANANYACOOL",
    guessingGame: { isActive: false, guesses: [], revealGuesses: false, scores: {} }
  },
   // Party hosted by Hassan (should not be shown to Hassan as "ongoing friend party")
  {
    sessionId: "wp_hassan_hosting_1",
    hostId: MOCK_USER_ID,
    participants: [
      MOCK_POTENTIAL_FRIENDS.find(p => p.userId === MOCK_USER_ID)!,
      MOCK_POTENTIAL_FRIENDS.find(p => p.userId === MOCK_USER_ID_ANANYA)!
    ],
    contentId: MOCK_CONTENTS[1].contentId, // The Matrix
    content: MOCK_CONTENTS[1],
    currentTime: 600, 
    status: 'playing',
    chat_messages: [],
    joinCode: "HASSANWP",
    guessingGame: { isActive: false, guesses: [], revealGuesses: false, scores: {} }
  },
   // Another party hosted by Priya, watching a different movie
  {
    sessionId: "wp_priya_active_2",
    hostId: MOCK_USER_ID_PRIYA,
    participants: [ MOCK_POTENTIAL_FRIENDS.find(p => p.userId === MOCK_USER_ID_PRIYA)! ], // Priya watching alone
    contentId: MOCK_CONTENTS[13].contentId, // Avatar
    content: MOCK_CONTENTS[13],
    currentTime: 150, 
    status: 'playing',
    chat_messages: [],
    joinCode: "SOLOPRIYA",
    guessingGame: { isActive: false, guesses: [], revealGuesses: false, scores: {} }
  }
];

export const MOCK_RECOMMENDATIONS: RecommendationItem[] = MOCK_CONTENTS.map((content, index) => ({
  ...content,
  confidence: parseFloat((Math.random() * 0.3 + 0.7).toFixed(2)),
  reason: index % 2 === 0 ? `Because you watched similar ${content.genre[0]} titles.` : `Matches your current ${content.mood_tags ? content.mood_tags[0] : 'mood'} preference.`
}));

// ALL_MOCK_SUGGESTIONS structure remains, but App.tsx will use masterContentList to enrich the 'content' field when displaying.
export const ALL_MOCK_SUGGESTIONS: GlobalSuggestionItem[] = [
  {
    suggestionId: "sugg_ananya_to_hassan_1",
    suggesterId: MOCK_POTENTIAL_FRIENDS[2].userId, 
    suggesterDisplayName: MOCK_POTENTIAL_FRIENDS[2].displayName,
    suggesterAvatarUrl: MOCK_POTENTIAL_FRIENDS[2].avatarUrl,
    recipientId: MOCK_USER_PROFILE_HASSAN.userId, 
    content: MOCK_RECOMMENDATIONS.find(r => r.contentId === "c003")!, 
    message: "Hassan, you'd love this, it's hilarious!",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60000).toISOString(),
  },
  {
    suggestionId: "sugg_ananya_friend_to_hassan_2",
    suggesterId: MOCK_POTENTIAL_FRIENDS[4].userId, 
    suggesterDisplayName: MOCK_POTENTIAL_FRIENDS[4].displayName,
    suggesterAvatarUrl: MOCK_POTENTIAL_FRIENDS[4].avatarUrl,
    recipientId: MOCK_USER_PROFILE_HASSAN.userId, 
    content: MOCK_RECOMMENDATIONS.find(r => r.contentId === "c001")!, 
    message: "This is an epic sci-fi action, Hassan!",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60000).toISOString(),
  },
  {
    suggestionId: "sugg_ananya_to_hassan_3",
    suggesterId: MOCK_POTENTIAL_FRIENDS[2].userId, 
    suggesterDisplayName: MOCK_POTENTIAL_FRIENDS[2].displayName,
    suggesterAvatarUrl: MOCK_POTENTIAL_FRIENDS[2].avatarUrl,
    recipientId: MOCK_USER_PROFILE_HASSAN.userId, 
    content: MOCK_RECOMMENDATIONS.find(r => r.contentId === "c005")!, 
    message: "Beautiful documentary, thought you might like it.",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60000).toISOString(),
  },
  {
    suggestionId: "sugg_hassan_to_ananya_1",
    suggesterId: MOCK_USER_PROFILE_HASSAN.userId, 
    suggesterDisplayName: MOCK_USER_PROFILE_HASSAN.displayName,
    suggesterAvatarUrl: MOCK_USER_PROFILE_HASSAN.avatarUrl,
    recipientId: MOCK_POTENTIAL_FRIENDS[2].userId, 
    content: MOCK_RECOMMENDATIONS.find(r => r.contentId === "c002")!, 
    message: "Ananya, check out this thriller! Super spooky.",
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60000).toISOString(),
  },
  {
    suggestionId: "sugg_hassan_to_priya_1", 
    suggesterId: MOCK_USER_PROFILE_HASSAN.userId,
    suggesterDisplayName: MOCK_USER_PROFILE_HASSAN.displayName,
    suggesterAvatarUrl: MOCK_USER_PROFILE_HASSAN.avatarUrl,
    recipientId: MOCK_USER_PROFILE_PRIYA.userId,
    content: MOCK_RECOMMENDATIONS.find(r => r.contentId === "c006")!, 
    message: "Priya, this animation is super fun!",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60000).toISOString(),
  },
  {
    suggestionId: "sugg_priya_to_hassan_1", 
    suggesterId: MOCK_USER_PROFILE_PRIYA.userId,
    suggesterDisplayName: MOCK_USER_PROFILE_PRIYA.displayName,
    suggesterAvatarUrl: MOCK_USER_PROFILE_PRIYA.avatarUrl,
    recipientId: MOCK_USER_PROFILE_HASSAN.userId,
    content: MOCK_RECOMMENDATIONS.find(r => r.contentId === "c008")!, 
    message: "Hassan, thought you might enjoy this rom-com!",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60000).toISOString(),
  },
  {
    suggestionId: "sugg_hassan_to_priya_sports_1", 
    suggesterId: MOCK_USER_PROFILE_HASSAN.userId,
    suggesterDisplayName: MOCK_USER_PROFILE_HASSAN.displayName,
    suggesterAvatarUrl: MOCK_USER_PROFILE_HASSAN.avatarUrl,
    recipientId: MOCK_USER_PROFILE_PRIYA.userId,
    content: MOCK_CONTENTS.find(c => c.contentId === "c013") as RecommendationItem, 
    message: "Priya, check out these intense sports highlights!",
    timestamp: new Date(Date.now() - 2 * 60 * 60000).toISOString(), 
  }
];

export const MOCK_FRIEND_SUGGESTIONS: GroupedFriendSuggestions = {};


export const MOCK_DISCOVERABLE_USERS: DiscoverableUser[] = [
  { userId: "user_discover_1", displayName: "Zara Khan", avatarUrl: "https://picsum.photos/seed/zarakhan/100/100", commonInterests: ["Sci-Fi", "Comedy"], friendshipStatus: 'not_friends' },
  { userId: "user_discover_2", displayName: "Rohan Sharma", avatarUrl: "https://picsum.photos/seed/rohansharma/100/100", commonInterests: ["Thriller", "Documentary"], friendshipStatus: 'not_friends' },
  { userId: MOCK_POTENTIAL_FRIENDS[2].userId, displayName: MOCK_POTENTIAL_FRIENDS[2].displayName, avatarUrl: MOCK_POTENTIAL_FRIENDS[2].avatarUrl, commonInterests: ["Thriller"], friendshipStatus: 'not_friends' }, 
  { userId: MOCK_POTENTIAL_FRIENDS[3].userId, displayName: MOCK_POTENTIAL_FRIENDS[3].displayName, avatarUrl: MOCK_POTENTIAL_FRIENDS[3].avatarUrl, commonInterests: ["Drama"], friendshipStatus: 'not_friends' }, 
];

// Renamed from PLATFORM_COLORS to PLATFORM_BADGE_STYLES for specific use in badges (Hero, Profile)
// App.tsx will now handle its own more detailed styling for platform filter buttons.
export const PLATFORM_BADGE_STYLES: Record<Platform, string> = {
  [Platform.PrimeVideo]: "bg-sky-500",
  [Platform.Netflix]: "bg-red-600",
  [Platform.Hotstar]: "bg-blue-700", // Disney+ Hotstar blue
  [Platform.Zee5]: "bg-purple-600",
  [Platform.Youtube]: "bg-red-500", // Standard YouTube red
  [Platform.Local]: "bg-green-600",
  [Platform.Unknown]: "bg-slate-500",
};

export const MOOD_OPTIONS: Mood[] = [
  Mood.Relaxed, Mood.Excited, Mood.Focused, Mood.Adventurous, Mood.Curious, Mood.Happy, Mood.Nostalgic, Mood.Inspired
];


// Step 1: Define the base friend snaps
const BASE_MOCK_SNAPS: Snap[] = [
    {
        id: "snap1",
        creatorInfo: {
            userId: MOCK_USER_ID,
            displayName: "Hassan",
            avatarUrl: MOCK_USER_PROFILE_HASSAN.avatarUrl,
        },
        vibeCircleId: "vc1_movie_lovers", 
        contentId: "c007", 
        associatedContentTitle: "The Dark Knight",
        timestamp: new Date(Date.now() - 10 * 60000).toISOString(),
        imageUrl: MOCK_CONTENTS.find(c => c.contentId === "c007")!.thumbnailUrl,
        videoUrl: MOCK_CONTENTS.find(c => c.contentId === "c007")!.videoUrl, 
        caption: "Joker's entry scene was 🔥!",
        reactions: [{ userId: MOCK_USER_ID_PRIYA, emoji: "🔥" }, { userId: MOCK_USER_ID_ANANYA, emoji: "😱" }],
        isPublic: false,
    },
    {
        id: "snap2",
        creatorInfo: {
            userId: MOCK_USER_ID_PRIYA,
            displayName: "Priya",
            avatarUrl: MOCK_USER_PROFILE_PRIYA.avatarUrl,
        },
        vibeCircleId: "vc1_movie_lovers", 
        contentId: "c001", 
        associatedContentTitle: "The Lion King",
        timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
        imageUrl: MOCK_CONTENTS.find(c => c.contentId === "c001")!.thumbnailUrl,
        videoUrl: MOCK_CONTENTS.find(c => c.contentId === "c001")!.videoUrl, 
        caption: "So nostalgic! Love this movie. 🦁👑",
        reactions: [{ userId: MOCK_USER_ID, emoji: "❤" }],
        isPublic: false,
    },
    {
        id: "snap3",
        creatorInfo: {
            userId: MOCK_USER_ID_ANANYA,
            displayName: "Ananya",
            avatarUrl: MOCK_POTENTIAL_FRIENDS.find(p=>p.userId === MOCK_USER_ID_ANANYA)?.avatarUrl,
        },
        vibeCircleId: "vc1_movie_lovers", 
        contentId: "c003", 
        associatedContentTitle: "Toy Story",
        timestamp: new Date(Date.now() - 2 * 60000).toISOString(),
        imageUrl: MOCK_CONTENTS.find(c => c.contentId === "c003")!.thumbnailUrl, 
        videoUrl: MOCK_CONTENTS.find(c => c.contentId === "c003")!.videoUrl, 
        caption: "To infinity and beyond! Such a classic.",
        reactions: [{ userId: MOCK_USER_ID, emoji: "🤯" }, { userId: MOCK_USER_ID_PRIYA, emoji: "👍" }],
        isPublic: false,
    },
    {
        id: "snap4",
        creatorInfo: {
            userId: MOCK_USER_ID,
            displayName: "Hassan",
            avatarUrl: MOCK_USER_PROFILE_HASSAN.avatarUrl,
        },
        vibeCircleId: "vc2_general_hangout", 
        contentId: "c013", 
        associatedContentTitle: "Gladiator",
        timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
        imageUrl: MOCK_CONTENTS.find(c => c.contentId === "c013")!.thumbnailUrl,
        videoUrl: MOCK_CONTENTS.find(c => c.contentId === "c013")!.videoUrl,
        caption: "Are you not entertained?! Epic scene.",
        reactions: [],
        isPublic: false,
    },
    {
        id: "snap5",
        creatorInfo: {
            userId: MOCK_USER_ID_PRIYA,
            displayName: "Priya",
            avatarUrl: MOCK_USER_PROFILE_PRIYA.avatarUrl,
        },
        vibeCircleId: "vc3_comedy_club", 
        contentId: "generic_snap_video_1", 
        associatedContentTitle: "Titanic", // Title from MOCK_CONTENTS
        timestamp: new Date(Date.now() - 20 * 60000).toISOString(),
        imageUrl: MOCK_CONTENTS.find(c => c.contentId === "generic_snap_video_1")!.thumbnailUrl,
        videoUrl: MOCK_CONTENTS.find(c => c.contentId === "generic_snap_video_1")!.videoUrl,
        caption: "The iconic 'king of the world' scene! 😂 (Just kidding, it's actually dramatic)",
        reactions: [{ userId: MOCK_USER_ID_ANANYA, emoji: "😂" }],
        isPublic: false,
    },
];

export const MOCK_SNAPS: Snap[] = [
    ...BASE_MOCK_SNAPS,
    ...[1,2,3,4,5].map(i => ({
        ...BASE_MOCK_SNAPS[0],
        id: `snap1_dup${i}`,
        timestamp: new Date(Date.now() - (10 + i) * 60000).toISOString(),
        caption: `Joker's entry scene was 🔥! (Replay ${i})`,
    })),
    ...[1,2,3].map(i => ({
        ...BASE_MOCK_SNAPS[1],
        id: `snap2_dup${i}`,
        timestamp: new Date(Date.now() - (5 + i) * 60000).toISOString(),
        caption: `So nostalgic! Love this movie. 🦁👑 (Replay ${i})`,
    })),
    ...[1,2].map(i => ({
        ...BASE_MOCK_SNAPS[2],
        id: `snap3_dup${i}`,
        timestamp: new Date(Date.now() - (2 + i) * 60000).toISOString(),
        caption: `To infinity and beyond! (Replay ${i})`,
    })),
    ...[1,2].map(i => ({
        ...BASE_MOCK_SNAPS[3],
        id: `snap4_dup${i}`,
        timestamp: new Date(Date.now() - (15 + i) * 60000).toISOString(),
        caption: `Are you not entertained?! (Replay ${i})`,
    })),
    ...[1].map(i => ({
        ...BASE_MOCK_SNAPS[4],
        id: `snap5_dup${i}`,
        timestamp: new Date(Date.now() - (20 + i) * 60000).toISOString(),
        caption: `The iconic 'king of the world' scene! (Replay ${i})`,
    })),
];

// Place this above BASE_MOCK_TRENDING_SNAPS_INDIA
export const MOCK_TRENDING_CREATORS: UserProfile[] = [
    {
        userId: MOCK_USER_ID_RAHUL,
        displayName: "Rahul",
        avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
        userId: MOCK_USER_ID_ANANYA,
        displayName: "Ananya",
        avatarUrl: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
        userId: MOCK_USER_ID_SAM,
        displayName: "Sam",
        avatarUrl: "https://randomuser.me/api/portraits/men/45.jpg",
    },
];

// Step 1: Define the base trending snaps
const BASE_MOCK_TRENDING_SNAPS_INDIA: Snap[] = [
    {
        id: "trend_snap1_rahul",
        creatorInfo: { userId: MOCK_USER_ID_RAHUL, displayName: "RahulPlays", avatarUrl: MOCK_TRENDING_CREATORS[0].avatarUrl },
        vibeCircleId: "",
        contentId: "c014", 
        associatedContentTitle: "Avatar",
        timestamp: new Date(Date.now() - 1 * 60 * 60000).toISOString(),
        imageUrl: MOCK_CONTENTS.find(c => c.contentId === "c014")!.thumbnailUrl,
        videoUrl: MOCK_CONTENTS.find(c => c.contentId === "c014")!.videoUrl,
        caption: "This world is incredible! 🌿 #SciFiFantasy",
        reactions: Array.from({length: 125}, (_, i) => ({ userId: `user_like_${i}`, emoji: "👍"})),
        isPublic: true,
    },
    {
        id: "trend_snap2_aisha",
        creatorInfo: { userId: MOCK_USER_ID_AISHA, displayName: "AishaVibes", avatarUrl: MOCK_TRENDING_CREATORS[1].avatarUrl },
        vibeCircleId: "",
        contentId: "c013", 
        associatedContentTitle: "Gladiator",
        timestamp: new Date(Date.now() - 2 * 60 * 60000).toISOString(),
        imageUrl: MOCK_CONTENTS.find(c => c.contentId === "c013")!.thumbnailUrl,
        videoUrl: MOCK_CONTENTS.find(c => c.contentId === "c013")!.videoUrl,
        caption: "Maximus! Maximus! What a fight scene! ⚔️ #HistoricalEpic",
        reactions: Array.from({length: 250}, (_, i) => ({ userId: `user_like_aisha_${i}`, emoji: "👍"})).concat([{userId: "test", emoji:"🔥"}]),
        isPublic: true,
    },
    {
        id: "trend_snap3_vikram",
        creatorInfo: { userId: MOCK_USER_ID_VIKRAM, displayName: "VikramScene", avatarUrl: MOCK_TRENDING_CREATORS[2].avatarUrl },
        vibeCircleId: "",
        contentId: "c001", 
        associatedContentTitle: "The Lion King",
        timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
        imageUrl: MOCK_CONTENTS.find(c => c.contentId === "c001")!.thumbnailUrl,
        videoUrl: MOCK_CONTENTS.find(c => c.contentId === "c001")!.videoUrl,
        caption: "The Circle of Life! 🦁 #AnimatedClassic",
        reactions: Array.from({length: 98}, (_, i) => ({ userId: `user_like_vikram_${i}`, emoji: "👍"})),
        isPublic: true,
    },
    {
        id: "trend_snap4_rahul_again",
        creatorInfo: { userId: MOCK_USER_ID_RAHUL, displayName: "RahulPlays", avatarUrl: MOCK_TRENDING_CREATORS[0].avatarUrl },
        vibeCircleId: "",
        contentId: "generic_snap_video_1", 
        associatedContentTitle: "Titanic", // Title from MOCK_CONTENTS
        timestamp: new Date(Date.now() - 10 * 60000).toISOString(),
        imageUrl: MOCK_CONTENTS.find(c => c.contentId === "generic_snap_video_1")!.thumbnailUrl,
        videoUrl: MOCK_CONTENTS.find(c => c.contentId === "generic_snap_video_1")!.videoUrl,
        caption: "Never let go, Jack! 🚢💔 #EpicRomance",
        reactions: Array.from({length: 55}, (_, i) => ({ userId: `user_like_rahul2_${i}`, emoji: "👍"})),
        isPublic: true,
    },
];

export const MOCK_TRENDING_SNAPS_INDIA: Snap[] = [
    ...BASE_MOCK_TRENDING_SNAPS_INDIA,
    ...[1,2].map(i => ({
        ...BASE_MOCK_TRENDING_SNAPS_INDIA[0],
        id: `trend_snap1_rahul_dup${i}`,
        timestamp: new Date(Date.now() - (60 + i * 10) * 60000).toISOString(),
        caption: `This world is incredible! 🌿 #SciFiFantasy (Replay ${i})`,
    })),
    ...[1].map(i => ({
        ...BASE_MOCK_TRENDING_SNAPS_INDIA[1],
        id: `trend_snap2_aisha_dup${i}`,
        timestamp: new Date(Date.now() - (120 + i * 10) * 60000).toISOString(),
        caption: `Maximus! Maximus! What a fight scene! (Replay ${i})`,
    })),
    ...[1,2].map(i => ({
        ...BASE_MOCK_TRENDING_SNAPS_INDIA[2],
        id: `trend_snap3_vikram_dup${i}`,
        timestamp: new Date(Date.now() - (30 + i * 5) * 60000).toISOString(),
        caption: `The Circle of Life! 🦁 (Replay ${i})`,
    })),
    ...[1].map(i => ({
        ...BASE_MOCK_TRENDING_SNAPS_INDIA[3],
        id: `trend_snap4_rahul_again_dup${i}`,
        timestamp: new Date(Date.now() - (10 + i * 5) * 60000).toISOString(),
        caption: `Never let go, Jack! 🚢💔 (Replay ${i})`,
    })),
];

// Add trending creators to MOCK_POTENTIAL_FRIENDS if they aren't already there (for avatar/name lookup consistency if needed elsewhere)
MOCK_TRENDING_CREATORS.forEach(tc => {
    if (!MOCK_POTENTIAL_FRIENDS.find(p => p.userId === tc.userId)) {
        MOCK_POTENTIAL_FRIENDS.push({ userId: tc.userId, displayName: tc.displayName, avatarUrl: tc.avatarUrl });
    }
});

export const MOCK_VIBE_CIRCLES: VibeCircle[] = [
    {
        id: "vc1_movie_lovers", 
        name: "🎬 Movie Night Vibes", 
        description: "For discussing epic movie moments and sharing cool snaps from what we're watching!",
        memberIds: [MOCK_USER_ID, MOCK_USER_ID_PRIYA, MOCK_USER_ID_ANANYA],
        snapIds: ["snap1", "snap2", "snap3"],
        memberAvatars: [MOCK_USER_PROFILE_HASSAN.avatarUrl!, MOCK_USER_PROFILE_PRIYA.avatarUrl!, MOCK_POTENTIAL_FRIENDS.find(p=>p.userId === MOCK_USER_ID_ANANYA)!.avatarUrl!],
        recentSnapImage: MOCK_SNAPS.find(s=>s.id==='snap3')?.imageUrl
    },
    {
        id: "vc2_general_hangout", 
        name: "🛋️ Chill Zone", 
        description: "Casual chats, random shares, and anything fun.",
        memberIds: [MOCK_USER_ID, MOCK_POTENTIAL_FRIENDS[3].userId], // Hassan & Hassan (Friend)
        snapIds: ["snap4"],
        memberAvatars: [MOCK_USER_PROFILE_HASSAN.avatarUrl!, MOCK_POTENTIAL_FRIENDS[3].avatarUrl!],
        recentSnapImage: MOCK_SNAPS.find(s=>s.id==='snap4')?.imageUrl
    },
    {
        id: "vc3_comedy_club", 
        name: "😂 LOL Central", 
        description: "Only the funniest clips and moments here! Bring on the laughs.",
        memberIds: [MOCK_USER_ID_PRIYA, MOCK_USER_ID_ANANYA],
        snapIds: ["snap5"],
        memberAvatars: [MOCK_USER_PROFILE_PRIYA.avatarUrl!, MOCK_POTENTIAL_FRIENDS.find(p=>p.userId === MOCK_USER_ID_ANANYA)!.avatarUrl!],
        recentSnapImage: MOCK_SNAPS.find(s=>s.id==='snap5')?.imageUrl
    },
];
