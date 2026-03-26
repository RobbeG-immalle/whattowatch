'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { Movie } from '@/types';

interface Props {
  movie: Movie;
  currentStatus?: 'WANT_TO_WATCH' | 'WATCHED' | null;
  watchlistId?: string;
  onStatusChange?: () => void;
}

export default function WatchlistButton({ movie, currentStatus, watchlistId, onStatusChange }: Props) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  const handleAdd = async (newStatus: 'WANT_TO_WATCH' | 'WATCHED') => {
    setLoading(true);
    try {
      if (status === newStatus) {
        // Remove from watchlist
        await fetch(`/api/watchlist/${watchlistId}`, { method: 'DELETE' });
        setStatus(null);
        toast.success('Removed from watchlist');
      } else if (status && watchlistId) {
        // Update status
        const res = await fetch(`/api/watchlist/${watchlistId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus }),
        });
        if (res.ok) {
          setStatus(newStatus);
          toast.success(`Moved to ${newStatus === 'WATCHED' ? 'Watched' : 'Want to Watch'}`);
        }
      } else {
        // Add to watchlist
        const res = await fetch('/api/watchlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ movie, status: newStatus }),
        });
        if (res.ok) {
          setStatus(newStatus);
          toast.success(`Added to ${newStatus === 'WATCHED' ? 'Watched' : 'Want to Watch'}`);
        }
      }
      onStatusChange?.();
    } catch {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <button
        onClick={() => handleAdd('WANT_TO_WATCH')}
        disabled={loading}
        title="Want to Watch"
        className={`p-1.5 rounded-lg backdrop-blur-sm transition-all ${
          status === 'WANT_TO_WATCH'
            ? 'bg-amber-500 text-white'
            : 'bg-black/60 text-white hover:bg-amber-500/80'
        }`}
      >
        🔖
      </button>
      <button
        onClick={() => handleAdd('WATCHED')}
        disabled={loading}
        title="Mark as Watched"
        className={`p-1.5 rounded-lg backdrop-blur-sm transition-all ${
          status === 'WATCHED'
            ? 'bg-green-500 text-white'
            : 'bg-black/60 text-white hover:bg-green-500/80'
        }`}
      >
        ✓
      </button>
    </div>
  );
}
