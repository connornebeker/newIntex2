import { Movie } from '../types/Movie';
import fetchPoster from './fetchPoster';

export default async function getMoviesOneGenre(searchTerm: string, page: number = 1, pageSize: number = 20): Promise<Movie[]> {
  try {
    const res = await fetch(
        `https://localhost:5000/api/movie/search?q=${encodeURIComponent(searchTerm)}&page=${page}&pageSize=${pageSize}`,
      {
        credentials: 'include',
      }
    );

    if (!res.ok) {
      console.warn(`Failed to fetch results for search: ${searchTerm}`);
      return [];
    }

    const data = await res.json();
    console.log('Backend response:', data);  // Log the response to see its structure

    // Check if the response contains 'movies' and is an array
    if (Array.isArray(data.movies)) {
      const moviesWithPosters = data.movies.map((movie: any) => {
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
    } else {
      console.error('Invalid response format: movies is not an array');
      return [];
    }
  } catch (error) {
    console.error(`Error fetching results for search ${searchTerm}:`, error);
    return [];
  }
}


// import { Movie } from '../types/Movie';
// import fetchPoster from './fetchPoster';
// export default async function getMoviesOneGenre(searchTerm: string, page: number = 1, pageSize: number = 20): Promise<Movie[]> {
//   try {
//     const res = await fetch(
//         `https://localhost:5000/api/movie/search?q=${encodeURIComponent(searchTerm)}&page=${page}&pageSize=${pageSize}`,
//       {
//         credentials: 'include',
//       }

//     );
//     if (!res.ok) {
//       console.warn(`Failed to fetch results for search: ${searchTerm}`);
//       return [];
//     }
//     const movies: Movie[] = await res.json();
//     const moviesWithPosters = movies.map((movie) => {
//       const safeTitle = movie.title
//         .normalize('NFD')
//         .replace(/[:'()’!.&-]/g, '') // remove punctuation
//         .trim();
//       return {
//         ...movie,
//         posterUrl: fetchPoster(safeTitle),
//       };
//     });
//     return moviesWithPosters;
//   } catch (error) {
//     console.error(`Error fetching results for search ${searchTerm}:`, error);
//     return [];
//   }
// }
