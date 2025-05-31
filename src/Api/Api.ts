import axios from 'axios';
import { handleApiError } from '../utils/errorHandler';
import { Alert } from 'react-native';

const API_KEY = '10dd88179d9700ca9546d0d0c749f65e';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/';

export interface Movie {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  poster_path: string;
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

async function fetchFromTMDb<T>(endpoint: string, params: Record<string, any> = {}): Promise<T | undefined> {
  const urlParams = { api_key: API_KEY, ...params };
  const url = `${BASE_URL}${endpoint}`;

  try {
    const response = await axios.get<T>(url, { params: urlParams });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = handleApiError(`TMDb API request failed: ${error.response?.status} ${error.message}`);
      Alert.alert(message);
    } else {
      const message = handleApiError('An unexpected error occurred');
      Alert.alert(message);
    }
  }
  return undefined;
}

export function getImageUrl(path: string | null, size: string = 'w500'): string {
  if (!path) return '';
  return `${IMAGE_BASE_URL}${size}${path}`;
}

export async function getPopularMovies(page: number = 1): Promise<{ results: Movie[] }> {
  const data = await fetchFromTMDb<{ results: Movie[] }>('/movie/popular', { page });
  return data ?? { results: [] };
}

export async function getNowPlayingMovies(page: number = 1): Promise<{ results: Movie[] }> {
  const data = await fetchFromTMDb<{ results: Movie[] }>('/movie/now_playing', { page });
  return data ?? { results: [] };
}

export async function getUpcomingMovies(page: number = 1): Promise<{ results: Movie[] }> {
  const data = await fetchFromTMDb<{ results: Movie[] }>('/movie/upcoming', { page });
  return data ?? { results: [] };
}

export async function getTopRatedMovies(page: number = 1): Promise<{ results: Movie[] }> {
  const data = await fetchFromTMDb<{ results: Movie[] }>('/movie/top_rated', { page });
  return data ?? { results: [] };
}

export async function getMovieDetails(movieId: number): Promise<MovieDetails> {
  const data = await fetchFromTMDb<MovieDetails>(`/movie/${movieId}`);
  if (!data) {
    throw new Error(`Failed to fetch movie details for movieId: ${movieId}`);
  }
  return data;
}

export async function searchMovies(query: string, page: number = 1): Promise<{ results: Movie[] }> {
  if (!query) {
    return { results: [] };
  }
  const data = await fetchFromTMDb<{ results: Movie[] }>('/search/movie', { query, page });
  return data ?? { results: [] };
}

export async function getGenres(): Promise<{ genres: Genre[] }> {
  const data = await fetchFromTMDb<{ genres: Genre[] }>('/genre/movie/list');
  return data ?? { genres: [] };
}

export async function getMoviesByGenre(
  genreId: number,
  page: number = 1
): Promise<{ results: Movie[] }> {
  const data = await fetchFromTMDb<{ results: Movie[] }>('/discover/movie', {
    with_genres: genreId.toString(),
    page,
  });
  return data ?? { results: [] };
}

export async function getMovieCredits(movieId: number): Promise<{ cast: CastMember[] }> {
  const data = await fetchFromTMDb<{ cast: CastMember[] }>(`/movie/${movieId}/credits`);
  if (!data) {
    Alert.alert(`Failed to fetch movie credits for movieId: ${movieId}`);
    return { cast: [] };
  }
  return data;
}

export async function getMoviesByRating(
  ratingGte: number,
  page: number = 1
): Promise<{ results: Movie[] }> {
  const data = await fetchFromTMDb<{ results: Movie[] }>('/discover/movie', {
    'vote_average.gte': ratingGte.toString(),
    page,
    sort_by: 'vote_average.desc', 
  });
  return data ?? { results: [] };
}