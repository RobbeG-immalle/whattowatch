'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Image from 'next/image';

interface Stats {
  searched: number;
  watched: number;
  watchlist: number;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [credits, setCredits] = useState<number | null>(null);
  const [stats, setStats] = useState<Stats>({ searched: 0, watched: 0, watchlist: 0 });

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetch('/api/credits').then((r) => r.json()).then((d) => setCredits(d.credits));
      fetch('/api/profile/stats').then((r) => r.json()).then((d) => setStats(d));
    }
  }, [session]);

  if (status === 'loading') return null;

  return (
    <div className="min-h-screen bg-[#0a0f1e]">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-white mb-8">Profile</h1>

        <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 mb-6">
          <div className="flex items-center gap-6 mb-6">
            {session?.user?.image ? (
              <Image
                src={session.user.image}
                alt="Avatar"
                width={72}
                height={72}
                className="rounded-full"
              />
            ) : (
              <div className="bg-amber-500 rounded-full flex items-center justify-center text-black text-2xl font-bold w-[72px] h-[72px]">
                {session?.user?.name?.[0] ?? session?.user?.email?.[0] ?? '?'}
              </div>
            )}
            <div>
              <h2 className="text-xl font-bold text-white">{session?.user?.name || 'User'}</h2>
              <p className="text-slate-400">{session?.user?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-700 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-amber-400">{credits ?? '...'}</div>
              <div className="text-slate-400 text-sm mt-1">Credits</div>
            </div>
            <div className="bg-slate-700 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-amber-400">{stats.searched}</div>
              <div className="text-slate-400 text-sm mt-1">Searches</div>
            </div>
            <div className="bg-slate-700 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-amber-400">{stats.watched}</div>
              <div className="text-slate-400 text-sm mt-1">Watched</div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => router.push('/credits')}
            className="w-full bg-slate-800 border border-slate-700 hover:border-amber-500/50 text-white py-4 rounded-xl flex items-center justify-between px-6 transition-colors"
          >
            <span className="flex items-center gap-3">
              <span>⚡</span>
              <span>Buy Credits</span>
            </span>
            <span className="text-slate-400">→</span>
          </button>
          <button
            onClick={() => router.push('/watchlist')}
            className="w-full bg-slate-800 border border-slate-700 hover:border-amber-500/50 text-white py-4 rounded-xl flex items-center justify-between px-6 transition-colors"
          >
            <span className="flex items-center gap-3">
              <span>🔖</span>
              <span>My Watchlist</span>
            </span>
            <span className="text-slate-400">→</span>
          </button>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="w-full bg-red-500/10 border border-red-500/30 hover:border-red-500/60 text-red-400 py-4 rounded-xl transition-colors"
          >
            Sign Out
          </button>
        </div>
      </main>
    </div>
  );
}
