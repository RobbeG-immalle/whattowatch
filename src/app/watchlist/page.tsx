'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { WatchlistItem } from '@/types';
import Image from 'next/image';
import toast from 'react-hot-toast';

export default function WatchlistPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [activeTab, setActiveTab] = useState<'WANT_TO_WATCH' | 'WATCHED'>('WANT_TO_WATCH');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
  }, [status, router]);

  const fetchWatchlist = useCallback(async () => {
    const res = await fetch('/api/watchlist');
    const data = await res.json();
    setItems(data.watchlist || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (session) fetchWatchlist();
  }, [session, fetchWatchlist]);

  const handleRemove = async (id: string) => {
    await fetch(`/api/watchlist/${id}`, { method: 'DELETE' });
    setItems((prev) => prev.filter((i) => i.id !== id));
    toast.success('Removed from watchlist');
  };

  const handleMove = async (id: string, newStatus: 'WANT_TO_WATCH' | 'WATCHED') => {
    await fetch(`/api/watchlist/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status: newStatus } : i)));
    toast.success(`Moved to ${newStatus === 'WATCHED' ? 'Watched' : 'Want to Watch'}`);
  };

  const filtered = items.filter((i) => i.status === activeTab);

  return (
    <div className="min-h-screen bg-[#0a0f1e]">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-white mb-2">My Watchlist</h1>
        <p className="text-slate-400 mb-8">
          {items.filter((i) => i.status === 'WANT_TO_WATCH').length} to watch ·{' '}
          {items.filter((i) => i.status === 'WATCHED').length} watched
        </p>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setActiveTab('WANT_TO_WATCH')}
            className={`px-6 py-2.5 rounded-lg font-semibold transition-colors ${
              activeTab === 'WANT_TO_WATCH'
                ? 'bg-amber-500 text-black'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            🔖 Want to Watch ({items.filter((i) => i.status === 'WANT_TO_WATCH').length})
          </button>
          <button
            onClick={() => setActiveTab('WATCHED')}
            className={`px-6 py-2.5 rounded-lg font-semibold transition-colors ${
              activeTab === 'WATCHED'
                ? 'bg-green-500 text-black'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            ✓ Watched ({items.filter((i) => i.status === 'WATCHED').length})
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700">
                <div className="aspect-[2/3] skeleton" />
                <div className="p-4 space-y-2">
                  <div className="h-4 skeleton w-3/4" />
                  <div className="h-3 skeleton w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">{activeTab === 'WANT_TO_WATCH' ? '🔖' : '✅'}</div>
            <p className="text-slate-400 text-lg">
              {activeTab === 'WANT_TO_WATCH'
                ? 'No movies in your watchlist yet'
                : 'No watched movies yet'}
            </p>
            <button
              onClick={() => router.push('/dashboard')}
              className="mt-4 bg-amber-500 text-black font-bold px-6 py-2 rounded-lg hover:bg-amber-400 transition-colors"
            >
              Search Movies
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 hover:border-amber-500/50 transition-all group"
              >
                <div className="relative aspect-[2/3] bg-slate-700">
                  {item.posterPath ? (
                    <Image
                      src={item.posterPath}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-500 text-4xl">🎬</div>
                  )}
                  {item.rating && (
                    <div className="absolute bottom-2 left-2 bg-black/80 text-amber-400 text-xs font-bold px-2 py-1 rounded-lg">
                      ⭐ {item.rating.toFixed(1)}
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="font-bold text-white text-sm line-clamp-1 mb-2">{item.title}</h3>
                  <div className="flex gap-1">
                    {activeTab === 'WANT_TO_WATCH' ? (
                      <button
                        onClick={() => handleMove(item.id, 'WATCHED')}
                        className="flex-1 text-xs bg-green-500/20 text-green-400 hover:bg-green-500/30 py-1.5 rounded-lg transition-colors"
                      >
                        ✓ Mark Watched
                      </button>
                    ) : (
                      <button
                        onClick={() => handleMove(item.id, 'WANT_TO_WATCH')}
                        className="flex-1 text-xs bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 py-1.5 rounded-lg transition-colors"
                      >
                        🔖 Want to Watch
                      </button>
                    )}
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="text-xs bg-red-500/20 text-red-400 hover:bg-red-500/30 px-2 py-1.5 rounded-lg transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
