export interface TravelPlanFormData {
  planName: string;
  origin: {
    country: string;
    city: string;
  };
  destination: {
    country: string;
    city: string;
  };
  departureDate: string;
  returnDate: string;
  duration: number;
  travelers: {
    adults: number;
    children: number;
    infants: number;
  };
  budget: {
    currency: string;
    min: number;
    max: number;
  };
  preferences: {
    tripPurpose: string;
    accommodationTypes: string[];
    interests: string[];
    travelPace: string;
    dietaryRestrictions: string[];
    mustVisitPlaces?: string;
    specialRequirements?: string;
  };
}

export const TRIP_PURPOSES = [
  'Leisure/Vacation',
  'Business',
  'Adventure',
  'Romance/Honeymoon',
  'Family',
  'Solo Travel',
  'Cultural Exploration',
  'Wellness/Spa',
];

export const ACCOMMODATION_TYPES = [
  'Hotel',
  'Resort',
  'Boutique Hotel',
  'Hostel',
  'Airbnb/Vacation Rental',
  'Guesthouse',
  'Camping',
  'Luxury Villa',
];

export const INTERESTS = [
  'Beaches',
  'Mountains',
  'Historical Sites',
  'Museums & Art',
  'Food & Cuisine',
  'Nightlife',
  'Shopping',
  'Wildlife & Nature',
  'Adventure Sports',
  'Water Activities',
  'Photography',
  'Local Culture',
  'Architecture',
  'Festivals & Events',
];

export const TRAVEL_PACE = ['Relaxed', 'Moderate', 'Fast-paced'];

export const DIETARY_RESTRICTIONS = [
  'None',
  'Vegetarian',
  'Vegan',
  'Halal',
  'Kosher',
  'Gluten-Free',
  'Dairy-Free',
  'Nut Allergy',
  'Seafood Allergy',
];

export const CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
];
