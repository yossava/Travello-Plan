import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status'); // success, error, partial
    const logId = searchParams.get('logId');

    // Get specific log by ID
    if (logId) {
      const log = await prisma.openAILog.findUnique({
        where: { id: logId },
      });

      if (!log) {
        return NextResponse.json({ error: 'Log not found' }, { status: 404 });
      }

      return NextResponse.json({ log });
    }

    // Get all logs with optional filters
    const where: { status?: string } = {};
    if (status) {
      where.status = status;
    }

    const logs = await prisma.openAILog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: {
        id: true,
        planId: true,
        model: true,
        status: true,
        errorMessage: true,
        parseError: true,
        wasRepaired: true,
        completionTokens: true,
        promptTokens: true,
        totalTokens: true,
        durationMs: true,
        createdAt: true,
        // Only include full response for errors
        response: status === 'error',
        prompt: status === 'error',
      },
    });

    // Get summary stats
    const stats = await prisma.openAILog.groupBy({
      by: ['status'],
      _count: true,
    });

    const totalLogs = await prisma.openAILog.count();
    const repairedCount = await prisma.openAILog.count({
      where: { wasRepaired: true },
    });

    return NextResponse.json({
      logs,
      stats: {
        total: totalLogs,
        repaired: repairedCount,
        byStatus: stats,
      },
    });
  } catch (error) {
    console.error('Error fetching OpenAI logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch logs' },
      { status: 500 }
    );
  }
}
