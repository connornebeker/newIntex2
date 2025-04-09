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
    const response = await fetch(`${API_URL}/AllMovies`, {
      credentials: 'include',
    });
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
    const response = await fetch(`${API_URL}/UserRec/${username}`, {
      credentials: 'include',
    });
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
      `${API_URL}/MovieRec?title=${encodeURIComponent(title)}`,
      {
        credentials: 'include',
      }
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
      const response = await fetch(`${API_URL}/BecauseYouWatched/${username}`, {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json(); // { baseMovie, recommended }
    } catch (error) {
      console.error('Error fetching "Because You Watched" movies:', error);
      throw error;
    }
  };

export const sendMovieRating = async (
  show_id: string,
  rating: number
): Promise<void> => {
  const username = localStorage.getItem('username');
  if (!username) throw new Error('User not logged in.');

  const response = await fetch(`${API_URL}/RateMovie`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ showId: show_id, rating, username }),
    credentials: 'include',
  });

  if (!response.ok) {
    const msg = await response.text();
    throw new Error(msg || 'Failed to submit rating');
  }
};

export const fetchUserRating = async (
  showId: string
): Promise<number | null> => {
  const username = localStorage.getItem('username');
  if (!username) throw new Error('No username in localStorage');

  console.log(`Calling GET: ${API_URL}/GetRating/${username}/${showId}`);
  const response = await fetch(`${API_URL}/GetRating/${username}/${showId}`, {
    method: 'GET',
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to fetch user rating');

  const rating = await response.json();
  return parseInt(rating);
};

export const updateMovieRating = async (
  showId: string,
  rating: number
): Promise<void> => {
  const userName = localStorage.getItem('username');
  if (!userName) throw new Error('No username in localStorage');

  const response = await fetch(`${API_URL}/UpdateRating`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ showId, rating, userName }),
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to update movie rating');
  }
};
