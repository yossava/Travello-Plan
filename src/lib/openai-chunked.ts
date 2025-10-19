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

/**
 * Validates that the response contains actual itinerary data, not just a conversational message
 */
function validateResponse(response: string): { valid: boolean; reason?: string } {
  // Check for conversational/refusal patterns
  const refusalPatterns = [
    /i will (give|provide|create|send)/i,
    /i'll (give|provide|create|send)/i,
    /let me (give|provide|create|send)/i,
    /i can(not|'t) (give|provide|create)/i,
    /i cannot access/i,
    /as an ai/i,
    /i don't have access/i,
    /sorry/i,
    /unfortunately/i,
  ];

  for (const pattern of refusalPatterns) {
    if (pattern.test(response)) {
      return {
        valid: false,
        reason: `Response appears to be conversational: "${response.substring(0, 100)}..."`,
      };
    }
  }

  // Check if response looks like JSON
  const trimmed = response.trim();
  if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) {
    return {
      valid: false,
      reason: 'Response does not start with JSON structure',
    };
  }

  // Check minimum length (valid itinerary should be substantial)
  if (trimmed.length < 500) {
    return {
      valid: false,
      reason: `Response too short (${trimmed.length} chars), likely not a complete itinerary`,
    };
  }

  return { valid: true };
}

/**
 * Generate itinerary in chunks to avoid timeout and truncation issues
 */
export async function generateItineraryChunked(
  planData: TravelPlanInput,
  planId?: string
): Promise<Prisma.JsonValue> {
  const startTime = Date.now();

  try {
    // Step 1: Generate flights and accommodation (smaller, faster)
    const flightsAndAccommodation = await generateFlightsAndAccommodation(
      planData,
      planId
    );

    // Step 2: Generate daily itinerary in batches
    const dailyItinerary = await generateDailyItinerary(planData, planId);

    // Step 3: Generate budget breakdown and travel info
    const budgetAndInfo = await generateBudgetAndInfo(planData, planId);

    // Combine all parts
    const flightsData = flightsAndAccommodation as Record<string, unknown>;
    const budgetData = budgetAndInfo as Record<string, unknown>;

    const completeItinerary = {
      flights: flightsData.flights,
      accommodation: flightsData.accommodation,
      dailyItinerary: dailyItinerary,
      budgetBreakdown: budgetData.budgetBreakdown,
      travelInfo: budgetData.travelInfo,
    };

    // Log successful chunked generation
    await prisma.openAILog.create({
      data: {
        planId,
        model: 'gpt-4o-chunked',
        prompt: 'Chunked generation - combined',
        systemMessage: 'Multi-part itinerary generation',
        temperature: 0.7,
        maxTokens: 0,
        response: JSON.stringify(completeItinerary).substring(0, 50000), // Store first 50k chars
        status: 'success',
        wasRepaired: false,
        durationMs: Date.now() - startTime,
      },
    });

    return completeItinerary as Prisma.JsonValue;
  } catch (error) {
    const err = error as Error;
    await prisma.openAILog.create({
      data: {
        planId,
        model: 'gpt-4o-chunked',
        prompt: 'Chunked generation failed',
        systemMessage: 'Multi-part itinerary generation',
        temperature: 0.7,
        maxTokens: 0,
        status: 'error',
        errorMessage: err.message,
        wasRepaired: false,
        durationMs: Date.now() - startTime,
      },
    });

    throw error;
  }
}

async function generateFlightsAndAccommodation(
  planData: TravelPlanInput,
  planId?: string
) {
  const prompt = `Generate ONLY the flights and accommodation section for a trip from ${planData.origin.city}, ${planData.origin.country} to ${planData.destination.city}, ${planData.destination.country}.

Departure: ${planData.departureDate.toLocaleDateString()}
Return: ${planData.returnDate.toLocaleDateString()}
Duration: ${planData.duration} days
Travelers: ${planData.travelers.adults} adults, ${planData.travelers.children} children, ${planData.travelers.infants} infants
Budget: ${planData.budget.currency} ${planData.budget.min} - ${planData.budget.max}
Accommodation preference: ${planData.preferences.accommodationTypes.join(', ')}

Return ONLY this JSON structure (no additional text):
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
    "alternatives": [{ /* 2 alternatives */ }]
  }
}`;

  return await callOpenAIWithRetry(
    prompt,
    'Generate flights and accommodation with realistic data for these real locations.',
    planId,
    3
  );
}

async function generateDailyItinerary(
  planData: TravelPlanInput,
  planId?: string
) {
  // Calculate actual dates for the trip
  const startDate = new Date(planData.departureDate);
  const dates = [];
  for (let i = 0; i < planData.duration; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    dates.push(date.toISOString().split('T')[0]);
  }

  const prompt = `Generate a complete daily itinerary for ALL ${planData.duration} days in ${planData.destination.city}, ${planData.destination.country}.

IMPORTANT: You MUST create itineraries for EACH of these ${planData.duration} days:
${dates.map((date, i) => `Day ${i + 1}: ${date}`).join('\n')}

Trip details:
- Purpose: ${planData.preferences.tripPurpose}
- Interests: ${planData.preferences.interests.join(', ')}
- Travel pace: ${planData.preferences.travelPace}
- Dietary restrictions: ${planData.preferences.dietaryRestrictions.join(', ') || 'None'}
${planData.preferences.mustVisitPlaces ? `- Must visit: ${planData.preferences.mustVisitPlaces}` : ''}

Create a detailed hour-by-hour itinerary for EACH day. Return an array with ${planData.duration} day objects:
[
  {
    "day": 1,
    "date": "${dates[0]}",
    "theme": "Arrival & City Introduction",
    "weather": "Expected weather",
    "activities": [
      {
        "time": "09:00",
        "type": "breakfast",
        "title": "Breakfast at [Real Restaurant Name]",
        "description": "Start your day with local cuisine",
        "location": "[Restaurant Name]",
        "address": "[Real Address]",
        "duration": "1h",
        "cost": [realistic number],
        "openingHours": "07:00 - 22:00",
        "travelTimeToNext": "15m",
        "notes": "Try the local specialty"
      },
      // ... more activities for Day 1 (breakfast, morning activities, lunch, afternoon, dinner, evening)
    ],
    "dailyTotal": [sum of all activity costs]
  },
  {
    "day": 2,
    "date": "${dates[1] || 'YYYY-MM-DD'}",
    "theme": "Different theme for Day 2",
    "weather": "Expected weather",
    "activities": [
      // ... complete activities for Day 2
    ],
    "dailyTotal": [number]
  }
  // ... continue for ALL ${planData.duration} days
]

CRITICAL: Generate itineraries for ALL ${planData.duration} days. Each day should have 6-8 activities covering breakfast, morning attractions, lunch, afternoon activities, dinner, and evening plans. Use real venue names and addresses in ${planData.destination.city}.`;

  const result = await callOpenAIWithRetry(
    prompt,
    `You MUST generate itineraries for ALL ${planData.duration} days. Create realistic daily plans with real venues in ${planData.destination.city}. Each day should have a different theme and mix of activities based on the user's interests: ${planData.preferences.interests.join(', ')}.`,
    planId,
    3
  );

  return result;
}

async function generateBudgetAndInfo(
  planData: TravelPlanInput,
  planId?: string
) {
  const prompt = `Generate ONLY the budget breakdown and travel information for a trip to ${planData.destination.city}, ${planData.destination.country}.

Total budget: ${planData.budget.currency} ${planData.budget.min} - ${planData.budget.max}
Duration: ${planData.duration} days
Travelers: ${planData.travelers.adults} adults, ${planData.travelers.children} children, ${planData.travelers.infants} infants

Return ONLY this JSON structure:
{
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
}`;

  return await callOpenAIWithRetry(
    prompt,
    'Generate accurate budget and travel information for this destination.',
    planId,
    3
  );
}

async function callOpenAIWithRetry(
  prompt: string,
  systemMessage: string,
  planId: string | undefined,
  maxRetries: number
): Promise<Prisma.JsonValue> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const startTime = Date.now();

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 8000,
        response_format: { type: 'json_object' },
      });

      const response = completion.choices[0].message.content;
      if (!response) {
        throw new Error('No response from OpenAI');
      }

      // Validate response
      const validation = validateResponse(response);
      if (!validation.valid) {
        throw new Error(`Invalid response: ${validation.reason}`);
      }

      const durationMs = Date.now() - startTime;

      // Try to parse
      try {
        const parsed = JSON.parse(response);

        // Log success
        await prisma.openAILog.create({
          data: {
            planId,
            model: 'gpt-4o',
            prompt: prompt.substring(0, 10000),
            systemMessage,
            temperature: 0.7,
            maxTokens: 8000,
            response: response.substring(0, 50000),
            completionTokens: completion.usage?.completion_tokens,
            promptTokens: completion.usage?.prompt_tokens,
            totalTokens: completion.usage?.total_tokens,
            status: 'success',
            wasRepaired: false,
            durationMs,
          },
        });

        return parsed;
      } catch (parseError) {
        // Try repair
        const repaired = repairJSON(response);
        const parsed = JSON.parse(repaired);

        await prisma.openAILog.create({
          data: {
            planId,
            model: 'gpt-4o',
            prompt: prompt.substring(0, 10000),
            systemMessage,
            temperature: 0.7,
            maxTokens: 8000,
            response: repaired.substring(0, 50000),
            completionTokens: completion.usage?.completion_tokens,
            promptTokens: completion.usage?.prompt_tokens,
            totalTokens: completion.usage?.total_tokens,
            status: 'success',
            parseError: (parseError as Error).message,
            wasRepaired: true,
            durationMs,
          },
        });

        return parsed;
      }
    } catch (error) {
      lastError = error as Error;

      // Log failed attempt
      await prisma.openAILog.create({
        data: {
          planId,
          model: 'gpt-4o',
          prompt: prompt.substring(0, 10000),
          systemMessage,
          temperature: 0.7,
          maxTokens: 8000,
          status: 'error',
          errorMessage: `Attempt ${attempt}/${maxRetries}: ${lastError.message}`,
          wasRepaired: false,
        },
      });

      if (attempt < maxRetries) {
        // Exponential backoff: 2s, 4s, 8s
        const backoffMs = Math.pow(2, attempt) * 1000;
        await new Promise((resolve) => setTimeout(resolve, backoffMs));
      }
    }
  }

  throw new Error(
    `Failed after ${maxRetries} attempts. Last error: ${lastError?.message}`
  );
}

function repairJSON(jsonString: string): string {
  let repaired = jsonString.trim();

  // Remove markdown code blocks if present
  repaired = repaired.replace(/^```json\s*/i, '').replace(/\s*```$/, '');

  // Fix trailing commas
  repaired = repaired.replace(/,(\s*[}\]])/g, '$1');

  // Handle truncated strings
  const lastQuote = repaired.lastIndexOf('"');
  if (lastQuote > 0) {
    const beforeLastQuote = repaired.substring(0, lastQuote);
    const quoteCount = (beforeLastQuote.match(/"/g) || []).length;

    if (quoteCount % 2 === 0) {
      repaired = repaired.substring(0, lastQuote);
      repaired = repaired.replace(/[,:]\s*$/, '');
    }
  }

  // Remove incomplete key-value pairs
  repaired = repaired.replace(/,?\s*"[^"]*"\s*:\s*$/g, '');
  repaired = repaired.replace(/,?\s*"[^"]*"\s*:\s*[a-z0-9]*$/gi, '');

  // Close open braces/brackets
  const openBraces = (repaired.match(/{/g) || []).length;
  const closeBraces = (repaired.match(/}/g) || []).length;
  const openBrackets = (repaired.match(/\[/g) || []).length;
  const closeBrackets = (repaired.match(/]/g) || []).length;

  repaired = repaired.replace(/,\s*$/, '');

  for (let i = 0; i < openBrackets - closeBrackets; i++) {
    repaired += '\n]';
  }
  for (let i = 0; i < openBraces - closeBraces; i++) {
    repaired += '\n}';
  }

  repaired = repaired.replace(/,(\s*[}\]])/g, '$1');

  return repaired;
}
