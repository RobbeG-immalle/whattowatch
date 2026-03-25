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

    const [searches, watched, watchlist] = await Promise.all([
      prisma.search.count({ where: { userId } }),
      prisma.watchlistItem.count({ where: { userId, status: 'WATCHED' } }),
      prisma.watchlistItem.count({ where: { userId, status: 'WANT_TO_WATCH' } }),
    ]);

    return NextResponse.json({ searched: searches, watched, watchlist });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
