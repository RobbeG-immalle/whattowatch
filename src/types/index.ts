export interface Movie {
  id: number;
  title: string;
  overview: string;
  posterPath: string | null;
  rating: number;
  releaseYear: string;
  genres: string[];
}

export interface WatchlistItem {
  id: string;
  tmdbId: number;
  title: string;
  posterPath: string | null;
  overview: string | null;
  rating: number | null;
  genres: string[] | null;
  status: 'WANT_TO_WATCH' | 'WATCHED';
  createdAt: string;
  updatedAt: string;
}

export interface SearchResult {
  id: string;
  prompt: string;
  results: Movie[];
  createdAt: string;
}

export interface CreditPackage {
  id: string;
  credits: number;
  price: number;
  label: string;
}
