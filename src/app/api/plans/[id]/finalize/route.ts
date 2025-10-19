import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// POST /api/plans/:id/finalize - Finalize a plan
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const plan = await prisma.travelPlan.findUnique({
      where: { id: params.id },
    });

    if (!plan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
    }

    // Check ownership
    if (plan.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Check if plan has an itinerary
    if (!plan.itinerary) {
      return NextResponse.json(
        { error: 'Cannot finalize plan without itinerary' },
        { status: 400 }
      );
    }

    // Check if already finalized
    if (plan.status === 'finalized') {
      return NextResponse.json(
        { error: 'Plan is already finalized' },
        { status: 400 }
      );
    }

    const updatedPlan = await prisma.travelPlan.update({
      where: { id: params.id },
      data: {
        status: 'finalized',
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ plan: updatedPlan });
  } catch (error) {
    console.error('Finalize plan error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
