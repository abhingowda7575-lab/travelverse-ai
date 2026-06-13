export interface Destination {
  id: string;
  title: string;
  country: string;
  description: string;
  imageUrl: string;
  rating: number;
  reviewsCount: number;
  budgetLevel: '$' | '$$' | '$$$';
  budgetEstimate: number; // Avg cost per day in USD
  bestTime: string;
  travelTips: string[];
  category: 'beach' | 'city' | 'nature' | 'culture' | 'adventure';
  coordinates: { lat: number; lng: number };
}

export interface Comment {
  id: string;
  username: string;
  userAvatar: string;
  text: string;
  date: string;
}

export interface TravelStory {
  id: string;
  username: string;
  userAvatar: string;
  content: string;
  mediaType: 'photo' | 'video';
  mediaUrl: string;
  likesCount: number;
  commentsCount: number;
  comments: Comment[];
  location: string;
  isLiked: boolean;
  isSaved: boolean;
  date: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  feedback: string;
  avatar: string;
  rating: number;
}

export const destinationsData: Destination[] = [
  {
    id: 'bali',
    title: 'Bali',
    country: 'Indonesia',
    description: 'A tropical paradise known for its forested volcanic mountains, iconic rice paddies, beaches, and coral reefs.',
    imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewsCount: 1240,
    budgetLevel: '$$',
    budgetEstimate: 75,
    bestTime: 'April to October',
    travelTips: [
      'Rent a scooter for cheap and flexible transportation.',
      'Dress respectfully when visiting Hindu temples (cover shoulders and knees).',
      'Try the local street food (Warungs) for authentic and budget-friendly meals.'
    ],
    category: 'beach',
    coordinates: { lat: -8.409518, lng: 115.188916 }
  },
  {
    id: 'paris',
    title: 'Paris',
    country: 'France',
    description: 'The global center for art, fashion, gastronomy, and culture, famed for its 19th-century cityscape and the Eiffel Tower.',
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    rating: 4.6,
    reviewsCount: 3120,
    budgetLevel: '$$$',
    budgetEstimate: 180,
    bestTime: 'June to August or September to October',
    travelTips: [
      'Buy a Paris Museum Pass to save money and bypass long ticket lines.',
      'Learn basic French greetings (Bonjour, Merci) to improve local interactions.',
      'Use the Metro (subway) as it is highly efficient and covers the entire city.'
    ],
    category: 'culture',
    coordinates: { lat: 48.856614, lng: 2.352222 }
  },
  {
    id: 'tokyo',
    title: 'Tokyo',
    country: 'Japan',
    description: 'Japan’s bustling capital, mixing ultra-modern neon skyscrapers with historic temples and shrines.',
    imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewsCount: 2450,
    budgetLevel: '$$$',
    budgetEstimate: 150,
    bestTime: 'March to April (cherry blossoms) or September to November',
    travelTips: [
      'Get a Suica or Pasmo IC card for seamless train rides and convenience store purchases.',
      'Rent a pocket Wi-Fi or buy an eSIM before arriving.',
      'Keep your trash with you, as public garbage cans are extremely rare.'
    ],
    category: 'city',
    coordinates: { lat: 35.676192, lng: 139.650311 }
  },
  {
    id: 'cairo',
    title: 'Cairo',
    country: 'Egypt',
    description: 'Home to the iconic Giza Pyramid complex and the Great Sphinx, Cairo is steeped in ancient civilization and vibrant markets.',
    imageUrl: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=800&q=80',
    rating: 4.5,
    reviewsCount: 890,
    budgetLevel: '$',
    budgetEstimate: 45,
    bestTime: 'October to April',
    travelTips: [
      'Hire a local guide to get the most history out of your pyramid visits.',
      'Always agree on taxi fares or use ride-hailing apps like Uber before starting a trip.',
      'Prepare to bargain in the Khan el-Khalili bazaar.'
    ],
    category: 'culture',
    coordinates: { lat: 30.044420, lng: 31.235712 }
  },
  {
    id: 'swiss-alps',
    title: 'Swiss Alps',
    country: 'Switzerland',
    description: 'Stunning alpine scenery, pristine lakes, and world-renowned ski and hiking resorts like Zermatt and St. Moritz.',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewsCount: 1540,
    budgetLevel: '$$$',
    budgetEstimate: 220,
    bestTime: 'June to August (hiking) or December to March (skiing)',
    travelTips: [
      'Use the Swiss Travel System train network—scenic routes are breathtaking.',
      'Tap water in Switzerland is exceptionally clean and drinkable everywhere.',
      'Prepare for cold temperatures at high altitudes even during summer.'
    ],
    category: 'nature',
    coordinates: { lat: 46.558006, lng: 8.535492 }
  },
  {
    id: 'cape-town',
    title: 'Cape Town',
    country: 'South Africa',
    description: 'A port city on South Africa’s southwest coast, dominated by the majestic Table Mountain and beautiful coastal drives.',
    imageUrl: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    reviewsCount: 980,
    budgetLevel: '$$',
    budgetEstimate: 80,
    bestTime: 'November to March',
    travelTips: [
      'Take the cableway or hike up Table Mountain early in the morning for clear views.',
      'Drive along Chapman’s Peak for one of the world’s most scenic coastal routes.',
      'Visit Boulders Beach to see the famous African penguin colony.'
    ],
    category: 'adventure',
    coordinates: { lat: -33.924869, lng: 18.424055 }
  }
];

export const travelStoriesData: TravelStory[] = [
  {
    id: 'story-1',
    username: 'wanderlust_sophie',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    content: 'Sunsets in Bali hit differently! Spent the evening at Uluwatu Temple watching the Kecak Fire Dance. The energy was electric and the view was absolutely breathtaking! 🌅✨',
    mediaType: 'photo',
    mediaUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
    likesCount: 342,
    commentsCount: 2,
    comments: [
      {
        id: 'c1',
        username: 'travel_dan',
        userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        text: 'Ah, I love Uluwatu! Did you check out the monkeys there?',
        date: '2 hours ago'
      },
      {
        id: 'c2',
        username: 'globe_trotter_amy',
        userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
        text: 'This is gorgeous, Sophie! Adding to my itinerary right now!',
        date: '1 hour ago'
      }
    ],
    location: 'Uluwatu, Bali',
    isLiked: false,
    isSaved: true,
    date: '1 day ago'
  },
  {
    id: 'story-2',
    username: 'alex_adventures',
    userAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
    content: 'Woke up at 5 AM to climb Mount Batur and watch the sunrise. It was freezing cold, but standing above the clouds with the volcano smoking in the distance made every step worth it! 🌋🥾',
    mediaType: 'photo',
    mediaUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    likesCount: 521,
    commentsCount: 1,
    comments: [
      {
        id: 'c3',
        username: 'wanderlust_sophie',
        userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
        text: 'Such a rewarding hike! The breakfast cooked on volcanic steam is the best!',
        date: '5 hours ago'
      }
    ],
    location: 'Mount Batur, Indonesia',
    isLiked: true,
    isSaved: false,
    date: '2 days ago'
  },
  {
    id: 'story-3',
    username: 'globe_trotter_amy',
    userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
    content: 'Lost in the magical neon alleys of Shinjuku. Tokyo at night is like stepping straight into a cyberpunk movie! The ramen stalls here smell incredible. 🍜🤖🌌',
    mediaType: 'photo',
    mediaUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?auto=format&fit=crop&w=800&q=80',
    likesCount: 689,
    commentsCount: 2,
    comments: [
      {
        id: 'c4',
        username: 'alex_adventures',
        userAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
        text: 'Tokyo is unmatched! Try Golden Gai if you get a chance!',
        date: 'Yesterday'
      },
      {
        id: 'c5',
        username: 'travel_dan',
        userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        text: 'Stunning capture, Amy!',
        date: 'Yesterday'
      }
    ],
    location: 'Shinjuku, Tokyo',
    isLiked: false,
    isSaved: false,
    date: '3 days ago'
  }
];

export const testimonialsData: Testimonial[] = [
  {
    id: 't1',
    name: 'Sarah Jenkins',
    role: 'Solo Adventure Traveler',
    feedback: 'TravelVerse AI completely changed how I plan my solo trips. The AI Planner gave me a day-by-day itinerary that matched my exact budget and interests. Best travel tool on the web!',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    rating: 5
  },
  {
    id: 't2',
    name: 'David Kojo',
    role: 'Digital Nomad',
    feedback: 'As someone who travels full time, the Budget Calculator and AI Assistant are absolute lifesavers. The design is beautiful and the community feed is highly inspiring!',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    rating: 5
  },
  {
    id: 't3',
    name: 'Elena Rostova',
    role: 'Travel Vlogger',
    feedback: 'The AI photo and video editors allow me to quickly polish my content and generate catchy captions on the go. The UI feels premium and very futuristic.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
    rating: 4.8
  }
];

export const dashboardStatsData = {
  tripsCreated: 8,
  postsUploaded: 12,
  savedDestinations: 15,
  followerCount: 1420,
  followingCount: 382,
  countriesVisited: 14,
  recentTrips: [
    { id: 'rt-1', destination: 'Tokyo, Japan', date: 'Oct 2025', status: 'Completed', budget: 1500 },
    { id: 'rt-2', destination: 'Bali, Indonesia', date: 'Jan 2026', status: 'Completed', budget: 900 },
    { id: 'rt-3', destination: 'Swiss Alps, Switzerland', date: 'Jul 2026', status: 'Upcoming', budget: 2200 }
  ]
};
