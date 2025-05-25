const API_KEY = '10dd88179d9700ca9546d0d0c749f65e';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/';

export interface Movie {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  poster_path: string ;
  genre_ids: Genre[];
  backdrop_path?: string | null;
  vote_average: number;
}

export interface MovieDetails extends Movie {
  genres: { id: number; name: string }[];
  runtime: number;
  status: string;
  tagline: string;
  homepage: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface Person {
  id: number;
  name: string;
  profile_path: string | null;
  known_for_department: string;
}

export interface CastMember {
  id: number;
  name: string;
  profile_path: string | null;
  character: string;
}

async function fetchFromTMDb<T>(endpoint: string, params: Record<string, any> = {}): Promise<T> {
  const urlParams = new URLSearchParams({ api_key: API_KEY, ...params });
  const url = `${BASE_URL}${endpoint}?${urlParams.toString()}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`TMDb API request failed: ${response.status} ${response.statusText}`);
  }
  const data = await response.json();
  return data as T;
}

export function getImageUrl(path: string | null, size: string = 'w500'): string  {
  if (!path) return '';
  return `${IMAGE_BASE_URL}${size}${path}`;
}

export async function getPopularMovies(page: number = 1): Promise<{ results: Movie[] }> {
  try {
    return await fetchFromTMDb<{ results: Movie[] }>('/movie/popular', { page });
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    throw error;
  }
}

export async function getNowPlayingMovies(page: number = 1): Promise<{ results: Movie[] }> {
  try {
    return await fetchFromTMDb<{ results: Movie[] }>('/movie/now_playing', { page });
  } catch (error) {
    console.error('Error fetching now playing movies:', error);
    throw error;
  }
}

export async function getUpcomingMovies(page: number = 1): Promise<{ results: Movie[] }> {
  try {
    return await fetchFromTMDb<{ results: Movie[] }>('/movie/upcoming', { page });
  } catch (error) {
    console.error('Error fetching upcoming movies:', error);
    throw error;
  }
}

export async function getTopRatedMovies(page: number = 1): Promise<{ results: Movie[] }> {
  try {
    return await fetchFromTMDb<{ results: Movie[] }>('/movie/top_rated', { page });
  } catch (error) {
    console.error('Error fetching top rated movies:', error);
    throw error;
  }
}

export async function getMovieDetails(movieId: number): Promise<MovieDetails> {
  try {
    return await fetchFromTMDb<MovieDetails>(`/movie/${movieId}`);
  } catch (error) {
    console.error(`Error fetching movie details for id ${movieId}:`, error);
    throw error;
  }
}

export async function searchMovies(query: string, page: number = 1): Promise<{ results: Movie[] }> {
  if (!query) {
    return { results: [] };
  }
  try {
    return await fetchFromTMDb<{ results: Movie[] }>('/search/movie', { query, page });
  } catch (error) {
    console.error(`Error searching movies with query "${query}":`, error);
    throw error;
  }
}

export async function getGenres(): Promise<{ genres: Genre[] }> {
  try {
    return await fetchFromTMDb<{ genres: Genre[] }>('/genre/movie/list');
  } catch (error) {
    console.error('Error fetching genres:', error);
    throw error;
  }
}

export async function getMoviesByGenre(
  genreId: number,
  page: number = 1
): Promise<{ results: Movie[] }> {
  try {
    return await fetchFromTMDb<{ results: Movie[] }>('/discover/movie', {
      with_genres: genreId.toString(),
      page,
    });
  } catch (error) {
    console.error(`Error fetching movies by genre ${genreId}:`, error);
    throw error;
  }
}

export async function getMoviesByRating(
  ratingGte: number,
  page: number = 1
): Promise<{ results: Movie[] }> {
  try {
    return await fetchFromTMDb<{ results: Movie[] }>('/discover/movie', {
      'vote_average.gte': ratingGte.toString(),
      page,
      sort_by: 'vote_average.desc', // sort to prioritize high ratings
    });
  } catch (error) {
    console.error(`Error fetching movies with rating >= ${ratingGte}:`, error);
    throw error;
  }
}


export async function getMovieCredits(movieId: number): Promise<{ cast: CastMember[] }> {
  return fetchFromTMDb<{ cast: CastMember[] }>(`/movie/${movieId}/credits`);
}


