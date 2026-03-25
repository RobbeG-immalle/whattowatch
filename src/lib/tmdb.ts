import { Movie } from '@/types';

const TMDB_BASE_URL = process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

interface TMDBMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  vote_average: number;
  release_date: string;
  genre_ids: number[];
}

interface TMDBGenre {
  id: number;
  name: string;
}

let genreCache: Record<number, string> | null = null;

async function getGenres(): Promise<Record<number, string>> {
  if (genreCache) return genreCache;

  const response = await fetch(
    `${TMDB_BASE_URL}/genre/movie/list?api_key=${process.env.TMDB_API_KEY}&language=en-US`
  );
  const data = await response.json();
  genreCache = {};
  for (const genre of data.genres as TMDBGenre[]) {
    genreCache[genre.id] = genre.name;
  }
  return genreCache;
}

export async function searchMovieByTitle(title: string): Promise<Movie | null> {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/search/movie?api_key=${process.env.TMDB_API_KEY}&query=${encodeURIComponent(title)}&language=en-US&page=1`
    );
    const data = await response.json();

    if (!data.results || data.results.length === 0) return null;

    const movie: TMDBMovie = data.results[0];
    const genres = await getGenres();

    return {
      id: movie.id,
      title: movie.title,
      overview: movie.overview,
      posterPath: movie.poster_path ? `${TMDB_IMAGE_BASE}${movie.poster_path}` : null,
      rating: Math.round(movie.vote_average * 10) / 10,
      releaseYear: movie.release_date ? movie.release_date.split('-')[0] : 'N/A',
      genres: movie.genre_ids.map((id) => genres[id]).filter(Boolean),
    };
  } catch (error) {
    console.error('TMDB search error:', error);
    return null;
  }
}

export async function getMoviesByTitles(titles: string[]): Promise<Movie[]> {
  const moviePromises = titles.map((title) => searchMovieByTitle(title));
  const movies = await Promise.all(moviePromises);
  return movies.filter((m): m is Movie => m !== null);
}
