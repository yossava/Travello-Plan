import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { destination, days, budget, interests, accommodation, travelers } = await request.json();

    if (!destination) {
      return NextResponse.json(
        { error: 'Destination is required' },
        { status: 400 }
      );
    }

    const interestsText = interests && interests.length > 0
      ? `focusing on ${interests.join(', ')}`
      : '';

    const accommodationText = accommodation ? `with ${accommodation} accommodations` : '';
    const travelersText = travelers > 1 ? `for ${travelers} travelers` : 'for a solo traveler';

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are an enthusiastic travel expert creating engaging previews that make travelers excited and curious. Generate a teaser that highlights unique experiences and creates FOMO (fear of missing out). Return ONLY valid JSON in this exact format:
{
  "highlights": ["highlight1", "highlight2", "highlight3", "highlight4"],
  "mustSee": ["place1", "place2", "place3", "place4", "place5"],
  "hiddenGems": ["gem1", "gem2", "gem3"],
  "budgetTip": "A single concise tip about saving money or getting value",
  "estimatedCost": "Estimated cost range per person (e.g., '$1,500 - $2,500')",
  "bestTimeToVisit": "Best season/months to visit with brief reason (e.g., 'Spring (March-May) for cherry blossoms and mild weather')"
}

Make each item:
- Specific and exciting (not generic)
- Include interesting details that spark curiosity
- Create desire to learn more
- Highlights: max 15 words each, focus on unique experiences
- Must-see: max 12 words each, iconic and unmissable places
- Hidden gems: max 12 words each, lesser-known spots locals love
Keep it enticing and make them want the full itinerary!`,
        },
        {
          role: 'user',
          content: `Create a ${days}-day trip preview for ${destination} ${travelersText} with ${budget} budget ${accommodationText} ${interestsText}. Make it exciting and create curiosity about what the full plan would include!`,
        },
      ],
      temperature: 0.85,
      max_tokens: 800,
    });

    const responseText = completion.choices[0].message.content?.trim() || '{}';

    let preview;
    try {
      preview = JSON.parse(responseText);
      // Validate structure
      if (!preview.highlights || !preview.mustSee || !preview.budgetTip || !preview.hiddenGems || !preview.estimatedCost || !preview.bestTimeToVisit) {
        throw new Error('Invalid response structure');
      }
    } catch (parseError) {
      console.error('Failed to parse teaser response:', parseError); // eslint-disable-line no-console
      throw new Error('Failed to generate preview');
    }

    return NextResponse.json(preview);
  } catch (error) {
    const err = error as Error;
    console.error('Teaser generation error:', err); // eslint-disable-line no-console
    return NextResponse.json(
      { error: 'Failed to generate preview', details: err.message },
      { status: 500 }
    );
  }
}
