'use client';

import Image from 'next/image';
import { Movie } from '@/types';
import WatchlistButton from './WatchlistButton';

interface Props {
  movie: Movie;
  watchlistStatus?: 'WANT_TO_WATCH' | 'WATCHED' | null;
  watchlistId?: string;
  onWatchlistChange?: () => void;
}

export default function MovieCard({ movie, watchlistStatus, watchlistId, onWatchlistChange }: Props) {
  return (
    <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 hover:border-amber-500/50 transition-all hover:shadow-lg hover:shadow-amber-900/20 group">
      <div className="relative aspect-[2/3] bg-slate-700">
        {movie.posterPath ? (
          <Image
            src={movie.posterPath}
            alt={movie.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-slate-500">
            <span className="text-5xl">🎬</span>
          </div>
        )}
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          <WatchlistButton
            movie={movie}
            currentStatus={watchlistStatus}
            watchlistId={watchlistId}
            onStatusChange={onWatchlistChange}
          />
        </div>
        {movie.rating > 0 && (
          <div className="absolute bottom-2 left-2 bg-black/80 text-amber-400 text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1">
            ⭐ {movie.rating.toFixed(1)}
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-white text-sm leading-tight mb-1 line-clamp-2">
          {movie.title}
        </h3>
        <p className="text-slate-400 text-xs mb-2">{movie.releaseYear}</p>
        <div className="flex flex-wrap gap-1 mb-2">
          {movie.genres.slice(0, 2).map((genre) => (
            <span
              key={genre}
              className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full"
            >
              {genre}
            </span>
          ))}
        </div>
        <p className="text-slate-400 text-xs line-clamp-3">{movie.overview}</p>
      </div>
    </div>
  );
}
