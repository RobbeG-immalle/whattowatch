'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import SearchBar from '@/components/SearchBar';
import MovieCard from '@/components/MovieCard';
import MovieCardSkeleton from '@/components/MovieCardSkeleton';
import { Movie } from '@/types';
import toast from 'react-hot-toast';

interface SearchHistory {
  id: string;
  prompt: string;
  results: Movie[];
  createdAt: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [credits, setCredits] = useState<number | null>(null);
  const [history, setHistory] = useState<SearchHistory[]>([]);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [showNoCredits, setShowNoCredits] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchCredits();
      fetchHistory();
    }
  }, [session]);

  const fetchCredits = async () => {
    const res = await fetch('/api/credits');
    const data = await res.json();
    setCredits(data.credits);
  };

  const fetchHistory = async () => {
    const res = await fetch('/api/search/history');
    const data = await res.json();
    setHistory(data.searches || []);
  };

  const handleSearch = async (prompt: string) => {
    if (credits !== null && credits <= 0) {
      setShowNoCredits(true);
      return;
    }
    setLoading(true);
    setCurrentPrompt(prompt);
    setMovies([]);
    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (res.ok) {
        setMovies(data.movies);
        setCredits(data.creditsRemaining);
        fetchHistory();
      } else if (res.status === 402) {
        setShowNoCredits(true);
      } else {
        toast.error(data.error || 'Search failed');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center">
        <div className="text-amber-400 text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f1e]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            What do you want to watch?
          </h1>
          <p className="text-slate-400">
            Describe the movie you&apos;re in the mood for and AI will find it for you
          </p>
          {credits !== null && (
            <p className="text-amber-400 text-sm mt-2">
              ⚡ {credits} search {credits === 1 ? 'credit' : 'credits'} remaining
            </p>
          )}
        </div>

        {/* Search */}
        <SearchBar onSearch={handleSearch} loading={loading} />

        {/* No credits modal */}
        {showNoCredits && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
            <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 max-w-sm w-full text-center">
              <div className="text-5xl mb-4">⚡</div>
              <h2 className="text-xl font-bold text-white mb-2">No Credits Left</h2>
              <p className="text-slate-400 mb-6">Purchase more credits to continue searching for movies.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowNoCredits(false)}
                  className="flex-1 bg-slate-700 text-white py-3 rounded-lg hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => router.push('/credits')}
                  className="flex-1 bg-amber-500 text-black font-bold py-3 rounded-lg hover:bg-amber-400 transition-colors"
                >
                  Buy Credits
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading skeletons */}
        {loading && (
          <div className="mt-10">
            <p className="text-slate-400 text-center mb-6">
              🤖 AI is finding movies for &ldquo;{currentPrompt}&rdquo;...
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {[...Array(6)].map((_, i) => (
                <MovieCardSkeleton key={i} />
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {!loading && movies.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-bold text-white mb-4">
              Results for &ldquo;{currentPrompt}&rdquo;
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </div>
        )}

        {/* Recent Searches */}
        {!loading && movies.length === 0 && history.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold text-white mb-4">Recent Searches</h2>
            <div className="space-y-6">
              {history.slice(0, 3).map((search) => (
                <div key={search.id}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-slate-300 text-sm">
                      &ldquo;{search.prompt}&rdquo;
                    </h3>
                    <span className="text-slate-500 text-xs">
                      {new Date(search.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {(search.results as Movie[]).slice(0, 5).map((movie) => (
                      <MovieCard key={movie.id} movie={movie} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && movies.length === 0 && history.length === 0 && (
          <div className="mt-20 text-center">
            <div className="text-6xl mb-4">🎬</div>
            <p className="text-slate-400 text-lg">Search for movies to get started!</p>
            <p className="text-slate-500 text-sm mt-2">Try: &ldquo;A thriller with a twist ending&rdquo;</p>
          </div>
        )}
      </main>
    </div>
  );
}
