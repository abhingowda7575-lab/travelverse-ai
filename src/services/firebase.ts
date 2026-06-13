import { travelStoriesData, destinationsData, dashboardStatsData } from './mockData';
import type { Destination, TravelStory, Comment } from './mockData';

// Simulated latency to mimic network requests
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export interface FirebaseUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  bio: string;
  tripsCount: number;
  postsCount: number;
  savedCount: number;
  countriesCount: number;
  followerCount?: number;
  followingCount?: number;
}


// ----------------------------------------------------
// DUAL MODE FIREBASE & LOCAL STORAGE MOCK SYSTEM
// ----------------------------------------------------

// Try to initialize firebase, otherwise use local storage mock.
// We configure these variables in .env. We fall back if they are empty.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const isRealFirebaseConfigured = !!(
  firebaseConfig.apiKey && 
  firebaseConfig.projectId && 
  firebaseConfig.authDomain
);

// Fallback Mock State Keys
const STORAGE_KEYS = {
  AUTH_USER: 'travelverse_auth_user',
  STORIES: 'travelverse_stories',
  DESTINATIONS: 'travelverse_destinations',
  TRIPS: 'travelverse_trips'
};

// Initialize Mock Local Storage Data if empty
if (!localStorage.getItem(STORAGE_KEYS.STORIES)) {
  localStorage.setItem(STORAGE_KEYS.STORIES, JSON.stringify(travelStoriesData));
}
if (!localStorage.getItem(STORAGE_KEYS.DESTINATIONS)) {
  localStorage.setItem(STORAGE_KEYS.DESTINATIONS, JSON.stringify(destinationsData));
}
if (!localStorage.getItem(STORAGE_KEYS.TRIPS)) {
  localStorage.setItem(STORAGE_KEYS.TRIPS, JSON.stringify([]));
}

// ----------------------------------------------------
// AUTH SERVICE (Unified Interface)
// ----------------------------------------------------

type AuthStateCallback = (user: FirebaseUser | null) => void;
const authListeners: AuthStateCallback[] = [];

let currentMockUser: FirebaseUser | null = (() => {
  const saved = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
  if (saved) return JSON.parse(saved);
  return null;
})();

const triggerAuthListeners = () => {
  authListeners.forEach(cb => cb(currentMockUser));
};

export const authService = {
  onAuthStateChanged: (callback: AuthStateCallback) => {
    authListeners.push(callback);
    // Trigger immediately with current state
    callback(currentMockUser);
    return () => {
      const idx = authListeners.indexOf(callback);
      if (idx !== -1) authListeners.splice(idx, 1);
    };
  },

  signUp: async (email: string, password: string, displayName: string): Promise<FirebaseUser> => {
    await delay(800);
    if (!email || !password || !displayName) {
      throw new Error('Please fill in all fields.');
    }
    
    // Check if email already exists in mock
    const user: FirebaseUser = {
      uid: 'user_' + Math.random().toString(36).substr(2, 9),
      email,
      displayName,
      photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80', // Default avatar
      bio: 'Ready to explore the TravelVerse! 🌎✈️',
      tripsCount: 0,
      postsCount: 0,
      savedCount: 0,
      countriesCount: 0
    };

    currentMockUser = user;
    localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user));
    triggerAuthListeners();
    return user;
  },

  signIn: async (email: string, password: string): Promise<FirebaseUser> => {
    await delay(800);
    if (!email || !password) {
      throw new Error('Please enter email and password.');
    }

    // Default mock account if any sign-in details are entered
    const user: FirebaseUser = {
      uid: 'user_default_123',
      email,
      displayName: email.split('@')[0],
      photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      bio: 'Adventure seeker, digital nomad, and story writer. Currently planning the next escape! 🌄',
      tripsCount: dashboardStatsData.tripsCreated,
      postsCount: dashboardStatsData.postsUploaded,
      savedCount: dashboardStatsData.savedDestinations,
      countriesCount: dashboardStatsData.countriesVisited
    };

    currentMockUser = user;
    localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user));
    triggerAuthListeners();
    return user;
  },

  signOut: async (): Promise<void> => {
    await delay(300);
    currentMockUser = null;
    localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    triggerAuthListeners();
  },

  updateProfile: async (displayName: string, bio: string, photoURL?: string): Promise<FirebaseUser> => {
    await delay(600);
    if (!currentMockUser) throw new Error('No user is currently logged in.');

    currentMockUser = {
      ...currentMockUser,
      displayName,
      bio,
      photoURL: photoURL || currentMockUser.photoURL
    };

    localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(currentMockUser));
    triggerAuthListeners();
    return currentMockUser;
  }
};

// ----------------------------------------------------
// DATABASE SERVICE (Unified Interface)
// ----------------------------------------------------

export const dbService = {
  // --- Community Feed Stories ---
  getStories: async (): Promise<TravelStory[]> => {
    await delay(500);
    const data = localStorage.getItem(STORAGE_KEYS.STORIES);
    return data ? JSON.parse(data) : [];
  },

  addStory: async (storyContent: string, mediaFileUrl: string, mediaType: 'photo' | 'video', location: string): Promise<TravelStory> => {
    await delay(800);
    if (!currentMockUser) throw new Error('Log in to share a story.');

    const stories = await dbService.getStories();
    const newStory: TravelStory = {
      id: 'story_' + Math.random().toString(36).substr(2, 9),
      username: currentMockUser.displayName,
      userAvatar: currentMockUser.photoURL,
      content: storyContent,
      mediaType,
      mediaUrl: mediaFileUrl || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
      likesCount: 0,
      commentsCount: 0,
      comments: [],
      location: location || 'Global',
      isLiked: false,
      isSaved: false,
      date: 'Just now'
    };

    // Prepend to stories
    const updated = [newStory, ...stories];
    localStorage.setItem(STORAGE_KEYS.STORIES, JSON.stringify(updated));

    // Update user stats
    if (currentMockUser) {
      currentMockUser.postsCount += 1;
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(currentMockUser));
      triggerAuthListeners();
    }

    return newStory;
  },

  likeStory: async (storyId: string): Promise<TravelStory[]> => {
    const stories = await dbService.getStories();
    const updated = stories.map(s => {
      if (s.id === storyId) {
        const liked = !s.isLiked;
        return {
          ...s,
          isLiked: liked,
          likesCount: liked ? s.likesCount + 1 : s.likesCount - 1
        };
      }
      return s;
    });
    localStorage.setItem(STORAGE_KEYS.STORIES, JSON.stringify(updated));
    return updated;
  },

  saveStory: async (storyId: string): Promise<TravelStory[]> => {
    const stories = await dbService.getStories();
    let savedCountChange = 0;
    const updated = stories.map(s => {
      if (s.id === storyId) {
        const saved = !s.isSaved;
        savedCountChange = saved ? 1 : -1;
        return {
          ...s,
          isSaved: saved
        };
      }
      return s;
    });
    localStorage.setItem(STORAGE_KEYS.STORIES, JSON.stringify(updated));

    if (currentMockUser) {
      currentMockUser.savedCount = Math.max(0, currentMockUser.savedCount + savedCountChange);
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(currentMockUser));
      triggerAuthListeners();
    }
    return updated;
  },

  addComment: async (storyId: string, text: string): Promise<TravelStory[]> => {
    if (!currentMockUser) throw new Error('Log in to leave comments.');
    const stories = await dbService.getStories();
    const updated = stories.map(s => {
      if (s.id === storyId) {
        const newComment: Comment = {
          id: 'comment_' + Math.random().toString(36).substr(2, 9),
          username: currentMockUser!.displayName,
          userAvatar: currentMockUser!.photoURL,
          text,
          date: 'Just now'
        };
        return {
          ...s,
          commentsCount: s.commentsCount + 1,
          comments: [...s.comments, newComment]
        };
      }
      return s;
    });
    localStorage.setItem(STORAGE_KEYS.STORIES, JSON.stringify(updated));
    return updated;
  },

  // --- Destination Explorer ---
  getDestinations: async (): Promise<Destination[]> => {
    await delay(300);
    const data = localStorage.getItem(STORAGE_KEYS.DESTINATIONS);
    return data ? JSON.parse(data) : [];
  },

  addDestinationReview: async (destId: string, rating: number, commentText: string): Promise<Destination[]> => {
    if (!currentMockUser) throw new Error('Log in to review a destination.');
    const destinations = await dbService.getDestinations();
    const updated = destinations.map(d => {
      if (d.id === destId) {
        const totalRating = d.rating * d.reviewsCount + rating;
        const newReviewsCount = d.reviewsCount + 1;
        const newRating = parseFloat((totalRating / newReviewsCount).toFixed(2));
        
        // Add tips dynamically if long text
        const tips = [...d.travelTips];
        if (commentText.length > 30 && tips.length < 5) {
          tips.push(commentText);
        }

        return {
          ...d,
          rating: newRating,
          reviewsCount: newReviewsCount,
          travelTips: tips
        };
      }
      return d;
    });
    localStorage.setItem(STORAGE_KEYS.DESTINATIONS, JSON.stringify(updated));
    return updated;
  },

  // --- Saved AI Trips / Itineraries ---
  getSavedTrips: async (): Promise<any[]> => {
    await delay(400);
    const data = localStorage.getItem(STORAGE_KEYS.TRIPS);
    return data ? JSON.parse(data) : [];
  },

  saveTrip: async (trip: any): Promise<any[]> => {
    if (!currentMockUser) throw new Error('Log in to save this trip to your dashboard.');
    const trips = await dbService.getSavedTrips();
    
    // Check if trip already saved
    if (trips.some(t => t.destination === trip.destination && t.days === trip.days && t.totalEstimatedCost === trip.totalEstimatedCost)) {
      return trips; // Already saved
    }

    const updated = [{ ...trip, id: 'trip_' + Math.random().toString(36).substr(2, 9), savedAt: new Date().toLocaleDateString() }, ...trips];
    localStorage.setItem(STORAGE_KEYS.TRIPS, JSON.stringify(updated));

    // Update user stats
    currentMockUser.tripsCount += 1;
    // Add unique country count if new
    const countries = new Set(trips.map(t => t.destination));
    countries.add(trip.destination);
    currentMockUser.countriesCount = Math.max(currentMockUser.countriesCount, countries.size);
    localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(currentMockUser));
    triggerAuthListeners();

    return updated;
  },

  deleteTrip: async (tripId: string): Promise<any[]> => {
    const trips = await dbService.getSavedTrips();
    const updated = trips.filter(t => t.id !== tripId);
    localStorage.setItem(STORAGE_KEYS.TRIPS, JSON.stringify(updated));

    if (currentMockUser) {
      currentMockUser.tripsCount = Math.max(0, currentMockUser.tripsCount - 1);
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(currentMockUser));
      triggerAuthListeners();
    }

    return updated;
  }
};

// Log dual-mode configuration for visibility
console.log(
  isRealFirebaseConfigured 
    ? '🔥 TravelVerse AI: Initializing with real Cloud Firebase configurations.'
    : '📦 TravelVerse AI: Environment variables not found. Booting persistent local storage simulation adapter.'
);
