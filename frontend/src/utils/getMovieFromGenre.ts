// fetches movies from the backend by the genre name

import { Movie } from '../types/Movie';
import fetchPoster from './fetchPoster';
export default async function getMoviesOneGenre(
  genre: string,
  page: number = 1,
  pageSize: number = 20
): Promise<Movie[]> {
  try {
    const res = await fetch(
      `https://intex-group2-7-backend-duahbmbxaggha8e2.eastus-01.azurewebsites.net/api/Movie/GetMoviesByGenre?genre=${encodeURIComponent(genre)}&page=${page}&pageSize=${pageSize}`,
      {
        credentials: 'include',
      }
    );
    if (!res.ok) {
      console.warn(`Failed to fetch movies for genre: ${genre}`);
      return [];
    }
    const movies: Movie[] = await res.json();
    const moviesWithPosters = movies.map((movie) => {
      const safeTitle = movie.title
        .normalize('NFD')
        .replace(/[:'()’!.&-]/g, '') // remove punctuation
        .trim();
      return {
        ...movie,
        posterUrl: fetchPoster(safeTitle),
      };
    });
    return moviesWithPosters;
  } catch (error) {
    console.error(`Error fetching movies for genre ${genre}:`, error);
    return [];
  }
}
