import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getMovieRecommendations } from '@/lib/openai';
import { getMoviesByTitles } from '@/lib/tmdb';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { prompt } = await request.json();
    if (!prompt?.trim()) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const userId = session.user.id;

    // Check credits
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.credits <= 0) {
      return NextResponse.json({ error: 'Insufficient credits' }, { status: 402 });
    }

    // Get AI recommendations
    const titles = await getMovieRecommendations(prompt);
    if (titles.length === 0) {
      return NextResponse.json({ error: 'No recommendations found' }, { status: 500 });
    }

    // Fetch movie data from TMDB
    const movies = await getMoviesByTitles(titles);

    // Deduct credit and save search
    const [updatedUser] = await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { credits: { decrement: 1 } },
      }),
      prisma.search.create({
        data: {
          userId,
          prompt,
      results: movies as unknown as import('@prisma/client').Prisma.JsonArray,
        },
      }),
    ]);

    return NextResponse.json({ movies, creditsRemaining: updatedUser.credits });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
