import OpenAI from 'openai';
import { prisma } from './prisma';
import { Prisma } from '@prisma/client';

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

export async function generateItinerary(planData: TravelPlanInput, planId?: string): Promise<Prisma.JsonValue> {
  const startTime = Date.now();
  const prompt = constructPrompt(planData);
  const systemMessage = 'You are an expert travel planner with deep knowledge of destinations worldwide. Create detailed, personalized travel itineraries with realistic recommendations, pricing, and schedules.';
  const model = 'gpt-4o';
  const temperature = 0.7;
  const maxTokens = 6000;

  let logId: string | undefined;
  let completion: OpenAI.Chat.Completions.ChatCompletion;
  let response: string | null = null;
  let parsedResponse: Prisma.JsonValue;
  let wasRepaired = false;
  let parseError: string | undefined;

  try {
    // Call OpenAI API
    completion = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: 'system',
          content: systemMessage,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature,
      max_tokens: maxTokens,
      response_format: { type: 'json_object' },
    });

    response = completion.choices[0].message.content;
    if (!response) {
      throw new Error('No response from OpenAI');
    }

    const durationMs = Date.now() - startTime;

    // Try to parse the response
    try {
      parsedResponse = JSON.parse(response);

      // Log successful request
      const log = await prisma.openAILog.create({
        data: {
          planId,
          model,
          prompt,
          systemMessage,
          temperature,
          maxTokens,
          response,
          completionTokens: completion.usage?.completion_tokens,
          promptTokens: completion.usage?.prompt_tokens,
          totalTokens: completion.usage?.total_tokens,
          status: 'success',
          wasRepaired: false,
          durationMs,
        },
      });
      logId = log.id;

      return parsedResponse;
    } catch (jsonError) {
      // JSON parsing failed - try to repair
      const error = jsonError as Error;
      parseError = error.message;
      // eslint-disable-next-line no-console
      console.error('JSON parse error:', error.message);
      // eslint-disable-next-line no-console
      console.error('Response preview:', response.substring(0, 500));

      // Attempt to repair the JSON
      const repairedResponse = repairJSON(response);

      try {
        parsedResponse = JSON.parse(repairedResponse);
        wasRepaired = true;

        // Log repaired successful request
        const log = await prisma.openAILog.create({
          data: {
            planId,
            model,
            prompt,
            systemMessage,
            temperature,
            maxTokens,
            response: repairedResponse,
            completionTokens: completion.usage?.completion_tokens,
            promptTokens: completion.usage?.prompt_tokens,
            totalTokens: completion.usage?.total_tokens,
            status: 'success',
            parseError,
            wasRepaired: true,
            durationMs: Date.now() - startTime,
          },
        });
        logId = log.id;

        // eslint-disable-next-line no-console
        console.log('JSON repaired successfully');
        return parsedResponse;
      } catch (repairError) {
        // Still failed after repair - log and throw
        const repairErr = repairError as Error;
        const log = await prisma.openAILog.create({
          data: {
            planId,
            model,
            prompt,
            systemMessage,
            temperature,
            maxTokens,
            response,
            completionTokens: completion.usage?.completion_tokens,
            promptTokens: completion.usage?.prompt_tokens,
            totalTokens: completion.usage?.total_tokens,
            status: 'error',
            parseError: `Original: ${error.message}, Repair failed: ${repairErr.message}`,
            wasRepaired: false,
            durationMs: Date.now() - startTime,
          },
        });
        logId = log.id;

        throw new Error(`Failed to parse OpenAI response even after repair. Log ID: ${logId}. Error: ${error.message}`);
      }
    }
  } catch (error) {
    // API call failed or other error
    const err = error as Error;
    const durationMs = Date.now() - startTime;

    await prisma.openAILog.create({
      data: {
        planId,
        model,
        prompt,
        systemMessage,
        temperature,
        maxTokens,
        response: response || null,
        status: 'error',
        errorMessage: err.message,
        parseError,
        wasRepaired,
        durationMs,
      },
    });

    throw error;
  }
}

/**
 * Attempts to repair malformed JSON by fixing common issues
 */
function repairJSON(jsonString: string): string {
  let repaired = jsonString;

  // Remove any leading/trailing whitespace
  repaired = repaired.trim();

  // Remove markdown code blocks if present
  repaired = repaired.replace(/^```json\s*/i, '').replace(/\s*```$/, '');

  // Fix trailing commas in objects and arrays
  repaired = repaired.replace(/,(\s*[}\]])/g, '$1');

  // Fix missing commas between array/object elements
  repaired = repaired.replace(/}(\s*){/g, '},\n{');
  repaired = repaired.replace(/](\s*)\[/g, '],\n[');

  // Fix unescaped quotes in strings (basic attempt)
  // This is tricky and may not catch all cases

  // Try to fix truncated JSON by closing open braces/brackets
  const openBraces = (repaired.match(/{/g) || []).length;
  const closeBraces = (repaired.match(/}/g) || []).length;
  const openBrackets = (repaired.match(/\[/g) || []).length;
  const closeBrackets = (repaired.match(/]/g) || []).length;

  // Add missing closing braces
  for (let i = 0; i < openBraces - closeBraces; i++) {
    repaired += '\n}';
  }

  // Add missing closing brackets
  for (let i = 0; i < openBrackets - closeBrackets; i++) {
    repaired += '\n]';
  }

  // Remove incomplete key-value pairs at the end
  // Look for patterns like: "key": "value (incomplete)
  repaired = repaired.replace(/,?\s*"[^"]*":\s*"[^"]*$/g, '');
  repaired = repaired.replace(/,?\s*"[^"]*":\s*[^,}\]]*$/g, '');

  // Ensure the string ends properly
  if (!repaired.endsWith('}') && !repaired.endsWith(']')) {
    // Find the last valid closing character
    const lastBrace = repaired.lastIndexOf('}');
    const lastBracket = repaired.lastIndexOf(']');
    const lastValid = Math.max(lastBrace, lastBracket);

    if (lastValid > 0) {
      repaired = repaired.substring(0, lastValid + 1);
    }
  }

  return repaired;
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
