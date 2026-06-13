export interface ItineraryDay {
  day: number;
  title: string;
  activities: {
    morning: { title: string; cost: number; description: string };
    afternoon: { title: string; cost: number; description: string };
    evening: { title: string; cost: number; description: string };
  };
  meals: {
    breakfast: string;
    lunch: string;
    dinner: string;
  };
  dailyExpense: number;
}

export interface GeneratedPlan {
  destination: string;
  days: number;
  totalEstimatedCost: number;
  transportCost: number;
  accommodationCost: number;
  foodCost: number;
  activitiesCost: number;
  dailyItinerary: ItineraryDay[];
}

// Pre-defined activities based on categories for dynamic generation
const activityTemplates = {
  adventure: [
    { title: 'Whitewater Rafting', desc: 'Navigate through thrilling class II-III rapids along scenic gorges.', avgCost: 35 },
    { title: 'Zip-lining & Canopy Tour', desc: 'Soar above tropical treetops and view the valley from a birds-eye view.', avgCost: 40 },
    { title: 'Sunrise Mountain Hike', desc: 'Pre-dawn trek up to the summit to watch a spectacular sunrise above the clouds.', avgCost: 20 },
    { title: 'Scuba Diving Tour', desc: 'Explore vibrant coral reefs and marine life under professional guidance.', avgCost: 65 },
    { title: 'Quad Biking/ATV Trail', desc: 'Ride through local villages, forests, and mud tracks on an ATV.', avgCost: 45 }
  ],
  culture: [
    { title: 'Historical Temple Tour', desc: 'Visit UNESCO heritage temples and admire the ancient stone architecture.', avgCost: 15 },
    { title: 'Traditional Craft Workshop', desc: 'Learn to carve wood, paint batik, or forge silver jewelry from local artisans.', avgCost: 25 },
    { title: 'Museum & Art Gallery Visit', desc: 'Explore historical relics and modern art displays explaining national heritage.', avgCost: 12 },
    { title: 'Culinary Walking Tour', desc: 'Walk through historic markets tasting local spices and age-old recipes.', avgCost: 30 },
    { title: 'Traditional Dance Performance', desc: 'Attend a mesmerizing evening musical play showing local legends.', avgCost: 18 }
  ],
  nature: [
    { title: 'Botanical Gardens Walk', desc: 'Stroll through lush paths featuring rare orchids and ancient trees.', avgCost: 8 },
    { title: 'Hidden Waterfall Trek', desc: 'Hike through bamboo forests to swim in a secluded pool beneath a giant fall.', avgCost: 10 },
    { title: 'Wildlife Sanctuary Visit', desc: 'See rescued animals and learn about local conservation efforts.', avgCost: 22 },
    { title: 'Scenic Lake Cruise', desc: 'Relax on a solar-powered boat ride surrounded by mist-capped mountains.', avgCost: 25 },
    { title: 'Sunset Coastline Walk', desc: 'Stroll along towering cliffs overlooking the crushing ocean waves.', avgCost: 0 }
  ],
  food: [
    { title: 'Gourmet Dining Experience', desc: 'Indulge in a multi-course fusion menu prepared by a award-winning chef.', avgCost: 80 },
    { title: 'Street Food Crawl', desc: 'Savor regional specialties, sweet treats, and local beers in a bustling night market.', avgCost: 15 },
    { title: 'Coffee Plantation Tour', desc: 'Taste freshly brewed single-origin roasts and learn about farming methods.', avgCost: 10 },
    { title: 'Local Cooking Class', desc: 'Shop for fresh ingredients at the market and cook a traditional 3-course meal.', avgCost: 35 },
    { title: 'Winery & Vineyard Tour', desc: 'Walk through grape vines and taste vintage reserves paired with local cheeses.', avgCost: 50 }
  ],
  city: [
    { title: 'Panoramic Observation Deck', desc: 'Take a high-speed elevator to the 80th floor for spectacular skyline views.', avgCost: 25 },
    { title: 'Shopping District Tour', desc: 'Browse through flagship designer boutiques and futuristic gadget stores.', avgCost: 0 },
    { title: 'Historic Old Town Walk', desc: 'Wander through narrow cobblestone streets and listen to historical tales.', avgCost: 5 },
    { title: 'Double-Decker Bus Tour', desc: 'Hop-on hop-off exploration of the city’s major monuments and squares.', avgCost: 28 },
    { title: 'Nighttime Neon Walk', desc: 'Explore vibrant lanes filled with neon billboards, clubs, and karaoke dens.', avgCost: 0 }
  ]
};

const mealsTemplates = {
  breakfast: ['Locally brewed coffee & fresh fruit bowls', 'Continental buffet at the hotel', 'Traditional pastries at a corner bakery', 'Savory local breakfast wraps'],
  lunch: ['Fresh seafood grill by the shore', 'Organic farm-to-table bistro salad', 'Authentic street food noodle bowls', 'Cosy cafe sandwich and smoothie'],
  dinner: ['Traditional candle-lit feast with live music', 'Fine dining fusion restaurant', 'Vibrant local night market specialties', 'Bayside sunset barbecue']
};

export const generateItinerary = (
  destination: string,
  days: number,
  budget: number,
  interests: string[],
  transport: string
): GeneratedPlan => {
  const selectedInterests = interests.length > 0 ? interests : ['culture', 'nature'];
  const formattedDestination = destination.charAt(0).toUpperCase() + destination.slice(1);

  // Set multipliers based on transport
  let transportCost = 150;
  if (transport.toLowerCase() === 'flight') transportCost = 450;
  if (transport.toLowerCase() === 'train') transportCost = 100;
  if (transport.toLowerCase() === 'car') transportCost = 80;

  // Estimate per-day rates based on budget slider (total budget divided by days)
  const availableDailyBudget = Math.max(30, (budget - transportCost) / days);
  
  // Apportion rates
  let accommodationRate = 35;
  let foodRate = 20;

  if (availableDailyBudget > 150) {
    accommodationRate = 120;
    foodRate = 50;
  } else if (availableDailyBudget > 80) {
    accommodationRate = 60;
    foodRate = 30;
  }

  const dailyItinerary: ItineraryDay[] = [];
  let currentDay = 1;

  while (currentDay <= days) {
    // Select activity categories matching user interests
    const category1 = selectedInterests[(currentDay - 1) % selectedInterests.length] as keyof typeof activityTemplates;
    const category2 = selectedInterests[currentDay % selectedInterests.length] as keyof typeof activityTemplates;
    
    // Pick activities from lists
    const morningPool = activityTemplates[category1] || activityTemplates.nature;
    const afternoonPool = activityTemplates[category2] || activityTemplates.city;
    const eveningPool = activityTemplates.food;

    const morningAct = morningPool[Math.floor(Math.random() * morningPool.length)];
    const afternoonAct = afternoonPool[Math.floor(Math.random() * afternoonPool.length)];
    const eveningAct = eveningPool[Math.floor(Math.random() * eveningPool.length)];

    const morningCost = Math.round(morningAct.avgCost * (availableDailyBudget / 100));
    const afternoonCost = Math.round(afternoonAct.avgCost * (availableDailyBudget / 100));
    const eveningCost = Math.round(eveningAct.avgCost * (availableDailyBudget / 100));

    const breakfast = mealsTemplates.breakfast[currentDay % mealsTemplates.breakfast.length];
    const lunch = mealsTemplates.lunch[(currentDay + 1) % mealsTemplates.lunch.length];
    const dinner = mealsTemplates.dinner[(currentDay + 2) % mealsTemplates.dinner.length];

    const dailyExpense = foodRate + morningCost + afternoonCost + eveningCost;

    dailyItinerary.push({
      day: currentDay,
      title: `Exploring ${formattedDestination} - Day ${currentDay}`,
      activities: {
        morning: {
          title: morningAct.title,
          cost: morningCost,
          description: morningAct.desc
        },
        afternoon: {
          title: afternoonAct.title,
          cost: afternoonCost,
          description: afternoonAct.desc
        },
        evening: {
          title: eveningAct.title,
          cost: eveningCost,
          description: eveningAct.desc
        }
      },
      meals: { breakfast, lunch, dinner },
      dailyExpense
    });

    currentDay++;
  }

  const accommodationCost = accommodationRate * days;
  const foodCost = foodRate * days;
  const activitiesCost = dailyItinerary.reduce(
    (sum, d) => sum + d.activities.morning.cost + d.activities.afternoon.cost + d.activities.evening.cost, 
    0
  );

  const totalEstimatedCost = transportCost + accommodationCost + foodCost + activitiesCost;

  return {
    destination: formattedDestination,
    days,
    totalEstimatedCost,
    transportCost,
    accommodationCost,
    foodCost,
    activitiesCost,
    dailyItinerary
  };
};

export const askTravelAssistant = (question: string): string => {
  const query = question.toLowerCase();

  if (query.includes('pack') || query.includes('what should i bring')) {
    return `Based on TravelVerse AI predictions, here is your essential packing list:\n\n` +
      `🎒 **Core Gear:** Universal power adapter, portable power bank, reusable water bottle, secure money belt.\n` +
      `🧴 **Hygiene & Protection:** Broad-spectrum SPF 50 sunscreen, insect repellent, travel-sized toiletries, first-aid kit.\n` +
      `📁 **Documents:** Passport copy (offline digital & physical), travel insurance details, credit cards, emergency contact list.\n\n` +
      `*Tip: Roll your clothes instead of folding them to save 30% more bag space!*`;
  }

  if (query.includes('budget') || query.includes('cheap') || query.includes('save money')) {
    return `Saving money while traveling is all about local choices! Here are our top AI-generated budgeting tips:\n\n` +
      `1. **Eat Like a Local:** Skip restaurants with tourist menus. Instead, hunt for street stalls or local bistros (e.g. Warungs in Indonesia, Trattorias in Italy) where locals queue up.\n` +
      `2. **Public Transit & Walking:** Download local transport apps (like Citymapper or local rail apps) and avoid private taxis.\n` +
      `3. **Travel Off-Peak:** Traveling in the "shoulder season" (right before or after summer/holidays) can slash flight and hotel prices by up to 50%.\n` +
      `4. **Free Walking Tours:** Look for local free walking tours to orient yourself and gather local tips (remember to tip the guide!).`;
  }

  if (query.includes('bali')) {
    return `🏝️ **Bali Insights:** Bali is fantastic, but highly crowded in hotspots like Seminyak and Canggu. \n\n` +
      `For a premium experience, head north to Lovina for dolphin watching and black sand beaches, or east to Sidemen for pristine emerald rice paddies untouched by heavy tourism. \n\n` +
      `**Best time:** May to September has low humidity and cooling sea breezes.`;
  }

  if (query.includes('tokyo') || query.includes('japan')) {
    return `🇯🇵 **Tokyo Insights:** Tokyo is a marvelous blend of neon lights and ancient traditions. \n\n` +
      `Don't miss the Shibuya Crossing at night, but also take a quiet stroll through Meiji Shrine. \n\n` +
      `**Food Tip:** Order ramen from ticket vending machines inside train stations—it is cheap, fast, and often the best you will ever taste!`;
  }

  if (query.includes('paris') || query.includes('france')) {
    return `🗼 **Paris Insights:** Paris is beautiful, but requires planning. \n\n` +
      `Pre-book museum entries (especially the Louvre and Eiffel Tower) weeks in advance. \n\n` +
      `**Local Secret:** Buy fresh cheese, a baguette, and grapes from local markets, and enjoy a premium picnic by the Seine River at sunset.`;
  }

  if (query.includes('recommend') || query.includes('suggest') || query.includes('where should i go')) {
    return `Here are three top recommended destinations based on trending world searches:\n\n` +
      `⛰️ **Swiss Alps, Switzerland** - Perfect for active hikers, skiers, and nature lovers seeking dramatic scenery.\n` +
      `🌊 **Bali, Indonesia** - Ideal for beach relaxation, surfing, yoga retreats, and cultural immersion.\n` +
      `🏙️ **Tokyo, Japan** - Best for tech enthusiasts, food lovers (ramen, sushi), and city explorers seeking ultra-modern infrastructure.`;
  }

  return `I've analyzed your question: "${question}". \n\n` +
    `To give you the most accurate answer, I recommend checking out our **Destination Explorer** page, where we detail estimated budgets, best visiting seasons, traveler ratings, and local survival tips. \n\n` +
    `Is there a specific destination, packing query, or budget calculation you'd like me to assist you with?`;
};

export const generateCaption = (tags: string, tone: string): string => {
  const list = tags.split(',').map(t => t.trim()).filter(Boolean);
  const mainTag = list[0] || 'Travel';
  const hashtags = list.map(t => `#${t.replace(/\s+/g, '')}`).join(' ');

  switch (tone) {
    case 'cinematic':
      return `Chasing horizons where time stands still. There's a story around every corner, waiting to be lived. ✨ ${mainTag} diaries. ${hashtags} #wanderlust #storyteller`;
    case 'funny':
      return `My passport is screaming for help and my bank account is crying, but hey, look at this view! ✈️😂 ${hashtags} #brokeButHappy #travelproblems`;
    case 'informative':
      return `Quick guide to ${mainTag}: 1. Arrive early to beat the crowds, 2. Keep cash handy for local vendors, 3. Pack light! Saving this memory forever. 📌 Save for your next trip! ${hashtags}`;
    case 'poetic':
      return `Wandering into the golden hours, where the sky paints dreams over the oceans. 🌅 Let the journey fold itself into your soul. ${hashtags} #innerpeace #explore`;
    default:
      return `Exploring the beautiful streets of ${mainTag}! Absolutely in love with this place. 🗺️❤️ ${hashtags} #travelverse #instatravel`;
  }
};

export const applyPhotoFilter = (filter: string): string => {
  // Simulates css filter style return values
  switch (filter) {
    case 'vintage':
      return 'sepia(0.6) contrast(1.1) brightness(0.95) saturate(0.8)';
    case 'cinematic':
      return 'contrast(1.2) saturate(1.1) hue-rotate(-10deg) brightness(0.9)';
    case 'cyberpunk':
      return 'saturate(1.8) hue-rotate(140deg) contrast(1.1)';
    case 'monochrome':
      return 'grayscale(1) contrast(1.3) brightness(0.95)';
    case 'dreamy':
      return 'brightness(1.1) saturate(1.2) blur(0.3px) contrast(0.9)';
    default:
      return 'none';
  }
};
