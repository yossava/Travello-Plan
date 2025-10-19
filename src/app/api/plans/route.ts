import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/plans - Get all plans for the current user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const plans = await prisma.travelPlan.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        planName: true,
        origin: true,
        destination: true,
        departureDate: true,
        returnDate: true,
        duration: true,
        travelers: true,
        budget: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        finalizedAt: true,
      },
    });

    return NextResponse.json({ plans });
  } catch (error) {
    console.error('Get plans error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/plans - Create a new plan
const createPlanSchema = z.object({
  planName: z.string().min(1, 'Plan name is required'),
  origin: z.object({
    country: z.string().min(1, 'Origin country is required'),
    city: z.string().min(1, 'Origin city is required'),
  }),
  destination: z.object({
    country: z.string().min(1, 'Destination country is required'),
    city: z.string().min(1, 'Destination city is required'),
  }),
  departureDate: z.string().datetime(),
  returnDate: z.string().datetime(),
  duration: z.number().positive(),
  travelers: z.object({
    adults: z.number().min(1).max(10),
    children: z.number().min(0).max(10),
    infants: z.number().min(0).max(5),
  }),
  budget: z.object({
    currency: z.string().length(3),
    min: z.number().positive(),
    max: z.number().positive(),
  }),
  preferences: z.object({
    tripPurpose: z.string().min(1),
    accommodationTypes: z.array(z.string()).min(1),
    interests: z.array(z.string()).min(1),
    travelPace: z.string().min(1),
    dietaryRestrictions: z.array(z.string()),
    mustVisitPlaces: z.string().optional(),
    specialRequirements: z.string().optional(),
  }),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createPlanSchema.parse(body);

    // Validate dates
    const departure = new Date(validatedData.departureDate);
    const returnDate = new Date(validatedData.returnDate);

    if (returnDate <= departure) {
      return NextResponse.json(
        { error: 'Return date must be after departure date' },
        { status: 400 }
      );
    }

    if (validatedData.budget.max <= validatedData.budget.min) {
      return NextResponse.json(
        { error: 'Maximum budget must be greater than minimum budget' },
        { status: 400 }
      );
    }

    const plan = await prisma.travelPlan.create({
      data: {
        userId: session.user.id,
        planName: validatedData.planName,
        origin: validatedData.origin,
        destination: validatedData.destination,
        departureDate: departure,
        returnDate: returnDate,
        duration: validatedData.duration,
        travelers: validatedData.travelers,
        budget: validatedData.budget,
        preferences: validatedData.preferences,
        status: 'draft',
      },
    });

    return NextResponse.json({ plan }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Create plan error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
