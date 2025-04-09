import { LikedMovie } from '../types/LikedMovie';
import { Movie } from '../types/Movie';

interface FetchMoviesResponse {
  movies: Movie[];
}

interface BecauseYouWatchedResponse {
  baseMovie: LikedMovie;
  recommended: Movie[];
}

const API_URL = 'https://localhost:5000/api/Movie';

const getUsername = (): string => {
  const username = localStorage.getItem('username');
  if (!username) throw new Error('No username found in localStorage');
  return username;
};

export const fetchAllMovies = async (): Promise<FetchMoviesResponse> => {
  try {
    const response = await fetch(`${API_URL}/AllMovies`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching all movies:', error);
    throw error;
  }
};

// ✅ Fetch recommendations based on user login (username from localStorage)
export const fetchUserRecommendedMovies = async (): Promise<Movie[]> => {
  try {
    const username = getUsername();
    const response = await fetch(`${API_URL}/UserRec/${username}`);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error('Error fetching user recommended movies:', error);
    throw error;
  }
};

export const fetchRecommendedMovies = async (
  title: string
): Promise<FetchMoviesResponse> => {
  try {
    const response = await fetch(
      `${API_URL}/MovieRec?title=${encodeURIComponent(title)}`
    );
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching recommended movies:', error);
    throw error;
  }
};

// ✅ Fetch "Because You Watched..." recs (username from localStorage)
export const fetchBecauseYouWatchedMovies =
  async (): Promise<BecauseYouWatchedResponse> => {
    try {
      const username = getUsername();
      const response = await fetch(`${API_URL}/BecauseYouWatched/${username}`);
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json(); // { baseMovie, recommended }
    } catch (error) {
      console.error('Error fetching "Because You Watched" movies:', error);
      throw error;
    }
  };
