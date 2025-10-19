import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateItinerary } from '@/lib/openai';

export const maxDuration = 60; // 60 seconds timeout for API route

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { planId } = await request.json();

    if (!planId) {
      return NextResponse.json(
        { error: 'Plan ID is required' },
        { status: 400 }
      );
    }

    // Fetch the plan
    const plan = await prisma.travelPlan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
    }

    // Check ownership
    if (plan.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Check if already generated
    if (plan.status === 'generated' && plan.itinerary) {
      return NextResponse.json(
        { error: 'Itinerary already generated' },
        { status: 400 }
      );
    }

    // Validate OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    // Generate itinerary
    const itinerary = await generateItinerary({
      origin: plan.origin as { country: string; city: string },
      destination: plan.destination as { country: string; city: string },
      departureDate: plan.departureDate,
      returnDate: plan.returnDate,
      duration: plan.duration,
      travelers: plan.travelers as {
        adults: number;
        children: number;
        infants: number;
      },
      budget: plan.budget as { currency: string; min: number; max: number },
      preferences: plan.preferences as {
        tripPurpose: string;
        accommodationTypes: string[];
        interests: string[];
        travelPace: string;
        dietaryRestrictions: string[];
        mustVisitPlaces?: string;
        specialRequirements?: string;
      },
    }, planId);

    // Update plan with generated itinerary
    const updatedPlan = await prisma.travelPlan.update({
      where: { id: planId },
      data: {
        itinerary: itinerary,
        status: 'generated',
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      message: 'Itinerary generated successfully',
      plan: updatedPlan,
    });
  } catch (error) {
    console.error('Generate itinerary error:', error);

    // Handle OpenAI specific errors
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { error: 'Invalid OpenAI API key' },
          { status: 500 }
        );
      }
      if (error.message.includes('rate limit')) {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please try again later.' },
          { status: 429 }
        );
      }
      if (error.message.includes('timeout')) {
        return NextResponse.json(
          { error: 'Generation timeout. Please try again.' },
          { status: 504 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to generate itinerary. Please try again.' },
      { status: 500 }
    );
  }
}
