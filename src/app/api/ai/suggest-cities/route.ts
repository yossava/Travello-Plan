import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { country } = await request.json();

    if (!country) {
      return NextResponse.json(
        { error: 'Country is required' },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are a travel expert. When given a country name, suggest 6-8 popular tourist cities/destinations in that country with brief descriptions. Return ONLY a JSON array of objects with "name" and "description" fields. The description should be one concise sentence (max 15 words) about what the city is known for or what to expect. Format: [{"name": "City1", "description": "Known for..."}, {"name": "City2", "description": "Famous for..."}]`,
        },
        {
          role: 'user',
          content: `Suggest popular tourist cities in ${country} with brief descriptions`,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const responseText = completion.choices[0].message.content?.trim() || '[]';

    // Parse the JSON response
    let cities: Array<{ name: string; description: string }> = [];
    try {
      cities = JSON.parse(responseText);
      // Validate the structure
      if (!Array.isArray(cities) || !cities.every(c => c.name && c.description)) {
        throw new Error('Invalid response format');
      }
    } catch (parseError) {
      console.error('Failed to parse city suggestions:', parseError); // eslint-disable-line no-console
      throw new Error('Failed to parse city suggestions');
    }

    return NextResponse.json({ cities });
  } catch (error) {
    const err = error as Error;
    console.error('City suggestion error:', err); // eslint-disable-line no-console
    return NextResponse.json(
      { error: 'Failed to generate city suggestions', details: err.message },
      { status: 500 }
    );
  }
}
