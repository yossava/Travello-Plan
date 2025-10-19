import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface TravelPlanInput {
  origin: { country: string; city: string };
  destination: { country: string; city: string };
  departureDate: Date;
  returnDate: Date;
  duration: number;
  travelers: { adults: number; children: number; infants: number };
  budget: { currency: string; min: number; max: number };
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

export async function generateItinerary(planData: TravelPlanInput) {
  const prompt = constructPrompt(planData);

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content:
          'You are an expert travel planner with deep knowledge of destinations worldwide. Create detailed, personalized travel itineraries with realistic recommendations, pricing, and schedules.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.7,
    max_tokens: 6000,
    response_format: { type: 'json_object' },
  });

  const response = completion.choices[0].message.content;
  if (!response) {
    throw new Error('No response from OpenAI');
  }

  return JSON.parse(response);
}

function constructPrompt(planData: TravelPlanInput): string {
  const totalTravelers =
    planData.travelers.adults +
    planData.travelers.children +
    planData.travelers.infants;

  const departureDate = new Date(planData.departureDate).toLocaleDateString(
    'en-US',
    {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
  );

  const returnDate = new Date(planData.returnDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return `Create a comprehensive travel itinerary with the following details:

**Trip Information:**
- Origin: ${planData.origin.city}, ${planData.origin.country}
- Destination: ${planData.destination.city}, ${planData.destination.country}
- Departure: ${departureDate}
- Return: ${returnDate}
- Duration: ${planData.duration} days
- Travelers: ${totalTravelers} people (${planData.travelers.adults} adults${planData.travelers.children > 0 ? `, ${planData.travelers.children} children` : ''}${planData.travelers.infants > 0 ? `, ${planData.travelers.infants} infants` : ''})
- Budget: ${planData.budget.currency} ${planData.budget.min.toLocaleString()} - ${planData.budget.max.toLocaleString()}

**Preferences:**
- Purpose: ${planData.preferences.tripPurpose}
- Accommodation: ${planData.preferences.accommodationTypes.join(', ')}
- Interests: ${planData.preferences.interests.join(', ')}
- Travel Pace: ${planData.preferences.travelPace}
${planData.preferences.dietaryRestrictions.length > 0 ? `- Dietary Restrictions: ${planData.preferences.dietaryRestrictions.join(', ')}` : ''}
${planData.preferences.mustVisitPlaces ? `- Must Visit: ${planData.preferences.mustVisitPlaces}` : ''}
${planData.preferences.specialRequirements ? `- Special Requirements: ${planData.preferences.specialRequirements}` : ''}

Please create a detailed itinerary in the following JSON structure:

{
  "flights": {
    "outbound": {
      "airline": "string",
      "flightNumber": "string",
      "departure": { "airport": "string", "time": "HH:MM", "terminal": "string" },
      "arrival": { "airport": "string", "time": "HH:MM", "terminal": "string" },
      "duration": "string",
      "class": "string",
      "estimatedCost": number,
      "layovers": [{ "airport": "string", "duration": "string" }],
      "bookingTips": "string"
    },
    "return": { /* same structure */ }
  },
  "accommodation": {
    "primary": {
      "name": "string",
      "type": "string",
      "address": "string",
      "checkIn": "date",
      "checkOut": "date",
      "nights": number,
      "pricePerNight": number,
      "totalCost": number,
      "amenities": ["string"],
      "proximityToAttractions": "string",
      "whyRecommended": "string"
    },
    "alternatives": [{ /* 2-3 alternatives with similar structure */ }]
  },
  "dailyItinerary": [
    {
      "day": 1,
      "date": "date",
      "theme": "string",
      "weather": "string",
      "activities": [
        {
          "time": "HH:MM",
          "type": "string", // breakfast, attraction, lunch, activity, dinner, etc.
          "title": "string",
          "description": "string",
          "location": "string",
          "address": "string",
          "duration": "string",
          "cost": number,
          "openingHours": "string",
          "travelTimeToNext": "string",
          "notes": "string"
        }
      ],
      "dailyTotal": number
    }
  ],
  "budgetBreakdown": {
    "flights": number,
    "accommodation": number,
    "food": number,
    "activities": number,
    "transportation": number,
    "shopping": number,
    "emergencyFund": number,
    "total": number,
    "perPerson": number,
    "dailyAverage": number
  },
  "travelInfo": {
    "visaRequirements": "string",
    "healthAndSafety": "string",
    "currency": { "name": "string", "exchangeRate": "string", "tips": "string" },
    "language": { "primary": "string", "usefulPhrases": ["string"] },
    "simAndConnectivity": "string",
    "transportation": { "overview": "string", "options": ["string"] },
    "tipping": "string",
    "emergencyContacts": { "police": "string", "ambulance": "string", "embassy": "string" },
    "weather": "string",
    "packingList": ["string"],
    "culturalTips": ["string"]
  }
}

Important guidelines:
1. Use REAL hotel names, restaurant names, and attractions that actually exist in ${planData.destination.city}
2. Provide REALISTIC pricing in ${planData.budget.currency}
3. Create a detailed hour-by-hour schedule for each day
4. Ensure the total budget stays within ${planData.budget.currency} ${planData.budget.min.toLocaleString()} - ${planData.budget.max.toLocaleString()}
5. Consider the travel pace (${planData.preferences.travelPace}) when scheduling activities
6. Include practical tips and local insights
7. Account for travel time between locations
8. Include opening hours for attractions
9. Suggest specific restaurants based on dietary restrictions and preferences
10. Make the itinerary feasible and enjoyable for the specified group

Return ONLY the JSON object, no additional text.`;
}
