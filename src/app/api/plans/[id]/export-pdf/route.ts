import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateBeautifulPDF } from '@/lib/pdfGeneratorServer';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Fetch the travel plan
    const plan = await prisma.travelPlan.findUnique({
      where: {
        id: params.id,
        userId: user.id,
      },
    });

    if (!plan) {
      return NextResponse.json(
        { error: 'Travel plan not found' },
        { status: 404 }
      );
    }

    // Check if itinerary exists (allow both 'generated' and 'completed' status)
    if (!plan.itinerary) {
      return NextResponse.json(
        { error: 'No itinerary available. Please generate an itinerary first.' },
        { status: 400 }
      );
    }

    if (plan.status === 'draft' || plan.status === 'pending') {
      return NextResponse.json(
        { error: 'Travel plan is still in progress. Please wait for itinerary generation to complete.' },
        { status: 400 }
      );
    }

    // Prepare data for PDF generation
    const pdfData = {
      planName: plan.planName,
      origin: plan.origin as { country: string; city: string },
      destination: plan.destination as { country: string; city: string },
      departureDate: plan.departureDate.toISOString(),
      returnDate: plan.returnDate.toISOString(),
      duration: plan.duration,
      travelers: plan.travelers as {
        adults: number;
        children: number;
        infants: number;
      },
      budget: plan.budget as { currency: string; min: number; max: number },
      itinerary: plan.itinerary as any, // eslint-disable-line @typescript-eslint/no-explicit-any
    };

    // Generate PDF
    const pdfBuffer = await generateBeautifulPDF(pdfData);

    // Create filename
    const filename = `${plan.planName.replace(/[^a-z0-9]/gi, '_')}_Travel_Plan.pdf`;

    // Convert Buffer to Uint8Array for Response
    const uint8Array = new Uint8Array(pdfBuffer);

    // Return PDF with proper headers
    return new Response(uint8Array, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });
  } catch (error) {
    const err = error as Error;
    console.error('PDF generation error:', err); // eslint-disable-line no-console
    console.error('Error stack:', err.stack); // eslint-disable-line no-console
    return NextResponse.json(
      { error: 'Failed to generate PDF', details: err.message },
      { status: 500 }
    );
  }
}
