import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    const watchlist = await prisma.watchlistItem.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json({ watchlist });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const { movie, status } = await request.json();

    const item = await prisma.watchlistItem.upsert({
      where: { userId_tmdbId: { userId, tmdbId: movie.id } },
      update: { status },
      create: {
        userId,
        tmdbId: movie.id,
        title: movie.title,
        posterPath: movie.posterPath,
        overview: movie.overview,
        rating: movie.rating,
        genres: movie.genres,
        status,
      },
    });

    return NextResponse.json({ item });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
